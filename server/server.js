'use strict';
// Servidor de Hablemos para Telegram.
// - El token del bot vive solo acá, como variable de entorno (TELEGRAM_TOKEN): nunca llega a los teléfonos.
// - Telegram avisa cada mensaje nuevo por webhook, así se guardan aunque Hablemos esté cerrada.
// - La app se conecta con un PIN (HABLEMOS_PIN) desde cualquier navegador o teléfono, incluso varios a la vez.
// Sin dependencias: solo Node.js 18 o más nuevo.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Avisos push (notificaciones del teléfono aunque Hablemos esté cerrada). Si la librería falta, el resto sigue funcionando.
let webpush = null;
try { webpush = require('web-push'); } catch (e) { console.warn('web-push no está instalado: no habrá notificaciones push.'); }

// Corrige errores comunes al pegar el token: comillas, espacios o saltos de línea, y la palabra «bot» delante.
const RAW_TOKEN = process.env.TELEGRAM_TOKEN || '';
const TOKEN = RAW_TOKEN.replace(/\s+/g, '').replace(/^["'`]+|["'`]+$/g, '').replace(/^bot(?=\d)/i, '');
// Describe qué tiene de raro el token, sin mostrarlo nunca.
function tokenProblem() {
  if (!RAW_TOKEN.trim()) return 'TELEGRAM_TOKEN está vacío.';
  if (/^\d{6,15}:[\w-]{30,60}$/.test(TOKEN)) return '';
  if (/^\d{6,15}:[\w-]{30,60}$/.test(PIN)) return 'Las variables están invertidas: el token quedó en HABLEMOS_PIN. Poné el token en TELEGRAM_TOKEN y el PIN en HABLEMOS_PIN.';
  if (!TOKEN.includes(':')) return 'TELEGRAM_TOKEN no tiene los dos puntos (:). Tiene que tener la forma 123456789:AAH… tal como lo da @BotFather.';
  return `TELEGRAM_TOKEN no tiene la forma 123456789:AAH… (tiene ${TOKEN.length} caracteres). Pegá solo el token, sin otras palabras del mensaje de @BotFather.`;
}
const PIN = (process.env.HABLEMOS_PIN || '').trim();
const PORT = Number(process.env.PORT) || 3000;
const TG_API = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '');
const PUBLIC_URL = (process.env.PUBLIC_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? 'https://' + process.env.RAILWAY_PUBLIC_DOMAIN : '')).replace(/\/$/, '');
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || path.join(__dirname, 'data');
const PERSISTENT = !!(process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR);
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://ideasdesign.github.io,http://localhost:8765,http://127.0.0.1:8765')
  .split(',').map(s => s.trim()).filter(Boolean);
// Clave que Telegram manda en cada aviso, para que nadie más pueda inyectar mensajes falsos.
const WEBHOOK_SECRET = crypto.createHash('sha256').update('hablemos-webhook:' + TOKEN).digest('hex').slice(0, 48);
const FILE = path.join(DATA_DIR, 'hablemos.json');
const MAX_MESSAGES = 3000;
const MAX_PENDING = 30;
const LONG_POLL_MS = 25000;

// ---------- Datos (archivo JSON en el volumen persistente) ----------
// people[chatId] = {chatId, name, username, status: 'pending' | 'linked', since, held?: mensajes que esperan aprobación}
// invite = código del enlace de invitación: quien entra con él queda conectado solo.
const newInvite = () => crypto.randomBytes(9).toString('base64url');
// vapid = claves para firmar los avisos push; pushSubs = teléfonos que pidieron recibir avisos.
let db = { seq: 0, pv: 0, people: {}, messages: [], invite: newInvite(), vapid: null, pushSubs: [] };
function load() {
  try {
    const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (d && typeof d === 'object') {
      db = {
        seq: Number.isInteger(d.seq) ? d.seq : 0,
        pv: Number.isInteger(d.pv) ? d.pv : 0,
        people: d.people && typeof d.people === 'object' ? d.people : {},
        messages: Array.isArray(d.messages) ? d.messages : [],
        invite: typeof d.invite === 'string' && /^[\w-]{8,64}$/.test(d.invite) ? d.invite : newInvite(),
        vapid: d.vapid && typeof d.vapid.publicKey === 'string' && typeof d.vapid.privateKey === 'string' ? d.vapid : null,
        pushSubs: Array.isArray(d.pushSubs) ? d.pushSubs.filter(validSub).slice(0, 20) : []
      };
    }
  } catch (e) { /* primer arranque: no hay archivo todavía */ }
}
function writeNow() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, FILE);
  } catch (e) { console.error('No se pudo guardar los datos:', e.message); }
}
// Guarda enseguida (agrupando los cambios de un mismo instante), para no perder mensajes si el servidor se reinicia.
let saveQueued = false;
function save() { if (saveQueued) return; saveQueued = true; setImmediate(() => { saveQueued = false; writeNow(); }); }

