import { X, Shield } from 'lucide-react';
import DelegationStatusBadge from './DelegationStatusBadge';
import { ALL_PERMISSIONS } from './PermissionSelector';
import { useVendorContext } from '../../context/VendorContext';

export default function DelegationDetailsModal({ isOpen, onClose, delegation }) {
  const { vendors } = useVendorContext();

  if (!isOpen || !delegation) return null;

  const delegator = vendors.find(v => v.id === delegation.delegatorId);
  const delegatee = vendors.find(v => v.id === delegation.delegateeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            Delegation Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{delegation.id}</div>
              <div className="text-sm font-medium text-slate-500">Created: {delegation.createdAt}</div>
            </div>
            <DelegationStatusBadge status={delegation.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Delegator</div>
              <div className="text-sm font-semibold text-slate-900">{delegator?.name || delegation.delegatorId}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Delegatee</div>
              <div className="text-sm font-semibold text-slate-900">{delegatee?.name || delegation.delegateeId}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-3">
              Granted Permissions ({delegation.permissions.length})
            </div>
            <div className="space-y-2">
              {ALL_PERMISSIONS.map(perm => {
                const hasPerm = delegation.permissions.includes(perm.id);
                return (
                  <div key={perm.id} className="flex items-center gap-2">
                    <span className={`text-lg ${hasPerm ? 'text-green-500' : 'text-slate-300'}`}>
                      {hasPerm ? '✓' : '✕'}
                    </span>
                    <span className={`text-sm ${hasPerm ? 'font-medium text-slate-900' : 'text-slate-400 line-through'}`}>
                      {perm.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
