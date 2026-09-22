import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Users, Car, CheckCircle2, Clock, AlertCircle, ArrowRightLeft } from 'lucide-react';

export default function VendorNode({ vendor, level = 0, onSelect, selectedId, onMoveUser }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = vendor.children && vendor.children.length > 0;
  const isSelected = selectedId === vendor.id;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Suspended': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'Pending': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Suspended': return 'bg-red-50 text-red-700 ring-red-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`flex items-center group cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors py-3 pr-4
          ${isSelected ? 'bg-primary-50 hover:bg-primary-50 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}`}
        style={{ paddingLeft: `${(level * 24) + 16}px` }}
        onClick={() => onSelect(vendor)}
      >
        <div className="flex items-center gap-2 w-8">
          {hasChildren ? (
            <button 
              onClick={toggleExpand}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-6 h-6"></div> // Spacer for leaf nodes
          )}
        </div>

        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 truncate">{vendor.name}</span>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                <span className="truncate">{vendor.type}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {vendor.metrics.drivers}</span>
                <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {vendor.metrics.vehicles}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUser(vendor);
            }}
            className="ml-4 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Move</span>
          </button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="w-full">
          {vendor.children.map(child => (
            <VendorNode 
              key={child.id} 
              vendor={child} 
              level={level + 1} 
              onSelect={onSelect}
              selectedId={selectedId}
              onMoveUser={onMoveUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
