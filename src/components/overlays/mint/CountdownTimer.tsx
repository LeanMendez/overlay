import { useEffect, useState } from 'react';
import { useUrlOverrides } from './useUrlOverrides';

interface CountdownTimerProps {
  segundos?: number;
  etiqueta?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** `?segundos=` / `?etiqueta=` in the page URL override these — edit the OBS Browser
 * Source URL to update the wait time without touching code. */
export default function CountdownTimer({ segundos: segundosProp = 300, etiqueta: etiquetaProp = 'ARRANCAMOS EN', className, style }: CountdownTimerProps) {
  const url = useUrlOverrides({ segundos: 'number', etiqueta: 'string' });
  const segundos = url.segundos ?? segundosProp;
  const etiqueta = url.etiqueta ?? etiquetaProp;

  const [restante, setRestante] = useState(segundos);

  useEffect(() => {
    setRestante(segundos);
    const id = setInterval(() => {
      setRestante((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [segundos]);

  const m = Math.floor(restante / 60);
  const s = restante % 60;

  return (
    <div
      className={`font-pixel flex flex-col ${className ?? ''}`}
      style={{ gap: 14, filter: 'drop-shadow(6px 6px 0 rgba(2,10,9,.55))', ...style }}
    >
      <div className="flex items-center" style={{ gap: 14 }}>
        <span
          style={{
            width: 14,
            height: 14,
            background: 'var(--mint-accent)',
            animation: 'mint-blink-dot 1.4s steps(1,end) infinite',
          }}
        />
        <span style={{ fontSize: 24, letterSpacing: '.34em', color: 'var(--mint-accent-bright)' }}>{etiqueta}</span>
      </div>
      <span
        className="font-pixel-display"
        style={{ fontSize: 150, lineHeight: 0.8, letterSpacing: '.02em', color: '#eafff8', fontVariantNumeric: 'tabular-nums' }}
      >
        {m}:{String(s).padStart(2, '0')}
      </span>
    </div>
  );
}
