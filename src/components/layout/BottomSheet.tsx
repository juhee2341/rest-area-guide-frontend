"use client";

import { useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  defaultHeight?: number;
}

export default function BottomSheet({ children, defaultHeight = 40 }: Props) {
  const [height, setHeight] = useState(defaultHeight);
  const startY = useRef<number | null>(null);
  const startHeight = useRef(defaultHeight);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const dy = startY.current - e.touches[0].clientY;
    const next = Math.min(90, Math.max(20, startHeight.current + (dy / window.innerHeight) * 100));
    setHeight(next);
  };

  const onTouchEnd = () => {
    startY.current = null;
    setHeight((h) => (h > 55 ? 90 : defaultHeight));
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-[height] duration-200 z-40 flex flex-col md:hidden"
      style={{ height: `${height}vh` }}
    >
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      <div className="overflow-y-auto flex-1 px-4 pb-4">{children}</div>
    </div>
  );
}
