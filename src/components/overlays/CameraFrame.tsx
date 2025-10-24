import { useEffect, useState } from 'react';

type Orientation = 'horizontal' | 'vertical' | 'square';
type Variant = 'default' | 'wide' | 'portrait' | 'compact';

interface CameraFrameProps {
  width?: number;
  height?: number;
  borderWidth?: number;
  variant?: Variant;
}

// Preset sizes for different variants
const VARIANT_PRESETS = {
  default: { width: 400, height: 300 },      // 4:3 horizontal
  wide: { width: 480, height: 270 },         // 16:9 wide
  portrait: { width: 270, height: 480 },     // 9:16 vertical
  compact: { width: 320, height: 240 },      // 4:3 compact
  square: { width: 360, height: 360 }        // 1:1 square
};

export default function CameraFrame({
  width,
  height,
  borderWidth = 3,
  variant = 'default'
}: CameraFrameProps) {
  const [mounted, setMounted] = useState(false);

  // Use preset dimensions if width/height not provided
  const finalWidth = width || VARIANT_PRESETS[variant]?.width || VARIANT_PRESETS.default.width;
  const finalHeight = height || VARIANT_PRESETS[variant]?.height || VARIANT_PRESETS.default.height;

  // Determine orientation based on dimensions
  const isVertical = finalHeight > finalWidth;
  const isSquare = finalHeight === finalWidth;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="relative"
      style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
    >
      {/* Main border frame */}
      <div
        className={`absolute inset-0 border-white transition-opacity duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ borderWidth: `${borderWidth}px` }}
      >
        {/* Corner decorations - Top Left */}
        <div className="absolute -top-1 -left-1 w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
          <div className="absolute top-2 left-2 w-3 h-3 border border-white/50"></div>
        </div>

        {/* Corner decorations - Top Right */}
        <div className="absolute -top-1 -right-1 w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-1 bg-white"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border border-white/50"></div>
        </div>

        {/* Corner decorations - Bottom Left */}
        <div className="absolute -bottom-1 -left-1 w-8 h-8">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-1 h-full bg-white"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border border-white/50"></div>
        </div>

        {/* Corner decorations - Bottom Right */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8">
          <div className="absolute bottom-0 right-0 w-full h-1 bg-white"></div>
          <div className="absolute bottom-0 right-0 w-1 h-full bg-white"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border border-white/50"></div>
        </div>

        {/* Subtle glow effect */}
        <div
          className="absolute inset-0 border-white pointer-events-none"
          style={{
            borderWidth: `${borderWidth}px`,
            animation: 'glow-pulse 3s ease-in-out infinite'
          }}
        ></div>

        {/* Scanning line effects - adapt based on orientation */}
        {isVertical ? (
          <>
            {/* Vertical scanning lines on sides */}
            <div
              className="absolute -left-0.5 top-8 bottom-8 w-0.5 bg-white/80"
              style={{ animation: 'corner-scan 4s ease-in-out infinite', transform: 'rotate(90deg)', transformOrigin: 'center' }}
            ></div>
            <div
              className="absolute -right-0.5 top-8 bottom-8 w-0.5 bg-white/80"
              style={{ animation: 'corner-scan 4s ease-in-out infinite 2s', transform: 'rotate(90deg)', transformOrigin: 'center' }}
            ></div>
          </>
        ) : (
          <>
            {/* Horizontal scanning lines */}
            <div className="absolute -top-0.5 left-8 right-8 h-0.5 bg-white/80 animate-[corner-scan_4s_ease-in-out_infinite]"></div>
            <div className="absolute -bottom-0.5 left-8 right-8 h-0.5 bg-white/80 animate-[corner-scan_4s_ease-in-out_infinite_2s]"></div>
          </>
        )}

        {/* Side accent lines - adapt to orientation */}
        {isVertical ? (
          <>
            <div className="absolute left-1/4 -top-1 h-6 w-0.5 bg-white"></div>
            <div className="absolute left-3/4 -top-1 h-6 w-0.5 bg-white"></div>
            <div className="absolute left-1/4 -bottom-1 h-6 w-0.5 bg-white"></div>
            <div className="absolute left-3/4 -bottom-1 h-6 w-0.5 bg-white"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 -left-1 w-6 h-0.5 bg-white"></div>
            <div className="absolute top-3/4 -left-1 w-6 h-0.5 bg-white"></div>
            <div className="absolute top-1/4 -right-1 w-6 h-0.5 bg-white"></div>
            <div className="absolute top-3/4 -right-1 w-6 h-0.5 bg-white"></div>
          </>
        )}

        {/* Hollow Knight inspired detail - subtle geometric pattern */}
        {isVertical ? (
          <>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
              <div className="w-1 h-1 bg-white/40 rotate-45"></div>
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
              <div className="w-1 h-1 bg-white/40 rotate-45"></div>
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
              <div className="w-1 h-1 bg-white/40 rotate-45"></div>
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
              <div className="w-1 h-1 bg-white/40 rotate-45"></div>
              <div className="w-1 h-1 bg-white/60 rotate-45"></div>
            </div>
          </>
        )}
      </div>

      {/* Inner shadow/depth */}
      <div className="absolute inset-2 border border-white/20 pointer-events-none"></div>
    </div>
  );
}
