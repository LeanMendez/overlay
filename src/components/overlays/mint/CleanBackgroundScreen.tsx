import Landscape from './Landscape';
import { useUrlOverrides } from './useUrlOverrides';

interface CleanBackgroundScreenProps {
  canal?: string;
}

/** Direction "1o" from the design: just the night cinemascope band over black — no
 * title, no countdown, no footer. Meant as a plain background for a view that only
 * needs this. `?canal=` in the page URL overrides the handle text. */
export default function CleanBackgroundScreen({ canal: canalProp = 'TWITCH.TV/HOPPERBOOM' }: CleanBackgroundScreenProps) {
  const url = useUrlOverrides({ canal: 'string' });
  const canal = url.canal ?? canalProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden flex flex-col justify-center" style={{ background: '#000000' }}>
      <div className="relative overflow-hidden" style={{ height: '43vh' }}>
        <Landscape variante="noche" animado className="absolute inset-0" style={{ height: '232.26%', top: '-41.94%' }} />
        <div className="mint-scanlines" />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 200px 40px rgba(2,10,9,.8)' }} />
      </div>

      <div className="absolute flex items-center" style={{ left: '4vw', top: '72vh', gap: 14 }}>
        <span style={{ width: 14, height: 14, background: 'var(--mint-accent)' }} />
        <span style={{ fontSize: 24, letterSpacing: '.26em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
      </div>
    </div>
  );
}
