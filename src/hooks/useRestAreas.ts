import { useQuery } from "@tanstack/react-query";
import type { RestArea } from "@/types/rest-area";

export function useRestAreas() {
  return useQuery<RestArea[]>({
    queryKey: ["rest-areas"],
    queryFn: () => fetch("/api/rest-areas").then((r) => r.json()),
    staleTime: Infinity,
  });
}
