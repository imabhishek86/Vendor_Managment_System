import Ripple from '../common/Ripple';
import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useVendorContext } from '../../context/VendorContext';
import { useDelegationContext } from '../../context/DelegationContext';
import PermissionSelector from './PermissionSelector';

export default function DelegationFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { vendors, isDescendant } = useVendorContext();
  const { delegations } = useDelegationContext();
  
  const [delegateeId, setDelegateeId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState('');
  
  const isEdit = !!initialData;
  const currentDelegatorId = 'V1'; // Simulating that the logged-in user is V1 (Super Vendor)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDelegateeId(initialData.delegateeId);
        setPermissions(initialData.permissions || []);
      } else {
        setDelegateeId('');
        setPermissions([]);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    if (!delegateeId) return 'Please select a delegatee vendor.';
    if (permissions.length === 0) return 'Please select at least one permission to delegate.';
    if (delegateeId === currentDelegatorId) return 'You cannot delegate permissions to yourself.';

    // Hierarchy check: using the isDescendant helper from VendorContext to ensure 
    // the delegatee is actually a child/grandchild of the delegator
    if (!isDescendant(currentDelegatorId, delegateeId)) {
      return 'Invalid relationship: Selected vendor is outside your current vendor hierarchy.';
    }

    // Duplicate check
    if (!isEdit) {
      const existingActive = delegations.find(d => 
        d.delegatorId === currentDelegatorId && 
        d.delegateeId === delegateeId && 
        d.status === 'Active'
      );
      if (existingActive) {
        return 'An active delegation already exists for this vendor. Please edit the existing one instead.';
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
    
    onSubmit({
      delegatorId: currentDelegatorId,
      delegateeId,
      permissions
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col my-8 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Delegation' : 'Create Delegation'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 relative overflow-hidden">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 overflow-y-auto space-y-6 max-h-[70vh]">
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-3">Identity</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delegator (You)</label>
                  <input 
                    type="text" 
                    value="Global Fleet Inc. (V1)"
                    disabled
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delegatee (Target) <span className="text-red-500">*</span></label>
                  <select 
                    value={delegateeId}
                    onChange={e => setDelegateeId(e.target.value)}
                    disabled={isEdit}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                <span>Select Permissions</span>
                <span className="text-xs font-normal text-slate-500">{permissions.length} selected</span>
              </h3>
              <PermissionSelector selectedPermissions={permissions} onChange={setPermissions} />
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
              {isEdit ? 'Update Delegation' : 'Create Delegation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
