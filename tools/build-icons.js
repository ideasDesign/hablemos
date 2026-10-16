// Genera icons.js con los íconos de línea (Tabler Icons, licencia MIT) que usa Hablemos.
// Uso: node tools/build-icons.js  (descarga los SVG de la versión fijada y arma icons.js, para que funcionen sin internet)
const fs = require('fs');
const path = require('path');
const VERSION = '3.48.0';
const ROOT = path.join(__dirname, '..');

// Ícono para cada palabra o frase del tablero.
const FOR = {
  'Tengo sed.': 'droplet', 'Tengo hambre.': 'tools-kitchen-2', 'Necesito ir al baño.': 'toilet-paper', '¿Me podés ayudar, por favor?': 'help-hexagon',
  'Necesito cambiar de posición.': 'arrows-move', 'Llamame, por favor.': 'phone-call', 'Sí.': 'check', 'No.': 'x', 'Esperá un momento, por favor.': 'hourglass',
  'Quiero conversar.': 'messages', '¿Podés acercarme el teléfono?': 'device-mobile', 'Necesito descansar.': 'bed', 'Tengo frío.': 'snowflake', 'Tengo calor.': 'sun-high',
  'Tengo dolor. Necesito ayuda.': 'first-aid-kit', 'Necesito ayuda con mi medicación.': 'pill', 'No estoy en una posición cómoda.': 'armchair-2',
  '¿Me podés traer agua?': 'bottle', '¿Podés abrir la puerta?': 'door', 'Hola, ¿cómo estás?': 'hand-stop', 'Muchas gracias por tu ayuda.': 'heart-handshake',
  'Te quiero mucho.': 'heart', 'Contame cómo estuvo tu día.': 'message-chatbot', 'Me gustaría salir un rato.': 'trees', 'Me gustaría escuchar música.': 'music',
  '¿Podés explicármelo de otra manera?': 'bulb', 'Me gustaría recibir una visita.': 'users', 'Me siento bien.': 'mood-smile', 'Estoy triste.': 'mood-sad',
  'Estoy preocupado.': 'mood-nervous', 'Estoy cansado.': 'zzz', 'Tengo miedo.': 'mood-cry', 'Estoy enojado.': 'mood-angry', 'Quiero agradecerte algo.': 'gift',
  'Necesito estar a solas un momento.': 'user', 'Tal vez.': 'arrows-shuffle', 'No entendí.': 'question-mark', '¿Podés repetirlo?': 'repeat', 'De acuerdo.': 'thumb-up',
  'Prefiero otra cosa.': 'switch-horizontal', 'Ahora no, mejor después.': 'clock-pause', 'No quiero hacer eso.': 'hand-off',
  'Quiero': 'hand-grab', 'Necesito': 'alert-circle', 'Me gustaría': 'star', 'No quiero': 'hand-off', 'Prefiero': 'switch-horizontal', 'Tengo': 'user-check',
  'Me siento': 'mood-empty', 'Hoy quiero': 'calendar-heart', '¿Podés': 'hand-finger', '¿Me ayudás a': 'help-hexagon', '¿Cuándo podemos': 'calendar-question',
  'Gracias por': 'heart-handshake', 'hablar': 'message-circle', 'comer': 'tools-kitchen-2', 'descansar': 'bed', 'salir': 'door-exit', 'ir': 'walk', 'ver': 'eye',
  'escuchar música': 'headphones', 'tomar': 'cup', 'llamar': 'phone', 'jugar': 'cards', 'decir algo': 'message-2', 'que vengas': 'door-enter', 'que me llames': 'phone-incoming',
  'venir a verme': 'home-heart', 'ayudarme': 'lifebuoy', 'explicarme': 'bulb', 'acompañarme': 'users', 'contarte algo': 'message-chatbot',
  'sed': 'droplet', 'hambre': 'tools-kitchen-2', 'frío': 'snowflake', 'calor': 'sun-high', 'dolor': 'bandage', 'sueño': 'zzz', 'un vaso de agua': 'droplet',
  'un café': 'coffee', 'algo para comer': 'apple', 'al baño': 'toilet-paper', 'al médico': 'stethoscope', 'a casa': 'home', 'a pasear': 'trees', 'al patio': 'plant-2',
  'mi teléfono': 'device-mobile', 'la televisión': 'device-tv', 'un momento': 'hourglass', 'un poco más': 'plus', 'otro día': 'calendar-plus', 'por favor': 'pray',
  'porque estoy cansado': 'zzz', 'porque lo necesito': 'alert-circle',
  'con mi hermana': 'woman', 'con mi hermano': 'man', 'con mi mamá': 'woman', 'con mi papá': 'man', 'con mi familia': 'users-group', 'con vos': 'user',
  'con mis amigos': 'friends', 'con mi hija': 'woman', 'con mi hijo': 'man', 'con mi cuidador': 'nurse', 'a mi hermana': 'woman', 'a mi hermano': 'man',
  'a vos': 'user', 'a mi familia': 'users-group',
  'ahora': 'clock-bolt', 'hoy': 'calendar-event', 'mañana': 'sunrise', 'esta tarde': 'sunset-2', 'esta noche': 'moon', 'después': 'clock-play', 'más tarde': 'clock-hour-4',
  'el fin de semana': 'calendar-week', 'cuando puedas': 'clock-question', 'por un rato': 'hourglass-low',
  'bien': 'mood-smile', 'mal': 'mood-sad-2', 'triste': 'mood-sad', 'contento': 'mood-happy', 'cansado': 'zzz', 'preocupado': 'mood-nervous', 'tranquilo': 'leaf',
  'solo': 'user', 'acompañado': 'users', 'con miedo': 'mood-cry', 'con dolor': 'bandage', 'mejor': 'trending-up',
  '¿Cómo estás': 'mood-smile', '¿Podemos hablar': 'messages', '¿Podés venir': 'door-enter', '¿Me escuchás': 'ear', '¿Qué te parece': 'bulb',
  '¿Cuándo nos vemos': 'calendar-question', '¿Tenés un momento': 'hourglass', '¿Dónde está': 'map-pin', '¿Me explicás': 'bulb', '¿Querés conversar': 'messages',
  'Sí': 'check', 'No': 'x', 'Tal vez': 'arrows-shuffle', 'No entendí': 'question-mark', 'De acuerdo': 'thumb-up', 'No estoy de acuerdo': 'thumb-down',
  'Muchas gracias': 'heart-handshake', 'Te quiero': 'heart', 'Lo siento': 'mood-sad-squint', 'Prefiero otra cosa': 'switch-horizontal', 'Contame más': 'message-dots',
  'Repetilo, por favor': 'repeat'
};
// Íconos de la interfaz (botones fijos, carpetas, avisos).
const UI = ['urgent', 'settings', 'arrow-back-up', 'volume', 'send', 'star', 'folder', 'messages', 'device-floppy', 'chevron-left', 'chevron-right', 'sparkles',
  'pencil', 'player-play', 'microphone', 'brand-telegram', 'brand-whatsapp', 'user', 'users', 'bookmark', 'heart', 'mood-smile', 'circle-check', 'help-circle',
  'sunrise', 'moon', 'run', 'clock', 'puzzle', 'friends', 'box', 'message-question', 'x', 'check', 'user-plus', 'hourglass', 'message-circle', 'calendar-time'];

const names = new Set([...new Set(Object.values(FOR)), ...UI]);
(async () => {
  const icons = {}, missing = [];
  for (const n of names) {
    const r = await fetch(`https://unpkg.com/@tabler/icons@${VERSION}/icons/outline/${n}.svg`);
    if (!r.ok) { missing.push(n); continue; }
    const svg = await r.text();
    // Solo el contenido interno (paths), sin el cuadro de transparencia que trae cada ícono.
    icons[n] = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/, '').replace(/\s+/g, ' ').trim();
  }
  if (missing.length) { console.error('Íconos que no existen:', missing.join(', ')); process.exit(1); }
  fs.writeFileSync(path.join(ROOT, 'icons.js'),
    `// Íconos de línea de Tabler Icons ${VERSION} (https://tabler.io/icons, licencia MIT). Generado por tools/build-icons.js.\n` +
    'window.HABLEMOS_ICONS=' + JSON.stringify(icons) + ';\n' +
    'window.HABLEMOS_ICON_FOR=' + JSON.stringify(FOR) + ';\n');
  console.log('íconos:', Object.keys(icons).length, '| etiquetas:', Object.keys(FOR).length);
})();
