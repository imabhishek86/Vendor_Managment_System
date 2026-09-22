export default function VendorOverview({ data }) {
  const { super: superCount, regional, city, total } = data;
  
  const superPct = Math.round((superCount / total) * 100);
  const regionalPct = Math.round((regional / total) * 100);
  const cityPct = Math.round((city / total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Vendor Overview</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        {/* Progress Bar Container */}
        <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-100 mb-6">
          <div className="bg-indigo-600 transition-all duration-1000" style={{ width: `${superPct}%` }} title="Super Vendors" />
          <div className="bg-blue-400 transition-all duration-1000" style={{ width: `${regionalPct}%` }} title="Regional Vendors" />
          <div className="bg-cyan-300 transition-all duration-1000" style={{ width: `${cityPct}%` }} title="City Vendors" />
        </div>

        {/* Legend */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="font-medium text-slate-700">Super Vendors</span>
            </div>
            <span className="font-bold text-slate-900">{superCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <span className="font-medium text-slate-700">Regional Vendors</span>
            </div>
            <span className="font-bold text-slate-900">{regional}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-300"></span>
              <span className="font-medium text-slate-700">City Vendors</span>
            </div>
            <span className="font-bold text-slate-900">{city}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
