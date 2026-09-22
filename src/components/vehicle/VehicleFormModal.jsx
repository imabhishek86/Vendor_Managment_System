import Ripple from '../common/Ripple';
import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useVendorContext } from '../../context/VendorContext';
import { useDriverContext } from '../../context/DriverContext';
import { useVehicleContext } from '../../context/VehicleContext';

export default function VehicleFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();
  
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'Sedan',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vendorId: '',
    driverId: 'Unassigned',
    registrationNumber: '',
    registrationExpiry: '',
    insuranceExpiry: '',
    permitExpiry: '',
    status: 'Active'
  });
  
  const [error, setError] = useState('');
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          vehicleNumber: initialData.licensePlate || '',
          type: initialData.type || 'Sedan',
          make: initialData.make || '',
          model: initialData.model || '',
          year: initialData.year || new Date().getFullYear(),
          vendorId: initialData.vendorId || '',
          driverId: initialData.driverId || 'Unassigned',
          registrationNumber: initialData.registrationNumber || '',
          registrationExpiry: initialData.registrationExpiry || '',
          insuranceExpiry: initialData.insuranceExpiry || '',
          permitExpiry: initialData.permitExpiry || '',
          status: initialData.status || 'Active'
        });
      } else {
        setFormData({
          vehicleNumber: '',
          type: 'Sedan',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          vendorId: '',
          driverId: 'Unassigned',
          registrationNumber: '',
          registrationExpiry: '',
          insuranceExpiry: '',
          permitExpiry: '',
          status: 'Active'
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    if (!formData.vehicleNumber.trim()) return 'Vehicle number / License plate is required.';
    if (!formData.type) return 'Vehicle type is required.';
    if (!formData.vendorId) return 'Vendor assignment is required.';
    if (!formData.registrationNumber.trim()) return 'Registration number is required.';
    if (!formData.registrationExpiry) return 'Registration expiry date is required.';
    if (!formData.insuranceExpiry) return 'Insurance expiry date is required.';
    if (!formData.permitExpiry) return 'Permit expiry date is required.';

    // Driver Assignment Validation
    if (formData.driverId && formData.driverId !== 'Unassigned') {
      // Find if this driver is active
      const selectedDriver = drivers.find(d => d.id === formData.driverId);
      if (selectedDriver && selectedDriver.status === 'Active') {
        // Check if this active driver is already assigned to ANOTHER active vehicle
        const conflictingVehicle = vehicles.find(v => 
          v.driverId === formData.driverId && 
          v.status === 'Active' && 
          (!isEdit || v.id !== initialData.id)
        );

        if (conflictingVehicle) {
          return `Driver ${selectedDriver.name} is already assigned to active vehicle ${conflictingVehicle.licensePlate}.`;
        }
      }
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Convert generic form fields to expected mock data structure
    const submitData = { 
      ...formData,
      licensePlate: formData.vehicleNumber,
      driverId: formData.driverId || 'Unassigned'
    };
    
    // Remove temporary form fields that map differently
    delete submitData.vehicleNumber;

    onSubmit(submitData);
  };

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Van', 'Bus', 'Tempo Traveller'];

  // Only show drivers that are assigned to the currently selected vendor, or 'Unassigned'
  const availableDrivers = drivers.filter(d => d.vendorId === formData.vendorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col my-8 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 relative overflow-hidden"
          >
        <Ripple color="rgba(0, 0, 0, 0.1)" />
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 overflow-y-auto space-y-5 max-h-[70vh]">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Vehicle Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Plate / Vehicle No. <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.vehicleNumber}
                  onChange={e => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                  placeholder="e.g. DL-01-AB-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type <span className="text-red-500">*</span></label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make (Brand)</label>
                <input 
                  type="text" 
                  value={formData.make}
                  onChange={e => setFormData({...formData, make: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input 
                  type="text" 
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Camry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturing Year</label>
                <input 
                  type="number" 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Retired">Retired</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Assignments</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Vendor <span className="text-red-500">*</span></label>
                <select 
                  value={formData.vendorId}
                  onChange={e => {
                    setFormData({
                      ...formData, 
                      vendorId: e.target.value, 
                      driverId: 'Unassigned' // Reset driver if vendor changes
                    })
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Driver</label>
                <select 
                  value={formData.driverId}
                  onChange={e => setFormData({...formData, driverId: e.target.value})}
                  disabled={!formData.vendorId}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="Unassigned">-- Unassigned --</option>
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                  ))}
                </select>
                {!formData.vendorId && <p className="text-xs text-amber-600 mt-1">Select a vendor first</p>}
              </div>

              <div className="md:col-span-2 pt-2">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Compliance & Expiries</h3>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.registrationNumber}
                  onChange={e => setFormData({...formData, registrationNumber: e.target.value.toUpperCase()})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Expiry <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.registrationExpiry}
                  onChange={e => setFormData({...formData, registrationExpiry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Expiry <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.insuranceExpiry}
                  onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Permit Expiry <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.permitExpiry}
                  onChange={e => setFormData({...formData, permitExpiry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
            <button type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors relative overflow-hidden"
            >
        <Ripple color="rgba(0, 0, 0, 0.1)" />
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors shadow-sm relative overflow-hidden"
            >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
              {isEdit ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
