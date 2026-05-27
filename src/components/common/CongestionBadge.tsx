import type { CongestionLevel } from "@/types/congestion";
import { CONGESTION_CONFIG } from "@/types/congestion";

interface Props {
  level: CongestionLevel;
}

export default function CongestionBadge({ level }: Props) {
  const { label, bgColor } = CONGESTION_CONFIG[level];
  return (
    <span className={`${bgColor} text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
      {label}
    </span>
  );
}
