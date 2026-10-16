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
  const repeatOptions=[0,500,1000,2000];
  const initial = {contacts:[],selectedContactId:null,ownPhrases:[],message:'',category:'frecuentes',combine:false,large:false,contrast:false,
    tokens:[],punctuation:'.',buildCategory:'inicio',savedMessages:[],customBlocks:[],mode:'build',
    suggest:true,learned:{},voiceURI:'',rate:.9,pitch:1,volume:1,holdMs:0,repeatMs:0,lastBackup:0};
  const clampNumber=(value,min,max,fallback)=>typeof value==='number'&&isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
  // V0.4: Telegram. threads = {chatId: [{dir:'in'|'out', text, date}]}; pending = personas que tocaron «Iniciar» y aún no están vinculadas.
  // V0.6: server = {url, pin} cuando Hablemos se conecta a su propio servidor (el token queda en el servidor). seq/pv = hasta dónde se sincronizó.
  const tgInitial=()=>({token:'',server:null,seq:0,pv:-1,bot:null,offset:0,autoRead:true,confirm:true,pending:[],threads:{}});
  const DEFAULT_SERVER_URL='https://hablemos-production.up.railway.app';
  const serverUrlOk=v=>typeof v==='string'&&/^https?:\/\/[^\s/]+(:\d+)?\/?$/.test(v);
  const chatIdOk=v=>typeof v==='string'&&/^-?\d{1,20}$/.test(v);
  let state = {...initial,learned:{},tg:tgInitial()};
  function loadStored(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch(e){return null;}
  }
  const STORE_KEY='hablemos.v3';
  // Lee y valida los datos guardados. Se usa al abrir y cuando otra pestaña de Hablemos guarda cambios.
  function applyStored(stored){
    state={...initial,learned:{},tg:tgInitial()};
    if(!stored)return;
    if(Array.isArray(stored.contacts)) state.contacts=stored.contacts.filter(x=>x&&typeof x.name==='string'&&typeof x.phone==='string'&&typeof x.id==='string').slice(0,50).map(x=>({id:x.id,name:x.name.slice(0,36),phone:x.phone.replace(/\D/g,''),...(chatIdOk(x.telegramId)?{telegramId:x.telegramId}:{})}));
    const tg=stored.tg;
    const tokenOk=tg&&typeof tg.token==='string'&&/^\d{3,15}:[\w-]{20,80}$/.test(tg.token);
    const serverOk=tg&&tg.server&&serverUrlOk(tg.server.url)&&typeof tg.server.pin==='string'&&tg.server.pin.length>0&&tg.server.pin.length<=128;
    if(tg&&typeof tg==='object'&&!Array.isArray(tg)&&(tokenOk||serverOk)){
      const clean=tgInitial();
      if(serverOk){clean.server={url:tg.server.url.replace(/\/$/,''),pin:tg.server.pin};if(Number.isInteger(tg.seq)&&tg.seq>=0)clean.seq=tg.seq;if(Number.isInteger(tg.pv))clean.pv=tg.pv;}
      else clean.token=tg.token;
      if(tg.bot&&typeof tg.bot.username==='string')clean.bot={username:tg.bot.username.slice(0,64),name:String(tg.bot.name||tg.bot.username).slice(0,64),...(Number.isInteger(tg.bot.id)?{id:tg.bot.id}:{})};
      if(Number.isInteger(tg.offset)&&tg.offset>=0)clean.offset=tg.offset;
      if(typeof tg.autoRead==='boolean')clean.autoRead=tg.autoRead;
      if(typeof tg.confirm==='boolean')clean.confirm=tg.confirm;
      if(Array.isArray(tg.pending))clean.pending=tg.pending.filter(p=>p&&chatIdOk(p.chatId)&&typeof p.name==='string').slice(0,20).map(p=>({chatId:p.chatId,name:p.name.slice(0,64),username:typeof p.username==='string'?p.username.slice(0,64):''}));
      if(tg.threads&&typeof tg.threads==='object'){
        for(const [chatId,list] of Object.entries(tg.threads).slice(0,30)){
          if(!chatIdOk(chatId)||!Array.isArray(list))continue;
          clean.threads[chatId]=list.filter(m=>m&&(m.dir==='in'||m.dir==='out')&&typeof m.text==='string'&&Number.isFinite(m.date)).slice(-100).map(m=>({dir:m.dir,text:m.text.slice(0,4096),date:m.date,...(Number.isInteger(m.id)?{id:m.id}:{})}));
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
    if(Number.isFinite(stored.lastBackup)&&stored.lastBackup>0)state.lastBackup=stored.lastBackup;
  }
  applyStored(loadStored(STORE_KEY)||loadStored('hablemos.v2')||loadStored('hablemos.v1'));
  // Conserva los datos que esta versión no conoce (por ejemplo, guardados por una versión más nueva en otra pestaña).
  function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify({...(loadStored(STORE_KEY)||{}),...state}));}catch(e){notify('No hay espacio para guardar preferencias.');}}
  let toastTimer;
  function notify(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},3000);}
  function updateMessage(s, preserveTokens=false){
    state.message=s.slice(0,1000);$('message').value=state.message;
    if(!preserveTokens){state.tokens=[];renderTokens();}
    persist();
  }
  function setMode(mode,save=true){
    state.mode=mode;
    for(const m of ['build','quick','saved']){
      const tab=$({build:'tabBuild',quick:'tabQuick',saved:'tabSaved'}[m]);
      const panel=$({build:'builderPanel',quick:'quickPanel',saved:'savedPanel'}[m]);
      const active=m===mode;
      panel.hidden=!active;
      if(active)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current');
    }
    if(mode==='saved')renderSaved();
    if(save)persist();
  }
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
  function updateBuilt(){updateMessage(composeTokens(),true);renderTokens();renderPunctuation();}
  function addBlock(word){
    if(state.tokens.length>=40){notify('Mensaje demasiado largo.');return;}
    state.tokens.push(word);
    if(state.tokens.length===1)state.punctuation=word.startsWith('¿')?'?':word.startsWith('¡')?'!':'.';
    if(composeTokens().length>1000){state.tokens.pop();notify('El mensaje llegó al máximo de 1000 caracteres.');return;}
    updateBuilt();
    if(state.tokens.length===1 && word==='Me siento')state.buildCategory='sentimientos';
    else if(state.tokens.length===1 && word==='Tengo')state.buildCategory='detalles';
    else if(state.tokens.length===1 && ['inicio','preguntas'].includes(state.buildCategory))state.buildCategory='acciones';
    else if(state.tokens.length===2 && state.buildCategory==='acciones')state.buildCategory='personas';
    else if(state.tokens.length===3 && state.buildCategory==='personas')state.buildCategory='tiempo';
    renderBuildCategories();renderBuildTiles();
  }
  function renderTokens(){
    const root=$('tokens');root.replaceChildren();
    $('undoBtn').disabled=state.tokens.length===0;
    renderSuggestions();
    if(!state.tokens.length){const hint=document.createElement('span');hint.className='muted';hint.textContent='Tocá un botón para empezar. También podés probar el ejemplo.';root.append(hint);return;}
    state.tokens.forEach((part,i)=>{
      const b=document.createElement('button');b.className='token';b.type='button';b.textContent=part+'  ×';
      b.title='Quitar '+part;b.setAttribute('aria-label','Quitar parte '+(i+1)+': '+part);
      b.addEventListener('click',()=>{state.tokens.splice(i,1);updateBuilt();});root.append(b);
    });
  }
  function renderPunctuation(){
    document.querySelectorAll('[data-punctuation]').forEach(btn=>{
      btn.setAttribute('aria-pressed',String(btn.dataset.punctuation===state.punctuation));
    });
  }
  function renderBuildCategories(){
    const root=$('buildCategories');root.replaceChildren();
    for(const [key,meta] of Object.entries(builderCategories)){
      const b=document.createElement('button');b.type='button';b.className='category';b.role='tab';b.textContent=meta.label;
      b.setAttribute('aria-selected',String(state.buildCategory===key));
      b.addEventListener('click',()=>{state.buildCategory=key;renderBuildCategories();renderBuildTiles();persist();});root.append(b);
    }
    $('stepHint').textContent=state.tokens.length ? 'También podés cambiar de categoría' : 'Empezá por «Inicio»';
  }
  function renderBuildTiles(){
    const root=$('buildTiles');root.replaceChildren();
    const entries=state.buildCategory==='propias'?state.customBlocks:builderCategories[state.buildCategory].entries;
    for(const word of entries){
      const b=document.createElement('button');b.type='button';b.className='phrase';b.textContent=word;
      b.setAttribute('aria-label','Agregar al mensaje: '+word);b.addEventListener('click',()=>addBlock(word));root.append(b);
    }
    if(state.buildCategory==='propias'&&!entries.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay palabras personalizadas. Podés crear una abajo.';root.append(p);}
  }
  function categoryOf(word){
    for(const [key,meta] of Object.entries(builderCategories))if(meta.entries.includes(word))return key;
    return state.customBlocks.includes(word)?'propias':null;
  }
  function getSuggestions(){
    const prev=state.tokens.length?state.tokens[state.tokens.length-1]:START;
    const used=new Set(state.tokens);
    const learned=Object.entries(state.learned[prev]||{}).sort((a,b)=>b[1]-a[1]).map(([word])=>word);
    const base=nextWords[prev]||nextByCategory[categoryOf(prev)]||['por favor','ahora','hoy'];
    const result=[];
    for(const word of learned)if(!used.has(word)&&result.length<4)result.push({word,learned:true});
    for(const word of base)if(!used.has(word)&&!result.some(x=>x.word===word)&&result.length<6)result.push({word,learned:false});
    return result;
  }
  function renderSuggestions(){
    const box=$('suggestBox');box.hidden=!state.suggest;
    if(!state.suggest)return;
    const root=$('suggestions');root.replaceChildren();
    $('suggestTitle').textContent=state.tokens.length?'💡 Para seguir':'💡 Para empezar';
    const list=getSuggestions();
    if(!list.length){const p=document.createElement('p');p.className='muted';p.textContent='Elegí una palabra de las categorías de abajo.';root.append(p);return;}
    for(const {word,learned} of list){
      const b=document.createElement('button');b.type='button';b.className='suggestion'+(learned?' learned':'');b.textContent=word;
      b.setAttribute('aria-label','Agregar sugerencia'+(learned?' usada antes':'')+': '+word);
      b.addEventListener('click',()=>addBlock(word));root.append(b);
    }
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
  function selectPhrase(phrase){
    const current=state.message.trim();const s=state.combine&&current?current+' '+phrase:phrase;
    updateMessage(s);notify('Mensaje preparado');
  }
  function renderCategories(){
    const root=$('categories');root.replaceChildren();
    for(const [key,val] of Object.entries(data)){
      const b=document.createElement('button');b.type='button';b.className='category';b.role='tab';b.textContent=val.label;
      b.setAttribute('aria-selected',String(state.category===key));
      b.addEventListener('click',()=>{state.category=key;persist();renderCategories();renderPhrases();});root.append(b);
    }
  }
  function renderPhrases(){
    const root=$('phrases');root.replaceChildren();
    const entries=state.category==='propias'?state.ownPhrases.map(x=>['🗣️',x]):data[state.category].phrases;
    for(const [emoji,phrase] of entries){
      const b=document.createElement('button');b.className='phrase';b.type='button';b.setAttribute('aria-label','Preparar mensaje: '+phrase);
      const e=document.createElement('span');e.className='emoji';e.textContent=emoji;e.setAttribute('aria-hidden','true');
      const label=document.createElement('span');label.textContent=phrase;
      b.append(e,label);b.addEventListener('click',()=>selectPhrase(phrase));root.append(b);
    }
    if(state.category==='propias'){
      const b=document.createElement('button');b.className='phrase add-phrase';b.type='button';b.textContent='＋ Crear una frase';
      b.addEventListener('click',()=>$('phraseDialog').showModal());root.append(b);
    }
  }
  function renderSaved(){
    const root=$('savedList');root.replaceChildren();
    if(!state.savedMessages.length){const p=document.createElement('p');p.className='muted';p.textContent='Aún no guardaste ningún mensaje. Escribí uno con los botones y tocá «Guardar esta frase».';root.append(p);return;}
    for(const m of state.savedMessages){
      const row=document.createElement('div');row.className='saved-row';
      const b=document.createElement('button');b.type='button';b.className='saved-pick';b.textContent=m;b.setAttribute('aria-label','Usar mensaje guardado: '+m);
      b.addEventListener('click',()=>{updateMessage(m);setMode('build');notify('Frase guardada lista para hablar o enviar');window.scrollTo({top:0,behavior:'smooth'});});
      const del=document.createElement('button');del.type='button';del.className='saved-delete';del.textContent='✕';del.setAttribute('aria-label','Eliminar mensaje guardado');
      del.addEventListener('click',()=>{if(!window.confirm('¿Eliminar este mensaje guardado?'))return;state.savedMessages=state.savedMessages.filter(x=>x!==m);persist();renderSaved();});
      row.append(b,del);root.append(row);
    }
  }
  function selected(){return state.contacts.find(c=>c.id===state.selectedContactId)||null;}
  function renderSelectedContact(){
    const c=selected();$('contactName').textContent=c?c.name:'Elegir contacto';
    $('contactHint').textContent=c?'Tocar para cambiar':'Agregá un contacto de confianza';
    $('contactAvatar').textContent=c?c.name.trim().charAt(0).toLocaleUpperCase('es'):'+';
    renderChat();
  }
  function renderContactList(){
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
  function talk(phrase){
    const m=(phrase||'').trim();if(!m){notify('Primero prepará un mensaje.');return;}
    if(!hasVoice()){notify('Este navegador no tiene voz disponible.');return;}
    try{
      window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(m);
      const voice=pickVoice();
      utterance.lang=voice?voice.lang:'es-AR';if(voice)utterance.voice=voice;
      utterance.rate=state.rate;utterance.pitch=state.pitch;utterance.volume=state.volume;
      window.speechSynthesis.speak(utterance);
    }catch(e){notify('No se pudo usar la voz en este dispositivo.');}
  }
  function speakMessage(){learnFromMessage();talk(state.message);}
  function renderVoiceSettings(){
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
  function sendWhatsApp(){
    const msg=state.message.trim();if(!msg){notify('Primero prepará un mensaje.');return;}
    const c=selected();if(!c){renderContactList();$('contactsDialog').showModal();notify('Elegí o agregá un contacto.');return;}
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
  function pushThread(chatId,dir,text,date,id){
    const list=state.tg.threads[chatId]||(state.tg.threads[chatId]=[]);
    if(Number.isInteger(id)&&list.some(m=>m.dir===dir&&m.id===id))return false; // ya estaba (evita duplicados)
    list.push({dir,text:text.slice(0,4096),date,...(Number.isInteger(id)?{id}:{})});
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
    if(changed){persist();renderChat();if($('tgDialog').open)renderTgDialog();}
  }
  // Aplica lo que manda el servidor: personas (pendientes y conectadas) y mensajes nuevos.
  // Las personas conectadas en el servidor aparecen como contactos en cualquier dispositivo nuevo.
  function handleServerSync(r){
    if(!r||typeof r!=='object')return;
    const first=state.tg.seq===0||!!r.reset;
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
      const added=pushThread(chatId,m.dir,m.text,Number(m.date)||Date.now(),m.seq);
      // Al conectar por primera vez se cargan los mensajes viejos sin anunciarlos.
      if(added&&m.dir==='in'&&!first){const c=contactByChat(chatId);if(c)showIncoming(c,m.text);}
    }
    if(Number.isInteger(r.seq))state.tg.seq=r.seq;
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
    for(const id of ['chatStatus','tgConnStatus']){const el=$(id);el.textContent=text;el.hidden=!text;el.dataset.state=tgConn;}
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
  function showIncoming(contact,text){
    incomingContactId=contact.id;
    $('incomingName').textContent='📩 '+contact.name+':';$('incomingText').textContent=text;$('incoming').hidden=false;
    if(state.tg.autoRead)talk(contact.name+' dice: '+text);
  }
  function formatTime(ms){
    const d=new Date(ms),today=new Date();
    const time=d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    return d.toDateString()===today.toDateString()?time:d.toLocaleDateString('es-AR',{day:'numeric',month:'short'})+' '+time;
  }
  function renderChat(){
    const c=selected();
    const show=tgReady()&&!!c&&!!c.telegramId;
    $('chatCard').hidden=!show;
    for(const id of ['tgBtn','builderTgBtn'])$(id).hidden=!tgReady();
    document.querySelectorAll('.actiongrid.sendgrid').forEach(g=>g.classList.toggle('has-tg',tgReady()));
    if(!show)return;
    $('chatTitle').textContent='💬 Conversación con '+c.name;
    const root=$('chatThread');root.replaceChildren();
    const list=(state.tg.threads[c.telegramId]||[]).slice(-30);
    if(!list.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay mensajes. Lo que se envíe o reciba por Telegram va a aparecer acá.';root.append(p);return;}
    for(const m of list){
      const row=document.createElement('div');row.className='bubble '+m.dir;
      const who=document.createElement('small');who.textContent=(m.dir==='in'?c.name:'Yo')+' · '+formatTime(m.date);
      const text=document.createElement('p');text.textContent=m.text;
      row.append(who,text);
      if(m.dir==='in'){
        const say=document.createElement('button');say.type='button';say.className='bubble-say';say.textContent='🔊 Escuchar';
        say.setAttribute('aria-label','Escuchar mensaje de '+c.name);say.addEventListener('click',()=>talk(m.text));row.append(say);
      }
      root.append(row);
    }
    root.scrollTop=root.scrollHeight;
  }
  function sendTelegram(){
    const msg=state.message.trim();if(!msg){notify('Primero prepará un mensaje.');return;}
    const c=selected();if(!c){renderContactList();$('contactsDialog').showModal();notify('Elegí o agregá un contacto.');return;}
    if(!c.telegramId){notify(c.name+' no está conectado a Telegram. Se conecta en Configuración → Telegram.');return;}
    if(!navigator.onLine){notify('Sin conexión: Telegram necesita internet.');return;}
    if(!state.tg.confirm){doSendTelegram();return;}
    $('sendTo').textContent='¿Enviar a '+c.name+' por Telegram?';$('sendPreview').textContent=msg;
    sendOpenedAt=Date.now();$('sendDialog').showModal();
  }
  let sendOpenedAt=0,sending=false;
  async function doSendTelegram(){
    const c=selected();const msg=state.message.trim();
    if(sending||!c||!c.telegramId||!msg)return;
    sending=true;notify('Enviando a '+c.name+'…');
    try{
      if(isServer()){
        const r=await srvCall('/api/send',{method:'POST',body:{chatId:c.telegramId,text:msg}});
        pushThread(c.telegramId,'out',msg,r.message&&r.message.date||Date.now(),r.message&&r.message.seq);
      }else{
        await tgCall('sendMessage',{chat_id:c.telegramId,text:msg});
        pushThread(c.telegramId,'out',msg,Date.now());
      }
      learnFromMessage();persist();renderChat();
      notify('✓ Enviado a '+c.name);
    }catch(e){notify(isServer()?srvError(e,c.name):tgError(e,c.name));}
    finally{sending=false;}
  }
  // --- Configuración y vinculación ---
  const botLink=()=>state.tg.bot?'https://t.me/'+state.tg.bot.username:'';
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
    $('tgAutoRead').checked=state.tg.autoRead;$('tgConfirm').checked=state.tg.confirm;
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
  async function linkPerson(p,contactId){
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
    if(!state.selectedContactId)state.selectedContactId=c.id;
    persist();renderTgDialog();renderSelectedContact();notify(c.name+' quedó conectado por Telegram');
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
    state.tg={...tgInitial(),server:{url:ok.url,pin:ok.pin},bot:ok.status.bot,autoRead:state.tg.autoRead,confirm:state.tg.confirm,threads:state.tg.threads};
    for(const c of before){try{await srvCall('/api/people/link',{method:'POST',body:{chatId:c.telegramId,name:c.name,migrate:true}});}catch(e){}}
    $(pinInput).value='';
    persist();setConn('connecting');renderTgDialog();renderChat();startPolling();requestPersist();
    notify('Conectado al servidor · bot @'+ok.status.bot.username+(ok.status.persistent?'':' (⚠️ el servidor no tiene almacenamiento permanente)'));
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
    stopPolling();unlinkAllTelegram();
    state.tg=tgInitial();persist();setConn('idle');renderTgDialog();renderSelectedContact();$('incoming').hidden=true;notify('Telegram desconectado');
  }
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
    $('suggestToggle').checked=state.suggest;
    $('holdSelect').value=String(state.holdMs);$('repeatSelect').value=String(state.repeatMs);
    document.body.classList.toggle('hold-on',state.holdMs>0);
    document.body.style.setProperty('--hold',state.holdMs+'ms');
    const tips=[];
    if(state.holdMs)tips.push('Mantené presionado cada botón '+(state.holdMs/1000).toLocaleString('es-AR')+' s para elegirlo.');
    if(state.repeatMs)tips.push('Los toques repetidos se ignoran durante '+(state.repeatMs/1000).toLocaleString('es-AR')+' s.');
    $('touchHint').textContent=tips.join(' ');$('touchHint').hidden=!tips.length;
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
  $('message').value=state.message;$('combine').checked=state.combine;
  $('message').addEventListener('input',e=>{state.message=e.target.value.slice(0,1000);if(state.tokens.length){state.tokens=[];renderTokens();}persist();});
  $('combine').addEventListener('change',e=>{state.combine=e.target.checked;persist();notify(state.combine?'Podés combinar frases rápidas':'Una frase rápida reemplaza al mensaje');});
  $('clearBtn').addEventListener('click',()=>{updateMessage('');state.punctuation='.';renderPunctuation();notify('Mensaje borrado');});
  $('speakBtn').addEventListener('click',speakMessage);
  $('whatsBtn').addEventListener('click',sendWhatsApp);
  $('builderSpeakBtn').addEventListener('click',speakMessage);
  $('builderWhatsBtn').addEventListener('click',sendWhatsApp);
  $('saveBtn').addEventListener('click',()=>{
    const m=state.message.trim();if(!m){notify('Prepará un mensaje antes de guardarlo.');return;}
    learnFromMessage();
    if(state.savedMessages.includes(m)){notify('Este mensaje ya está guardado.');return;}
    state.savedMessages.unshift(m);state.savedMessages=state.savedMessages.slice(0,60);persist();notify('Mensaje guardado para otra ocasión');
  });
  $('helpBtn').addEventListener('click',()=>{const msg='Necesito ayuda ahora. Por favor, vení.';updateMessage(msg);talk(msg);notify('La solicitud de ayuda está preparada. No se envió automáticamente.');});
  $('contactOpen').addEventListener('click',()=>{renderContactList();$('contactsDialog').showModal();});
  $('settingsOpen').addEventListener('click',()=>$('settingsDialog').showModal());
  $('tabBuild').addEventListener('click',()=>setMode('build'));
  $('tabQuick').addEventListener('click',()=>setMode('quick'));
  $('tabSaved').addEventListener('click',()=>setMode('saved'));
  $('exampleBtn').addEventListener('click',()=>{state.tokens=['Quiero','hablar','con mi hermana'];state.punctuation='.';state.buildCategory='tiempo';updateBuilt();renderBuildCategories();renderBuildTiles();notify('Ejemplo listo. Tocá una parte para quitarla.');});
  $('undoBtn').addEventListener('click',()=>{if(!state.tokens.length)return;state.tokens.pop();updateBuilt();});
  document.querySelectorAll('[data-punctuation]').forEach(btn=>btn.addEventListener('click',()=>{state.punctuation=btn.dataset.punctuation;if(state.tokens.length)updateBuilt();else{renderPunctuation();persist();}}));
  $('ownBlockBtn').addEventListener('click',()=>$('blockDialog').showModal());
  $('blockForm').addEventListener('submit',e=>{
    e.preventDefault();const word=$('newBlock').value.trim().replace(/\s+/g,' ');if(!word)return;
    if(state.customBlocks.length>=80){notify('Se alcanzó el máximo de 80 bloques personalizados.');return;}
    if(state.customBlocks.includes(word)){notify('Esta palabra ya está guardada.');return;}
    state.customBlocks.push(word);state.buildCategory='propias';$('newBlock').value='';$('blockDialog').close();renderBuildCategories();renderBuildTiles();persist();notify('Bloque creado. Ya podés agregarlo.');
  });
  $('largerText').addEventListener('change',e=>{state.large=e.target.checked;updatePrefs();persist();});
  $('highContrast').addEventListener('change',e=>{state.contrast=e.target.checked;updatePrefs();persist();});
  $('settingsOpen').addEventListener('click',()=>{renderVoiceSettings();renderBackupStatus();});
  $('suggestToggle').addEventListener('change',e=>{state.suggest=e.target.checked;renderSuggestions();persist();});
  $('forgetLearned').addEventListener('click',()=>{
    if(!Object.keys(state.learned).length){notify('Todavía no hay palabras aprendidas.');return;}
    if(!window.confirm('¿Olvidar el orden de palabras aprendido? Las sugerencias base se mantienen.'))return;
    state.learned={};lastLearned='';renderSuggestions();persist();notify('Sugerencias aprendidas borradas');
  });
  $('voiceSelect').addEventListener('change',e=>{state.voiceURI=e.target.value;persist();renderVoiceSettings();talk('Hola, esta es mi voz.');});
  for(const [id,key] of [['voiceRate','rate'],['voicePitch','pitch'],['voiceVolume','volume']]){
    $(id).addEventListener('input',e=>{state[key]=Number(e.target.value);renderVoiceSettings();persist();});
  }
  $('voiceTest').addEventListener('click',()=>talk('Hola, esta es mi voz. ¿Me escuchás bien?'));
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
    state.contacts.push({id,name,phone});state.selectedContactId=id;persist();renderSelectedContact();renderContactList();
    $('newContactName').value='';$('newContactPhone').value='';$('contactsDialog').close();notify('Contacto guardado: '+name);
  });
  $('phraseForm').addEventListener('submit',e=>{
    e.preventDefault();const s=$('newPhrase').value.trim();if(!s)return;
    if(state.ownPhrases.length>=100){notify('Llegaste al máximo de frases personales.');return;}
    state.ownPhrases.push(s);state.category='propias';persist();renderCategories();renderPhrases();$('newPhrase').value='';$('phraseDialog').close();notify('Frase personal guardada');
  });
  window.addEventListener('online',updateOffline);window.addEventListener('offline',updateOffline);
  // Telegram
  $('tgBtn').addEventListener('click',sendTelegram);
  $('builderTgBtn').addEventListener('click',sendTelegram);
  $('sendYes').addEventListener('click',()=>{
    if(Date.now()-sendOpenedAt<600)return; // evita que un doble toque confirme sin querer
    $('sendDialog').close();doSendTelegram();
  });
  $('sendNo').addEventListener('click',()=>$('sendDialog').close());
  $('tgOpen').addEventListener('click',()=>{$('settingsDialog').close();renderTgDialog();$('tgDialog').showModal();});
  $('tgConnect').addEventListener('click',connectTelegram);
  $('tgRefresh').addEventListener('click',()=>{if(!navigator.onLine){notify('Se necesita internet.');return;}reportPending=true;kickPolling();notify('Buscando…');});
  $('tgCopyLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(botLink());notify('Enlace copiado');}catch(e){notify('No se pudo copiar. El enlace es: '+botLink());}});
  $('tgShareLink').addEventListener('click',async()=>{
    const text='Para recibir mensajes de Hablemos, abrí este enlace y tocá «Iniciar»: '+botLink();
    if(navigator.share){try{await navigator.share({title:'Hablemos',text});}catch(e){}}
    else window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');
  });
  $('tgAutoRead').addEventListener('change',e=>{state.tg.autoRead=e.target.checked;persist();});
  $('tgConfirm').addEventListener('change',e=>{state.tg.confirm=e.target.checked;persist();});
  $('tgDisconnect').addEventListener('click',disconnectTelegram);
  $('incomingSay').addEventListener('click',()=>talk($('incomingText').textContent));
  $('incomingReply').addEventListener('click',()=>{
    if(incomingContactId&&state.contacts.some(c=>c.id===incomingContactId)){state.selectedContactId=incomingContactId;persist();renderSelectedContact();}
    $('incoming').hidden=true;setMode('build');$('chatCard').scrollIntoView({behavior:'smooth',block:'start'});
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
    $('message').value=state.message;$('combine').checked=state.combine;
    renderSelectedContact();renderCategories();renderPhrases();renderTokens();renderPunctuation();renderBuildCategories();renderBuildTiles();updatePrefs();setMode(state.mode,false);renderConn();
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
  // Secure origin is required for an installable Android PWA and service worker.
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
