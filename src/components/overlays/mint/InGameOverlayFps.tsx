import CameraFrame from './CameraFrame';

/** Direction "1f" from the design: vertical camera top-left.
 * Transparent background — meant to sit above a Game Capture source in OBS.
 * Chat and scoreboard are provided by separate StreamElements widgets, not rendered here. */
export default function InGameOverlayFps() {
  return (
    <div className="font-pixel fixed inset-0 overflow-hidden">
      <div className="absolute" style={{ left: '2vw', top: '4vh', width: 'calc(15vw - 100px)', minWidth: 260, height: 'calc(46vh - 150px)' }}>
        <CameraFrame etiqueta="EN VIVO" />
      </div>
    </div>
  );
}
