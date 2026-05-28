"use client";

import type { SituationSummary } from "@/lib/recommend";

interface Props {
  situation?: SituationSummary;
  isLoading?: boolean;
}

export default function AiRecommendCard({ situation, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-line p-4 space-y-3">
        <div className="h-3.5 w-20 bg-surface-subtle rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 w-16 bg-surface-subtle rounded-full animate-pulse" />
          ))}
        </div>
        <div className="h-3 w-4/5 bg-surface-subtle rounded animate-pulse" />
      </div>
    );
  }

  if (!situation || situation.items.length === 0) return null;

  return (
    <div className="rounded-xl border border-line p-4 space-y-3">
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">현황 요약</p>

      {/* 상태 칩 */}
      <div className="flex flex-wrap gap-2">
        {situation.items.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
              item.highlight
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-line bg-surface-subtle text-text-secondary"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>

      {/* 핵심 팁 */}
      {situation.tip && (
        <p className="text-sm text-text-secondary">{situation.tip}</p>
      )}
    </div>
  );
}
