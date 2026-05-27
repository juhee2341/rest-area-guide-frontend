import type { Menu } from "@/types/menu";

interface Props {
  menu: Menu;
}

export default function MenuCard({ menu }: Props) {
  return (
    <div className="flex-shrink-0 w-28 border border-line rounded-xl overflow-hidden">
      <div className="w-full h-24 bg-surface-subtle flex items-center justify-center">
        <span className="text-3xl">🍽</span>
      </div>
      <div className="p-2 space-y-0.5">
        <p className="text-xs font-medium leading-tight line-clamp-2">{menu.name}</p>
        <p className="text-xs text-text-secondary">{menu.price.toLocaleString()}원</p>
        <div className="flex gap-1 flex-wrap">
          {menu.isBest && <span className="text-xs text-accent-star font-medium">⭐</span>}
          {menu.isRecommended && <span className="text-xs text-accent-rec font-semibold">추천</span>}
          {menu.isPremium && <span className="text-xs text-purple-500 font-medium">프리미엄</span>}
        </div>
      </div>
    </div>
  );
}
