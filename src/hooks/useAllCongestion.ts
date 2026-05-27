import { useQuery } from "@tanstack/react-query";
import type { Congestion } from "@/types/congestion";

export function useAllCongestion() {
  return useQuery<Record<string, Congestion>>({
    queryKey: ["congestion-all"],
    queryFn: () => fetch("/api/congestion").then((r) => r.json()),
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
