import { useUrlOverrides } from './useUrlOverrides';

interface ScoreboardProps {
  victorias?: number;
  derrotas?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** `?victorias=` / `?derrotas=` in the page URL override these — edit the OBS Browser
 * Source URL to update the record without touching code. */
export default function Scoreboard({ victorias: victoriasProp = 7, derrotas: derrotasProp = 2, className, style }: ScoreboardProps) {
  const url = useUrlOverrides({ victorias: 'number', derrotas: 'number' });
  const victorias = url.victorias ?? victoriasProp;
  const derrotas = url.derrotas ?? derrotasProp;

  return (
    <div
      className={`font-pixel flex items-center ${className ?? ''}`}
      style={{ gap: 20, filter: 'drop-shadow(3px 3px 0 rgba(2,10,9,.92)) drop-shadow(0 0 6px rgba(2,10,9,.8))', ...style }}
    >
      <div className="flex items-baseline" style={{ gap: 12 }}>
        <span className="font-pixel-display" style={{ fontSize: 60, lineHeight: 0.86, color: '#ffffff' }}>{victorias}</span>
        <span style={{ fontSize: 13, letterSpacing: '.2em', color: 'rgba(159,240,214,.65)' }}>VIC</span>
        <span className="font-pixel-display" style={{ fontSize: 60, lineHeight: 0.86, color: 'var(--mint-gold)', marginLeft: 8 }}>{derrotas}</span>
        <span style={{ fontSize: 13, letterSpacing: '.2em', color: 'rgba(242,196,139,.65)' }}>DER</span>
      </div>
    </div>
  );
}
