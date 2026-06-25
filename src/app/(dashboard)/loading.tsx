export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse p-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 bg-neutral-200 rounded" />
        <div className="h-4 w-96 bg-neutral-100 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-lg border border-neutral-100" />
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 w-48 bg-neutral-200 rounded" />
        <div className="h-4 w-24 bg-neutral-100 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white rounded-lg border border-neutral-100" />
        ))}
      </div>
    </div>
  )
}
