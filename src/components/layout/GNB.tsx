import Link from "next/link";

export default function GNB() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <Link href="/" className="font-bold text-blue-600 whitespace-nowrap">
        휴게소 혼잡도 및 인기 메뉴 안내 서비스
      </Link>

      <div className="flex-1" />

      <Link
        href="/favorites"
        className="text-sm text-gray-600 hover:text-yellow-500 flex items-center gap-1"
      >
        <span>★</span>
        <span className="hidden sm:inline">즐겨찾기</span>
      </Link>
    </header>
  );
}
