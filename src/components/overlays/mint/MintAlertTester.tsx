import LiveAlertBox from './LiveAlertBox';
import TwitchBridge from './TwitchBridge';

const TEST_ALERTS = [
  { label: 'Nuevo seguidor', detail: { type: 'follow' as const, username: 'Aldarion77' } },
  { label: 'Nueva suscripción', detail: { type: 'subscribe' as const, username: 'mila.exe', tier: '2000' } },
  { label: 'Bits', detail: { type: 'bits' as const, username: 'K3nzo', amount: 500 } },
  { label: 'Raid', detail: { type: 'raid' as const, username: 'sofi_hp', amount: 42 } },
];

/** Dispatches synthetic `twitchAlert` window events — the same event bus real Twitch
 * follows/subs/bits/raids use via TwitchIntegration — so you can preview LiveAlertBox
 * without being live. If Twitch is connected (/twitch-setup) real alerts show here too. */
export default function MintAlertTester() {
  const trigger = (detail: (typeof TEST_ALERTS)[number]['detail']) => {
    window.dispatchEvent(new CustomEvent('twitchAlert', { detail }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#04100f', padding: 24 }}>
      <TwitchBridge />
      <div style={{ width: '100%', maxWidth: 900 }}>
        <LiveAlertBox displayMs={10000} />
      </div>

      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 p-5"
        style={{ background: 'rgba(4,16,15,.95)', border: '2px solid rgba(79,211,171,.4)', minWidth: 380 }}
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {TEST_ALERTS.map((a) => (
            <button
              key={a.label}
              onClick={() => trigger(a.detail)}
              className="px-3 py-2 text-xs font-bold"
              style={{ background: '#4fd3ab', color: '#04100f' }}
            >
              {a.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-center" style={{ color: 'rgba(159,240,214,.6)' }}>
          Cada alerta se muestra ~6s y después desaparece sola. Si tenés Twitch conectado, las reales también aparecen acá.
        </p>
      </div>
    </div>
  );
}
