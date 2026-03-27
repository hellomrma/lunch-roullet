// ── 카테고리 타입 ─────────────────────────────────────────────────────────────

export type LunchCategory =
  | '한식' | '일식' | '중식' | '양식' | '아시안' | '분식' | '샐러드' | '패스트푸드';

export type DinnerCategory =
  | '소고기/돼지고기' | '양고기/닭고기' | '해산물'
  | '샤브샤브/훠궈' | '호프/주점' | '뷔페' | '기타';

export type Category = LunchCategory | DinnerCategory;

export const DINNER_CATEGORIES: DinnerCategory[] = [
  '소고기/돼지고기', '양고기/닭고기', '해산물',
  '샤브샤브/훠궈', '호프/주점', '뷔페', '기타',
];

/** 카테고리 칩 표시용 짧은 이름 */
export const DINNER_CATEGORY_LABELS: Record<DinnerCategory, string> = {
  '소고기/돼지고기': '소/돼지',
  '양고기/닭고기': '양/닭',
  '해산물': '해산물',
  '샤브샤브/훠궈': '샤브/훠궈',
  '호프/주점': '호프/주점',
  '뷔페': '뷔페',
  '기타': '기타',
};

// ── 음식점 인터페이스 ────────────────────────────────────────────────────────

export interface Restaurant {
  name: string;
  category: Category;
  address?: string;
  menu?: string[];
  /** 네이버 플레이스 단축 URL (있으면 검색 대신 직접 연결) */
  naverUrl?: string;
}

// ── 런치 데이터 ───────────────────────────────────────────────────────────────

export const LUNCH_RESTAURANTS: Restaurant[] = [
  // 한식
  { name: '담솥',        category: '한식',    address: '대왕판교로 670 유스페이스2 2층 224호', menu: ['가지솥밥', '스테이크솥밥'] },
  { name: '화포식당',    category: '한식',    address: '대왕판교로 660 유스페이스1 2층 240호', menu: ['삼겹살', '목살'] },
  { name: '평가옥',      category: '한식',    address: '삼평동 인근',                          menu: ['평양냉면', '온면'] },
  { name: '봉피양',      category: '한식',    address: '삼평동 681 인근',                      menu: ['평양냉면', '수육'] },
  { name: '재크와콩나물',category: '한식',    address: '삼평동 인근',                          menu: ['콩나물국밥', '이모카세'] },
  { name: '조재벌식당',  category: '한식',    address: '삼평동 인근',                          menu: ['삼겹살', '고기구이'] },
  { name: '토속상황삼계탕', category: '한식', address: '대왕판교로 670 인근',                  menu: ['삼계탕', '토종닭백숙'] },
  { name: '진진반상',    category: '한식',    address: '대왕판교로 660 유스페이스1 A동 지하 1층', menu: ['제육볶음 정식', '된장찌개 정식', '비빔밥'] },
  { name: '춘업순댓국',  category: '한식',    address: '판교역로 231 에이치스퀘어 에스동 지하 1층', menu: ['순댓국', '얼큰순댓국', '소고기순댓국'] },
  // 일식
  { name: '일상화식',    category: '일식',    address: '대왕판교로 670 유스페이스2 B동 226호', menu: ['카이센동', '일본 가정식 정식'] },
  { name: '상록면',      category: '일식',    address: '대왕판교로 670 유스페이스1 지하 1층',  menu: ['고등어소바', '모리소바'] },
  { name: '킨파',        category: '일식',    address: '삼평동 617 브릿지타워 1층',            menu: ['연어덮밥(츠케동)', '카이센동'] },
  { name: '서호돈가스',  category: '일식',    address: '판교역로 231 에이치스퀘어 에스동 124호', menu: ['히레가스 정식', '로스가스 정식'] },
  { name: '카츠쇼쿠도우',category: '일식',    address: '판교역로 152',                         menu: ['로스카츠 정식', '히레카츠 정식'] },
  { name: '스시쿤',      category: '일식',    address: '유스페이스몰1 B1 115호',               menu: ['오마카세', '스시'] },
  { name: '소바니우동',  category: '일식',    address: '삼평동 인근',                          menu: ['냉우동', '온우동'] },
  { name: '이가네양꼬치',category: '일식',    address: '대왕판교로 670 유스페이스 2층',         menu: ['양등심꼬치', '양왕갈비'] },
  // 중식
  { name: '동청담',      category: '중식',    address: '대왕판교로606번길 45',                 menu: ['유니짜장', '옛날짬뽕'] },
  { name: '락앤웍',      category: '중식',    address: '판교역로 231 에이치스퀘어 에스동 지하 1층', menu: ['짜장면', '짬뽕', '볶음밥'] },
  // 아시안
  { name: '르메콩',      category: '아시안',  address: '대왕판교로 670 유스페이스 인근',        menu: ['소고기쌀국수', '나시고렝'] },
  // 분식
  { name: '해미옥',      category: '분식',    address: '대왕판교로606번길 41',                 menu: ['해물칼국수'] },
];

