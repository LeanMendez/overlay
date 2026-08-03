export interface ChatMessage {
  u: string;
  t: string;
  badge?: string;
}

import { useUrlOverrides } from './useUrlOverrides';
import { useLiveChat } from './useLiveChat';

export type ChatVariant = 'columna' | 'ticker' | 'flotante';

interface ChatPanelProps {
  variante?: ChatVariant;
  mensajes?: ChatMessage[];
  conectados?: string;
  /** Use real Twitch chat instead of the static demo messages — requires credentials
   * saved at `/twitch-setup` and a `<TwitchBridge />` mounted on the page. */
  live?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  { u: 'valdemar_ao', t: '¿qué civ es esa?' },
  { u: 'mila.exe', t: 'castillo en 17:40, impecable', badge: 'SUB' },
  { u: 'K3nzo', t: 'te van a hacer rush con caballería' },
  { u: 'Aldarion77', t: 'ese boom de aldeanos fue criminal', badge: 'MOD' },
  { u: 'sofi_hp', t: 'segundo centro urbano ya' },
  { u: 'nunu_terr', t: 'gg' },
];

const messageShadow = 'drop-shadow(3px 3px 0 rgba(2,10,9,.92)) drop-shadow(0 0 6px rgba(2,10,9,.8))';

/** `?conectados=` in the page URL overrides the viewer count text. */
export default function ChatPanel({
  variante = 'columna',
  mensajes: mensajesProp = DEFAULT_MESSAGES,
  conectados: conectadosProp = '412 EN LÍNEA',
  live = false,
  className,
  style,
}: ChatPanelProps) {
  const url = useUrlOverrides({ conectados: 'string' });
  const conectados = url.conectados ?? conectadosProp;

  const liveMensajes = useLiveChat();
  const mensajes = live && liveMensajes.length > 0 ? liveMensajes : mensajesProp;

  if (variante === 'ticker') {
    const recientes = mensajes.slice(-3);
    return (
      <div
        className={`font-pixel flex items-stretch ${className ?? ''}`}
        style={{ height: '100%', background: 'var(--mint-panel)', borderTop: '4px solid var(--mint-accent)', ...style }}
      >
        <div className="flex items-center flex-none" style={{ padding: '0 18px', background: 'var(--mint-accent)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.22em', color: 'var(--mint-bg)' }}>CHAT</span>
        </div>
        <div className="flex items-center flex-1 overflow-hidden" style={{ gap: 34, padding: '0 22px' }}>
          {recientes.map((m, i) => (
            <div key={i} className="flex items-baseline whitespace-nowrap" style={{ gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.06em', color: 'var(--mint-accent)' }}>{m.u}</span>
              <span className="font-pixel-display" style={{ fontSize: 26, color: 'var(--mint-text-dim)' }}>{m.t}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center flex-none" style={{ padding: '0 18px', borderLeft: '2px solid var(--mint-accent-dim)' }}>
          <span style={{ fontSize: 13, letterSpacing: '.16em', color: 'rgba(159,240,214,.6)' }}>{conectados}</span>
        </div>
      </div>
    );
  }

  const rowGap = variante === 'flotante' ? 12 : 18;

  return (
    <div
      className={`font-pixel flex flex-col justify-end overflow-hidden ${className ?? ''}`}
      style={{ height: '100%', gap: rowGap, padding: variante === 'flotante' ? '8px 4px' : undefined, ...style }}
    >
      {mensajes.map((m, i) => (
        <div key={i} className="flex" style={{ gap: variante === 'flotante' ? 10 : 10, alignItems: variante === 'flotante' ? 'baseline' : undefined, animation: 'mint-chat-in .35s steps(4,end) both', filter: messageShadow }}>
          <span className="flex-none" style={{ width: variante === 'flotante' ? 8 : 10, height: variante === 'flotante' ? 8 : 10, marginTop: variante === 'flotante' ? 0 : 7, background: 'var(--mint-accent)' }} />
          {variante === 'flotante' ? (
            <>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.06em', color: 'var(--mint-accent)' }}>{m.u}</span>
              <span className="font-pixel-display" style={{ fontSize: 28, lineHeight: 1.05, color: '#ffffff' }}>{m.t}</span>
            </>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="flex items-center" style={{ gap: 8, marginBottom: 3 }}>
                {m.badge && (
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', padding: '2px 5px', background: 'var(--mint-accent-dim)', color: 'var(--mint-accent-bright)' }}>
                    {m.badge}
                  </span>
                )}
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.06em', color: 'var(--mint-accent)' }}>{m.u}</span>
              </div>
              <div className="font-pixel-display" style={{ fontSize: 27, lineHeight: 1.08, color: '#ffffff' }}>{m.t}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
