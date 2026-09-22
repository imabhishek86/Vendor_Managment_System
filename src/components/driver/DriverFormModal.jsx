import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useVendorContext } from '../../context/VendorContext';
import { useDriverContext } from '../../context/DriverContext';
import { mockVehicles } from '../../data/mockVehicles';

export default function DriverFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vendorId: '',
    assignedVehicle: '',
    licenseNumber: '',
    licenseExpiry: '',
    status: 'Active'
  });
  
  const [error, setError] = useState('');

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          vendorId: initialData.vendorId || '',
          assignedVehicle: initialData.assignedVehicle || '',
          licenseNumber: initialData.licenseNumber || '',
          licenseExpiry: initialData.licenseExpiry || '',
          status: initialData.status || 'Active'
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          email: '',
          vendorId: '',
          assignedVehicle: '',
          licenseNumber: '',
          licenseExpiry: '',
          status: 'Active'
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    if (!formData.name.trim()) return 'Driver name is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) return 'Valid email is required if provided.';
    if (!formData.vendorId) return 'Vendor assignment is required.';
    if (!formData.licenseNumber.trim()) return 'Driving License Number is required.';
    if (!formData.licenseExpiry && !isEdit) return 'License Expiry Date is required.'; // Make optional on edit if missing from mock data

    // Vehicle Assignment Validation
    if (formData.assignedVehicle && formData.assignedVehicle !== 'Unassigned') {
      // Check if another ACTIVE driver already has this vehicle
      const conflictingDriver = drivers.find(d => 
        d.assignedVehicle === formData.assignedVehicle && 
        d.status === 'Active' && 
        (!isEdit || d.id !== initialData.id)
      );

      if (conflictingDriver) {
        return `Vehicle ${formData.assignedVehicle} is already assigned to active driver: ${conflictingDriver.name}.`;
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
    
    // Auto-set document/license statuses for mock purposes
    const submitData = { 
      ...formData,
      assignedVehicle: formData.assignedVehicle || 'Unassigned',
      licenseStatus: isEdit ? (initialData.licenseStatus || 'Verified') : 'Pending',
      documentStatus: isEdit ? (initialData.documentStatus || 'Verified') : 'Pending'
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 overflow-y-auto space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="rahul@example.com"
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
                  <option value="Pending">Pending</option>
                  <option value="Off-Duty">Off-Duty</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 border-t border-slate-200 pt-4 mt-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Assignments & Documentation</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Vendor <span className="text-red-500">*</span></label>
                <select 
                  value={formData.vendorId}
                  onChange={e => setFormData({...formData, vendorId: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Vehicle</label>
                <select 
                  value={formData.assignedVehicle}
                  onChange={e => setFormData({...formData, assignedVehicle: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Unassigned">-- Unassigned --</option>
                  {mockVehicles.map(vh => (
                    <option key={vh.id} value={vh.id}>{vh.id} - {vh.make} {vh.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driving License No. <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.licenseNumber}
                  onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                  placeholder="DL-XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Expiry Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.licenseExpiry}
                  onChange={e => setFormData({...formData, licenseExpiry: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              {isEdit ? 'Save Changes' : 'Add Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
