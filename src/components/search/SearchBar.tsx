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
    <form onSubmit={handleSearch} className="flex items-center gap-2 p-3 bg-white border-b border-gray-100">
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="출발지"
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <span className="text-gray-400 text-sm">→</span>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="목적지"
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
      >
        검색
      </button>
    </form>
  );
}
