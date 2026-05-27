"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { MarkerClusterer } from "react-kakao-maps-sdk";
import { useRestAreas } from "@/hooks/useRestAreas";
import { useAllCongestion } from "@/hooks/useAllCongestion";
import RestAreaCard from "@/components/rest-area/RestAreaCard";
import FilterBar from "@/components/search/FilterBar";
import SearchBar from "@/components/search/SearchBar";
import SkeletonCard from "@/components/common/SkeletonCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import BottomSheet from "@/components/layout/BottomSheet";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";

const KakaoMap = dynamic(() => import("@/components/map/KakaoMap"), { ssr: false });
const CongestionMarker = dynamic(() => import("@/components/map/CongestionMarker"), { ssr: false });

interface Filters {
  route: string;
  direction: string;
  congestion: string;
}

export default function MainPage() {
  const { data: restAreas, isLoading, isError, refetch } = useRestAreas();
  const { data: congestionMap } = useAllCongestion();
  const [filters, setFilters] = useState<Filters>({ route: "", direction: "", congestion: "" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const resetFilters = () => setFilters({ route: "", direction: "", congestion: "" });

  useEffect(() => {
    if (selectedId) {
      itemRefs.current.get(selectedId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  const areas = Array.isArray(restAreas) ? restAreas : [];

  const filtered = areas.filter((r: RestArea) => {
    if (filters.route && !r.routeName.includes(filters.route)) return false;
    if (filters.direction && r.direction !== filters.direction) return false;
    return true;
  });

  const statusContent = (
    <>
      {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      {isError && <ErrorMessage onRetry={refetch} />}
      {!isLoading && !isError && filtered.length === 0 && <EmptyState onReset={resetFilters} />}
    </>
  );

  const renderItems = (withRef: boolean) =>
    filtered.map((r: RestArea) => (
      <div
        key={r.id}
        ref={
          withRef
            ? (el) => { if (el) itemRefs.current.set(r.id, el); else itemRefs.current.delete(r.id); }
            : undefined
        }
        onMouseEnter={() => setHoveredId(r.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <RestAreaCard
          restArea={r}
          congestionLevel={congestionMap?.[r.id]?.level}
          highlighted={hoveredId === r.id || selectedId === r.id}
        />
      </div>
    ));

  return (
    <div className="flex h-full">
      {/* 지도 */}
      <div className="flex-1 relative">
        <KakaoMap onZoomChanged={setZoomLevel}>
          <MarkerClusterer minLevel={9}>
            {areas.map((r: RestArea) => (
              <CongestionMarker
                key={r.id}
                restArea={r}
                congestionLevel={congestionMap?.[r.id]?.level as CongestionLevel | undefined}
                onClick={() => setSelectedId(r.id)}
                showLabel={zoomLevel <= 8}
              />
            ))}
          </MarkerClusterer>
        </KakaoMap>
      </div>

      {/* 데스크톱 사이드 패널 */}
      <aside className="hidden md:flex flex-col w-96 border-l border-line bg-surface-card">
        <SearchBar />
        <FilterBar filters={filters} onChange={setFilters} />
        <p className="px-3 py-2 text-xs text-text-tertiary">총 {filtered.length}개</p>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {statusContent}
          {renderItems(true)}
        </div>
      </aside>

      {/* 모바일 BottomSheet */}
      <BottomSheet>
        <SearchBar />
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="mt-2 space-y-2">
          {statusContent}
          {renderItems(false)}
        </div>
      </BottomSheet>
    </div>
  );
}
