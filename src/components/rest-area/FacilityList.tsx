import type { Facilities } from "@/types/rest-area";

const FACILITY_ITEMS: { key: keyof Facilities; icon: string; label: string }[] = [
  { key: "gasStation", icon: "⛽", label: "주유소" },
  { key: "evCharger", icon: "🔌", label: "전기차 충전" },
  { key: "shower", icon: "🚿", label: "샤워실" },
  { key: "atm", icon: "🏧", label: "ATM" },
  { key: "cafe", icon: "☕", label: "카페" },
  { key: "convenienceStore", icon: "🛒", label: "편의점" },
];

interface Props {
  facilities: Facilities;
  fuelGasoline?: number | null;
  fuelDiesel?: number | null;
  fuelLpg?: number | null;
  oilCompany?: string | null;
}

export default function FacilityList({ facilities, fuelGasoline, fuelDiesel, fuelLpg, oilCompany }: Props) {
  return (
    <div className="divide-y divide-line-divider">
      {FACILITY_ITEMS.map(({ key, icon, label }) => (
        <div
          key={key}
          className={`flex items-center justify-between py-3 ${
            !facilities[key] ? "opacity-30" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className="text-sm">{label}</span>
            {key === "gasStation" && oilCompany && (
              <span className="text-xs text-text-tertiary">({oilCompany})</span>
            )}
          </div>
          <div className="text-sm text-text-secondary text-right">
            {key === "gasStation" && facilities[key] ? (
              <div className="space-y-0.5">
                {fuelGasoline && <p>휘발유 {fuelGasoline.toLocaleString()}원</p>}
                {fuelDiesel && <p>경유 {fuelDiesel.toLocaleString()}원</p>}
                {fuelLpg && <p>LPG {fuelLpg.toLocaleString()}원</p>}
                {!fuelGasoline && !fuelDiesel && !fuelLpg && <span>있음</span>}
              </div>
            ) : (
              <span>{facilities[key] ? "있음" : "없음"}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
