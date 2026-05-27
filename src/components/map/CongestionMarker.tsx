"use client";

import { MapMarker, CustomOverlayMap, useMap } from "react-kakao-maps-sdk";
import type { RestArea } from "@/types/rest-area";
import type { CongestionLevel } from "@/types/congestion";

const MARKER_COLORS: Record<CongestionLevel, string> = {
  1: "#6B9E5C",
  2: "#D89C3F",
  3: "#C45A3D",
};

const MARKER_LABELS: Record<CongestionLevel, string> = {
  1: "여유",
  2: "보통",
  3: "혼잡",
};

function makeMarkerSvg(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="38">
    <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2.5"/>
    <polygon points="10,26 22,26 16,38" fill="${color}"/>
    <polygon points="11,27 21,27 16,36" fill="${color}" stroke="white" stroke-width="0"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface Props {
  restArea: RestArea;
  congestionLevel?: CongestionLevel;
  onClick?: () => void;
  showLabel?: boolean;
}

export default function CongestionMarker({ restArea, congestionLevel, onClick, showLabel = true }: Props) {
  const map = useMap();
  const color = congestionLevel ? MARKER_COLORS[congestionLevel] : "#9AA39D";
  const label = congestionLevel ? MARKER_LABELS[congestionLevel] : "";
  const position = { lat: restArea.lat, lng: restArea.lng };

  function handleClick() {
    if (map.getLevel() > 8) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.setCenter(new (window as any).kakao.maps.LatLng(position.lat, position.lng));
      map.setLevel(8);
    }
    onClick?.();
  }

  return (
    <>
      <MapMarker
        position={position}
        onClick={handleClick}
        image={{
          src: makeMarkerSvg(color),
          size: { width: 32, height: 38 },
          options: { offset: { x: 16, y: 38 } },
        }}
      />
      {showLabel && (
        <CustomOverlayMap position={position} yAnchor={3.6}>
          <div
            onClick={handleClick}
            className="cursor-pointer select-none whitespace-nowrap rounded-full px-2.5 py-1 text-white font-semibold shadow-md"
            style={{ backgroundColor: color, fontSize: "12px", border: "1.5px solid white" }}
          >
            {restArea.name}{label && ` · ${label}`}
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
}
