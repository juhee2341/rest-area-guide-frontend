"use client";

import { useState, use, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRestArea } from "@/hooks/useRestArea";
import { useCongestion } from "@/hooks/useCongestion";
import { useMenus } from "@/hooks/useMenus";
import { useFuel } from "@/hooks/useFuel";
import CongestionGauge from "@/components/rest-area/CongestionGauge";
import MenuList from "@/components/rest-area/MenuList";
import FacilityList from "@/components/rest-area/FacilityList";
import TabNav from "@/components/layout/TabNav";
import FavoriteButton from "@/components/common/FavoriteButton";
import SkeletonCard from "@/components/common/SkeletonCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useFavoriteStore } from "@/store/favoriteStore";

const TABS = [
  { key: "menu", label: "메뉴" },
  { key: "facility", label: "편의시설" },
];

function RestAreaDetailContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const stdRestCd = searchParams.get("stdRestCd") ?? undefined;
  const [tab, setTab] = useState("menu");

  const { data: detail, isLoading: loadingDetail, isError: errorDetail } = useRestArea(id, stdRestCd);
  const { data: congestion, isLoading: loadingCongestion } = useCongestion(id);
  const { data: menus, isLoading: loadingMenus } = useMenus(id, stdRestCd);
  const { data: fuel } = useFuel(id, stdRestCd);
  const addRecentVisit = useFavoriteStore((s) => s.addRecentVisit);

  useEffect(() => {
    if (detail) addRecentVisit({ id: detail.id, name: detail.name });
  }, [detail, addRecentVisit]);

  if (loadingDetail) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (errorDetail || !detail) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <ErrorMessage />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
        <Link href="/" className="text-text-secondary hover:text-text-primary text-sm">
          ← 뒤로
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate" style={{ letterSpacing: "-0.02em" }}>{detail.name}</h1>
          <p className="text-sm text-text-secondary">
            {detail.routeName} · {detail.direction}{detail.operTime ? ` · 운영: ${detail.operTime}` : ""}
          </p>
        </div>
        <FavoriteButton id={id} />
      </div>

      {/* 혼잡도 */}
      <div className="px-4 py-4 border-b border-line">
        {loadingCongestion ? (
          <div className="space-y-2">
            <div className="h-4 w-24 bg-surface-subtle rounded animate-pulse" />
            <div className="h-2 w-full bg-surface-subtle rounded-full animate-pulse" />
            <div className="h-3 w-32 bg-surface-subtle rounded animate-pulse" />
          </div>
        ) : congestion ? (
          <CongestionGauge congestion={congestion} />
        ) : null}
      </div>

      {/* 탭 */}
      <TabNav tabs={TABS} active={tab} onChange={setTab} />

      <div className="px-4 py-4">
        {tab === "menu" && (
          <>
            {loadingMenus && <SkeletonCard />}
            {!loadingMenus && menus && <MenuList menus={menus} />}
            {!loadingMenus && menus?.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-8">메뉴 정보가 없습니다.</p>
            )}
          </>
        )}

        {tab === "facility" && (
          detail.facilities
            ? <FacilityList
                facilities={detail.facilities}
                fuelGasoline={fuel?.gasoline}
                fuelDiesel={fuel?.diesel}
                fuelLpg={fuel?.lpg}
                oilCompany={fuel?.oilCompany}
              />
            : <p className="text-sm text-text-tertiary text-center py-8">편의시설 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default function RestAreaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-4 space-y-4"><SkeletonCard /><SkeletonCard /></div>}>
      <RestAreaDetailContent id={id} />
    </Suspense>
  );
}
