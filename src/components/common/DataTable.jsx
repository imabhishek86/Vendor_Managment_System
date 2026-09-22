import Ripple from './Ripple';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ columns, data, keyField = 'id', title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-200 sm:flex sm:items-center sm:justify-between bg-slate-50">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex gap-3">
          <div className="relative rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-0 py-2 pl-9 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white"
              placeholder="Search..."
            />
          </div>
          <button className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(255, 255, 255, 0.3)" />
            Add New
          </button>
        </div>
      </div>

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
      
      {/* Pagination Footer Placeholder */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{data.length}</span> of{' '}
              <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button className="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 overflow-hidden transition-all duration-200">
        <Ripple color="rgba(255, 255, 255, 0.3)" />
                1
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
