# 고속도로 휴게소 가이드

고속도로 휴게소의 혼잡도·인기 메뉴·편의시설·날씨를 한눈에 확인할 수 있는 웹 서비스입니다.

배포 주소: https://rest-area-guide-frontend.vercel.app

## 주요 기능

| 기능 | 설명 |
|------|------|
| 실시간 혼잡도 | 한국도로공사 교통량 데이터 기반 여유/보통/혼잡 표시 |
| 인기 메뉴 | 베스트·추천·프리미엄 메뉴 조회 |
| 편의시설 정보 | 주유소(단가 포함)·전기차 충전·샤워실·ATM·카페·편의점 |
| 현황 요약 | 혼잡도·날씨·시설·인기 메뉴를 칩(chip) 형태로 요약 |
| 날씨 정보 | Open-Meteo(무료) 기반 현재 기온·날씨 상태 표시 |
| 카카오 지도 | 혼잡도 색상 마커 + 마커 클러스터링 |
| 노선별 보기 | 경부·서해안·호남·남해 등 노선별 휴게소 목록 |
| 즐겨찾기 | 즐겨찾기 저장 및 최근 방문 내역 |
| 필터·검색 | 노선·방향·혼잡도 필터, 휴게소명 검색 |
| 반응형 UI | 데스크톱 사이드패널 + 모바일 바텀시트 |

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 / TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: TanStack Query v5
- **State**: Zustand v5
- **Map**: react-kakao-maps-sdk
- **Package Manager**: pnpm

## 외부 API

### 한국도로공사 Open API (`data.ex.co.kr`)

| 엔드포인트 | 용도 | 캐시 |
|-----------|------|------|
| `/locationinfo/locationinfoRest` | 휴게소 목록 | 24시간 |
| `/restinfo/restConvList` | 편의시설 목록 | 24시간 |
| `/odtraffic/trafficAmountByUnit` | 교통량 기반 혼잡도 | 실시간 |
| `/business/curStateStation` | 주유 단가 | 1시간 |
| `/restinfo/restBestfoodList` | 인기 메뉴 | 1시간 |

### 날씨 API (데이터 융합)

- **Open-Meteo** — 키 불필요, 무료. 기본 날씨 소스
- **기상청 초단기실황** — `DATA_GO_KR_API_KEY` 설정 시 우선 사용

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=<카카오 지도 JavaScript 키>
EXPRESSWAY_API_KEY=<한국도로공사 API 키>
DATA_GO_KR_API_KEY=<공공데이터포털 API 키> # 선택 — 기상청 날씨 사용 시
```

- 카카오 지도 키: [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 키 → JavaScript 키
  - **카카오 콘솔에서 사이트 도메인 등록 필수** (플랫폼 → Web → 사이트 도메인)
- 한국도로공사 API 키: [data.ex.co.kr](https://data.ex.co.kr) 회원가입 후 발급

### 개발 서버 실행

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` 에서 확인합니다.

### 빌드

```bash
pnpm build
pnpm start
```

## 페이지 구조

```
/                   메인 — 카카오 지도 + 휴게소 목록
/rest-area/[id]     휴게소 상세 (혼잡도·현황 요약·메뉴·편의시설)
/route              노선별 휴게소 목록 (지도 + 리스트)
/favorites          즐겨찾기 및 최근 방문 내역
```

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── rest-areas/         휴게소 목록·상세·혼잡도·메뉴
│   │   ├── congestion/         전체 혼잡도 (지도용)
│   │   ├── fuel/[id]/          주유 단가
│   │   └── weather/            날씨 (Open-Meteo / 기상청)
│   ├── rest-area/[id]/         휴게소 상세 페이지
│   ├── route/                  노선별 페이지
│   └── favorites/              즐겨찾기 페이지
├── components/
│   ├── common/                 CongestionBadge, FavoriteButton, SkeletonCard 등
│   ├── layout/                 GNB, BottomSheet, TabNav
│   ├── map/                    KakaoMap, CongestionMarker
│   ├── rest-area/              AiRecommendCard, CongestionGauge, FacilityList, MenuCard
│   └── search/                 SearchBar, FilterBar
├── hooks/                      TanStack Query 커스텀 훅
├── lib/
│   ├── expressway.ts           한국도로공사 API 호출 (단일 진입점)
│   ├── weather.ts              날씨 데이터 통합 (Open-Meteo + 기상청)
│   ├── recommend.ts            현황 요약 규칙 기반 생성
│   └── clusterStyles.ts        마커 클러스터 스타일
├── store/
│   └── favoriteStore.ts        Zustand 즐겨찾기·최근 방문 스토어
└── types/                      TypeScript 타입 정의
```
