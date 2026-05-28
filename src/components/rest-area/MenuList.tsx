"use client";

import type { Menu } from "@/types/menu";
import MenuCard from "./MenuCard";

interface Props {
  menus: Menu[];
}

export default function MenuList({ menus }: Props) {
  const popular = menus.filter((m) => m.isBest || m.isRecommended);
  const premium = menus.filter((m) => m.isPremium);
  const ownerPick = popular.length === 0 && premium.length === 0
    ? menus.slice(0, 1)
    : [];

  return (
    <div className="space-y-5">
      {popular.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">인기 메뉴</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {popular.map((m) => <MenuCard key={m.id} menu={m} />)}
          </div>
        </section>
      )}

      {premium.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">프리미엄 메뉴</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {premium.map((m) => <MenuCard key={m.id} menu={m} />)}
          </div>
        </section>
      )}

      {ownerPick.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            인기 메뉴 <span className="ml-1 text-xs font-normal text-text-tertiary">· 주인 Pick</span>
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ownerPick.map((m) => <MenuCard key={m.id} menu={m} />)}
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
                {m.isBest && <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">베스트</span>}
                {m.isRecommended && <span className="text-xs font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">추천</span>}
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
