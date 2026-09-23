import Ripple from '../components/common/Ripple';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import { useDriverContext } from '../context/DriverContext';
import { useVendorContext } from '../context/VendorContext';
import DriverStatusBadge from '../components/driver/DriverStatusBadge';
import DriverFormModal from '../components/driver/DriverFormModal';
import StatusConfirmDialog from '../components/vendor/StatusConfirmDialog';
import useDebounce from '../hooks/useDebounce';
import { SkeletonTable } from '../components/common/Skeleton';

export default function Drivers() {
  const { drivers, addDriver, editDriver, updateDriverStatus } = useDriverContext();
  const { vendors } = useVendorContext();
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
  const [vendorFilter, setVendorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [licenseFilter, setLicenseFilter] = useState('All');
  const [documentFilter, setDocumentFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, vendorFilter, statusFilter, licenseFilter, documentFilter]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [driverToConfirm, setDriverToConfirm] = useState(null);

  // Notification state
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Derived filtered data
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const vendorName = vendors.find(v => v.id === driver.vendorId)?.name?.toLowerCase() || '';

      const matchesSearch = 
        !debouncedSearchQuery || 
        driver.name.toLowerCase().includes(searchLower) ||
        driver.phone?.toLowerCase().includes(searchLower) ||
        driver.email?.toLowerCase().includes(searchLower) ||
        vendorName.includes(searchLower);
        
      const matchesVendor = vendorFilter === 'All' || driver.vendorId === vendorFilter;
      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
      const matchesLicense = licenseFilter === 'All' || driver.licenseStatus === licenseFilter;
      const matchesDoc = documentFilter === 'All' || driver.documentStatus === documentFilter;
      
      return matchesSearch && matchesVendor && matchesStatus && matchesLicense && matchesDoc;
    });
  }, [drivers, vendors, debouncedSearchQuery, vendorFilter, statusFilter, licenseFilter, documentFilter]);

  const paginatedDrivers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(startIndex, startIndex + pageSize);
  }, [filteredDrivers, currentPage]);

  // Handlers
  const handleAddClick = () => {
    setDriverToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (driver) => {
    setDriverToEdit(driver);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (driverToEdit) {
      editDriver(driverToEdit.id, formData);
      setNotification('Driver updated successfully.');
    } else {
      addDriver(formData);
      setNotification('Driver added successfully.');
    }
    setIsFormOpen(false);
  };

  const handleStatusClick = (driver) => {
    setDriverToConfirm(driver);
    setIsConfirmOpen(true);
  };

  const handleStatusConfirm = (newStatus) => {
    if (driverToConfirm) {
      updateDriverStatus(driverToConfirm.id, newStatus);
      setNotification(`Driver ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`);
    }
    setIsConfirmOpen(false);
  };

  const handleViewDetails = (driverId) => {
    navigate(`/drivers/${driverId}`);
  };

  // Table columns
  const columns = [
    { header: 'Driver Name', accessor: 'name', className: 'font-semibold text-slate-900', render: (row) => (
      <button 
        onClick={() => handleViewDetails(row.id)}
        className="text-left group flex flex-col focus:outline-none"
      >
        <div className="font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">{row.name}</div>
        <div className="text-xs text-slate-500 font-normal">{row.id}</div>
      </button>
    )},
    { header: 'Contact', accessor: 'contact', render: (row) => (
      <div className="text-sm">
        <div>{row.phone}</div>
        <div className="text-xs text-slate-500">{row.email || 'No email provided'}</div>
      </div>
    )},
    { header: 'Assigned To', accessor: 'assignment', render: (row) => (
      <div className="text-sm">
        <div className="font-medium text-slate-700">{vendors.find(v => v.id === row.vendorId)?.name || row.vendorId}</div>
        <div className="text-xs text-slate-500">Veh: {row.assignedVehicle || 'Unassigned'}</div>
      </div>
    )},
    { header: 'License', accessor: 'licenseStatus', render: (row) => (
      <div className="flex flex-col gap-1 items-start">
        <div className="text-xs text-slate-500 font-mono">{row.licenseNumber}</div>
        <DriverStatusBadge status={row.licenseStatus || 'Pending'} type="license" />
      </div>
    )},
    { header: 'Docs', accessor: 'documentStatus', render: (row) => (
      <DriverStatusBadge status={row.documentStatus || 'Pending'} type="document" />
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <DriverStatusBadge status={row.status} type="status" />
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
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
          <h2 className="text-2xl font-bold text-slate-900">Driver Management</h2>
          <p className="mt-1 text-sm text-slate-500">View, search, filter, and manage all drivers across your vendor network.</p>
        </div>
        <button onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap relative overflow-hidden"
        >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full xl:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full flex-1">
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
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Off-Duty">Off-Duty</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select 
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">License Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>

          <select 
            value={documentFilter}
            onChange={(e) => setDocumentFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">Doc Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable columns={8} rows={8} hasHeader={false} />
        ) : filteredDrivers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No drivers found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex-1 overflow-auto">
              <DataTable 
                columns={columns} 
                data={paginatedDrivers} 
                title="Registered Drivers" 
                description={`Showing ${filteredDrivers.length} matching drivers.`}
              />
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDrivers.length / pageSize)}
              totalItems={filteredDrivers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <DriverFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={driverToEdit}
      />

      {/* We reuse the StatusConfirmDialog from Vendor Management, just passing different text context via props if needed, though it's generic enough */}
      <StatusConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusConfirm}
        vendorName={driverToConfirm?.name} // The prop is vendorName but it handles any string
        currentStatus={driverToConfirm?.status}
      />
    </div>
  );
}
