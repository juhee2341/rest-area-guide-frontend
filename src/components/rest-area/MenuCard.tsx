import type { Menu } from "@/types/menu";

interface Props {
  menu: Menu;
}

export default function MenuCard({ menu }: Props) {
  return (
    <div className="flex-shrink-0 w-28 border border-gray-100 rounded-xl overflow-hidden">
      <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
        <span className="text-3xl">🍽</span>
      </div>
      <div className="p-2 space-y-0.5">
        <p className="text-xs font-medium leading-tight line-clamp-2">{menu.name}</p>
        <p className="text-xs text-gray-500">{menu.price.toLocaleString()}원</p>
        <div className="flex gap-1 flex-wrap">
          {menu.isBest && <span className="text-xs text-amber-500 font-medium">⭐ 인기</span>}
          {menu.isRecommended && <span className="text-xs text-green-500 font-medium">추천</span>}
          {menu.isPremium && <span className="text-xs text-purple-500 font-medium">프리미엄</span>}
        </div>
      </div>
    </div>
  );
}
