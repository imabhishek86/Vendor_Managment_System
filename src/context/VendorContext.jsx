import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockVendors } from '../data/mockVendors';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const VendorContext = createContext();

export function useVendorContext() {
  return useContext(VendorContext);
}

const STORAGE_KEY = 'vendor-management-vendors';

export function VendorProvider({ children }) {
  const [vendors, setVendors] = useState(() => loadFromStorage(STORAGE_KEY, mockVendors));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, vendors);
  }, [vendors]);

  const addVendor = (vendor) => {
    // Generate a simple mock ID
    const newId = `V${Math.max(...vendors.map(v => parseInt(v.id.replace('V', '')) || 0)) + 1}`;
    
    const newVendor = {
      ...vendor,
      id: newId,

      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setVendors(prev => [...prev, newVendor]);
  };

  const editVendor = (id, updatedFields) => {
    setVendors(prev => 
      prev.map(v => v.id === id ? { ...v, ...updatedFields } : v)
    );
  };

  const updateVendorStatus = (id, status) => {
    setVendors(prev => 
      prev.map(v => v.id === id ? { ...v, status } : v)
    );
  };

  const moveVendor = (vendorId, newManagerId) => {
    setVendors(prev => 
      prev.map(v => 
        v.id === vendorId 
          ? { ...v, parentId: newManagerId === 'root' ? null : newManagerId } 
          : v
      )
    );
  };

  return (
    <VendorContext.Provider value={{ vendors, addVendor, editVendor, updateVendorStatus, moveVendor }}>
      {children}
    </VendorContext.Provider>
  );
}
