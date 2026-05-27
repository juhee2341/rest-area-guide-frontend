import { useQuery } from "@tanstack/react-query";
import type { Menu } from "@/types/menu";

export function useMenus(id: string, stdRestCd?: string) {
  return useQuery<Menu[]>({
    queryKey: ["menus", id, stdRestCd],
    queryFn: () => {
      const url = stdRestCd
        ? `/api/rest-areas/${id}/menus?stdRestCd=${stdRestCd}`
        : `/api/rest-areas/${id}/menus`;
      return fetch(url).then((r) => r.json());
    },
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
  });
}
