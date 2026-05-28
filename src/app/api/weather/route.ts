import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }

  const weather = await fetchWeather(lat, lng);
  if (!weather) {
    return NextResponse.json({ error: "날씨 정보를 가져올 수 없습니다" }, { status: 503 });
  }

  return NextResponse.json(weather);
}
