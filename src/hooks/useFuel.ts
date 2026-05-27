import { useQuery } from "@tanstack/react-query";
import type { FuelPrice } from "@/lib/expressway";

export function useFuel(id: string, stdRestCd?: string) {
  return useQuery<FuelPrice>({
    queryKey: ["fuel", id, stdRestCd],
    queryFn: () => {
      const url = stdRestCd
        ? `/api/fuel/${id}?stdRestCd=${stdRestCd}`
        : `/api/fuel/${id}`;
      return fetch(url).then((r) => r.json());
    },
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
  });
}
