export default function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'Pending':
      case 'Maintenance':
      case 'Off-Duty':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Suspended':
      case 'Retired':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
