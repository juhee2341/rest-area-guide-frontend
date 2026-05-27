"use client";

import { Polyline, MapMarker } from "react-kakao-maps-sdk";

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  path: LatLng[];
  origin: LatLng;
  destination: LatLng;
}

export default function RoutePolyline({ path, origin, destination }: Props) {
  return (
    <>
      <Polyline
        path={path}
        strokeWeight={4}
        strokeColor="#3b82f6"
        strokeOpacity={0.8}
        strokeStyle="solid"
      />
      <MapMarker position={origin} />
      <MapMarker position={destination} />
    </>
  );
}
