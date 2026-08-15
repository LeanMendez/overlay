import { useUrlOverrides } from './useUrlOverrides';

export type AlertType = 'seguidor' | 'sub' | 'gift' | 'resub' | 'raid';

interface AlertBannerProps {
  tipo?: AlertType;
  nombre?: string;
  kicker?: string;
  detalle?: string;
  /** Resub months / raid viewer count — drives the number badge on those two types. */
  cantidad?: number;
  /** Twitch sub tier, e.g. '1000' | '2000' | '3000'. Only used by tipo="sub". */
  tier?: string;
  /** Plays the exit animation instead of the entrance one. */
  exiting?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const INK = '#12100F';
const CREAM = '#F4F1E6';

const ACCENT: Record<AlertType, string> = {
  seguidor: '#6FE7B7',
  sub: '#FFD36E',
  gift: '#FF8A6B',
  resub: '#6FE7B7',
  raid: '#A9C7FF',
};

/** Follow (seguidor) and sub are the "pieza principal" alerts — wider card, big
 * name line, settling accent bar underneath. Gift/resub/raid render as the
 * compact single-line rows from the same design system. */
const HERO: Record<AlertType, boolean> = {
  seguidor: true,
  sub: true,
  gift: false,
  resub: false,
  raid: false,
};

const TIER_TAG: Record<string, string> = { '1000': 'TIER 1', '2000': 'TIER 2', '3000': 'TIER 3' };

const DEFAULTS: Record<AlertType, { nombre: string; kicker: string; detalle: string }> = {
  seguidor: { nombre: 'bruno_mtz', kicker: 'NUEVO SEGUIDOR', detalle: 'te sigue desde ahora' },
  sub: { nombre: 'alba.exe', kicker: 'SE HA SUSCRITO', detalle: '¡gracias por el apoyo!' },
  gift: { nombre: 'dorian_', kicker: 'SUB REGALADO', detalle: 'regala 1 sub a la comu' },
  resub: { nombre: 'salvaP', kicker: 'RESUB · 24 MESES', detalle: 'sigue en la party' },
  raid: { nombre: 'vexa_tv', kicker: 'RAID · 147', detalle: 'llega con su gente' },
};

function FollowIcon() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        background: INK,
        clipPath:
          'polygon(0 40%,20% 40%,20% 20%,40% 20%,40% 0,60% 0,60% 20%,80% 20%,80% 40%,100% 40%,100% 60%,80% 60%,80% 80%,60% 80%,60% 100%,40% 100%,40% 80%,20% 80%,20% 60%,0 60%)',
        animation: 'alert2-bob 3.4s ease-in-out infinite',
      }}
    />
  );
}

function SubIcon() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        background: INK,
        clipPath: 'polygon(50% 0,61% 35%,100% 35%,68% 57%,79% 100%,50% 73%,21% 100%,32% 57%,0 35%,39% 35%)',
        animation: 'alert2-bob 3.4s ease-in-out infinite',
      }}
    />
  );
}

function GiftIcon() {
  return (
    <div style={{ position: 'relative', width: 34, height: 34 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 11, background: INK }} />
      <div
        style={{
          position: 'absolute',
          left: -3,
          right: -3,
          top: 0,
          height: 13,
          background: INK,
          transformOrigin: 'left bottom',
          animation: 'alert2-tick .5s cubic-bezier(.16,.9,.3,1) .05s both',
        }}
      />
    </div>
  );
}

function ResubBadge({ cantidad }: { cantidad: number }) {
  return (
    <div
      style={{
        fontFamily: "'Press Start 2P',monospace",
        fontSize: 17,
        color: INK,
        animation: 'alert2-pop .5s cubic-bezier(.16,.9,.3,1) .05s both',
      }}
    >
      {cantidad}
    </div>
  );
}

function RaidIcon() {
  return (
    <div style={{ overflow: 'hidden', width: 46, display: 'flex' }}>
      <div style={{ display: 'flex', gap: 6, animation: 'alert2-creep 1.4s linear infinite' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 8, height: 34, flex: 'none', background: INK }} />
        ))}
      </div>
    </div>
  );
}

