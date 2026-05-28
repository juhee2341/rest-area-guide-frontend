"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROUTES = [
  { value: "경부", label: "경부선" },
  { value: "서해안", label: "서해안선" },
  { value: "호남", label: "호남선" },
  { value: "남해", label: "남해선" },
  { value: "순천완주", label: "순천완주선" },
  { value: "청주영덕", label: "청주영덕선" },
  { value: "무안광주", label: "무안광주선" },
];

export default function SearchBar() {
  const router = useRouter();
  const [route, setRoute] = useState("");
  const [direction, setDirection] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!route) return;
    const params = new URLSearchParams({ route });
    if (direction) params.set("direction", direction);
    router.push(`/route?${params}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 p-3 bg-surface-card border-b border-line">
      <select
        value={route}
        onChange={(e) => setRoute(e.target.value)}
        className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand text-text-secondary bg-surface-bg"
      >
        <option value="">노선 선택</option>
        {ROUTES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <select
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand text-text-secondary bg-surface-bg"
      >
        <option value="">방향 전체</option>
        <option value="상행">상행</option>
        <option value="하행">하행</option>
      </select>
      <button
        type="submit"
        disabled={!route}
        className="flex-shrink-0 px-3 py-2 bg-brand text-white text-sm rounded-lg hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        검색
      </button>
    </form>
  );
}
