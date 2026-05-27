"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MarkerClusterer } from "react-kakao-maps-sdk";
import { useRestAreas } from "@/hooks/useRestAreas";
import { useCongestion } from "@/hooks/useCongestion";
import RestAreaCard from "@/components/rest-area/RestAreaCard";
import SkeletonCard from "@/components/common/SkeletonCard";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";

const KakaoMap = dynamic(() => import("@/components/map/KakaoMap"), { ssr: false });
const CongestionMarker = dynamic(() => import("@/components/map/CongestionMarker"), { ssr: false });

function RouteRestAreaItem({ restArea }: { restArea: RestArea }) {
  const { data: congestion } = useCongestion(restArea.id);
  return (
    <RestAreaCard
      restArea={restArea}
      congestionLevel={congestion?.level as CongestionLevel | undefined}
    />
  );
}

function RoutePageContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const { data: restAreas, isLoading } = useRestAreas();
  const [zoomLevel, setZoomLevel] = useState(13);

  return (
    <div className="flex h-full">
      {/* 지도 */}
      <div className="flex-1 relative hidden md:block">
        <KakaoMap onZoomChanged={setZoomLevel}>
          <MarkerClusterer minLevel={9}>
            {(restAreas ?? []).map((r) => (
              <CongestionMarker key={r.id} restArea={r} showLabel={zoomLevel <= 8} />
            ))}
          </MarkerClusterer>
        </KakaoMap>
      </div>

      {/* 결과 패널 */}
      <aside className="w-full md:w-96 flex flex-col border-l border-line bg-surface-card">
        <div className="px-4 py-3 border-b border-line flex items-center gap-2">
          <Link href="/" className="text-sm text-text-secondary hover:text-text-primary">
            ← 뒤로
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {from} → {to}
            </p>
            <p className="text-xs text-text-tertiary">경유 휴게소 {restAreas?.length ?? 0}개</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          {(restAreas ?? []).map((r) => (
            <RouteRestAreaItem key={r.id} restArea={r} />
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
