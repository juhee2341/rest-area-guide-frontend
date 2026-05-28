@AGENTS.md
@.claude/skills/vercel-react-best-practices/AGENTS.md
@.claude/skills/vercel-composition-patterns/AGENTS.md
@.claude/skills/vercel-react-view-transitions/AGENTS.md
@.claude/skills/vercel-optimize/AGENTS.md

# 고속도로 휴게소 가이드 — Agent Instructions

## 프로젝트 개요

고속도로 휴게소 혼잡도·인기 메뉴·주유 단가·편의시설을 제공하는 Next.js 웹 앱.
한국도로공사 Open API(`data.ex.co.kr`)를 Next.js Route Handlers로 프록시하여 사용한다.

## 기술 스택

| 영역 | 라이브러리 |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Data Fetching | TanStack Query v5 |
| State | Zustand v5 |
| Map | react-kakao-maps-sdk |
| Chart | Chart.js + react-chartjs-2 |
| Package Manager | pnpm |

## 개발 명령어

```bash
pnpm dev      # 개발 서버 (http://localhost:3000)
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint 검사
```

## 디렉토리 구조

```
src/
├── app/
│   ├── api/                  # Route Handlers (API 프록시)
│   │   ├── rest-areas/       # 휴게소 목록·상세·혼잡도·메뉴
│   │   ├── congestion/       # 전체 혼잡도
│   │   └── fuel/[id]/        # 주유 단가
│   ├── rest-area/[id]/       # 휴게소 상세 페이지
│   ├── route/                # 노선별 페이지
│   └── favorites/            # 즐겨찾기 페이지
├── components/
│   ├── common/               # CongestionBadge, FavoriteButton, SkeletonCard 등
│   ├── layout/               # GNB, BottomSheet, TabNav
│   ├── map/                  # KakaoMap, CongestionMarker, RoutePolyline
│   ├── rest-area/            # MenuCard, FacilityList, CongestionGauge
│   └── search/               # SearchBar, FilterBar
├── hooks/                    # TanStack Query 커스텀 훅
├── lib/expressway.ts         # 한국도로공사 API 호출 유틸 (단일 진입점)
├── store/favoriteStore.ts    # Zustand 즐겨찾기 스토어
└── types/                    # TypeScript 타입 정의
```

## 핵심 규칙

### 데이터 흐름
- 모든 외부 API 호출은 `src/lib/expressway.ts` 에서만 수행한다. 컴포넌트에서 직접 `data.ex.co.kr` 호출 금지.
- 클라이언트는 `/api/*` Route Handlers를 통해서만 데이터를 가져온다.
- 커스텀 훅(`src/hooks/`)은 TanStack Query로 서버 상태를 관리한다.

### 컴포넌트
- 카카오 맵 관련 컴포넌트(`KakaoMap`, `CongestionMarker`)는 반드시 `dynamic(..., { ssr: false })` 로 로드한다.
- 반응형 레이아웃: 데스크톱은 사이드패널(`aside`), 모바일은 `BottomSheet` 컴포넌트 사용.
- 새 컴포넌트 작성 시 `vercel-react-best-practices` 및 `vercel-composition-patterns` 스킬 규칙을 따른다.

### 캐싱 전략
| 데이터 | 전략 |
|--------|------|
| 휴게소 목록·편의시설 | `next: { revalidate: 86400 }` (24시간) |
| 인기 메뉴·주유 단가 | `next: { revalidate: 3600 }` (1시간) |
| 혼잡도(교통량) | `cache: "no-store"` (실시간) |

### 환경 변수
- `NEXT_PUBLIC_KAKAO_MAP_KEY` — 카카오 지도 JavaScript 키 (클라이언트 노출 허용)
- `EXPRESSWAY_API_KEY` — 한국도로공사 API 키 (서버 전용, 절대 클라이언트 노출 금지)

## 설치된 Vercel Agent Skills

| 스킬 | 적용 시점 |
|------|----------|
| `vercel-react-best-practices` | React/Next.js 코드 작성·리팩토링·리뷰 시 |
| `vercel-composition-patterns` | 컴포넌트 설계·불리언 prop 리팩토링 시 |
| `vercel-react-view-transitions` | 페이지 전환·애니메이션 구현 시 |
| `vercel-optimize` | 성능 최적화·Vercel 비용 절감 작업 시 |
| `deploy-to-vercel` | Vercel 배포 요청 시 |
| `vercel-cli-with-tokens` | 토큰 기반 Vercel CLI 작업 시 |
| `web-design-guidelines` | UI 접근성·디자인 리뷰 시 |
