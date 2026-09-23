import { generateVendors } from './generators';

const baseVendors = [
  {
    id: 'V1',
    name: 'Global Fleet Inc.',
    contactPerson: 'Alice Johnson',
    email: 'alice.j@globalfleet.com',
    phone: '+1 (555) 123-4567',
    status: 'Active',
    type: 'Master Vendor',
    parentId: null,

    joinDate: '2023-01-15'
  },
  {
    id: 'V2',
    name: 'Metro Cabs LLC',
    contactPerson: 'Bob Smith',
    email: 'bob@metrocabs.com',
    phone: '+1 (555) 987-6543',
    status: 'Active',
    type: 'Sub Vendor',
    parentId: 'V1',

    joinDate: '2023-03-22'
  },
  {
    id: 'V3',
    name: 'City Express',
    contactPerson: 'Charlie Davis',
    email: 'charlie@cityexpress.net',
    phone: '+1 (555) 345-6789',
    status: 'Pending',
    type: 'Sub Vendor',
    parentId: 'V1',

    joinDate: '2024-01-10'
  },
  {
    id: 'V4',
    name: 'Westside Logistics',
    contactPerson: 'Diana Prince',
    email: 'diana@westsidelogistics.com',
    phone: '+1 (555) 222-3333',
    status: 'Active',
    type: 'Master Vendor',
    parentId: null,

    joinDate: '2022-11-05'
  },
  {
    id: 'V5',
    name: 'Coastal Transport',
    contactPerson: 'Edward Teach',
    email: 'edward@coastaltransport.com',
    phone: '+1 (555) 888-9999',
    status: 'Suspended',
    type: 'Sub Vendor',
    parentId: 'V4',

    joinDate: '2023-06-18'
  },
  {
    id: 'V6',
    name: 'Quick Ride Agency',
    contactPerson: 'Fiona Gallagher',
    email: 'fiona@quickride.com',
    phone: '+1 (555) 777-6666',
    status: 'Active',
    type: 'Sub Vendor',
    parentId: 'V2',

    joinDate: '2023-08-30'
  }
];

export const mockVendors = [...baseVendors, ...generateVendors(194, baseVendors.length)];
