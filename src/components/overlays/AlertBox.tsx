import { useEffect, useState } from 'react';
import { ALERT_CONFIG } from './types';
import type { AlertBoxProps } from './types';

export default function AlertBox({
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
    console.log('AlertBox mounted:', { type, username, message, amount });

    // Trigger entrance animation
    const enterTimer = setTimeout(() => {
      console.log('Setting visible true');
      setIsVisible(true);
    }, 100);

    // Trigger exit animation
    const exitTimer = setTimeout(() => {
      console.log('Setting exiting true');
      setIsExiting(true);
    }, duration - 800);

    // Complete and cleanup
    const completeTimer = setTimeout(() => {
      console.log('Alert complete, calling onComplete');
      onComplete?.();
    }, duration);

    return () => {
      console.log('AlertBox unmounting');
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete, type, username, message, amount]);

  // Generate random particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: (Math.random() - 0.5) * 100,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative ${
          isExiting ? 'animate-[slide-out_0.8s_ease-in-out_forwards]' : 'animate-[slide-in-bounce_0.8s_ease-out]'
        }`}
        style={{
          animation: isExiting
            ? 'slide-out 0.8s ease-in-out forwards'
            : 'slide-in-bounce 0.8s ease-out',
        }}
      >
        {/* Main alert container */}
        <div
          className="relative bg-black/80 border-4 border-white backdrop-blur-sm"
          style={{
            minWidth: '600px',
            animation: 'intense-glow 2s ease-in-out infinite',
          }}
        >
          {/* Animated corner accents */}
          <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-white"></div>
          <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-white"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-white"></div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-white"></div>

          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

          {/* Content */}
          <div className="relative p-8 flex items-center gap-6">
            {/* Icon with glow */}
            <div className="relative">
              <div
                className="text-8xl font-bold text-white"
                style={{
                  animation: 'text-glow 1.5s ease-in-out infinite',
                  filter: `drop-shadow(0 0 20px ${config.accentColor})`,
                  color: 'white',
                  textShadow: `0 0 10px ${config.accentColor}`,
                }}
              >
                {config.icon}
              </div>

              {/* Spinning ring around icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-28 h-28 border-2 border-white/30 rounded-full"
                  style={{
                    animation: 'spin 3s linear infinite',
                  }}
                ></div>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1">
              <div
                className="text-sm font-bold text-white/80 tracking-widest mb-2"
                style={{ letterSpacing: '0.3em' }}
              >
                {config.title}
              </div>
              <div
                className="text-4xl font-bold text-white mb-2"
                style={{
                  animation: 'text-glow 2s ease-in-out infinite',
                }}
              >
                {username}
              </div>
              {message && (
                <div className="text-lg text-white/90 italic">
                  "{message}"
                </div>
              )}
              {amount !== undefined && (
                <div className="text-2xl font-bold text-white mt-2">
                  ${amount.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Scanning line effect */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                animation: 'scan-vertical 2s ease-in-out infinite',
              }}
            ></div>
          </div>

          {/* Geometric detail - Hollow Knight inspired */}
          <div className="absolute top-4 right-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/40 rotate-45"
                style={{
                  animation: `sparkle 1.5s ease-in-out infinite ${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: '50%',
              bottom: '50%',
              animation: `particle-float ${particle.duration}s ease-out ${particle.delay}s infinite`,
              '--float-x': `${particle.x}px`,
            } as React.CSSProperties}
          ></div>
        ))}

        {/* Additional sparkles */}
        <div className="absolute -top-4 left-1/4 w-3 h-3">
          <div
            className="w-full h-full bg-white rotate-45"
            style={{ animation: 'sparkle 1s ease-in-out infinite 0.2s' }}
          ></div>
        </div>
        <div className="absolute -bottom-4 right-1/4 w-3 h-3">
          <div
            className="w-full h-full bg-white rotate-45"
            style={{ animation: 'sparkle 1s ease-in-out infinite 0.5s' }}
          ></div>
        </div>
        <div className="absolute top-1/2 -right-6 w-2 h-2">
          <div
            className="w-full h-full bg-white rotate-45"
            style={{ animation: 'sparkle 1s ease-in-out infinite 0.8s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
