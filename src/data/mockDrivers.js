import { generateDrivers } from './generators';
import { mockVendors } from './mockVendors';

const baseDrivers = [
  {
    id: 'D001',
    name: 'Michael Chang',
    licenseNumber: 'DL-938475',
    status: 'Active',
    rating: 4.8,
    vendorId: 'V1',
    assignedVehicle: 'VH-101',
    phone: '+1 (555) 111-2222'
  },
  {
    id: 'D002',
    name: 'Sarah Connor',
    licenseNumber: 'DL-123456',
    status: 'Off-Duty',
    rating: 4.9,
    vendorId: 'V2',
    assignedVehicle: 'VH-102',
    phone: '+1 (555) 222-3333'
  },
  {
    id: 'D003',
    name: 'James Bond',
    licenseNumber: 'DL-007007',
    status: 'Active',
    rating: 5.0,
    vendorId: 'V1',
    assignedVehicle: 'VH-103',
    phone: '+1 (555) 007-0007'
  },
  {
    id: 'D004',
    name: 'Walter White',
    licenseNumber: 'DL-987654',
    status: 'Suspended',
    rating: 3.2,
    vendorId: 'V4',
    assignedVehicle: 'Unassigned',
    phone: '+1 (555) 444-5555'
  },
  {
    id: 'D005',
    name: 'Jesse Pinkman',
    licenseNumber: 'DL-456789',
    status: 'Active',
    rating: 4.5,
    vendorId: 'V4',
    assignedVehicle: 'VH-105',
    phone: '+1 (555) 666-7777'
  },
  {
    id: 'D006',
    name: 'Tony Soprano',
    licenseNumber: 'DL-654321',
    status: 'Active',
    rating: 4.7,
    vendorId: 'V6',
    assignedVehicle: 'VH-106',
    phone: '+1 (555) 888-9999'
  }
];

export const mockDrivers = [...baseDrivers, ...generateDrivers(994, mockVendors, baseDrivers.length)];
