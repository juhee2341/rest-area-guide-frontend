"use client";

import { Map, useKakaoLoader } from "react-kakao-maps-sdk";

interface Props {
  center?: { lat: number; lng: number };
  level?: number;
  className?: string;
  children?: React.ReactNode;
  onZoomChanged?: (level: number) => void;
}

export default function KakaoMap({
  center = { lat: 36.5, lng: 127.5 },
  level = 13,
  className = "absolute inset-0",
  children,
  onZoomChanged,
}: Props) {
  const [loading] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY!,
    libraries: ["services", "clusterer"],
    url: "https://dapi.kakao.com/v2/maps/sdk.js",
  });

  if (loading) return null;

  return (
    <Map
      center={{ lat: center.lat, lng: center.lng }}
      level={level}
      className={className}
      onCreate={(map) => map.relayout()}
      onZoomChanged={(map) => onZoomChanged?.(map.getLevel())}
    >
      {children}
    </Map>
  );
}
