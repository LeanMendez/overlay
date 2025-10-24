# Integración de Alertas

Este documento explica cómo integrar el Alert Box con diferentes plataformas de streaming.

## Métodos de Integración

### 1. Usando Query Parameters (Para Testing)

Puedes probar alertas individuales agregando parámetros a la URL:

```
http://localhost:4321/alerts/live?test=follow
http://localhost:4321/alerts/live?test=subscribe
http://localhost:4321/alerts/live?test=donation
http://localhost:4321/alerts/live?test=raid
http://localhost:4321/alerts/live?test=bits
```

### 2. Usando Custom Events (Recomendado para producción)

El componente escucha eventos personalizados que puedes disparar desde JavaScript:

```javascript
// Disparar una alerta de follow
window.dispatchEvent(new CustomEvent('triggerAlert', {
  detail: {
    type: 'follow',
    username: 'NuevoFollower123'
  }
}));

// Disparar una alerta de suscripción con mensaje
window.dispatchEvent(new CustomEvent('triggerAlert', {
  detail: {
    type: 'subscribe',
    username: 'NuevoSub456',
    message: 'Me encanta tu contenido!'
  }
}));

// Disparar una alerta de donación
window.dispatchEvent(new CustomEvent('triggerAlert', {
  detail: {
    type: 'donation',
    username: 'Generoso',
    message: 'Sigue así!',
    amount: 25.00
  }
}));

// Disparar una alerta de raid
window.dispatchEvent(new CustomEvent('triggerAlert', {
  detail: {
    type: 'raid',
    username: 'OtroStreamer',
    message: 'Trayendo 50 viewers!'
  }
}));

// Disparar una alerta de bits
window.dispatchEvent(new CustomEvent('triggerAlert', {
  detail: {
    type: 'bits',
    username: 'DonadorBits',
    amount: 500
  }
}));
```

### 3. Integración con StreamElements

StreamElements permite ejecutar código JavaScript personalizado cuando ocurren eventos:

1. Ve a tu dashboard de StreamElements
2. Navega a "Streaming Tools" → "Custom widgets"
3. Crea un nuevo widget o edita uno existente
4. En la pestaña "JS", agrega código como este:

```javascript
// Configuración de la URL de tu overlay
const OVERLAY_FRAME = document.querySelector('iframe[src*="localhost:4321"]');

// Cuando llega un nuevo evento
window.addEventListener('onEventReceived', function(obj) {
  const event = obj.detail.event;

  if (!OVERLAY_FRAME) return;

  // Preparar los datos del evento
  let alertData = {
    type: event.type,
    username: event.name
  };

  // Agregar información específica según el tipo
  if (event.type === 'follow') {
    alertData.type = 'follow';
  } else if (event.type === 'subscriber') {
    alertData.type = 'subscribe';
    alertData.message = event.message;
  } else if (event.type === 'tip') {
    alertData.type = 'donation';
    alertData.amount = event.amount;
    alertData.message = event.message;
  } else if (event.type === 'raid') {
    alertData.type = 'raid';
    alertData.message = `Bringing ${event.amount} viewers!`;
  } else if (event.type === 'cheer') {
    alertData.type = 'bits';
    alertData.amount = event.amount;
    alertData.message = event.message;
  }

  // Enviar el evento al iframe
  OVERLAY_FRAME.contentWindow.dispatchEvent(
    new CustomEvent('triggerAlert', { detail: alertData })
  );
});
```

### 4. Integración con StreamLabs

Similar a StreamElements, StreamLabs permite widgets personalizados:

1. Abre StreamLabs Dashboard
2. Ve a "All Widgets" → "Custom Widget"
3. Agrega tu URL del overlay en un iframe
4. Usa su sistema de eventos para disparar las alertas

### 5. Integración con OBS Browser Source

La forma más simple es usar OBS directamente:

1. Agrega una fuente "Browser" en OBS
2. URL: `http://localhost:4321/alerts/live`
3. Ancho: 1920, Alto: 1080
4. Marca "Shutdown source when not visible"
5. Marca "Refresh browser when scene becomes active"

Para disparar alertas manualmente mientras pruebas:
1. Abre la consola del desarrollador en OBS (clic derecho en la fuente → "Interact")
2. Ejecuta el código JavaScript de Custom Events

## Tipos de Alertas Disponibles

| Tipo | Campos | Ejemplo |
|------|--------|---------|
| `follow` | username | Nuevo seguidor |
| `subscribe` | username, message (opcional) | Nueva suscripción |
| `donation` | username, amount, message (opcional) | Donación |
| `raid` | username, message (opcional) | Raid de otro canal |
| `bits` | username, amount | Cheers con bits |

## Personalización

### Duración de las Alertas

Por defecto, las alertas se muestran durante 5 segundos. Para cambiar esto, edita el componente:

```tsx
// En AlertBox.tsx o AlertListener.tsx
duration={5000} // Cambia esto (en milisegundos)
```

### Agregar Sonidos

Para agregar sonidos a las alertas:

1. Coloca archivos de audio en la carpeta `public/sounds/`
2. Edita `AlertBox.tsx` para reproducir sonidos:

```tsx
useEffect(() => {
  // Reproducir sonido cuando aparece la alerta
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.play().catch(err => console.log('Audio playback failed:', err));
}, [type]);
```

## Troubleshooting

### Las alertas no aparecen
- Verifica que la URL sea correcta
- Asegúrate de que el servidor de desarrollo esté corriendo (`npm run dev`)
- Revisa la consola del navegador por errores

### Las animaciones se ven lentas
- OBS puede tener límite de FPS. Ajusta "FPS" en las propiedades de la fuente Browser
- Recomendado: 60 FPS

### Múltiples alertas se superponen
- El sistema muestra alertas en cola automáticamente
- Si quieres cambiar este comportamiento, edita `AlertListener.tsx`
