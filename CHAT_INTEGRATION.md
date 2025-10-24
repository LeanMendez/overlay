# Chat Overlay Integration Guide

Este documento explica cómo integrar el Chat Overlay con diferentes plataformas de streaming.

## Estructura del Mensaje

El Chat Overlay escucha eventos `chatMessage` con la siguiente estructura:

```typescript
{
  id: string;           // ID único del mensaje
  username: string;     // Nombre del usuario
  message: string;      // Contenido del mensaje
  timestamp: number;    // Timestamp en ms (Date.now())
  color?: string;       // Color del nombre de usuario (hex)
  badges?: string[];    // Array de badges (emojis o texto)
  highlighted?: boolean; // Mensaje destacado con brillo dorado (donaciones, subs, etc)
}
```

## Ejemplo Básico

```javascript
// Enviar un mensaje simple
window.dispatchEvent(new CustomEvent('chatMessage', {
  detail: {
    id: `msg-${Date.now()}`,
    username: 'Usuario123',
    message: 'Hola stream!',
    timestamp: Date.now()
  }
}));

// Mensaje con color y badge
window.dispatchEvent(new CustomEvent('chatMessage', {
  detail: {
    id: `msg-${Date.now()}`,
    username: 'Moderador',
    message: 'Bienvenidos!',
    timestamp: Date.now(),
    color: '#4ECDC4',
    badges: ['🛡️']
  }
}));

// Mensaje destacado (donación, suscripción)
window.dispatchEvent(new CustomEvent('chatMessage', {
  detail: {
    id: `msg-${Date.now()}`,
    username: 'GenerousDonor',
    message: 'Keep up the amazing work! 💰',
    timestamp: Date.now(),
    color: '#FFD700',
    badges: ['💎'],
    highlighted: true  // ✨ Brillo dorado sutil
  }
}));
```

## Integración con Twitch (usando tmi.js)

```javascript
// Instalar: npm install tmi.js
import tmi from 'tmi.js';

const client = new tmi.Client({
  channels: ['tu_canal']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignorar mensajes del bot
  if (self) return;

  // Obtener badges
  const badges = [];
  if (tags.badges) {
    if (tags.badges.broadcaster) badges.push('📺');
    if (tags.badges.moderator) badges.push('🛡️');
    if (tags.badges.subscriber) badges.push('⭐');
    if (tags.badges.vip) badges.push('💎');
  }

  // Enviar al overlay
  const iframe = document.querySelector('iframe'); // Tu iframe de OBS
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.dispatchEvent(new CustomEvent('chatMessage', {
      detail: {
        id: tags.id || `msg-${Date.now()}`,
        username: tags['display-name'] || tags.username,
        message: message,
        timestamp: Date.now(),
        color: tags.color || '#FFFFFF',
        badges: badges
      }
    }));
  }
});
```

## Integración con YouTube (usando YouTube Chat API)

```javascript
// Simulación - necesitarás la API de YouTube Live Chat
function handleYouTubeMessage(message) {
  const badges = [];

  // Verificar roles
  if (message.authorDetails.isChatOwner) badges.push('📺');
  if (message.authorDetails.isChatModerator) badges.push('🛡️');
  if (message.authorDetails.isChatSponsor) badges.push('⭐');

  window.dispatchEvent(new CustomEvent('chatMessage', {
    detail: {
      id: message.id,
      username: message.authorDetails.displayName,
      message: message.snippet.displayMessage,
      timestamp: new Date(message.snippet.publishedAt).getTime(),
      color: '#FF0000', // YouTube red por defecto
      badges: badges
    }
  }));
}
```

## Integración con StreamElements

Si usas StreamElements Custom Widget:

