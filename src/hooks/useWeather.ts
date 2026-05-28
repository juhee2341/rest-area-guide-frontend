import { useQuery } from "@tanstack/react-query";
import type { WeatherInfo } from "@/lib/weather";

async function fetchWeather(lat: number, lng: number): Promise<WeatherInfo> {
  const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error("날씨 조회 실패");
  return res.json();
}

export function useWeather(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeather(lat!, lng!),
    enabled: lat != null && lng != null,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}