// ---------- Avisos a la app (long polling) ----------
const waiters = new Set();
function wake() { for (const w of [...waiters]) w(); }
function addMessage(m) {
  db.seq++;
  const msg = { seq: db.seq, ...m };
  db.messages.push(msg);
  if (db.messages.length > MAX_MESSAGES) db.messages.splice(0, db.messages.length - MAX_MESSAGES);
  save(); wake();
  return msg;
}
function touchPeople() { db.pv++; save(); wake(); }

// ---------- Respuestas sugeridas con inteligencia artificial (opcional) ----------
// Solo funciona si en Railway está la variable ANTHROPIC_API_KEY. Sin ella, la app usa sus respuestas por reglas.
// Privacidad: a Claude se le mandan solo los últimos mensajes de esa conversación, sin nombres ni números de teléfono.
let AnthropicSDK = null;
try { AnthropicSDK = require('@anthropic-ai/sdk').default; } catch (e) { console.warn('@anthropic-ai/sdk no está instalado: sin sugerencias con IA.'); }
const AI_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const AI_MODEL = (process.env.CLAUDE_MODEL || 'claude-opus-5-5').trim();
// La reubicación automática ante un rechazo de seguridad está disponible en estos modelos.
const AI_FALLBACKS = /^claude-(opus-5|opus-5-5|fable-5-1|sonnet-5-5)$/.test(AI_MODEL);
const ai = AnthropicSDK && AI_KEY ? new AnthropicSDK({ apiKey: AI_KEY, timeout: 25000, maxRetries: 1 }) : null;
const AI_SYSTEM = `Ayudás a una persona que no puede hablar ni escribir a responder mensajes de Telegram. Elige su respuesta tocando un botón grande, así que necesita opciones listas para mandar.

Vas a recibir los últimos mensajes de una conversación entre esa persona ("Yo") y un familiar o amigo ("La otra persona"). Proponé 6 respuestas que "Yo" podría querer mandar al último mensaje de la otra persona.

Cómo tienen que ser las respuestas:
- En español rioplatense (con "vos"), en primera persona, dichas por "Yo".
- Cortas: de 1 a 8 palabras.
- Distintas entre sí, cubriendo opciones diferentes: por ejemplo sí y no, varias horas o días posibles, cómo se siente, pedir que le expliquen o dejarlo para después.
- Si preguntan algo que solo "Yo" sabe (una hora, un lugar, una preferencia), ofrecé varias opciones posibles en vez de elegir una.
- Naturales y cálidas, como hablaría una persona adulta con su familia. Sin emojis.
- No respondas el mensaje vos: devolvé solamente las opciones.`;
// V2.0: completar frases. Diego toca algunas palabras y la IA propone frases enteras que empiezan así.
const AI_COMPLETE_SYSTEM = `Ayudás a una persona adulta que no puede hablar ni escribir. Arma lo que quiere decir tocando palabras sueltas en botones grandes, y tocar le cuesta mucho, así que le ofrecés frases completas para elegir con un solo toque.

Vas a recibir las palabras que eligió hasta ahora, en orden. A veces también recibís el último mensaje que le mandó un familiar, como contexto.

Proponé 4 frases completas que esa persona probablemente quiere decir:
- Que empiecen con esas palabras (podés corregir la concordancia o agregar lo que falte entre ellas) y las completen de forma natural.
- En español rioplatense (con "vos"), en primera persona, como habla un adulto con su familia o su cuidador.
- Cortas: de 3 a 12 palabras, con la puntuación correcta (¿…? si es pregunta).
- Distintas entre sí: cosas diferentes que podría querer, no la misma idea con otras palabras.
- Si hay un mensaje de un familiar y las palabras parecen responderle, que las frases vengan al caso.
- Sin emojis. Devolvé solamente las frases.`;
const completeCache = new Map(); // palabras + contexto → frases (para no volver a pedir lo mismo)
async function completePhrases(words, context) {
  const key = words.toLocaleLowerCase('es') + '|' + (context ? context.seq : '');
  if (completeCache.has(key)) return { phrases: completeCache.get(key), cached: true };
  const now = Date.now();
  while (aiCalls.length && now - aiCalls[0] > 3600e3) aiCalls.shift();
  if (aiCalls.length >= 60) throw Object.assign(new Error('limit'), { code: 'ai-limit' });
  aiCalls.push(now);
  const request = {
    model: AI_MODEL,
    max_tokens: 3000,
    system: AI_COMPLETE_SYSTEM,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: { type: 'object', properties: { phrases: { type: 'array', items: { type: 'string' } } }, required: ['phrases'], additionalProperties: false } }
    },
    messages: [{ role: 'user', content: (context ? `Último mensaje del familiar: «${context.text.slice(0, 400)}»\n\n` : '') + `Palabras elegidas hasta ahora: «${words}»` }]
  };
  if (AI_FALLBACKS) { request.betas = ['server-side-fallback-2026-07-01']; request.fallbacks = 'default'; }
  const response = await ai.beta.messages.create(request);
  let phrases = [];
  if (response.stop_reason !== 'refusal') {
    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    try { phrases = JSON.parse(text).phrases; } catch (e) { phrases = []; }
  }
  phrases = [...new Set((Array.isArray(phrases) ? phrases : []).filter(r => typeof r === 'string').map(r => r.trim()).filter(r => r && r.length <= 140))].slice(0, 4);
  completeCache.set(key, phrases);
  if (completeCache.size > 300) completeCache.delete(completeCache.keys().next().value);
  console.log(`Frases completadas con IA: ${phrases.length} (modelo ${response.model}, ${response.usage.input_tokens} tokens de entrada + ${response.usage.output_tokens} de salida).`);
  return { phrases };
}
let lastHelpAt = 0, lastHelpSent = 0;
// ---------- Voz natural con ElevenLabs (opcional) ----------
// La clave vive solo acá (ELEVENLABS_API_KEY). Cada frase se genera una sola vez y se guarda en el disco,
// así las frases repetidas no gastan créditos. Si falla, la app usa sola la voz del teléfono.
const TTS_KEY = (process.env.ELEVENLABS_API_KEY || '').replace(/\s+/g, '');
const TTS_API = (process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io').replace(/\/$/, '');
const TTS_MODEL = (process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5').trim();
const TTS_VOICES = {
  diego: (process.env.ELEVENLABS_VOICE_DIEGO || 'cjVigY5qzO86Huf0OWal').trim(), // «Eric», voz incluida en el plan gratis (las de la biblioteca, como «Diego», piden plan pago por API)
  family: (process.env.ELEVENLABS_VOICE_FAMILY || 'EXAVITQu4vr4xnSDxMaL').trim() // «Sarah», incluida en el plan gratis: lee los mensajes de la familia y los avisos (poné «telefono» para usar la voz del teléfono)
};
const TTS_DIR = path.join(DATA_DIR, 'voz');
const TTS_MAX_CHARS_HOUR = Number(process.env.ELEVENLABS_MAX_CHARS_HOUR) || 2500; // tope para no gastar todo el mes de golpe
let ttsChars = [], ttsBlockedUntil = 0, ttsProblem = '';
const ttsReady = who => !!(TTS_KEY && /^[\w]{10,40}$/.test(TTS_VOICES[who] || ''));
async function ttsAudio(who, text) {
  const voice = TTS_VOICES[who];
  const key = crypto.createHash('sha256').update(TTS_MODEL + '|' + voice + '|' + text).digest('hex').slice(0, 40);
  const file = path.join(TTS_DIR, key + '.mp3');
  try { return fs.readFileSync(file); } catch (e) { /* todavía no está guardada */ }
  if (Date.now() < ttsBlockedUntil) { const err = new Error('pausa'); err.code = ttsProblem || 'tts-off'; throw err; }
  const hourAgo = Date.now() - 3600e3;
  ttsChars = ttsChars.filter(x => x.t > hourAgo);
  if (ttsChars.reduce((n, x) => n + x.n, 0) + text.length > TTS_MAX_CHARS_HOUR) { const err = new Error('tope'); err.code = 'tts-limit'; throw err; }
  const r = await fetch(`${TTS_API}/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: 'POST', signal: AbortSignal.timeout(15000),
    headers: { 'xi-api-key': TTS_KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: TTS_MODEL, ...(/flash|turbo/.test(TTS_MODEL) ? { language_code: 'es' } : {}) })
  });
  if (!r.ok) {
    let detail = ''; try { detail = JSON.stringify(await r.json()); } catch (e) {}
    const code = r.status === 401 && /quota|credit/i.test(detail) ? 'tts-quota' : r.status === 401 ? 'tts-bad-key'
      : /free_users|not available for free|paid/i.test(detail) ? 'tts-voice-paid' : /quota|credit/i.test(detail) ? 'tts-quota' : r.status === 429 ? 'tts-busy' : 'tts-error';
    console.error(`ElevenLabs no generó la voz (${r.status}, ${code}):`, detail.slice(0, 300));
    // Sin créditos, clave mala o voz paga: se deja de intentar un rato y la app usa la voz del teléfono.
    if (code !== 'tts-busy' && code !== 'tts-error') { ttsProblem = code; ttsBlockedUntil = Date.now() + (code === 'tts-quota' ? 3 * 3600e3 : 15 * 60e3); }
    const err = new Error(code); err.code = code; throw err;
  }
  const body = Buffer.from(await r.arrayBuffer());
  ttsChars.push({ t: Date.now(), n: text.length }); ttsProblem = '';
  try { fs.mkdirSync(TTS_DIR, { recursive: true }); fs.writeFileSync(file, body); } catch (e) { console.error('No se pudo guardar una frase de voz:', e.message); }
  return body;
}

const audioCache = new Map(); // seq → audio descargado (los últimos 15, para no volver a bajarlos)
const suggestCache = new Map(); // «chatId:seq» → respuestas (para no volver a pagar si se abre dos veces)
const aiCalls = [];
async function suggestReplies(chatId) {
  const thread = db.messages.filter(m => m.chatId === chatId).slice(-8);
  const last = [...thread].reverse().find(m => m.dir === 'in');
  if (!last || last.audio) return { replies: [] };
  const key = chatId + ':' + last.seq;
  if (suggestCache.has(key)) return { replies: suggestCache.get(key), cached: true };
  // Tope de gasto: como máximo 60 pedidos por hora.
  const now = Date.now();
  while (aiCalls.length && now - aiCalls[0] > 3600e3) aiCalls.shift();
  if (aiCalls.length >= 60) throw Object.assign(new Error('limit'), { code: 'ai-limit' });
  aiCalls.push(now);
  const conversation = thread.map(m => (m.dir === 'in' ? 'La otra persona' : 'Yo') + ': ' + m.text.slice(0, 500)).join('\n');
  const request = {
    model: AI_MODEL,
    max_tokens: 4000,
    system: AI_SYSTEM,
    output_config: {
      effort: 'low', // tarea corta y simple: menos razonamiento, respuesta más rápida y barata
      format: { type: 'json_schema', schema: { type: 'object', properties: { replies: { type: 'array', items: { type: 'string' } } }, required: ['replies'], additionalProperties: false } }
    },
    messages: [{ role: 'user', content: `Conversación (de la más vieja a la más nueva):\n${conversation}\n\nÚltimo mensaje para responder: «${last.text.slice(0, 500)}»` }]
  };
  if (AI_FALLBACKS) { request.betas = ['server-side-fallback-2026-07-01']; request.fallbacks = 'default'; }
  const response = await ai.beta.messages.create(request);
  if (response.stop_reason === 'refusal') { suggestCache.set(key, []); return { replies: [] }; }
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  let replies = [];
  try { replies = JSON.parse(text).replies; } catch (e) { replies = []; }
  replies = [...new Set((Array.isArray(replies) ? replies : []).filter(r => typeof r === 'string').map(r => r.trim()).filter(r => r && r.length <= 120))].slice(0, 6);
  suggestCache.set(key, replies);
  if (suggestCache.size > 200) suggestCache.delete(suggestCache.keys().next().value);
  console.log(`Sugerencias con IA: ${replies.length} (modelo ${response.model}, ${response.usage.input_tokens} tokens de entrada + ${response.usage.output_tokens} de salida).`);
  return { replies };
}

// ---------- Avisos push ----------
function validSub(sub) {
  return !!(sub && typeof sub.endpoint === 'string' && /^https:\/\/[^\s]{10,800}$/.test(sub.endpoint) &&
    sub.keys && typeof sub.keys.p256dh === 'string' && typeof sub.keys.auth === 'string' &&
    sub.keys.p256dh.length < 200 && sub.keys.auth.length < 100);
}
function setupPush() {
  if (!webpush) return;
  if (!db.vapid) { db.vapid = webpush.generateVAPIDKeys(); save(); }
  // El «subject» identifica quién manda los avisos ante el servicio de notificaciones: la dirección pública de la app.
  webpush.setVapidDetails('https://ideasdesign.github.io/hablemos/', db.vapid.publicKey, db.vapid.privateKey);
}
async function notifyAll(payload) {
  if (!webpush || !db.pushSubs.length) return 0;
  let sent = 0;
  for (const sub of [...db.pushSubs]) {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, JSON.stringify(payload), { TTL: 6 * 3600, urgency: 'high' });
      sent++;
    } catch (e) {
      // 404/410: el teléfono ya no recibe avisos (se desinstaló o se revocó el permiso).
      if (e.statusCode === 404 || e.statusCode === 410) { db.pushSubs = db.pushSubs.filter(x => x.endpoint !== sub.endpoint); save(); }
      else console.error('No se pudo enviar un aviso push:', e.statusCode || e.message, (e.body || '').slice(0, 200));
    }
  }
  console.log(`Aviso push «${payload.tag}» enviado a ${sent} de ${db.pushSubs.length} teléfono(s).`);
  return sent;
}

// ---------- Telegram ----------
async function tg(method, params) {
  const res = await fetch(`${TG_API}/bot${TOKEN}/${method}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(params || {})
  });
  const data = await res.json().catch(() => null);
  if (!data || !data.ok) {
    const e = new Error((data && data.description) || ('HTTP ' + res.status));
    e.code = (data && data.error_code) || res.status;
    throw e;
  }
  return data.result;
}
let bot = null, botError = '';
async function getBot() {
  if (bot || !TOKEN) return bot;
  try {
    const me = await tg('getMe', {}); bot = { id: me.id, username: me.username, name: me.first_name || me.username }; botError = '';
    console.log('Bot conectado: @' + bot.username);
  } catch (e) {
    botError = e.code === 401 ? 'Telegram rechazó el token (TELEGRAM_TOKEN): puede ser uno viejo, reemplazado con /revoke.'
      : e.code === 404 ? (tokenProblem() || 'Telegram no reconoce el token (TELEGRAM_TOKEN). Copialo de nuevo desde @BotFather.')
      : e.message;
    console.error('No se pudo conectar con el bot:', botError);
  }
  return bot;
}
let webhookOk = false, webhookError = '';
async function ensureWebhook() {
  if (!TOKEN) { webhookError = 'Falta la variable TELEGRAM_TOKEN.'; return; }
  if (!PUBLIC_URL) { webhookError = 'Falta la dirección pública: generá un dominio en Railway (Settings → Networking).'; return; }
  try {
    await tg('setWebhook', { url: PUBLIC_URL + '/telegram/webhook', secret_token: WEBHOOK_SECRET, allowed_updates: ['message'] });
    webhookOk = true; webhookError = '';
    console.log('Webhook de Telegram configurado en', PUBLIC_URL + '/telegram/webhook');
  } catch (e) { webhookOk = false; webhookError = e.message; console.error('No se pudo configurar el webhook:', e.message); }
}
function describe(m) {
  if (typeof m.text === 'string') return m.text;
  const caption = typeof m.caption === 'string' ? ': ' + m.caption : '';
  if (m.voice || m.audio) { const d = (m.voice || m.audio).duration; return '🎤 Audio' + (d ? ' (' + d + ' s)' : ''); }
  if (m.photo) return '🖼️ Envió una foto' + caption;
  if (m.video || m.video_note) return '🎬 Envió un video' + caption;
  if (m.sticker) return (m.sticker.emoji || '🙂') + ' (sticker)';
  if (m.document) return '📎 Envió un archivo' + caption;
  if (m.location) return '📍 Envió una ubicación.';
  if (m.contact) return '👤 Envió un contacto.';
  return '💬 Envió un mensaje que Hablemos no puede mostrar. Abrí Telegram para verlo.';
}
const seenUpdates = [];
function onUpdate(u) {
  if (!u || !Number.isInteger(u.update_id) || seenUpdates.includes(u.update_id)) return; // Telegram puede reintentar
  seenUpdates.push(u.update_id); if (seenUpdates.length > 300) seenUpdates.shift();
  const m = u.message;
  if (!m || !m.chat || m.chat.type !== 'private' || !m.from || m.from.is_bot) return;
  const chatId = String(m.chat.id);
  const name = [m.from.first_name, m.from.last_name].filter(Boolean).join(' ').trim().slice(0, 64) || m.from.username || 'Sin nombre';
  const text = describe(m);
  const isStart = /^\/start\b/.test(text);
  const startCode = isStart ? (text.split(/\s+/)[1] || '') : '';
  const entry = { chatId, dir: 'in', text: text.slice(0, 4096), date: (m.date || Date.now() / 1000) * 1000, id: m.message_id };
  // Audios: se guarda la referencia de Telegram para que la app pueda reproducirlos sin abrir Telegram.
  const media = m.voice || m.audio;
  if (media && typeof media.file_id === 'string') entry.audio = { fileId: media.file_id, duration: Number(media.duration) || 0, mime: String(media.mime_type || 'audio/ogg').slice(0, 40) };
  let p = db.people[chatId];
  const isNew = !p;
  if (!p) {
    const pending = Object.values(db.people).filter(x => x.status === 'pending').sort((a, b) => a.since - b.since);
    if (pending.length >= MAX_PENDING) delete db.people[pending[0].chatId];
    p = db.people[chatId] = { chatId, name, username: (m.from.username || '').slice(0, 64), status: 'pending', since: Date.now(), held: [] };
    touchPeople();
  }
  const viaInvite = isStart && startCode && startCode === db.invite;
  if (isNew && !viaInvite) notifyAll({ title: 'Hablemos', body: name + ' quiere conversar con vos por Telegram.', tag: 'join-' + chatId }).catch(() => {});
  // Entró con el enlace de invitación: queda conectado solo, sin que nadie tenga que aprobarlo.
  if (viaInvite) {
    if (p.status !== 'linked') linkPerson(chatId, '', { welcome: true });
    return;
  }
  if (isStart) {
    if (isNew) tg('sendMessage', { chat_id: chatId, text: '👋 ¡Hola! Tu pedido para conversar por acá quedó esperando que te acepten. Te va a llegar un aviso cuando esté listo. Mientras tanto podés escribir: los mensajes se entregan al aceptarte.' }).catch(() => {});
    return;
  }
  if (p.status !== 'linked') {
    // Sus mensajes se guardan aparte (no se muestran) y se entregan si se aprueba a la persona, así no se pierden.
    p.held = (p.held || []).concat(entry).slice(-20);
    save();
    return;
  }
  addMessage(entry);
  notifyAll({ title: '📩 ' + p.name, body: entry.audio ? '🎤 Te mandó un audio' : entry.text.slice(0, 300), tag: 'chat-' + chatId }).catch(() => {});
}

// Conecta a una persona: entrega lo que mandó mientras esperaba y (si corresponde) le da la bienvenida.
function linkPerson(chatId, name, { welcome }) {
  const person = db.people[chatId];
  const wasLinked = person.status === 'linked';
  person.status = 'linked';
  if (name) person.name = name;
  const held = person.held || []; delete person.held;
  touchPeople();
  for (const h of held) addMessage(h);
  if (!wasLinked && welcome) tg('sendMessage', { chat_id: chatId, text: '✅ ¡Listo! Ya estás conectado/a. Los mensajes de Hablemos te van a llegar por este chat, y podés responder escribiendo acá.' }).catch(() => {});
  return held.length;
}

// ---------- HTTP ----------
function send(res, status, body, headers = {}) {
  const isText = typeof body === 'string';
  res.writeHead(status, { 'content-type': isText ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(isText ? body : JSON.stringify(body));
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('too-large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
async function readJson(req) { try { return JSON.parse(await readBody(req, 64 * 1024) || '{}'); } catch (e) { return null; } }
// Límite de intentos con PIN equivocado, por dirección IP.
const failures = new Map();
function clientIp(req) { return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(); }
function isBlocked(ip) { const f = failures.get(ip); return !!(f && f.until > Date.now()); }
function registerFailure(ip) {
  const now = Date.now(); const f = failures.get(ip) || { count: 0, first: now, until: 0 };
  if (now - f.first > 15 * 60e3) { f.count = 0; f.first = now; }
  f.count++; if (f.count >= 8) f.until = now + 15 * 60e3;
  failures.set(ip, f);
}
function pinOk(req) {
  const given = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = crypto.createHash('sha256').update(given).digest(), b = crypto.createHash('sha256').update(PIN).digest();
  return PIN.length > 0 && crypto.timingSafeEqual(a, b);
}
function publicPeople() { return Object.values(db.people).map(p => ({ chatId: p.chatId, name: p.name, username: p.username, status: p.status, waiting: (p.held || []).length })); }
function errorFor(e) {
  if (e.code === 403) return { status: 409, error: 'blocked' };
  if (e.code === 400 && /chat not found/i.test(e.message)) return { status: 409, error: 'chat-not-found' };
  if (e.code === 429) return { status: 429, error: 'telegram-busy' };
  if (e.code === 401 || e.code === 404) return { status: 502, error: 'bad-token' };
  return { status: 502, error: 'telegram-error' };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const origin = req.headers.origin;
  const cors = origin && ORIGINS.includes(origin) ? {
    'access-control-allow-origin': origin, vary: 'Origin',
    'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-max-age': '86400'
  } : {};
  try {
    if (req.method === 'OPTIONS') return send(res, 204, '', cors);
    if (url.pathname === '/' && req.method === 'GET') return send(res, 200, 'Servidor de Hablemos funcionando.');
    if (url.pathname === '/health') return send(res, 200, { ok: true });

    if (url.pathname === '/telegram/webhook' && req.method === 'POST') {
      if (req.headers['x-telegram-bot-api-secret-token'] !== WEBHOOK_SECRET) return send(res, 401, 'no');
      let update = null; try { update = JSON.parse(await readBody(req, 1024 * 1024)); } catch (e) {}
      onUpdate(update);
      return send(res, 200, 'ok');
    }

    if (!url.pathname.startsWith('/api/')) return send(res, 404, { error: 'not-found' }, cors);
    if (!TOKEN || !PIN) return send(res, 503, { error: 'not-configured', missing: [!TOKEN && 'TELEGRAM_TOKEN', !PIN && 'HABLEMOS_PIN'].filter(Boolean) }, cors);
    const ip = clientIp(req);
    if (isBlocked(ip)) return send(res, 429, { error: 'too-many-attempts' }, cors);
    if (!pinOk(req)) { registerFailure(ip); return send(res, 401, { error: 'bad-pin' }, cors); }

    if (url.pathname === '/api/audio' && req.method === 'GET') {
      const chatId = String(url.searchParams.get('chatId') || ''), seq = Number(url.searchParams.get('seq'));
      const msg = db.messages.find(m => m.seq === seq && m.chatId === chatId && m.audio);
      if (!msg) return send(res, 404, { error: 'no-audio' }, cors);
      try {
        let file = audioCache.get(seq);
        if (!file) {
          const info = await tg('getFile', { file_id: msg.audio.fileId });
          const r = await fetch(`${TG_API}/file/bot${TOKEN}/${info.file_path}`);
          if (!r.ok) throw new Error('descarga ' + r.status);
          file = { body: Buffer.from(await r.arrayBuffer()), type: /^audio\//.test(msg.audio.mime) ? msg.audio.mime : 'audio/ogg' };
          audioCache.set(seq, file);
          if (audioCache.size > 15) audioCache.delete(audioCache.keys().next().value);
        }
        res.writeHead(200, { 'content-type': file.type, 'content-length': file.body.length, 'cache-control': 'private, max-age=3600', ...cors });
        return res.end(file.body);
      } catch (e) { console.error('No se pudo traer un audio de Telegram:', e.code || e.message); return send(res, 502, { error: 'audio-unavailable' }, cors); }
    }
    if (url.pathname === '/api/status' && req.method === 'GET') {
      const b = await getBot();
      if (!webhookOk) await ensureWebhook();
      return send(res, 200, { ok: true, bot: b, botError, webhook: { ok: webhookOk, error: webhookError }, persistent: PERSISTENT, invite: db.invite, pushKey: db.vapid ? db.vapid.publicKey : '', pushDevices: db.pushSubs.length, ai: !!ai, aiModel: ai ? AI_MODEL : '', voice: { diego: ttsReady('diego'), family: ttsReady('family'), problem: ttsProblem } }, cors);
    }

    if (url.pathname === '/api/sync' && req.method === 'GET') {
      let since = Number(url.searchParams.get('since')) || 0;
      const pv = Number(url.searchParams.get('pv'));
      const reset = since > db.seq; // los datos del servidor se reiniciaron: la app vuelve a empezar
      if (reset) since = 0;
      if (url.searchParams.get('wait') === '1' && !reset && since >= db.seq && pv === db.pv) {
        await new Promise(resolve => {
          const done = () => { clearTimeout(timer); waiters.delete(done); resolve(); };
          const timer = setTimeout(done, LONG_POLL_MS);
          waiters.add(done); req.on('close', done);
        });
      }
      const messages = db.messages.filter(m => m.seq > since).slice(-500).map(m => m.audio ? { ...m, audio: { duration: m.audio.duration } } : m);
      return send(res, 200, { seq: db.seq, pv: db.pv, reset, messages, people: publicPeople(), invite: db.invite, ai: !!ai, voice: { diego: ttsReady('diego'), family: ttsReady('family') } }, cors);
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/')) {
      const body = await readJson(req);
      if (!body) return send(res, 400, { error: 'bad-request' }, cors);
      const chatId = String(body.chatId || '');
      const person = db.people[chatId];

      if (url.pathname === '/api/send') {
        const text = String(body.text || '').trim().slice(0, 4096);
        if (!person || person.status !== 'linked') return send(res, 404, { error: 'not-linked' }, cors);
        if (!text) return send(res, 400, { error: 'empty' }, cors);
        try {
          const sent = await tg('sendMessage', { chat_id: chatId, text });
          const msg = addMessage({ chatId, dir: 'out', text, date: Date.now(), id: sent.message_id });
          return send(res, 200, { ok: true, message: msg }, cors);
        } catch (e) { const r = errorFor(e); return send(res, r.status, { error: r.error }, cors); }
      }
      if (url.pathname === '/api/people/link') {
        const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 64) : '';
        if (!person) {
          // migrate: personas que ya estaban conectadas en la app antes de usar el servidor.
          if (!body.migrate || !/^-?\d{1,20}$/.test(chatId)) return send(res, 404, { error: 'unknown-person' }, cors);
          db.people[chatId] = { chatId, name: name || 'Sin nombre', username: '', status: 'linked', since: Date.now() };
          touchPeople();
          return send(res, 200, { ok: true }, cors);
        }
        const delivered = linkPerson(chatId, name, { welcome: !body.migrate });
        return send(res, 200, { ok: true, delivered }, cors);
      }
      if (url.pathname === '/api/help') {
        // Pedido de ayuda: se manda a todas las personas conectadas (con un mínimo de 20 s entre avisos, por si se toca dos veces).
        const now = Date.now();
        if (now - lastHelpAt < 20000) return send(res, 200, { ok: true, sent: lastHelpSent, repeated: true }, cors);
        lastHelpAt = now;
        const text = '🆘 Necesito ayuda ahora. Por favor, vení o llamame. (Aviso enviado desde Hablemos)';
        const linked = Object.values(db.people).filter(x => x.status === 'linked');
        let sent = 0;
        for (const p of linked) {
          try { const r = await tg('sendMessage', { chat_id: p.chatId, text }); addMessage({ chatId: p.chatId, dir: 'out', text, date: Date.now(), id: r.message_id }); sent++; }
          catch (e) { console.error('No se pudo enviar el pedido de ayuda a una persona:', e.code || e.message); }
        }
        lastHelpSent = sent;
        console.log(`Pedido de ayuda enviado a ${sent} de ${linked.length} persona(s).`);
        return send(res, 200, { ok: true, sent, total: linked.length }, cors);
      }
      if (url.pathname === '/api/tts') {
        const who = body.who === 'family' ? 'family' : 'diego';
        const text = String(body.text || '').replace(/\s+/g, ' ').trim().slice(0, 600);
        if (!ttsReady(who)) return send(res, 503, { error: 'tts-off' }, cors);
        if (!text) return send(res, 400, { error: 'empty' }, cors);
        try {
          const audio = await ttsAudio(who, text);
          res.writeHead(200, { 'content-type': 'audio/mpeg', 'content-length': audio.length, 'cache-control': 'private, max-age=31536000', ...cors });
          return res.end(audio);
        } catch (e) { return send(res, e.code === 'tts-limit' || e.code === 'tts-busy' ? 429 : 502, { error: e.code || 'tts-error' }, cors); }
      }
      if (url.pathname === '/api/complete') {
        if (!ai) return send(res, 503, { error: 'ai-off' }, cors);
        const words = String(body.words || '').replace(/\s+/g, ' ').trim().slice(0, 200);
        if (words.split(' ').length < 2) return send(res, 400, { error: 'few-words' }, cors);
        // Contexto: solo el texto del último mensaje recibido de esa persona, si es de las últimas 6 horas. Sin nombres.
        let context = null;
        if (person && person.status === 'linked') {
          const last = [...db.messages].reverse().find(m => m.chatId === chatId && m.dir === 'in' && !m.audio);
          if (last && Date.now() - last.date < 6 * 3600e3) context = { seq: last.seq, text: last.text };
        }
        try { return send(res, 200, { ok: true, ...(await completePhrases(words, context)) }, cors); }
        catch (e) {
          if (e.code === 'ai-limit') return send(res, 429, { error: 'ai-limit' }, cors);
          if (AnthropicSDK && e instanceof AnthropicSDK.APIError) console.error('Error de la API de Claude al completar frases:', e.status, e.message);
          else console.error('No se pudieron completar frases:', e.message);
          return send(res, 502, { error: 'ai-error' }, cors);
        }
      }
      if (url.pathname === '/api/suggest') {
        if (!ai) return send(res, 503, { error: 'ai-off' }, cors);
        if (!person || person.status !== 'linked') return send(res, 404, { error: 'not-linked' }, cors);
        try { return send(res, 200, { ok: true, ...(await suggestReplies(chatId)) }, cors); }
        catch (e) {
          if (e.code === 'ai-limit') return send(res, 429, { error: 'ai-limit' }, cors);
          if (AnthropicSDK && e instanceof AnthropicSDK.AuthenticationError) { console.error('ANTHROPIC_API_KEY no es válida.'); return send(res, 502, { error: 'ai-bad-key' }, cors); }
          if (AnthropicSDK && e instanceof AnthropicSDK.RateLimitError) return send(res, 429, { error: 'ai-busy' }, cors);
          if (AnthropicSDK && e instanceof AnthropicSDK.APIError) { console.error('Error de la API de Claude:', e.status, e.message); return send(res, 502, { error: 'ai-error' }, cors); }
          console.error('No se pudieron pedir sugerencias:', e.message); return send(res, 502, { error: 'ai-error' }, cors);
        }
      }
      if (url.pathname === '/api/push/subscribe') {
        const sub = body.subscription;
        if (!webpush || !db.vapid) return send(res, 503, { error: 'push-unavailable' }, cors);
        if (!validSub(sub)) return send(res, 400, { error: 'bad-subscription' }, cors);
        db.pushSubs = db.pushSubs.filter(x => x.endpoint !== sub.endpoint);
        db.pushSubs.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }, since: Date.now() });
        if (db.pushSubs.length > 20) db.pushSubs.splice(0, db.pushSubs.length - 20);
        save();
        return send(res, 200, { ok: true, devices: db.pushSubs.length }, cors);
      }
      if (url.pathname === '/api/push/unsubscribe') {
        db.pushSubs = db.pushSubs.filter(x => x.endpoint !== String(body.endpoint || '')); save();
        return send(res, 200, { ok: true }, cors);
      }
      if (url.pathname === '/api/push/test') {
        const sent = await notifyAll({ title: 'Hablemos', body: '🔔 Así se van a ver los avisos de mensajes nuevos.', tag: 'test' });
        return send(res, 200, { ok: true, sent }, cors);
      }
      if (url.pathname === '/api/invite/new') {
        // Cambia el enlace de invitación (por ejemplo, si llegó a alguien que no debía). Las personas conectadas se mantienen.
        db.invite = newInvite(); touchPeople();
        return send(res, 200, { ok: true, invite: db.invite }, cors);
      }
      if (url.pathname === '/api/people/rename') {
        if (!person || typeof body.name !== 'string' || !body.name.trim()) return send(res, 400, { error: 'bad-request' }, cors);
        person.name = body.name.trim().slice(0, 64); touchPeople();
        return send(res, 200, { ok: true }, cors);
      }
      if (url.pathname === '/api/people/unlink' || url.pathname === '/api/people/ignore') {
        if (person) {
          delete db.people[chatId];
          if (url.pathname === '/api/people/unlink') db.messages = db.messages.filter(m => m.chatId !== chatId);
          touchPeople();
        }
        return send(res, 200, { ok: true }, cors);
      }
    }
    return send(res, 404, { error: 'not-found' }, cors);
  } catch (e) {
    console.error('Error atendiendo', req.method, url.pathname, e.message);
    if (!res.headersSent) send(res, 500, { error: 'server-error' }, cors);
  }
});

load();
setupPush();
server.listen(PORT, () => {
  console.log(`Hablemos servidor escuchando en el puerto ${PORT}. Datos en ${FILE}${PERSISTENT ? '' : ' (NO persistente: agregá un Volume en Railway)'}.`);
  if (!TOKEN) console.warn('Falta TELEGRAM_TOKEN.');
  else if (tokenProblem()) console.warn('Atención:', tokenProblem());
  else if (TOKEN !== RAW_TOKEN.trim()) console.log('TELEGRAM_TOKEN tenía espacios, comillas o «bot» delante: se corrigió automáticamente.');
  if (!PIN) console.warn('Falta HABLEMOS_PIN.');
  console.log(TTS_KEY ? `Voz de ElevenLabs activada (modelo ${TTS_MODEL}${TTS_VOICES.family ? ', con voz para la familia' : ''}).` : 'Voz de ElevenLabs desactivada (falta ELEVENLABS_API_KEY): se usa la voz del teléfono.');
  console.log(ai ? `Sugerencias con IA activadas (modelo ${AI_MODEL}).` : 'Sugerencias con IA desactivadas (falta ANTHROPIC_API_KEY): se usan las respuestas por reglas.');
  getBot().then(() => ensureWebhook());
  // Reintenta el webhook cada minuto hasta que quede configurado.
  setInterval(() => { if (!webhookOk) ensureWebhook(); }, 60e3).unref();
});
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { writeNow(); process.exit(0); });
