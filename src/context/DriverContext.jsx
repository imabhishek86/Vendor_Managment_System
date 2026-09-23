import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDrivers } from '../data/mockDrivers';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const DriverContext = createContext();

export function useDriverContext() {
  return useContext(DriverContext);
}

const STORAGE_KEY = 'vendor-management-drivers';

export function DriverProvider({ children }) {
  const [drivers, setDrivers] = useState(() => loadFromStorage(STORAGE_KEY, mockDrivers));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, drivers);
  }, [drivers]);

  const addDriver = (driver) => {
    const newId = `D${String(Math.max(...drivers.map(d => parseInt(d.id.replace('D', '')) || 0)) + 1).padStart(3, '0')}`;
    
    const newDriver = {
      ...driver,
      id: newId,
      rating: 5.0, // Default rating for new drivers
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setDrivers(prev => [...prev, newDriver]);
  };

  const editDriver = (id, updatedFields) => {
    setDrivers(prev => 
      prev.map(d => d.id === id ? { ...d, ...updatedFields } : d)
    );
  };

  const updateDriverStatus = (id, status) => {
    setDrivers(prev => 
      prev.map(d => d.id === id ? { ...d, status } : d)
    );
  };

  return (
    <DriverContext.Provider value={{ drivers, addDriver, editDriver, updateDriverStatus }}>
      {children}
    </DriverContext.Provider>
  );
}
