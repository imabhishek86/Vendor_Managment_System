import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DriverStatusBadge({ status, type = 'status' }) {
  let config = {
    color: 'bg-slate-50 text-slate-700 ring-slate-600/20',
    icon: null
  };

  if (type === 'license' || type === 'document') {
    switch (status) {
      case 'Verified':
        config = { color: 'bg-green-50 text-green-700 ring-green-600/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
        break;
      case 'Pending':
        config = { color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: <Clock className="w-3 h-3 mr-1" /> };
        break;
      case 'Expired':
        config = { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
        break;
      default:
        break;
    }
  } else {
    // Driver Status
    switch (status) {
      case 'Active':
        config = { color: 'bg-green-50 text-green-700 ring-green-600/20', icon: null };
        break;
      case 'Pending':
        config = { color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: null };
        break;
      case 'Inactive':
      case 'Off-Duty':
        config = { color: 'bg-slate-50 text-slate-700 ring-slate-600/20', icon: null };
        break;
      case 'Suspended':
        config = { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: null };
        break;
      default:
        break;
    }
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.color}`}>
      {config.icon}
      {status || 'Unknown'}
    </span>
  );
}
