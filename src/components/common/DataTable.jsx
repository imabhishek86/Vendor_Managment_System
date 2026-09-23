export default function DataTable({ columns, data, keyField = 'id', title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {(title || description) && (
        <div className="p-5 border-b border-slate-200 sm:flex sm:items-center sm:justify-between bg-slate-50">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6 uppercase tracking-wider text-xs"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-sm text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[keyField]} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ${col.className || 'text-slate-700'}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
