export default function SkeletonCard() {
  return (
    <div className="p-4 border border-gray-100 rounded-xl animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-5 bg-gray-200 rounded w-3/5" />
      <div className="h-4 bg-gray-200 rounded w-2/5" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
