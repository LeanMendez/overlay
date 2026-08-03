import { useMemo } from 'react';
import { useUrlOverrides } from './useUrlOverrides';

export type AlertType = 'seguidor' | 'sub';

interface AlertBannerProps {
  tipo?: AlertType;
  nombre?: string;
  kicker?: string;
  detalle?: string;
  /** Plays the CRT power-off exit animation instead of the entrance one. */
  exiting?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ICONS: Record<AlertType, string[]> = {
  seguidor: ['.##.##.', '#######', '#######', '#######', '.#####.', '..###..', '...#...'],
  sub: ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '##...##'],
};

/** `?nombre=` / `?kicker=` / `?detalle=` in the page URL override these. */
export default function AlertBanner({
  tipo: tipoProp = 'seguidor',
  nombre: nombreProp = 'Aldarion77',
  kicker: kickerProp,
  detalle: detalleProp,
  exiting = false,
  className,
  style,
}: AlertBannerProps) {
  const url = useUrlOverrides({ tipo: 'string', nombre: 'string', kicker: 'string', detalle: 'string' });
  const tipo = url.tipo === 'seguidor' || url.tipo === 'sub' ? url.tipo : tipoProp;
  const nombre = url.nombre ?? nombreProp;
  const kicker = url.kicker ?? kickerProp;
  const detalle = url.detalle ?? detalleProp;
  const map = ICONS[tipo];
  const on = tipo === 'sub' ? '#f2c48b' : 'var(--mint-accent)';

  const celdas = useMemo(() => {
    const cells: string[] = [];
    map.forEach((row, y) => {
      for (let x = 0; x < 7; x++) {
        const lit = row[x] === '#';
        cells.push(lit ? (y > 3 ? (tipo === 'sub' ? '#d79f68' : '#2fa585') : on) : 'transparent');
      }
    });
    return cells;
  }, [map, on, tipo]);

  const resolvedKicker = kicker ?? (tipo === 'sub' ? 'NUEVA SUSCRIPCIÓN' : 'NUEVO SEGUIDOR');
  const resolvedDetalle = detalle ?? (tipo === 'sub' ? 'NIVEL 2 · 4 MESES SEGUIDOS' : 'BIENVENIDO');

  return (
    <div
      className={`font-pixel relative flex items-center overflow-hidden ${className ?? ''}`}
      style={{
        gap: 26,
        width: '100%',
        boxSizing: 'border-box',
        padding: '22px 30px',
        background: 'linear-gradient(180deg,#0a2825,var(--mint-bg))',
        border: '4px solid var(--mint-accent)',
        boxShadow: '0 0 0 2px var(--mint-bg), 0 0 0 5px var(--mint-accent-dim)',
        animation: exiting ? 'mint-alert-out .35s steps(5,end) forwards' : 'mint-alert-in .5s steps(6,end) both',
        ...style,
      }}
    >
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: 120,
          background: 'linear-gradient(90deg,rgba(159,240,214,0),rgba(159,240,214,.14),rgba(159,240,214,0))',
          animation: 'mint-alert-sweep 2.6s steps(24,end) infinite',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(180deg,rgba(0,0,0,.16) 0 2px,rgba(0,0,0,0) 2px 4px)' }}
      />

      <div
        className="relative flex-none grid"
        style={{
          gridTemplateColumns: 'repeat(7,10px)',
          gridAutoRows: 10,
          padding: 14,
          background: 'rgba(79,211,171,.08)',
          border: '2px solid rgba(79,211,171,.35)',
        }}
      >
        {celdas.map((bg, i) => (
          <div key={i} style={{ width: 10, height: 10, background: bg }} />
        ))}
      </div>

      <div className="relative flex-1 min-w-0 flex flex-col" style={{ gap: 6 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            style={{
              width: 9,
              height: 9,
              background: 'var(--mint-accent)',
              animation: 'mint-alert-pulse 1.2s steps(1,end) infinite',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.28em', color: 'var(--mint-accent)' }}>{resolvedKicker}</span>
        </div>
        <div
          className="font-pixel-display whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: 72, lineHeight: 0.92, color: '#eafff8', letterSpacing: '.01em' }}
        >
          {nombre}
        </div>
        <div style={{ fontSize: 15, letterSpacing: '.14em', color: 'rgba(159,240,214,.62)' }}>{resolvedDetalle}</div>
      </div>

      <div className="absolute" style={{ top: -4, left: -4, width: 14, height: 14, background: 'var(--mint-accent-bright)' }} />
      <div className="absolute" style={{ bottom: -4, right: -4, width: 14, height: 14, background: 'var(--mint-accent-bright)' }} />
    </div>
  );
}
