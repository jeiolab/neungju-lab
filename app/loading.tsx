export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
          aria-hidden
        />
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    </div>
  )
}
