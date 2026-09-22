import { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, ArrowRightLeft } from 'lucide-react';
import ManagerSelector from './ManagerSelector';

export default function MoveUserModal({ isOpen, onClose, vendorToMove, allVendors, onMove }) {
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedManagerId(null);
      setError('');
    }
  }, [isOpen]);

  // Compute disabled descendant IDs
  const disabledIds = useMemo(() => {
    const ids = new Set();
    if (!vendorToMove) return ids;
    
    // Add self
    ids.add(vendorToMove.id);
    
    // Find all descendants using BFS
    const queue = [vendorToMove.id];
    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = allVendors.filter(v => v.parentId === currentId);
      children.forEach(child => {
        ids.add(child.id);
        queue.push(child.id);
      });
    }
    
    return ids;
  }, [vendorToMove, allVendors]);

  if (!isOpen || !vendorToMove) return null;

  const currentManager = vendorToMove.parentId 
    ? allVendors.find(v => v.id === vendorToMove.parentId)?.name || 'Unknown'
    : 'No Parent';

  const handleMove = () => {
    if (!selectedManagerId) {
      setError('New manager is required.');
      return;
    }

    if (selectedManagerId === vendorToMove.parentId) {
      setError('This vendor is already under this manager.');
      return;
    }

    // Call parent handler to perform the move
    onMove(vendorToMove.id, selectedManagerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900">
            <ArrowRightLeft className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-bold">Move User</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current User</span>
              <span className="block text-sm font-medium text-slate-900 truncate" title={vendorToMove.name}>
                {vendorToMove.name}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Manager</span>
              <span className="block text-sm font-medium text-slate-900 truncate" title={currentManager}>
                {currentManager}
              </span>
            </div>
          </div>

          <div className="mb-2">
            <span className="block text-sm font-medium text-slate-700 mb-2">New Manager</span>
            <ManagerSelector 
              vendors={allVendors}
              selectedId={selectedManagerId}
              onSelect={(id) => {
                setSelectedManagerId(id);
                setError(''); // clear error on new selection
              }}
              disabledIds={disabledIds}
            />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleMove}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move User
          </button>
        </div>
      </div>
    </div>
  );
}
