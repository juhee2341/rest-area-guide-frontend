import type { Congestion } from "@/types/congestion";
import { CONGESTION_CONFIG } from "@/types/congestion";

interface Props {
  congestion: Congestion;
}

const GAUGE_PERCENT: Record<1 | 2 | 3, number> = { 1: 33, 2: 66, 3: 100 };

export default function CongestionGauge({ congestion }: Props) {
  const { bgColor } = CONGESTION_CONFIG[congestion.level];
  const percent = GAUGE_PERCENT[congestion.level];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="font-medium">현재 혼잡도 · </span>
          <span className={`font-semibold ${CONGESTION_CONFIG[congestion.level].color}`}>
            {congestion.label}
          </span>
        </div>
        <span className="text-gray-400 text-xs">업데이트: {congestion.updatedAt}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`${bgColor} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">고속도로 진입 교통량 기준 추정값입니다.</p>
    </div>
  );
}
