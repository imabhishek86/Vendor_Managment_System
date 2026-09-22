import React, { createContext, useContext, useState } from 'react';
import { mockDrivers } from '../data/mockDrivers';

const DriverContext = createContext();

export function useDriverContext() {
  return useContext(DriverContext);
}

export function DriverProvider({ children }) {
  const [drivers, setDrivers] = useState(mockDrivers);

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
