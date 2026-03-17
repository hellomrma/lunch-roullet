import { ALL_RESTAURANTS, LUNCH_RESTAURANTS, DINNER_RESTAURANTS } from '@/data/restaurants';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pangyo-pick.vercel.app';

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': siteUrl,
  name: '판교Pick',
  url: siteUrl,
  description:
    '판교테크노밸리(경기 성남시 분당구 대왕판교로 670 유스페이스) 주변 점심 맛집·회식 장소를 룰렛으로 랜덤 추천해주는 웹 앱',
  applicationCategory: 'UtilityApplication',
  inLanguage: 'ko',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  featureList: [
    '점심 맛집 룰렛 추천',
    '회식 장소 카테고리별 필터',
    '네이버 맵 길찾기 연결',
    '모바일 반응형',
  ],
  areaServed: {
    '@type': 'Place',
    name: '판교테크노밸리',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '대왕판교로 670',
      addressLocality: '성남시 분당구',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
  },
};

const restaurantListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '판교테크노밸리 주변 음식점 목록',
  description: `판교테크노밸리 유스페이스 A동 주변 점심 맛집 ${LUNCH_RESTAURANTS.length}곳 및 회식 장소 ${DINNER_RESTAURANTS.length}곳`,
  numberOfItems: ALL_RESTAURANTS.length,
  itemListElement: ALL_RESTAURANTS.map((r, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Restaurant',
      name: r.name,
      servesCuisine: r.category,
      ...(r.address
        ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: r.address,
              addressLocality: '성남시 분당구',
              addressRegion: '경기도',
              addressCountry: 'KR',
            },
          }
        : {}),
      ...(r.naverUrl ? { url: r.naverUrl } : {}),
    },
  })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '판교테크노밸리 근처 점심 맛집은 어디인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `판교테크노밸리 유스페이스 주변 점심 맛집으로는 ${LUNCH_RESTAURANTS.slice(0, 6).map((r) => r.name).join(', ')} 등 ${LUNCH_RESTAURANTS.length}곳이 있습니다. 판교Pick에서 룰렛으로 랜덤하게 선택할 수 있습니다.`,
      },
    },
    {
      '@type': 'Question',
      name: '판교테크노밸리 회식 장소를 추천해주세요.',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `판교테크노밸리 주변 회식 장소 ${DINNER_RESTAURANTS.length}곳이 등록되어 있습니다. 소고기·돼지고기 전문(됐소, 황제갈비, 숙성도 등), 해산물(도원참치, 해도락, 자연횟집 등), 샤브샤브·훠궈(수작, 훠궈야 등), 호프·주점(펀비어킹, 육회한김스지 등) 카테고리별로 필터링해 룰렛으로 선택할 수 있습니다.`,
      },
    },
    {
      '@type': 'Question',
      name: '판교Pick은 어떤 서비스인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '판교Pick은 경기 성남시 분당구 대왕판교로 670 유스페이스 인근 직장인들이 점심 메뉴와 회식 장소를 룰렛으로 결정할 수 있는 무료 웹 서비스입니다. 점심 맛집 23곳, 회식 장소 46곳의 정보와 네이버 맵 길찾기를 제공합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '판교Pick에서 네이버 맵 길찾기가 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 룰렛으로 음식점이 선택되면 결과 팝업에서 "네이버 맵으로 길찾기" 버튼을 클릭해 바로 네이버 맵 길찾기로 이동할 수 있습니다.',
      },
    },
  ],
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