```javascript
// En tu widget de StreamElements
window.addEventListener('onEventReceived', function(obj) {
  // Solo procesar mensajes de chat
  if (obj.detail.listener !== 'message') return;

  const data = obj.detail.event.data;

  const badges = [];
  if (data.badges) {
    data.badges.forEach(badge => {
      if (badge.type === 'moderator') badges.push('🛡️');
      if (badge.type === 'subscriber') badges.push('⭐');
      if (badge.type === 'vip') badges.push('💎');
    });
  }

  // Enviar al overlay
  const chatFrame = document.querySelector('iframe[src*="chat/live"]');
  if (chatFrame && chatFrame.contentWindow) {
    chatFrame.contentWindow.dispatchEvent(new CustomEvent('chatMessage', {
      detail: {
        id: data.msgId,
        username: data.displayName,
        message: data.text,
        timestamp: Date.now(),
        color: data.displayColor || '#FFFFFF',
        badges: badges
      }
    }));
  }
});
```

## Integración con OBS Browser Source

### Opción 1: Usando Custom HTML

Crea un archivo HTML local que capture el chat y lo reenvíe:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/tmi.js@1.8.5/dist/tmi.min.js"></script>
</head>
<body>
  <iframe
    id="chatOverlay"
    src="http://localhost:4321/chat/live"
    style="position:fixed;top:0;left:0;width:100%;height:100%;"
  ></iframe>

  <script>
    const client = new tmi.Client({
      channels: ['tu_canal']
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
      if (self) return;

      const iframe = document.getElementById('chatOverlay');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.dispatchEvent(new CustomEvent('chatMessage', {
          detail: {
            id: tags.id,
            username: tags['display-name'],
            message: message,
            timestamp: Date.now(),
            color: tags.color,
            badges: parseBadges(tags.badges)
          }
        }));
      }
    });

    function parseBadges(badgeInfo) {
      const badges = [];
      if (!badgeInfo) return badges;

      if (badgeInfo.broadcaster) badges.push('📺');
      if (badgeInfo.moderator) badges.push('🛡️');
      if (badgeInfo.subscriber) badges.push('⭐');
      if (badgeInfo.vip) badges.push('💎');

      return badges;
    }
  </script>
</body>
</html>
```

### Opción 2: Usando Interact

1. En OBS, haz clic derecho en la fuente Browser
2. Selecciona "Interact"
3. Abre la consola del desarrollador (F12)
4. Ejecuta el código para enviar mensajes de prueba

## Testing

Para probar el overlay sin integración real:

1. Ve a `http://localhost:4321/chat-overlay`
2. Usa los botones para enviar mensajes de prueba
3. Ajusta la posición, tamaño y configuración

## Personalización

### Cambiar el tiempo de vida de mensajes

```javascript
// En chat/live.astro, cambia:
messageLifetime={15000} // 15 segundos (default)
// a:
messageLifetime={30000} // 30 segundos
```

### Cambiar número máximo de mensajes

```javascript
maxMessages={10} // default
// a:
maxMessages={15} // mostrar hasta 15 mensajes
```

### Mostrar timestamps

```javascript
showTimestamp={true}
```

### Cambiar posición

```javascript
position="right"  // derecha (default)
position="left"   // izquierda
position="bottom" // abajo
```

## Troubleshooting

### Los mensajes no aparecen

1. Verifica que la URL sea correcta
2. Abre la consola del navegador (F12) y busca errores
3. Asegúrate de que el evento se está disparando correctamente
4. Verifica que el servidor esté corriendo (`npm run dev`)

### Los mensajes desaparecen muy rápido

Aumenta el `messageLifetime` en el componente

### El glassmorphism no se ve bien

El efecto glassmorphism funciona mejor con contenido detrás. Asegúrate de que haya algo (tu stream) detrás del overlay.

## Ejemplos de Badges

Puedes usar cualquier emoji o carácter como badge:

```javascript
badges: ['📺']  // Broadcaster
badges: ['🛡️']  // Moderator
badges: ['⭐']  // Subscriber
badges: ['💎']  // VIP
badges: ['🤖']  // Bot
badges: ['👑']  // Founder
badges: ['🎁']  // Gift Sub
```

O múltiples badges:

```javascript
badges: ['📺', '⭐', '💎']  // Broadcaster + Subscriber + VIP
```
