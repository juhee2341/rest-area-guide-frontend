import Link from "next/link";
import Image from "next/image";

export default function GNB() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-surface-card border-b border-line flex items-center px-4 gap-4">
      <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
        <Image src="/logo.svg" alt="로고" width={28} height={28} priority />
        <span className="font-extrabold text-brand" style={{ letterSpacing: "-0.02em" }}>
          휴게소 혼잡도 및 인기 메뉴 안내 서비스
        </span>
      </Link>

      <div className="flex-1" />

      <Link
        href="/favorites"
        className="text-sm text-text-secondary hover:text-accent-star flex items-center gap-1"
      >
        <span>★</span>
        <span className="hidden sm:inline">즐겨찾기</span>
      </Link>
    </header>
  );
}
