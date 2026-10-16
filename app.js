(() => {
  'use strict';
  const data = {
    frecuentes: {label:'⭐ Frecuentes', phrases:[
      ['💧','Tengo sed.'],['🍽️','Tengo hambre.'],['🚻','Necesito ir al baño.'],
      ['🙋','¿Me podés ayudar, por favor?'],['🪑','Necesito cambiar de posición.'],
      ['📞','Llamame, por favor.'],['✅','Sí.'],['❌','No.'],
      ['⏳','Esperá un momento, por favor.'],['💬','Quiero conversar.']
    ]},
    cuidados: {label:'🧡 Cuidados', phrases:[
      ['📱','¿Podés acercarme el teléfono?'],['🛌','Necesito descansar.'],
      ['🥶','Tengo frío.'],['☀️','Tengo calor.'],['🤕','Tengo dolor. Necesito ayuda.'],
      ['💊','Necesito ayuda con mi medicación.'],['↕️','No estoy en una posición cómoda.'],
      ['🥤','¿Me podés traer agua?'],['🚪','¿Podés abrir la puerta?']
    ]},
    conversar: {label:'💬 Conversar', phrases:[
      ['👋','Hola, ¿cómo estás?'],['🙏','Muchas gracias por tu ayuda.'],
      ['❤️','Te quiero mucho.'],['☕','Contame cómo estuvo tu día.'],
      ['🌳','Me gustaría salir un rato.'],['🎵','Me gustaría escuchar música.'],
      ['❓','¿Podés explicármelo de otra manera?'],['🧑‍🤝‍🧑','Me gustaría recibir una visita.']
    ]},
    emociones: {label:'🙂 Cómo me siento', phrases:[
      ['😊','Me siento bien.'],['😔','Estoy triste.'],['😟','Estoy preocupado.'],
      ['😴','Estoy cansado.'],['😨','Tengo miedo.'],['😠','Estoy enojado.'],
      ['💛','Quiero agradecerte algo.'],['🌿','Necesito estar a solas un momento.']
    ]},
    respuestas: {label:'✅ Respuestas', phrases:[
      ['✅','Sí.'],['❌','No.'],['🤔','Tal vez.'],['👂','No entendí.'],
      ['🔁','¿Podés repetirlo?'],['👍','De acuerdo.'],['💭','Prefiero otra cosa.'],
      ['⌛','Ahora no, mejor después.'],['🛑','No quiero hacer eso.']
    ]},
    propias: {label:'✏️ Mis frases', phrases:[]}
  };
  const $ = id => document.getElementById(id);
  const builderCategories = {
    inicio: {label:'1 · Inicio', entries:['Quiero','Necesito','Me gustaría','No quiero','Prefiero','Tengo','Me siento','Hoy quiero','¿Podés','¿Me ayudás a','¿Cuándo podemos','Gracias por']},
    acciones: {label:'2 · Acciones', entries:['hablar','comer','descansar','salir','ir','ver','escuchar música','tomar','llamar','jugar','decir algo','que vengas','que me llames','venir a verme','ayudarme','explicarme','acompañarme','contarte algo']},
    detalles: {label:'3 · Detalles', entries:['sed','hambre','frío','calor','dolor','sueño','un vaso de agua','un café','algo para comer','al baño','al médico','a casa','a pasear','al patio','mi teléfono','la televisión','un momento','un poco más','otro día','por favor','porque estoy cansado','porque lo necesito']},
    personas: {label:'👥 Personas', entries:['con mi hermana','con mi hermano','con mi mamá','con mi papá','con mi familia','con vos','con mis amigos','con mi hija','con mi hijo','con mi cuidador','a mi hermana','a mi hermano','a vos','a mi familia']},
    tiempo: {label:'🕒 Tiempo', entries:['ahora','hoy','mañana','esta tarde','esta noche','después','más tarde','el fin de semana','cuando puedas','por un rato']},
    sentimientos: {label:'❤️ Sentimientos', entries:['bien','mal','triste','contento','cansado','preocupado','tranquilo','solo','acompañado','con miedo','con dolor','mejor']},
    preguntas: {label:'❓ Preguntas', entries:['¿Cómo estás','¿Podemos hablar','¿Podés venir','¿Me escuchás','¿Qué te parece','¿Cuándo nos vemos','¿Tenés un momento','¿Dónde está','¿Me explicás','¿Querés conversar']},
    respuestas: {label:'✅ Respuestas', entries:['Sí','No','Tal vez','No entendí','De acuerdo','No estoy de acuerdo','Muchas gracias','Te quiero','Lo siento','Prefiero otra cosa','Contame más','Repetilo, por favor']},
    propias: {label:'✏️ Mis palabras', entries:[]}
  };
  // V0.3: sugerencias base para la siguiente palabra. '^' = comienzo del mensaje.
  const nextWords = {
    '^':['Quiero','Necesito','Tengo','Me siento','¿Podés','Me gustaría'],
    'Quiero':['hablar','descansar','salir','comer','escuchar música','ir'],
    'Necesito':['ir','descansar','hablar','tomar','un vaso de agua','que vengas'],
    'Me gustaría':['hablar','salir','ir','ver','escuchar música','que vengas'],
    'No quiero':['comer','salir','ir','hablar','descansar','ahora'],
    'Prefiero':['descansar','hablar','salir','más tarde','otro día','después'],
    'Tengo':['sed','hambre','frío','calor','dolor','sueño'],
    'Me siento':['bien','mal','cansado','triste','contento','preocupado'],
    'Hoy quiero':['salir','descansar','hablar','ver','escuchar música','jugar'],
    '¿Podés':['ayudarme','venir a verme','acompañarme','explicarme'],
    '¿Me ayudás a':['ir','comer','tomar','salir','descansar','llamar'],
    '¿Cuándo podemos':['hablar','salir','jugar','ir','ver'],
    'Gracias por':['ayudarme','venir a verme','acompañarme','explicarme'],
    'hablar':['con mi hermana','con mi mamá','con mi familia','con vos','ahora','mañana'],
    'llamar':['a mi hermana','a mi hermano','a mi familia','a vos','ahora','más tarde'],
    'ir':['al baño','al médico','a casa','a pasear','al patio'],
    'salir':['a pasear','al patio','por un rato','esta tarde','con mi familia','hoy'],
    'comer':['algo para comer','ahora','más tarde','con mi familia','un poco más'],
    'tomar':['un vaso de agua','un café','ahora','por favor'],
    'ver':['la televisión','a mi familia','a mi hermana','a mi hermano'],
    'escuchar música':['ahora','por un rato','con vos','esta tarde'],
    'descansar':['un momento','por un rato','ahora','porque estoy cansado','esta noche'],
    'jugar':['con vos','con mis amigos','esta tarde','por un rato'],
    'decir algo':['a mi hermana','a mi familia','a vos','ahora'],
    'contarte algo':['ahora','cuando puedas','hoy'],
    'que vengas':['ahora','hoy','mañana','esta tarde','cuando puedas','por favor'],
    'que me llames':['ahora','hoy','más tarde','esta noche','cuando puedas'],
    'venir a verme':['hoy','mañana','esta tarde','el fin de semana','cuando puedas'],
    'ayudarme':['por favor','ahora','un momento'],
    'acompañarme':['al médico','a pasear','al patio','a casa','por un rato'],
    'dolor':['ahora','un poco más','porque lo necesito'],
    'sed':['por favor','un vaso de agua'],
    'hambre':['algo para comer','por favor'],
    'un vaso de agua':['por favor','ahora'],
    'un café':['por favor','ahora','más tarde'],
    'al baño':['ahora','por favor'],
    'al médico':['mañana','hoy','cuando puedas'],
    'cansado':['hoy','ahora'],
    'triste':['hoy','ahora'],
    'preocupado':['hoy','ahora']
  };
  // Si la última palabra no tiene sugerencias propias, se usa su categoría.
  const nextByCategory = {
    acciones:['ahora','hoy','por favor','con vos','cuando puedas','mañana'],
    detalles:['por favor','ahora','un momento'],
    personas:['ahora','hoy','mañana','esta tarde','cuando puedas','el fin de semana'],
    tiempo:['por favor','con vos','con mi familia'],
    sentimientos:['hoy','ahora','porque estoy cansado'],
    preguntas:['hoy','ahora','mañana','esta tarde','con vos'],
    respuestas:['por favor','Muchas gracias']
  };
  const START='^';
  const holdOptions=[0,500,1000,1500,2000];
  const scanOptions=[0,1000,1500,2000,3000];
  const repeatOptions=[0,500,1000,2000];
  const initial = {contacts:[],selectedContactId:null,ownPhrases:[],message:'',category:'frecuentes',combine:false,large:false,contrast:false,
    tokens:[],punctuation:'.',buildCategory:'inicio',savedMessages:[],customBlocks:[],mode:'build',
    suggest:true,aiReplies:true,pictos:true,cloudVoice:true,learned:{},replyLearned:{},phraseLearned:{},voiceURI:'',rate:.9,pitch:1,volume:1,holdMs:0,repeatMs:0,scanMs:0,lastBackup:0};
  const clampNumber=(value,min,max,fallback)=>typeof value==='number'&&isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
  // V0.4: Telegram. threads = {chatId: [{dir:'in'|'out', text, date}]}; pending = personas que tocaron «Iniciar» y aún no están vinculadas.
  // V0.6: server = {url, pin} cuando Hablemos se conecta a su propio servidor (el token queda en el servidor). seq/pv = hasta dónde se sincronizó.
  const tgInitial=()=>({token:'',server:null,seq:0,pv:-1,bot:null,offset:0,autoRead:true,confirm:true,chime:true,push:false,pending:[],threads:{}});
  const DEFAULT_SERVER_URL='https://hablemos-production.up.railway.app';
  const serverUrlOk=v=>typeof v==='string'&&/^https?:\/\/[^\s/]+(:\d+)?\/?$/.test(v);
  const chatIdOk=v=>typeof v==='string'&&/^-?\d{1,20}$/.test(v);
  let state = {...initial,learned:{},replyLearned:{},phraseLearned:{},tg:tgInitial()};
  function loadStored(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch(e){return null;}
  }
  const STORE_KEY='hablemos.v3';
  // Lee y valida los datos guardados. Se usa al abrir y cuando otra pestaña de Hablemos guarda cambios.
  function applyStored(stored){
    state={...initial,learned:{},replyLearned:{},phraseLearned:{},tg:tgInitial()};
    if(!stored)return;
    if(Array.isArray(stored.contacts)) state.contacts=stored.contacts.filter(x=>x&&typeof x.name==='string'&&typeof x.phone==='string'&&typeof x.id==='string').slice(0,50).map(x=>({id:x.id,name:x.name.slice(0,36),phone:x.phone.replace(/\D/g,''),...(chatIdOk(x.telegramId)?{telegramId:x.telegramId}:{})}));
    const tg=stored.tg;
    const tokenOk=tg&&typeof tg.token==='string'&&/^\d{3,15}:[\w-]{20,80}$/.test(tg.token);
    const serverOk=tg&&tg.server&&serverUrlOk(tg.server.url)&&typeof tg.server.pin==='string'&&tg.server.pin.length>0&&tg.server.pin.length<=128;
    if(tg&&typeof tg==='object'&&!Array.isArray(tg)&&(tokenOk||serverOk)){
      const clean=tgInitial();
      if(serverOk){clean.server={url:tg.server.url.replace(/\/$/,''),pin:tg.server.pin};if(Number.isInteger(tg.seq)&&tg.seq>=0)clean.seq=tg.seq;if(Number.isInteger(tg.pv))clean.pv=tg.pv;if(tg.lastRead&&typeof tg.lastRead==='object'){clean.lastRead={};for(const [k,v] of Object.entries(tg.lastRead).slice(0,60))if(chatIdOk(k)&&Number.isFinite(v))clean.lastRead[k]=v;}if(typeof tg.invite==='string'&&/^[\w-]{8,64}$/.test(tg.invite))clean.invite=tg.invite;clean.synced=tg.synced===true;}
      else clean.token=tg.token;
      if(tg.bot&&typeof tg.bot.username==='string')clean.bot={username:tg.bot.username.slice(0,64),name:String(tg.bot.name||tg.bot.username).slice(0,64),...(Number.isInteger(tg.bot.id)?{id:tg.bot.id}:{})};
      if(Number.isInteger(tg.offset)&&tg.offset>=0)clean.offset=tg.offset;
      if(typeof tg.autoRead==='boolean')clean.autoRead=tg.autoRead;
      if(typeof tg.confirm==='boolean')clean.confirm=tg.confirm;
      if(typeof tg.chime==='boolean')clean.chime=tg.chime;
      if(typeof tg.push==='boolean')clean.push=tg.push;
      if(typeof tg.ai==='boolean')clean.ai=tg.ai;
      if(tg.voice&&typeof tg.voice==='object')clean.voice={diego:tg.voice.diego===true,family:tg.voice.family===true};
      if(Array.isArray(tg.pending))clean.pending=tg.pending.filter(p=>p&&chatIdOk(p.chatId)&&typeof p.name==='string').slice(0,20).map(p=>({chatId:p.chatId,name:p.name.slice(0,64),username:typeof p.username==='string'?p.username.slice(0,64):''}));
      if(tg.threads&&typeof tg.threads==='object'){
        for(const [chatId,list] of Object.entries(tg.threads).slice(0,30)){
          if(!chatIdOk(chatId)||!Array.isArray(list))continue;
          clean.threads[chatId]=list.filter(m=>m&&(m.dir==='in'||m.dir==='out')&&typeof m.text==='string'&&Number.isFinite(m.date)).slice(-100).map(m=>({dir:m.dir,text:m.text.slice(0,4096),date:m.date,...(Number.isInteger(m.id)?{id:m.id}:{}),...(m.audio&&Number.isFinite(m.audio.d)?{audio:{d:m.audio.d}}:{})}));
        }
      }
      state.tg=clean;
    }
    if(Array.isArray(stored.ownPhrases)) state.ownPhrases=stored.ownPhrases.filter(x=>typeof x==='string'&&x.length<=200).slice(0,100);
    if(typeof stored.message==='string')state.message=stored.message.slice(0,1000);
    if(typeof stored.selectedContactId==='string')state.selectedContactId=stored.selectedContactId;
    if(data[stored.category])state.category=stored.category;
    state.combine=!!stored.combine;state.large=!!stored.large;state.contrast=!!stored.contrast;
    if(Array.isArray(stored.tokens))state.tokens=stored.tokens.filter(x=>typeof x==='string'&&x.length<=80).slice(0,40);
    if(['.','?','!'].includes(stored.punctuation))state.punctuation=stored.punctuation;
    if(builderCategories[stored.buildCategory])state.buildCategory=stored.buildCategory;
    if(Array.isArray(stored.customBlocks))state.customBlocks=stored.customBlocks.filter(x=>typeof x==='string'&&x.trim()&&x.length<=80).slice(0,80);
    if(Array.isArray(stored.savedMessages))state.savedMessages=stored.savedMessages.filter(x=>typeof x==='string'&&x.trim()&&x.length<=1000).slice(0,60);
    if(['build','quick','saved'].includes(stored.mode))state.mode=stored.mode;
    if(typeof stored.suggest==='boolean')state.suggest=stored.suggest;
    if(typeof stored.aiReplies==='boolean')state.aiReplies=stored.aiReplies;
    if(typeof stored.cloudVoice==='boolean')state.cloudVoice=stored.cloudVoice;
    if(typeof stored.pictos==='boolean')state.pictos=stored.pictos;
    if(stored.phraseLearned&&typeof stored.phraseLearned==='object'&&!Array.isArray(stored.phraseLearned)){
      for(const [key,counts] of Object.entries(stored.phraseLearned).slice(0,150)){
        if(key.length>200||!counts||typeof counts!=='object')continue;
        const clean={};for(const [p,n] of Object.entries(counts).slice(0,8))if(p.length<=140&&Number.isInteger(n)&&n>0)clean[p]=Math.min(n,999);
        state.phraseLearned[key]=clean;
      }
    }
    if(stored.replyLearned&&typeof stored.replyLearned==='object'&&!Array.isArray(stored.replyLearned)){
      for(const [intent,counts] of Object.entries(stored.replyLearned).slice(0,40)){
        if(!/^[a-z-]{2,20}$/.test(intent)||!counts||typeof counts!=='object')continue;
        const clean={};for(const [r,n] of Object.entries(counts).slice(0,30))if(r.length<=120&&Number.isInteger(n)&&n>0)clean[r]=Math.min(n,999);
        state.replyLearned[intent]=clean;
      }
    }
    if(stored.learned&&typeof stored.learned==='object'&&!Array.isArray(stored.learned)){
      const learned={};
      for(const [prev,nexts] of Object.entries(stored.learned).slice(0,400)){
        if(prev.length>80||!nexts||typeof nexts!=='object'||Array.isArray(nexts))continue;
        const clean={};
        for(const [word,count] of Object.entries(nexts).slice(0,40)){
          if(word.length<=80&&Number.isInteger(count)&&count>0)clean[word]=Math.min(count,999);
        }
        if(Object.keys(clean).length)learned[prev]=clean;
      }
      state.learned=learned;
    }
    if(typeof stored.voiceURI==='string')state.voiceURI=stored.voiceURI.slice(0,300);
    state.rate=clampNumber(stored.rate,.5,1.5,state.rate);
    state.pitch=clampNumber(stored.pitch,.5,1.5,state.pitch);
    state.volume=clampNumber(stored.volume,.1,1,state.volume);
    if(holdOptions.includes(stored.holdMs))state.holdMs=stored.holdMs;
    if(repeatOptions.includes(stored.repeatMs))state.repeatMs=stored.repeatMs;
    if(scanOptions.includes(stored.scanMs))state.scanMs=stored.scanMs;
    if(Number.isFinite(stored.lastBackup)&&stored.lastBackup>0)state.lastBackup=stored.lastBackup;
  }
  applyStored(loadStored(STORE_KEY)||loadStored('hablemos.v2')||loadStored('hablemos.v1'));
  // Conserva los datos que esta versión no conoce (por ejemplo, guardados por una versión más nueva en otra pestaña).
  function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify({...(loadStored(STORE_KEY)||{}),...state}));}catch(e){notify('No hay espacio para guardar preferencias.');}}
  let toastTimer;
  function notify(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},3000);}
  // ===== V0.8: pantalla simple para manos con poca movilidad =====
  // Todo entra en una sola pantalla, sin desplazarse: el mensaje arriba, un tablero de botones grandes y tres acciones fijas abajo.
  // El tablero cambia según lo que se va armando (sugerencias) y se recorre con botones grandes, nunca deslizando.
  let view='main',page=0;
  function setMessage(text){state.message=String(text||'').slice(0,1000);state.tokens=[];persist();renderScreen();}
  function composeTokens(){
    if(!state.tokens.length)return '';
    let s=state.tokens.join(' ').replace(/\s+/g,' ').trim();
    if(!s)return '';
    if(state.punctuation==='.' && (s.startsWith('¿')||s.startsWith('¡')))s=s.slice(1);
    if(state.punctuation==='?' && !s.startsWith('¿'))s='¿'+s.replace(/^¡/,'');
    if(state.punctuation==='!' && !s.startsWith('¡'))s='¡'+s.replace(/^¿/,'');
    s=s.replace(/[.!?]+$/g,'');
    return s+state.punctuation;
  }
  function updateBuilt(){state.message=composeTokens();persist();renderScreen();}
  function addBlock(word){
    if(state.tokens.length>=40){notify('El mensaje ya es muy largo.');return;}
    state.tokens.push(word);
    if(state.tokens.length===1)state.punctuation=word.startsWith('¿')?'?':word.startsWith('¡')?'!':'.';
    if(composeTokens().length>1000){state.tokens.pop();notify('El mensaje llegó al máximo.');return;}
    view='main';page=0; // después de elegir una palabra, vuelven las sugerencias para seguir
    updateBuilt();
  }
  // Borrar: quita la última palabra; si el mensaje vino de una frase, la borra entera.
  function eraseLast(){
    if(state.tokens.length){state.tokens.pop();state.message=composeTokens();}
    else state.message='';
    persist();renderScreen();
  }
  function categoryOf(word){
    for(const [key,meta] of Object.entries(builderCategories))if(meta.entries.includes(word))return key;
    return state.customBlocks.includes(word)?'propias':null;
  }
  function getSuggestions(limit=6){
    const prev=state.tokens.length?state.tokens[state.tokens.length-1]:START;
    const used=new Set(state.tokens);
    const learned=Object.entries(state.learned[prev]||{}).sort((a,b)=>b[1]-a[1]).map(([word])=>word);
    const base=nextWords[prev]||nextByCategory[categoryOf(prev)]||['por favor','ahora','hoy'];
    const result=[];
    for(const word of learned)if(!used.has(word)&&result.length<Math.min(4,limit))result.push({word,learned:true});
    for(const word of base)if(!used.has(word)&&!result.some(x=>x.word===word)&&result.length<limit)result.push({word,learned:false});
    return result;
  }
  // ===== V1.0: respuestas sugeridas según el mensaje que llegó =====
  // Reconoce el tipo de mensaje (hora, cuándo, cómo estás, visita, comida…) y ofrece respuestas listas para tocar.
  // Funciona sin internet. Las respuestas que Diego elige más seguido aparecen primero.
  const normText=t=>String(t||'').toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[¡!¿.,;:()"“”«»]/g,' ').replace(/\s+/g,' ').trim();
  const replySubs={
    'hora-manana':['A las 8 de la mañana','A las 9 de la mañana','A las 10 de la mañana','A las 11 de la mañana','A las 12 del mediodía'],
    'hora-noche':['A las 7 de la tarde','A las 8 de la noche','A las 9 de la noche','A las 10 de la noche']
  };
  const replyIntents=[
    ['hora',/\b(a que hora|que hora|horario|a que hs)\b/,['A las 3 de la tarde','A las 4 de la tarde','A las 5 de la tarde','A las 6 de la tarde','Hoy no','Mañana',{label:'A la mañana…',sub:'hora-manana',icon:'🌅'},{label:'A la noche…',sub:'hora-noche',icon:'🌙'},'No sé, después te digo']],
    ['cuando',/\b(cuando|que dia|que fecha|para cuando)\b/,['Hoy','Mañana','Pasado mañana','Esta tarde','Esta noche','El fin de semana','La semana que viene','No sé, después te digo']],
    ['dormir',/\b(dormiste|descansaste|dormis|dormir|sueno)\b/,['Sí, dormí bien','Más o menos','Dormí mal','Tengo sueño','Me desperté varias veces']],
    ['estado',/\b(como (estas|andas|te sentis|te sientes|amaneciste|dormiste|te fue|va|anda|seguis|estuvo|te encontras)|todo bien|que tal)\b/,['Bien, ¿y vos?','Muy bien','Más o menos','Cansado','Me duele algo','Mal, necesito ayuda']],
    ['dolor',/\b(duele|dolor|molest)/,['Sí, me duele','No, estoy bien','Un poco','Mucho, necesito ayuda']],
    ['medicacion',/\b(remedio|pastilla|medicacion|medicamento)/,['Sí, ya la tomé','Todavía no','¿Me ayudás a tomarla?','Me la olvidé']],
    ['donde',/\b(donde|adonde)\b/,['En casa','En mi cuarto','En el living','En el médico','Afuera','No sé']],
    ['quien',/\b(quien|quienes)\b/,['Mamá','Papá','Mi hermana','Mi hermano','Un amigo','No sé']],
    ['cantidad',/\b(cuant[oa]s?)\b/,['Uno','Dos','Tres','Pocos','Muchos','No sé']],
    ['comer',/\b(comer|comiste|almorzar|almorzaste|cenar|cenaste|desayun|merend|hambre|comida)/,['Sí, tengo hambre','No, gracias','Algo liviano','Ya comí','Después']],
    ['tomar',/\b(tomar|tomaste|sed|agua|cafe|mate|jugo)\b/,['Agua, por favor','Un café','Un mate','No, gracias','Después']],
    ['visita',/\b(voy|vamos|paso|vengo|venir|visit|ir a verte|ir a tu casa|nos vemos)/,['¡Sí, vení!','Te espero','Hoy no puedo','Mejor mañana','Avisame antes de venir','¡Qué alegría!']],
    ['llamar',/\b(llamo|llamar|llamada|videollamada)/,['Sí, llamame','Ahora no puedo','Más tarde','Mejor por mensaje']],
    ['salud',/\b(medico|medica|turno|doctor|doctora|consulta|kinesio|terapia|hospital|clinica|estudios?)\b/,['Sí, me acuerdo','¿A qué hora es?','¿Me acompañás?','No quiero ir','Gracias por avisarme']],
    ['querer',/\b(queres|quieres|necesitas|te gustaria|preferis|te parece|tenes ganas)\b/,['Sí','No','Sí, por favor','No, gracias','Tal vez','Después']],
    ['saludo',/^(hola|buen dia|buenos dias|buenas tardes|buenas noches|buenas)\b/,['¡Hola! ¿Cómo estás?','Hola, todo bien','Hola, te extraño','Hola, ¿venís hoy?']],
    ['gracias',/\bgracias\b/,['De nada','Con gusto','Gracias a vos']],
    ['carino',/\b(te quiero|te amo|te extrano|beso|abrazo)/,['Yo también te quiero','Te extraño mucho','Un beso grande','Un abrazo fuerte']],
    ['despedida',/\b(chau|hasta (luego|manana|pronto)|nos hablamos)\b/,['Chau, un beso','Hasta mañana','Que descanses']]
  ];
  const yesNoStart=/^(estas|esta|tenes|tiene|podes|puede|puedo|hay|es|vas|venis|fuiste|hiciste|sabes|te acordas|dormiste|comiste)\b/;
  function replyOptions(text){
    const n=normText(text);
    const question=/\?/.test(text)||yesNoStart.test(n);
    const matched=replyIntents.filter(([,re])=>re.test(n));
    let intent=matched.length?matched[0][0]:question?'si-no':n?'info':'inicio';
    const out=[];const seen=new Set();
    const add=o=>{const k=typeof o==='string'?o:o.label;if(!seen.has(k)&&out.length<12){seen.add(k);out.push(o);}};
    // Primero, las que Diego ya eligió para este tipo de mensaje.
    Object.entries(state.replyLearned[intent]||{}).sort((a,b)=>b[1]-a[1]).slice(0,3).forEach(([r])=>add(r));
    // Solo el tipo principal: mezclar tipos confunde (por ejemplo «tomar la pastilla» no es «tomar agua»).
    if(matched.length)matched[0][2].forEach(add);
    if(intent==='si-no')['Sí','No','Tal vez','No sé'].forEach(add);
    if(intent==='info')['¡Qué bueno!','Ok, gracias','Entendido','¡Qué lindo!','Qué pena','Contame más'].forEach(add);
    if(intent==='inicio')['¡Hola! ¿Cómo estás?','Te extraño','¿Venís hoy?','Llamame, por favor'].forEach(add);
    // Si hacen falta, se completan hasta 6 con respuestas generales.
    for(const o of question?['Sí','No','No sé','Después te digo']:['Ok','Gracias','Después te digo'])if(out.length<6)add(o);
    return {intent,options:out};
  }
  function audioReplyOptions(){
    const out=[];const seen=new Set();
    Object.entries(state.replyLearned.audio||{}).sort((a,b)=>b[1]-a[1]).slice(0,3).forEach(([r])=>{if(!seen.has(r)){seen.add(r);out.push(r);}});
    for(const r of ['Ya lo escuché, gracias','Sí','No','¿Me lo podés escribir?','No se escuchó bien','Después te contesto'])if(!seen.has(r)&&out.length<8){seen.add(r);out.push(r);}
    return {intent:'audio',options:out};
  }
  function learnReply(intent,text){
    const counts=state.replyLearned[intent]||(state.replyLearned[intent]={});
    if(!(text in counts)&&Object.keys(counts).length>=30)delete counts[Object.entries(counts).sort((a,b)=>a[1]-b[1])[0][0]];
    counts[text]=Math.min((counts[text]||0)+1,999);
  }
  const lastIncoming=c=>(state.tg.threads[c.telegramId]||[]).filter(m=>m.dir==='in').at(-1)||null;
  // Respuestas sugeridas por inteligencia artificial (Claude, desde el servidor). Si no hay, tardan o fallan,
  // quedan las respuestas por reglas: Diego nunca se queda sin opciones.
  const aiCache=new Map();
  const aiOn=()=>isServer()&&state.tg.ai===true&&state.aiReplies;
  function aiFor(c,last){
    if(!aiOn()||!last)return null;
    const key=c.telegramId+':'+(last.id||last.date);
    if(aiCache.has(key))return aiCache.get(key);
    const entry={status:'loading',replies:[]};aiCache.set(key,entry);
    if(aiCache.size>50)aiCache.delete(aiCache.keys().next().value);
    srvCall('/api/suggest',{method:'POST',body:{chatId:c.telegramId}})
      .then(r=>{entry.status='done';entry.replies=(Array.isArray(r.replies)?r.replies:[]).filter(x=>typeof x==='string'&&x.trim()).slice(0,6);})
      .catch(()=>{entry.status='error';})
      .finally(()=>{if(view.startsWith('reply:'+c.id))renderBoard();});
    return entry;
  }
  // ===== V2.0: completar frases con IA =====
  // Desde la segunda palabra, la primera fila del tablero ofrece frases enteras que empiezan así.
  // Esos lugares quedan reservados mientras la IA piensa («Pensando…»), para que los botones no se muevan bajo el dedo.
  // Las frases que Diego elige se aprenden y aparecen primero, también sin internet.
  const completeCache=new Map();let completeTimer=null,completePending=null;
  const aiPhrasesOn=()=>aiOn()&&navigator.onLine;
  function contextContact(){
    // La persona que escribió hace poco (últimas 6 horas): la IA tiene en cuenta su último mensaje.
    let best=null,bestDate=Date.now()-6*3600e3;
    for(const c of tgContacts()){const m=lastIncoming(c);if(m&&!m.audio&&m.date>bestDate){best=c;bestDate=m.date;}}
    return best;
  }
  function phraseTiles(){
    const words=state.tokens.join(' ');const key=normText(words);
    const slots=boardCols()>=3?3:2;
    const out=[],seen=new Set();
    const push=(p,ai)=>{const n=normText(p);if(!n||n===key||seen.has(n)||out.length>=slots)return;seen.add(n);out.push(tile('phrase',p,()=>choosePhrase(p,key),ai?'✨':'⭐'));};
    Object.entries(state.phraseLearned[key]||{}).sort((a,b)=>b[1]-a[1]).forEach(([p])=>push(p,false));
    if(!aiPhrasesOn()||out.length>=slots)return out;
    const c=contextContact();const ckey=key+'|'+(c?c.telegramId+':'+(lastIncoming(c).id||''):'');
    let e=completeCache.get(ckey);
    if(!e){
      // Se espera un momento a que Diego deje de tocar palabras antes de pedir.
      if(completePending&&completePending!==ckey&&(completeCache.get(completePending)||{}).status==='wait')completeCache.delete(completePending);
      clearTimeout(completeTimer);
      e={status:'wait',phrases:[]};completeCache.set(ckey,e);completePending=ckey;
      if(completeCache.size>80)completeCache.delete(completeCache.keys().next().value);
      completeTimer=setTimeout(()=>fetchComplete(e,words,c),700);
    }
    if(e.status==='done')e.phrases.forEach(p=>push(p,true));
    else if(e.status==='wait'||e.status==='loading')while(out.length<slots)out.push(tile('aiwait','Pensando frases…',()=>{},'✨'));
    return out;
  }
  function fetchComplete(e,words,c){
    e.status='loading';
    srvCall('/api/complete',{method:'POST',body:{words,chatId:c?c.telegramId:''}})
      .then(r=>{e.status='done';e.phrases=(Array.isArray(r.phrases)?r.phrases:[]).filter(x=>typeof x==='string'&&x.trim()).slice(0,4);})
      .catch(()=>{e.status='error';})
      .finally(()=>{if(view==='main')renderBoard();});
  }
  function choosePhrase(p,key){
    const counts=state.phraseLearned[key]||(state.phraseLearned[key]={});
    if(!(p in counts)&&Object.keys(counts).length>=8)delete counts[Object.entries(counts).sort((a,b)=>a[1]-b[1])[0][0]];
    counts[p]=Math.min((counts[p]||0)+1,999);
    const keys=Object.keys(state.phraseLearned);if(keys.length>150)delete state.phraseLearned[keys[0]];
    selectPhrase(p);
  }
  function openReply(c){state.selectedContactId=c.id;markRead(c);persist();view='reply:'+c.id;page=0;renderScreen();}
  // Elegir una respuesta abre «¿A quién se lo mando?» con esa persona primero: responder son dos toques.
  function chooseReply(text,c,intent){
    learnReply(intent,text);
    state.selectedContactId=c.id;view='main';page=0;
    setMessage(text);
    openSendSheet();
  }
  // Aprende el orden de las palabras solo cuando el mensaje se usa (hablar, enviar o guardar).
  let lastLearned='';
  function learnFromMessage(){
    if(!state.tokens.length||state.message!==composeTokens())return;
    const key=state.tokens.join('\u0001');
    if(key===lastLearned)return;
    lastLearned=key;
    let prev=START;
    for(const word of state.tokens){
      if(!state.learned[prev]){
        if(Object.keys(state.learned).length>=400){prev=word;continue;}
        state.learned[prev]={};
      }
      const nexts=state.learned[prev];
      if(!(word in nexts)&&Object.keys(nexts).length>=40){
        const weakest=Object.entries(nexts).sort((a,b)=>a[1]-b[1])[0][0];delete nexts[weakest];
      }
      nexts[word]=Math.min((nexts[word]||0)+1,999);
      prev=word;
    }
    persist();
  }
  // Una frase completa se dice en voz alta al tocarla: un solo toque para lo más urgente.
  function selectPhrase(phrase){setMessage(phrase);view='main';page=0;renderScreen();talk(phrase,'diego');}
  function saveCurrent(){
    const m=state.message.trim();if(!m){notify('Primero armá un mensaje.');return;}
    learnFromMessage();
    if(state.savedMessages.includes(m)){notify('Este mensaje ya estaba guardado.');return;}
    state.savedMessages.unshift(m);state.savedMessages=state.savedMessages.slice(0,60);persist();notify('Mensaje guardado');renderScreen();
  }
  function selected(){return state.contacts.find(c=>c.id===state.selectedContactId)||null;}
  const tgContacts=()=>tgReady()?state.contacts.filter(c=>c.telegramId):[];
  function unreadCount(c){
    const seen=(state.tg.lastRead||{})[c.telegramId]||0;
    return (state.tg.threads[c.telegramId]||[]).filter(m=>m.dir==='in'&&m.date>seen).length;
  }
  function markRead(c){state.tg.lastRead={...(state.tg.lastRead||{}),[c.telegramId]:Date.now()};persist();}
  function go(next){view=next;page=0;renderBoard();}
  function openChat(c){view='chat:'+c.id;page=0;markRead(c);renderScreen();}
  const folderMeta={inicio:['▶️','Para empezar'],acciones:['🏃','Acciones'],detalles:['🧩','Cosas y lugares'],personas:['👥','Personas'],tiempo:['🕒','Cuándo'],sentimientos:['❤️','Sentimientos'],preguntas:['❓','Preguntas'],respuestas:['✅','Respuestas'],propias:['✏️','Mis palabras']};
  const phraseFolders=[['cuidados','🧡','Cuidados'],['conversar','💬','Conversar'],['emociones','🙂','Cómo me siento'],['respuestas','✅','Respuestas'],['propias','✏️','Mis frases']];
  const tile=(kind,label,onTap,icon='',extra='')=>({kind,label,onTap,icon,extra});
  const backTo=target=>tile('back','Volver',()=>go(target),'◀');
  function boardItems(){
    if(view==='main'){
      const items=[];
      if(!state.tokens.length){
        items.push(tile('folder','Frases rápidas',()=>go('phrases'),'⭐'));
        const chats=tgContacts();
        if(chats.length){
          const unread=chats.reduce((n,c)=>n+unreadCount(c),0);
          items.push(tile('folder',chats.length===1?'Mensajes de '+chats[0].name:'Mensajes',()=>chats.length===1?openChat(chats[0]):go('people'),'💬',unread?unread+(unread===1?' nuevo':' nuevos'):''));
        }
      }
      if(state.tokens.length>=2)items.push(...phraseTiles());
      if(state.suggest)for(const {word,learned} of getSuggestions(state.tokens.length?8:6))items.push(tile(learned?'learned':'word',word,()=>addBlock(word)));
      items.push(tile('folder',state.suggest?'Más palabras':'Palabras',()=>go('folders'),'📂'));
      return items;
    }
    if(view==='folders'){
      const items=[backTo('main')];
      for(const [key,meta] of Object.entries(builderCategories)){
        if(key==='propias'&&!state.customBlocks.length)continue;
        const [icon,name]=folderMeta[key]||['📁',meta.label];
        items.push(tile('folder',name,()=>go('cat:'+key),icon));
      }
      items.push(tile('folder','Frases rápidas',()=>go('phrases'),'⭐'));
      if(state.savedMessages.length)items.push(tile('folder','Guardadas',()=>go('saved'),'💾'));
      if(state.message.trim())items.push(tile('nav','Guardar este mensaje',saveCurrent,'☆'));
      return items;
    }
    if(view.startsWith('cat:')){
      const key=view.slice(4);const words=key==='propias'?state.customBlocks:(builderCategories[key]||{entries:[]}).entries;
      return [backTo('folders'),...words.map(w=>tile('word',w,()=>addBlock(w)))];
    }
    if(view==='phrases'||view.startsWith('pcat:')){
      const key=view==='phrases'?'frecuentes':view.slice(5);
      const list=key==='propias'?state.ownPhrases.map(x=>['🗣️',x]):(data[key]||{phrases:[]}).phrases;
      const items=[backTo(view==='phrases'?'main':'phrases'),...list.map(([icon,text])=>tile('phrase',text,()=>selectPhrase(text),icon))];
      if(view==='phrases')for(const [k,icon,name] of phraseFolders){if(k==='propias'&&!state.ownPhrases.length)continue;items.push(tile('folder',name,()=>go('pcat:'+k),icon));}
      return items;
    }
    if(view==='saved')return [backTo('folders'),...state.savedMessages.map(m=>tile('phrase',m,()=>selectPhrase(m),'💾'))];
    if(view.startsWith('reply:')){
      const [,cid,sub]=view.split(':');
      const c=state.contacts.find(x=>x.id===cid&&x.telegramId);
      if(!c){view='main';return boardItems();}
      const last=lastIncoming(c);
      const {intent,options}=last&&last.audio?audioReplyOptions():replyOptions(last?last.text:'');
      const items=[last&&last.audio
        ?tile('quote',c.name+' te mandó un audio'+(last.audio.d?' ('+last.audio.d+' s)':'')+'. Tocá para escucharlo',()=>playAudio(c,last),'▶')
        :tile('quote',last?c.name+': «'+last.text+'»':'Escribile a '+c.name,()=>{if(last)talk(c.name+' dice: '+last.text);},'🔊'),backTo(sub?'reply:'+cid:'main')];
      if(sub&&replySubs[sub])for(const r of replySubs[sub])items.push(tile('reply',r,()=>chooseReply(r,c,intent)));
      else{
        const aiState=aiFor(c,last);
        const shown=new Set();
        if(aiState&&aiState.status==='loading')items.push(tile('nav','Pensando respuestas…',()=>notify('Un momento: estoy pensando respuestas.'),'✨'));
        if(aiState&&aiState.status==='done')for(const r of aiState.replies){shown.add(normText(r));items.push(tile('reply',r,()=>chooseReply(r,c,intent),'✨'));}
        // Cuando llegan las respuestas de la IA, las de reglas se ocultan: menos opciones, pantalla más clara.
        // Siguen apareciendo mientras la IA piensa, si falla o si no hay internet.
        const aiReady=aiState&&aiState.status==='done'&&aiState.replies.length>0;
        for(const o of aiReady?[]:options){
          if(typeof o==='string'&&shown.has(normText(o)))continue;
          if(typeof o==='string')items.push(tile('reply',o,()=>chooseReply(o,c,intent)));
          else items.push(tile('folder',o.label,()=>go('reply:'+cid+':'+o.sub),o.icon||'📂'));
        }
        items.push(tile('folder','Otra respuesta',()=>{state.selectedContactId=c.id;persist();go('main');notify('Armá tu respuesta para '+c.name);},'✍'));
      }
      return items;
    }
    if(view==='people')return [backTo('main'),...tgContacts().map(c=>{const n=unreadCount(c);return tile('folder',c.name,()=>openChat(c),'👤',n?n+(n===1?' nuevo':' nuevos'):'');})];
    view='main';return boardItems();
  }
  function boardCols(){const w=$('board').clientWidth;return w>=900?4:w>=560?3:2;}
  function tileHeight(){return Math.round(88*(state.large?1.15:1));}
  // ===== V1.5: íconos de línea (Tabler Icons, MIT) y colores por tipo de palabra =====
  // Estilo adulto y sobrio: un ícono simple por palabra o frase, sin dibujos infantiles ni emojis.
  const ICONS=window.HABLEMOS_ICONS||{},ICON_FOR=window.HABLEMOS_ICON_FOR||{};
  // Los botones de la interfaz traen un símbolo; acá se traduce al ícono equivalente.
  const SYMBOL_ICON={'⭐':'star','💬':'messages','📂':'folder','◀':'chevron-left','▶':'chevron-right','✍':'pencil','✨':'sparkles','🔊':'volume','🌅':'sunrise','🌙':'moon',
    '👤':'user','💾':'bookmark','☆':'star','▶️':'player-play','🏃':'run','🧩':'box','👥':'users','🕒':'clock','❤️':'heart','❓':'help-circle','✅':'circle-check',
    '✏️':'pencil','🧡':'heart','🙂':'mood-smile','✈':'brand-telegram','🟢':'brand-whatsapp','🗣️':'message-circle'};
  function svgIcon(name,cls='ico'){
    const inner=ICONS[name];if(!inner)return null;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
    svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.setAttribute('class',cls);
    svg.innerHTML=inner;return svg;
  }
  const catClass=label=>{const k=categoryOf(label);return k?' cat-'+k:'';};
  function makeTile(t){
    const b=document.createElement('button');b.type='button';
    const isWord=t.kind==='word'||t.kind==='learned';
    b.className='tile '+t.kind+(isWord?catClass(t.label):'');
    const name=(state.pictos&&(isWord||t.kind==='phrase'||t.kind==='reply')?ICON_FOR[t.label]:null)||(t.icon?SYMBOL_ICON[t.icon]:null);
    const icon=name&&(state.pictos||!isWord)?svgIcon(name):null;
    if(icon){b.append(icon);b.classList.add('has-icon');}
    const l=document.createElement('span');l.className='lbl';l.textContent=t.label;b.append(l);
    if(t.extra){const x=document.createElement('span');x.className='badge';x.textContent=t.extra;b.append(x);}
    if(t.kind==='learned'){const st=svgIcon('star','mark');if(st)b.append(st);}
    b.setAttribute('aria-label',(t.kind==='aiwait'?'':t.kind==='phrase'&&t.icon==='✨'?'Frase sugerida: ':t.kind==='word'||t.kind==='learned'?'Agregar: ':t.kind==='reply'?'Responder: ':t.kind==='quote'?'Escuchar: ':'')+t.label+(t.extra?', '+t.extra:''));
    b.addEventListener('click',t.onTap);
    return b;
  }
  // Íconos fijos de la pantalla (ayuda, configuración, borrar, hablar, enviar…): <span data-i="nombre">.
  function paintStaticIcons(){
    document.querySelectorAll('[data-i]').forEach(el=>{if(el.firstChild&&el.firstChild.nodeName==='svg')return;const i=svgIcon(el.dataset.i,'ui');if(i)el.prepend(i);});
  }
  function renderBoard(){
    const root=$('board');root.replaceChildren();
    root.classList.toggle('is-chat',view.startsWith('chat:'));
    if(view.startsWith('chat:')){renderChatView(root);return;}
    const items=boardItems();
    const cols=boardCols();
    const gap=8,rows=Math.max(2,Math.floor((root.clientHeight+gap)/(tileHeight()+gap)));
    const cap=cols*rows;
    // Lo que va fijo arriba en cada página: el mensaje citado (una fila entera) y «Volver».
    let lead=0;while(lead<items.length&&(items[lead].kind==='quote'||items[lead].kind==='back'))lead++;
    const pinned=items.slice(0,lead),rest=items.slice(lead);
    const pinnedSlots=pinned.reduce((n,t)=>n+(t.kind==='quote'?cols:1),0);
    let pages=[items];
    if(pinnedSlots+rest.length>cap){
      // Se pasa de página con un botón grande «Más», siempre en el mismo lugar.
      const per=Math.max(1,cap-pinnedSlots-1);
      pages=[];for(let i=0;i<rest.length;i+=per)pages.push([...pinned,...rest.slice(i,i+per)]);
    }
    page=page%pages.length;
    const shown=pages[page].slice();
    if(pages.length>1)shown.push(tile('nav','Más ('+(page+1)+' de '+pages.length+')',()=>{page=(page+1)%pages.length;renderBoard();},'▶'));
    // Con pocos botones, cada uno crece para aprovechar el espacio (más fácil de tocar), hasta un tope.
    const quoteRows=shown.filter(t=>t.kind==='quote').length;
    const used=Math.max(1,quoteRows+Math.ceil((shown.length-quoteRows)/cols));
    const rowH=Math.min(Math.round(tileHeight()*1.9),Math.floor((root.clientHeight-gap*(used-1))/used));
    root.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
    root.style.gridTemplateRows='repeat('+used+','+Math.max(tileHeight(),rowH)+'px)';
    for(const t of shown)root.append(makeTile(t));
  }
  function renderChatView(root){
    const c=state.contacts.find(x=>'chat:'+x.id===view);
    if(!c||!c.telegramId){view='main';renderBoard();return;}
    root.style.gridTemplateColumns='';root.style.gridTemplateRows='';
    const title=document.createElement('h2');title.className='chat-title';title.textContent=c.name;
    const thread=document.createElement('div');thread.className='chat-thread big';
    const list=(state.tg.threads[c.telegramId]||[]).slice(-20);
    if(!list.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay mensajes con '+c.name+'.';thread.append(p);}
    for(const m of list){
      const row=document.createElement('div');row.className='bubble '+m.dir;
      const who=document.createElement('small');who.textContent=(m.dir==='in'?c.name:'Yo')+' · '+formatTime(m.date);
      const text=document.createElement('p');text.textContent=m.audio?audioLabel(m):m.text;
      row.append(who,text);
      if(m.dir==='in'){
        const say=document.createElement('button');say.type='button';say.className='bubble-say'+(m.audio?' audio':'');
        const si=svgIcon(m.audio?'player-play':'volume','ui');if(si)say.append(si);say.append(document.createTextNode(m.audio?' Escuchar audio':' Escuchar'));
        say.setAttribute('aria-label',(m.audio?'Escuchar audio de ':'Escuchar mensaje de ')+c.name);
        say.addEventListener('click',()=>m.audio?playAudio(c,m):talk(m.text));row.append(say);
      }
      thread.append(row);
    }
    const actions=document.createElement('div');actions.className='chat-actions';
    actions.append(makeTile(tile('back','Volver',()=>go('main'),'◀')),makeTile(tile('folder','Responder',()=>openReply(c),'✍')));
    root.append(title,thread,actions);
    thread.scrollTop=thread.scrollHeight;
    markRead(c);
  }
  function renderMessageStrip(){
    const el=$('msgStrip');const has=!!state.message.trim();
    el.textContent=has?state.message:'Tocá las palabras para armar tu mensaje';
    el.classList.toggle('empty',!has);
    el.classList.toggle('long',state.message.length>70);
    el.setAttribute('aria-label',has?'Mensaje: '+state.message+'. Tocar para escucharlo':'Todavía no hay mensaje');
    for(const id of ['speakBtn','sendBtn'])$(id).classList.toggle('dim',!has);
    $('eraseBtn').classList.toggle('dim',!has);
  }
  function renderScreen(){renderMessageStrip();renderBoard();updateBadge();}
  function updateBadge(){
    if(!('setAppBadge' in navigator))return;
    const total=tgContacts().reduce((n,c)=>n+unreadCount(c),0);
    (total?navigator.setAppBadge(total):navigator.clearAppBadge()).catch(()=>{});
  }
  // Compatibilidad con el resto del código, que avisa cuando cambian contactos o conversaciones.
  const renderSelectedContact=()=>renderScreen();
  function renderContactList(){
    $('contactsInvite').hidden=!(tgReady()&&state.tg.bot);
    const root=$('contactsList');root.replaceChildren();
    if(!state.contacts.length){const p=document.createElement('p');p.className='muted';p.textContent='No hay contactos guardados todavía.';root.append(p);return;}
    for(const c of state.contacts){
      const row=document.createElement('div');row.className='contactline';
      const b=document.createElement('button');b.type='button';b.className='pick';
      const title=document.createElement('strong');title.textContent=(state.selectedContactId===c.id?'✓ ':'')+c.name;
      const sub=document.createElement('small');sub.textContent=[c.phone?'+'+c.phone:'',c.telegramId?'✈ Telegram':''].filter(Boolean).join(' · ');b.append(title,sub);
      b.addEventListener('click',()=>{state.selectedContactId=c.id;persist();renderSelectedContact();$('contactsDialog').close();notify('Contacto elegido: '+c.name);});
      const del=document.createElement('button');del.type='button';del.className='delete';del.textContent='✕';del.setAttribute('aria-label','Eliminar '+c.name);
      del.addEventListener('click',()=>{if(!window.confirm('¿Eliminar a '+c.name+' de tus contactos?'))return;state.contacts=state.contacts.filter(x=>x.id!==c.id);if(c.telegramId)delete state.tg.threads[c.telegramId];if(state.selectedContactId===c.id)state.selectedContactId=null;persist();renderContactList();renderSelectedContact();});
      row.append(b,del);root.append(row);
    }
  }
  const hasVoice=()=>'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  function spanishVoices(){
    if(!hasVoice())return [];
    const voices=window.speechSynthesis.getVoices();
    const spanish=voices.filter(v=>v.lang.toLowerCase().startsWith('es'));
    const rank=v=>v.lang.toLowerCase().replace('_','-')==='es-ar'?0:/^es[-_](419|us|mx|uy|cl|co)/i.test(v.lang)?1:2;
    return (spanish.length?spanish:voices).slice().sort((a,b)=>(isMale(b)-isMale(a))||(voiceQuality(b)-voiceQuality(a))||rank(a)-rank(b)||(b.localService-a.localService)||a.name.localeCompare(b.name));
  }
  // Calidad estimada por el nombre: las voces «Natural»/«Online» (Edge) o neuronales suenan humanas;
  // las de Windows «Desktop» y eSpeak suenan robóticas.
  const naturalVoice=v=>/natural|neural|online|enhanced|premium|wavenet|studio/i.test(v.name);
  const basicVoice=v=>!naturalVoice(v)&&/microsoft|espeak|desktop/i.test(v.name);
  const voiceQuality=v=>naturalVoice(v)?2:basicVoice(v)?0:1;
  // La Web Speech API no informa si una voz es de hombre o de mujer: se deduce por el nombre de la voz.
  const maleNames=/(^|[^a-záéíóúñ])(ra[uú]l|pablo|jorge|[aá]lvaro|tom[aá]s|gonzalo|diego|juan|carlos|enrique|andr[eé]s|gerardo|lorenzo|mateo|alonso|emilio|jos[eé]|manuel|miguel|sergio|el[ií]as|arnau|dar[ií]o|sa[uú]l|jaime|federico|alejandro|hombre|masculin[oa]|male)([^a-záéíóúñ]|$)/i;
  const femaleNames=/(^|[^a-záéíóúñ])(sabina|helena|laura|elena|paulina|m[oó]nica|marisol|isabela|dalia|elvira|abril|mar[ií]a|luc[ií]a|elsa|paloma|valentina|camila|catalina|renata|beatriz|sof[ií]a|ximena|irene|esperanza|ver[oó]nica|mujer|femenin[oa]|female)([^a-záéíóúñ]|$)/i;
  const isMale=v=>maleNames.test(v.name)&&!femaleNames.test(v.name);
  const genderLabel=v=>isMale(v)?' · hombre':femaleNames.test(v.name)?' · mujer':'';
  function pickVoice(){
    const voices=spanishVoices();
    // Sin elección manual, spanishVoices() ya ordena primero las voces de hombre.
    return voices.find(v=>v.voiceURI===state.voiceURI)||voices.find(v=>v.lang.toLowerCase().startsWith('es'))||null;
  }
  // ===== V1.9: voz natural de ElevenLabs (por el servidor) =====
  // who: 'diego' para lo que dice Diego; cualquier otro valor, para los mensajes de la familia y los avisos.
  // Cada frase se baja una sola vez y queda guardada en el teléfono. Si algo falla, se usa la voz del teléfono.
  let voiceAudio=null,talkSeq=0;const voiceUrls=new Map();
  const cloudVoiceFor=w=>isServer()&&state.cloudVoice&&navigator.onLine&&!!(state.tg.voice&&state.tg.voice[w]);
  function stopTalking(){talkSeq++;if(voiceAudio){voiceAudio.pause();voiceAudio=null;}if(hasVoice())window.speechSynthesis.cancel();}
  function talk(phrase,who){
    const m=(phrase||'').trim();if(!m){notify('Primero prepará un mensaje.');return;}
    const w=who==='diego'?'diego':'family';
    stopTalking();const my=talkSeq;
    if(cloudVoiceFor(w)){cloudTalk(m,w,my).catch(()=>{if(my===talkSeq)phoneTalk(m);});return;}
    phoneTalk(m);
  }
  async function cloudTalk(m,w,my){
    const key=w+'|'+m;let url=voiceUrls.get(key);
    if(!url){
      const cacheKey=new Request('https://voz.hablemos.local/'+w+'/'+encodeURIComponent(m));
      let blob=null;
      try{const hit=await (await caches.open('hablemos-voz')).match(cacheKey);if(hit)blob=await hit.blob();}catch(e){}
      if(!blob){
        const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),8000);
        try{
          const r=await fetch(state.tg.server.url+'/api/tts',{method:'POST',signal:ctrl.signal,cache:'no-store',headers:{authorization:'Bearer '+state.tg.server.pin,'content-type':'application/json'},body:JSON.stringify({text:m,who:w})});
          if(!r.ok)throw new Error('HTTP '+r.status);
          blob=await r.blob();
        }finally{clearTimeout(timer);}
        try{await (await caches.open('hablemos-voz')).put(cacheKey,new Response(blob,{headers:{'content-type':'audio/mpeg'}}));}catch(e){}
      }
      url=URL.createObjectURL(blob);voiceUrls.set(key,url);
      if(voiceUrls.size>60){const [k,u]=voiceUrls.entries().next().value;URL.revokeObjectURL(u);voiceUrls.delete(k);}
    }
    if(my!==talkSeq)return; // mientras bajaba, se pidió decir otra cosa
    const a=new Audio(url);a.volume=Math.max(.1,state.volume);voiceAudio=a;
    await a.play();
  }
  function phoneTalk(m){
    if(!hasVoice()){notify('Este navegador no tiene voz disponible.');return;}
    try{
      window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(m);
      const voice=pickVoice();
      utterance.lang=voice?voice.lang:'es-AR';if(voice)utterance.voice=voice;
      utterance.rate=state.rate;utterance.pitch=state.pitch;utterance.volume=state.volume;
      window.speechSynthesis.speak(utterance);
    }catch(e){notify('No se pudo usar la voz en este dispositivo.');}
  }
  function speakMessage(){learnFromMessage();talk(state.message,'diego');}
  function renderVoiceSettings(){
    const cloud=isServer()&&!!(state.tg.voice&&state.tg.voice.diego);
    $('cloudVoiceRow').hidden=!cloud;$('cloudVoice').checked=state.cloudVoice;
    const select=$('voiceSelect');select.replaceChildren();
    const voices=spanishVoices();
    const auto=document.createElement('option');auto.value='';auto.textContent='Automática (voz de hombre)';select.append(auto);
    for(const v of voices){
      const o=document.createElement('option');o.value=v.voiceURI;o.textContent=(naturalVoice(v)?'★ ':'')+v.name+' · '+v.lang+genderLabel(v)+(naturalVoice(v)?' · natural':basicVoice(v)?' · básica':'')+(v.localService?'':' (necesita internet)');select.append(o);
    }
    $('noMaleVoice').hidden=!hasVoice()||!voices.length||voices.some(isMale);
    renderVoiceQualityHint(voices);
    select.value=spanishVoices().some(v=>v.voiceURI===state.voiceURI)?state.voiceURI:'';
    $('voiceRate').value=state.rate;$('voicePitch').value=state.pitch;$('voiceVolume').value=state.volume;
    $('rateValue').textContent=state.rate<.8?'lenta':state.rate>1.1?'rápida':'normal';
    $('pitchValue').textContent=state.pitch<.85?'grave':state.pitch>1.15?'aguda':'normal';
    $('volumeValue').textContent=Math.round(state.volume*100)+'%';
    $('noVoice').hidden=hasVoice();
    $('pitchHint').hidden=Math.abs(state.pitch-1)<.08;
  }
  // Si la mejor voz de hombre disponible es básica (robótica), explica cómo conseguir una natural según el dispositivo.
  function renderVoiceQualityHint(voices){
    const box=$('voiceQualityHint');
    const current=pickVoice();
    const ua=navigator.userAgent;
    const show=hasVoice()&&voices.length>0&&!!current&&basicVoice(current)&&!voices.some(v=>isMale(v)&&naturalVoice(v));
    box.hidden=!show;if(!show)return;
    const naturalOther=voices.find(naturalVoice)||voices.find(v=>!basicVoice(v));
    let text;
    if(/Windows/.test(ua)&&!/Edg\//.test(ua))text='La voz de hombre de esta computadora es básica y suena robótica. <b>Microsoft Edge</b> (viene con Windows) tiene voces naturales de hombre, como <b>«Microsoft Tomas Online (Natural) - Spanish (Argentina)»</b>: abrí Hablemos en Edge y elegila en esta lista. Ojo: los contactos y Telegram se guardan por navegador, así que habría que configurarlos de nuevo en Edge.';
    else if(/Android/.test(ua))text='Para que suene más natural: en Android, abrí <b>Ajustes → Salida de texto a voz</b>, elegí <b>Servicios de voz de Google</b>, tocá ⚙ → <b>Instalar datos de voz → Español</b> y descargá una voz de hombre. Las voces de Google suenan mucho más humanas que las básicas.';
    else text='Esta voz es básica y puede sonar robótica. Si el sistema permite instalar voces nuevas en español, instalá una «natural» o «mejorada» y elegila acá.';
    if(naturalOther)text+='<br>Mientras tanto, la voz más natural de esta lista es <b>'+naturalOther.name.replace(/[<>&]/g,'')+'</b>'+(isMale(naturalOther)?'':' (de mujer)')+'.';
    box.innerHTML=text;
  }
  function sendWhatsApp(c=selected()){
    const msg=state.message.trim();if(!msg){notify('Primero armá un mensaje.');return;}
    if(!c){notify('Elegí a quién mandarle el mensaje.');return;}
    if(!c.phone){notify(c.name+' no tiene número de WhatsApp. Podés usar Telegram.');return;}
    const num=c.phone.replace(/\D/g,'');if(!/^\d{8,15}$/.test(num)){notify('Revisá el número internacional.');return;}
    learnFromMessage();
    window.location.href='https://wa.me/'+num+'?text='+encodeURIComponent(msg);
  }
  // ===== V0.4: Telegram con un bot propio =====
  // Todo se hace desde el teléfono contra la API oficial de Telegram, sin servidor propio.
  // Se usan pedidos POST con formulario (sin cabeceras extra) para que el navegador no exija preflight CORS.
  const TG_API='https://api.telegram.org/bot';
  const tgReady=()=>!!(state.tg.token||state.tg.server);
  const isServer=()=>!!state.tg.server;
  // Identifica la conexión actual: si cambia (otro token, otro servidor o PIN), se reinicia la recepción.
  const tgKey=()=>state.tg.server?'srv|'+state.tg.server.url+'|'+state.tg.server.pin:state.tg.token;
  async function srvCall(path,{method='GET',body,signal,server=state.tg.server}={}){
    const res=await fetch(server.url+path,{method,signal,cache:'no-store',headers:{authorization:'Bearer '+server.pin,...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
    let data=null;try{data=await res.json();}catch(e){}
    if(!res.ok){const err=new Error(data&&data.error||'HTTP '+res.status);err.code=res.status;err.error=data&&data.error;err.missing=data&&data.missing;throw err;}
    return data;
  }
  function srvError(e,who){
    if(e.code===401)return 'El PIN del servidor no es correcto. Revisalo en Configuración → Telegram.';
    if(e.code===429&&e.error==='too-many-attempts')return 'Hubo demasiados intentos con PIN equivocado. El servidor espera 15 minutos.';
    if(e.code===503)return 'El servidor todavía no tiene el token o el PIN. Cargalos en Railway → Variables.';
    if(e.error==='blocked')return (who||'Esta persona')+' bloqueó o eliminó el bot. Tiene que volver a tocar «Iniciar».';
    if(e.error==='not-linked'||e.error==='chat-not-found')return (who||'Esta persona')+' ya no está conectada en el servidor. Tiene que tocar «Iniciar» en el bot.';
    if(e.error==='telegram-busy')return 'Telegram pide esperar un momento antes de volver a enviar.';
    if(e.error==='bad-token')return 'El servidor no puede usar el token del bot. Revisá TELEGRAM_TOKEN en Railway.';
    return 'No se pudo conectar con el servidor. Revisá la conexión e intentá de nuevo.';
  }
  const newContactId=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function tgCall(method,params={},signal,token=state.tg.token){
    const body=new URLSearchParams();
    for(const [k,v] of Object.entries(params))body.append(k,typeof v==='object'?JSON.stringify(v):String(v));
    const res=await fetch(TG_API+token+'/'+method,{method:'POST',body,signal,cache:'no-store'});
    let data=null;try{data=await res.json();}catch(e){}
    if(!data||!data.ok){const err=new Error(data&&data.description||'Error de Telegram');err.code=data&&data.error_code||res.status;throw err;}
    return data.result;
  }
  function tgError(e,who){
    if(e.code===401)return 'El token de Telegram no es válido. Revisalo en Configuración → Telegram.';
    if(e.code===403)return (who||'Esta persona')+' bloqueó o eliminó el bot. Tiene que volver a tocar «Iniciar».';
    if(e.code===400&&/chat not found/i.test(e.message))return 'No se encontró el chat de '+(who||'esta persona')+'. Tiene que tocar «Iniciar» en el bot.';
    if(e.code===429)return 'Telegram pide esperar un momento antes de volver a enviar.';
    return 'No se pudo conectar con Telegram. Revisá la conexión e intentá de nuevo.';
  }
  function pushThread(chatId,dir,text,date,id,extra={}){
    const list=state.tg.threads[chatId]||(state.tg.threads[chatId]=[]);
    if(Number.isInteger(id)&&list.some(m=>m.dir===dir&&m.id===id))return false; // ya estaba (evita duplicados)
    list.push({dir,text:text.slice(0,4096),date,...(Number.isInteger(id)?{id}:{}),...extra});
    if(list.length>100)list.splice(0,list.length-100);
    const ids=Object.keys(state.tg.threads);
    if(ids.length>30){const oldest=ids.sort((a,b)=>(state.tg.threads[a].at(-1)?.date||0)-(state.tg.threads[b].at(-1)?.date||0))[0];delete state.tg.threads[oldest];}
    return true;
  }
  function describeIncoming(m){
    if(typeof m.text==='string')return m.text;
    const caption=typeof m.caption==='string'?': '+m.caption:'';
    if(m.voice||m.audio)return '🎤 Envió un audio. Abrí Telegram para escucharlo.';
    if(m.photo)return '🖼️ Envió una foto'+caption;
    if(m.video||m.video_note)return '🎬 Envió un video'+caption;
    if(m.sticker)return (m.sticker.emoji||'🙂')+' (sticker)';
    if(m.document)return '📎 Envió un archivo'+caption;
    if(m.location)return '📍 Envió una ubicación.';
    if(m.contact)return '👤 Envió un contacto.';
    return '💬 Envió un mensaje que Hablemos no puede mostrar. Abrí Telegram para verlo.';
  }
  const contactByChat=chatId=>state.contacts.find(c=>c.telegramId===chatId)||null;
  function handleUpdates(updates){
    let changed=false;
    for(const u of updates){
      state.tg.offset=Math.max(state.tg.offset,u.update_id+1);changed=true;
      const m=u.message;
      if(!m||!m.chat||m.chat.type!=='private'||!m.from||m.from.is_bot)continue;
      const chatId=String(m.chat.id);
      const name=[m.from.first_name,m.from.last_name].filter(Boolean).join(' ').trim().slice(0,64)||m.from.username||'Sin nombre';
      const contact=contactByChat(chatId);
      const text=describeIncoming(m);
      if(!contact){
        // Alguien que todavía no está vinculado: queda pendiente para que quien acompaña lo apruebe. No se lee en voz alta.
        if(!state.tg.pending.some(p=>p.chatId===chatId)){
          state.tg.pending.push({chatId,name,username:m.from.username||''});
          if(state.tg.pending.length>20)state.tg.pending.shift();
        }
        continue;
      }
      if(/^\/start\b/.test(text))continue;
      if(pushThread(chatId,'in',text,(m.date||Date.now()/1000)*1000,m.message_id))showIncoming(contact,text);
    }
    if(changed){persist();renderChat();renderJoinRequest();if($('tgDialog').open)renderTgDialog();}
  }
  // Aplica lo que manda el servidor: personas (pendientes y conectadas) y mensajes nuevos.
  // Las personas conectadas en el servidor aparecen como contactos en cualquier dispositivo nuevo.
  function handleServerSync(r){
    if(!r||typeof r!=='object')return;
    // La primera carga trae los mensajes viejos: se muestran sin anunciarlos. Después, todo mensaje nuevo se anuncia.
    const first=!state.tg.synced||!!r.reset;
    if(r.reset)state.tg.threads={};
    if(Array.isArray(r.people)){
      const people=r.people.filter(p=>p&&chatIdOk(String(p.chatId)));
      state.tg.pending=people.filter(p=>p.status==='pending').slice(0,30).map(p=>({chatId:String(p.chatId),name:String(p.name||'Sin nombre').slice(0,64),username:String(p.username||'').slice(0,64)}));
      const linked=people.filter(p=>p.status==='linked');
      const ids=new Set(linked.map(p=>String(p.chatId)));
      for(const p of linked){
        const chatId=String(p.chatId);
        if(!contactByChat(chatId)&&state.contacts.length<50)state.contacts.push({id:newContactId(),name:String(p.name||'Sin nombre').slice(0,36),phone:'',telegramId:chatId});
      }
      for(const c of state.contacts)if(c.telegramId&&!ids.has(c.telegramId))delete c.telegramId;
      state.contacts=state.contacts.filter(c=>c.phone||c.telegramId);
      if(!selected())state.selectedContactId=state.contacts.length===1?state.contacts[0].id:null;
      if(Number.isInteger(r.pv))state.tg.pv=r.pv;
    }
    for(const m of Array.isArray(r.messages)?r.messages:[]){
      if(!m||!chatIdOk(String(m.chatId))||(m.dir!=='in'&&m.dir!=='out')||typeof m.text!=='string'||!Number.isInteger(m.seq))continue;
      const chatId=String(m.chatId);
      const extra=m.audio?{audio:{d:Number(m.audio.duration)||0}}:{};
      const added=pushThread(chatId,m.dir,m.text,Number(m.date)||Date.now(),m.seq,extra);
      // Al conectar por primera vez se cargan los mensajes viejos sin anunciarlos.
      if(added&&m.dir==='in'&&!first){const c=contactByChat(chatId);if(c)showIncoming(c,m.text,{...m,id:m.seq,...extra});}
    }
    if(Number.isInteger(r.seq))state.tg.seq=r.seq;
    state.tg.synced=true;
    if(typeof r.invite==='string'&&/^[\w-]{8,64}$/.test(r.invite))state.tg.invite=r.invite;
    if(typeof r.ai==='boolean')state.tg.ai=r.ai;
    if(r.voice&&typeof r.voice==='object')state.tg.voice={diego:r.voice.diego===true,family:r.voice.family===true};
    renderJoinRequest();
    persist();renderSelectedContact();renderContactListIfOpen();
    if($('tgDialog').open)renderTgDialog();
  }
  function renderContactListIfOpen(){if($('contactsDialog').open)renderContactList();}
  // Estado de la conexión, visible en pantalla para saber qué pasa si no llegan mensajes.
  let tgConn='idle';
  const connText={
    idle:'',
    connecting:'🟡 Conectando con Telegram…',
    ok:'🟢 Conectado. Los mensajes llegan mientras Hablemos está abierta.',
    'ok-server':'🟢 Conectado al servidor. Los mensajes se guardan aunque Hablemos esté cerrada.',
    'use-server':'🟠 Este bot ahora funciona con el servidor de Hablemos y esta conexión ya no recibe mensajes. Pasate al servidor en Configuración → Telegram → «Pasar al servidor», con el PIN.',
    'bad-pin':'🔴 El PIN no es correcto (¿se cambió HABLEMOS_PIN en Railway?). Escribí el PIN nuevo en Configuración → Telegram → «Cambiar el PIN».',
    'too-many':'🔴 Hubo demasiados intentos con PIN equivocado. El servidor espera 15 minutos antes de aceptar otro.',
    'not-configured':'🟠 El servidor todavía no tiene el token o el PIN. Cargalos en Railway → Variables (TELEGRAM_TOKEN y HABLEMOS_PIN).',
    'other-tab':'🟢 Conectado desde otra pestaña o ventana de Hablemos en este dispositivo.',
    retrying:'🟡 Se cortó la conexión con Telegram. Reintentando…',
    offline:'⚪ Sin internet. Los mensajes van a llegar cuando vuelva la conexión.',
    conflict:'🟠 Otro teléfono o computadora está usando este bot al mismo tiempo, y los mensajes se reparten entre los dos. Dejá Telegram conectado en Hablemos en un solo dispositivo.',
    invalid:'🔴 El token dejó de funcionar (por ejemplo, después de usar /revoke). Pegá el token nuevo en Configuración → Telegram → «Cambiar el token». Las personas conectadas se mantienen.'
  };
  function setConn(s){if(tgConn===s)return;tgConn=s;renderConn();}
  function renderConn(){
    const text=tgReady()?connText[tgConn==='ok'&&isServer()?'ok-server':tgConn]:'';
    for(const id of ['chatStatus','tgConnStatus']){
      const el=$(id);el.textContent=text;el.dataset.state=tgConn;
      el.hidden=!text||(id==='chatStatus'&&['ok','other-tab','connecting','idle'].includes(tgConn));
    }
    renderTgStatus();
  }
  // Solo una pestaña de este dispositivo consulta a Telegram a la vez (Web Locks). Las demás se enteran por el almacenamiento compartido.
  let pollCtrl=null,polling=false,quickPoll=false,reportPending=false;
  async function pollLoop(){
    const token=state.tg.token,key=tgKey();
    while(tgReady()&&tgKey()===key){
      if(!navigator.onLine){setConn('offline');return 'offline';}
      const ctrl=pollCtrl=new AbortController();
      const timeout=quickPoll?0:25;quickPoll=false;
      try{
        if(isServer()){
          const r=await srvCall('/api/sync?since='+state.tg.seq+'&pv='+state.tg.pv+'&wait='+(timeout?1:0),{signal:ctrl.signal});
          if(tgKey()!==key)continue;
          setConn('ok');
          handleServerSync(r);
          ensurePushOnce();
        }else{
          const updates=await tgCall('getUpdates',{offset:state.tg.offset,timeout,allowed_updates:['message']},ctrl.signal,token);
          setConn('ok');
          handleUpdates(updates);
        }
        if(reportPending){reportPending=false;if(!state.tg.pending.length)notify('Todavía no hay personas nuevas. Pediles que abran el enlace y toquen «Iniciar».');}
      }catch(e){
        if(ctrl.signal.aborted){if(ctrl.signal.reason==='kick')continue;return 'stopped';}
        if(isServer()){
          if(e.code===401){setConn('bad-pin');notify(srvError(e));return 'invalid';}
          if(e.code===429&&e.error==='too-many-attempts'){setConn('too-many');await sleep(60000);continue;}
          if(e.code===503){setConn('not-configured');await sleep(30000);continue;}
          setConn('retrying');await sleep(5000);continue;
        }
        if(e.code===401){setConn('invalid');notify(tgError(e));return 'invalid';}
        // El bot tiene el webhook del servidor activo: este modo ya no puede recibir.
        if(e.code===409&&/webhook/i.test(e.message)){if(tgConn!=='use-server'){setConn('use-server');notify(connText['use-server']);}await sleep(30000);continue;}
        setConn(e.code===409?'conflict':'retrying');
        await sleep(e.code===409?15000:5000);
      }finally{if(pollCtrl===ctrl)pollCtrl=null;}
    }
    return 'changed';
  }
  function startPolling(){
    if(!tgReady()||polling)return;
    polling=true;
    if(tgConn==='idle'||tgConn==='invalid'||tgConn==='offline')setConn('connecting');
    const run=()=>{quickPoll=true;return pollLoop();}; // la primera consulta es inmediata, para confirmar enseguida que hay conexión
    const job=navigator.locks
      ?navigator.locks.request('hablemos-telegram',{ifAvailable:true},lock=>{
          if(lock)return run();
          setConn('other-tab');
          return navigator.locks.request('hablemos-telegram',run);
        })
      :run();
    Promise.resolve(job).catch(()=>'error').then(reason=>{
      polling=false;
      // Si cambió el token (o se reemplazó), vuelve a empezar con el nuevo. Con token inválido o sin internet espera.
      if(tgReady()&&reason!=='invalid'&&reason!=='offline')setTimeout(startPolling,reason==='error'?5000:0);
    });
  }
  function kickPolling(){quickPoll=true;if(pollCtrl)pollCtrl.abort('kick');else startPolling();}
  function stopPolling(){if(pollCtrl)pollCtrl.abort('stop');}
  let incomingContactId=null;
  // Timbre corto de dos notas y vibración, para que Diego note que llegó algo aunque no esté mirando.
  let audioCtx=null;
  function unlockAudio(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}catch(e){}}
  document.addEventListener('pointerdown',unlockAudio,{once:true});
  function chime(){
    if(!state.tg.chime)return;
    try{
      unlockAudio();
      const t=audioCtx.currentTime,vol=Math.max(.15,state.volume)*.4;
      for(const [freq,delay] of [[880,0],[1175,.2]]){
        const o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.type='sine';o.frequency.value=freq;
        g.gain.setValueAtTime(.0001,t+delay);g.gain.exponentialRampToValueAtTime(vol,t+delay+.02);g.gain.exponentialRampToValueAtTime(.0001,t+delay+.4);
        o.connect(g).connect(audioCtx.destination);o.start(t+delay);o.stop(t+delay+.45);
      }
    }catch(e){}
    try{if(navigator.vibrate)navigator.vibrate([300,120,300]);}catch(e){}
  }
  // ===== V1.3: audios de la familia, dentro de Hablemos =====
  const audioUrls=new Map();let playing=null;
  const audioLabel=m=>'Audio'+(m.audio&&m.audio.d?' de '+m.audio.d+' s':'');
  async function playAudio(c,m){
    if(!isServer()||!m||!m.audio||!Number.isInteger(m.id)){notify('Este audio se escucha en Telegram.');return;}
    try{
      stopTalking();
      if(playing){playing.pause();playing=null;}
      let url=audioUrls.get(m.id);
      if(!url){
        notify('Cargando el audio…');
        const r=await fetch(state.tg.server.url+'/api/audio?chatId='+encodeURIComponent(c.telegramId)+'&seq='+m.id,{headers:{authorization:'Bearer '+state.tg.server.pin},cache:'no-store'});
        if(!r.ok)throw new Error('HTTP '+r.status);
        url=URL.createObjectURL(await r.blob());audioUrls.set(m.id,url);
        if(audioUrls.size>15){const [k,u]=audioUrls.entries().next().value;URL.revokeObjectURL(u);audioUrls.delete(k);}
      }
      const a=new Audio(url);a.volume=Math.max(.1,state.volume);playing=a;
      await a.play();
      notify('🔊 Escuchando el audio de '+c.name);
    }catch(e){notify(e&&e.name==='NotAllowedError'?'Tocá «Escuchar» para oír el audio.':'No se pudo reproducir el audio. Probá de nuevo.');}
  }
  let incomingMsg=null;
  function showIncoming(contact,text,msg=null){
    incomingContactId=contact.id;incomingMsg=msg&&msg.audio?msg:null;
    $('incomingName').textContent=contact.name+':';$('incomingText').textContent=incomingMsg?audioLabel(incomingMsg):text;$('incoming').hidden=false;
    $('incomingSay').lastChild.textContent=incomingMsg?' Escuchar audio':' Escuchar';
    chime();
    if(state.tg.autoRead){
      if(incomingMsg)setTimeout(()=>{talk(contact.name+' te mandó un audio.');setTimeout(()=>playAudio(contact,incomingMsg),2200);},state.tg.chime?750:0);
      else setTimeout(()=>talk(contact.name+' dice: '+text),state.tg.chime?750:0);
    }
  }
  function formatTime(ms){
    const d=new Date(ms),today=new Date();
    const time=d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    return d.toDateString()===today.toDateString()?time:d.toLocaleDateString('es-AR',{day:'numeric',month:'short'})+' '+time;
  }
  const renderChat=()=>renderScreen();
  // Enviar: «¿A quién se lo mando?» con una tarjeta grande por persona. Elegir a la persona ya es la confirmación.
  let sheetOpenedAt=0,sending=false;
  function openSendSheet(){
    const msg=state.message.trim();if(!msg){notify('Primero armá un mensaje.');return;}
    const people=state.contacts.filter(c=>(c.telegramId&&tgReady())||c.phone);
    const preferred=selected();
    people.sort((a,b)=>(b===preferred)-(a===preferred)||(!!(b.telegramId&&tgReady()))-(!!(a.telegramId&&tgReady())));
    $('sheetPreview').textContent=msg;
    const root=$('sheetPeople');root.replaceChildren();
    if(!people.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay personas para enviar mensajes. Quien te acompaña las agrega en Configuración.';root.append(p);}
    for(const c of people){
      const viaTg=!!(c.telegramId&&tgReady());
      const b=makeTile(tile('person'+(c===preferred?' preferred':''),c.name,()=>{
        if(Date.now()-sheetOpenedAt<600)return; // evita que un doble toque envíe sin querer
        $('sendSheet').close();sendTo(c);
      },viaTg?'✈':'🟢',viaTg?'':'por WhatsApp'));
      b.setAttribute('aria-label','Enviar a '+c.name+(viaTg?'':' por WhatsApp'));
      root.append(b);
    }
    sheetOpenedAt=Date.now();$('sendSheet').showModal();
  }
  function sendTo(c){
    if(c.telegramId&&tgReady()){doSendTelegram(c);return;}
    if(c.phone){sendWhatsApp(c);return;}
    notify(c.name+' todavía no tiene cómo recibir mensajes.');
  }
  async function doSendTelegram(c){
    const msg=state.message.trim();
    if(sending||!c||!c.telegramId||!msg)return;
    if(!navigator.onLine){notify('Sin internet: el mensaje no se pudo enviar.');return;}
    sending=true;notify('Enviando a '+c.name+'…');
    try{
      if(isServer()){
        const r=await srvCall('/api/send',{method:'POST',body:{chatId:c.telegramId,text:msg}});
        pushThread(c.telegramId,'out',msg,r.message&&r.message.date||Date.now(),r.message&&r.message.seq);
      }else{
        await tgCall('sendMessage',{chat_id:c.telegramId,text:msg});
        pushThread(c.telegramId,'out',msg,Date.now());
      }
      learnFromMessage();
      state.selectedContactId=c.id;view='main';page=0;
      setMessage(''); // listo para el próximo mensaje
      notify('✓ Enviado a '+c.name);
    }catch(e){notify(isServer()?srvError(e,c.name):tgError(e,c.name));}
    finally{sending=false;}
  }
  // --- Configuración y vinculación ---
  // Con el servidor, el enlace lleva el código de invitación: quien lo abre y toca «Iniciar» queda conectado solo.
  const botLink=()=>state.tg.bot?'https://t.me/'+state.tg.bot.username+(isServer()&&state.tg.invite?'?start='+state.tg.invite:''):'';
  async function shareInvite(){
    const link=botLink();if(!link){notify('Primero hay que conectar Telegram.');return;}
    const text='¡Hola! Para conversar conmigo por Telegram, abrí este enlace y tocá «Iniciar»: '+link;
    if(navigator.share){try{await navigator.share({title:'Hablemos',text});return;}catch(e){if(e&&e.name==='AbortError')return;}}
    window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
  }
  // Aviso grande en la pantalla principal cuando alguien sin invitación quiere conversar: Diego decide con un toque.
  const dismissedJoin=new Set(),announcedJoin=new Set();
  function renderJoinRequest(){
    const p=tgReady()?state.tg.pending.find(x=>!dismissedJoin.has(x.chatId)):null;
    $('joinRequest').hidden=!p;if(!p)return;
    $('joinRequest').dataset.chatId=p.chatId;$('joinName').textContent=p.name;
    if(!announcedJoin.has(p.chatId)){announcedJoin.add(p.chatId);chime();if(state.tg.autoRead)setTimeout(()=>talk(p.name+' quiere conversar con vos por Telegram.'),state.tg.chime?750:0);}
  }
  async function acceptJoin(){
    const p=state.tg.pending.find(x=>x.chatId===$('joinRequest').dataset.chatId);if(!p){renderJoinRequest();return;}
    const key=p.name.trim().toLocaleLowerCase('es');
    const same=state.contacts.find(c=>!c.telegramId&&c.name.trim().toLocaleLowerCase('es')===key);
    await linkPerson(p,same?same.id:'',{select:true});
    renderJoinRequest();
  }
  function renderTgStatus(){
    $('tgStatus').textContent=tgReady()?(isServer()?'Servidor · ':'')+'Bot @'+(state.tg.bot?state.tg.bot.username:'bot')+' · '+state.contacts.filter(c=>c.telegramId).length+' persona(s) conectada(s). '+(connText[tgConn]||''):'Sin configurar. Permite enviar y recibir mensajes sin salir de Hablemos.';
  }
  function renderTgDialog(){
    const ready=tgReady();
    $('tgStepToken').hidden=ready;$('tgStepPeople').hidden=!ready;
    renderConn();
    if(!ready){if(!$('srvUrl').value)$('srvUrl').value=DEFAULT_SERVER_URL;return;}
    $('tgReplaceBox').hidden=isServer();$('srvPinBox').hidden=!isServer();$('srvMoveBox').hidden=isServer();
    if(tgConn==='invalid')$('tgReplaceBox').open=true;
    if(tgConn==='bad-pin')$('srvPinBox').open=true;
    $('tgBotName').textContent=state.tg.bot?state.tg.bot.name+' (@'+state.tg.bot.username+')':'tu bot';
    $('tgLink').textContent=botLink();
    $('tgInviteHint').innerHTML=isServer()&&state.tg.invite
      ?'Compartí este enlace con la familia (por ejemplo por WhatsApp). Quien lo abra en su teléfono, con Telegram instalado, y toque <b>Iniciar</b> queda <b>conectado automáticamente</b>: no hay que aprobar nada.'
      :'Cada persona abre este enlace en su teléfono, con Telegram instalado, y toca <b>Iniciar</b>:';
    $('tgNewInvite').hidden=!isServer();
    $('tgChime').checked=state.tg.chime;renderPushStatus();
    $('aiRow').hidden=!(isServer()&&state.tg.ai);$('aiReplies').checked=state.aiReplies;
    $('tgAutoRead').checked=state.tg.autoRead;
    const pend=$('tgPending');pend.replaceChildren();
    if(!state.tg.pending.length){const p=document.createElement('p');p.className='muted';p.textContent='No hay personas esperando. Cuando alguien toque «Iniciar», tocá «Buscar personas».';pend.append(p);}
    for(const p of state.tg.pending){
      const box=document.createElement('div');box.className='tg-person';
      const title=document.createElement('strong');title.textContent=p.name+(p.username?' (@'+p.username+')':'');
      const label=document.createElement('label');label.className='field';label.textContent='Guardar como';
      const select=document.createElement('select');select.className='forminput';
      const fresh=document.createElement('option');fresh.value='';fresh.textContent='Contacto nuevo: '+p.name;select.append(fresh);
      for(const c of state.contacts.filter(c=>!c.telegramId)){const o=document.createElement('option');o.value=c.id;o.textContent='Mi contacto: '+c.name;select.append(o);}
      const id='tgsel-'+p.chatId;select.id=id;label.htmlFor=id;
      const actions=document.createElement('div');actions.className='actiongrid';
      const ok=document.createElement('button');ok.type='button';ok.className='formbtn';ok.textContent='✓ Conectar';
      ok.addEventListener('click',()=>linkPerson(p,select.value));
      const no=document.createElement('button');no.type='button';no.className='clear';no.textContent='Ignorar';
      no.addEventListener('click',async()=>{
        if(isServer()){try{await srvCall('/api/people/ignore',{method:'POST',body:{chatId:p.chatId}});}catch(e){notify(srvError(e));return;}}
        state.tg.pending=state.tg.pending.filter(x=>x.chatId!==p.chatId);persist();renderTgDialog();
      });
      actions.append(ok,no);box.append(title,label,select,actions);pend.append(box);
    }
    const linked=$('tgLinked');linked.replaceChildren();
    const people=state.contacts.filter(c=>c.telegramId);
    if(!people.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay nadie conectado.';linked.append(p);}
    for(const c of people){
      const row=document.createElement('div');row.className='contactline';
      const name=document.createElement('div');name.className='tg-linked-name';name.textContent='✈ '+c.name;
      const del=document.createElement('button');del.type='button';del.className='delete';del.textContent='Quitar';del.setAttribute('aria-label','Desconectar a '+c.name+' de Telegram');
      del.addEventListener('click',async()=>{
        if(!window.confirm('¿Desconectar a '+c.name+' de Telegram? El contacto se mantiene.'))return;
        if(isServer()){try{await srvCall('/api/people/unlink',{method:'POST',body:{chatId:c.telegramId}});}catch(e){notify(srvError(e));return;}}
        delete state.tg.threads[c.telegramId];delete c.telegramId;
        if(!c.phone)state.contacts=state.contacts.filter(x=>x.id!==c.id);
        if(!selected())state.selectedContactId=null;
        persist();renderTgDialog();renderSelectedContact();
      });
      row.append(name,del);linked.append(row);
    }
  }
  async function linkPerson(p,contactId,{select=false}={}){
    let c=contactId?state.contacts.find(x=>x.id===contactId):null;
    if(!c&&state.contacts.length>=50){notify('Se alcanzó el máximo de contactos.');return;}
    if(isServer()){
      // El servidor manda la bienvenida y avisa a los demás dispositivos.
      try{await srvCall('/api/people/link',{method:'POST',body:{chatId:p.chatId,name:c?c.name:p.name}});}
      catch(e){notify(srvError(e));return;}
    }
    if(!c){c={id:newContactId(),name:p.name.slice(0,36),phone:''};state.contacts.push(c);}
    c.telegramId=p.chatId;
    state.tg.pending=state.tg.pending.filter(x=>x.chatId!==p.chatId);
    if(select||!state.selectedContactId)state.selectedContactId=c.id;
    persist();renderTgDialog();renderSelectedContact();renderJoinRequest();notify(c.name+' quedó conectado por Telegram');
    if(!isServer())try{await tgCall('sendMessage',{chat_id:p.chatId,text:'✅ ¡Listo! Ya estás conectado/a. Los mensajes de Hablemos te van a llegar por este chat, y podés responder escribiendo acá.'});}catch(e){}
  }
  // Comprueba un token con Telegram. Devuelve {token, me} o null (y muestra el error en pantalla).
  async function verifyToken(inputId,errorId,buttonId){
    const token=$(inputId).value.trim().replace(/\s+/g,'');
    const error=$(errorId);error.hidden=true;
    const fail=msg=>{error.textContent=msg;error.hidden=false;return null;};
    if(!/^\d{3,15}:[\w-]{20,80}$/.test(token))return fail('El token no tiene el formato correcto. Es parecido a 123456789:AAH4… y lo da @BotFather.');
    if(!navigator.onLine)return fail('Se necesita internet para conectar el bot.');
    $(buttonId).disabled=true;
    try{
      const me=await tgCall('getMe',{},undefined,token);
      if(!me.is_bot)throw Object.assign(new Error('not a bot'),{code:401});
      $(inputId).value='';
      return {token,me};
    }catch(e){return fail(e.code===401||e.code===404?'Telegram no reconoce ese token. Copialo de nuevo desde @BotFather.':tgError(e));}
    finally{$(buttonId).disabled=false;}
  }
  const botInfo=me=>({id:me.id,username:me.username,name:me.first_name||me.username});
  async function connectTelegram(){
    const ok=await verifyToken('tgToken','tgError','tgConnect');if(!ok)return;
    state.tg={...tgInitial(),token:ok.token,bot:botInfo(ok.me)};
    persist();setConn('connecting');renderTgDialog();renderChat();startPolling();requestPersist();
    notify('Bot conectado: @'+ok.me.username);
  }
  // Cambiar el token (por ejemplo, después de /revoke) sin perder a las personas conectadas ni las conversaciones.
  async function replaceToken(){
    const ok=await verifyToken('tgNewToken','tgReplaceError','tgReplace');if(!ok)return;
    const bot=state.tg.bot;
    const sameBot=bot&&(Number.isInteger(bot.id)?bot.id===ok.me.id:bot.username===ok.me.username);
    if(sameBot){
      state.tg.token=ok.token;state.tg.bot=botInfo(ok.me);
    }else{
      if(!window.confirm('Este token es de otro bot (@'+ok.me.username+'). Las personas conectadas van a tener que tocar «Iniciar» en el bot nuevo y volver a conectarse. ¿Continuar?'))return;
      unlinkAllTelegram();
      state.tg={...tgInitial(),token:ok.token,bot:botInfo(ok.me),autoRead:state.tg.autoRead,confirm:state.tg.confirm};
    }
    stopPolling();persist();setConn('connecting');renderTgDialog();renderSelectedContact();startPolling();
    notify(sameBot?'Token actualizado. Las personas conectadas se mantienen.':'Bot nuevo conectado: @'+ok.me.username);
  }
  // Conecta este dispositivo al servidor de Hablemos con su dirección y el PIN.
  async function checkServer(url,pin,errorId,buttonId){
    const error=$(errorId);error.hidden=true;
    const fail=msg=>{error.textContent=msg;error.hidden=false;return null;};
    url=url.trim().replace(/\/+$/,'');
    if(!/^https?:\/\//i.test(url)&&url)url='https://'+url;
    if(!serverUrlOk(url))return fail('Escribí la dirección del servidor, por ejemplo https://hablemos-servidor.up.railway.app');
    if(!pin)return fail('Escribí el PIN del servidor.');
    if(!navigator.onLine)return fail('Se necesita internet para conectar con el servidor.');
    $(buttonId).disabled=true;
    try{
      const r=await srvCall('/api/status',{server:{url,pin}});
      if(!r.bot)return fail(r.botError?'El servidor no puede usar el bot: '+r.botError:'El servidor todavía no pudo hablar con Telegram. Revisá TELEGRAM_TOKEN en Railway.');
      return {url,pin,status:r};
    }catch(e){return fail(e.code?srvError(e):'No se pudo llegar al servidor. Revisá la dirección y la conexión.');}
    finally{$(buttonId).disabled=false;}
  }
  async function connectServer(url=$('srvUrl').value,pinInput='srvPin',errorId='srvError',buttonId='srvConnect'){
    const ok=await checkServer(url,$(pinInput).value,errorId,buttonId);if(!ok)return;
    // Si había personas conectadas con el token directo, se pasan al servidor para no tener que reconectarlas.
    const before=state.contacts.filter(c=>c.telegramId);
    stopPolling();
    state.tg={...tgInitial(),server:{url:ok.url,pin:ok.pin},bot:ok.status.bot,invite:ok.status.invite||'',autoRead:state.tg.autoRead,confirm:state.tg.confirm,threads:state.tg.threads};
    for(const c of before){try{await srvCall('/api/people/link',{method:'POST',body:{chatId:c.telegramId,name:c.name,migrate:true}});}catch(e){}}
    $(pinInput).value='';
    persist();setConn('connecting');renderTgDialog();renderChat();startPolling();requestPersist();
    notify('Conectado al servidor · bot @'+ok.status.bot.username+(ok.status.persistent?'':' (⚠️ el servidor no tiene almacenamiento permanente)'));
    if(pushSupported()&&Notification.permission!=='denied')enablePush();
  }
  async function changeServerPin(){
    const ok=await checkServer(state.tg.server.url,$('srvNewPin').value,'srvPinError','srvPinSave');if(!ok)return;
    $('srvNewPin').value='';state.tg.server={url:ok.url,pin:ok.pin};
    stopPolling();persist();setConn('connecting');renderTgDialog();startPolling();notify('PIN actualizado');
  }
  function unlinkAllTelegram(){
    state.contacts=state.contacts.filter(c=>c.phone);
    for(const c of state.contacts)delete c.telegramId;
    if(!selected())state.selectedContactId=null;
  }
  function disconnectTelegram(){
    const question=isServer()
      ?'¿Desconectar este dispositivo del servidor? Las personas y las conversaciones quedan guardadas en el servidor: para volver a conectar alcanza con la dirección y el PIN.'
      :'¿Desconectar Telegram? Se borran las conversaciones guardadas en Hablemos y las personas conectadas (los contactos con WhatsApp se mantienen).\n\nSi solo cambiaste el token con /revoke, no hace falta desconectar: usá «Cambiar el token».';
    if(!window.confirm(question))return;
    if(state.tg.push)disablePush();
    stopPolling();unlinkAllTelegram();
    state.tg=tgInitial();persist();setConn('idle');renderTgDialog();renderSelectedContact();$('incoming').hidden=true;notify('Telegram desconectado');
  }
  // ===== V0.9: avisos en el teléfono (push), aunque Hablemos esté cerrada =====
  const pushSupported=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window&&isSecureContext;
  const keyBytes=b64url=>{const pad='='.repeat((4-b64url.length%4)%4);return Uint8Array.from(atob((b64url+pad).replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));};
  async function enablePush({quiet=false}={}){
    const say=msg=>{if(!quiet)notify(msg);};
    if(!isServer()){say('Los avisos necesitan el servidor de Hablemos.');return false;}
    if(!pushSupported()){say('Este navegador no permite avisos. En Android usá Chrome.');renderPushStatus();return false;}
    let permission=Notification.permission;
    if(permission==='default'){if(quiet&&!state.tg.push)return false;permission=await Notification.requestPermission();}
    if(permission!=='granted'){state.tg.push=false;persist();renderPushStatus();say('Los avisos quedaron bloqueados. Mirá cómo permitirlos en Configuración → Telegram.');return false;}
    try{
      const reg=await navigator.serviceWorker.ready;
      const status=await srvCall('/api/status');
      if(!status.pushKey){say('El servidor todavía no puede enviar avisos.');return false;}
      let sub=await reg.pushManager.getSubscription();
      // Si el servidor cambió su clave, hay que volver a suscribirse.
      const current=sub&&sub.options&&sub.options.applicationServerKey?new Uint8Array(sub.options.applicationServerKey):null;
      const wanted=keyBytes(status.pushKey);
      if(sub&&current&&(current.length!==wanted.length||current.some((b,i)=>b!==wanted[i]))){await sub.unsubscribe();sub=null;}
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:wanted});
      await srvCall('/api/push/subscribe',{method:'POST',body:{subscription:sub.toJSON()}});
      state.tg.push=true;persist();renderPushStatus();say('🔔 Avisos activados en este teléfono');
      return true;
    }catch(e){renderPushStatus();say(e.code?srvError(e):'No se pudieron activar los avisos en este navegador.');return false;}
  }
  async function disablePush(){
    try{
      const reg=await navigator.serviceWorker.getRegistration();const sub=reg&&await reg.pushManager.getSubscription();
      if(sub){if(isServer())await srvCall('/api/push/unsubscribe',{method:'POST',body:{endpoint:sub.endpoint}}).catch(()=>{});await sub.unsubscribe();}
    }catch(e){}
    state.tg.push=false;persist();
  }
  function renderPushStatus(){
    const el=$('pushStatus');if(!el)return;
    let text,stateName,canEnable=true;
    if(!isServer()){text='Los avisos con Hablemos cerrada necesitan el servidor de Hablemos.';stateName='idle';canEnable=false;}
    else if(!pushSupported()){text='Este navegador no permite avisos. En Android, abrí Hablemos con Chrome (mejor instalada como app).';stateName='conflict';canEnable=false;}
    else if(Notification.permission==='denied'){text='🔴 Los avisos están bloqueados. En el teléfono: Ajustes → Aplicaciones → Chrome (o Hablemos) → Notificaciones → Permitir. Después tocá «Activar avisos».';stateName='invalid';}
    else if(Notification.permission==='granted'&&state.tg.push){text='🟢 Avisos activados: este teléfono avisa los mensajes nuevos aunque Hablemos esté cerrada.';stateName='ok';}
    else{text='⚪ Avisos sin activar en este teléfono. Tocá «Activar avisos» y después «Permitir».';stateName='connecting';}
    el.textContent=text;el.dataset.state=stateName;
    $('pushEnable').hidden=!canEnable;$('pushTest').hidden=!(canEnable&&state.tg.push);
    $('pushEnable').textContent=state.tg.push&&Notification.permission==='granted'?'🔔 Volver a activar':'🔔 Activar avisos';
  }
  let pushChecked=false;
  function ensurePushOnce(){if(pushChecked||!isServer()||!state.tg.push)return;pushChecked=true;enablePush({quiet:true});}

  // ===== V0.5: datos permanentes y copia de seguridad cifrada =====
  // El token no puede ir dentro de la app publicada (el código es público). Para configurar una sola vez:
  // 1) se pide al navegador que no borre los datos; 2) una copia cifrada con clave permite restaurar todo en otro navegador o teléfono.
  async function requestPersist(){
    try{if(navigator.storage&&navigator.storage.persist&&!(await navigator.storage.persisted()))await navigator.storage.persist();}catch(e){}
    renderBackupStatus();
  }
  async function renderBackupStatus(){
    let persisted=false;
    try{persisted=!!(navigator.storage&&navigator.storage.persisted&&await navigator.storage.persisted());}catch(e){}
    $('storageStatus').textContent=persisted?'✅ Este navegador guarda los datos de Hablemos de forma permanente (no los borra por falta de espacio).':'ℹ️ Este navegador todavía no marcó los datos como permanentes. Instalar Hablemos como app ayuda. Igual conviene guardar una copia de seguridad.';
    $('backupLast').textContent=state.lastBackup?'Última copia de seguridad: '+new Date(state.lastBackup).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})+'.':'Todavía no se guardó ninguna copia de seguridad.';
    $('tgBackupHint').hidden=!tgReady()||!!state.lastBackup||isServer();
  }
  const BACKUP_ITER=310000;
  const b64=bytes=>{let out='';for(let i=0;i<bytes.length;i+=0x8000)out+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));return btoa(out);};
  const unb64=text=>Uint8Array.from(atob(text),ch=>ch.charCodeAt(0));
  async function backupKey(password,salt,iter){
    const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  async function makeBackup(password){
    const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
    const key=await backupKey(password,salt,BACKUP_ITER);
    const plain=new TextEncoder().encode(JSON.stringify({app:'hablemos',created:Date.now(),state}));
    const data=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,plain));
    return JSON.stringify({hablemos:'copia-de-seguridad',version:1,cifrado:'AES-GCM, clave PBKDF2-SHA256',iter:BACKUP_ITER,salt:b64(salt),iv:b64(iv),data:b64(data)});
  }
  async function openBackup(text,password){
    let box=null;try{box=JSON.parse(text);}catch(e){}
    if(!box||box.hablemos!=='copia-de-seguridad'||box.version!==1||typeof box.data!=='string')throw new Error('format');
    const iter=Number.isInteger(box.iter)&&box.iter>=100000&&box.iter<=5000000?box.iter:BACKUP_ITER;
    let plain;
    try{const key=await backupKey(password,unb64(box.salt),iter);plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},key,unb64(box.data));}
    catch(e){throw new Error('password');}
    let content=null;try{content=JSON.parse(new TextDecoder().decode(plain));}catch(e){}
    if(!content||content.app!=='hablemos'||!content.state||typeof content.state!=='object')throw new Error('format');
    return content;
  }
  let lastBackupFile=null;
  function downloadFile(file){
    const url=URL.createObjectURL(file);const a=document.createElement('a');
    a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function openBackupDialog(){
    for(const id of ['settingsDialog','tgDialog'])if($(id).open)$(id).close();
    $('backupError').hidden=true;$('backupDone').hidden=true;$('backupDialog').showModal();
  }
  async function createBackup(){
    const p1=$('backupPass').value,p2=$('backupPass2').value,err=$('backupError');err.hidden=true;
    if(p1.length<6){err.textContent='La clave tiene que tener al menos 6 caracteres.';err.hidden=false;return;}
    if(p1!==p2){err.textContent='Las dos claves no coinciden.';err.hidden=false;return;}
    $('backupCreate').disabled=true;
    try{
      state.lastBackup=Date.now();
      const text=await makeBackup(p1);
      const file=new File([text],'hablemos-copia-'+new Date().toISOString().slice(0,10)+'.json',{type:'application/json'});
      lastBackupFile=file;downloadFile(file);
      $('backupPass').value='';$('backupPass2').value='';
      persist();renderBackupStatus();requestPersist();
      $('backupShare').hidden=!(navigator.canShare&&navigator.canShare({files:[file]}));
      $('backupDone').hidden=false;
      notify('Copia de seguridad guardada en Descargas');
    }catch(e){err.textContent='No se pudo crear la copia en este navegador.';err.hidden=false;}
    finally{$('backupCreate').disabled=false;}
  }
  async function restoreBackup(){
    const file=$('restoreFile').files[0],pass=$('restorePass').value,err=$('restoreError');err.hidden=true;
    const fail=msg=>{err.textContent=msg;err.hidden=false;};
    if(!file)return fail('Elegí el archivo de la copia de seguridad (hablemos-copia-….json).');
    if(!pass)return fail('Escribí la clave de la copia.');
    if(file.size>5e6)return fail('Ese archivo es demasiado grande para ser una copia de Hablemos.');
    $('restoreBtn').disabled=true;
    try{
      const content=await openBackup(await file.text(),pass);
      const when=content.created?new Date(content.created).toLocaleString('es-AR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
      if(!window.confirm('¿Reemplazar los datos de este navegador por los de la copia'+(when?' del '+when:'')+'?'))return;
      stopPolling();
      applyStored(content.state);persist();
      setConn(tgReady()?'connecting':'idle');renderAll();startPolling();requestPersist();
      $('restorePass').value='';$('restoreFile').value='';$('restoreDialog').close();
      notify('Copia restaurada'+(tgReady()?'. Telegram quedó conectado.':'.'));
    }catch(e){fail(e.message==='password'?'La clave no es correcta.':e.message==='format'?'Ese archivo no es una copia de seguridad de Hablemos.':'No se pudo abrir la copia.');}
    finally{$('restoreBtn').disabled=false;}
  }
  function updateOffline(){$('offline').hidden=navigator.onLine;}
  function updatePrefs(){
    document.body.classList.toggle('large',state.large);document.body.classList.toggle('contrast',state.contrast);
    $('largerText').checked=state.large;$('highContrast').checked=state.contrast;
    $('suggestToggle').checked=state.suggest;$('pictosToggle').checked=state.pictos;
    $('holdSelect').value=String(state.holdMs);$('repeatSelect').value=String(state.repeatMs);
    document.body.classList.toggle('hold-on',state.holdMs>0);
    document.body.style.setProperty('--hold',state.holdMs+'ms');
    const tips=[];
    if(state.holdMs)tips.push('Mantené presionado cada botón '+(state.holdMs/1000).toLocaleString('es-AR')+' s para elegirlo.');
    if(state.repeatMs)tips.push('Los toques repetidos se ignoran durante '+(state.repeatMs/1000).toLocaleString('es-AR')+' s.');
    $('touchHint').textContent=tips.join(' ');$('touchHint').hidden=!tips.length;
    $('scanSelect').value=String(state.scanMs);
    if(state.scanMs)startScan();else stopScan();
  }
  // V0.3: protección de toques. Solo afecta a los botones del tablero, no a los formularios de configuración.
  // Los diálogos con data-board (como la confirmación de envío) también están protegidos.
  const boardButton=target=>{const b=target instanceof Element?target.closest('button'):null;return b&&!b.closest('dialog:not([data-board])')?b:null;};
  let holdTimer=null,holdBtn=null,holdStart=null,lastAccepted=0;
  function cancelHold(){clearTimeout(holdTimer);holdTimer=null;if(holdBtn)holdBtn.classList.remove('holding');holdBtn=null;}
  document.addEventListener('pointerdown',e=>{
    if(!state.holdMs||e.button>0)return;
    const b=boardButton(e.target);if(!b||b.disabled)return;
    cancelHold();holdBtn=b;holdStart={x:e.clientX,y:e.clientY};
    void b.offsetWidth;b.classList.add('holding');
    holdTimer=setTimeout(()=>{
      const btn=holdBtn;cancelHold();
      try{if(navigator.vibrate)navigator.vibrate(30);}catch(err){}
      btn.click();
    },state.holdMs);
  });
  document.addEventListener('pointermove',e=>{
    if(holdBtn&&holdStart&&Math.hypot(e.clientX-holdStart.x,e.clientY-holdStart.y)>14)cancelHold();
  });
  for(const type of ['pointerup','pointercancel'])document.addEventListener(type,cancelHold);
  document.addEventListener('contextmenu',e=>{if(state.holdMs&&boardButton(e.target))e.preventDefault();});
  document.addEventListener('click',e=>{
    const b=boardButton(e.target);if(!b)return;
    // Con «mantener presionado», el toque corto no elige. El teclado y los pulsadores (detail 0) siguen funcionando.
    if(state.holdMs&&e.detail>0){
      e.preventDefault();e.stopImmediatePropagation();
      if($('toast').hidden)notify('Mantené presionado el botón hasta que se complete la barra.');
      return;
    }
    if(state.repeatMs){
      const now=Date.now();
      if(now-lastAccepted<state.repeatMs){e.preventDefault();e.stopImmediatePropagation();return;}
      lastAccepted=now;
    }
  },true);
  // ===== V2.1: modo barrido =====
  // Un recuadro amarillo pasa por cada botón, uno por uno. Para elegir el resaltado se toca en cualquier lugar
  // de la pantalla, o se aprieta un pulsador (Bluetooth o USB, que funciona como Espacio o Enter).
  // Recorre el tablero, después Borrar/Hablar/Enviar y al final «Necesito ayuda». En «¿A quién se lo mando?» y
  // en la ayuda recorre las opciones de esa ventana. La configuración se abre igual: manteniendo apretado ⚙.
  let scanTimer=null,scanIdx=-1,scanEl=null,lastScanPick=0,gearDownAt=0;
  const scanning=()=>state.scanMs>0;
  const visible=el=>!!(el&&!el.hidden&&!el.disabled&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  function scanTargets(){
    const dialogs=[...document.querySelectorAll('dialog[open]')];
    if(dialogs.length){
      const top=dialogs[dialogs.length-1];
      // Solo se barren las ventanas pensadas para Diego; en las de configuración se pausa.
      return top.hasAttribute('data-board')?[...top.querySelectorAll('button')].filter(visible):null;
    }
    const all=[...document.querySelectorAll('.app button')].filter(b=>b.id!=='settingsOpen'&&!b.classList.contains('aiwait')&&visible(b));
    const help=all.filter(b=>b.id==='helpBtn');
    return [...all.filter(b=>b.id!=='helpBtn'),...help];
  }
  function scanMark(el){
    if(scanEl&&scanEl!==el)scanEl.classList.remove('scan-focus');
    scanEl=el;if(el){el.classList.add('scan-focus');}
  }
  function scanStep(){
    clearTimeout(scanTimer);
    if(!scanning())return;
    const list=scanTargets();
    if(list===null){scanMark(null);scanIdx=-1;}
    else if(list.length){
      // Si el botón resaltado sigue en pantalla, se avanza desde él; si la pantalla cambió, se empieza de nuevo.
      const at=scanEl?list.indexOf(scanEl):-1;
      scanIdx=at>=0?(at+1)%list.length:(scanIdx<0||scanIdx>=list.length?0:scanIdx);
      scanMark(list[scanIdx]);
    }
    scanTimer=setTimeout(scanStep,state.scanMs);
  }
  function startScan(){document.body.classList.add('scan-on');if(!scanTimer){scanIdx=-1;scanStep();}}
  function stopScan(){clearTimeout(scanTimer);scanTimer=null;scanMark(null);scanIdx=-1;document.body.classList.remove('scan-on');}
  function scanPick(){
    const now=Date.now();
    if(now-lastScanPick<400)return; // un rebote del dedo no elige dos veces
    if(!scanEl||!document.contains(scanEl)||!visible(scanEl)){scanStep();return;}
    lastScanPick=now;
    const el=scanEl;scanMark(null);scanIdx=-1;
    try{if(navigator.vibrate)navigator.vibrate(30);}catch(err){}
    el.click();
    // Después de elegir, se vuelve a empezar desde el primer botón de lo que quedó en pantalla.
    clearTimeout(scanTimer);scanTimer=setTimeout(scanStep,Math.min(state.scanMs,800));
  }
  const scanPaused=()=>scanTargets()===null;
  // Se escucha en window (antes que todo lo demás), para que el toque no llegue al botón que está debajo del dedo.
  window.addEventListener('pointerdown',e=>{
    if(!scanning()||scanPaused()||e.button>0)return;
    if(e.target instanceof Element&&e.target.closest('#settingsOpen')){gearDownAt=Date.now();return;} // ⚙ sigue abriéndose al mantenerlo
    e.preventDefault();e.stopPropagation();
    scanPick();
  },true);
  window.addEventListener('pointerup',e=>{
    if(!scanning()||!gearDownAt)return;
    const held=Date.now()-gearDownAt;gearDownAt=0;
    if(held<900&&!scanPaused())scanPick(); // un toque corto sobre ⚙ también elige
  },true);
  window.addEventListener('click',e=>{
    if(!scanning()||scanPaused()||!e.isTrusted||e.detail===0)return;
    e.preventDefault();e.stopImmediatePropagation(); // el clic real ya se usó para elegir el botón resaltado
  },true);
  window.addEventListener('contextmenu',e=>{if(scanning()&&!scanPaused())e.preventDefault();},true);
  window.addEventListener('keydown',e=>{
    if(!scanning()||scanPaused()||e.repeat)return;
    if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopPropagation();scanPick();}
  },true);
  $('scanSelect').addEventListener('change',e=>{state.scanMs=Number(e.target.value);persist();updatePrefs();});
  $('msgStrip').addEventListener('click',()=>{if(state.message.trim())speakMessage();else notify('Tocá las palabras de abajo para armar tu mensaje.');});
  $('eraseBtn').addEventListener('click',()=>{if(!state.message.trim()&&!state.tokens.length){notify('No hay nada para borrar.');return;}eraseLast();});
  $('speakBtn').addEventListener('click',()=>{if(!state.message.trim()){notify('Primero armá un mensaje.');return;}speakMessage();});
  $('sendBtn').addEventListener('click',openSendSheet);
  $('sheetCancel').addEventListener('click',()=>$('sendSheet').close());
  // 🆘 Ayuda: se dice en voz alta enseguida y, si hay Telegram, pregunta si avisar a toda la familia.
  let helpOpenedAt=0;
  $('helpBtn').addEventListener('click',()=>{
    const msg='Necesito ayuda ahora. Por favor, vení.';setMessage(msg);talk(msg,'diego');
    if(tgContacts().length){helpOpenedAt=Date.now();$('helpCount').textContent=tgContacts().map(c=>c.name).join(', ');$('helpSheet').showModal();}
    else notify('Pedido de ayuda dicho en voz alta. Para avisar por mensaje, conectá a la familia por Telegram.');
  });
  $('helpNo').addEventListener('click',()=>$('helpSheet').close());
  $('helpYes').addEventListener('click',async()=>{
    if(Date.now()-helpOpenedAt<600)return; // evita que un doble toque mande el aviso sin querer
    $('helpSheet').close();
    if(!navigator.onLine){notify('Sin internet: no se pudo avisar. Pedí ayuda en voz alta.');return;}
    notify('Avisando a la familia…');
    try{
      let sent=0;
      if(isServer()){const r=await srvCall('/api/help',{method:'POST',body:{}});sent=r.sent;}
      else{
        const text='🆘 Necesito ayuda ahora. Por favor, vení o llamame. (Aviso enviado desde Hablemos)';
        for(const c of tgContacts()){try{await tgCall('sendMessage',{chat_id:c.telegramId,text});pushThread(c.telegramId,'out',text,Date.now());sent++;}catch(e){}}
        persist();
      }
      const ok=sent>0;
      notify(ok?'🆘 Aviso enviado a '+sent+(sent===1?' persona':' personas'):'No se pudo enviar el aviso. Pedí ayuda en voz alta.');
      talk(ok?'Listo, avisé a tu familia.':'No pude avisar. Probá de nuevo.');
      if(isServer())kickPolling();
    }catch(e){notify('No se pudo enviar el aviso. Pedí ayuda en voz alta.');talk('No pude avisar. Probá de nuevo.');}
  });
  // Configuración: se abre manteniendo apretado ⚙, para que no se abra por un toque sin querer.
  function openSettings(){renderVoiceSettings();renderBackupStatus();$('settingsDialog').showModal();}
  let gearTimer=null,gearOpenedAt=0;
  const gear=$('settingsOpen');
  gear.addEventListener('pointerdown',()=>{
    if(state.holdMs)return; // con «mantener presionado» activado, ya lo resuelve la protección general
    clearTimeout(gearTimer);gear.classList.add('pressing');
    gearTimer=setTimeout(()=>{gear.classList.remove('pressing');gearOpenedAt=Date.now();openSettings();},1000);
  });
  for(const type of ['pointerup','pointercancel','pointerleave'])gear.addEventListener(type,()=>{clearTimeout(gearTimer);gear.classList.remove('pressing');});
  gear.addEventListener('click',e=>{
    if(e.detail===0){openSettings();return;} // teclado, pulsador o protección de toques
    if(Date.now()-gearOpenedAt<1500)return;
    notify('Para abrir la configuración, mantené apretado ⚙ un segundo.');
  });
  $('manageContacts').addEventListener('click',()=>{$('settingsDialog').close();renderContactList();$('contactsDialog').showModal();});
  $('ownBlockBtn').addEventListener('click',()=>{$('settingsDialog').close();$('blockDialog').showModal();});
  $('ownPhraseBtn').addEventListener('click',()=>{$('settingsDialog').close();$('phraseDialog').showModal();});
  let boardSize='';
  new ResizeObserver(()=>{const r=$('board').getBoundingClientRect();const k=Math.round(r.width)+'x'+Math.round(r.height);if(k!==boardSize){boardSize=k;renderBoard();}}).observe($('board'));
  $('blockForm').addEventListener('submit',e=>{
    e.preventDefault();const word=$('newBlock').value.trim().replace(/\s+/g,' ');if(!word)return;
    if(state.customBlocks.length>=80){notify('Se alcanzó el máximo de 80 bloques personalizados.');return;}
    if(state.customBlocks.includes(word)){notify('Esta palabra ya está guardada.');return;}
    state.customBlocks.push(word);$('newBlock').value='';$('blockDialog').close();view='cat:propias';page=0;persist();renderScreen();notify('Palabra agregada en «Mis palabras».');
  });
  $('largerText').addEventListener('change',e=>{state.large=e.target.checked;updatePrefs();persist();});
  $('highContrast').addEventListener('change',e=>{state.contrast=e.target.checked;updatePrefs();persist();});
  $('suggestToggle').addEventListener('change',e=>{state.suggest=e.target.checked;persist();renderScreen();});
  $('forgetLearned').addEventListener('click',()=>{
    if(!Object.keys(state.learned).length){notify('Todavía no hay palabras aprendidas.');return;}
    if(!window.confirm('¿Olvidar el orden de palabras aprendido? Las sugerencias base se mantienen.'))return;
    state.learned={};lastLearned='';persist();renderScreen();notify('Sugerencias aprendidas borradas');
  });
  $('voiceSelect').addEventListener('change',e=>{state.voiceURI=e.target.value;persist();renderVoiceSettings();talk('Hola, esta es mi voz.','diego');});
  for(const [id,key] of [['voiceRate','rate'],['voicePitch','pitch'],['voiceVolume','volume']]){
    $(id).addEventListener('input',e=>{state[key]=Number(e.target.value);renderVoiceSettings();persist();});
  }
  $('voiceTest').addEventListener('click',()=>talk('Hola, esta es mi voz. ¿Me escuchás bien?','diego'));
  $('voiceReset').addEventListener('click',()=>{state.voiceURI='';state.rate=initial.rate;state.pitch=initial.pitch;state.volume=initial.volume;renderVoiceSettings();persist();notify('Voz restablecida');});
  $('holdSelect').addEventListener('change',e=>{state.holdMs=Number(e.target.value);cancelHold();updatePrefs();persist();});
  $('repeatSelect').addEventListener('change',e=>{state.repeatMs=Number(e.target.value);updatePrefs();persist();});
  if(hasVoice()&&'onvoiceschanged' in window.speechSynthesis)window.speechSynthesis.addEventListener('voiceschanged',()=>{if($('settingsDialog').open)renderVoiceSettings();});
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
  $('contactForm').addEventListener('submit',e=>{
    e.preventDefault();const name=$('newContactName').value.trim().replace(/\s+/g,' ');const phone=$('newContactPhone').value.replace(/\D/g,'');
    const error=$('contactError');error.hidden=true;
    if(!name||phone.length<8||phone.length>15||!/^[0-9]+$/.test(phone)){error.textContent='Ingresá nombre y teléfono internacional válido (8 a 15 dígitos).';error.hidden=false;return;}
    if(state.contacts.some(c=>c.phone===phone)){error.textContent='El teléfono ya está guardado.';error.hidden=false;return;}
    if(state.contacts.length>=50){error.textContent='Se alcanzó el máximo de contactos.';error.hidden=false;return;}
    const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
    state.contacts.push({id,name,phone});persist();renderScreen();renderContactList();
    $('newContactName').value='';$('newContactPhone').value='';$('contactsDialog').close();notify('Contacto guardado: '+name);
  });
  $('phraseForm').addEventListener('submit',e=>{
    e.preventDefault();const s=$('newPhrase').value.trim();if(!s)return;
    if(state.ownPhrases.length>=100){notify('Llegaste al máximo de frases personales.');return;}
    state.ownPhrases.push(s);persist();view='pcat:propias';page=0;renderScreen();$('newPhrase').value='';$('phraseDialog').close();notify('Frase agregada en «Mis frases».');
  });
  window.addEventListener('online',updateOffline);window.addEventListener('offline',updateOffline);
  // Telegram
  $('tgOpen').addEventListener('click',()=>{$('settingsDialog').close();renderTgDialog();$('tgDialog').showModal();});
  $('tgConnect').addEventListener('click',connectTelegram);
  $('tgRefresh').addEventListener('click',()=>{if(!navigator.onLine){notify('Se necesita internet.');return;}reportPending=true;kickPolling();notify('Buscando…');});
  $('tgCopyLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(botLink());notify('Enlace copiado');}catch(e){notify('No se pudo copiar. El enlace es: '+botLink());}});
  $('tgShareLink').addEventListener('click',shareInvite);
  $('contactsInvite').addEventListener('click',shareInvite);
  $('joinYes').addEventListener('click',acceptJoin);
  $('joinNo').addEventListener('click',()=>{dismissedJoin.add($('joinRequest').dataset.chatId);renderJoinRequest();});
  $('tgNewInvite').addEventListener('click',async()=>{
    if(!window.confirm('¿Crear un enlace de invitación nuevo? El anterior deja de conectar solo. Las personas ya conectadas se mantienen.'))return;
    try{const r=await srvCall('/api/invite/new',{method:'POST',body:{}});state.tg.invite=r.invite;persist();renderTgDialog();notify('Enlace nuevo listo para compartir');}
    catch(e){notify(srvError(e));}
  });
  $('tgAutoRead').addEventListener('change',e=>{state.tg.autoRead=e.target.checked;persist();});
  $('tgChime').addEventListener('change',e=>{state.tg.chime=e.target.checked;persist();if(e.target.checked)chime();});
  $('aiReplies').addEventListener('change',e=>{state.aiReplies=e.target.checked;persist();});
  $('cloudVoice').addEventListener('change',e=>{state.cloudVoice=e.target.checked;persist();talk('Hola, esta es mi voz.','diego');});
  $('pushEnable').addEventListener('click',()=>enablePush());
  $('pushTest').addEventListener('click',async()=>{
    try{const r=await srvCall('/api/push/test',{method:'POST',body:{}});notify(r.sent?'Aviso enviado: mirá la barra de notificaciones del teléfono.':'No hay teléfonos con avisos activados.');}
    catch(e){notify(srvError(e));}
  });
  // El service worker avisa que llegó un push: se consulta enseguida para mostrar el mensaje.
  if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='hablemos-push'&&tgReady())kickPolling();});
  $('tgDisconnect').addEventListener('click',disconnectTelegram);
  $('incomingSay').addEventListener('click',()=>{
    const c=state.contacts.find(x=>x.id===incomingContactId);
    if(incomingMsg&&c)playAudio(c,incomingMsg);else talk($('incomingText').textContent);
  });
  // Responder: muestra respuestas listas para lo que preguntaron (o el tablero, si no es una persona de Telegram).
  $('incomingReply').addEventListener('click',()=>{
    const c=state.contacts.find(x=>x.id===incomingContactId);
    $('incoming').hidden=true;
    if(c&&c.telegramId){openReply(c);return;}
    view='main';page=0;renderScreen();
  });
  $('incomingClose').addEventListener('click',()=>{$('incoming').hidden=true;});
  $('tgReplace').addEventListener('click',replaceToken);
  $('srvConnect').addEventListener('click',()=>connectServer());
  $('srvMove').addEventListener('click',()=>connectServer(DEFAULT_SERVER_URL,'srvMovePin','srvMoveError','srvMove'));
  $('srvPinSave').addEventListener('click',changeServerPin);
  $('backupOpen').addEventListener('click',openBackupDialog);
  $('tgBackupBtn').addEventListener('click',openBackupDialog);
  $('backupCreate').addEventListener('click',createBackup);
  $('backupShare').addEventListener('click',async()=>{if(!lastBackupFile)return;try{await navigator.share({files:[lastBackupFile],title:'Copia de seguridad de Hablemos'});}catch(e){}});
  $('restoreOpen').addEventListener('click',()=>{$('settingsDialog').close();$('restoreError').hidden=true;$('restoreDialog').showModal();});
  $('restoreBtn').addEventListener('click',restoreBackup);
  // Sigue recibiendo aunque la pestaña quede en segundo plano. Al volver, consulta enseguida
  // (en Android la app se congela en segundo plano y la conexión pendiente puede haberse cortado).
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&tgReady())kickPolling();});
  window.addEventListener('online',()=>{if(tgReady()){setConn('connecting');kickPolling();}});
  window.addEventListener('offline',()=>{if(tgReady())setConn('offline');});
  function renderAll(){
    updatePrefs();renderScreen();renderConn();renderJoinRequest();
    if($('tgDialog').open)renderTgDialog();
    if($('settingsDialog').open)renderVoiceSettings();
    if($('contactsDialog').open)renderContactList();
    renderBackupStatus();
  }
  // Otra pestaña o ventana de Hablemos guardó cambios: se cargan acá para no pisarlos después.
  window.addEventListener('storage',e=>{
    if(e.storageArea!==localStorage||(e.key!==STORE_KEY&&e.key!==null))return;
    const oldKey=tgKey(),oldOffset=state.tg.offset,oldSeq=state.tg.seq;
    applyStored(loadStored(STORE_KEY));
    if(tgKey()===oldKey){state.tg.offset=Math.max(state.tg.offset,oldOffset);state.tg.seq=Math.max(state.tg.seq,oldSeq);}
    else{stopPolling();setConn(tgReady()?'connecting':'idle');}
    renderAll();
    startPolling();
  });
  renderAll();updateOffline();startPolling();if(tgReady())requestPersist();
  paintStaticIcons();
  $('pictosToggle').addEventListener('change',e=>{state.pictos=e.target.checked;persist();renderScreen();});
  // Secure origin is required for an installable Android PWA and service worker.
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
