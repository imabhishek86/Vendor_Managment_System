import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { mockDelegations } from '../data/mockDelegations';
import { ShieldAlert, Key } from 'lucide-react';

export default function Delegation() {
  const columns = [
    { header: 'Delegation ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { header: 'Delegator (Owner)', accessor: 'delegator', className: 'font-semibold text-slate-900' },
    { header: 'Delegatee (Assigned)', accessor: 'delegatee', className: 'font-medium text-slate-700' },
    { 
      header: 'Role / Access', 
      accessor: 'role',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-primary-500" />
          <span>{row.role}</span>
        </div>
      )
    },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        row.status === 'Active' ? (
          <button className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Revoke
          </button>
        ) : (
          <span className="text-slate-400 text-sm">N/A</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Delegation Management</h2>
        <p className="mt-1 text-sm text-slate-500">Manage temporary access, role delegations, and permission overrides.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={mockDelegations} 
        title="Active & Historical Delegations" 
        description="Audit log of all delegated permissions between vendors and managers."
      />
    </div>
  );
}
