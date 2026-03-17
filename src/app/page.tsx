'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import RouletteWheel, {
  SEGMENT_COLORS,
  WheelRef,
} from '@/components/RouletteWheel';
import { RESTAURANTS, DEFAULT_RESTAURANT_NAMES } from '@/data/restaurants';

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

// ── Result Modal ─────────────────────────────────────────────────────────────
interface ResultModalProps {
  name: string;
  onClose: () => void;
  onRespin: () => void;
}

function ResultModal({ name, onClose, onRespin }: ResultModalProps) {
  const restaurant = RESTAURANTS.find((r) => r.name === name);
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(name)}`;

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 */}
        <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>

        {/* 내용 */}
        <p className="result-label">오늘의 점심</p>
        <p className="modal-name">{name}</p>

        {restaurant && (
          <>
            <span className="modal-category">{restaurant.category}</span>
            <p className="result-address">{restaurant.address}</p>
            {restaurant.menu.length > 0 && (
              <p className="modal-menu">대표 메뉴: {restaurant.menu.join(' · ')}</p>
            )}
          </>
        )}

        {/* 버튼 영역 */}
        <div className="modal-actions">
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="naver-map-btn"
          >
            <NaverMapIcon />
            네이버 맵으로 길찾기
          </a>
          <button type="button" className="respin-btn" onClick={onRespin}>
            다시 돌리기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const ITEMS = DEFAULT_RESTAURANT_NAMES;

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<WheelRef>(null);

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    setShowModal(false);
    setResult(null);
    setIsSpinning(true);
    const winner = await wheelRef.current?.spin();
    setIsSpinning(false);
    if (winner) {
      setResult(winner);
      setShowModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }
  }, [isSpinning]);

  const handleClose = useCallback(() => setShowModal(false), []);

  const handleRespin = useCallback(() => {
    setShowModal(false);
    setTimeout(handleSpin, 150);
  }, [handleSpin]);

  return (
    <div className="page-root">
      <Confetti active={showConfetti} />

      {showModal && result && (
        <ResultModal name={result} onClose={handleClose} onRespin={handleRespin} />
      )}

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
            <RouletteWheel ref={wheelRef} items={ITEMS} />
          </div>

          <button
            type="button"
            className="spin-btn"
            onClick={handleSpin}
            disabled={isSpinning}
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
        </div>

        {/* ── Restaurant list (read-only) ── */}
        <div className="w-full lg:w-72 lg:mt-6">
          <div className="panel p-5">
            <h2 className="panel-heading">
              주변 음식점{' '}
              <span className="panel-heading-count">({ITEMS.length})</span>
            </h2>

            <div className="space-y-1.5 max-h-120 overflow-y-auto custom-scroll">
              {ITEMS.map((name, i) => {
                const restaurant = RESTAURANTS.find((r) => r.name === name);
                return (
                  <div
                    key={name}
                    className={`item-row ${result === name && !isSpinning ? 'selected' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="item-dot"
                        style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                      />
                      <span className="truncate">{name}</span>
                    </div>
                    {restaurant && (
                      <span className="category-badge">{restaurant.category}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NaverMapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}
