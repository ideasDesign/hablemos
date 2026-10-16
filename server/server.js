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

const TOKEN = (process.env.TELEGRAM_TOKEN || '').trim();
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
// people[chatId] = {chatId, name, username, status: 'pending' | 'linked', since}
let db = { seq: 0, pv: 0, people: {}, messages: [] };
function load() {
  try {
    const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (d && typeof d === 'object') {
      db = {
        seq: Number.isInteger(d.seq) ? d.seq : 0,
        pv: Number.isInteger(d.pv) ? d.pv : 0,
        people: d.people && typeof d.people === 'object' ? d.people : {},
        messages: Array.isArray(d.messages) ? d.messages : []
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
  try { const me = await tg('getMe', {}); bot = { id: me.id, username: me.username, name: me.first_name || me.username }; botError = ''; }
  catch (e) { botError = e.code === 401 || e.code === 404 ? 'Telegram no reconoce el token (TELEGRAM_TOKEN).' : e.message; }
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
  if (m.voice || m.audio) return '🎤 Envió un audio. Abrí Telegram para escucharlo.';
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
  let p = db.people[chatId];
  if (!p) {
    // Alguien nuevo: queda pendiente hasta que quien acompaña lo apruebe en Hablemos. Sus mensajes no se guardan.
    const pending = Object.values(db.people).filter(x => x.status === 'pending').sort((a, b) => a.since - b.since);
    if (pending.length >= MAX_PENDING) delete db.people[pending[0].chatId];
    db.people[chatId] = { chatId, name, username: (m.from.username || '').slice(0, 64), status: 'pending', since: Date.now() };
    touchPeople();
    return;
  }
  if (p.status !== 'linked') return;
  const text = describe(m);
  if (/^\/start\b/.test(text)) return;
  addMessage({ chatId, dir: 'in', text: text.slice(0, 4096), date: (m.date || Date.now() / 1000) * 1000, id: m.message_id });
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
function publicPeople() { return Object.values(db.people).map(p => ({ chatId: p.chatId, name: p.name, username: p.username, status: p.status })); }
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

    if (url.pathname === '/api/status' && req.method === 'GET') {
      const b = await getBot();
      if (!webhookOk) await ensureWebhook();
      return send(res, 200, { ok: true, bot: b, botError, webhook: { ok: webhookOk, error: webhookError }, persistent: PERSISTENT }, cors);
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
      const messages = db.messages.filter(m => m.seq > since).slice(-500);
      return send(res, 200, { seq: db.seq, pv: db.pv, reset, messages, people: publicPeople() }, cors);
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
        const wasLinked = person.status === 'linked';
        person.status = 'linked';
        if (name) person.name = name;
        touchPeople();
        if (!wasLinked) tg('sendMessage', { chat_id: chatId, text: '✅ ¡Listo! Ya estás conectado/a. Los mensajes de Hablemos te van a llegar por este chat, y podés responder escribiendo acá.' }).catch(() => {});
        return send(res, 200, { ok: true }, cors);
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
server.listen(PORT, () => {
  console.log(`Hablemos servidor escuchando en el puerto ${PORT}. Datos en ${FILE}${PERSISTENT ? '' : ' (NO persistente: agregá un Volume en Railway)'}.`);
  if (!TOKEN) console.warn('Falta TELEGRAM_TOKEN.');
  if (!PIN) console.warn('Falta HABLEMOS_PIN.');
  getBot().then(() => ensureWebhook());
  // Reintenta el webhook cada minuto hasta que quede configurado.
  setInterval(() => { if (!webhookOk) ensureWebhook(); }, 60e3).unref();
});
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { writeNow(); process.exit(0); });
