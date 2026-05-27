"use client";

import Link from "next/link";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";
import CongestionBadge from "@/components/common/CongestionBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

interface Props {
  restArea: RestArea;
  congestionLevel?: CongestionLevel;
  bestMenu?: string;
  highlighted?: boolean;
}

export default function RestAreaCard({ restArea, congestionLevel, bestMenu, highlighted }: Props) {
  return (
    <Link
      href={`/rest-area/${restArea.id}?stdRestCd=${restArea.stdRestCd}`}
      className={`block p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
        highlighted ? "border-blue-400 bg-blue-50" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {congestionLevel && <CongestionBadge level={congestionLevel} />}
          <span className="font-semibold text-base">{restArea.name}</span>
        </div>
        <FavoriteButton id={restArea.id} />
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {restArea.routeName} · {restArea.direction}
      </p>
      {bestMenu && (
        <p className="text-sm text-gray-600 mt-1">
          🍽 {bestMenu}
        </p>
      )}
    </Link>
  );
}
