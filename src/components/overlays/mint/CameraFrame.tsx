import { useUrlOverrides } from './useUrlOverrides';

interface CameraFrameProps {
  etiqueta?: string;
  nombre?: string;
  hint?: string;
  /** Shows the "CÁMARA" placeholder text — only useful when previewing this page in a
   * browser without a real camera behind it. Leave off (default) for actual OBS use so
   * nothing but the frame itself sits on top of your video source. */
  placeholder?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Bordered frame for the webcam capture — position your OBS video source behind/inside
 * this element. The interior stays fully transparent so only the border, corner accents
 * and badges sit on top of your camera. `?etiqueta=` / `?nombre=` / `?hint=` in the page
 * URL override the labels. */
export default function CameraFrame({
  etiqueta: etiquetaProp = 'EN VIVO',
  nombre: nombreProp = 'hopperboom',
  hint: hintProp = 'colocá acá la fuente de video',
  placeholder = false,
  className,
  style,
}: CameraFrameProps) {
  const url = useUrlOverrides({ etiqueta: 'string', nombre: 'string', hint: 'string' });
  const etiqueta = url.etiqueta ?? etiquetaProp;
  const nombre = url.nombre ?? nombreProp;
  const hint = url.hint ?? hintProp;
  return (
    <div
      className={`font-pixel relative box-border ${className ?? ''}`}
      style={{
        width: '100%',
        height: '100%',
        padding: 10,
        background: placeholder ? 'var(--mint-bg)' : 'transparent',
        border: '4px solid var(--mint-accent)',
        ...style,
      }}
    >
      <div className="absolute pointer-events-none" style={{ inset: 4, border: '2px solid rgba(31,143,118,.55)' }} />

      {placeholder && (
        <div className="relative overflow-hidden" style={{ width: '100%', height: '100%' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 10 }}>
            <div style={{ fontSize: 22, letterSpacing: '.22em', color: 'var(--mint-accent)' }}>CÁMARA</div>
            <div className="text-center" style={{ fontSize: 15, letterSpacing: '.1em', color: 'rgba(159,240,214,.5)', maxWidth: '80%' }}>
              {hint}
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute flex items-center"
        style={{ top: -4, left: 26, gap: 8, height: 32, padding: '0 12px', background: 'var(--mint-accent)' }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            background: 'var(--mint-bg)',
            animation: 'mint-blink-dot 1.6s steps(1,end) infinite',
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.2em', color: 'var(--mint-bg)' }}>{etiqueta}</span>
      </div>

      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ bottom: 14 }}>
        <span style={{ fontSize: 14, letterSpacing: '.24em', color: 'var(--mint-accent-bright)', filter: 'drop-shadow(2px 2px 0 rgba(2,10,9,.9))' }}>
          {nombre}
        </span>
      </div>

      {[
        { top: -4, left: -4 },
        { top: -4, right: -4 },
        { bottom: -4, left: -4 },
        { bottom: -4, right: -4 },
      ].map((pos, i) => (
        <div key={i} className="absolute" style={{ ...pos, width: 16, height: 16, background: 'var(--mint-accent-bright)' }} />
      ))}
    </div>
  );
}
