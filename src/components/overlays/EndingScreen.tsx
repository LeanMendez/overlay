import { useEffect, useState } from 'react';

interface EndingScreenProps {
  language?: 'en' | 'es';
  message?: string;
  socials?: {
    twitter?: string;
    youtube?: string;
    discord?: string;
  };
}

const TEXTS = {
  en: {
    title: 'THANKS FOR WATCHING',
    subtitle: 'Stream has ended',
    farewell: 'See you next time!',
    follow: 'Follow for more content',
  },
  es: {
    title: 'GRACIAS POR VER',
    subtitle: 'El stream ha terminado',
    farewell: '¡Nos vemos la próxima!',
    follow: 'Sígueme para más contenido',
  },
};

export default function EndingScreen({
  language = 'en',
  message,
  socials,
}: EndingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const text = TEXTS[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stars
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 1 + Math.random() * 4,
  }));

  // Shooting stars
  const shootingStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 30,
    left: 60 + Math.random() * 30,
    delay: i * 3,
  }));

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

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `meteor 4s linear ${star.delay}s infinite`,
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
          <div
            className="absolute top-0 left-0 w-20 h-0.5 bg-gradient-to-r from-white to-transparent"
            style={{ transform: 'rotate(-45deg)', transformOrigin: 'left' }}
          />
        </div>
      ))}

      {/* Large distant planet */}
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-white/10 to-white/0 border border-white/20"
        style={{
          animation: 'float-slow 12s ease-in-out infinite',
          boxShadow: '0 0 100px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-black/30 blur-md" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-white/5 blur-md" />
      </div>

      {/* Small moon top right */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30"
        style={{
          animation: 'float-slow 8s ease-in-out infinite 1s',
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.3), inset -10px -10px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="absolute top-1/3 left-1/3 w-8 h-8 rounded-full bg-black/30" />
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full bg-black/30" />
      </div>

      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-20">
        {/* Main title with expanding effect */}
        <div className="relative">
          {/* Expanding hexagons */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `pulse-ring 3s ease-out infinite ${i * 0.5}s`,
              }}
            >
              <div className="w-[800px] h-[800px] border-2 border-white/20">
                {/* Hexagon-ish shape using clip-path */}
                <div
                  className="w-full h-full border-2 border-white/10"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  }}
                />
              </div>
            </div>
          ))}

          <h1
            className="text-9xl font-bold text-white tracking-wider relative z-10 text-center"
            style={{
              animation: 'text-reveal 1.2s ease-out both, text-glow 3s ease-in-out infinite 1s',
              letterSpacing: '0.3em',
            }}
          >
            {text.title}
          </h1>

          {/* Hollow Knight style ornament */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-3 bg-white/70 rotate-45" />
            <div className="w-3 h-3 bg-white/50 rotate-45" />
            <div className="w-3 h-3 bg-white/70 rotate-45" />
            <div className="w-3 h-3 bg-white/50 rotate-45" />
            <div className="w-3 h-3 bg-white/70 rotate-45" />
          </div>

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-3 bg-white/70 rotate-45" />
            <div className="w-3 h-3 bg-white/50 rotate-45" />
            <div className="w-3 h-3 bg-white/70 rotate-45" />
            <div className="w-3 h-3 bg-white/50 rotate-45" />
            <div className="w-3 h-3 bg-white/70 rotate-45" />
          </div>
        </div>

        {/* Subtitle */}
        <div
          className="text-5xl text-white/70 tracking-widest"
          style={{
            animation: 'text-reveal 1s ease-out 0.4s both',
            letterSpacing: '0.5em',
          }}
        >
          {text.subtitle}
        </div>

        {/* Message box */}
        <div
          className="relative border-4 border-white/40 px-20 py-12 bg-black/60 backdrop-blur-sm"
          style={{
            animation: 'text-reveal 1s ease-out 0.8s both, intense-glow 4s ease-in-out infinite 1.5s',
          }}
        >
          {/* Corner accents */}
          <div className="absolute -top-3 -left-3 w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-1 bg-white" />
            <div className="absolute top-0 left-0 w-1 h-full bg-white" />
          </div>
          <div className="absolute -top-3 -right-3 w-12 h-12">
            <div className="absolute top-0 right-0 w-full h-1 bg-white" />
            <div className="absolute top-0 right-0 w-1 h-full bg-white" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-12 h-12">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white" />
            <div className="absolute bottom-0 left-0 w-1 h-full bg-white" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12">
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white" />
            <div className="absolute bottom-0 right-0 w-1 h-full bg-white" />
          </div>

          <p className="text-4xl text-white/90 text-center font-light tracking-wide">
            {message || text.farewell}
          </p>
        </div>



        {/* Follow message */}
        <div
          className="text-white/70 text-3xl tracking-wide"
          style={{ animation: 'text-reveal 1s ease-out 1.4s both' }}
        >
          {text.follow}
        </div>

        {/* Animated stars indicator */}
        <div className="flex gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="text-white text-3xl"
              style={{
                animation: `twinkle 2s ease-in-out infinite ${i * 0.3}s`,
              }}
            >
              ★
            </div>
          ))}
        </div>
      </div>

      {/* Frame decorations */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
    </div>
  );
}
