import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockVehicles } from '../data/mockVehicles';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const VehicleContext = createContext();

export function useVehicleContext() {
  return useContext(VehicleContext);
}

const STORAGE_KEY = 'vendor-management-vehicles';

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => loadFromStorage(STORAGE_KEY, mockVehicles));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, vehicles);
  }, [vehicles]);

  const addVehicle = (vehicle) => {
    const newId = `VH-${String(Math.max(...vehicles.map(v => parseInt(v.id.replace('VH-', '')) || 0)) + 1).padStart(3, '0')}`;
    
    const newVehicle = {
      ...vehicle,
      id: newId
    };
    
    setVehicles(prev => [...prev, newVehicle]);
  };

  const editVehicle = (id, updatedFields) => {
    setVehicles(prev => 
      prev.map(v => v.id === id ? { ...v, ...updatedFields } : v)
    );
  };

  const updateVehicleStatus = (id, status) => {
    setVehicles(prev => 
      prev.map(v => v.id === id ? { ...v, status } : v)
    );
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, editVehicle, updateVehicleStatus }}>
      {children}
    </VehicleContext.Provider>
  );
}
