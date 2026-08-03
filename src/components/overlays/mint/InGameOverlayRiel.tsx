import CameraFrame from './CameraFrame';
import { useUrlOverrides } from './useUrlOverrides';

interface InGameOverlayRielProps {
  canal?: string;
}

/** Direction "1d" from the design: right-rail HUD with a horizontal camera.
 * Transparent background — meant to sit above a Game Capture source in OBS.
 * `?canal=` in the page URL overrides the badge text.
 * Chat and scoreboard are provided by separate StreamElements widgets, not rendered here. */
export default function InGameOverlayRiel({
  canal: canalProp = 'TWITCH.TV/HOPPERBOOM',
}: InGameOverlayRielProps) {
  const url = useUrlOverrides({ canal: 'string' });
  const canal = url.canal ?? canalProp;

  return (
    <div className="font-pixel fixed inset-0 overflow-hidden">
      <div className="absolute" style={{ right: '2vw', top: '65vh', width: '19vw', minWidth: 320, height: '18vh', minHeight: 180 }}>
        <CameraFrame />
      </div>

      <div
        className="absolute flex items-center"
        style={{ right: '2vw', bottom: '3vh', gap: 14, height: 64, padding: '0 22px', background: 'var(--mint-panel)', border: '3px solid var(--mint-accent)' }}
      >
        <span style={{ width: 12, height: 12, background: 'var(--mint-accent)' }} />
        <span style={{ fontSize: 20, letterSpacing: '.24em', color: 'var(--mint-accent-bright)' }}>{canal}</span>
      </div>
    </div>
  );
}
