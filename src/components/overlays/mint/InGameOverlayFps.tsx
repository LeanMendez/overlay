import CameraFrame from './CameraFrame';
import Scoreboard from './Scoreboard';

interface InGameOverlayFpsProps {
  victorias?: number;
  derrotas?: number;
}

/** Direction "1f" from the design: vertical camera top-left.
 * Transparent background — meant to sit above a Game Capture source in OBS.
 * Chat is provided by a separate StreamElements widget, not rendered here. */
export default function InGameOverlayFps({ victorias = 9, derrotas = 4 }: InGameOverlayFpsProps) {
  return (
    <div className="font-pixel fixed inset-0 overflow-hidden">
      <div className="absolute" style={{ left: '2vw', top: '4vh', width: 'calc(15vw - 100px)', minWidth: 260, height: 'calc(46vh - 150px)' }}>
        <CameraFrame etiqueta="EN VIVO" />
      </div>

      <div className="absolute" style={{ left: '2vw', bottom: '3vh' }}>
        <Scoreboard victorias={victorias} derrotas={derrotas} />
      </div>
    </div>
  );
}
