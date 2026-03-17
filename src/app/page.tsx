'use client';

import { useCallback, useRef, useState } from 'react';
import RouletteWheel, {
  SEGMENT_COLORS,
  WheelRef,
} from '@/components/RouletteWheel';

const DEFAULT_ITEMS = [
  '김치찌개',
  '된장찌개',
  '비빔밥',
  '삼겹살',
  '짜장면',
  '짬뽕',
  '라면',
  '순두부찌개',
  '치킨',
  '피자',
  '햄버거',
  '초밥',
];

// ── Confetti ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF6B35', '#FFD93D', '#4ADE80', '#60A5FA', '#C084FC', '#F472B6'];

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.8,
    size: 7 + Math.random() * 7,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    skew: Math.random() > 0.5 ? 1 : 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * p.skew,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newItem, setNewItem] = useState('');
  const wheelRef = useRef<WheelRef>(null);

  const handleSpin = useCallback(async () => {
    if (isSpinning || items.length < 2) return;
    setResult(null);
    setIsSpinning(true);
    const winner = await wheelRef.current?.spin();
    setIsSpinning(false);
    if (winner) {
      setResult(winner);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }
  }, [isSpinning, items.length]);

  const addItem = useCallback(() => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed) && items.length < 20) {
      setItems((prev) => [...prev, trimmed]);
      setNewItem('');
    }
  }, [newItem, items]);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return (
    <div className="page-root">
      <Confetti active={showConfetti} />

      {/* ── Header ── */}
      <header className="pt-10 pb-4 text-center px-4">
        <p className="header-eyebrow">오늘의 점심을 결정하는 방법</p>
        <h1 className="title-glow text-7xl md:text-8xl leading-none">런치룰렛</h1>
        <p className="header-sub">메뉴 고르기 힘들 때, 룰렛에게 맡기세요</p>
      </header>

      {/* ── Main layout ── */}
      <main className="max-w-5xl mx-auto px-4 pb-20 mt-6 flex flex-col lg:flex-row gap-8 items-start justify-center">

        {/* ── Wheel + Controls ── */}
        <div className="flex flex-col items-center gap-5 shrink-0 w-full lg:w-auto">
          <div className="relative flex items-center justify-center">
            <div className="wheel-halo wheel-glow" />
            <RouletteWheel ref={wheelRef} items={items} />
          </div>

          <button
            type="button"
            className="spin-btn"
            onClick={handleSpin}
            disabled={isSpinning || items.length < 2}
          >
            {isSpinning ? (
              <>
                <span className="spinner" />
                돌리는 중…
              </>
            ) : (
              '🎰 돌려라 룰렛!'
            )}
          </button>

          {result && !isSpinning && (
            <div className="result-card">
              <p className="result-label">오늘의 점심</p>
              <p className="text-4xl font-black text-white mt-1">{result}</p>
              <p className="result-sub">맛있게 드세요! 🍽️</p>
            </div>
          )}
        </div>

        {/* ── Item list panel ── */}
        <div className="w-full lg:w-72 lg:mt-6">
          <div className="panel p-5">
            <h2 className="panel-heading">
              메뉴 목록{' '}
              <span className="panel-heading-count">({items.length}/20)</span>
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder="메뉴 추가…"
                maxLength={12}
                className="add-input"
              />
              <button
                type="button"
                onClick={addItem}
                disabled={!newItem.trim() || items.length >= 20}
                className="add-btn"
              >
                +
              </button>
            </div>

            <div className="space-y-1.5 max-h-96 overflow-y-auto custom-scroll">
              {items.map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  className={`item-row ${result === item && !isSpinning ? 'selected' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="item-dot"
                      style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    />
                    <span className="truncate">{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    disabled={isSpinning}
                    className="remove-btn"
                    aria-label={`${item} 삭제`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {items.length < 2 && (
              <p className="warn-text">최소 2개의 메뉴가 필요합니다</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
