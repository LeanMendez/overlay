import AlertBanner from './AlertBanner';
import { useLiveAlerts } from './useLiveAlerts';

interface LiveAlertBoxProps {
  /** How long each alert stays on screen, in ms. */
  displayMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Renders nothing until a real follow/sub/bits/raid comes in via `<TwitchBridge />`
 * (or a simulated one from `MintAlertTester`), then shows it through `AlertBanner` and
 * auto-dismisses. This is the component to put on its own OBS Browser Source for alerts. */
export default function LiveAlertBox({ displayMs = 6000, className, style }: LiveAlertBoxProps) {
  const { alert, exiting } = useLiveAlerts(displayMs);

  if (!alert) return null;

  return (
    <AlertBanner
      key={`${alert.tipo}-${alert.nombre}-${alert.detalle}`}
      tipo={alert.tipo}
      nombre={alert.nombre}
      kicker={alert.kicker}
      detalle={alert.detalle}
      cantidad={alert.cantidad}
      exiting={exiting}
      className={className}
      style={style}
    />
  );
}
