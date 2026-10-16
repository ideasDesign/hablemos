// Busca en ARASAAC un pictograma para cada palabra y frase de Hablemos y genera pictos.js.
const fs = require('fs');
const vm = require('vm');
const APP = process.argv[2], OUT = process.argv[3];
const src = fs.readFileSync(APP, 'utf8');
const grab = (start, end) => { const a = src.indexOf(start); const b = src.indexOf(end, a); return src.slice(a + start.length, b).trim().replace(/;\s*$/, ''); };
const data = vm.runInNewContext('(' + grab('const data = ', '\n  const $ =') + ')');
const builder = vm.runInNewContext('(' + grab('const builderCategories = ', '\n  // V0.3') + ')');
const nextWords = vm.runInNewContext('(' + grab('const nextWords = ', '\n  // Si la última') + ')');

// Palabra clave para buscar (cuando la etiqueta sola no da un buen dibujo).
const KEY = {
  'Quiero': 'querer', 'Necesito': 'necesitar', 'Me gustaría': 'gustar', 'No quiero': 'no querer', 'Prefiero': 'preferir', 'Tengo': 'tener',
  'Me siento': 'sentir', 'Hoy quiero': 'querer', '¿Podés': 'poder', '¿Me ayudás a': 'ayudar', '¿Cuándo podemos': 'cuándo', 'Gracias por': 'gracias',
  'que vengas': 'venir', 'que me llames': 'llamar por teléfono', 'venir a verme': 'visitar', 'ayudarme': 'ayudar', 'explicarme': 'explicar',
  'acompañarme': 'acompañar', 'contarte algo': 'contar', 'decir algo': 'decir', 'llamar': 'llamar por teléfono', 'ir': 'ir', 'tomar': 'beber',
  'un vaso de agua': 'vaso de agua', 'un café': 'café', 'algo para comer': 'comida', 'al baño': 'baño', 'al médico': 'médico', 'a casa': 'casa',
  'a pasear': 'pasear', 'al patio': 'patio', 'mi teléfono': 'teléfono móvil', 'la televisión': 'televisión', 'un momento': 'esperar',
  'un poco más': 'más', 'otro día': 'otro día', 'porque estoy cansado': 'cansado', 'porque lo necesito': 'necesitar',
  'con mi hermana': 'hermana', 'con mi hermano': 'hermano', 'con mi mamá': 'mamá', 'con mi papá': 'papá', 'con mi familia': 'familia',
  'con vos': 'tú', 'con mis amigos': 'amigos', 'con mi hija': 'hija', 'con mi hijo': 'hijo', 'con mi cuidador': 'cuidador',
  'a mi hermana': 'hermana', 'a mi hermano': 'hermano', 'a vos': 'tú', 'a mi familia': 'familia', 'a mi hermano ': 'hermano',
  'esta tarde': 'tarde', 'esta noche': 'noche', 'más tarde': 'más tarde', 'el fin de semana': 'fin de semana', 'cuando puedas': 'cuando', 'por un rato': 'rato',
  'con miedo': 'miedo', 'con dolor': 'dolor', 'solo': 'solo', 'acompañado': 'acompañado',
  '¿Cómo estás': 'cómo estás', '¿Podemos hablar': 'hablar', '¿Podés venir': 'venir', '¿Me escuchás': 'escuchar', '¿Qué te parece': 'opinar',
  '¿Cuándo nos vemos': 'cuándo', '¿Tenés un momento': 'esperar', '¿Dónde está': 'dónde', '¿Me explicás': 'explicar', '¿Querés conversar': 'conversar',
  'Tal vez': 'quizás', 'No entendí': 'no entender', 'No estoy de acuerdo': 'no estar de acuerdo', 'Muchas gracias': 'gracias', 'Te quiero': 'te quiero',
  'Lo siento': 'perdón', 'Prefiero otra cosa': 'preferir', 'Contame más': 'contar', 'Repetilo, por favor': 'repetir', 'escuchar música': 'escuchar música',
  // frases rápidas
  'Tengo sed.': 'sed', 'Tengo hambre.': 'hambre', 'Necesito ir al baño.': 'baño', '¿Me podés ayudar, por favor?': 'ayudar', 'Necesito cambiar de posición.': 'cambiar de postura',
  'Llamame, por favor.': 'llamar por teléfono', 'Sí.': 'sí', 'No.': 'no', 'Esperá un momento, por favor.': 'esperar', 'Quiero conversar.': 'conversar',
  '¿Podés acercarme el teléfono?': 'teléfono móvil', 'Necesito descansar.': 'descansar', 'Tengo frío.': 'frío', 'Tengo calor.': 'calor',
  'Tengo dolor. Necesito ayuda.': 'dolor', 'Necesito ayuda con mi medicación.': 'medicamento', 'No estoy en una posición cómoda.': 'incómodo',
  '¿Me podés traer agua?': 'agua', '¿Podés abrir la puerta?': 'abrir la puerta', 'Hola, ¿cómo estás?': 'hola', 'Muchas gracias por tu ayuda.': 'gracias',
  'Te quiero mucho.': 'te quiero', 'Contame cómo estuvo tu día.': 'contar', 'Me gustaría salir un rato.': 'pasear', 'Me gustaría escuchar música.': 'escuchar música',
  '¿Podés explicármelo de otra manera?': 'explicar', 'Me gustaría recibir una visita.': 'visitar', 'Me siento bien.': 'contento', 'Estoy triste.': 'triste',
  'Estoy preocupado.': 'preocupado', 'Estoy cansado.': 'cansado', 'Tengo miedo.': 'miedo', 'Estoy enojado.': 'enfadado', 'Quiero agradecerte algo.': 'gracias',
  'Necesito estar a solas un momento.': 'solo', 'Tal vez.': 'quizás', 'No entendí.': 'no entender', '¿Podés repetirlo?': 'repetir', 'De acuerdo.': 'de acuerdo',
  'Prefiero otra cosa.': 'preferir', 'Ahora no, mejor después.': 'después', 'No quiero hacer eso.': 'no querer'
};
const labels = new Set();
for (const cat of Object.values(data)) for (const [, p] of cat.phrases) labels.add(p);
for (const cat of Object.values(builder)) for (const w of cat.entries) labels.add(w);
for (const list of Object.values(nextWords)) for (const w of list) labels.add(w);
const strip = s => s.replace(/[¿?¡!.,]/g, '').trim();
const wait = ms => new Promise(r => setTimeout(r, ms));
const cache = {};
async function search(q) {
  if (q in cache) return cache[q];
  const r = await fetch('https://api.arasaac.org/v1/pictograms/es/search/' + encodeURIComponent(q));
  let id = null;
  if (r.ok) { const list = await r.json(); const ok = list.find(p => !p.sex && !p.violence && !(p._id >= 39383 && p._id <= 39393)); // 39383-39393: relojes que ARASAAC devuelve cuando no encuentra nada id = ok ? ok._id : null; }
  cache[q] = id; await wait(120); return id;
}
(async () => {
  const out = {}, missing = [];
  for (const label of labels) {
    const tries = [KEY[label], strip(label).toLocaleLowerCase('es'), strip(label).split(' ').filter(w => !/^(el|la|los|las|un|una|al|a|de|del|con|mi|mis|por|que|me|te|lo|algo|para)$/i.test(w)).pop()].filter(Boolean);
    let id = null;
    for (const q of tries) { id = await search(q); if (id) break; }
    if (id) out[label] = id; else missing.push(label);
  }
  fs.writeFileSync(OUT, '// Pictogramas de ARASAAC para las palabras y frases de Hablemos (generado automáticamente).\n' +
    '// Autor de los pictogramas: Sergio Palao. Origen: ARASAAC (https://arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón (España).\n' +
    'window.HABLEMOS_PICTOS=' + JSON.stringify(out) + ';\n');
  console.log('con pictograma:', Object.keys(out).length, 'de', labels.size);
  console.log('sin pictograma:', missing.join(' | '));
})();
