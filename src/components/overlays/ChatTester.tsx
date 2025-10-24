import { useState } from 'react';
import ChatOverlay from './ChatOverlay';
import type { ChatMessage } from './types';

const SAMPLE_MESSAGES = [
  { username: 'GamerPro123', message: 'Nice shot! 🎯', color: '#FF6B6B' },
  { username: 'StreamFan', message: 'GGWP! That was an amazing play, I learned so much watching you!', color: '#4ECDC4' },
  { username: 'CodeMaster', message: 'That was insane! How many hours have you been practicing this strategy?', color: '#95E1D3' },
  { username: 'Viewer42', message: 'How did you do that? Can you explain your thought process?', color: '#F38181' },
  { username: 'ChatBot', message: 'Welcome to the stream! Remember to follow if you enjoy the content!', color: '#AA96DA', badges: ['🤖'] },
  { username: 'Subscriber', message: 'Loving the content! Been watching for months and finally subscribed!', color: '#FCBAD3', badges: ['⭐'] },
  { username: 'Moderator', message: 'Keep it friendly everyone, let\'s maintain a positive atmosphere in chat!', color: '#A8D8EA', badges: ['🛡️'] },
  { username: 'VIPViewer', message: 'First time watching, this is great! The production quality is amazing!', color: '#FFD93D', badges: ['💎'] },
  { username: 'NewFollower', message: 'Just followed! 🎉 Can\'t wait to see more streams like this!', color: '#6BCB77' },
  { username: 'RegularViewer', message: "Let's go! Best stream on the platform, been here since day one!", color: '#FD7272' },
  { username: 'GenerousDonor', message: 'Keep up the amazing work! You deserve every bit of success! 💰', color: '#FFD700', badges: ['💎'], highlighted: true },
  { username: 'NewSub', message: 'Just subscribed! Your content has helped me improve so much, thank you!', color: '#DA70D6', badges: ['⭐'], highlighted: true },
  { username: 'Supporter', message: 'This stream always brightens my day, thanks for everything you do for the community!', color: '#FF6347', highlighted: true },
  { username: 'CheerLeader', message: 'Cheer100 Amazing gameplay as always! You\'re the best!', color: '#9370DB', badges: ['💜'], highlighted: true },
];

const POSITIONS = [
  { value: 'right' as const, label: 'Right Side' },
  { value: 'left' as const, label: 'Left Side' },
  { value: 'bottom' as const, label: 'Bottom' },
];

export default function ChatTester() {
  const [position, setPosition] = useState<'left' | 'right' | 'bottom'>('right');
  const [width, setWidth] = useState(400);
  const [maxMessages, setMaxMessages] = useState(10);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [autoSend, setAutoSend] = useState(false);

  const sendRandomMessage = () => {
    const sample = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      username: sample.username,
      message: sample.message,
      timestamp: Date.now(),
      color: sample.color,
      badges: sample.badges,
      highlighted: sample.highlighted,
    };

    window.dispatchEvent(new CustomEvent('chatMessage', { detail: message }));
  };

  const sendTestSequence = () => {
    SAMPLE_MESSAGES.forEach((sample, index) => {
      setTimeout(() => {
        const message: ChatMessage = {
          id: `msg-${Date.now()}-${index}`,
          username: sample.username,
          message: sample.message,
          timestamp: Date.now(),
          color: sample.color,
          badges: sample.badges,
          highlighted: sample.highlighted,
        };
        window.dispatchEvent(new CustomEvent('chatMessage', { detail: message }));
      }, index * 800);
    });
  };

  // Auto-send messages
  useState(() => {
    if (!autoSend) return;

    const interval = setInterval(() => {
      sendRandomMessage();
    }, 3000);

    return () => clearInterval(interval);
  });

  return (
    <>
      {/* Chat overlay */}
      <ChatOverlay
        position={position}
        width={width}
        maxMessages={maxMessages}
        messageLifetime={15000}
        showTimestamp={showTimestamp}
      />

      {/* Control panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 border-2 border-white/30 p-6 backdrop-blur-sm z-50 pointer-events-auto max-w-2xl w-full">
        <h2 className="text-white text-xl font-bold mb-4 text-center">Chat Overlay Tester</h2>

        {/* Position selector */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">Position</label>
          <div className="flex gap-2">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`flex-1 px-4 py-2 border text-sm transition-all ${
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

        {/* Width slider (only for side positions) */}
        {position !== 'bottom' && (
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">
              Width: {width}px
            </label>
            <input
              type="range"
              min="300"
              max="600"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Max messages */}
        <div className="mb-4">
          <label className="text-white/70 text-sm mb-2 block">
            Max Messages: {maxMessages}
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={maxMessages}
            onChange={(e) => setMaxMessages(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Toggles */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={(e) => setShowTimestamp(e.target.checked)}
              className="w-4 h-4"
            />
            Show Timestamp
          </label>
          <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoSend}
              onChange={(e) => setAutoSend(e.target.checked)}
              className="w-4 h-4"
            />
            Auto-send messages
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={sendRandomMessage}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all text-sm font-medium"
          >
            Send Random Message
          </button>
          <button
            onClick={sendTestSequence}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all text-sm font-medium"
          >
            Send Test Sequence
          </button>
        </div>

        {/* Highlighted message button */}
        <button
          onClick={() => {
            const highlightedSamples = SAMPLE_MESSAGES.filter(m => m.highlighted);
            const sample = highlightedSamples[Math.floor(Math.random() * highlightedSamples.length)];
            const message: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random()}`,
              username: sample.username,
              message: sample.message,
              timestamp: Date.now(),
              color: sample.color,
              badges: sample.badges,
              highlighted: true,
            };
            window.dispatchEvent(new CustomEvent('chatMessage', { detail: message }));
          }}
          className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/40 text-yellow-200 hover:from-yellow-600/30 hover:to-yellow-500/30 transition-all text-sm font-medium"
          style={{
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
          }}
        >
          ✨ Send Highlighted Message (Donation/Sub)
        </button>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs text-center mb-1">
            Messages auto-fade after 15 seconds
          </p>
          <p className="text-yellow-200/60 text-xs text-center">
            💫 Highlighted messages have a subtle golden glow
          </p>
        </div>
      </div>
    </>
  );
}
