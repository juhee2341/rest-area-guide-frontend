"use client";

interface Filters {
  route: string;
  direction: string;
  congestion: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex gap-2 p-3 overflow-x-auto border-b border-gray-100 bg-white">
      <select
        value={filters.route}
        onChange={(e) => update("route", e.target.value)}
        className="flex-shrink-0 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
      >
        <option value="">노선 전체</option>
        <option value="경부">경부선</option>
        <option value="서해안">서해안선</option>
        <option value="영동">영동선</option>
        <option value="중부">중부선</option>
      </select>

      <select
        value={filters.direction}
        onChange={(e) => update("direction", e.target.value)}
        className="flex-shrink-0 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
      >
        <option value="">방향 전체</option>
        <option value="상행">상행</option>
        <option value="하행">하행</option>
      </select>

      <select
        value={filters.congestion}
        onChange={(e) => update("congestion", e.target.value)}
        className="flex-shrink-0 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
      >
        <option value="">혼잡도 전체</option>
        <option value="1">여유만</option>
        <option value="2">보통 이하</option>
      </select>
    </div>
  );
}
