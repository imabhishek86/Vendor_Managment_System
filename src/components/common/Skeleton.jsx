export function Skeleton({ className = '' }) {
  return <div className={`skeleton-shimmer rounded ${className}`} />;
}

export function SkeletonTable({ columns = 5, rows = 5, hasHeader = true }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {hasHeader && (
        <div className="p-5 border-b border-slate-200 sm:flex sm:items-center sm:justify-between bg-slate-50">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 flex gap-3">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="py-3.5 pl-4 pr-3 sm:pl-6 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <Skeleton className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTree({ depth = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: depth }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          </div>
          {i === 0 && (
            <div className="pl-8 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
              </div>
              <div className="pl-8 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
