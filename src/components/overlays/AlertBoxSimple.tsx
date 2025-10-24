import { useEffect, useState } from 'react';

export type AlertType = 'follow' | 'subscribe' | 'donation' | 'raid' | 'bits';

interface AlertBoxProps {
  type: AlertType;
  username: string;
  message?: string;
  amount?: number;
  duration?: number;
  onComplete?: () => void;
}

const ALERT_CONFIG = {
  follow: { title: 'NEW FOLLOWER', icon: '★' },
  subscribe: { title: 'NEW SUBSCRIBER', icon: '◆' },
  donation: { title: 'DONATION', icon: '◈' },
  raid: { title: 'RAID', icon: '⚡' },
  bits: { title: 'BITS', icon: '◇' },
};

export default function AlertBoxSimple({
  type,
  username,
  message,
  amount,
  duration = 5000,
  onComplete,
}: AlertBoxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const config = ALERT_CONFIG[type];

  useEffect(() => {
    console.log('🚀 AlertBox mounted:', { type, username });

    const enterTimer = setTimeout(() => {
      console.log('✅ Setting visible');
      setIsVisible(true);
    }, 100);

    const exitTimer = setTimeout(() => {
      console.log('👋 Exiting');
      setIsExiting(true);
    }, duration - 800);

    const completeTimer = setTimeout(() => {
      console.log('🏁 Complete');
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete, type, username]);

  console.log('🎨 Rendering AlertBox:', { isVisible, isExiting });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // Debug background
      }}
    >
      <div
        className="relative bg-black border-4 border-white p-8 min-w-[600px]"
        style={{
          transform: isExiting
            ? 'translateX(150%)'
            : isVisible
              ? 'translateX(0)'
              : 'translateX(-150%)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s ease-out',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="flex items-center gap-6">
          <div className="text-6xl">{config.icon}</div>
          <div>
            <div className="text-sm text-white/70 mb-1">{config.title}</div>
            <div className="text-3xl font-bold text-white">{username}</div>
            {message && <div className="text-white/80 italic mt-1">"{message}"</div>}
            {amount !== undefined && (
              <div className="text-xl font-bold text-white mt-1">${amount.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
