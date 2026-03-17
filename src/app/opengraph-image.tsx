import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = '판교Pick - 판교테크노밸리 점심·회식 룰렛';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const fontData = readFileSync(
    join(process.cwd(), 'public', 'fonts', 'BlackHanSans-Regular.ttf')
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Black Han Sans',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 글로우 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,107,53,0.22) 0%, transparent 65%)',
          }}
        />
        {/* 우상단 포인트 */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              fontSize: 22,
              letterSpacing: '0.25em',
              color: '#8b5e3c',
              fontFamily: 'Black Han Sans',
              marginBottom: 16,
            }}
          >
            판교테크노밸리
          </div>

          {/* 타이틀 */}
          <div
            style={{
              fontSize: 160,
              color: '#ffffff',
              fontFamily: 'Black Han Sans',
              lineHeight: 1,
            }}
          >
            판교Pick
          </div>

          {/* 서브타이틀 */}
          <div
            style={{
              fontSize: 38,
              color: '#8b5e3c',
              fontFamily: 'Black Han Sans',
              marginTop: 20,
            }}
          >
            점심·회식 장소 룰렛 랜덤 추천
          </div>

          {/* 통계 */}
          <div
            style={{
              display: 'flex',
              gap: 28,
              marginTop: 20,
              fontSize: 26,
              color: '#555',
              fontFamily: 'Black Han Sans',
            }}
          >
            <span>점심 맛집 23곳</span>
            <span style={{ color: '#2a2a2a' }}>·</span>
            <span>회식 장소 46곳</span>
            <span style={{ color: '#2a2a2a' }}>·</span>
            <span>네이버 맵 연결</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Black Han Sans',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
