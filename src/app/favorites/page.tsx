"use client";

import Link from "next/link";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useRestAreas } from "@/hooks/useRestAreas";
import { useCongestion } from "@/hooks/useCongestion";
import CongestionBadge from "@/components/common/CongestionBadge";
import EmptyState from "@/components/common/EmptyState";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";

function FavoriteItem({ restArea }: { restArea: RestArea }) {
  const { data: congestion } = useCongestion(restArea.id);
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <Link href={`/rest-area/${restArea.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {congestion && <CongestionBadge level={congestion.level as CongestionLevel} />}
          <span className="font-medium text-sm truncate">{restArea.name}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {restArea.routeName} · {restArea.direction}
        </p>
      </Link>
      <button
        onClick={() => removeFavorite(restArea.id)}
        className="text-xs text-gray-400 hover:text-red-400 flex-shrink-0"
      >
        삭제
      </button>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, recentVisits } = useFavoriteStore();
  const { data: restAreas } = useRestAreas();

  const favoriteAreas = (restAreas ?? []).filter((r) => favorites.includes(r.id));
  const recentAreas = (restAreas ?? []).filter((r) =>
    recentVisits.some((rv) => rv.id === r.id)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-bold mb-4">⭐ 즐겨찾기 ({favoriteAreas.length})</h1>

      {favoriteAreas.length === 0 ? (
        <EmptyState
          message="아직 즐겨찾기한 휴게소가 없습니다."
          showMapLink
        />
      ) : (
        <div className="mb-8">
          {favoriteAreas.map((r) => (
            <FavoriteItem key={r.id} restArea={r} />
          ))}
        </div>
      )}

      {recentVisits.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-600 mb-3">최근 방문</h2>
          <div>
            {recentVisits.map((rv) => {
              const area = recentAreas.find((r) => r.id === rv.id);
              return (
                <div key={rv.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <Link href={`/rest-area/${rv.id}`} className="text-sm hover:text-blue-600">
                    {area?.name ?? rv.name}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {new Date(rv.visitedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
