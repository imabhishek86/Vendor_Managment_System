export const dashboardData = {
  stats: [
    { id: 'stat-1', label: 'Total Vendors', value: 48, trend: '+12%', icon: 'Users', color: 'blue' },
    { id: 'stat-2', label: 'Active Vendors', value: 42, trend: '+8%', icon: 'UserCheck', color: 'green' },
    { id: 'stat-3', label: 'Total Drivers', value: 186, trend: '+15%', icon: 'Contact', color: 'indigo' },
    { id: 'stat-4', label: 'Total Vehicles', value: 124, trend: '+9%', icon: 'Car', color: 'purple' },
    { id: 'stat-5', label: 'Pending Documents', value: 17, trend: '-6%', icon: 'FileClock', color: 'amber' },
    { id: 'stat-6', label: 'Compliance Issues', value: 5, trend: '-18%', icon: 'AlertTriangle', color: 'red' }
  ],
  vendorOverview: {
    super: 4,
    regional: 12,
    city: 32,
    total: 48
  },
  fleetStatus: {
    active: 96,
    maintenance: 12,
    inactive: 8,
    pending: 8,
    total: 124
  },
  documentCompliance: {
    verified: 82,
    expiringSoon: 11,
    expired: 7
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'driver_added',
      description: 'Regional Vendor "North Fleet" added a new driver',
      time: '10 mins ago',
      icon: 'UserPlus',
      status: 'success'
    },
    {
      id: 'act-2',
      type: 'document_uploaded',
      description: 'City Vendor "Delhi Cabs" uploaded vehicle documents',
      time: '1 hour ago',
      icon: 'FileUp',
      status: 'info'
    },
    {
      id: 'act-3',
      type: 'vendor_approved',
      description: 'Super Vendor approved "Metro Fleet"',
      time: '3 hours ago',
      icon: 'CheckCircle',
      status: 'success'
    },
    {
      id: 'act-4',
      type: 'verification_completed',
      description: 'Driver "Rahul Kumar" completed verification',
      time: 'Yesterday at 4:30 PM',
      icon: 'ShieldCheck',
      status: 'success'
    },
    {
      id: 'act-5',
      type: 'insurance_expiry',
      description: 'Vehicle "DL01AB1234" insurance expires soon',
      time: 'Yesterday at 9:00 AM',
      icon: 'AlertTriangle',
      status: 'warning'
    }
  ]
};
