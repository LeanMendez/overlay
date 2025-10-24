import { useEffect, useState } from 'react';
import type { ChatMessage, ChatOverlayProps } from './types';

export default function ChatOverlay({
  maxMessages = 10,
  messageLifetime = 15000,
  position = 'right',
  width = 400,
  showTimestamp = false,
}: ChatOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Listen for new chat messages
    const handleNewMessage = (event: CustomEvent<ChatMessage>) => {
      const newMessage = event.detail;
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        // Keep only the last N messages
        return updated.slice(-maxMessages);
      });

      // Auto-remove message after lifetime
      if (messageLifetime > 0) {
        setTimeout(() => {
          setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
        }, messageLifetime);
      }
    };

    window.addEventListener('chatMessage', handleNewMessage as EventListener);

    return () => {
      window.removeEventListener('chatMessage', handleNewMessage as EventListener);
    };
  }, [maxMessages, messageLifetime]);

  const positionClasses = {
    left: 'left-8 top-24',
    right: 'right-8 top-24',
    bottom: 'bottom-8 left-1/2 -translate-x-1/2',
  };

  const isBottomPosition = position === 'bottom';

  return (
    <div
      className={`fixed ${positionClasses[position]} flex flex-col gap-3 pointer-events-none`}
      style={{ width: isBottomPosition ? 'auto' : `${width}px`, maxWidth: '90vw' }}
    >
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className="relative"
          style={{
            animation: isBottomPosition
              ? 'slide-in-up 0.3s ease-out'
              : 'slide-in-right 0.3s ease-out',
          }}
        >
          {/* Glassmorphism container */}
          <div
            className="relative overflow-hidden backdrop-blur-md shadow-lg"
            style={{
              background: msg.highlighted
                ? 'rgba(255, 215, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: msg.highlighted
                ? '1px solid rgba(255, 215, 0, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              animation: msg.highlighted ? 'golden-glow 3s ease-in-out infinite' : undefined,
            }}
          >
            {/* Subtle shine effect */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: msg.highlighted
                  ? 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.15) 50%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />

            {/* Content */}
            <div className="relative p-4">
              {/* Top decorative line */}
              <div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent"
                style={{
                  backgroundImage: msg.highlighted
                    ? 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)'
                    : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
              />

              {/* Highlighted indicator (top-left corner) */}
              {msg.highlighted && (
                <div className="absolute top-2 left-2">
                  <div
                    className="w-2 h-2 bg-yellow-300/60 rounded-full"
                    style={{
                      boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                      animation: 'twinkle 2s ease-in-out infinite',
                    }}
                  />
                </div>
              )}

              {/* Username row */}
              <div className="flex items-center gap-2 mb-2">
                {/* Badges (if any) */}
                {msg.badges && msg.badges.length > 0 && (
                  <div className="flex gap-1">
                    {msg.badges.map((badge, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-white/20 border border-white/40 rounded-sm flex items-center justify-center text-xs"
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                )}

                {/* Username */}
                <span
                  className="font-bold text-sm"
                  style={{
                    color: msg.color || '#ffffff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  }}
                >
                  {msg.username}
                </span>

                {/* Hollow Knight inspired detail */}
                <div className="flex-1 flex justify-end gap-1">
                  <div className="w-1 h-1 bg-white/40 rotate-45" />
                  <div className="w-1 h-1 bg-white/30 rotate-45" />
                </div>
              </div>

              {/* Message text */}
              <div className="text-white/95 text-sm leading-relaxed break-words">
                {msg.message}
              </div>

              {/* Timestamp (optional) */}
              {showTimestamp && (
                <div className="text-white/40 text-xs mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              )}

              {/* Bottom decorative corner */}
              <div className="absolute bottom-2 right-2 w-3 h-3">
                <div className="absolute bottom-0 right-0 w-full h-px bg-white/20" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-white/20" />
              </div>
            </div>

            {/* Outer glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
              }}
            />
          </div>

          {/* Connecting line to next message (subtle) */}
          {index < messages.length - 1 && !isBottomPosition && (
            <div className="absolute left-4 -bottom-3 w-px h-3 bg-gradient-to-b from-white/20 to-transparent" />
          )}
        </div>
      ))}

      {/* Empty state indicator (when no messages) */}
      {messages.length === 0 && (
        <div className="text-white/30 text-sm text-center italic">
          No messages yet...
        </div>
      )}
    </div>
  );
}
