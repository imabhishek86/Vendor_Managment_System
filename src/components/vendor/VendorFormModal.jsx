import Ripple from '../common/Ripple';
import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function VendorFormModal({ isOpen, onClose, onSubmit, allVendors, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Sub Vendor',
    parentId: '',
    status: 'Active',
    contactPerson: ''
  });
  
  const [error, setError] = useState('');

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          type: initialData.type || 'Sub Vendor',
          parentId: initialData.parentId || '',
          status: initialData.status || 'Active',
          contactPerson: initialData.contactPerson || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'Sub Vendor',
          parentId: '',
          status: 'Active',
          contactPerson: ''
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    if (!formData.name.trim()) return 'Vendor name is required.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return 'Valid email is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.type) return 'Vendor type is required.';
    
    // Parent is required for non-Master/Super vendors
    if (formData.type !== 'Master Vendor' && formData.type !== 'Super Vendor') {
      if (!formData.parentId) return 'A parent vendor must be selected for this vendor type.';
    }

    // Prevent self-parenting on edit
    if (isEdit && formData.parentId === initialData.id) {
      return 'A vendor cannot be its own parent.';
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
    
    // Clean up parentId if it's a master vendor
    const submitData = { ...formData };
    if (submitData.type === 'Master Vendor' || submitData.type === 'Super Vendor') {
      submitData.parentId = null;
    }

    onSubmit(submitData);
  };

  const vendorTypes = ['Master Vendor', 'Super Vendor', 'Regional Vendor', 'City Vendor', 'Sub Vendor'];
  
  // Filter out self and descendants to prevent circular hierarchy
  const availableParents = allVendors.filter(v => {
    if (!isEdit) return true;
    if (v.id === initialData.id) return false;
    
    // BFS to find descendants (simpler check: just don't allow current node as parent for anyone under it)
    let currentParent = v.parentId;
    while(currentParent) {
      if (currentParent === initialData.id) return false;
      const p = allVendors.find(parent => parent.id === currentParent);
      currentParent = p ? p.parentId : null;
    }
    
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col my-8 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
          </h2>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 relative overflow-hidden"
          >
        <Ripple color="rgba(0, 0, 0, 0.1)" />
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. City Express"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                <input 
                  type="text" 
                  value={formData.contactPerson}
                  onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Type <span className="text-red-500">*</span></label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  {vendorTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {formData.type !== 'Master Vendor' && formData.type !== 'Super Vendor' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parent Manager <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.parentId}
                    onChange={e => setFormData({...formData, parentId: e.target.value})}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">-- Select Parent Manager --</option>
                    {availableParents.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                  </select>
                </div>
              )}
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
              {isEdit ? 'Save Changes' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
