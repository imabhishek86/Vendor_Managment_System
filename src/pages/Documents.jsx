import { useState, useMemo, useEffect } from 'react';
import { Search, UploadCloud, CheckCircle2, ShieldAlert, FileText, AlertCircle, Clock, XCircle } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { useDocumentContext } from '../context/DocumentContext';
import { useVendorContext } from '../context/VendorContext';
import { useDriverContext } from '../context/DriverContext';
import { useVehicleContext } from '../context/VehicleContext';

import DocumentStatusBadge from '../components/documents/DocumentStatusBadge';
import DocumentUploadModal from '../components/documents/DocumentUploadModal';
import DocumentDetailsModal from '../components/documents/DocumentDetailsModal';
import DocumentRejectModal from '../components/documents/DocumentRejectModal';
import useDebounce from '../hooks/useDebounce';
import { SkeletonTable, SkeletonCard } from '../components/common/Skeleton';

// Reusable stat card
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <div className={`p-3 rounded-lg ${colorClass} transition-transform duration-200 hover:scale-110`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
    </div>
  </div>
);

export default function Documents() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const { 
    documents, 
    addDocument, 
    verifyDocument, 
    rejectDocument, 
    getComplianceAlerts,
    getResolvedStatus,
    getSummary
  } = useDocumentContext();

  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [entityFilter, setEntityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Notification
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const summary = getSummary();
  const alerts = getComplianceAlerts();

  // Helper to get entity name
  const getEntityName = (doc) => {
    if (doc.entityType === 'driver') {
      return drivers.find(d => d.id === doc.entityId)?.name || doc.entityId;
    }
    return vehicles.find(v => v.id === doc.entityId)?.licensePlate || doc.entityId;
  };

  // Filtered Data
  const filteredDocs = useMemo(() => {
    // Helper to get entity name inside useMemo
    const getEntityNameStr = (doc) => {
      if (doc.entityType === 'driver') {
        return drivers.find(d => d.id === doc.entityId)?.name || doc.entityId;
      }
      return vehicles.find(v => v.id === doc.entityId)?.licensePlate || doc.entityId;
    };

    return documents.filter(doc => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const entityName = getEntityNameStr(doc).toLowerCase();
      const vendorName = vendors.find(v => v.id === doc.vendorId)?.name?.toLowerCase() || '';

      const matchesSearch = 
        !debouncedSearchQuery ||
        doc.documentNumber.toLowerCase().includes(searchLower) ||
        doc.fileName.toLowerCase().includes(searchLower) ||
        entityName.includes(searchLower) ||
        vendorName.includes(searchLower);

      const matchesEntity = entityFilter === 'All' || doc.entityType === entityFilter;
      const matchesType = typeFilter === 'All' || doc.documentType === typeFilter;
      const matchesVendor = vendorFilter === 'All' || doc.vendorId === vendorFilter;
      
      const resolvedStatus = getResolvedStatus(doc);
      const matchesStatus = statusFilter === 'All' || resolvedStatus === statusFilter;

      return matchesSearch && matchesEntity && matchesType && matchesVendor && matchesStatus;
    });
  }, [documents, debouncedSearchQuery, entityFilter, typeFilter, vendorFilter, statusFilter, getResolvedStatus, vendors, drivers, vehicles]);

  // Handlers
  const handleUploadSubmit = (data) => {
    addDocument(data);
    setIsUploadOpen(false);
    setNotification('Document uploaded successfully.');
  };

  const handleVerify = () => {
    verifyDocument(activeDocument.id);
    setIsViewOpen(false);
    setNotification('Document verified successfully.');
  };

  const handleOpenReject = () => {
    setIsViewOpen(false);
    setIsRejectOpen(true);
  };

  const handleRejectConfirm = (reason) => {
    rejectDocument(activeDocument.id, reason);
    setIsRejectOpen(false);
    setNotification('Document rejected.');
  };

  const handleView = (doc) => {
    setActiveDocument(doc);
    setIsViewOpen(true);
  };

  const columns = [
    { header: 'Document', accessor: 'docInfo', render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{row.documentType}</span>
        <span className="text-xs font-mono text-slate-500">{row.documentNumber}</span>
      </div>
    )},
    { header: 'Entity', accessor: 'entity', render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-700 capitalize">{row.entityType}</span>
        <span className="text-xs text-slate-500">{getEntityName(row)}</span>
      </div>
    )},
    { header: 'Vendor', accessor: 'vendor', render: (row) => (
      <span className="text-sm">{vendors.find(v => v.id === row.vendorId)?.name || row.vendorId || 'N/A'}</span>
    )},
    { header: 'Expiry Date', accessor: 'expiry', render: (row) => (
      <span className="text-sm tabular-nums">{row.expiryDate}</span>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <DocumentStatusBadge status={getResolvedStatus(row)} />
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <button 
        onClick={() => handleView(row)} 
        className="text-primary-600 hover:text-primary-900 font-medium text-sm"
      >
        View
      </button>
    )}
  ];

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {notification && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center gap-2 animate-popover-enter">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Management</h2>
          <p className="mt-1 text-sm text-slate-500">Track and verify fleet and driver compliance documents.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total" value={summary.Total} icon={<FileText />} colorClass="bg-slate-100 text-slate-600" />
            <StatCard title="Verified" value={summary.Verified} icon={<CheckCircle2 />} colorClass="bg-green-100 text-green-600" />
            <StatCard title="Pending" value={summary.Pending} icon={<Clock />} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Expiring Soon" value={summary['Expiring Soon']} icon={<AlertCircle />} colorClass="bg-amber-100 text-amber-600" />
            <StatCard title="Expired" value={summary.Expired} icon={<ShieldAlert />} colorClass="bg-red-100 text-red-600" />
            <StatCard title="Rejected" value={summary.Rejected} icon={<XCircle />} colorClass="bg-rose-100 text-rose-600" />
          </>
        )}
      </div>

      {/* Compliance Alerts - Only show if there are actionable items */}
      {!isLoading && alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-red-800 font-bold flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5" />
            Compliance Alerts ({alerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.slice(0, 6).map(alert => (
              <div key={alert.id} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-semibold text-slate-900 text-sm truncate max-w-[150px]" title={getEntityName(alert)}>
                    {getEntityName(alert)}
                  </div>
                  <div className="text-xs text-slate-500">{alert.documentType}</div>
                </div>
                <div className="flex items-center gap-3">
                  <DocumentStatusBadge status={alert.resolvedStatus} />
                  <button onClick={() => handleView(alert)} className="text-primary-600 hover:text-primary-800 text-xs font-medium">View</button>
                </div>
              </div>
            ))}
          </div>
          {alerts.length > 6 && (
            <button 
              onClick={() => { setStatusFilter('Expired'); setEntityFilter('All'); }} 
              className="text-sm font-medium text-red-700 mt-3 hover:underline"
            >
              + {alerts.length - 6} more alerts...
            </button>
          )}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full xl:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full flex-1">
          <select 
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Entities</option>
            <option value="driver">Drivers</option>
            <option value="vehicle">Vehicles</option>
          </select>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Doc Types</option>
            <option value="Driving License">Driving License</option>
            <option value="ID Proof">ID Proof</option>
            <option value="Police Verification">Police Verification</option>
            <option value="Registration Certificate">Registration</option>
            <option value="Insurance">Insurance</option>
            <option value="Permit">Permit</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>

          <select 
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Vendors</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable columns={6} rows={8} hasHeader={false} />
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No documents found.</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredDocs} 
            title="Document Repository" 
            description={`Showing ${filteredDocs.length} documents.`}
          />
        )}
      </div>

      <DocumentUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
      />

      <DocumentDetailsModal 
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        document={activeDocument}
        onVerify={handleVerify}
        onReject={handleOpenReject}
      />

      <DocumentRejectModal 
        isOpen={isRejectOpen}
        onClose={() => { setIsRejectOpen(false); setIsViewOpen(true); }}
        onConfirm={handleRejectConfirm}
      />

    </div>
  );
}
