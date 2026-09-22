import React, { createContext, useContext, useState } from 'react';
import { mockVendors } from '../data/mockVendors';

const VendorContext = createContext();

export function useVendorContext() {
  return useContext(VendorContext);
}

export function VendorProvider({ children }) {
  const [vendors, setVendors] = useState(mockVendors);

  const addVendor = (vendor) => {
    // Generate a simple mock ID
    const newId = `V${Math.max(...vendors.map(v => parseInt(v.id.replace('V', '')) || 0)) + 1}`;
    
    const newVendor = {
      ...vendor,
      id: newId,
      metrics: { drivers: 0, vehicles: 0 },
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
