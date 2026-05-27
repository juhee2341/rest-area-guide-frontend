"use client";

import type { Menu } from "@/types/menu";
import MenuCard from "./MenuCard";

interface Props {
  menus: Menu[];
}

export default function MenuList({ menus }: Props) {
  const bestMenus = menus.filter((m) => m.isBest || m.isRecommended);

  return (
    <div className="space-y-5">
      {bestMenus.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">인기 메뉴</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {bestMenus.map((m) => <MenuCard key={m.id} menu={m} />)}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold text-text-secondary mb-3">전체 메뉴</h3>
        <div className="divide-y divide-line-divider">
          {menus.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-text-primary">{m.name}</span>
                {m.isBest && <span className="text-xs text-accent-star">⭐</span>}
                {m.isRecommended && <span className="text-xs text-accent-rec font-semibold" style={{ fontSize: "11px" }}>추천</span>}
                {m.isPremium && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">프리미엄</span>}
                {m.isSeason && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">시즌</span>}
              </div>
              <span className="text-sm font-semibold text-text-primary shrink-0 ml-2">{m.price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
