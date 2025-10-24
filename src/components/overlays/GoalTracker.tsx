import { useEffect, useState } from 'react';
import type { GoalTrackerProps, GoalType } from './types';

const GOAL_PRESETS = {
  followers: { title: 'FOLLOWERS', icon: '⭐' },
  subscribers: { title: 'SUBSCRIBERS', icon: '💎' },
  donations: { title: 'DONATIONS', icon: '💰' },
  custom: { title: 'GOAL', icon: '🎯' },
};

export default function GoalTracker({
  goalType = 'custom',
  title,
  current,
  target,
  icon,
  position = 'top-right',
  showPercentage = true,
}: GoalTrackerProps) {
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
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
  };

  // Generate confetti particles for celebration
  const confettiParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 0.5,
    color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none`}
      style={{
        animation: mounted ? 'fade-in 0.5s ease-out' : undefined,
      }}
    >
      {/* Main container with glassmorphism */}
      <div
        className={`relative overflow-hidden backdrop-blur-md bg-black/60 border-2 border-white/30 shadow-xl transition-all duration-300 ${
          isCompleted ? 'border-green-400/50' : ''
        }`}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          minWidth: '300px',
          animation: isCompleted ? 'celebrate 0.6s ease-in-out' : undefined,
        }}
      >
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-1 bg-white"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
        </div>

        {/* Celebration confetti */}
        {showCelebration && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full"
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

        {/* Content */}
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}>
                {finalIcon}
              </span>
              <span className="text-white/90 text-sm font-bold tracking-widest">
                {finalTitle}
              </span>
            </div>

            {/* Completion badge */}
            {isCompleted && (
              <div className="bg-green-400/20 border border-green-400/40 px-2 py-1 rounded-sm">
                <span className="text-green-300 text-xs font-bold">✓ COMPLETE</span>
              </div>
            )}
          </div>

          {/* Progress numbers */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span
                className="text-3xl font-bold text-white"
                style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.5)',
                  animation: displayCurrent !== current ? 'number-pop 0.3s ease-out' : undefined,
                }}
              >
                {displayCurrent.toLocaleString()}
              </span>
              <span className="text-white/50 text-lg">/ {target.toLocaleString()}</span>
            </div>

            {showPercentage && (
              <div className="text-white/70 text-sm font-bold">
                {percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Progress bar container */}
          <div className="relative">
            {/* Background bar */}
            <div className="h-3 bg-white/10 border border-white/20 overflow-hidden relative">
              {/* Progress fill */}
              <div
                className="h-full bg-gradient-to-r from-white/80 to-white/60 relative overflow-hidden transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                }}
              >
                {/* Animated shine on progress bar */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Milestone markers */}
              {[25, 50, 75].map((milestone) => (
                <div
                  key={milestone}
                  className="absolute top-0 bottom-0 w-px bg-white/30"
                  style={{ left: `${milestone}%` }}
                />
              ))}
            </div>

            {/* Hollow Knight inspired decorative elements */}
            <div className="absolute -bottom-3 left-0 flex gap-1">
              <div className="w-1 h-1 bg-white/40 rotate-45" />
              <div className="w-1 h-1 bg-white/30 rotate-45" />
            </div>
            <div className="absolute -bottom-3 right-0 flex gap-1">
              <div className="w-1 h-1 bg-white/30 rotate-45" />
              <div className="w-1 h-1 bg-white/40 rotate-45" />
            </div>
          </div>

          {/* Remaining to goal */}
          {!isCompleted && (
            <div className="mt-3 text-center">
              <span className="text-white/50 text-xs">
                {(target - current).toLocaleString()} to go
              </span>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  );
}
