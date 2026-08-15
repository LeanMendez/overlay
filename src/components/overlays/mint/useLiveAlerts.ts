import { useEffect, useRef, useState } from 'react';
import type { AlertType } from './AlertBanner';

export interface LiveAlert {
  tipo: AlertType;
  nombre: string;
  kicker: string;
  detalle: string;
  cantidad?: number;
}

interface TwitchAlertEventDetail {
  type: 'follow' | 'subscribe' | 'bits' | 'raid' | 'gift' | 'resub';
  username: string;
  tier?: string;
  /** bits count (type=bits) / raid viewer count (type=raid) */
  amount?: number;
  message?: string;
  /** number of subs gifted in this batch (type=gift) */
  total?: number;
  /** lifetime months subscribed (type=resub) */
  cumulativeMonths?: number;
}

const TIER_LABEL: Record<string, string> = {
  '1000': 'NIVEL 1',
  '2000': 'NIVEL 2',
  '3000': 'NIVEL 3',
};

function toLiveAlert(detail: TwitchAlertEventDetail): LiveAlert {
  switch (detail.type) {
    case 'subscribe':
      return {
        tipo: 'sub',
        nombre: detail.username,
        kicker: 'SE HA SUSCRITO',
        detalle: detail.tier ? (TIER_LABEL[detail.tier] ?? `NIVEL ${detail.tier}`) : 'GRACIAS POR SUSCRIBIRTE',
      };
    case 'gift': {
      const total = detail.total ?? 1;
      return {
        tipo: 'gift',
        nombre: detail.username,
        cantidad: total,
        kicker: total > 1 ? `SUB REGALADO ×${total}` : 'SUB REGALADO',
        detalle: `regala ${total} sub${total > 1 ? 's' : ''} a la comu`,
      };
    }
    case 'resub': {
      const months = detail.cumulativeMonths ?? 1;
      return {
        tipo: 'resub',
        nombre: detail.username,
        cantidad: months,
        kicker: `RESUB · ${months} MES${months === 1 ? '' : 'ES'}`,
        detalle: 'sigue en la party',
      };
    }
    case 'bits':
      return {
        tipo: 'sub',
        nombre: detail.username,
        kicker: 'BITS',
        detalle: `${detail.amount ?? 0} BITS · GRACIAS`,
      };
    case 'raid': {
      const viewers = detail.amount ?? 0;
      return {
        tipo: 'raid',
        nombre: detail.username,
        cantidad: viewers,
        kicker: `RAID · ${viewers}`,
        detalle: 'llega con su gente',
      };
    }
    case 'follow':
    default:
      return {
        tipo: 'seguidor',
        nombre: detail.username,
        kicker: 'NUEVO SEGUIDOR',
        detalle: 'te sigue desde ahora',
      };
  }
}

export interface LiveAlertState {
  alert: LiveAlert | null;
  /** True while the exit animation should be playing for `alert`. */
  exiting: boolean;
}

/** Matches AlertBanner's `alert2-out` animation duration — the queue waits this
 * long after marking an alert as exiting before swapping in the next one. */
const EXIT_MS = 300;

/** Listens for the `twitchAlert` window events dispatched by `TwitchIntegration`
 * (follow/subscribe/bits/raid/gift/resub — see src/components/overlays/TwitchIntegration.tsx)
 * and queues them one at a time, each shown for `displayMs` then played out through a
 * short exit phase before the next one appears. Requires a `<TwitchBridge />` mounted on
 * the page to open the connection (or, for testing, any code dispatching the same
 * `twitchAlert` CustomEvent — see MintAlertTester). */
export function useLiveAlerts(displayMs = 6000): LiveAlertState {
  const [state, setState] = useState<LiveAlertState>({ alert: null, exiting: false });
  const queueRef = useRef<LiveAlert[]>([]);
  const timerRef = useRef<number | undefined>(undefined);
  const showingRef = useRef(false);

  useEffect(() => {
    const showNext = () => {
      const next = queueRef.current.shift();
      if (!next) {
        showingRef.current = false;
        setState({ alert: null, exiting: false });
        return;
      }
      showingRef.current = true;
      setState({ alert: next, exiting: false });
      timerRef.current = window.setTimeout(startExit, displayMs);
    };

    const startExit = () => {
      setState((s) => (s.alert ? { ...s, exiting: true } : s));
      timerRef.current = window.setTimeout(showNext, EXIT_MS);
    };

    const onTwitchAlert = (event: Event) => {
      const detail = (event as CustomEvent<TwitchAlertEventDetail>).detail;
      if (!detail) return;
      queueRef.current.push(toLiveAlert(detail));
      if (!showingRef.current) {
        showNext();
      }
    };

    window.addEventListener('twitchAlert', onTwitchAlert);
    return () => {
      window.removeEventListener('twitchAlert', onTwitchAlert);
      window.clearTimeout(timerRef.current);
    };
  }, [displayMs]);

  return state;
}
