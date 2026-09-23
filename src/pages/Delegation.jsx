import Ripple from '../components/common/Ripple';
import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, CheckCircle2, Shield, ShieldCheck, ShieldAlert, Users } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { useDelegationContext } from '../context/DelegationContext';
import { useVendorContext } from '../context/VendorContext';

import DelegationStatusBadge from '../components/delegation/DelegationStatusBadge';
import DelegationFormModal from '../components/delegation/DelegationFormModal';
import DelegationDetailsModal from '../components/delegation/DelegationDetailsModal';
import StatusConfirmDialog from '../components/vendor/StatusConfirmDialog';
import { ALL_PERMISSIONS } from '../constants/permissions';
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

export default function Delegation() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const { 
    delegations, 
    createDelegation, 
    updateDelegation, 
    revokeDelegation,
    getSummary
  } = useDelegationContext();

  const { vendors } = useVendorContext();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState('All');
  const [permissionFilter, setPermissionFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [delegationToEdit, setDelegationToEdit] = useState(null);
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeDelegation, setActiveDelegation] = useState(null);

  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [delegationToRevoke, setDelegationToRevoke] = useState(null);

  // Notification
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const summary = getSummary();

  // Helper to get vendor name
  const getVendorName = (id) => vendors.find(v => v.id === id)?.name || id;

  // Filtered Data
  const filteredDelegations = useMemo(() => {
    const getVendorNameStr = (id) => vendors.find(v => v.id === id)?.name || id;

    return delegations.filter(del => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const delegatorName = getVendorNameStr(del.delegatorId).toLowerCase();
      const delegateeName = getVendorNameStr(del.delegateeId).toLowerCase();
      
      // Check if search matches any permission label
      const permissionLabels = del.permissions.map(p => {
        const found = ALL_PERMISSIONS.find(ap => ap.id === p);
        return found ? found.label.toLowerCase() : '';
      });
      const matchesPermissionText = permissionLabels.some(label => label.includes(searchLower));

      const matchesSearch = 
        !debouncedSearchQuery ||
        delegatorName.includes(searchLower) ||
        delegateeName.includes(searchLower) ||
        matchesPermissionText;

      const matchesStatus = statusFilter === 'All' || del.status === statusFilter;
      const matchesPermission = permissionFilter === 'All' || del.permissions.includes(permissionFilter);

      return matchesSearch && matchesStatus && matchesPermission;
    });
  }, [delegations, vendors, debouncedSearchQuery, statusFilter, permissionFilter]);

  // Handlers
  const handleAddClick = () => {
    setDelegationToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (del) => {
    setDelegationToEdit(del);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (delegationToEdit) {
      updateDelegation(delegationToEdit.id, formData);
      setNotification('Delegation updated successfully.');
    } else {
      createDelegation(formData);
      setNotification('Delegation created successfully.');
    }
    setIsFormOpen(false);
  };

  const handleViewClick = (del) => {
    setActiveDelegation(del);
    setIsViewOpen(true);
  };

  const handleRevokeClick = (del) => {
    setDelegationToRevoke(del);
    setIsRevokeOpen(true);
  };

  const handleRevokeConfirm = () => {
    if (delegationToRevoke) {
      revokeDelegation(delegationToRevoke.id);
      setNotification('Delegation revoked successfully.');
    }
    setIsRevokeOpen(false);
  };

  const columns = [
    { header: 'Delegator', accessor: 'delegator', render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{getVendorName(row.delegatorId)}</span>
        <span className="text-xs text-slate-500 font-mono">{row.delegatorId}</span>
      </div>
    )},
    { header: 'Delegatee', accessor: 'delegatee', render: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-indigo-600">{getVendorName(row.delegateeId)}</span>
        <span className="text-xs text-slate-500 font-mono">{row.delegateeId}</span>
      </div>
    )},
    { header: 'Permissions', accessor: 'permissions', render: (row) => (
      <div className="flex flex-wrap gap-1 max-w-[250px]">
        {row.permissions.slice(0, 2).map(p => {
          const label = ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p;
          return (
            <span key={p} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
              {label}
            </span>
          );
        })}
        {row.permissions.length > 2 && (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
            +{row.permissions.length - 2} more
          </span>
        )}
      </div>
    )},
    { header: 'Created', accessor: 'createdAt', render: (row) => (
      <span className="text-sm">{row.createdAt}</span>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <DelegationStatusBadge status={row.status} />
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-3">
        <button onClick={() => handleViewClick(row)} className="text-primary-600 hover:text-primary-900 font-medium text-sm">View</button>
        {row.status === 'Active' && (
          <>
            <button onClick={() => handleEditClick(row)} className="text-slate-600 hover:text-slate-900 font-medium text-sm">Edit</button>
            <button onClick={() => handleRevokeClick(row)} className="text-red-600 hover:text-red-900 font-medium text-sm">Revoke</button>
          </>
        )}
      </div>
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
          <h2 className="text-2xl font-bold text-slate-900">Delegation & Permissions</h2>
          <p className="mt-1 text-sm text-slate-500">Securely delegate operational permissions down your vendor hierarchy.</p>
        </div>
        <button onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap relative overflow-hidden"
        >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
          <Plus className="w-4 h-4" />
          Create Delegation
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Delegations" value={summary.Total} icon={<Shield />} colorClass="bg-slate-100 text-slate-600" />
            <StatCard title="Active Delegations" value={summary.Active} icon={<ShieldCheck />} colorClass="bg-green-100 text-green-600" />
            <StatCard title="Revoked History" value={summary.Revoked} icon={<ShieldAlert />} colorClass="bg-rose-100 text-rose-600" />
            <StatCard title="Vendors with Access" value={summary.VendorsWithAccess} icon={<Users />} colorClass="bg-indigo-100 text-indigo-600" />
          </>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full xl:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by vendor or permission..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full flex-1">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Revoked">Revoked</option>
          </select>
          
          <select 
            value={permissionFilter}
            onChange={(e) => setPermissionFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Permissions</option>
            {ALL_PERMISSIONS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable columns={6} rows={6} hasHeader={false} />
        ) : filteredDelegations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No delegations found.</h3>
            <p className="text-sm text-slate-500">
              {delegations.length === 0 ? "You haven't created any delegations yet." : "Try adjusting your search or filter criteria."}
            </p>
            {(searchQuery || statusFilter !== 'All' || permissionFilter !== 'All') ? (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPermissionFilter('All');
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Clear all filters
              </button>
            ) : delegations.length === 0 ? (
              <button 
                onClick={handleAddClick}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Create your first delegation
              </button>
            ) : null}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredDelegations} 
            title="Active & Historical Delegations" 
            description={`Showing ${filteredDelegations.length} records.`}
          />
        )}
      </div>

      <DelegationFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={delegationToEdit}
      />

      <DelegationDetailsModal 
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        delegation={activeDelegation}
      />

      <StatusConfirmDialog 
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        onConfirm={handleRevokeConfirm}
        vendorName={`this delegation for ${getVendorName(delegationToRevoke?.delegateeId)}`}
        currentStatus="Active"
        actionText="Revoke"
      />

    </div>
  );
}
