import Landscape from './Landscape';
import CountdownTimer from './CountdownTimer';
import { useUrlOverrides } from './useUrlOverrides';

interface WaitingScreenAlbaProps {
  canal?: string;
  juego?: string;
  modo?: string;
  segundos?: number;
}

/** Direction "1a" from the design: landscape bleeds full-screen, title sits over the water.
 * `?canal=` / `?juego=` / `?modo=` / `?segundos=` in the page URL override these. */
export default function WaitingScreenAlba({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
  juego: juegoProp = 'AGE OF EMPIRES II',
  modo: modoProp = 'RANKED 1V1',
  segundos = 300,
}: WaitingScreenAlbaProps) {
  const url = useUrlOverrides({ canal: 'string', juego: 'string', modo: 'string' });
  const canal = url.canal ?? canalProp;
  const juego = url.juego ?? juegoProp;
  const modo = url.modo ?? modoProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden" style={{ background: 'var(--mint-bg)' }}>
      <Landscape variante="alba" animado className="absolute inset-0" />
      <div className="mint-vignette" />
      <div className="mint-scanlines" />
      <div className="absolute pointer-events-none" style={{ inset: '3vmin', border: '5px solid rgba(79,211,171,.5)' }} />
      <div className="absolute pointer-events-none" style={{ inset: '4vmin', border: '2px solid rgba(79,211,171,.22)' }} />

      <div
        className="absolute flex items-center"
        style={{ top: '3vh', left: '4.5vw', gap: 14, height: 56, padding: '0 22px', background: 'var(--mint-accent)' }}
      >
        <span style={{ width: 14, height: 14, background: 'var(--mint-bg)' }} />
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.28em', color: 'var(--mint-bg)' }}>COMENZAMOS EN BREVE</span>
      </div>

      <div className="absolute" style={{ left: '7.5vw', top: '16vh' }}>
        <CountdownTimer segundos={segundos} />
      </div>

      <div className="absolute flex flex-col" style={{ left: '6vw', bottom: '20vh', gap: 22, maxWidth: '80vw' }}>
        <span style={{ fontSize: 26, letterSpacing: '.34em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
        <span
          className="font-pixel-display"
          style={{ fontSize: 'clamp(56px, 9vw, 190px)', lineHeight: 0.8, color: '#f2fffa', filter: 'drop-shadow(10px 10px 0 rgba(2,10,9,.6))' }}
        >
          YA COMENZAMOS
        </span>
        <div className="flex items-center" style={{ gap: 20 }}>
          <span style={{ width: 230, height: 8, background: 'var(--mint-accent)' }} />
          <span style={{ fontSize: 24, letterSpacing: '.22em', color: 'var(--mint-text-dim)' }}>PONETE CÓMODO, EN UNOS MINUTOS EMPEZAMOS</span>
        </div>
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 flex items-center justify-between"
        style={{ height: '7vh', minHeight: 72, padding: '0 6vw', background: 'var(--mint-panel)', borderTop: '5px solid var(--mint-accent)' }}
      >
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'var(--mint-accent-bright)' }}>HOPPERBOOM</span>
        <div className="flex" style={{ gap: 10 }}>
          <span style={{ width: 14, height: 14, background: 'var(--mint-accent)' }} />
          <span style={{ width: 14, height: 14, background: 'rgba(79,211,171,.45)' }} />
          <span style={{ width: 14, height: 14, background: 'rgba(79,211,171,.2)' }} />
        </div>
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'rgba(159,240,214,.65)' }}>
          {juego} · {modo}
        </span>
      </div>
    </div>
  );
}
