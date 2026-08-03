import Landscape from './Landscape';
import CountdownTimer from './CountdownTimer';
import { useUrlOverrides } from './useUrlOverrides';

interface WaitingScreenConsoleProps {
  canal?: string;
  juego?: string;
  modo?: string;
  segundos?: number;
}

/** Direction "1c" from the design: cinemascope night band with the title over it.
 * `?canal=` / `?juego=` / `?modo=` / `?segundos=` in the page URL override these. */
export default function WaitingScreenConsole({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
  juego: juegoProp = 'AGE OF EMPIRES II',
  modo: modoProp = 'RANKED 1V1',
  segundos = 300,
}: WaitingScreenConsoleProps) {
  const url = useUrlOverrides({ canal: 'string', juego: 'string', modo: 'string' });
  const canal = url.canal ?? canalProp;
  const juego = url.juego ?? juegoProp;
  const modo = url.modo ?? modoProp;

  return (
    <div
      className="font-pixel fixed inset-0 overflow-hidden flex flex-col justify-center"
      style={{ background: 'var(--mint-bg-alt)' }}
    >
      <div style={{ padding: '0 8vw 3vh' }}>
        <CountdownTimer segundos={segundos} />
      </div>

      <div className="relative overflow-hidden" style={{ height: '43vh', borderTop: '6px solid var(--mint-accent)', borderBottom: '6px solid var(--mint-accent)' }}>
        <Landscape variante="noche" animado className="absolute inset-0" style={{ height: '160%', top: '-20%' }} />
        <div className="mint-scanlines" />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 200px 40px rgba(2,10,9,.8)' }} />
        <div className="absolute flex flex-col" style={{ left: '6.5vw', top: '50%', transform: 'translateY(-50%)', gap: 14 }}>
          <span style={{ fontSize: 26, letterSpacing: '.34em', color: 'var(--mint-accent)' }}>HOPPERBOOM</span>
          <span
            className="font-pixel-display"
            style={{ fontSize: 'clamp(48px, 8vw, 160px)', lineHeight: 0.8, color: '#f2fffa', filter: 'drop-shadow(8px 8px 0 rgba(2,10,9,.8))' }}
          >
            YA COMENZAMOS
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ padding: '3vh 8vw 0' }}>
        <span style={{ fontSize: 24, letterSpacing: '.24em', color: 'var(--mint-text-dim)' }}>
          {juego} · {modo}
        </span>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span style={{ width: 14, height: 14, background: 'var(--mint-accent)' }} />
          <span style={{ fontSize: 24, letterSpacing: '.24em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
        </div>
      </div>
    </div>
  );
}