export const LUNCH_RESTAURANT_NAMES = LUNCH_RESTAURANTS.map((r) => r.name);

// ── 회식 데이터 ───────────────────────────────────────────────────────────────

export const DINNER_RESTAURANTS: Restaurant[] = [
  // 소고기/돼지고기
  { name: '됐소',         category: '소고기/돼지고기', naverUrl: 'https://naver.me/xWNitO8h' },
  { name: '황제갈비',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/FCbBOEs5' },
  { name: '육미한우',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/5lZCC7Dh' },
  { name: '원조부안집',   category: '소고기/돼지고기', naverUrl: 'https://naver.me/5SWLS6kt' },
  { name: '화포식당',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/5s93mXwI' },
  { name: '신도세기',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/GC2uaBzH' },
  { name: '돈블랑',       category: '소고기/돼지고기', naverUrl: 'https://naver.me/535BUO3o' },
  { name: '숙성도',       category: '소고기/돼지고기', naverUrl: 'https://naver.me/F74VxSNk' },
  { name: '토평한우소곱창', category: '소고기/돼지고기', naverUrl: 'https://naver.me/xB4hwuNp' },
  { name: '삼대곱창',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/GBflev6M' },
  { name: '감성쪽갈비',   category: '소고기/돼지고기', naverUrl: 'https://naver.me/xpPaDsUL' },
  { name: '판교집',       category: '소고기/돼지고기', naverUrl: 'https://naver.me/FFviHPuJ', menu: ['냉삼'] },
  { name: '마왕족발',     category: '소고기/돼지고기', naverUrl: 'https://naver.me/xkxqS4P4' },
  { name: '순우가',       category: '소고기/돼지고기', address: '대왕판교로645번길 36 NS별관 지하 1층', menu: ['한우 육사시미', '한우 육회', '갈비탕'] },
  { name: '한와담',       category: '소고기/돼지고기', address: '백현동 알파돔타워 1층',               menu: ['숙성채끝등심', '숙성눈꽃등심'] },

  // 양고기/닭고기
  { name: '이가네양갈비', category: '양고기/닭고기', naverUrl: 'https://naver.me/54VkJJmo' },
  { name: '이가네양꼬치', category: '양고기/닭고기', naverUrl: 'https://naver.me/xpPaDsUL' },
  { name: '진1926',       category: '양고기/닭고기', naverUrl: 'https://naver.me/54VkJJmo' },
  { name: '팔각도',       category: '양고기/닭고기', naverUrl: 'https://naver.me/GLAbcnmm' },

  // 해산물
  { name: '판교장어타운', category: '해산물', naverUrl: 'https://naver.me/xevs2isI' },
  { name: '도원참치',     category: '해산물', naverUrl: 'https://naver.me/xmrPq8xy' },
  { name: '해도락',       category: '해산물', naverUrl: 'https://naver.me/5rsMMDK0' },
  { name: '자연횟집',     category: '해산물', naverUrl: 'https://naver.me/52MTnWqk' },
  { name: '천야',         category: '해산물', naverUrl: 'https://naver.me/Ft8lYAzz' },
  { name: '문어집',       category: '해산물', naverUrl: 'https://naver.me/5JJQ3UTT' },
  { name: '문막집',       category: '해산물', naverUrl: 'https://naver.me/G14On6tL' },
  { name: '전설의 골뱅이',category: '해산물', naverUrl: 'https://naver.me/GnGCvJ70' },
  { name: '우나기강',     category: '해산물', naverUrl: 'https://naver.me/FxFKfcwn' },
  { name: '일품참치',     category: '해산물', address: '판교역로192번길 14-2 2층',                  menu: ['참치 무한리필', '오도로', '가마도로'] },
  { name: '이춘복참치',   category: '해산물', address: '동판교로177번길 25 아브뉴프랑 판교 2층',    menu: ['참치 일반정식', '참치 특정식'] },

  // 샤브샤브/훠궈
  { name: '제이스팟',     category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/FU39uWvv' },
  { name: '수작',         category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/GB0Cv7wS', menu: ['샤브샤브', '굴림만두', '냉면'] },
  { name: '소바니우동',   category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/xM2cDpYg', menu: ['스끼야끼'] },
  { name: '훠궈야',       category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/FslKlPRe' },
  { name: '진스키야키',   category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/5k7fZeOr' },
  { name: '팔복',         category: '샤브샤브/훠궈', naverUrl: 'https://naver.me/FxFKfcwn' },

  // 호프/주점
  { name: '아침산저녁바다', category: '호프/주점', naverUrl: 'https://naver.me/Gw5b43wG' },
  { name: '펀비어킹',     category: '호프/주점', naverUrl: 'https://naver.me/GZAj0Bl8' },
  { name: '육회한김스지', category: '호프/주점', naverUrl: 'https://naver.me/I5Fca7ve' },
  { name: '짝태앤노가리', category: '호프/주점', naverUrl: 'https://naver.me/xVlD3QkX' },
  { name: '사쿠라테이엔', category: '호프/주점', naverUrl: 'https://naver.me/xGOyiDWf' },
  { name: '야키토리잔잔', category: '호프/주점', address: '판교역로 178 서건타워 1층 101호',        menu: ['야키토리', '모츠야키', '하이볼'] },
  { name: '업투유',       category: '호프/주점', address: '삼평동 인근',                           menu: ['요리주점 안주', '사케', '하이볼'] },

  // 뷔페
  { name: '마키노차야',   category: '뷔페', naverUrl: 'https://naver.me/54VkJJmo' },

  // 기타
  { name: '평가옥',       category: '기타', naverUrl: 'https://naver.me/xM2cDpYg', menu: ['오복쟁반'] },
  { name: '감성타코',     category: '기타', naverUrl: 'https://naver.me/FwnAkMWE' },
  { name: '구우트',       category: '기타', naverUrl: 'https://naver.me/5ITJbUvJ' },
  { name: '이자카야 단',  category: '기타', naverUrl: 'https://naver.me/G7KDZEPp' },
  { name: '미미판교',     category: '기타', naverUrl: 'https://naver.me/GazEP1sy' },
  { name: '옥된장',       category: '기타', naverUrl: 'https://naver.me/5P2CvMdx' },
  { name: '매드포갈릭',   category: '기타', naverUrl: 'https://naver.me/5k7fZeOr' },
  { name: '빈티지1988',   category: '기타', naverUrl: 'https://naver.me/G8s9j5n3' },
  { name: '라디오베이',   category: '기타', address: '판교역로192번길 12 판교미래에셋센터 2층',   menu: ['콥샐러드', '페퍼로니 피자', '파스타'] },
  { name: '락앤웍',       category: '기타', address: '판교역로 231 에이치스퀘어 에스동 지하 1층', menu: ['코스요리', '짜장면'] },
];

export const DINNER_RESTAURANT_NAMES = DINNER_RESTAURANTS.map((r) => r.name);

/** 이름으로 음식점 검색 (런치 + 회식 통합) */
export const ALL_RESTAURANTS = [...LUNCH_RESTAURANTS, ...DINNER_RESTAURANTS];
