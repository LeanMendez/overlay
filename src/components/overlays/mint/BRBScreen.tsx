import Landscape from './Landscape';
import { useUrlOverrides } from './useUrlOverrides';

interface BRBScreenProps {
  canal?: string;
  mensaje?: string;
}

/** "Be right back" screen — not in the original design gallery, built to match its visual
 * language (same badge/title/footer structure as EndedScreen) so the overlay kit keeps
 * covering the intermission cases the old mint theme did.
 * `?canal=` / `?mensaje=` in the page URL override these. */
export default function BRBScreen({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
  mensaje: mensajeProp = 'VUELVO EN UNOS MINUTOS, NO TE VAYAS',
}: BRBScreenProps) {
  const url = useUrlOverrides({ canal: 'string', mensaje: 'string' });
  const canal = url.canal ?? canalProp;
  const mensaje = url.mensaje ?? mensajeProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden" style={{ background: 'var(--mint-bg)' }}>
      <Landscape variante="bruma" animado className="absolute inset-0" />
      <div className="mint-vignette" />
      <div className="mint-scanlines" />
      <div className="absolute pointer-events-none" style={{ inset: '3vmin', border: '5px solid rgba(79,211,171,.5)' }} />
      <div className="absolute pointer-events-none" style={{ inset: '4vmin', border: '2px solid rgba(79,211,171,.22)' }} />

      <div
        className="absolute flex items-center"
        style={{ top: '3vh', left: '4.5vw', gap: 14, height: 56, padding: '0 22px', background: 'var(--mint-accent)' }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            background: 'var(--mint-bg)',
            animation: 'mint-blink-dot 1.4s steps(1,end) infinite',
          }}
        />
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.28em', color: 'var(--mint-bg)' }}>PAUSA CORTITA</span>
      </div>

      <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: '50%', transform: 'translateY(-50%)', gap: 30 }}>
        <span style={{ fontSize: 26, letterSpacing: '.4em', color: 'var(--mint-accent)' }}>HOPPERBOOM</span>
        <span
          className="font-pixel-display text-center"
          style={{ fontSize: 'clamp(52px, 9vw, 200px)', lineHeight: 0.8, color: '#f2fffa', filter: 'drop-shadow(10px 10px 0 rgba(2,10,9,.75))' }}
        >
          YA VUELVO
        </span>
        <span style={{ width: 340, height: 8, background: 'var(--mint-accent)' }} />
        <span className="text-center" style={{ fontSize: 24, letterSpacing: '.22em', color: 'var(--mint-text-dim)', maxWidth: '70vw' }}>
          {mensaje}
        </span>
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 flex items-center justify-between"
        style={{ height: '7vh', minHeight: 72, padding: '0 6vw', background: 'var(--mint-panel)', borderTop: '5px solid var(--mint-accent)' }}
      >
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'var(--mint-accent-bright)' }}>HOPPERBOOM</span>
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'rgba(159,240,214,.65)' }}>{canal}</span>
      </div>
    </div>
  );
}
