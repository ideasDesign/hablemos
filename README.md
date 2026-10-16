# Hablemos V2.0 — Crear conversaciones sin escribir

**Prototipo accesible para Android**. Diseñado para una persona que comprende texto y puede pulsar botones grandes, pero no puede hablar y tiene dificultad para escribir.

## Cambios de la versión 2.0: completar frases con IA

- Desde la segunda palabra, la primera fila del tablero ofrece frases completas que empiezan así (✨), pensadas por Claude. Un toque la dice en voz alta y la deja lista para enviar.
- Mientras la IA piensa, esos lugares muestran «Pensando frases…», así los botones no se mueven bajo el dedo.
- Si alguien escribió en las últimas 6 horas, la IA tiene en cuenta ese último mensaje (sin nombres).
- Las frases que Diego elige se aprenden (⭐) y aparecen primero, también sin internet.
- Usa el mismo interruptor y el mismo tope de gasto (60 pedidos por hora) que las respuestas sugeridas.

## Cambios de la versión 1.9: voz natural con ElevenLabs

- Lo que dice Diego suena con una voz humana de ElevenLabs (por defecto «Eric», incluida en el plan gratis; las voces de la biblioteca, como «Diego» con acento argentino, solo funcionan por API con plan pago o US$5 de créditos).
- La clave va solo en Railway: variable `ELEVENLABS_API_KEY`. Opcionales: `ELEVENLABS_VOICE_DIEGO`, `ELEVENLABS_VOICE_FAMILY` (ID de otra voz para leer los mensajes de la familia; vacía = voz del teléfono), `ELEVENLABS_MODEL` (por defecto `eleven_flash_v2_5`, la mitad de créditos por carácter) y `ELEVENLABS_MAX_CHARS_HOUR` (tope por hora, 2500).
- Cada frase se genera una sola vez: queda guardada en el servidor (`/data/voz`) y en el teléfono, así las frases repetidas no gastan créditos.
- Sin internet, sin créditos o si la voz no está disponible, se usa sola la voz del teléfono. Se puede apagar en Configuración → Voz.

## Cambios de la versión 1.8.1: fondo más oscuro

- Capa oscura semitransparente sobre el fondo de ondas, para que los botones resalten más.

## Cambios de la versión 1.8: nuevo fondo azul

- Nuevo fondo: paisaje de ondas de luz en azul y cian (`assets/fondo.webp`, 60 KB, se guarda para usar sin internet).
- Color de la barra del teléfono y del ícono instalado en el mismo azul (`#0b4fd0`).

## Cambios de la versión 1.7: fondo oscuro con trazos azules

- El fondo de la app es ahora una imagen oscura con trazos azules (`assets/fondo.jpg`, 16 KB), que también se guarda para usar sin internet.
- Los textos que quedan directamente sobre el fondo pasan a claro. Los botones siguen claros, para que se distingan bien.

## Cambios de la versión 1.6: gama de azules

- Toda la interfaz pasa a la **gama de los azules**: carpetas, Hablar y la barra del mensaje en azul, y Enviar en azul violáceo.
- **Fondo en degradé del azul (arriba) al lila (abajo).**
- Los colores por tipo de palabra se mantienen, en tonos que combinan con el azul. El rojo queda solo para «Necesito ayuda», para que se distinga.

## Cambios de la versión 1.5: diseño adulto con íconos de línea

