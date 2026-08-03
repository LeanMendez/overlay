import Landscape from './Landscape';
import CameraFrame from './CameraFrame';
import { useUrlOverrides } from './useUrlOverrides';

interface JustChattingScreenProps {
  canal?: string;
}

/** Direction "1h" from the design — camera over a hazy foreground, landscape band along
 * the bottom. `?canal=` in the page URL overrides the header text.
 * Chat is provided by a separate StreamElements widget, not rendered here. */
export default function JustChattingScreen({ canal: canalProp = 'HOPPERBOOM · TWITCH.TV/HOPPERBOOM' }: JustChattingScreenProps) {
  const url = useUrlOverrides({ canal: 'string' });
  const canal = url.canal ?? canalProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden">
      {/* Fondo pintado en marco alrededor del hueco de la cámara (5vw/9vh a 69vw/73vh)
       * para que esa zona quede realmente transparente y se vea la fuente de video de OBS. */}
      <div className="absolute" style={{ left: 0, right: 0, top: 0, height: '9vh', background: 'var(--mint-bg)' }} />
      <div className="absolute" style={{ left: 0, right: 0, top: '73vh', bottom: 0, background: 'var(--mint-bg)' }} />
      <div className="absolute" style={{ left: 0, top: '9vh', width: '5vw', height: '64vh', background: 'var(--mint-bg)' }} />
      <div className="absolute" style={{ right: 0, top: '9vh', width: '31vw', height: '64vh', background: 'var(--mint-bg)' }} />

      <div className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ height: '21vh', borderTop: '5px solid rgba(79,211,171,.35)' }}>
        <Landscape variante="bruma" animado className="absolute inset-0" style={{ height: '480%', bottom: 0, top: 'auto' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(4,16,15,.72),rgba(4,16,15,.25))' }} />
      </div>

      <div className="absolute" style={{ left: '5vw', top: '9vh', width: '64vw', height: '64vh' }}>
        <CameraFrame />
      </div>

      <div className="absolute flex items-center" style={{ left: '5vw', top: '4vh', gap: 14 }}>
        <span style={{ width: 14, height: 14, background: 'var(--mint-accent)' }} />
        <span style={{ fontSize: 24, letterSpacing: '.3em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
      </div>
    </div>
  );
}
