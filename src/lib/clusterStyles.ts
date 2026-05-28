// 카카오 MarkerClusterer 커스텀 스타일 — 디자인 토큰 적용
// --color-brand: #2D4A3E, --color-brand-sub: #56735F

function makeStyle(size: number, fontSize: number) {
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: "#2D4A3E",
    borderRadius: "50%",
    border: "2.5px solid #FFFFFF",
    color: "#FFFFFF",
    fontSize: `${fontSize}px`,
    fontWeight: "600",
    textAlign: "center" as const,
    lineHeight: `${size - 5}px`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  };
}

// 클러스터 크기 3단계 (소·중·대)
export const CLUSTER_STYLES = [
  makeStyle(36, 12),  // ~10개
  makeStyle(44, 13),  // ~50개
  makeStyle(52, 14),  // 50개+
];
