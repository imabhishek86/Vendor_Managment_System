import { getExpiryStatus } from '../../utils/dateStatus';

export default function ComplianceStatusBadge({ date, type = 'default' }) {
  const status = getExpiryStatus(date);
  
  let config = {
    color: 'bg-slate-50 text-slate-700 ring-slate-600/20',
    dotColor: 'bg-slate-400'
  };

  switch (status) {
    case 'Valid':
      config = { color: 'bg-green-50 text-green-700 ring-green-600/20', dotColor: 'bg-green-500' };
      break;
    case 'Expiring Soon':
      config = { color: 'bg-amber-50 text-amber-700 ring-amber-600/20', dotColor: 'bg-amber-500' };
      break;
    case 'Expired':
      config = { color: 'bg-red-50 text-red-700 ring-red-600/20', dotColor: 'bg-red-500' };
      break;
    case 'Pending':
      config = { color: 'bg-slate-50 text-slate-700 ring-slate-600/20', dotColor: 'bg-slate-400' };
      break;
    default:
      break;
  }

  // A tiny colored dot before the text adds a great visual cue
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {status}
    </span>
  );
}
