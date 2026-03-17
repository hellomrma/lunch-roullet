import { ALL_RESTAURANTS, LUNCH_RESTAURANTS, DINNER_RESTAURANTS } from '@/data/restaurants';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pangyo-pick.vercel.app';

// ── 핵심 엔티티: 판교테크노밸리 (지식 그래프 연결) ────────────────────────────
const pangyoTechnoValley = {
  '@type': 'Place',
  '@id': 'https://ko.wikipedia.org/wiki/판교테크노밸리',
  name: '판교테크노밸리',
  alternateName: ['판교 테크노밸리', '삼평동', '판교역'],
  sameAs: [
    'https://ko.wikipedia.org/wiki/판교테크노밸리',
    'https://www.wikidata.org/wiki/Q12591040',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '대왕판교로 670',
    addressLocality: '성남시 분당구',
    addressRegion: '경기도',
    postalCode: '13487',
    addressCountry: 'KR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.4017,
    longitude: 127.1097,
  },
  containedInPlace: {
    '@type': 'City',
    name: '성남시',
    sameAs: 'https://ko.wikipedia.org/wiki/성남시',
  },
};

// ── Organization (E-E-A-T: 전문성·신뢰도) ────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: '판교Pick',
  url: siteUrl,
  description: '판교테크노밸리 주변 점심·회식 장소를 룰렛으로 추천하는 웹 서비스',
  foundingDate: '2025',
  areaServed: pangyoTechnoValley,
  knowsAbout: [
    '판교테크노밸리 맛집',
    '판교 점심 식당',
    '판교 회식 장소',
    '성남시 분당구 음식점',
    '유스페이스 점심',
  ],
};

// ── WebSite (지식 그래프 연결·SearchAction) ───────────────────────────────────
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: '판교Pick',
  description: '판교테크노밸리 주변 점심·회식 장소 룰렛 추천 서비스',
  inLanguage: 'ko',
  publisher: { '@id': `${siteUrl}/#organization` },
  about: pangyoTechnoValley,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ── WebApplication (speakable·E-E-A-T·콘텐츠 관계) ──────────────────────────
const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${siteUrl}/#webapp`,
  name: '판교Pick',
  url: siteUrl,
  description:
    '판교테크노밸리(경기 성남시 분당구 대왕판교로 670 유스페이스) 주변 점심 맛집·회식 장소를 룰렛으로 랜덤 추천해주는 웹 앱',
  applicationCategory: 'UtilityApplication',
  inLanguage: 'ko',
  isAccessibleForFree: true,
  author: { '@id': `${siteUrl}/#organization` },
  publisher: { '@id': `${siteUrl}/#organization` },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  // 지식 그래프: 콘텐츠 관계
  about: pangyoTechnoValley,
  isPartOf: { '@id': `${siteUrl}/#website` },
  mentions: ALL_RESTAURANTS.map((r) => ({
    '@type': 'Restaurant',
    name: r.name,
    servesCuisine: r.category,
  })),
  // 음성 검색 최적화: SpeakableSpecification
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.header-sub', '.footer-desc p', '.faq-item dt', '.faq-item dd'],
  },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  featureList: [
    '점심 맛집 룰렛 추천',
    '회식 장소 카테고리별 필터',
    '네이버 맵 길찾기 연결',
    '모바일 반응형',
  ],
  areaServed: pangyoTechnoValley,
};

// ── ItemList (엔티티 관계·콘텐츠 관계) ───────────────────────────────────────
const restaurantListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${siteUrl}/#restaurantlist`,
  name: '판교테크노밸리 주변 음식점 목록',
  description: `판교테크노밸리 유스페이스 A동 주변 점심 맛집 ${LUNCH_RESTAURANTS.length}곳 및 회식 장소 ${DINNER_RESTAURANTS.length}곳`,
  numberOfItems: ALL_RESTAURANTS.length,
  isPartOf: { '@id': `${siteUrl}/#webapp` },
  about: pangyoTechnoValley,
  itemListElement: ALL_RESTAURANTS.map((r, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Restaurant',
      name: r.name,
      servesCuisine: r.category,
      priceRange: '₩₩',
      areaServed: pangyoTechnoValley,
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

// ── FAQPage (대화형·자연어·음성 검색 최적화) ─────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/#faq`,
  about: pangyoTechnoValley,
  isPartOf: { '@id': `${siteUrl}/#website` },
  mainEntity: [
    {
      '@type': 'Question',
      name: '오늘 판교 점심 뭐 먹지? 추천해줘',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `판교Pick에서 룰렛을 돌리면 판교테크노밸리 주변 맛집 ${LUNCH_RESTAURANTS.length}곳 중 하나를 랜덤으로 추천해드립니다. 한식, 일식, 중식, 양식, 아시안, 분식, 샐러드, 패스트푸드 등 다양한 선택지가 있습니다.`,
      },
    },
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
      name: '유스페이스 A동 근처 밥집 어디 있어요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '유스페이스 A동 인근에는 담솥(유스페이스2 2층), 일상화식(유스페이스2 B동), 상록면(유스페이스1 지하 1층), 버거킹(유스페이스몰 1층), 이가네양꼬치(유스페이스 2층) 등이 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '판교 삼평동 점심 맛집 알려줘',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '판교 삼평동(판교테크노밸리) 인근 점심 맛집으로는 평가옥(평양냉면), 봉피양(평양냉면), 재크와콩나물(콩나물국밥), 킨파(연어덮밥), 팔복(중식), 동청담(짜장·짬뽕) 등이 있습니다.',
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
      name: '판교 회식 소고기 맛집 어디가 좋아요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '판교테크노밸리 주변 소고기·돼지고기 회식 장소로는 됐소, 황제갈비, 숙성도, 육미한우, 신도세기, 판교집 등이 있습니다. 판교Pick에서 카테고리를 "소/돼지"로 필터링 후 룰렛으로 선택하세요.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
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
