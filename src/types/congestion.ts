export type CongestionLevel = 1 | 2 | 3;

export interface Congestion {
  level: CongestionLevel;
  label: "여유" | "보통" | "혼잡";
  updatedAt: string;
}

export const CONGESTION_CONFIG: Record<
  CongestionLevel,
  { label: string; color: string; bgColor: string }
> = {
  1: { label: "여유", color: "text-status-low", bgColor: "bg-status-low" },
  2: { label: "보통", color: "text-status-mid", bgColor: "bg-status-mid" },
  3: { label: "혼잡", color: "text-status-high", bgColor: "bg-status-high" },
};
