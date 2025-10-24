import { useState } from 'react';
import AlertBox from './AlertBox';
import type { AlertType, AlertData } from './types';

export default function AlertTester() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [nextId, setNextId] = useState(0);

  const triggerAlert = (type: AlertType, username: string, message?: string, amount?: number) => {
    console.log('Triggering alert:', { type, username, message, amount, nextId });
    const newAlert: AlertData = {
      id: nextId,
      type,
      username,
      message,
      amount,
    };
    console.log('New alert created:', newAlert);
    setAlerts((prev) => {
      const updated = [...prev, newAlert];
      console.log('Updated alerts:', updated);
      return updated;
    });
    setNextId((prev) => prev + 1);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const testAlerts = [
    {
      type: 'follow' as AlertType,
      username: 'GamerPro123',
      label: 'Test Follow',
    },
    {
      type: 'subscribe' as AlertType,
      username: 'StreamFan456',
      message: 'Love your streams!',
      label: 'Test Subscribe',
    },
    {
      type: 'donation' as AlertType,
      username: 'GenerousViewer',
      message: 'Keep up the great content!',
      amount: 10.00,
      label: 'Test Donation',
    },
    {
      type: 'raid' as AlertType,
      username: 'FriendlyStreamer',
      message: 'Sending 50 raiders your way!',
      label: 'Test Raid',
    },
    {
      type: 'bits' as AlertType,
      username: 'BitDonor',
      amount: 500,
      label: 'Test Bits',
    },
  ];

  return (
    <>
      {/* Alert display */}
      {alerts.map((alert) => (
        <AlertBox
          key={alert.id}
          type={alert.type}
          username={alert.username}
          message={alert.message}
          amount={alert.amount}
          duration={5000}
          onComplete={() => removeAlert(alert.id)}
        />
      ))}

      {/* Control panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 border-2 border-white/30 p-6 rounded backdrop-blur-sm z-50 pointer-events-auto">
        <h2 className="text-white text-xl font-bold mb-2 text-center">Alert Tester</h2>
        <div className="text-center mb-4">
          <span className="text-white/70 text-sm">Active alerts: </span>
          <span className="text-white font-bold">{alerts.length}</span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {testAlerts.map((test, index) => (
            <button
              key={index}
              onClick={() => triggerAlert(test.type, test.username, test.message, test.amount)}
              className="px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200 text-sm font-medium pointer-events-auto cursor-pointer"
            >
              {test.label}
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs text-center">
            Click buttons to test different alert types
          </p>
          <p className="text-white/40 text-xs text-center mt-1">
            Check browser console for debug info
          </p>
        </div>
      </div>
    </>
  );
}
