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
    suggest:true,learned:{},voiceURI:'',rate:.9,pitch:1,volume:1,holdMs:0,repeatMs:0};
  const clampNumber=(value,min,max,fallback)=>typeof value==='number'&&isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
  // V0.4: Telegram. threads = {chatId: [{dir:'in'|'out', text, date}]}; pending = personas que tocaron «Iniciar» y aún no están vinculadas.
  const tgInitial=()=>({token:'',bot:null,offset:0,autoRead:true,confirm:true,pending:[],threads:{}});
  const chatIdOk=v=>typeof v==='string'&&/^-?\d{1,20}$/.test(v);
  let state = {...initial,learned:{},tg:tgInitial()};
  function loadStored(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    } catch(e){return null;}
  }
  const stored = loadStored('hablemos.v3') || loadStored('hablemos.v2') || loadStored('hablemos.v1');
  if(stored) {
    if(Array.isArray(stored.contacts)) state.contacts=stored.contacts.filter(x=>x&&typeof x.name==='string'&&typeof x.phone==='string'&&typeof x.id==='string').slice(0,50).map(x=>({id:x.id,name:x.name.slice(0,36),phone:x.phone.replace(/\D/g,''),...(chatIdOk(x.telegramId)?{telegramId:x.telegramId}:{})}));
    const tg=stored.tg;
    if(tg&&typeof tg==='object'&&!Array.isArray(tg)&&typeof tg.token==='string'&&/^\d{3,15}:[\w-]{20,80}$/.test(tg.token)){
      const clean=tgInitial();clean.token=tg.token;
      if(tg.bot&&typeof tg.bot.username==='string')clean.bot={username:tg.bot.username.slice(0,64),name:String(tg.bot.name||tg.bot.username).slice(0,64)};
      if(Number.isInteger(tg.offset)&&tg.offset>=0)clean.offset=tg.offset;
      if(typeof tg.autoRead==='boolean')clean.autoRead=tg.autoRead;
      if(typeof tg.confirm==='boolean')clean.confirm=tg.confirm;
      if(Array.isArray(tg.pending))clean.pending=tg.pending.filter(p=>p&&chatIdOk(p.chatId)&&typeof p.name==='string').slice(0,20).map(p=>({chatId:p.chatId,name:p.name.slice(0,64),username:typeof p.username==='string'?p.username.slice(0,64):''}));
      if(tg.threads&&typeof tg.threads==='object'){
        for(const [chatId,list] of Object.entries(tg.threads).slice(0,30)){
          if(!chatIdOk(chatId)||!Array.isArray(list))continue;
          clean.threads[chatId]=list.filter(m=>m&&(m.dir==='in'||m.dir==='out')&&typeof m.text==='string'&&Number.isFinite(m.date)).slice(-100).map(m=>({dir:m.dir,text:m.text.slice(0,4096),date:m.date}));
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
  }
  function persist(){try{localStorage.setItem('hablemos.v3',JSON.stringify(state));}catch(e){notify('No hay espacio para guardar preferencias.');}}
  let toastTimer;
  function notify(msg){const t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},3000);}
  function updateMessage(s, preserveTokens=false){
    state.message=s.slice(0,1000);$('message').value=state.message;
    if(!preserveTokens){state.tokens=[];renderTokens();}
    persist();
  }
  function setMode(mode){
    state.mode=mode;
    for(const m of ['build','quick','saved']){
      const tab=$({build:'tabBuild',quick:'tabQuick',saved:'tabSaved'}[m]);
      const panel=$({build:'builderPanel',quick:'quickPanel',saved:'savedPanel'}[m]);
      const active=m===mode;
      panel.hidden=!active;
      if(active)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current');
    }
    if(mode==='saved')renderSaved();
    persist();
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
    return (spanish.length?spanish:voices).slice().sort((a,b)=>(isMale(b)-isMale(a))||rank(a)-rank(b)||(b.localService-a.localService)||a.name.localeCompare(b.name));
  }
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
      const o=document.createElement('option');o.value=v.voiceURI;o.textContent=v.name+' · '+v.lang+genderLabel(v)+(v.localService?'':' (necesita internet)');select.append(o);
    }
    $('noMaleVoice').hidden=!hasVoice()||!voices.length||voices.some(isMale);
    select.value=spanishVoices().some(v=>v.voiceURI===state.voiceURI)?state.voiceURI:'';
    $('voiceRate').value=state.rate;$('voicePitch').value=state.pitch;$('voiceVolume').value=state.volume;
    $('rateValue').textContent=state.rate<.8?'lenta':state.rate>1.1?'rápida':'normal';
    $('pitchValue').textContent=state.pitch<.85?'grave':state.pitch>1.15?'aguda':'normal';
    $('volumeValue').textContent=Math.round(state.volume*100)+'%';
    $('noVoice').hidden=hasVoice();
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
  const tgReady=()=>!!state.tg.token;
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
  function pushThread(chatId,dir,text,date){
    const list=state.tg.threads[chatId]||(state.tg.threads[chatId]=[]);
    list.push({dir,text:text.slice(0,4096),date});
    if(list.length>100)list.splice(0,list.length-100);
    const ids=Object.keys(state.tg.threads);
    if(ids.length>30){const oldest=ids.sort((a,b)=>(state.tg.threads[a].at(-1)?.date||0)-(state.tg.threads[b].at(-1)?.date||0))[0];delete state.tg.threads[oldest];}
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
      pushThread(chatId,'in',text,(m.date||Date.now()/1000)*1000);
      showIncoming(contact,text);
    }
    if(changed){persist();renderChat();if($('tgDialog').open)renderTgDialog();}
  }
  let pollCtrl=null,polling=false,quickPoll=false,reportPending=false;
  async function pollLoop(){
    if(polling)return;polling=true;
    const token=state.tg.token;
    while(state.tg.token===token&&tgReady()&&document.visibilityState==='visible'&&navigator.onLine){
      const ctrl=pollCtrl=new AbortController();
      const timeout=quickPoll?0:25;quickPoll=false;
      try{
        const updates=await tgCall('getUpdates',{offset:state.tg.offset,timeout,allowed_updates:['message']},ctrl.signal,token);
        handleUpdates(updates);
        if(reportPending){reportPending=false;if(!state.tg.pending.length)notify('Todavía no hay personas nuevas. Pediles que abran el enlace y toquen «Iniciar».');}
      }catch(e){
        if(ctrl.signal.aborted){if(ctrl.signal.reason==='kick')continue;break;}
        if(e.code===401){notify(tgError(e));break;}
        await sleep(e.code===409?15000:8000);
      }
    }
    polling=false;pollCtrl=null;
  }
  function startPolling(){if(tgReady())pollLoop();}
  function kickPolling(){quickPoll=true;if(pollCtrl&&polling)pollCtrl.abort('kick');else pollLoop();}
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
      await tgCall('sendMessage',{chat_id:c.telegramId,text:msg});
      learnFromMessage();
      pushThread(c.telegramId,'out',msg,Date.now());persist();renderChat();
      notify('✓ Enviado a '+c.name);
    }catch(e){notify(tgError(e,c.name));}
    finally{sending=false;}
  }
  // --- Configuración y vinculación ---
  const botLink=()=>state.tg.bot?'https://t.me/'+state.tg.bot.username:'';
  function renderTgStatus(){
    $('tgStatus').textContent=tgReady()?'Conectado con @'+(state.tg.bot?state.tg.bot.username:'bot')+' · '+state.contacts.filter(c=>c.telegramId).length+' persona(s) conectada(s)':'Sin configurar. Permite enviar y recibir mensajes sin salir de Hablemos.';
  }
  function renderTgDialog(){
    const ready=tgReady();
    $('tgStepToken').hidden=ready;$('tgStepPeople').hidden=!ready;
    renderTgStatus();
    if(!ready)return;
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
      no.addEventListener('click',()=>{state.tg.pending=state.tg.pending.filter(x=>x.chatId!==p.chatId);persist();renderTgDialog();});
      actions.append(ok,no);box.append(title,label,select,actions);pend.append(box);
    }
    const linked=$('tgLinked');linked.replaceChildren();
    const people=state.contacts.filter(c=>c.telegramId);
    if(!people.length){const p=document.createElement('p');p.className='muted';p.textContent='Todavía no hay nadie conectado.';linked.append(p);}
    for(const c of people){
      const row=document.createElement('div');row.className='contactline';
      const name=document.createElement('div');name.className='tg-linked-name';name.textContent='✈ '+c.name;
      const del=document.createElement('button');del.type='button';del.className='delete';del.textContent='Quitar';del.setAttribute('aria-label','Desconectar a '+c.name+' de Telegram');
      del.addEventListener('click',()=>{
        if(!window.confirm('¿Desconectar a '+c.name+' de Telegram? El contacto se mantiene.'))return;
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
    if(!c){
      if(state.contacts.length>=50){notify('Se alcanzó el máximo de contactos.');return;}
      c={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),name:p.name.slice(0,36),phone:''};
      state.contacts.push(c);
    }
    c.telegramId=p.chatId;
    state.tg.pending=state.tg.pending.filter(x=>x.chatId!==p.chatId);
    if(!state.selectedContactId)state.selectedContactId=c.id;
    persist();renderTgDialog();renderSelectedContact();notify(c.name+' quedó conectado por Telegram');
    try{await tgCall('sendMessage',{chat_id:p.chatId,text:'✅ ¡Listo! Ya estás conectado/a. Los mensajes de Hablemos te van a llegar por este chat, y podés responder escribiendo acá.'});}catch(e){}
  }
  async function connectTelegram(){
    const token=$('tgToken').value.trim().replace(/\s+/g,'');
    const error=$('tgError');error.hidden=true;
    if(!/^\d{3,15}:[\w-]{20,80}$/.test(token)){error.textContent='El token no tiene el formato correcto. Es parecido a 123456789:AAH4… y lo da @BotFather.';error.hidden=false;return;}
    if(!navigator.onLine){error.textContent='Se necesita internet para conectar el bot.';error.hidden=false;return;}
    $('tgConnect').disabled=true;
    try{
      const me=await tgCall('getMe',{},undefined,token);
      if(!me.is_bot)throw Object.assign(new Error('not a bot'),{code:401});
      state.tg={...tgInitial(),token,bot:{username:me.username,name:me.first_name||me.username}};
      $('tgToken').value='';persist();renderTgDialog();renderChat();startPolling();
      notify('Bot conectado: @'+me.username);
    }catch(e){error.textContent=e.code===401||e.code===404?'Telegram no reconoce ese token. Copialo de nuevo desde @BotFather.':tgError(e);error.hidden=false;}
    finally{$('tgConnect').disabled=false;}
  }
  function disconnectTelegram(){
    if(!window.confirm('¿Desconectar Telegram? Se borran las conversaciones guardadas en Hablemos y las personas conectadas (los contactos con WhatsApp se mantienen).'))return;
    stopPolling();
    state.contacts=state.contacts.filter(c=>c.phone);
    for(const c of state.contacts)delete c.telegramId;
    if(!selected())state.selectedContactId=null;
    state.tg=tgInitial();persist();renderTgDialog();renderSelectedContact();$('incoming').hidden=true;notify('Telegram desconectado');
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
  $('settingsOpen').addEventListener('click',renderVoiceSettings);
  $('suggestToggle').addEventListener('change',e=>{state.suggest=e.target.checked;renderSuggestions();persist();});
  $('forgetLearned').addEventListener('click',()=>{
    if(!Object.keys(state.learned).length){notify('Todavía no hay palabras aprendidas.');return;}
    if(!window.confirm('¿Olvidar el orden de palabras aprendido? Las sugerencias base se mantienen.'))return;
    state.learned={};lastLearned='';renderSuggestions();persist();notify('Sugerencias aprendidas borradas');
  });
  $('voiceSelect').addEventListener('change',e=>{state.voiceURI=e.target.value;persist();});
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
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')startPolling();else stopPolling();});
  window.addEventListener('online',startPolling);
  renderSelectedContact();renderCategories();renderPhrases();renderTokens();renderPunctuation();renderBuildCategories();renderBuildTiles();updatePrefs();updateOffline();setMode(state.mode);renderTgStatus();startPolling();
  // Secure origin is required for an installable Android PWA and service worker.
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
