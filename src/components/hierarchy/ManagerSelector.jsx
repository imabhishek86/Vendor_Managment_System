import { useState, useMemo } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

export default function ManagerSelector({ vendors, onSelect, selectedId, disabledIds }) {
  const [search, setSearch] = useState('');

  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter(v => !disabledIds.has(v.id));
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(lowerSearch) || 
        v.id.toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [vendors, search, disabledIds]);

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
      <div className="p-3 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search manager..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-48 p-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-1">
          Available Managers
        </div>
        {filteredVendors.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">No matching managers found.</div>
        ) : (
          <ul className="space-y-1">
            {filteredVendors.map(vendor => (
              <li key={vendor.id}>
                <button
                  type="button"
                  onClick={() => onSelect(vendor.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-md transition-colors ${
                    selectedId === vendor.id 
                      ? 'bg-primary-100 text-primary-900 font-medium' 
                      : 'hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{vendor.name}</span>
                  {selectedId === vendor.id && <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