- **Íconos de línea** en lugar de dibujos y emojis: un ícono simple y elegante para cada una de las 152 palabras y frases, y para los botones de Ayuda, Configuración, Borrar, Hablar y Enviar. Son de [Tabler Icons](https://tabler.io/icons) 3.48.0 (licencia MIT) y vienen dentro de la app (`icons.js`), así que funcionan sin internet desde el primer momento.
- **Paleta sobria:** fondo gris claro, tarjetas blancas, carpetas en azul oscuro y textos en gris carbón.
- **Colores por tipo de palabra** en tonos discretos (una línea a la izquierda y el ícono del mismo color): acciones en verde, personas en ocre, cosas y lugares en ámbar, cuándo en petróleo, sentimientos en azul, preguntas en violeta y respuestas en rosa viejo.
- Los íconos de las palabras se pueden ocultar en ⚙ → Pantalla.
- Para cambiar un ícono: editar el listado en `tools/build-icons.js` y ejecutar `node tools/build-icons.js`.
- Reemplaza a los pictogramas de ARASAAC de la versión 1.4.

## Cambios de la versión 1.3: audios de la familia dentro de Hablemos

- Cuando un familiar manda un **audio de voz** por Telegram, el aviso y la conversación muestran **«🎤 Audio de 7 s»** con un botón grande **«▶ Escuchar audio»**. Diego lo escucha sin abrir Telegram, al volumen de Hablemos.
- Con «Leer en voz alta los mensajes que llegan» activado, Hablemos dice «Mamá te mandó un audio» e intenta reproducirlo solo. Si el teléfono no lo permite, alcanza con tocar «Escuchar».
- **Responder a un audio:** el mensaje citado lo vuelve a reproducir y aparecen respuestas para audios («Ya lo escuché, gracias», «¿Me lo podés escribir?», «No se escuchó bien»…). La IA no se usa para audios porque no puede escucharlos.
- Los audios los trae el servidor desde Telegram. La app no ve ninguna clave de Telegram, y el servidor guarda en memoria los últimos 15 audios para no volver a descargarlos.

## Cambios de la versión 1.2: ayuda real y pantalla de respuestas más clara

- **🆘 Necesito ayuda avisa a la familia.** Al tocarlo se dice en voz alta enseguida (como antes) y aparece «¿Aviso a tu familia por Telegram?», que muestra a quiénes les llega. Con **«🆘 Sí, avisar a todos»**, todas las personas conectadas reciben «🆘 Necesito ayuda ahora. Por favor, vení o llamame.» y la app confirma en voz alta «Listo, avisé a tu familia». Con **«No, solo decirlo»** no se manda nada.
  - Un doble toque rápido no manda el aviso. Si se confirma dos veces seguidas, el servidor no lo repite antes de 20 segundos.
  - Sin internet, la app avisa que no pudo enviarlo para que pida ayuda en voz alta. **No reemplaza a un servicio de emergencias.**
- **Respuestas más claras:** cuando llegan las respuestas ✨ de la IA, se ocultan las de reglas. Siguen apareciendo mientras la IA piensa, si falla o si no hay internet.

## Cambios de la versión 1.1: respuestas sugeridas con inteligencia artificial (Claude)

Al tocar «Responder», además de las respuestas por reglas aparecen **respuestas ✨ pensadas por Claude para ese mensaje**, aunque sea variado («¿Te viene bien que el kinesiólogo venga el jueves a las 11?» → «Sí, a las 11 me viene bien», «Mejor a la tarde», «¿Me pasás a buscar?»…).

- **Es opcional.** Funciona solo si en Railway está la variable `ANTHROPIC_API_KEY`. Sin ella, todo sigue igual con las respuestas por reglas.
- **Nunca deja a Diego sin opciones:** mientras la IA piensa («✨ Pensando respuestas…»), o si tarda o falla, las respuestas por reglas ya están disponibles.
- Se puede apagar en ⚙ → Telegram → Opciones → «✨ Sugerir respuestas con inteligencia artificial».

### Cómo activarlo

1. Crear una cuenta en **https://platform.claude.com** (Anthropic), cargar crédito y crear una **API key**.
2. En Railway → servicio **hablemos** → **Variables**, agregar `ANTHROPIC_API_KEY` con esa clave y tocar **Deploy**.
3. Opcional: `CLAUDE_MODEL` para elegir el modelo. Por defecto es `claude-opus-5-5`, el más capaz. `claude-haiku-5-5` es mucho más económico y suele alcanzar para respuestas cortas.

### Costo aproximado

Cada sugerencia usa unos 500 tokens de entrada y 300 de salida. Calculado con 30 respuestas por día:

| Modelo | Por sugerencia | Al mes |
|---|---|---|
| `claude-opus-5-5` (por defecto) | ~US$0,008 | ~US$7 |
| `claude-haiku-5-5` | ~US$0,0002 | ~US$0,20 |

Para no gastar de más: si se vuelve a abrir el mismo mensaje no se paga de nuevo, y hay un tope de 60 pedidos por hora. El registro de Railway muestra los tokens que usa cada pedido.

### Privacidad

- A Claude se le envían **solo los últimos 8 mensajes de esa conversación**, como «Yo» y «La otra persona»: **sin nombres ni teléfonos**. Los registros del servidor no guardan el texto de los mensajes.
- Anthropic borra los datos de la API dentro de los 30 días y no los usa para entrenar modelos sin permiso. El contenido que sus sistemas de seguridad marcan puede guardarse hasta 2 años ([política de retención](https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-personal-data)).
- Si Claude rechaza un pedido por seguridad, el servidor intenta con otro modelo recomendado (`fallbacks: "default"`). Si igual no hay respuesta, quedan las respuestas por reglas.

## Cambios de la versión 1.0: respuestas sugeridas

Cuando llega un mensaje y Diego toca **Responder**, en el aviso o en la conversación, el tablero muestra arriba el mensaje recibido (tocarlo lo vuelve a leer) y debajo **respuestas listas según lo que preguntaron**:

| Si el mensaje dice… | Hablemos ofrece… |
|---|---|
| «¿A qué hora tenés médico?» | A las 3, 4, 5 o 6 de la tarde · Hoy no · Mañana · A la mañana… · A la noche… |
| «¿Cuándo…?» | Hoy · Mañana · Pasado mañana · Esta tarde · El fin de semana… |
| «¿Cómo estás?» | Bien, ¿y vos? · Muy bien · Más o menos · Cansado · Me duele algo… |
| «¿Dormiste bien?» | Sí, dormí bien · Más o menos · Dormí mal · Tengo sueño… |
| «Mañana paso a verte» | ¡Sí, vení! · Te espero · Hoy no puedo · Mejor mañana… |
| «¿Tomaste la pastilla?» | Sí, ya la tomé · Todavía no · ¿Me ayudás a tomarla?… |
| «¿Te duele algo?» | Sí, me duele · No, estoy bien · Un poco · Mucho, necesito ayuda |
| «¿Querés…?» / «¿Te parece…?» | Sí · No · Sí, por favor · No, gracias · Tal vez · Después |
| Saludos, «te quiero», «gracias», noticias | Respuestas que corresponden a cada uno |

- Elegir una respuesta abre «¿A quién se lo mando?» con esa persona primero: **responder son dos toques**.
- **Aprende:** las respuestas que Diego elige para cada tipo de pregunta aparecen primero la próxima vez.
- Siempre está **✍ Otra respuesta** para armarla con el tablero.
- Funciona sin internet y es instantánea: reconoce el tipo de mensaje con reglas, sin inteligencia artificial.

## Cambios de la versión 0.9: avisos de mensajes nuevos

- **Avisos en el teléfono (push)** aunque Hablemos esté cerrada o el teléfono bloqueado, como los de WhatsApp: «📩 Mamá — Hola hijo». Suenan y vibran, y tocarlos abre Hablemos. También avisa cuando alguien sin invitación quiere conversar.
  - Se activan una vez en cada teléfono: **⚙ (mantener apretado) → Telegram → 🔔 Activar avisos → Permitir**. Con «Probar un aviso» se comprueba que llegan.
  - Si quedaron bloqueados: en el teléfono, **Ajustes → Aplicaciones → Chrome (o Hablemos) → Notificaciones → Permitir**, y volver a tocar «Activar avisos».
  - Funcionan con el servidor de Hablemos. Los manda el servidor de Railway con la librería `web-push`, cifrados de punta a punta y firmados con claves propias (VAPID) que se guardan en el disco permanente.
- **Con la app abierta:** al llegar un mensaje suena un timbre de dos notas, el teléfono vibra, aparece el recuadro y se lee en voz alta. El timbre se puede apagar en ⚙ → Telegram → Opciones.
- Si Hablemos está instalada como app, el ícono muestra cuántos mensajes nuevos hay (en los teléfonos que lo permiten).

## Cambios de la versión 0.8: pantalla simple para manos con poca movilidad

La pantalla principal se rediseñó para que Diego la use con el menor esfuerzo posible:

- **Todo entra en una sola pantalla.** No hay que desplazarse ni deslizar.
- **Arriba:** 🆘 Necesito ayuda y ⚙ Configuración. La configuración se abre **manteniendo apretado** el engranaje un segundo, para que no se abra por un toque sin querer.
- **El mensaje** se ve en letra grande. Tocarlo lo dice en voz alta.
- **Tablero de botones grandes**, en 2 columnas en el celular, que cambia solo con las palabras sugeridas para seguir. Con pocos botones, cada uno crece para ser más fácil de tocar. Para ver más se toca **▶ Más**, siempre en el mismo lugar, y **◀ Volver** está siempre primero.
- **⭐ Frases rápidas:** se dicen en voz alta con un solo toque.
- **💬 Mensajes de Mamá:** muestra la conversación en letra grande, con 🔊 para escuchar y ✍ para responder. Indica cuántos mensajes nuevos hay.
- **Abajo, tres botones fijos:** ↶ Borrar (quita la última palabra), 🔊 Hablar y ✈ Enviar.
- **Enviar en un paso:** aparece «¿A quién se lo mando?» con una tarjeta grande por persona. Tocar a la persona ya es la confirmación, y un doble toque rápido no envía. Hablemos usa Telegram o WhatsApp según la persona, sin que Diego tenga que elegir. Después de enviar, el mensaje se limpia para el siguiente.
- **Para quien acompaña** (en Configuración): contactos, «Mis palabras», «Mis frases», Telegram, voz, copia de seguridad y protección de toques.
- Los avisos cortos aparecen arriba y nunca tapan ni bloquean los botones.

## Cambios de la versión 0.7: Telegram sin pasos de aprobación

Pensado para que Diego nunca tenga que entrar a Configuración:

- **Enlace de invitación**: Configuración → Telegram → «Compartir enlace» (o en Contactos → «✈ Invitar a alguien por Telegram»). Quien abre ese enlace y toca **Iniciar** queda **conectado automáticamente**, y sus mensajes llegan enseguida.
- **Si escribe alguien sin invitación**, aparece en la pantalla principal un aviso grande, «Eduardo quiere conversar con vos por Telegram», con **✓ Aceptar** y **Ahora no**, y se lee en voz alta. Al aceptar, esa persona queda elegida para responderle y llegan los mensajes que mandó mientras esperaba.
- A quien escribe sin invitación, el bot le avisa que su pedido está esperando. Sus mensajes no se pierden.
- Si el enlace llega a alguien que no debía: Configuración → Telegram → «Crear un enlace de invitación nuevo». El anterior deja de conectar solo y las personas conectadas se mantienen.

## Cambios de la versión 0.6: servidor propio para Telegram

Hablemos tiene un servidor propio en Railway: **https://hablemos-production.up.railway.app** (el código está en la carpeta `server/`).

- **El token del bot vive solo en el servidor**, como variable de entorno (`TELEGRAM_TOKEN`). No está en el código ni en ningún teléfono.
- **En cada teléfono o navegador alcanza con el PIN** (`HABLEMOS_PIN`): Configuración → Telegram → «Conectar con el servidor». Los contactos de Telegram y las conversaciones aparecen solos.
- **Los mensajes se guardan aunque Hablemos esté cerrada**: Telegram se los avisa al servidor (webhook) y quedan en un disco permanente (Volume `/data`).
- **Varios dispositivos a la vez**, sin el aviso 🟠.
- Seguridad: solo la app publicada puede usar el servidor desde el navegador. El PIN se bloquea por 15 minutos después de 8 intentos equivocados. Los mensajes de Telegram se verifican con una clave secreta. Las personas nuevas quedan pendientes hasta que se las aprueba.
- La forma anterior (pegar el token en el navegador) sigue disponible como «Otra opción».

### Configuración del servidor en Railway

Proyecto **reliable-gratitude**, servicio **hablemos** (repositorio `ideasDesign/hablemos`, carpeta raíz `/server`, puerto 8080, Volume en `/data`). En **Variables** tienen que estar:

| Variable | Qué es |
|---|---|
| `TELEGRAM_TOKEN` | El token del bot que da @BotFather. |
| `HABLEMOS_PIN` | El PIN que se escribe en la app. Conviene que tenga al menos 8 caracteres. |
| `ANTHROPIC_API_KEY` | (Opcional) Clave de Claude para las respuestas sugeridas con IA. |
| `CLAUDE_MODEL` | (Opcional) Modelo de Claude. Por defecto `claude-opus-5-5`. |

Cada `git push` a `main` vuelve a publicar el servidor solo. Si se cambia el token con `/revoke`, solo hay que actualizar `TELEGRAM_TOKEN` en Railway.

## Cambios de la versión 0.5: configurar una vez y no perder nada

- **Copia de seguridad cifrada** (Configuración → Copia de seguridad): guarda en un archivo todo lo de Hablemos, incluido Telegram con su token y las personas conectadas. El archivo queda protegido con una clave (cifrado AES-GCM; la clave nunca se guarda). Con **Restaurar copia** se recupera todo en otro navegador, otro teléfono o después de borrar los datos, y Telegram queda conectado enseguida.
- Al conectar Telegram, Hablemos recuerda guardar la copia.
- Hablemos pide al navegador **guardar los datos de forma permanente**, para que no los borre por falta de espacio, y muestra si lo logró.
- Explica qué ajuste de Chrome borra los datos al cerrarlo.

### ¿Por qué el token no viene incluido en la app?

El código de Hablemos está publicado en GitHub y cualquiera puede leerlo. Si el token estuviera escrito ahí, cualquier persona podría manejar el bot de Diego, leer los mensajes de la familia y escribirles haciéndose pasar por él. Por eso el token se guarda solo en el dispositivo y en la copia cifrada.

### Para que la configuración dure

1. Instalar Hablemos como app (Chrome → ⋮ → **Instalar aplicación**). Las apps instaladas conservan mejor sus datos.
2. No usar ventanas de incógnito.
3. En Chrome, **Configuración → Privacidad y seguridad → Cookies de terceros**: dejar **desactivado** «Borrar cookies y datos de sitios al cerrar todas las ventanas».
4. Después de conectar Telegram y a las personas, **guardar una copia de seguridad** y ponerla en un lugar seguro (Google Drive, un mensaje a uno mismo), con la clave anotada aparte.
5. En otro navegador o teléfono: **Configuración → Restaurar copia**, elegir el archivo y escribir la clave. Usar Telegram en un solo dispositivo a la vez.

## Cambios de la versión 0.4.2: voz más natural

- La voz automática elige primero una **voz natural de hombre** si el navegador la tiene, y deja para el final las voces básicas, que suenan robóticas.
- En Configuración → Voz, la lista marca cada voz como **★ natural** o **básica**, y al elegir una se escucha un ejemplo.
- Si solo hay voces básicas de hombre, se explica cómo conseguir una natural:
  - **Computadora con Windows:** abrir Hablemos en **Microsoft Edge** (viene con Windows), que tiene voces naturales como «Microsoft Tomas Online (Natural) - Spanish (Argentina)». Chrome en Windows solo trae las voces básicas de hombre (Raúl, Pablo). Los contactos y Telegram se guardan por navegador: en Edge hay que configurarlos de nuevo.
  - **Android:** Ajustes → Salida de texto a voz → Servicios de voz de Google → ⚙ → Instalar datos de voz → Español, y descargar una voz de hombre.
- Aviso al mover el **Tono**: alejarlo de «normal» suele volver la voz más robótica.

## Cambios de la versión 0.4.1: Telegram ya no se desconecta

- **Corregido:** con Hablemos abierto en dos pestañas o ventanas, una podía borrar la conexión de Telegram (y otros datos) guardada por la otra. Ahora las pestañas se mantienen sincronizadas y solo una consulta a Telegram a la vez.
- **Sigue recibiendo en segundo plano:** antes dejaba de recibir mensajes al cambiar de pestaña o minimizar la ventana.
- **Estado de la conexión a la vista** en la conversación y en Configuración → Telegram: 🟢 conectado, 🟡 reconectando, ⚪ sin internet, 🟠 otro dispositivo usando el bot, 🔴 token que dejó de funcionar.
- **Cambiar el token sin perder nada:** si se usa `/revoke` en @BotFather, en Configuración → Telegram → «Cambiar el token del bot» se pega el nuevo y se mantienen las personas conectadas y las conversaciones.
- **Siempre la última versión:** con internet, la app carga primero la versión publicada (la copia guardada queda para usar sin conexión). Así no conviven una versión vieja y una nueva.

## Cambios de la versión 0.4: Telegram

Hablemos puede **enviar y recibir mensajes por Telegram sin salir de la app**, usando un bot propio y la API oficial de Telegram. No hace falta servidor ni pago.

- **Enviar:** con un contacto conectado, aparece el botón **✈ Telegram** junto a WhatsApp. Antes de enviar se muestra «¿Enviar a Mamá por Telegram?» con el mensaje, y se confirma con **Sí, enviar** (un doble toque rápido no envía; la confirmación se puede desactivar).
- **Recibir:** las respuestas aparecen en un aviso arriba («📩 Mamá: …») con **Escuchar** y **Responder**, y se leen en voz alta automáticamente (se puede desactivar).
- **Conversación:** debajo de «¿A quién se lo envío?» se ve el historial con esa persona, con botón 🔊 en cada mensaje recibido.
- Audios, fotos y stickers se avisan con un texto («🎤 Envió un audio. Abrí Telegram para escucharlo»); todavía no se reproducen dentro de Hablemos.
- **Seguridad:** solo se muestran y leen mensajes de personas aprobadas. Si escribe alguien desconocido, queda en espera para que quien acompaña lo apruebe o lo ignore.

### Configurar Telegram (una sola vez, lo hace quien acompaña)

1. **Crear el bot:** en Telegram, abrir **@BotFather** (oficial, con tilde azul), escribir `/newbot`, elegir un nombre (por ejemplo «Diego Hablemos») y un usuario terminado en `bot` (por ejemplo `diego_hablemos_bot`). BotFather responde con un **token**.
2. **Conectar:** en Hablemos, **⚙ Configuración → ✈ Configurar Telegram**, pegar el token y tocar **Conectar el bot**.
3. **Invitar:** compartir el enlace `t.me/…` que muestra Hablemos. Cada familiar lo abre con Telegram instalado y toca **Iniciar**.
4. **Aprobar:** en Hablemos, tocar **Buscar personas que tocaron «Iniciar»** y **Conectar** a cada una (como contacto nuevo o unida a un contacto de WhatsApp existente). La persona recibe un mensaje de bienvenida.

### Limitaciones a tener en cuenta

- Los mensajes **llegan mientras Hablemos está abierta**. Si estuvo cerrada, aparecen al abrirla (Telegram los guarda hasta 24 horas). No hay notificaciones con la app cerrada.
- Usar el bot **en un solo teléfono o computadora**. Si se abre Hablemos con el mismo bot en dos dispositivos, los mensajes se reparten entre ambos (Hablemos lo avisa con 🟠). Varias pestañas en el mismo dispositivo sí funcionan bien.
- Los mensajes llegan a la familia desde el bot, no desde una cuenta personal de Diego.
- El token queda guardado solo en el teléfono. Quien lo tenga puede enviar mensajes como el bot: no compartirlo. Si se filtra, en @BotFather se puede generar uno nuevo con `/revoke`.
- Los mensajes pasan por los servidores de Telegram. Borrar los datos del navegador borra el token y las conversaciones guardadas en Hablemos (no las de Telegram).

## Cambios de la versión 0.3.1

- **Voz de hombre por defecto:** la opción «Automática» elige primero una voz de hombre en español. En la lista de voces se indica «hombre» o «mujer» cuando se reconoce por el nombre de la voz.
- Si el teléfono no tiene una voz de hombre reconocible (habitual en Android, donde las voces se llaman solo «Español»), Configuración muestra los pasos para elegirla en el sistema: **Ajustes → Salida de texto a voz → Servicios de voz de Google ⚙ → Instalar datos de voz → Español**, y marcar una voz de hombre. Conviene descargarla para usarla sin internet.

## Cambios de la versión 0.3

- **Sugerencias para seguir:** al crear un mensaje aparece un recuadro «💡 Para seguir» con hasta 6 palabras que suelen ir después de la última elegida. Por ejemplo, después de «Quiero» sugiere «hablar», «descansar», «salir»…
- **Aprende de Diego:** cuando un mensaje armado con botones se **habla, envía o guarda**, la app recuerda el orden de las palabras. La próxima vez, esas palabras aparecen primero, marcadas con **★**. Aprende solo de mensajes usados, no de pruebas ni errores que se deshacen. Todo queda en el dispositivo y se puede borrar con «Olvidar lo aprendido».
- **Ajustes de voz:** elegir la voz en español instalada en el teléfono, y regular velocidad, tono y volumen, con botón **Probar voz**. Las voces que necesitan internet se indican en la lista.
- **Protección de toques** (Configuración):
  - **Mantener presionado para elegir** (0,5 a 2 s): un roce no elige nada; al mantener el dedo, una barra se completa en el botón y el teléfono vibra al confirmar. Si se mueve el dedo para desplazarse, se cancela.
  - **Ignorar toques repetidos** (0,5 a 2 s): después de elegir un botón, se ignoran los toques siguientes por un momento. Útil si la mano rebota o tiembla.
  - Ambas protecciones afectan al tablero, no a los formularios de configuración ni de contactos, para que quien acompaña pueda configurarlos con normalidad. Los teclados y pulsadores externos siguen funcionando.
  - Cuando una protección está activa, se muestra un aviso en la parte superior.
- Conserva los datos de la v0.2 y la v0.1 si se actualiza en el mismo navegador y dominio.

## Cambios de la versión 0.2

- **Crear mensaje:** construir frases seleccionando bloques de texto en diferentes categorías (Inicio, Acciones, Detalles, Personas, Tiempo, Sentimientos, Preguntas, Respuestas y Mis palabras).
- Vista previa de la oración y cierre con punto, pregunta o exclamación. Al seleccionar una pregunta, se añaden los signos de interrogación.
- Cada parte seleccionada aparece como un botón que se puede pulsar para quitarla. También existe **Deshacer** y **Borrar todo**.
- Ejemplo listo para experimentar: **Quiero → hablar → con mi hermana**.
- **Mis palabras:** agregar bloques personalizados para que después aparezcan como botones.
- **Guardadas:** guardar y recuperar mensajes frecuentes sin escribirlos de nuevo.
- Acceso a **Hablar** y **WhatsApp** tanto en el área superior como al final del constructor, para evitar desplazamientos largos.
- Continúan las **Frases rápidas**, contactos favoritos, reproducción por voz, preferencias de tamaño de letra y contraste.
- Intenta conservar datos locales de la v0.1, siempre que se actualice en el mismo navegador y mismo origen/dominio, con los datos del sitio intactos.

## Probar el prototipo

### Dirección publicada

La app está publicada con GitHub Pages en **https://ideasdesign.github.io/hablemos/**

### Instalar en Android

1. En el teléfono, abrir **https://ideasdesign.github.io/hablemos/** con **Chrome para Android** (con internet).
2. Esperar a que cargue por completo.
3. Tocar el menú de Chrome (⋮) y elegir **Instalar aplicación** o **Agregar a pantalla principal**, según lo que aparezca.
4. Abrir el nuevo icono **Hablemos** desde la pantalla de inicio. Se abre a pantalla completa, sin la barra de Chrome.
5. Para comprobar que funciona sin conexión: activar el modo avión y abrir la app. Debe cargar igual (WhatsApp no funcionará hasta volver a tener conexión).

Los datos (contactos, frases, palabras aprendidas) se guardan **solo en ese teléfono**: no viajan a GitHub ni a ningún servidor.

### Publicar una nueva versión

1. Cambiar el nombre de la caché en `sw.js` (por ejemplo `hablemos-offline-v27` → `hablemos-offline-v28`), para actualizar la copia que se usa sin conexión.
2. En `index.html`, cambiar la versión del script: `app.js?v=2.0` → `app.js?v=2.0.1`. **Si no se cambia, el navegador puede seguir usando el `app.js` anterior hasta 10 minutos.**
3. Guardar los cambios con git y subirlos: `git commit -am "…"` y `git push`.
4. En uno o dos minutos GitHub Pages publica la nueva versión. Con internet, la próxima vez que se abra Hablemos ya carga la nueva.

### Probar en la computadora

Abrir `index.html` directamente (`file://`) no sirve: el navegador bloquea el almacenamiento y el modo sin conexión. Usar un servidor local, por ejemplo `py -m http.server 8765` en la carpeta del proyecto, y abrir `http://localhost:8765`.

No hace falta backend, base de datos, cuenta, API ni servidor para almacenar datos de la app. La primera instalación necesita Internet. El tablero puede funcionar sin conexión posteriormente si todos sus recursos quedaron almacenados en caché y el navegador lo permite; WhatsApp requiere conexión.

## Primera prueba con la persona

1. Abrir «🧩 Crear mensaje» y tocar **Probar el ejemplo**.
2. Tocar **Hablar** para escuchar la oración.
3. Tocar una parte de la frase para quitarla, y presionar **Deshacer** para quitar la última parte restante.
4. Armar una nueva oración: **Quiero → hablar → con mi hermana → mañana** (las palabras y expresiones son solo ejemplos).
5. Pulsar **Guardar esta frase**; comprobar que aparezca en **Guardadas**.
6. Agregar un contacto con su número internacional completo, por ejemplo en Argentina `+54 9 ...`; tocar **WhatsApp** y comprobar que se abra el mensaje precargado. **La persona deberá confirmar el envío en WhatsApp.**
7. Probar tamaños grandes y alto contraste en Configuración.
8. Armar y hablar «Quiero → hablar → con vos»; luego borrar y tocar «Quiero»: «hablar» debe aparecer primero con ★.
9. En Configuración, probar las voces disponibles y ajustar velocidad y volumen con la persona.
10. Probar «Mantener presionado» con 1 segundo y observar si reduce los toques equivocados sin cansar.

## Privacidad y seguridad

- El texto, los contactos y los mensajes guardados se almacenan en `localStorage` del navegador **en el dispositivo**. No se sincronizan, respaldan ni envían a un servidor propio.
- Al abrir WhatsApp, el número y texto seleccionados pasan a WhatsApp mediante un enlace `wa.me`.
- Con Telegram, los mensajes enviados y recibidos pasan por los servidores de Telegram mediante el bot propio; Hablemos guarda una copia de las conversaciones solo en el teléfono.
- **No recibe, consulta ni lee los mensajes de WhatsApp. No envía mensajes automáticamente.**
- El área **Guardadas** contiene frases guardadas localmente, **no** un historial real de conversaciones de WhatsApp.
- Borrar los datos del navegador o cambiar de dispositivo puede eliminar contactos, frases y preferencias: por eso conviene guardar una **copia de seguridad**. No usar como único método de comunicación o atención de emergencias.
- La copia de seguridad incluye el token de Telegram cifrado con la clave elegida. Usar una clave difícil de adivinar y no guardarla junto al archivo.
- **Necesito ayuda** dice el pedido en voz alta y, si se confirma, lo manda por Telegram a la familia conectada. No llama por teléfono ni sustituye un servicio de emergencias.
- Si se guarda información sensible, otras personas con acceso al navegador/dispositivo podrían verla. Proteger el teléfono.

## Archivos del proyecto

`index.html` (interfaz), `app.js` (acciones y constructor), `manifest.webmanifest`, `sw.js` (caché), `assets/` (íconos) y `README.md`.

## Evaluación pendiente

Es un **prototipo funcional**, no una herramienta clínica certificada ni un producto terminado. Antes de adoptarlo de forma habitual, probarlo con la persona usuaria, observar la comodidad del uso real, revisar el volumen de la voz, validar los accesos a WhatsApp y consultar profesionales de comunicación aumentativa y terapia ocupacional si están disponibles.
