interface Props {
  onRetry?: () => void;
}

export default function ErrorMessage({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-500">
      <p className="text-sm">데이터를 불러오지 못했습니다.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
