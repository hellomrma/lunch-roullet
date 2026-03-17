# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 기술 스택

- **Next.js 15** (App Router, `src/` 디렉터리 구조)
- **TypeScript**
- **Tailwind CSS v4** — `@import "tailwindcss"` 문법 사용; 커스텀 토큰은 `globals.css`의 `@theme inline {}` 블록에서 정의
- **Google Fonts (next/font)** — Black Han Sans(타이틀), Noto Sans KR(본문); CSS 변수 `--font-black-han`, `--font-noto-kr`로 주입

## 프로젝트

**판교Pick** — 판교테크노밸리 주변 점심·회식 장소를 룰렛으로 결정하는 웹 앱.

## 구조

단일 페이지 앱으로 주요 로직이 두 파일에 집중되어 있습니다:

- [src/app/page.tsx](src/app/page.tsx) — 메인 페이지 (`'use client'`): 메뉴 목록 상태, 스핀 상태, 결과, `Confetti` 컴포넌트, 메뉴 추가/삭제 UI
- [src/components/RouletteWheel.tsx](src/components/RouletteWheel.tsx) — `forwardRef` + `useImperativeHandle`로 노출되는 캔버스 룰렛 휠; `wheelRef.current.spin()`을 호출하면 애니메이션 완료 후 당첨 메뉴 문자열을 resolve하는 `Promise<string>` 반환

### 휠 그리기 및 당첨 계산

`480×480` HTML Canvas에 그리며, CSS `max-width: 100%; height: auto`로 반응형 스케일. 세그먼트는 `-π/2`(12시 방향)에서 시작해 시계 방향으로 배치. 포인터 화살표는 최상단에 고정.

스핀 후 당첨 계산:
```ts
const norm = (((-rotation % (2π)) + 2π) % (2π));
const winner = items[Math.floor(norm / segmentAngle) % items.length];
```

스핀 애니메이션은 **ease-out quintic** (`1 - (1-t)^5`)으로 5~7초 동안 `requestAnimationFrame` 구동. 첫 드로우 전에 `document.fonts.ready`로 폰트 로드를 보장.

### 스타일 규칙

- 모든 컴포넌트 스타일은 [src/app/globals.css](src/app/globals.css)에 CSS 클래스로 정의 (`.spin-btn`, `.result-card`, `.item-row` 등)
- 레이아웃·간격은 Tailwind 유틸리티 클래스 사용, 컴포넌트 고유 스타일은 globals.css에 작성
- `style={}` 인라인 스타일은 동적 값(아이템별 색상 점, 컨페티 위치 등)에만 사용
- `SEGMENT_COLORS`는 `RouletteWheel.tsx`에서 export하여 `page.tsx`의 메뉴 목록 색상 점과 일치시킴
