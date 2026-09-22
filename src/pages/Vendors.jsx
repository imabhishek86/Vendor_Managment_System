import Ripple from '../components/common/Ripple';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { useVendorContext } from '../context/VendorContext';
import VendorFormModal from '../components/vendor/VendorFormModal';
import StatusConfirmDialog from '../components/vendor/StatusConfirmDialog';
import useDebounce from '../hooks/useDebounce';
import { SkeletonTable } from '../components/common/Skeleton';

export default function Vendors() {
  const { vendors, addVendor, editVendor, updateVendorStatus } = useVendorContext();
  const navigate = useNavigate();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vendorToConfirm, setVendorToConfirm] = useState(null);

  // Notification state
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Derived  // Filtered Data
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const matchesSearch = 
        !debouncedSearchQuery ||
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.email.toLowerCase().includes(searchLower) ||
        vendor.phone.includes(searchLower);

      const matchesType = typeFilter === 'All' || vendor.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || vendor.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vendors, debouncedSearchQuery, typeFilter, statusFilter]);

  // Handlers
  const handleAddClick = () => {
    setVendorToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vendor) => {
    setVendorToEdit(vendor);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (vendorToEdit) {
      editVendor(vendorToEdit.id, formData);
      setNotification('Vendor updated successfully.');
    } else {
      addVendor(formData);
      setNotification('Vendor added successfully.');
    }
    setIsFormOpen(false);
  };

  const handleStatusClick = (vendor) => {
    setVendorToConfirm(vendor);
    setIsConfirmOpen(true);
  };

  const handleStatusConfirm = (newStatus) => {
    if (vendorToConfirm) {
      updateVendorStatus(vendorToConfirm.id, newStatus);
      setNotification(`Vendor ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`);
    }
    setIsConfirmOpen(false);
  };

  const handleViewDetails = (vendorId) => {
    navigate(`/vendors/${vendorId}`);
  };

  // Table columns
  const columns = [
    { header: 'Vendor Name', accessor: 'name', className: 'font-semibold text-slate-900', render: (row) => (
      <button 
        onClick={() => handleViewDetails(row.id)}
        className="text-left group flex flex-col focus:outline-none"
      >
        <div className="font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">{row.name}</div>
        <div className="text-xs text-slate-500 font-normal">{row.id}</div>
      </button>
    )},
    { header: 'Type', accessor: 'type' },
    { header: 'Manager / Parent', accessor: 'parentId', render: (row) => (
      <span className="text-sm">
        {row.parentId ? vendors.find(v => v.id === row.parentId)?.name || row.parentId : <span className="text-slate-400 italic">None (Root)</span>}
      </span>
    )},
    { header: 'Contact', accessor: 'contact', render: (row) => (
      <div className="text-sm">
        <div>{row.contactPerson}</div>
        <div className="text-xs text-slate-500">{row.email}</div>
      </div>
    )},
    { header: 'Drivers', accessor: 'drivers', render: (row) => row.metrics?.drivers || 0 },
    { header: 'Vehicles', accessor: 'vehicles', render: (row) => row.metrics?.vehicles || 0 },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleViewDetails(row.id)} className="text-primary-600 hover:text-primary-900 font-medium text-sm">View</button>
          <button onClick={() => handleEditClick(row)} className="text-slate-600 hover:text-slate-900 font-medium text-sm">Edit</button>
          <button 
            onClick={() => handleStatusClick(row)} 
            className={`font-medium text-sm ${row.status === 'Active' ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center gap-2 animate-popover-enter">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vendor Management</h2>
          <p className="mt-1 text-sm text-slate-500">View, search, filter, and manage your entire vendor network.</p>
        </div>
        <button onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm relative overflow-hidden"
        >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search vendors by name, email, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-48">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="All">All Types</option>
              <option value="Master Vendor">Master Vendor</option>
              <option value="Super Vendor">Super Vendor</option>
              <option value="Regional Vendor">Regional Vendor</option>
              <option value="City Vendor">City Vendor</option>
              <option value="Sub Vendor">Sub Vendor</option>
            </select>
          </div>
          <div className="flex-1 md:w-40">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable columns={8} rows={8} hasHeader={false} />
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No vendors found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredVendors} 
            title="Registered Vendors" 
            description={`Showing ${filteredVendors.length} matching vendors.`}
          />
        )}
      </div>

      <VendorFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        allVendors={vendors}
        initialData={vendorToEdit}
      />

      <StatusConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusConfirm}
        vendorName={vendorToConfirm?.name}
        currentStatus={vendorToConfirm?.status}
      />
    </div>
  );
}
