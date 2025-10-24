import { useEffect, useState } from 'react';

interface BRBScreenProps {
  language?: 'en' | 'es';
  message?: string;
}

const TEXTS = {
  en: {
    title: 'BE RIGHT BACK',
    subtitle: "Taking a quick break, don't go anywhere!",
    default: 'Stream will resume shortly',
  },
  es: {
    title: 'YA VUELVO',
    subtitle: '¡Tomando un descanso rápido, no te vayas!',
    default: 'El stream continúa en breve',
  },
};

export default function BRBScreen({
  language = 'en',
  message,
}: BRBScreenProps) {
  const [mounted, setMounted] = useState(false);
  const text = TEXTS[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stars
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 3,
  }));

  // Saturn-like rings
  const rings = [
    { size: 400, opacity: 0.3, thickness: 4 },
    { size: 450, opacity: 0.2, thickness: 3 },
    { size: 500, opacity: 0.15, thickness: 2 },
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Starfield */}
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

      {/* Central ringed planet */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Rings (behind) */}
        {rings.map((ring, i) => (
          <div
            key={`ring-back-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-white/10"
            style={{
              width: `${ring.size}px`,
              height: `${ring.size * 0.2}px`,
              borderWidth: `${ring.thickness}px`,
              opacity: ring.opacity,
              transform: 'translate(-50%, -50%) rotateX(75deg)',
              animation: 'spin 40s linear infinite',
            }}
          />
        ))}

        {/* Main planet */}
        <div
          className="relative w-72 h-72 rounded-full bg-gradient-to-br from-white/25 to-white/5 border-4 border-white/40"
          style={{
            animation: 'float-slow 10s ease-in-out infinite',
            boxShadow:
              '0 0 80px rgba(255, 255, 255, 0.4), inset -30px -30px 60px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Planet surface details */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-white/10 blur-sm" />
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-black/30 blur-sm" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-white/5 blur-sm" />

          {/* Hollow Knight inspired geometric pattern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3 justify-center">
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    className="w-3 h-3 bg-white/30 rotate-45 border border-white/50"
                    style={{
                      animation: `sparkle 2s ease-in-out infinite ${(i + j) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Rings (front) */}
        {rings.slice(0, 1).map((ring, i) => (
          <div
            key={`ring-front-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-white/20"
            style={{
              width: `${ring.size}px`,
              height: `${ring.size * 0.2}px`,
              borderWidth: `${ring.thickness}px`,
              opacity: ring.opacity * 1.5,
              transform: 'translate(-50%, -50%) rotateX(75deg)',
              animation: 'spin 40s linear infinite',
            }}
          />
        ))}

        {/* Orbiting small moons */}
        <div
          style={{
            animation: 'orbit 15s linear infinite',
            '--orbit-radius': '200px',
          } as React.CSSProperties}
        >
          <div className="w-8 h-8 bg-white/80 rounded-full border-2 border-white" />
        </div>
        <div
          style={{
            animation: 'orbit 25s linear infinite reverse',
            '--orbit-radius': '250px',
          } as React.CSSProperties}
        >
          <div className="w-6 h-6 bg-white/60 rounded-full border-2 border-white/70" />
        </div>
      </div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32">
        <div className="relative">
          {/* Glowing background */}
          <div
            className="absolute inset-0 blur-3xl bg-white/10"
            style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
          />

          {/* Main title */}
          <h1
            className="text-9xl font-bold text-white tracking-wider relative z-10 text-center mb-6"
            style={{
              animation: 'text-glow 2s ease-in-out infinite',
              letterSpacing: '0.4em',
            }}
          >
            {text.title}
          </h1>

          {/* Decorative lines around title */}
          <div className="absolute top-1/2 -left-32 w-24 h-1 bg-white/60" />
          <div className="absolute top-1/2 -right-32 w-24 h-1 bg-white/60" />
        </div>

        {/* Subtitle */}
        <p
          className="text-2xl text-white/80 tracking-wide text-center max-w-2xl mb-8"
          style={{ animation: 'text-reveal 1s ease-out 0.3s both' }}
        >
          {message || text.subtitle}
        </p>

        {/* Loading animation */}
        <div className="flex items-center gap-4 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="relative">
              <div
                className="w-3 h-3 bg-white rounded-full"
                style={{
                  animation: `twinkle 1.5s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* UI Corner elements with scan effect */}
      <div className="absolute top-8 left-8">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-1 bg-white" />
          <div className="absolute top-0 left-0 w-1 h-full bg-white" />
          <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white/30" />
          <div
            className="absolute top-0 left-0 w-full h-0.5 bg-white/80"
            style={{ animation: 'line-expand 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <div className="absolute top-8 right-8">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 right-0 w-full h-1 bg-white" />
          <div className="absolute top-0 right-0 w-1 h-full bg-white" />
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/30" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div className="relative w-24 h-24">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white" />
          <div className="absolute bottom-0 left-0 w-1 h-full bg-white" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/30" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <div className="relative w-24 h-24">
          <div className="absolute bottom-0 right-0 w-full h-1 bg-white" />
          <div className="absolute bottom-0 right-0 w-1 h-full bg-white" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/30" />
        </div>
      </div>
    </div>
  );
}
