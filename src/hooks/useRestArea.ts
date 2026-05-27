import { useQuery } from "@tanstack/react-query";
import type { RestAreaDetail } from "@/types/rest-area";

export function useRestArea(id: string, stdRestCd?: string) {
  return useQuery<RestAreaDetail>({
    queryKey: ["rest-area", id, stdRestCd],
    queryFn: () => {
      const url = stdRestCd
        ? `/api/rest-areas/${id}?stdRestCd=${stdRestCd}`
        : `/api/rest-areas/${id}`;
      return fetch(url).then((r) => r.json());
    },
    staleTime: Infinity,
    enabled: !!id,
  });
}
