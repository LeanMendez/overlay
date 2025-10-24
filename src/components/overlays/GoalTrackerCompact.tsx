import { useEffect, useState } from 'react';
import type { GoalTrackerCompactProps, GoalType } from './types';

const GOAL_PRESETS = {
  followers: { title: 'FOLLOWERS', icon: '⭐' },
  subscribers: { title: 'SUBS', icon: '💎' },
  donations: { title: 'DONATIONS', icon: '💰' },
  custom: { title: 'GOAL', icon: '🎯' },
};

export default function GoalTrackerCompact({
  goalType = 'custom',
  title,
  current,
  target,
  icon,
  position = 'top-center',
  showPercentage = false,
}: GoalTrackerCompactProps) {
  const [mounted, setMounted] = useState(false);
  const [displayCurrent, setDisplayCurrent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const preset = GOAL_PRESETS[goalType];
  const finalTitle = title || preset.title;
  const finalIcon = icon || preset.icon;
  const percentage = Math.min((current / target) * 100, 100);
  const wasCompleted = current >= target;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate number counting
  useEffect(() => {
    if (displayCurrent === current) return;

    const step = current > displayCurrent ? 1 : -1;
    const duration = 1000;
    const steps = Math.abs(current - displayCurrent);
    const interval = duration / steps;

    const timer = setInterval(() => {
      setDisplayCurrent((prev) => {
        const next = prev + step;
        if ((step > 0 && next >= current) || (step < 0 && next <= current)) {
          clearInterval(timer);
          return current;
        }
        return next;
      });
    }, Math.max(interval, 20));

    return () => clearInterval(timer);
  }, [current, displayCurrent]);

  // Check for completion
  useEffect(() => {
    if (wasCompleted && !isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [wasCompleted, isCompleted]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Generate confetti particles for celebration (fewer for compact)
  const confettiParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    delay: Math.random() * 0.3,
    color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none`}
      style={{
        animation: mounted ? 'fade-in 0.5s ease-out' : undefined,
      }}
    >
      {/* Main container with glassmorphism - COMPACT */}
      <div
        className={`relative overflow-hidden backdrop-blur-md bg-black/70 border border-white/30 shadow-lg transition-all duration-300 ${
          isCompleted ? 'border-green-400/50' : ''
        }`}
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          minWidth: '200px',
          maxWidth: '280px',
          animation: isCompleted ? 'celebrate 0.6s ease-in-out' : undefined,
        }}
      >
        {/* Corner decorations - smaller */}
        <div className="absolute -top-px -left-px w-4 h-4">
          <div className="absolute top-0 left-0 w-full h-px bg-white/80"></div>
          <div className="absolute top-0 left-0 w-px h-full bg-white/80"></div>
        </div>
        <div className="absolute -top-px -right-px w-4 h-4">
          <div className="absolute top-0 right-0 w-full h-px bg-white/80"></div>
          <div className="absolute top-0 right-0 w-px h-full bg-white/80"></div>
        </div>

        {/* Celebration confetti */}
        {showCelebration && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  bottom: '50%',
                  backgroundColor: particle.color,
                  animation: `confetti 2s ease-out ${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content - COMPACT */}
        <div className="relative px-3 py-2">
          {/* Header - inline and compact */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>
                {finalIcon}
              </span>
              <span className="text-white/90 text-[10px] font-bold tracking-wider uppercase">
                {finalTitle}
              </span>
            </div>

            {/* Completion badge - smaller */}
            {isCompleted && (
              <div className="bg-green-400/20 border border-green-400/40 px-1.5 py-0.5 rounded-sm">
                <span className="text-green-300 text-[9px] font-bold">✓</span>
              </div>
            )}
          </div>

          {/* Progress numbers - inline and compact */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1">
              <span
                className="text-lg font-bold text-white leading-none"
                style={{
                  textShadow: '0 0 8px rgba(255,255,255,0.4)',
                  animation: displayCurrent !== current ? 'number-pop 0.3s ease-out' : undefined,
                }}
              >
                {displayCurrent.toLocaleString()}
              </span>
              <span className="text-white/50 text-xs leading-none">/ {target.toLocaleString()}</span>
            </div>

            {showPercentage && (
              <div className="text-white/70 text-[10px] font-bold">
                {percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Progress bar container - thinner */}
          <div className="relative">
            {/* Background bar */}
            <div className="h-1.5 bg-white/10 border border-white/20 overflow-hidden relative rounded-sm">
              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-white/80 to-white/60 relative overflow-hidden transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                }}
              >
                {/* Animated shine on progress bar */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Milestone markers - only 50% for compact */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white/20"
                style={{ left: '50%' }}
              />
            </div>
          </div>

          {/* Remaining to goal - smaller text, no margin */}
          {!isCompleted && current < target && (
            <div className="mt-1 text-center">
              <span className="text-white/40 text-[9px]">
                {(target - current).toLocaleString()} to go
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
