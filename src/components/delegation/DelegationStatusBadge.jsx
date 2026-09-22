import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function DelegationStatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
        <ShieldCheck className="w-3 h-3 mr-1" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-slate-50 text-slate-700 ring-slate-600/20">
      <ShieldAlert className="w-3 h-3 mr-1" /> Revoked
    </span>
  );
}
