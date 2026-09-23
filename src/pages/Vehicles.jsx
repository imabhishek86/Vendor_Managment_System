import Ripple from '../components/common/Ripple';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import StatusBadge from '../components/common/StatusBadge';
import { useVehicleContext } from '../context/VehicleContext';
import { useVendorContext } from '../context/VendorContext';
import { useDriverContext } from '../context/DriverContext';
import { getExpiryStatus } from '../utils/dateStatus';
import VehicleFormModal from '../components/vehicle/VehicleFormModal';
import ComplianceStatusBadge from '../components/vehicle/ComplianceStatusBadge';
import StatusConfirmDialog from '../components/vendor/StatusConfirmDialog';
import useDebounce from '../hooks/useDebounce';
import { SkeletonTable } from '../components/common/Skeleton';

export default function Vehicles() {
  const { vehicles, addVehicle, editVehicle, updateVehicleStatus } = useVehicleContext();
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
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
  const [vendorFilter, setVendorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [insuranceFilter, setInsuranceFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, typeFilter, vendorFilter, statusFilter, insuranceFilter]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [vehicleToConfirm, setVehicleToConfirm] = useState(null);

  // Notification state
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Derived filtered data
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Resolve names for search
      const vendorName = vendors.find(v => v.id === vehicle.vendorId)?.name || '';
      const driverName = drivers.find(d => d.id === vehicle.driverId)?.name || '';
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      
      const matchesSearch = 
        !debouncedSearchQuery || 
        vehicle.licensePlate.toLowerCase().includes(searchLower) ||
        vehicle.registrationNumber?.toLowerCase().includes(searchLower) ||
        vendorName.toLowerCase().includes(searchLower) ||
        driverName.toLowerCase().includes(searchLower);
        
      const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
      const matchesVendor = vendorFilter === 'All' || vehicle.vendorId === vendorFilter;
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      
      const insuranceStatus = getExpiryStatus(vehicle.insuranceExpiry);
      const matchesInsurance = insuranceFilter === 'All' || insuranceStatus === insuranceFilter;
      
      return matchesSearch && matchesType && matchesVendor && matchesStatus && matchesInsurance;
    });
  }, [vehicles, vendors, drivers, debouncedSearchQuery, typeFilter, vendorFilter, statusFilter, insuranceFilter]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(startIndex, startIndex + pageSize);
  }, [filteredVehicles, currentPage]);

  // Handlers
  const handleAddClick = () => {
    setVehicleToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (vehicleToEdit) {
      editVehicle(vehicleToEdit.id, formData);
      setNotification('Vehicle updated successfully.');
    } else {
      addVehicle(formData);
      setNotification('Vehicle added successfully.');
    }
    setIsFormOpen(false);
  };

  const handleStatusClick = (vehicle) => {
    setVehicleToConfirm(vehicle);
    setIsConfirmOpen(true);
  };

  const handleStatusConfirm = (newStatus) => {
    if (vehicleToConfirm) {
      updateVehicleStatus(vehicleToConfirm.id, newStatus);
      setNotification(`Vehicle marked as ${newStatus} successfully.`);
    }
    setIsConfirmOpen(false);
  };

  const handleViewDetails = (vehicleId) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  // Table columns
  const columns = [
    { header: 'Vehicle Number', accessor: 'licensePlate', className: 'font-semibold text-slate-900', render: (row) => (
      <button 
        onClick={() => handleViewDetails(row.id)}
        className="text-left group flex flex-col focus:outline-none"
      >
        <div className="font-semibold text-primary-600 group-hover:text-primary-800 transition-colors uppercase font-mono">{row.licensePlate}</div>
        <div className="text-xs text-slate-500 font-normal">{row.make} {row.model}</div>
      </button>
    )},
    { header: 'Type', accessor: 'type' },
    { header: 'Vendor & Driver', accessor: 'assignment', render: (row) => (
      <div className="text-sm">
        <div className="font-medium text-slate-700">{vendors.find(v => v.id === row.vendorId)?.name || row.vendorId}</div>
        <div className="text-xs text-slate-500">Dr: {drivers.find(d => d.id === row.driverId)?.name || 'Unassigned'}</div>
      </div>
    )},
    { header: 'Registration', accessor: 'registration', render: (row) => (
      <div className="flex flex-col gap-1 items-start">
        <ComplianceStatusBadge date={row.registrationExpiry} />
      </div>
    )},
    { header: 'Insurance', accessor: 'insurance', render: (row) => (
      <ComplianceStatusBadge date={row.insuranceExpiry} />
    )},
    { header: 'Permit', accessor: 'permit', render: (row) => (
      <ComplianceStatusBadge date={row.permitExpiry} />
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <StatusBadge status={row.status} />
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
          <h2 className="text-2xl font-bold text-slate-900">Vehicle Management</h2>
          <p className="mt-1 text-sm text-slate-500">View, search, filter, and manage fleet vehicles and compliance.</p>
        </div>
        <button onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap relative overflow-hidden"
        >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full xl:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by plate, reg no, vendor, driver..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full flex-1">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
            <option value="Tempo Traveller">Tempo Traveller</option>
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
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">Vehicle Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

          <select 
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="All">Insurance Status</option>
            <option value="Valid">Valid</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <SkeletonTable columns={8} rows={8} hasHeader={false} />
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No vehicles found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex-1 overflow-auto">
              <DataTable 
                columns={columns} 
                data={paginatedVehicles} 
                title="Registered Vehicles" 
                description={`Showing ${filteredVehicles.length} matching vehicles.`}
              />
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredVehicles.length / pageSize)}
              totalItems={filteredVehicles.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <VehicleFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={vehicleToEdit}
      />

      <StatusConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusConfirm}
        vendorName={vehicleToConfirm?.licensePlate} 
        currentStatus={vehicleToConfirm?.status}
      />
    </div>
  );
}
