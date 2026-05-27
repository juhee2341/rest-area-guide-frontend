"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RecentVisit } from "@/types/rest-area";

const MAX_RECENT = 5;

interface FavoriteStore {
  favorites: string[];
  recentVisits: RecentVisit[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecentVisit: (item: Omit<RecentVisit, "visitedAt">) => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentVisits: [],

      addFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites : [...s.favorites, id] })),

      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f !== id) })),

      toggleFavorite: (id) => {
        get().isFavorite(id) ? get().removeFavorite(id) : get().addFavorite(id);
      },

      isFavorite: (id) => get().favorites.includes(id),

      addRecentVisit: (item) =>
        set((s) => {
          const filtered = s.recentVisits.filter((r) => r.id !== item.id);
          const next = [{ ...item, visitedAt: new Date().toISOString() }, ...filtered];
          return { recentVisits: next.slice(0, MAX_RECENT) };
        }),
    }),
    { name: "rest-area-guide" }
  )
);
