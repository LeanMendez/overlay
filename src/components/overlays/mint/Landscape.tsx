import { useEffect, useRef } from 'react';

export type LandscapeVariant = 'alba' | 'bruma' | 'noche';

interface LandscapeProps {
  variante?: LandscapeVariant;
  animado?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

interface Palette {
  sky: string[];
  sun: string[];
  sunPos: [number, number];
  sunR: number;
  cloud: string[];
  ridge: string[];
  castle: string;
  castleLit: string;
  win: string[];
  water: string[];
  shimmer: string;
  fg: string;
  fog: string;
  mote: string;
  bird: string;
  stars: number;
}

const PAL: Record<LandscapeVariant, Palette> = {
  alba: {
    sky: ['#123f42', '#2b7a74', '#6fc4ad', '#cfe9cf', '#f8d5a2'],
    sun: ['#fff7e4', '#ffe6b8', '#f7bd8e'],
    sunPos: [0.7, -26],
    sunR: 15,
    cloud: ['#ffe2c2', '#efb492', '#a8756f'],
    ridge: ['#2e7469', '#1d574f', '#12403a', '#0c2e2b'],
    castle: '#0f3833',
    castleLit: '#08211f',
    win: ['#ffd39a', '#f2a86e'],
    water: ['#9adcc4', '#245c56'],
    shimmer: '#ffe6bd',
    fg: '#041413',
    fog: '#dff2e4',
    mote: '#ffe9c8',
    bird: '#0b2b28',
    stars: 0,
  },
  bruma: {
    sky: ['#0d3336', '#22635f', '#4f9e8d', '#9fd9c2', '#dff4e8'],
    sun: ['#e8fbf1', '#c4ecdc', '#8fcdb9'],
    sunPos: [0.33, -18],
    sunR: 11,
    cloud: ['#d8f1e5', '#9dcbba', '#5f9188'],
    ridge: ['#3a7d72', '#27625a', '#1a4a45', '#0f3330'],
    castle: '#173f3b',
    castleLit: '#0b2624',
    win: ['#bff3de', '#7fd0b8'],
    water: ['#86ccb6', '#1d4f4a'],
    shimmer: '#e2f6ec',
    fg: '#07211f',
    fog: '#eafaf1',
    mote: '#dff7ec',
    bird: '#123c37',
    stars: 0,
  },
  noche: {
    sky: ['#03121a', '#072430', '#0d3a3c', '#1a5750', '#3a8271'],
    sun: ['#eafcf3', '#b6ecd6', '#4fa189'],
    sunPos: [0.74, -46],
    sunR: 9,
    cloud: ['#2b6b62', '#1a4744', '#0d2b29'],
    ridge: ['#124440', '#0d312f', '#092523', '#061a19'],
    castle: '#0a2523',
    castleLit: '#051413',
    win: ['#9ff0d6', '#4fd3ab'],
    water: ['#2a6c60', '#04191a'],
    shimmer: '#a9f0d6',
    fg: '#020c0d',
    fog: '#7fd9c0',
    mote: '#a9f0d6',
    bird: '#04211f',
    stars: 1,
  },
};

function hx(h: string): number {
  const n = parseInt(h.slice(1), 16);
  return (255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255);
}

function mixHex(a: string, b: string, t: number): number {
  const A = parseInt(a.slice(1), 16);
  const B = parseInt(b.slice(1), 16);
  const r = Math.round(((A >> 16) & 255) + (((B >> 16) & 255) - ((A >> 16) & 255)) * t);
  const g = Math.round(((A >> 8) & 255) + (((B >> 8) & 255) - ((A >> 8) & 255)) * t);
  const bl = Math.round((A & 255) + ((B & 255) - (A & 255)) * t);
  return (255 << 24) | (bl << 16) | (g << 8) | r;
}

function mixHexU(a: number, b: number, t: number): number {
  const ar = a & 255, ag = (a >> 8) & 255, ab = (a >> 16) & 255;
  const br = b & 255, bg = (b >> 8) & 255, bb = (b >> 16) & 255;
  return (
    (255 << 24) |
    (((ab + (bb - ab) * t) & 0xff) << 16) |
    (((ag + (bg - ag) * t) & 0xff) << 8) |
    ((ar + (br - ar) * t) & 0xff)
  );
}

/** Procedural pixel-art landscape (castle ruins over water) rendered on a 512x288 canvas
 * and scaled up with `image-rendering: pixelated`. Faithful port of the Paisaje design
 * component — the dithering/water-reflection/ruin layout is deliberately hand-tuned pixel
 * math, not something worth re-deriving from scratch. */
export default function Landscape({
  variante = 'alba',
  animado = true,
  className,
  style,
}: LandscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    let raf = 0;

    const W = 512, H = 288, HZ = 176;
    const P = PAL[variante] ?? PAL.alba;
    const img = ctx.createImageData(W, H);
    const out = new Uint32Array(img.data.buffer);
    const base = new Uint32Array(W * H);
    const land = new Uint32Array(W * H);
    const water = new Uint32Array(W * H);
    const fg = new Uint32Array(W * H);

    let seed = 20260802;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const dith = (x: number, y: number, t: number) => t > (BAYER[y & 3][x & 3] + 0.5) / 16;

    // ---------- sky ----------
    const stops = P.sky;
    for (let y = 0; y < HZ; y++) {
      const g = Math.pow(y / (HZ - 1), 1.25) * (stops.length - 1);
      const i = Math.min(stops.length - 2, Math.floor(g));
      const f = g - i;
      const c1 = hx(stops[i]), c2 = hx(stops[i + 1]);
      const soft = mixHex(stops[i], stops[i + 1], 0.5);
      for (let x = 0; x < W; x++) {
        base[y * W + x] = f < 0.28 ? c1 : f > 0.72 ? c2 : dith(x, y, (f - 0.28) / 0.44) ? c2 : dith(x + 2, y, 0.5) ? soft : c1;
      }
    }
    if (P.stars) {
      for (let i = 0; i < 130; i++) {
        const x = (rnd() * W) | 0, y = (rnd() * HZ * 0.7) | 0;
        const b = rnd();
        base[y * W + x] = mixHex(stops[Math.min(4, (y / HZ * 5) | 0)], '#eafcf3', b * 0.9);
      }
    }
    const sx = (P.sunPos[0] * W) | 0, sy = HZ + P.sunPos[1], R = P.sunR;
    for (let y = Math.max(0, sy - R * 7); y < Math.min(HZ, sy + R * 7); y++) {
      for (let x = Math.max(0, sx - R * 7); x < Math.min(W, sx + R * 7); x++) {
        const d = Math.hypot(x - sx, (y - sy) * 1.05);
        if (d <= R) base[y * W + x] = hx(d < R * 0.62 ? P.sun[0] : P.sun[1]);
        else if (d < R * 6.5) {
          const a = Math.pow(1 - (d - R) / (R * 5.5), 2.4) * 0.85;
          if (dith(x, y, a)) base[y * W + x] = mixHexU(base[y * W + x], hx(P.sun[2]), 0.55);
        }
      }
    }

    const rect = (buf: Uint32Array, x0: number, y0: number, w: number, h: number, c: number) => {
      for (let y = Math.max(0, y0); y < Math.min(H, y0 + h); y++)
        for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) buf[y * W + x] = c;
    };
    const col = (buf: Uint32Array, x: number, y0: number, y1: number, c: number) => {
      if (x < 0 || x >= W) return;
      for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) buf[y * W + x] = c;
    };

    // ---------- ridges ----------
    const ridgeLine = (buf: Uint32Array, yBase: number, amp: number, freq: number, ph: number, c: number) => {
      for (let x = 0; x < W; x++) {
        const n = Math.sin(x * freq + ph) * 0.55 + Math.sin(x * freq * 2.7 + ph * 1.9) * 0.28 + Math.sin(x * freq * 6.1 + ph * 0.6) * 0.17;
        const top = Math.round(yBase - n * amp);
        col(buf, x, top, HZ, c);
      }
    };
    ridgeLine(land, HZ - 30, 16, 0.021, 1.4, hx(P.ridge[0]));
    ridgeLine(land, HZ - 19, 11, 0.031, 4.2, hx(P.ridge[1]));

    // ---------- castle ruins ----------
    const CB = HZ - 4;
    const cx0 = 92;
    const castle = hx(P.castle);
    const wins: [number, number, number, number][] = [];
    const crenel = (x0: number, w: number, yTop: number, step: number, c: number) => {
      for (let x = x0; x < x0 + w; x += step * 2) rect(land, x, yTop - 3, step, 3, c);
      rect(land, x0, yTop, w, 2, c);
    };
    const tower = (x: number, w: number, h: number, opts: { roto?: boolean }) => {
      const yTop = CB - h;
      rect(land, x, yTop, w, h, castle);
      if (opts?.roto) {
        rect(land, x + w - Math.round(w * 0.42), yTop, Math.round(w * 0.42), 5, 0);
        rect(land, x + w - Math.round(w * 0.24), yTop + 5, Math.round(w * 0.24), 4, 0);
        rect(land, x, yTop, 3, 2, 0);
      } else {
        crenel(x - 1, w + 2, yTop, 3, castle);
      }
      const n = Math.max(1, Math.floor(h / 16));
      for (let i = 0; i < n; i++) {
        const wy = yTop + 9 + i * 15;
        if (wy < CB - 18) wins.push([x + ((w / 2) | 0) - 1, wy, 2, 4]);
      }
      rect(land, x + w - 2, yTop + 2, 2, h - 2, hx(P.castleLit));
    };
    rect(land, cx0 + 14, CB - 26, 118, 26, castle);
    crenel(cx0 + 14, 118, CB - 26, 4, castle);
    rect(land, cx0 + 52, CB - 14, 9, 14, 0);
    rect(land, cx0 + 53, CB - 17, 7, 4, 0);
    rect(land, cx0 + 108, CB - 11, 7, 11, 0);
    tower(cx0, 22, 62, {});
    tower(cx0 + 118, 26, 84, { roto: true });
    tower(cx0 + 150, 16, 44, {});
    rect(land, cx0 + 58, CB - 46, 34, 46, castle);
    crenel(cx0 + 57, 36, CB - 46, 4, castle);
    wins.push([cx0 + 68, CB - 36, 3, 5], [cx0 + 82, CB - 36, 3, 5], [cx0 + 75, CB - 22, 3, 5]);
    (() => {
      const ox = 118, oy = CB - 26 - 29;
      const put = (lx: number, ly: number, w: number, h: number, c?: number) => rect(land, ox + lx, oy + ly, w, h, c ?? castle);
      put(8, 28, 17, 2);
      for (let y = 9; y <= 28; y++) {
        const t = (y - 9) / 19;
        put(Math.round(16 - t * 6), y, 2, 1);
        put(Math.round(16 + t * 6), y, 2, 1);
      }
      for (let x = 2; x <= 23; x++) put(x, Math.round(1 + (x - 2) * 0.62), 1, 2);
      put(15, 7, 4, 3);
      put(23, 15, 5, 6);
      put(24, 16, 3, 4, hx(P.castleLit));
    })();
    for (let i = 0; i < 4; i++) {
      const bx = cx0 + 176 + i * 20;
      rect(land, bx, CB - 13, 8, 13, castle);
      if (i < 3) rect(land, bx + 8, CB - 13, 12, 3, castle);
    }
    rect(land, cx0 + 176 + 3 * 20 + 8, CB - 13, 6, 3, 0);
    ridgeLine(land, HZ - 7, 5, 0.043, 2.2, hx(P.ridge[2]));
    for (let i = 0; i < 26; i++) {
      const x = (rnd() * W) | 0, h = 5 + ((rnd() * 7) | 0);
      const y = HZ - 7 - h;
      for (let k = 0; k < h; k++) {
        const wdt = Math.max(1, Math.round((k / h) * 3.2));
        rect(land, x - wdt, y + k, wdt * 2 + 1, 1, hx(P.ridge[3]));
      }
    }

    // ---------- static frame used for the water reflection ----------
    const still = new Uint32Array(W * H);
    still.set(base);
    for (let i = 0; i < W * HZ; i++) if (land[i]) still[i] = land[i];
    for (const w of wins) rect(still, w[0], w[1], w[2], w[3], hx(P.win[0]));

    // ---------- water ----------
    for (let y = HZ; y < H; y++) {
      const d = (y - HZ) / (H - HZ);
      const src = HZ - Math.round((y - HZ) / 0.62);
      const deep = mixHex(P.water[0], P.water[1], Math.pow(d, 0.65));
      for (let x = 0; x < W; x++) {
        let c = deep;
        if (src >= 0) {
          const jitter = Math.round(Math.sin(y * 0.55 + x * 0.03) * 2.2 * (0.4 + d));
          const sxp = Math.min(W - 1, Math.max(0, x + jitter));
          const rc = still[src * W + sxp];
          const mix = 0.55 * (1 - d * 0.75);
          c = mixHexU(deep, rc, mix);
        }
        water[y * W + x] = c;
      }
    }
    rect(water, 0, HZ, W, 1, hx(P.shimmer));

    // ---------- foreground ----------
    const fgc = hx(P.fg);
    for (let x = 0; x < W; x++) {
      const n = Math.sin(x * 0.037 + 0.8) * 0.5 + Math.sin(x * 0.091 + 2.1) * 0.3 + Math.sin(x * 0.21) * 0.2;
      const top = Math.round(H - 20 - n * 9);
      col(fg, x, top, H, fgc);
    }
    for (let i = 0; i < 14; i++) {
      const x = 10 + ((rnd() * (W - 20)) | 0), h = 14 + ((rnd() * 22) | 0);
      const y = H - 26 - h + ((rnd() * 8) | 0);
      for (let k = 0; k < h; k++) {
        const wdt = Math.max(1, Math.round((k / h) * 4.5));
        rect(fg, x - wdt, y + k, wdt * 2 + 1, 1, fgc);
      }
      col(fg, x, y + h - 2, y + h + 8, fgc);
    }

    // ---------- animated elements ----------
    const clouds = Array.from({ length: 9 }, () => ({
      x: rnd() * W * 1.4 - 100,
      y: 14 + rnd() * (HZ - 70),
      w: 26 + rnd() * 66,
      h: 4 + rnd() * 7,
      sp: 0.15 + rnd() * 0.45,
      tone: (rnd() * 3) | 0,
    }));
    const motes = Array.from({ length: 44 }, () => ({
      x: rnd() * W,
      y: HZ - 40 + rnd() * (H - HZ + 30),
      sp: 0.06 + rnd() * 0.16,
      ph: rnd() * 6.28,
      a: 0.35 + rnd() * 0.65,
    }));
    const birds = Array.from({ length: 5 }, () => ({
      x: rnd() * W,
      y: 26 + rnd() * 44,
      sp: 0.18 + rnd() * 0.2,
      ph: rnd() * 6.28,
    }));

    const cloudTones = P.cloud.map(hx);
    const shim = hx(P.shimmer), fogc = P.fog, motec = hx(P.mote), birdc = hx(P.bird);
    const winA = hx(P.win[0]), winB = hx(P.win[1]);

    const drawCloud = (c: (typeof clouds)[number]) => {
      const x0 = Math.round(c.x), y0 = Math.round(c.y);
      const top = cloudTones[c.tone], bot = cloudTones[Math.min(2, c.tone + 1)];
      for (let yy = 0; yy < c.h; yy++) {
        const t = yy / c.h;
        const shrink = Math.round(Math.pow(Math.abs(t - 0.35) * 2, 1.6) * c.w * 0.34);
        const xa = x0 + shrink, xb = x0 + c.w - shrink;
        const cc = t < 0.42 ? top : bot;
        for (let x = Math.max(0, xa); x < Math.min(W, xb); x++) {
          const y = y0 + yy;
          if (y < 1 || y >= HZ - 2) continue;
          const edge = Math.min(x - xa, xb - x);
          if (edge < 3 && !dith(x, y, edge / 3)) continue;
          out[y * W + x] = cc;
        }
      }
    };

    const draw = (t: number) => {
      out.set(base);
      for (const c of clouds) {
        c.x += c.sp * 0.35;
        if (c.x > W + 20) {
          c.x = -c.w - 30;
          c.y = 14 + Math.random() * (HZ - 70);
        }
        drawCloud(c);
      }
      for (const b of birds) {
        b.x += b.sp;
        if (b.x > W + 8) b.x = -8;
        const bx = Math.round(b.x), by = Math.round(b.y + Math.sin(t * 0.0009 + b.ph) * 3);
        for (let k = -2; k <= 2; k++) {
          const px = bx + k, py = by;
          if (px >= 0 && px < W && py >= 0 && py < HZ) out[py * W + px] = birdc;
        }
      }
      for (let i = 0; i < W * HZ; i++) if (land[i]) out[i] = land[i];
      for (let i = 0; i < wins.length; i++) {
        const w = wins[i];
        const fl = 0.5 + 0.5 * Math.sin(t * 0.0016 + i * 1.7);
        rect(out, w[0], w[1], w[2], w[3], fl > 0.45 ? winA : winB);
      }
      for (let y = HZ - 26; y < HZ; y++) {
        const dens = Math.pow((y - (HZ - 26)) / 26, 1.6) * 0.5;
        const off = Math.sin(t * 0.00022 + y * 0.3) * 30;
        for (let x = 0; x < W; x++) {
          const local = dens * (0.65 + 0.35 * Math.sin((x + off) * 0.035 + y * 0.12));
          if (dith(x, y, local)) out[y * W + x] = mixHexU(out[y * W + x], hx(fogc), 0.5);
        }
      }
      for (let i = HZ * W; i < W * H; i++) out[i] = water[i];
      for (let y = HZ + 1; y < H; y++) {
        const d = (y - HZ) / (H - HZ);
        const amp = 26 + d * 120;
        const cxs = Math.round(sx + Math.sin(t * 0.0011 + y * 0.9) * 2);
        const ph = t * 0.0013 + y * 1.7;
        const len = Math.round(3 + Math.abs(Math.sin(ph)) * 10 * (1 - d * 0.5));
        if (((y * 13 + Math.round(t * 0.02)) % 5) !== 0) continue;
        const x0 = Math.round(cxs + Math.sin(ph * 0.7) * amp * 0.4) - len;
        for (let x = x0; x < x0 + len * 2; x++) {
          if (x < 0 || x >= W) continue;
          out[y * W + x] = mixHexU(out[y * W + x], shim, 0.55 * (1 - d * 0.6));
        }
      }
      for (const m of motes) {
        m.y -= m.sp;
        m.x += Math.sin(t * 0.0006 + m.ph) * 0.12;
        if (m.y < HZ - 56) {
          m.y = H - 2;
          m.x = Math.random() * W;
        }
        const px = Math.round(m.x), py = Math.round(m.y);
        if (px >= 0 && px < W && py >= 0 && py < H) out[py * W + px] = mixHexU(out[py * W + px], motec, m.a);
      }
      for (let i = 0; i < W * H; i++) if (fg[i]) out[i] = fg[i];
      ctx.putImageData(img, 0, 0);
    };

    draw(0);
    if (animado === false) return;
    let last = -999;
    const loop = (ts: number) => {
      if (ts - last >= 45) {
        last = ts;
        draw(ts);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [variante, animado]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={288}
      className={`pixel-crisp ${className ?? ''}`}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  );
}
