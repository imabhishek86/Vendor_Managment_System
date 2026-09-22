import Ripple from '../common/Ripple';
import { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDriverContext } from '../../context/DriverContext';
import { useVehicleContext } from '../../context/VehicleContext';

export default function DocumentUploadModal({ isOpen, onClose, onSubmit }) {
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    entityType: 'driver',
    entityId: '',
    documentType: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: ''
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');

    if (selectedFile) {
      // Validate type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF, JPG, JPEG and PNG files are allowed.');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Validate size (5MB = 5 * 1024 * 1024 bytes)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5 MB.');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFile(selectedFile);
    }
  };

  const validate = () => {
    if (!formData.entityId) return 'Please select an entity (Driver/Vehicle).';
    if (!formData.documentType) return 'Document Type is required.';
    if (!formData.documentNumber.trim()) return 'Document Number is required.';
    if (!formData.issueDate) return 'Issue Date is required.';
    if (!formData.expiryDate) return 'Expiry Date is required.';
    if (!file) return 'Please upload a valid document file.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Determine the vendor based on selected entity
    let vendorId = '';
    if (formData.entityType === 'driver') {
      const driver = drivers.find(d => d.id === formData.entityId);
      vendorId = driver?.vendorId || '';
    } else {
      const vehicle = vehicles.find(v => v.id === formData.entityId);
      vendorId = vehicle?.vendorId || '';
    }

    // Mock upload output
    const submitData = {
      ...formData,
      fileName: file.name,
      vendorId
    };

    onSubmit(submitData);
    
    // Reset state for next open
    setFormData({
      entityType: 'driver',
      entityId: '',
      documentType: '',
      documentNumber: '',
      issueDate: '',
      expiryDate: ''
    });
    setFile(null);
    setError('');
  };

  const driverDocTypes = ['Driving License', 'ID Proof', 'Address Proof', 'Police Verification'];
  const vehicleDocTypes = ['Registration Certificate', 'Insurance', 'Permit', 'Pollution Certificate'];

  const availableDocTypes = formData.entityType === 'driver' ? driverDocTypes : vehicleDocTypes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col my-8 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 relative overflow-hidden">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 overflow-y-auto space-y-4">
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type <span className="text-red-500">*</span></label>
                <select 
                  value={formData.entityType}
                  onChange={e => {
                    setFormData({...formData, entityType: e.target.value, entityId: '', documentType: ''});
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="driver">Driver</option>
                  <option value="vehicle">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Entity <span className="text-red-500">*</span></label>
                <select 
                  value={formData.entityId}
                  onChange={e => setFormData({...formData, entityId: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">-- Select --</option>
                  {formData.entityType === 'driver' && drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.id})</option>)}
                  {formData.entityType === 'vehicle' && vehicles.map(v => <option key={v.id} value={v.id}>{v.licensePlate} ({v.id})</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Type <span className="text-red-500">*</span></label>
              <select 
                value={formData.documentType}
                onChange={e => setFormData({...formData, documentType: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">-- Select Type --</option>
                {availableDocTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Number <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.documentNumber}
                onChange={e => setFormData({...formData, documentNumber: e.target.value.toUpperCase()})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                placeholder="Enter ID/Number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.issueDate}
                  onChange={e => setFormData({...formData, issueDate: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload File <span className="text-red-500">*</span></label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${file ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-primary-500" />
                    <span className="text-sm font-medium text-slate-900">{file.name}</span>
                    <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">Click to browse or drag and drop</span>
                    <span className="text-xs text-slate-500">PDF, JPG, PNG (Max 5MB)</span>
                  </div>
                )}
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
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
