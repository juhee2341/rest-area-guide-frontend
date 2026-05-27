import Link from "next/link";

interface Props {
  message?: string;
  showMapLink?: boolean;
  onReset?: () => void;
}

export default function EmptyState({
  message = "조건에 맞는 휴게소가 없습니다.",
  showMapLink = false,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-500">
      <p className="text-sm">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          필터 초기화
        </button>
      )}
      {showMapLink && (
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          지도에서 찾기
        </Link>
      )}
    </div>
  );
}
