import { ShieldCheck } from 'lucide-react';

export default function ComplianceCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-slate-900">Document Compliance</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">Verified</span>
            <span className="font-bold text-slate-900">{data.verified}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${data.verified}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">Expiring Soon</span>
            <span className="font-bold text-slate-900">{data.expiringSoon}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="bg-amber-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${data.expiringSoon}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700">Expired</span>
            <span className="font-bold text-slate-900">{data.expired}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${data.expired}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
