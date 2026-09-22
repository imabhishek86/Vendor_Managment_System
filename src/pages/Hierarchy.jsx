import { useState, useMemo, useEffect } from 'react';
import VendorTree from '../components/hierarchy/VendorTree';
import VendorDetailsPanel from '../components/hierarchy/VendorDetailsPanel';
import MoveUserModal from '../components/hierarchy/MoveUserModal';
import { buildVendorTree } from '../utils/hierarchy';
import { useVendorContext } from '../context/VendorContext';
import { CheckCircle2 } from 'lucide-react';

export default function Hierarchy() {
  const { vendors, moveVendor } = useVendorContext();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Move user modal state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [vendorToMove, setVendorToMove] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter vendors based on search query, then build tree
  const filteredAndBuiltTree = useMemo(() => {
    if (!searchQuery) {
      return buildVendorTree(vendors);
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const vendorMap = new Map();
    vendors.forEach(v => vendorMap.set(v.id, v));
    
    const keepIds = new Set();
    
    // Find all direct matches
    vendors.forEach(v => {
      if (v.name.toLowerCase().includes(lowerQuery)) {
        // Match found! Keep this node and all ancestors
        let current = v;
        while (current) {
          keepIds.add(current.id);
          current = current.parentId ? vendorMap.get(current.parentId) : null;
        }
      }
    });
    
    const filtered = vendors.filter(v => keepIds.has(v.id));
    return buildVendorTree(filtered);
  }, [searchQuery, vendors]);

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleMoveUserClick = (vendor) => {
    setVendorToMove(vendor);
    setIsMoveModalOpen(true);
  };

  const handleMoveSubmit = (vendorId, newManagerId) => {
    moveVendor(vendorId, newManagerId);
    
    // Update selected vendor if it's the one that was moved
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor(prev => ({ ...prev, parentId: newManagerId === 'root' ? null : newManagerId }));
    }
    
    setIsMoveModalOpen(false);
    setNotification('User moved successfully.');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col relative">
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Vendor Hierarchy</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your multi-level vendor relationships and view detailed metrics.</p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-2 h-full">
          <VendorTree 
            vendors={filteredAndBuiltTree} 
            onSelect={handleSelectVendor}
            selectedId={selectedVendor?.id}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onMoveUser={handleMoveUserClick}
          />
        </div>
        <div className="h-full hidden lg:block">
          <VendorDetailsPanel vendor={selectedVendor} />
        </div>
      </div>
      
      {/* Mobile Details Panel Overlay */}
      {selectedVendor && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="flex justify-end p-2 border-b border-slate-100">
              <button 
                onClick={() => setSelectedVendor(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-4">
              <VendorDetailsPanel vendor={selectedVendor} />
            </div>
          </div>
        </div>
      )}
      
      <MoveUserModal 
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        vendorToMove={vendorToMove}
        allVendors={vendors}
        onMove={handleMoveSubmit}
      />
    </div>
  );
}
