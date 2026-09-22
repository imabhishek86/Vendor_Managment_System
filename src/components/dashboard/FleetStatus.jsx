import { CheckCircle2, Wrench, AlertCircle, Clock } from 'lucide-react';

export default function FleetStatus({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Fleet Status</h3>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
          <span className="text-2xl font-bold text-slate-900">{data.active}</span>
          <span className="text-xs font-medium text-green-700 uppercase tracking-wider mt-1">Active</span>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex flex-col items-center justify-center text-center">
          <Wrench className="w-6 h-6 text-amber-600 mb-2" />
          <span className="text-2xl font-bold text-slate-900">{data.maintenance}</span>
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider mt-1">Maintenance</span>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-6 h-6 text-slate-500 mb-2" />
          <span className="text-2xl font-bold text-slate-900">{data.inactive}</span>
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wider mt-1">Inactive</span>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col items-center justify-center text-center">
          <Clock className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-slate-900">{data.pending}</span>
          <span className="text-xs font-medium text-blue-700 uppercase tracking-wider mt-1">Pending</span>
        </div>
      </div>
    </div>
  );
}
