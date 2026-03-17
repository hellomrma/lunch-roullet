'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RouletteWheel, { SEGMENT_COLORS, WheelRef } from '@/components/RouletteWheel';
import {
  ALL_RESTAURANTS,
  DINNER_CATEGORIES,
  DINNER_CATEGORY_LABELS,
  DINNER_RESTAURANT_NAMES,
  DINNER_RESTAURANTS,
  DinnerCategory,
  LUNCH_RESTAURANT_NAMES,
} from '@/data/restaurants';

// ── Confetti ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#8b5e3c', '#c49070', '#e8d5c0', '#e8e0d0', '#c8a898', '#3d3028'];

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
  const restaurant = ALL_RESTAURANTS.find((r) => r.name === name);
  const naverUrl =
    restaurant?.naverUrl ??
    `https://map.naver.com/v5/search/${encodeURIComponent(name)}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">×</button>
        <p className="result-label">오늘의 선택</p>
        <p className="modal-name">{name}</p>
        {restaurant && (
          <>
            <span className="modal-category">{restaurant.category}</span>
            {restaurant.address && <p className="result-address">{restaurant.address}</p>}
            {restaurant.menu && restaurant.menu.length > 0 && (
              <p className="modal-menu">대표 메뉴: {restaurant.menu.join(' · ')}</p>
            )}
          </>
        )}
        <div className="modal-actions">
          <a href={naverUrl} target="_blank" rel="noopener noreferrer" className="naver-map-btn">
            <NaverMapIcon />
            네이버 맵으로 길찾기
          </a>
          <button type="button" className="respin-btn" onClick={onRespin}>다시 돌리기</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
type Mode = 'lunch' | 'dinner';

export default function Home() {
  const [mode, setMode] = useState<Mode>('lunch');
  const [dinnerCategory, setDinnerCategory] = useState<DinnerCategory | '전체'>('전체');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<WheelRef>(null);

  // 모드/카테고리에 따른 룰렛 아이템
  const wheelItems = useMemo(() => {
    if (mode === 'lunch') return LUNCH_RESTAURANT_NAMES;
    if (dinnerCategory === '전체') return DINNER_RESTAURANT_NAMES;
    return DINNER_RESTAURANTS
      .filter((r) => r.category === dinnerCategory)
      .map((r) => r.name);
  }, [mode, dinnerCategory]);

  // 사이드 패널용 아이템 (카테고리 정보 포함)
  const sideItems = useMemo(() => {
    if (mode === 'lunch') return LUNCH_RESTAURANT_NAMES;
    if (dinnerCategory === '전체') return DINNER_RESTAURANT_NAMES;
    return DINNER_RESTAURANTS
      .filter((r) => r.category === dinnerCategory)
      .map((r) => r.name);
  }, [mode, dinnerCategory]);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    setDinnerCategory('전체');
    setResult(null);
    setShowModal(false);
  }, []);

  const handleCategoryChange = useCallback((cat: DinnerCategory | '전체') => {
    setDinnerCategory(cat);
    setResult(null);
    setShowModal(false);
  }, []);

  const handleSpin = useCallback(async () => {
    if (isSpinning || wheelItems.length < 2) return;
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
  }, [isSpinning, wheelItems.length]);

  const handleClose = useCallback(() => setShowModal(false), []);
  const handleRespin = useCallback(() => {
    setShowModal(false);
    setTimeout(handleSpin, 150);
  }, [handleSpin]);

  // 리스트에서 식당 카테고리 정보 가져오기
  const getRestaurant = useCallback((name: string) => ALL_RESTAURANTS.find((r) => r.name === name), []);

  return (
    <div className="page-root">
      <Confetti active={showConfetti} />
      {showModal && result && (
        <ResultModal name={result} onClose={handleClose} onRespin={handleRespin} />
      )}

      {/* ── Header ── */}
      <header className="pt-10 pb-4 text-center px-4">
        <p className="header-eyebrow">판교테크노밸리</p>
        <h1 className="title-glow text-7xl md:text-8xl leading-none">판교Pick</h1>
        <p className="header-sub">점심·회식 장소 고르기 힘들 때, 룰렛에게 맡기세요</p>
      </header>

      {/* ── 모드 토글 ── */}
      <div className="mode-toggle-wrap">
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === 'lunch' ? 'active' : ''}`}
            onClick={() => handleModeChange('lunch')}
          >
            점심 런치
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'dinner' ? 'active' : ''}`}
            onClick={() => handleModeChange('dinner')}
          >
            저녁 회식
          </button>
        </div>
      </div>

      {/* ── 회식 카테고리 필터 ── */}
      {mode === 'dinner' && (
        <div className="cat-chip-wrap">
          <button
            type="button"
            className={`cat-chip ${dinnerCategory === '전체' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('전체')}
          >
            전체
          </button>
          {DINNER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-chip ${dinnerCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {DINNER_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* ── Main layout ── */}
      <main className="max-w-5xl mx-auto px-4 pb-20 mt-6 flex flex-col lg:flex-row gap-8 items-start justify-center">

        {/* ── Wheel ── */}
        <div className="flex flex-col items-center gap-5 shrink-0 w-full lg:w-auto">
          <div className="relative flex items-center justify-center">
            <div className="wheel-halo wheel-glow" />
            <RouletteWheel ref={wheelRef} items={wheelItems} />
          </div>

          <button
            type="button"
            className="spin-btn"
            onClick={handleSpin}
            disabled={isSpinning || wheelItems.length < 2}
          >
            {isSpinning ? (
              <><span className="spinner" />돌리는 중…</>
            ) : (
              mode === 'lunch' ? '🎰 점심 레츠기릿!' : '🎰 회식 레츠기릿!'
            )}
          </button>
        </div>

        {/* ── 음식점 목록 ── */}
        <div className="w-full lg:w-72 lg:mt-6">
          <div className="panel p-5">
            <h2 className="panel-heading">
              {mode === 'lunch' ? '주변 음식점' : '회식 장소'}
              {' '}<span className="panel-heading-count">({sideItems.length})</span>
            </h2>
            <div className="space-y-1.5 max-h-120 overflow-y-auto custom-scroll">
              {sideItems.map((name, i) => {
                const restaurant = getRestaurant(name);
                return (
                  <div
                    key={`${name}-${i}`}
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
      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-desc">
            <h2 className="footer-heading">판교테크노밸리 점심·회식 장소 추천</h2>
            <p>
              경기 성남시 분당구 대왕판교로 670 유스페이스 주변 직장인을 위한 점심 맛집 23곳,
              회식 장소 46곳을 카테고리별로 필터하고 룰렛으로 랜덤 추천합니다.
              한식·일식·중식·양식·아시안·분식·샐러드·패스트푸드 점심 메뉴와
              소고기·해산물·샤브샤브·호프 등 저녁 회식 장소까지 모두 등록되어 있습니다.
            </p>
          </div>

          <dl className="footer-faq">
            <div className="faq-item">
              <dt>오늘 판교 점심 뭐 먹지? 추천해줘</dt>
              <dd>판교Pick에서 룰렛을 돌리면 판교테크노밸리 주변 맛집 23곳 중 하나를 랜덤으로 추천해줘요. 한식·일식·중식·양식·분식·샐러드 등 다양하게 등록되어 있어요.</dd>
            </div>
            <div className="faq-item">
              <dt>유스페이스 A동 근처 밥집 어디 있어요?</dt>
              <dd>담솥(유스페이스2 2층), 일상화식(유스페이스2 B동), 상록면(유스페이스1 지하 1층), 버거킹(유스페이스몰 1층), 이가네양꼬치(유스페이스 2층) 등이 가깝습니다.</dd>
            </div>
            <div className="faq-item">
              <dt>판교 회식 장소 어디가 좋아요?</dt>
              <dd>됐소·황제갈비·숙성도(소/돼지), 도원참치·해도락·자연횟집(해산물), 수작·훠궈야(샤브샤브), 펀비어킹·육회한김스지(호프) 등 46곳을 카테고리별로 골라볼 수 있어요.</dd>
            </div>
            <div className="faq-item">
              <dt>판교 삼평동 점심 맛집 알려줘</dt>
              <dd>평가옥·봉피양(평양냉면), 재크와콩나물(콩나물국밥), 킨파(연어덮밥), 팔복(중식), 동청담(짜장·짬뽕) 등이 삼평동(판교테크노밸리) 인근에 있습니다.</dd>
            </div>
          </dl>

          <p className="footer-copy">
            © 2025 <a href="https://github.com/hellomrma" target="_blank" rel="noopener noreferrer" className="footer-copy-link">hellomrma</a> · 판교Pick · 판교테크노밸리 유스페이스 주변 맛집 룰렛
          </p>
        </div>
      </footer>
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
