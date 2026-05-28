"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MarkerClusterer } from "react-kakao-maps-sdk";
import { useRestAreas } from "@/hooks/useRestAreas";
import { useAllCongestion } from "@/hooks/useAllCongestion";
import RestAreaCard from "@/components/rest-area/RestAreaCard";
import SkeletonCard from "@/components/common/SkeletonCard";
import EmptyState from "@/components/common/EmptyState";
import { CLUSTER_STYLES } from "@/lib/clusterStyles";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";

const KakaoMap = dynamic(() => import("@/components/map/KakaoMap"), { ssr: false });
const CongestionMarker = dynamic(() => import("@/components/map/CongestionMarker"), { ssr: false });

const ROUTE_LABELS: Record<string, string> = {
  경부: "경부선",
  서해안: "서해안선",
  호남: "호남선",
  남해: "남해선",
  순천완주: "순천완주선",
  청주영덕: "청주영덕선",
  무안광주: "무안광주선",
};

function RoutePageContent() {
  const searchParams = useSearchParams();
  const route = searchParams.get("route") ?? "";
  const direction = searchParams.get("direction") ?? "";
  const [zoomLevel, setZoomLevel] = useState(13);

  const { data: restAreas, isLoading } = useRestAreas();
  const { data: congestionMap } = useAllCongestion();

  const areas = Array.isArray(restAreas) ? restAreas : [];

  const filtered = areas
    .filter((r: RestArea) => {
      if (route && !r.routeName.includes(route)) return false;
      if (direction && !r.direction.includes(direction)) return false;
      return true;
    })
    .sort((a, b) => direction === "하행" ? b.lat - a.lat : a.lat - b.lat);

  const title = `${ROUTE_LABELS[route] ?? route}${direction ? ` ${direction}` : ""}`;

  return (
    <div className="flex h-full">
      <div className="flex-1 relative hidden md:block">
        <KakaoMap onZoomChanged={setZoomLevel}>
          <MarkerClusterer minLevel={9} styles={CLUSTER_STYLES}>
            {filtered.map((r: RestArea) => (
              <CongestionMarker
                key={r.id}
                restArea={r}
                congestionLevel={congestionMap?.[r.id]?.level as CongestionLevel | undefined}
                showLabel={zoomLevel <= 8}
              />
            ))}
          </MarkerClusterer>
        </KakaoMap>
      </div>

      <aside className="w-full md:w-96 flex flex-col border-l border-line bg-surface-card">
        <div className="px-4 py-3 border-b border-line flex items-center gap-3">
          <Link href="/" className="text-sm text-text-secondary hover:text-text-primary">
            ← 뒤로
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{title}</p>
            <p className="text-xs text-text-tertiary">경유 휴게소 {filtered.length}개</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          {!isLoading && filtered.length === 0 && <EmptyState onReset={() => {}} />}
          {filtered.map((r: RestArea) => (
            <RestAreaCard
              key={r.id}
              restArea={r}
              congestionLevel={congestionMap?.[r.id]?.level as CongestionLevel | undefined}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function RoutePage() {
  return (
    <Suspense>
      <RoutePageContent />
    </Suspense>
  );
}