function icon(tipo: AlertType) {
  switch (tipo) {
    case 'seguidor':
      return <FollowIcon />;
    case 'sub':
      return <SubIcon />;
    case 'gift':
      return <GiftIcon />;
    case 'raid':
      return <RaidIcon />;
    default:
      return null;
  }
}

/** `?nombre=` / `?kicker=` / `?detalle=` / `?cantidad=` in the page URL override these. */
export default function AlertBanner({
  tipo: tipoProp = 'seguidor',
  nombre: nombreProp,
  kicker: kickerProp,
  detalle: detalleProp,
  cantidad: cantidadProp,
  tier,
  exiting = false,
  className,
  style,
}: AlertBannerProps) {
  const url = useUrlOverrides({ tipo: 'string', nombre: 'string', kicker: 'string', detalle: 'string', cantidad: 'number' });
  const tipo = (url.tipo as AlertType) in ACCENT ? (url.tipo as AlertType) : tipoProp;
  const defaults = DEFAULTS[tipo];
  const nombre = url.nombre ?? nombreProp ?? defaults.nombre;
  const cantidad = url.cantidad ?? cantidadProp;
  const accent = ACCENT[tipo];
  const isHero = HERO[tipo];

  const resolvedKicker =
    url.kicker ??
    kickerProp ??
    (tipo === 'sub' && tier ? `${defaults.kicker} · ${TIER_TAG[tier] ?? 'TIER 1'}` : defaults.kicker);
  const resolvedDetalle = url.detalle ?? detalleProp ?? defaults.detalle;

  return (
    <div
      className={`relative flex items-stretch overflow-hidden ${className ?? ''}`}
      style={
        {
          '--sc': INK,
          width: isHero ? 520 : 470,
          maxWidth: '92vw',
          boxSizing: 'border-box',
          background: CREAM,
          border: `3px solid ${INK}`,
          fontFamily: "'DM Mono',monospace",
          animation: exiting
            ? 'alert2-out .3s cubic-bezier(.4,0,1,1) both'
            : 'alert2-in .5s cubic-bezier(.16,.9,.3,1) both, alert2-shadow .5s cubic-bezier(.16,.9,.3,1) both',
          ...style,
        } as React.CSSProperties
      }
    >
      <div
        className="flex-none flex items-center justify-center"
        style={{ width: isHero ? 96 : 66, background: accent, borderRight: `3px solid ${INK}` }}
      >
        {tipo === 'resub' && cantidad != null ? <ResubBadge cantidad={cantidad} /> : icon(tipo)}
      </div>

      <div
        className="flex-1 min-w-0 flex flex-col"
        style={{ padding: isHero ? '18px 22px' : '13px 18px', gap: isHero ? 11 : 8 }}
      >
        {isHero ? (
          <>
            <span
              className="self-start"
              style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: CREAM, background: INK, padding: '6px 8px', letterSpacing: 1 }}
            >
              {resolvedKicker}
            </span>
            <div
              className="whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 21, color: INK, lineHeight: 1.2 }}
            >
              {nombre}
            </div>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 23, color: '#3d504a', lineHeight: 1 }}>{resolvedDetalle}</div>
          </>
        ) : (
          <>
            <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: INK, letterSpacing: 1 }}>{resolvedKicker}</span>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 24, color: '#3d504a', lineHeight: 1 }}>
              <b style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 12, color: INK }}>{nombre}</b> {resolvedDetalle}
            </div>
          </>
        )}
      </div>

      {isHero && (
        <div
          className="absolute left-0 bottom-0"
          style={{
            height: 7,
            width: '100%',
            background: accent,
            borderTop: `3px solid ${INK}`,
            transformOrigin: 'left center',
            animation: 'alert2-fill .5s cubic-bezier(.16,.9,.3,1) .15s both',
          }}
        />
      )}
    </div>
  );
}
