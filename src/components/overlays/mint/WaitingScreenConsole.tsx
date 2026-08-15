import Landscape from './Landscape';
import { useUrlOverrides } from './useUrlOverrides';

interface WaitingScreenConsoleProps {
  canal?: string;
}

/** Direction "1c" from the design: cinemascope night band with the title over it.
 * `?canal=` in the page URL overrides this.
 * The countdown is provided by a separate StreamElements widget, not rendered here. */
export default function WaitingScreenConsole({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
}: WaitingScreenConsoleProps) {
  const url = useUrlOverrides({ canal: 'string' });
  const canal = url.canal ?? canalProp;

  return (
    <div
      className="font-pixel fixed inset-0 overflow-hidden flex flex-col justify-center"
      style={{ background: 'var(--mint-bg-alt)' }}
    >
      <div className="relative overflow-hidden" style={{ height: '43vh', borderTop: '6px solid var(--mint-accent)', borderBottom: '6px solid var(--mint-accent)' }}>
        <Landscape variante="noche" animado className="absolute inset-0" style={{ height: '232.26%', top: '-41.94%' }} />
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

      <div className="flex items-center justify-end" style={{ padding: '3vh 8vw 0' }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span style={{ width: 14, height: 14, background: 'var(--mint-accent)' }} />
          <span style={{ fontSize: 24, letterSpacing: '.24em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
        </div>
      </div>
    </div>
  );
}
