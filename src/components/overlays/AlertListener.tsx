import { useState, useEffect } from 'react';
import AlertBox from './AlertBox';
import type { AlertType, AlertData } from './types';

export default function AlertListener() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Listen for custom events that can be triggered by external systems
    const handleCustomAlert = (event: CustomEvent) => {
      const { type, username, message, amount } = event.detail;
      triggerAlert(type, username, message, amount);
    };

    window.addEventListener('triggerAlert', handleCustomAlert as EventListener);

    // Listen for postMessage events (from StreamElements iframe)
    const handlePostMessage = (event: MessageEvent) => {
      console.log('📩 Message received:', event.data);
      if (event.data.type === 'triggerAlert' && event.data.detail) {
        console.log('🔔 Triggering alert from message:', event.data.detail);
        const { type, username, message, amount } = event.data.detail;
        triggerAlert(type, username, message, amount);
      }
    };
    window.addEventListener('message', handlePostMessage);

    // Also check URL parameters for testing
    const params = new URLSearchParams(window.location.search);
    const testType = params.get('test');

    if (testType) {
      // Trigger a test alert after a short delay
      setTimeout(() => {
        switch (testType) {
          case 'follow':
            triggerAlert('follow', 'TestFollower123');
            break;
          case 'subscribe':
            triggerAlert('subscribe', 'NewSubscriber', 'Thanks for the stream!');
            break;
          case 'donation':
            triggerAlert('donation', 'GenerousViewer', 'Keep it up!', 25.00);
            break;
          case 'raid':
            triggerAlert('raid', 'FriendStreamer', 'Bringing 100 viewers!');
            break;
          case 'bits':
            triggerAlert('bits', 'BitsDonor', undefined, 1000);
            break;
        }
      }, 500);
    }

    return () => {
      window.removeEventListener('triggerAlert', handleCustomAlert as EventListener);
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  const triggerAlert = (type: AlertType, username: string, message?: string, amount?: number) => {
    const newAlert: AlertData = {
      id: nextId,
      type,
      username,
      message,
      amount,
    };
    setAlerts((prev) => [...prev, newAlert]);
    setNextId((prev) => prev + 1);
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <>
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
    </>
  );
}
