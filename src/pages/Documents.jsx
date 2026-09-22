import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { mockDocuments } from '../data/mockDocuments';
import { FileText, Download } from 'lucide-react';

export default function Documents() {
  const columns = [
    { header: 'Document ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900">{row.type}</span>
        </div>
      )
    },
    { header: 'Related Entity', accessor: 'entityName' },
    { 
      header: 'Entity Type', 
      accessor: 'entityType',
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {row.entityType}
        </span>
      )
    },
    { header: 'Upload Date', accessor: 'uploadDate' },
    { header: 'Expiry Date', accessor: 'expiryDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: () => (
        <button className="text-slate-400 hover:text-primary-600 transition-colors" title="Download">
          <Download className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Documents & Compliance</h2>
        <p className="mt-1 text-sm text-slate-500">Manage vendor agreements, insurance policies, and driving licenses.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={mockDocuments} 
        title="Compliance Documents" 
        description="All registered documents requiring verification and tracking."
      />
    </div>
  );
}
