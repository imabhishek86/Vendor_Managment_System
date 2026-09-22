import React, { createContext, useContext, useState } from 'react';
import { mockDelegations } from '../data/delegationData';

const DelegationContext = createContext();

export function useDelegationContext() {
  return useContext(DelegationContext);
}

export function DelegationProvider({ children }) {
  const [delegations, setDelegations] = useState(mockDelegations);

  const createDelegation = (data) => {
    const newId = `del${String(Math.max(...delegations.map(d => parseInt(d.id.replace('del', '')) || 0)) + 1).padStart(3, '0')}`;
    
    const newDelegation = {
      ...data,
      id: newId,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDelegations(prev => [...prev, newDelegation]);
  };

  const updateDelegation = (id, updatedFields) => {
    setDelegations(prev => 
      prev.map(d => d.id === id ? { ...d, ...updatedFields } : d)
    );
  };

  const revokeDelegation = (id) => {
    updateDelegation(id, { status: 'Revoked' });
  };

  const getSummary = () => {
    const active = delegations.filter(d => d.status === 'Active');
    const revoked = delegations.filter(d => d.status === 'Revoked');
    // Calculate unique delegatees that have an Active delegation
    const uniqueVendorsWithAccess = new Set(active.map(d => d.delegateeId)).size;

    return {
      Total: delegations.length,
      Active: active.length,
      Revoked: revoked.length,
      VendorsWithAccess: uniqueVendorsWithAccess
    };
  };

  return (
    <DelegationContext.Provider value={{ 
      delegations, 
      createDelegation, 
      updateDelegation, 
      revokeDelegation,
      getSummary
    }}>
      {children}
    </DelegationContext.Provider>
  );
}
