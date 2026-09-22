import VendorNode from './VendorNode';
import { Search } from 'lucide-react';

export default function VendorTree({ vendors, onSelect, selectedId, searchQuery, setSearchQuery, onMoveUser }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Vendor Hierarchy</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search vendors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {vendors.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No vendors found
          </div>
        ) : (
          <div className="py-2">
            {vendors.map(vendor => (
              <VendorNode 
                key={vendor.id} 
                vendor={vendor} 
                onSelect={onSelect}
                selectedId={selectedId}
                onMoveUser={onMoveUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
