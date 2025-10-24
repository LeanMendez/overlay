import { useState } from 'react';
import GoalTracker from './GoalTracker';
import type { GoalType } from './types';

export default function GoalTrackerTester() {
  const [goalType, setGoalType] = useState<GoalType>('followers');
  const [current, setCurrent] = useState(742);
  const [target, setTarget] = useState(1000);
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-right');
  const [showPercentage, setShowPercentage] = useState(true);

  const goalTypes: { value: GoalType; label: string; icon: string }[] = [
    { value: 'followers', label: 'Followers', icon: '⭐' },
    { value: 'subscribers', label: 'Subscribers', icon: '💎' },
    { value: 'donations', label: 'Donations', icon: '💰' },
    { value: 'custom', label: 'Custom Goal', icon: '🎯' },
  ];

  const positions = [
    { value: 'top-left' as const, label: 'Top Left' },
    { value: 'top-right' as const, label: 'Top Right' },
    { value: 'bottom-left' as const, label: 'Bottom Left' },
    { value: 'bottom-right' as const, label: 'Bottom Right' },
  ];

  return (
    <>
      {/* Goal Tracker */}
      <GoalTracker
        goalType={goalType}
        current={current}
        target={target}
        position={position}
        showPercentage={showPercentage}
      />

      {/* Control panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 border-2 border-white/30 p-6 backdrop-blur-sm z-50 pointer-events-auto max-w-2xl w-full">
        <h2 className="text-white text-xl font-bold mb-4 text-center">Goal Tracker Tester</h2>

        {/* Goal Type */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">Goal Type</label>
          <div className="grid grid-cols-2 gap-2">
            {goalTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setGoalType(type.value)}
                className={`flex items-center justify-center gap-2 px-4 py-2 border text-sm transition-all ${
                  goalType === type.value
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">Position</label>
          <div className="grid grid-cols-2 gap-2">
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`px-4 py-2 border text-sm transition-all ${
                  position === pos.value
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Value */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">
            Current: {current.toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max={target}
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Target Value */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">
            Target: {target.toLocaleString()}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTarget(500)}
              className="flex-1 px-3 py-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 text-xs"
            >
              500
            </button>
            <button
              onClick={() => setTarget(1000)}
              className="flex-1 px-3 py-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 text-xs"
            >
              1K
            </button>
            <button
              onClick={() => setTarget(5000)}
              className="flex-1 px-3 py-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 text-xs"
            >
              5K
            </button>
            <button
              onClick={() => setTarget(10000)}
              className="flex-1 px-3 py-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 text-xs"
            >
              10K
            </button>
          </div>
        </div>

        {/* Toggle percentage */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPercentage}
              onChange={(e) => setShowPercentage(e.target.checked)}
              className="w-4 h-4"
            />
            Show Percentage
          </label>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrent((prev) => Math.min(prev + 10, target))}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all text-sm font-medium"
          >
            + 10
          </button>
          <button
            onClick={() => setCurrent((prev) => Math.min(prev + 50, target))}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all text-sm font-medium"
          >
            + 50
          </button>
          <button
            onClick={() => setCurrent(target)}
            className="flex-1 px-4 py-2 bg-green-600/20 border border-green-500/40 text-green-200 hover:bg-green-600/30 transition-all text-sm font-medium"
          >
            🎉 Complete Goal
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs text-center mb-1">
            Progress: {((current / target) * 100).toFixed(1)}%
          </p>
          <p className="text-white/40 text-xs text-center">
            {current >= target ? '✨ Goal reached! Watch the celebration!' : `${target - current} to go`}
          </p>
        </div>
      </div>
    </>
  );
}
