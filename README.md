# 고속도로 휴게소 가이드

고속도로 휴게소의 혼잡도·인기 메뉴·주유 단가·편의시설을 한눈에 확인할 수 있는 웹 서비스입니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 실시간 혼잡도 | 한국도로공사 교통량 데이터 기반 여유/보통/혼잡 표시 |
| 인기 메뉴 | 베스트·추천·프리미엄·계절 메뉴 조회 |
| 주유 단가 | 휘발유·경유·LPG 현재 단가 조회 |
| 편의시설 정보 | 주유소·전기차 충전·샤워실·ATM·카페 등 |
| 카카오 지도 | 마커 클러스터링 및 혼잡도 색상 마커 |
| 즐겨찾기 | Zustand 기반 로컬 즐겨찾기 |
| 반응형 UI | 데스크톱 사이드패널 + 모바일 바텀시트 |

## 기술 스택

- **Framework**: Next.js 16.2.6 (App Router)
- **Runtime**: React 19.2.4 / TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: TanStack Query v5
- **State**: Zustand v5
- **Map**: react-kakao-maps-sdk
- **Chart**: Chart.js / react-chartjs-2
- **Package Manager**: pnpm

## 외부 API

[한국도로공사 Open API](https://data.ex.co.kr) (`data.ex.co.kr`) 사용.

| 엔드포인트 | 용도 |
|-----------|------|
| `/locationinfo/locationinfoRest` | 휴게소 목록 (24시간 캐시) |
| `/restinfo/restConvList` | 편의시설 목록 (24시간 캐시) |
| `/odtraffic/trafficAmountByUnit` | 교통량 기반 혼잡도 (no-cache) |
| `/business/curStateStation` | 주유 단가 (1시간 캐시) |
| `/restinfo/restBestfoodList` | 인기 메뉴 (1시간 캐시) |

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=<카카오 지도 앱 키>
EXPRESSWAY_API_KEY=<한국도로공사 API 키>
```

- 카카오 지도 앱 키: [Kakao Developers](https://developers.kakao.com) > 내 애플리케이션 > 앱 키 > JavaScript 키
- 한국도로공사 API 키: [공공데이터포털](https://www.data.go.kr) 또는 [data.ex.co.kr](https://data.ex.co.kr) 에서 발급

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
/rest-area/[id]     휴게소 상세 (시설·메뉴·주유 단가·혼잡도)
/route              노선별 휴게소 목록
/favorites          즐겨찾기 목록
```

## 프로젝트 구조

```
src/
├── app/
│   ├── api/            Route Handlers (한국도로공사 API 프록시)
│   ├── rest-area/[id]/ 휴게소 상세 페이지
│   ├── route/          노선 페이지
│   └── favorites/      즐겨찾기 페이지
├── components/
│   ├── common/         공통 UI (CongestionBadge, FavoriteButton 등)
│   ├── layout/         GNB, BottomSheet, TabNav
│   ├── map/            KakaoMap, CongestionMarker, RoutePolyline
│   ├── rest-area/      MenuCard, FacilityList, CongestionGauge
│   └── search/         SearchBar, FilterBar
├── hooks/              TanStack Query 커스텀 훅
├── lib/                expressway.ts — API 호출 유틸
├── store/              Zustand 스토어 (즐겨찾기)
└── types/              TypeScript 타입 정의
```
