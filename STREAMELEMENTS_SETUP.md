# Guía de Configuración con StreamElements

Esta guía te explicará paso a paso cómo conectar tus nuevas alertas personalizadas con StreamElements para que funcionen en tu stream.

## ¿Cómo funciona?

Como tus alertas están en tu computadora (localhost) y StreamElements está en internet, usaremos un "truco":
Crearemos un **Custom Widget** en StreamElements que contendrá tus alertas dentro de un marco (iframe). Al cargar este widget en OBS, como OBS está en tu PC, podrá ver tanto a StreamElements como a tus alertas locales.

## Paso 1: Preparar StreamElements

1. Inicia sesión en [StreamElements](https://streamelements.com/).
2. Ve al menú lateral **Streaming Tools** -> **Overlays**.
3. Haz clic en **NEW OVERLAY**.
4. Selecciona la resolución **1080p** y dale a **START**.
5. Haz clic en el botón **+** (Add Widget) -> **Static / Custom** -> **Custom Widget**.
6. Verás un cuadro gris. Haz clic en él y luego en **Settings** (o "Open Editor") en el menú de la izquierda.

## Paso 2: Configurar el Código

Se abrirá un editor con pestañas (HTML, CSS, JS, FIELDS, DATA). Vamos a configurar cada una:

### Pestaña HTML
Borra todo lo que haya y pega esto:
```html
<div class="overlay-container">
    <!-- Aquí cargamos tus alertas locales -->
    <iframe src="http://localhost:4321/alerts/live" allowtransparency="true"></iframe>
</div>
```

### Pestaña CSS
Borra todo y pega esto para asegurar que ocupe toda la pantalla:
```css
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.overlay-container {
    width: 100%;
    height: 100%;
}

iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
}
```

### Pestaña JS
Borra todo y pega este código "puente" que enviará las alertas a tu diseño:
```javascript
// Referencia al iframe donde están tus alertas
const OVERLAY_FRAME = document.querySelector('iframe');

window.addEventListener('onEventReceived', function(obj) {
    if (!obj.detail.event) return;
    
    const event = obj.detail.event;
    const listener = obj.detail.listener;
    
    // Preparar datos para tu alerta
    let alertData = {
        type: '',
        username: event.name || event.displayName || 'Anonymous'
    };

    // Mapear eventos de StreamElements a tus alertas
    if (listener === 'follower-latest') {
        alertData.type = 'follow';
    } 
    else if (listener === 'subscriber-latest') {
        alertData.type = 'subscribe';
        alertData.message = event.message || '';
    } 
    else if (listener === 'tip-latest') {
        alertData.type = 'donation';
        alertData.amount = event.amount;
        alertData.message = event.message || '';
    } 
    else if (listener === 'raid-latest') {
        alertData.type = 'raid';
        alertData.amount = event.amount; // Número de viewers
    } 
    else if (listener === 'cheer-latest') {
        alertData.type = 'bits';
        alertData.amount = event.amount;
        alertData.message = event.message || '';
    }

    // Si detectamos un tipo de alerta válido, enviarla
    if (alertData.type && OVERLAY_FRAME) {
        console.log('Enviando alerta:', alertData);
        OVERLAY_FRAME.contentWindow.postMessage({
            type: 'triggerAlert',
            detail: alertData
        }, '*');
    }
});
```

7. Haz clic en **DONE** (o Save).
8. Dale un nombre a tu Overlay (ej: "Mis Alertas Custom") y **SAVE**.

## Paso 3: Configurar tu Código Local

Necesitamos un pequeño cambio en tu código para que escuche los mensajes de StreamElements (postMessage).

Yo haré este cambio por ti automáticamente en el siguiente paso.

## Paso 4: Agregar a OBS

1. En StreamElements, en tu lista de Overlays, haz clic en el icono de **cadena** (Copy URL) de tu nuevo overlay.
2. Abre **OBS**.
3. En tu escena, agrega una fuente **Browser** (Navegador).
4. Pega la URL que copiaste de StreamElements.
5. Establece **Width: 1920** y **Height: 1080**.
6. **IMPORTANTE**: Asegúrate de que tu servidor local esté corriendo (`npm run dev`).

¡Listo! Ahora cuando alguien te siga, StreamElements recibirá la señal, se la pasará a tu widget, y tu widget se la pasará a tu diseño local.
