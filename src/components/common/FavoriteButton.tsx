"use client";

import { useFavoriteStore } from "@/store/favoriteStore";

interface Props {
  id: string;
  className?: string;
}

export default function FavoriteButton({ id, className = "" }: Props) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const active = isFavorite(id);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
      aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      className={`text-xl transition-colors ${active ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"} ${className}`}
    >
      ★
    </button>
  );
}
