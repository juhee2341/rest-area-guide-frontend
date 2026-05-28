import type { Facilities } from "@/types/rest-area";
import type { WeatherInfo } from "@/lib/weather";

export interface SituationItem {
  icon: string;
  label: string;
  highlight?: boolean; // 주의가 필요한 항목 (혼잡·비·눈·폭염 등)
}

export interface SituationSummary {
  items: SituationItem[];
  tip: string; // 핵심 행동 팁 한 줄
}

interface RecommendInput {
  congestionLabel?: string;
  weather?: WeatherInfo | null;
  facilities?: Facilities | null;
  topMenus?: string[];
}

export function generateSituation(input: RecommendInput): SituationSummary {
  const { congestionLabel, weather, facilities, topMenus } = input;
  const items: SituationItem[] = [];
  let tip = "";

  // ── 혼잡도 ───────────────────────────────────────────────────────────────
  if (congestionLabel === "여유") {
    items.push({ icon: "🟢", label: "여유로움" });
    tip = "여유 있게 쉬어가기 좋아요.";
  } else if (congestionLabel === "보통") {
    items.push({ icon: "🟡", label: "보통 혼잡" });
    tip = "적당히 붐비고 있어요.";
  } else if (congestionLabel === "혼잡") {
    items.push({ icon: "🔴", label: "혼잡", highlight: true });
    tip = "혼잡합니다. 필요한 것만 빠르게 해결하세요.";
  }

  // ── 날씨 ─────────────────────────────────────────────────────────────────
  if (weather) {
    const { temp, rainType } = weather;

    if (rainType === "비" || rainType === "소나기" || rainType === "이슬비") {
      items.push({ icon: "🌧️", label: rainType, highlight: true });
      if (!tip) tip = "비가 내려요. 실내 공간을 이용하세요.";
    } else if (rainType.includes("눈")) {
      items.push({ icon: "❄️", label: rainType, highlight: true });
      if (!tip) tip = "눈길 주의. 출발 전 노면 상태를 확인하세요.";
    } else if (temp >= 33) {
      items.push({ icon: "🌡️", label: `${temp}°C 폭염`, highlight: true });
      if (!tip) tip = "매우 더워요. 수분 보충 후 출발하세요.";
    } else if (temp <= 0) {
      items.push({ icon: "🌡️", label: `${temp}°C 한파`, highlight: true });
      if (!tip) tip = "매우 춥습니다. 따뜻하게 쉬다 가세요.";
    } else {
      items.push({ icon: weather.icon, label: `${temp}°C` });
    }
  }

  // ── 이용 가능 시설 ────────────────────────────────────────────────────────
  if (facilities) {
    if (facilities.gasStation) items.push({ icon: "⛽", label: "주유" });
    if (facilities.evCharger)  items.push({ icon: "🔌", label: "EV 충전" });
    if (facilities.cafe)       items.push({ icon: "☕", label: "카페" });
    if (facilities.convenienceStore) items.push({ icon: "🛒", label: "편의점" });
    if (facilities.shower)     items.push({ icon: "🚿", label: "샤워실" });
    if (facilities.atm)        items.push({ icon: "🏧", label: "ATM" });
  }

  // ── 인기 메뉴 ─────────────────────────────────────────────────────────────
  if (topMenus?.length) {
    items.push({ icon: "🍽️", label: topMenus.slice(0, 2).join(" · ") });
    if (!tip) tip = `인기 메뉴: ${topMenus.slice(0, 2).join(", ")}`;
  }

  return { items, tip };
}
