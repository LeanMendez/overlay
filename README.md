# Stream Overlays

Overlays personalizados para OBS creados con Astro, React y Tailwind CSS.

## Características

- Diseño minimalista con estética futurista
- Inspiración de Star Wars y Hollow Knight
- Paleta de colores: blanco, negro y gris
- Animaciones sutiles y fluidas
- Múltiples variantes para diferentes layouts

## Componentes Disponibles

### Camera Frame
Marcos decorativos para tu cámara web con 5 variantes:

- **Default (4:3)** - 400×300px - Formato clásico horizontal
- **Wide (16:9)** - 480×270px - Pantalla ancha perfecta para gaming
- **Portrait (9:16)** - 270×480px - Vertical para layouts de móvil
- **Compact** - 320×240px - Versión pequeña y discreta
- **Square (1:1)** - 360×360px - Formato cuadrado

### Alert Box ✨
Sistema de alertas con animaciones llamativas para eventos de stream:

- **Follow** - Nueva persona siguiendo tu canal
- **Subscribe** - Nueva suscripción
- **Donation** - Donaciones con monto y mensaje
- **Raid** - Raids de otros canales
- **Bits** - Cheers con bits

**Características:**
- Animación de entrada con rebote dramático
- Efecto de brillo (glow) intenso y pulsante
- Partículas flotantes y destellos
- Iconos animados con anillo giratorio
- Auto-dismiss después de 5 segundos
- Soporte para mensajes personalizados

### Stream Screens 🌙
Pantallas de transición con elementos espaciales (luna, planetas, estrellas) en inglés y español:

#### Starting Screen (Comenzando Pronto)
- Luna flotante con satélite orbitando
- Campo de estrellas animadas
- Anillos pulsantes alrededor del título
- Meteoros ocasionales
- **Versiones**: EN | ES

#### BRB Screen (Ya Vuelvo)
- Planeta central con anillos estilo Saturno
- Lunas orbitando alrededor
- Patrón geométrico inspirado en Hollow Knight
- Animación de flotación suave
- **Versiones**: EN | ES

#### Ending Screen (Gracias por Ver)
- Estrellas fugaces cruzando la pantalla
- Planetas distantes en el fondo
- Hexágonos expandiéndose
- Espacio para información de redes sociales
- **Versiones**: EN | ES

### Chat Overlay 💬
Overlay de chat con efecto glassmorphism (vidrio esmerilado) para mostrar mensajes de Twitch/YouTube:

**Características:**
- Efecto glassmorphism con backdrop blur
- 3 posiciones disponibles: derecha, izquierda, inferior
- Animaciones suaves de entrada (slide-in)
- Auto-fade después de 15 segundos
- Detalles minimalistas integrados (esquinas, líneas conectoras)
- Efecto shimmer sutil en cada mensaje
- Soporte para badges de usuario
- Colores personalizables por usuario
- Width ajustable (300-600px)
- **Mensajes destacados** - Brillo dorado sutil para donaciones y mensajes importantes

**Posiciones:**
- **Right** - Lado derecho (ideal para layout estándar)
- **Left** - Lado izquierdo
- **Bottom** - Parte inferior (ideal para pantalla completa)

### Goal Tracker 🎯
Sistema de seguimiento de objetivos con animaciones de progreso y celebración:

**Tipos de objetivos:**
- **Followers** ⭐ - Seguimiento de seguidores
- **Subscribers** 💎 - Meta de suscriptores
- **Donations** 💰 - Objetivo de donaciones
- **Custom** 🎯 - Personalizable para cualquier meta

**Características:**
- Efecto glassmorphism consistente con chat overlay
- 4 posiciones disponibles (esquinas)
- Barra de progreso animada con marcadores en 25%, 50%, 75%
- Efecto shimmer en la barra de progreso
- Animación de conteo de números suave
- Display de porcentaje opcional
- Celebración con confetti al completar objetivo
- Badge "✓ COMPLETE" al alcanzar la meta
- Indicador "X to go" para progreso pendiente
- Detalles decorativos inspirados en Hollow Knight

