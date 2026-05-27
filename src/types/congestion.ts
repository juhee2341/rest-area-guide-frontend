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
  1: { label: "여유", color: "text-congestion-free", bgColor: "bg-congestion-free" },
  2: { label: "보통", color: "text-congestion-normal", bgColor: "bg-congestion-normal" },
  3: { label: "혼잡", color: "text-congestion-busy", bgColor: "bg-congestion-busy" },
};
