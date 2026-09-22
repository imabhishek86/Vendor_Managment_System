import { X, AlertTriangle } from 'lucide-react';

export default function StatusConfirmDialog({ isOpen, onClose, onConfirm, vendorName, currentStatus }) {
  if (!isOpen) return null;

  const isActivating = currentStatus !== 'Active';
  const newStatus = isActivating ? 'Active' : 'Inactive';
  const actionText = isActivating ? 'Activate' : 'Deactivate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isActivating ? 'bg-green-100' : 'bg-amber-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${isActivating ? 'text-green-600' : 'text-amber-600'}`} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {actionText} Vendor?
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to {actionText.toLowerCase()} <strong>{vendorName}</strong>? 
            {isActivating ? ' They will regain access to the platform.' : ' They will lose access to the platform until reactivated.'}
          </p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(newStatus)}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors shadow-sm ${
                isActivating ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
