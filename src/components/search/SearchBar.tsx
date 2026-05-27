"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    router.push(`/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 p-3 bg-surface-card border-b border-line">
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="출발지"
        className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-text-tertiary"
      />
      <span className="text-text-tertiary text-sm">→</span>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="목적지"
        className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-text-tertiary"
      />
      <button
        type="submit"
        className="flex-shrink-0 px-3 py-2 bg-brand text-white text-sm rounded-lg hover:bg-brand-hover"
      >
        검색
      </button>
    </form>
  );
}