**Posiciones:**
- **Top-Right** - Esquina superior derecha (default)
- **Top-Left** - Esquina superior izquierda
- **Bottom-Right** - Esquina inferior derecha
- **Bottom-Left** - Esquina inferior izquierda

#### Goal Tracker Compact
Versión compacta y discreta ideal para usar durante gameplay:

**Diferencias con la versión normal:**
- **Más pequeño** - Ocupa aproximadamente 50% menos espacio vertical
- **Más discreto** - Diseño minimalista con menos detalles visuales
- **6 posiciones** - Incluye posiciones centradas (top-center, bottom-center)
- **Texto más pequeño** - Fuentes reducidas para menor intrusión
- **Sin porcentaje por defecto** - Oculto para máxima compactación
- **Marcador único** - Solo línea al 50% en barra de progreso
- Mantiene todas las animaciones y celebración con confetti

### Próximamente
- Lower Third - Banner inferior con información en tiempo real

## 🚀 Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   └── overlays/
│   │       └── CameraFrame.tsx
│   ├── pages/
│   │   ├── index.astro
│   │   ├── camera-frame.astro
│   │   └── frames/
│   │       ├── default.astro
│   │       ├── wide.astro
│   │       ├── portrait.astro
│   │       ├── compact.astro
│   │       └── square.astro
│   └── styles/
│       └── global.css
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📺 Uso en OBS

### Camera Frame

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. En OBS, agrega una fuente **Browser**

3. Configura la fuente:
   - **URL**: Usa una de estas según el frame que necesites:
     - Default: `http://localhost:4321/frames/default`
     - Wide: `http://localhost:4321/frames/wide`
     - Portrait: `http://localhost:4321/frames/portrait`
     - Compact: `http://localhost:4321/frames/compact`
     - Square: `http://localhost:4321/frames/square`

   - **Ancho y Alto**: Ajusta según el tamaño del frame
   - Marca "Shutdown source when not visible" para optimizar

4. Posiciona tu fuente de cámara detrás del frame en OBS

5. Ajusta la posición y escala según tu layout

### Alert Box

1. Agrega una fuente **Browser** en OBS

2. Configura:
   - **URL**: `http://localhost:4321/alerts/live`
   - **Ancho**: 1920
   - **Alto**: 1080
   - Marca "Shutdown source when not visible"

3. Para probar alertas:
   - Vista de prueba: `http://localhost:4321/alert-box`
   - Con botones interactivos para disparar cada tipo de alerta

4. Para integración con StreamElements/StreamLabs:
   - Ver [INTEGRATION.md](./INTEGRATION.md) para detalles completos

### Stream Screens

1. Crea una escena separada para cada pantalla en OBS

2. Agrega una fuente **Browser** en cada escena

3. Configura las URLs (1920×1080):

   **Starting Screens:**
   - English: `http://localhost:4321/screens/starting-en`
   - Español: `http://localhost:4321/screens/starting-es`

   **BRB Screens:**
   - English: `http://localhost:4321/screens/brb-en`
   - Español: `http://localhost:4321/screens/brb-es`

   **Ending Screens:**
   - English: `http://localhost:4321/screens/ending-en`
   - Español: `http://localhost:4321/screens/ending-es`

4. Vista previa de todas las pantallas:
   - `http://localhost:4321/stream-screens`

5. Personaliza editando los archivos `.astro` en `/src/pages/screens/`:
   - Nombre del streamer
   - Redes sociales
   - Mensajes personalizados

### Chat Overlay

1. Agrega una fuente **Browser** en OBS

2. Configura las URLs (1920×1080):

   **Por posición:**
   - Right: `http://localhost:4321/chat/right`
   - Left: `http://localhost:4321/chat/left`
   - Bottom: `http://localhost:4321/chat/bottom`
   - Live (default): `http://localhost:4321/chat/live`

3. Vista de prueba con controles:
   - `http://localhost:4321/chat-overlay`

4. Integración con chat:
   - El componente escucha eventos `chatMessage`
   - Envía mensajes usando JavaScript:
   ```javascript
   window.dispatchEvent(new CustomEvent('chatMessage', {
     detail: {
       id: 'unique-id',
       username: 'Usuario',
       message: 'Hola!',
       timestamp: Date.now(),
       color: '#FF6B6B',
       badges: ['⭐'],
       highlighted: false  // true para mensajes con brillo dorado
     }
   }));
   ```

