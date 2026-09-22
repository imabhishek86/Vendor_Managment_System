import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function DocumentStatusBadge({ status }) {
  let config = { color: 'bg-slate-50 text-slate-700 ring-slate-600/20', icon: null };

  switch (status) {
    case 'Verified':
      config = { color: 'bg-green-50 text-green-700 ring-green-600/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
      break;
    case 'Pending':
      config = { color: 'bg-blue-50 text-blue-700 ring-blue-600/20', icon: <Clock className="w-3 h-3 mr-1" /> };
      break;
    case 'Rejected':
      config = { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: <XCircle className="w-3 h-3 mr-1" /> };
      break;
    case 'Expired':
      config = { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
      break;
    case 'Expiring Soon':
      config = { color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: <AlertCircle className="w-3 h-3 mr-1" /> };
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${config.color}`}>
      {config.icon}
      {status || 'Unknown'}
    </span>
  );
}
