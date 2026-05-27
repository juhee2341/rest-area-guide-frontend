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
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-text-secondary">
      <p className="text-sm">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-surface-subtle"
        >
          필터 초기화
        </button>
      )}
      {showMapLink && (
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-hover"
        >
          지도에서 찾기
        </Link>
      )}
    </div>
  );
}