### Goal Tracker

1. Agrega una fuente **Browser** en OBS

2. Configura las URLs (1920×1080):

   **Objetivos predefinidos (versión normal):**
   - Followers: `http://localhost:4321/goals/followers`
   - Subscribers: `http://localhost:4321/goals/subscribers`
   - Donations: `http://localhost:4321/goals/donations`

   **Objetivos predefinidos (versión compacta - ideal para gameplay):**
   - Followers: `http://localhost:4321/goals-compact/followers`
   - Subscribers: `http://localhost:4321/goals-compact/subscribers`
   - Donations: `http://localhost:4321/goals-compact/donations`

3. Vista de prueba con controles interactivos:
   - Versión normal: `http://localhost:4321/goal-tracker`
   - Versión compacta: `http://localhost:4321/goal-tracker-compact`
   - Incluye botones para incrementar progreso y probar celebración

4. Personalización:
   - Edita los archivos en `/src/pages/goals/` (normal) o `/src/pages/goals-compact/` (compacta) para ajustar:
     - `current` - Progreso actual
     - `target` - Meta objetivo
     - `position` - Posición en pantalla
     - `showPercentage` - Mostrar/ocultar porcentaje

5. Actualización dinámica:
   - El componente escucha eventos `updateGoal`
   - Actualiza progreso usando JavaScript:
   ```javascript
   window.dispatchEvent(new CustomEvent('updateGoal', {
     detail: {
       current: 750,  // Nuevo valor de progreso
       target: 1000   // Opcional: actualizar meta también
     }
   }));
   ```

## 🎨 Personalización

Los componentes aceptan props para personalizar:

### Camera Frame
```tsx
<CameraFrame
  variant="portrait"    // Usa variante predefinida
  width={300}          // O especifica dimensiones custom
  height={400}
  borderWidth={3}      // Grosor del borde
/>
```

### Goal Tracker (Normal)
```tsx
<GoalTracker
  goalType="followers"     // 'followers' | 'subscribers' | 'donations' | 'custom'
  current={742}            // Progreso actual
  target={1000}            // Meta objetivo
  position="top-right"     // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showPercentage={true}    // Mostrar porcentaje
  title="MI META"          // Título personalizado (opcional)
  icon="🚀"               // Icono personalizado (opcional)
/>
```

### Goal Tracker Compact
```tsx
<GoalTrackerCompact
  goalType="followers"     // 'followers' | 'subscribers' | 'donations' | 'custom'
  current={742}            // Progreso actual
  target={1000}            // Meta objetivo
  position="top-center"    // 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  showPercentage={false}   // Oculto por defecto para ser más compacto
  title="FOLLOWERS"        // Título personalizado (opcional)
  icon="⭐"               // Icono personalizado (opcional)
/>
```

### Chat Overlay
```tsx
<ChatOverlay
  position="right"         // 'right' | 'left' | 'bottom'
  width={400}              // Ancho del overlay (300-600px)
/>
```

## 🛠️ Desarrollo

### Páginas de Preview
- **Vista principal**: `http://localhost:4321`
- **Camera frames**: `http://localhost:4321/camera-frame`
- **Alert box tester**: `http://localhost:4321/alert-box`
- **Stream screens**: `http://localhost:4321/stream-screens`
- **Chat overlay tester**: `http://localhost:4321/chat-overlay`
- **Goal tracker tester**: `http://localhost:4321/goal-tracker`
- **Goal tracker compact tester**: `http://localhost:4321/goal-tracker-compact`

### Test de Alertas con URL
Puedes probar alertas individuales con parámetros:
```
http://localhost:4321/alerts/live?test=follow
http://localhost:4321/alerts/live?test=subscribe
http://localhost:4321/alerts/live?test=donation
http://localhost:4321/alerts/live?test=raid
http://localhost:4321/alerts/live?test=bits
```

## 📝 Notas

- El fondo es transparente por defecto para uso en OBS
- Las animaciones son sutiles y optimizadas para streaming
- Los frames se adaptan automáticamente a orientación horizontal o vertical
