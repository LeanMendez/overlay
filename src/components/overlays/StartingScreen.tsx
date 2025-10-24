import { useEffect, useState } from 'react';

interface StartingScreenProps {
  language?: 'en' | 'es';
  streamerName?: string;
  startTime?: string;
}

const TEXTS = {
  en: {
    title: 'STARTING SOON',
    subtitle: 'Stream begins in a moment...',
    welcome: 'Welcome to the stream',
  },
  es: {
    title: 'COMENZANDO PRONTO',
    subtitle: 'El stream comienza en un momento...',
    welcome: 'Bienvenidos al stream',
  },
};

export default function StartingScreen({
  language = 'en',
  streamerName,
  startTime,
}: StartingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const text = TEXTS[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));

  // Generate meteors
  const meteors = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    top: Math.random() * 50,
    left: 50 + Math.random() * 50,
    delay: i * 4 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Starfield background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Meteors */}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animation: `meteor 3s linear ${meteor.delay}s infinite`,
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.5)',
          }}
        />
      ))}

      {/* Main planet/moon */}
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30"
        style={{
          animation: 'float-slow 8s ease-in-out infinite',
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.3), inset -20px -20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Craters */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 rounded-full bg-black/20 border border-white/10" />
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-black/20 border border-white/10" />
        <div className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full bg-black/20 border border-white/10" />

        {/* Orbiting satellite/moon */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            animation: 'orbit 20s linear infinite',
            '--orbit-radius': '150px',
          } as React.CSSProperties}
        >
          <div className="w-6 h-6 bg-white rounded-full border-2 border-white/50" />
        </div>
      </div>

      {/* Smaller planet */}
      <div
        className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/30"
        style={{
          animation: 'float-slow 6s ease-in-out infinite 1s',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-black/20 border border-white/10" />
      </div>

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top decorative line */}
        <div
          className={`w-96 h-0.5 bg-white mb-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ animation: 'line-expand 1s ease-out' }}
        />

        {/* Main title */}
        <div className="relative mb-8">
          {/* Pulsing rings behind title */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'pulse-ring 2s ease-out infinite' }}
          >
            <div className="w-96 h-96 border-2 border-white/20 rounded-full" />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'pulse-ring 2s ease-out infinite 0.5s' }}
          >
            <div className="w-96 h-96 border-2 border-white/20 rounded-full" />
          </div>

          <h1
            className="text-8xl font-bold text-white tracking-wider relative z-10"
            style={{
              animation: 'text-reveal 1s ease-out 0.3s both, text-glow 3s ease-in-out infinite',
              letterSpacing: '0.3em',
            }}
          >
            {text.title}
          </h1>

          {/* Geometric details */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rotate-45"
                style={{
                  animation: `sparkle 1.5s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="text-2xl text-white/80 mb-16 tracking-wide"
          style={{
            animation: 'text-reveal 1s ease-out 0.6s both',
          }}
        >
          {text.subtitle}
        </p>

        {/* Info section */}
        <div
          className="relative border-2 border-white/30 p-8 bg-black/50 backdrop-blur-sm"
          style={{
            animation: 'text-reveal 1s ease-out 0.9s both',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-white" />

          <div className="text-center space-y-4">
            {streamerName && (
              <div>
                <div className="text-sm text-white/60 tracking-widest mb-1">
                  {text.welcome.toUpperCase()}
                </div>
                <div className="text-3xl font-bold text-white tracking-wide">
                  {streamerName}
                </div>
              </div>
            )}

            {startTime && (
              <div className="pt-4 border-t border-white/20">
                <div className="text-white/80 text-lg">{startTime}</div>
              </div>
            )}

            {/* Loading indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  style={{
                    animation: `twinkle 1.5s ease-in-out infinite ${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className={`w-96 h-0.5 bg-white mt-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ animation: 'line-expand 1s ease-out 0.5s both' }}
        />
      </div>

      {/* Corner UI elements */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="w-16 h-0.5 bg-white/50" />
        <div className="w-12 h-0.5 bg-white/50" />
        <div className="w-8 h-0.5 bg-white/50" />
      </div>

      <div className="absolute top-8 right-8 flex flex-col gap-2 items-end">
        <div className="w-16 h-0.5 bg-white/50" />
        <div className="w-12 h-0.5 bg-white/50" />
        <div className="w-8 h-0.5 bg-white/50" />
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col gap-2">
        <div className="w-8 h-0.5 bg-white/50" />
        <div className="w-12 h-0.5 bg-white/50" />
        <div className="w-16 h-0.5 bg-white/50" />
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-2 items-end">
        <div className="w-8 h-0.5 bg-white/50" />
        <div className="w-12 h-0.5 bg-white/50" />
        <div className="w-16 h-0.5 bg-white/50" />
      </div>
    </div>
  );
}
