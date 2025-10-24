import { useState } from 'react';
import GoalTrackerCompact from './GoalTrackerCompact';
import type { GoalType } from './types';

export default function GoalTrackerCompactTester() {
  const [current, setCurrent] = useState(742);
  const [target, setTarget] = useState(1000);
  const [goalType, setGoalType] = useState<GoalType>('followers');
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'>('top-center');
  const [showPercentage, setShowPercentage] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Goal Tracker Compact Tester</h1>
        <p className="text-white/60 mb-6 text-sm">Versión compacta para usar durante gameplay</p>

        {/* Preview area */}
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg mb-6 relative overflow-hidden" style={{ height: '400px' }}>
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
            Preview Area (1920×1080 simulado)
          </div>
          <GoalTrackerCompact
            goalType={goalType}
            current={current}
            target={target}
            position={position}
            showPercentage={showPercentage}
          />
        </div>

        {/* Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          {/* Goal Type */}
          <div>
            <label className="block text-white/90 text-sm font-bold mb-2">Goal Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['followers', 'subscribers', 'donations', 'custom'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGoalType(type)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    goalType === type
                      ? 'bg-white text-black'
                      : 'bg-gray-700 text-white/70 hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-white/90 text-sm font-bold mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    position === pos
                      ? 'bg-white text-black'
                      : 'bg-gray-700 text-white/70 hover:bg-gray-600'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Show Percentage Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPercentage}
                onChange={(e) => setShowPercentage(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white/90 text-sm font-medium">Show Percentage</span>
            </label>
          </div>

          {/* Progress Controls */}
          <div>
            <label className="block text-white/90 text-sm font-bold mb-2">
              Progress: {current} / {target}
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={target}
                value={current}
                onChange={(e) => setCurrent(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrent(Math.max(0, current - 10))}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  -10
                </button>
                <button
                  onClick={() => setCurrent(Math.min(target, current + 10))}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => setCurrent(Math.min(target, current + 50))}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  +50
                </button>
                <button
                  onClick={() => setCurrent(target)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Complete Goal
                </button>
              </div>
            </div>
          </div>

          {/* Target Controls */}
          <div>
            <label className="block text-white/90 text-sm font-bold mb-2">Target Goal</label>
            <div className="flex gap-2">
              {[500, 1000, 5000, 10000].map((value) => (
                <button
                  key={value}
                  onClick={() => setTarget(value)}
                  className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    target === value
                      ? 'bg-white text-black'
                      : 'bg-gray-700 text-white/70 hover:bg-gray-600'
                  }`}
                >
                  {value.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-white/60 text-xs">
              💡 Esta versión compacta es ideal para usar durante gameplay. Ocupa menos espacio y tiene un diseño más discreto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
