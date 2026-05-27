interface Props {
  onRetry?: () => void;
}

export default function ErrorMessage({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-text-secondary">
      <p className="text-sm">데이터를 불러오지 못했습니다.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-hover"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
