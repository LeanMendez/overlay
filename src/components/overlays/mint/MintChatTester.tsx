import { useState } from 'react';
import ChatPanel, { type ChatVariant } from './ChatPanel';
import TwitchBridge from './TwitchBridge';

const SAMPLE_MESSAGES = [
  { username: 'valdemar_ao', message: '¿qué civ es esa?' },
  { username: 'mila.exe', message: 'castillo en 17:40, impecable', badges: ['SUB'] },
  { username: 'K3nzo', message: 'te van a hacer rush con caballería' },
  { username: 'Aldarion77', message: 'ese boom de aldeanos fue criminal', badges: ['MOD'] },
  { username: 'sofi_hp', message: 'segundo centro urbano ya' },
  { username: 'nunu_terr', message: 'gg' },
  { username: 'pixel_pete', message: 'esa arquería está brutal hoy' },
];

const VARIANTS: { value: ChatVariant; label: string }[] = [
  { value: 'columna', label: 'Columna' },
  { value: 'ticker', label: 'Ticker' },
  { value: 'flotante', label: 'Flotante' },
];

/** Dispatches synthetic `chatMessage` window events — the same event bus real Twitch
 * chat uses via TwitchIntegration — so you can preview ChatPanel without being live. */
export default function MintChatTester() {
  const [variante, setVariante] = useState<ChatVariant>('columna');

  const sendMessage = () => {
    const sample = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    window.dispatchEvent(
      new CustomEvent('chatMessage', {
        detail: {
          id: `test-${Date.now()}-${Math.random()}`,
          username: sample.username,
          message: sample.message,
          badges: sample.badges,
        },
      }),
    );
  };

  return (
    <div className="fixed inset-0" style={{ background: '#04100f' }}>
      <TwitchBridge />
      <div className="absolute" style={{ inset: 24 }}>
        <ChatPanel variante={variante} live />
      </div>

      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 p-5"
        style={{ background: 'rgba(4,16,15,.95)', border: '2px solid rgba(79,211,171,.4)', minWidth: 380 }}
      >
        <div className="flex gap-2 justify-center">
          {VARIANTS.map((v) => (
            <button
              key={v.value}
              onClick={() => setVariante(v.value)}
              className="px-3 py-1.5 text-xs"
              style={{
                background: variante === v.value ? 'rgba(79,211,171,.3)' : 'rgba(79,211,171,.08)',
                border: '1px solid rgba(79,211,171,.4)',
                color: '#eafff8',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-sm font-bold"
          style={{ background: '#4fd3ab', color: '#04100f' }}
        >
          Enviar mensaje de prueba
        </button>
        <p className="text-xs text-center" style={{ color: 'rgba(159,240,214,.6)' }}>
          Si tenés Twitch conectado (/twitch-setup) los mensajes reales también van a aparecer acá.
        </p>
      </div>
    </div>
  );
}
