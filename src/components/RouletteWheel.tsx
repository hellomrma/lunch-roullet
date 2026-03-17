'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export const SEGMENT_COLORS = [
  '#FF6B35', '#FFD93D', '#4ADE80', '#60A5FA',
  '#C084FC', '#F472B6', '#34D399', '#FB923C',
  '#A78BFA', '#38BDF8', '#FACC15', '#F87171',
];

export interface WheelRef {
  spin: () => Promise<string>;
}

interface Props {
  items: string[];
}

const RouletteWheel = forwardRef<WheelRef, Props>(({ items }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);
  const spinningRef = useRef(false);

  const draw = useCallback(
    (rot: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      // Leave room for pointer above and glow ring
      const R = cx - 28;

      ctx.clearRect(0, 0, W, H);

      if (items.length === 0) {
        ctx.fillStyle = '#333';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('메뉴를 추가해 주세요', cx, cy);
        return;
      }

      const n = items.length;
      const seg = (2 * Math.PI) / n;

      // ── Draw segments ──
      items.forEach((item, i) => {
        const startAngle = rot - Math.PI / 2 + i * seg;
        const endAngle = startAngle + seg;
        const midAngle = startAngle + seg / 2;
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Subtle dark separator
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner highlight arc (depth feel)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R * 0.38, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fill();

        // ── Text ──
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);

        const textDist = R * 0.63;
        const fontSize = n <= 8 ? 14 : n <= 12 ? 12 : 10;
        ctx.font = `700 ${fontSize}px 'Noto Sans KR', '맑은 고딕', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.65)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffff';

        // Truncate if too wide
        const maxW = R * 0.52;
        let text = item;
        while (ctx.measureText(text).width > maxW && text.length > 1) {
          text = text.slice(0, -1);
        }
        if (text !== item) text = text.slice(0, -1) + '…';

        ctx.fillText(text, textDist, 0);
        ctx.restore();
      });

      // ── Outer border ring ──
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // ── Center hub ──
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF6B35';
      ctx.shadowColor = 'rgba(255,107,53,0.8)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Pointer arrow (top, pointing down into wheel) ──
      const tipY = cy - R - 1;   // touches wheel edge
      const baseY = tipY - 24;   // triangle height = 24px
      const pw = 12;              // half-width of base

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - pw, baseY);
      ctx.lineTo(cx + pw, baseY);
      ctx.lineTo(cx, tipY);
      ctx.closePath();
      ctx.fillStyle = '#FF6B35';
      ctx.shadowColor = 'rgba(255,107,53,0.9)';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    },
    [items],
  );

  // Redraw whenever items change (fonts ready first)
  useEffect(() => {
    document.fonts.ready.then(() => draw(rotationRef.current));
  }, [items, draw]);

  // Determine winner from final rotation
  const getWinner = useCallback(
    (rot: number): string => {
      if (!items.length) return '';
      const seg = (2 * Math.PI) / items.length;
      const norm = (((-rot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
      return items[Math.floor(norm / seg) % items.length];
    },
    [items],
  );

  useImperativeHandle(ref, () => ({
    spin: () =>
      new Promise<string>((resolve) => {
        if (spinningRef.current || items.length < 2) {
          resolve(items[0] ?? '');
          return;
        }
        spinningRef.current = true;

        // 8–14 full rotations + random landing angle
        const totalRot =
          (8 + Math.random() * 6) * 2 * Math.PI +
          Math.random() * 2 * Math.PI;
        const duration = 5000 + Math.random() * 2000; // 5–7 s
        const t0 = performance.now();
        const r0 = rotationRef.current;

        // Ease-out quintic — dramatic deceleration
        const ease = (t: number) => 1 - Math.pow(1 - t, 5);

        const tick = (now: number) => {
          const progress = Math.min((now - t0) / duration, 1);
          rotationRef.current = r0 + totalRot * ease(progress);
          draw(rotationRef.current);

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            spinningRef.current = false;
            resolve(getWinner(rotationRef.current));
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      }),
  }), [items, draw, getWinner]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={480}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
});

RouletteWheel.displayName = 'RouletteWheel';
export default RouletteWheel;
