import Landscape from './Landscape';
import { useUrlOverrides } from './useUrlOverrides';

interface EndedScreenProps {
  canal?: string;
  proximo?: string;
}

/** Direction "1g" from the design. `?canal=` / `?proximo=` in the page URL override these. */
export default function EndedScreen({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
  proximo: proximoProp = 'PRÓXIMO STREAM · JUEVES 21:00',
}: EndedScreenProps) {
  const url = useUrlOverrides({ canal: 'string', proximo: 'string' });
  const canal = url.canal ?? canalProp;
  const proximo = url.proximo ?? proximoProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden" style={{ background: 'var(--mint-bg-alt)' }}>
      <Landscape variante="noche" animado className="absolute inset-0" />
      <div className="mint-vignette" />
      <div className="mint-scanlines" />
      <div className="absolute pointer-events-none" style={{ inset: '3vmin', border: '5px solid rgba(79,211,171,.4)' }} />

      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '50%', transform: 'translateY(-50%)', gap: 30 }}
      >
        <span style={{ fontSize: 26, letterSpacing: '.4em', color: 'var(--mint-accent)' }}>HOPPERBOOM</span>
        <span
          className="font-pixel-display text-center"
          style={{ fontSize: 'clamp(52px, 9vw, 200px)', lineHeight: 0.8, color: '#f2fffa', filter: 'drop-shadow(10px 10px 0 rgba(2,10,9,.75))' }}
        >
          EL STREAM TERMINÓ
        </span>
        <span style={{ width: 340, height: 8, background: 'var(--mint-accent)' }} />
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 flex items-center justify-between"
        style={{ height: '7vh', minHeight: 72, padding: '0 6vw', background: 'var(--mint-panel)', borderTop: '5px solid var(--mint-accent)' }}
      >
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'var(--mint-text-dim)' }}>{proximo}</span>
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
      </div>
    </div>
  );
}
