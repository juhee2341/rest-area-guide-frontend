import { useQuery } from "@tanstack/react-query";
import type { Congestion } from "@/types/congestion";

export function useCongestion(id: string) {
  return useQuery<Congestion>({
    queryKey: ["congestion", id],
    queryFn: () => fetch(`/api/rest-areas/${id}/congestion`).then((r) => r.json()),
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: !!id,
  });
}
