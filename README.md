# Hablemos V0.3.1 — Crear conversaciones sin escribir

**Prototipo accesible para Android**. Diseñado para una persona que comprende texto y puede pulsar botones grandes, pero no puede hablar y tiene dificultad para escribir.

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

1. Cambiar el nombre de la caché en `sw.js` (por ejemplo `hablemos-offline-v3` → `hablemos-offline-v4`). **Si no se cambia, los teléfonos que ya la instalaron pueden seguir mostrando la versión anterior.**
2. Guardar los cambios con git y subirlos: `git commit -am "…"` y `git push`.
3. En uno o dos minutos GitHub Pages publica la nueva versión. En el teléfono, cerrar la app y volver a abrirla (a veces hace falta abrirla dos veces).

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
- **No recibe, consulta ni lee los mensajes de WhatsApp. No envía mensajes automáticamente.**
- El área **Guardadas** contiene frases guardadas localmente, **no** un historial real de conversaciones de WhatsApp.
- Borrar los datos del navegador o cambiar de dispositivo puede eliminar contactos, frases y preferencias. No usar como único método de comunicación o atención de emergencias.
- **Necesito ayuda ahora** solo prepara una frase y la reproduce por voz; no llama, no contacta a nadie y no sustituye un sistema de aviso urgente.
- Si se guarda información sensible, otras personas con acceso al navegador/dispositivo podrían verla. Proteger el teléfono.

## Archivos del proyecto

`index.html` (interfaz), `app.js` (acciones y constructor), `manifest.webmanifest`, `sw.js` (caché), `assets/` (íconos) y `README.md`.

## Evaluación pendiente

Es un **prototipo funcional**, no una herramienta clínica certificada ni un producto terminado. Antes de adoptarlo de forma habitual, probarlo con la persona usuaria, observar la comodidad del uso real, revisar el volumen de la voz, validar los accesos a WhatsApp y consultar profesionales de comunicación aumentativa y terapia ocupacional si están disponibles.
