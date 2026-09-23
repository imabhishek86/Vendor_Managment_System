import { useState, useEffect, useMemo } from 'react';
import { dashboardData } from '../data/dashboardData';
import { useVendorContext } from '../context/VendorContext';
import { useDriverContext } from '../context/DriverContext';
import { useVehicleContext } from '../context/VehicleContext';
import { useDocumentContext } from '../context/DocumentContext';
import StatCard from '../components/dashboard/StatCard';
import VendorOverview from '../components/dashboard/VendorOverview';
import FleetStatus from '../components/dashboard/FleetStatus';
import ComplianceCard from '../components/dashboard/ComplianceCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { SkeletonCard, Skeleton } from '../components/common/Skeleton';

export default function Dashboard() {
  const { recentActivity } = dashboardData;
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();
  const { documents, getResolvedStatus } = useDocumentContext();

  const dynamicStats = useMemo(() => {
    return [
      { id: 'stat-1', label: 'Total Vendors', value: vendors.length, trend: '+0%', icon: 'Users', color: 'blue' },
      { id: 'stat-2', label: 'Active Vendors', value: vendors.filter(v => v.status === 'Active').length, trend: '+0%', icon: 'UserCheck', color: 'green' },
      { id: 'stat-3', label: 'Total Drivers', value: drivers.length, trend: '+0%', icon: 'Contact', color: 'indigo' },
      { id: 'stat-4', label: 'Total Vehicles', value: vehicles.length, trend: '+0%', icon: 'Car', color: 'purple' },
      { id: 'stat-5', label: 'Pending Documents', value: documents.filter(d => getResolvedStatus(d) === 'Pending').length, trend: '+0%', icon: 'FileClock', color: 'amber' },
      { id: 'stat-6', label: 'Compliance Issues', value: documents.filter(d => ['Expired', 'Expiring Soon', 'Rejected'].includes(getResolvedStatus(d))).length, trend: '+0%', icon: 'AlertTriangle', color: 'red' }
    ];
  }, [vendors, drivers, vehicles, documents, getResolvedStatus]);

  const dynamicVendorOverview = useMemo(() => {
    return {
      super: vendors.filter(v => v.type === 'Master Vendor' || v.type === 'Super Vendor').length,
      regional: vendors.filter(v => v.type === 'Regional Vendor').length,
      city: vendors.filter(v => v.type === 'City Vendor' || v.type === 'Sub Vendor').length,
      total: vendors.length
    };
  }, [vendors]);

  const dynamicFleetStatus = useMemo(() => {
    return {
      active: vehicles.filter(v => v.status === 'Active').length,
      maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
      inactive: vehicles.filter(v => v.status === 'Inactive' || v.status === 'Retired').length,
      pending: vehicles.filter(v => v.status === 'Pending').length,
      total: vehicles.length
    };
  }, [vehicles]);

  const dynamicDocumentCompliance = useMemo(() => {
    let verified = 0, expiringSoon = 0, expired = 0, rejected = 0;
    documents.forEach(doc => {
      const status = getResolvedStatus(doc);
      if (status === 'Verified') verified++;
      else if (status === 'Expiring Soon') expiringSoon++;
      else if (status === 'Expired') expired++;
      else if (status === 'Rejected') rejected++;
    });
    return { verified, expiringSoon, expired, rejected, total: documents.length };
  }, [documents, getResolvedStatus]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Monitor your vendor network and fleet operations</p>
        </div>
      </div>

      {/* Statistics Cards Layout */}
      {/* Mobile: 1-col, Tablet: 2-col, Desktop: 3-col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading 
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : dynamicStats.map((stat) => (
            <StatCard 
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              iconName={stat.icon}
              color={stat.color}
            />
          ))
        }
      </div>

      {/* Main Grid Layout for widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Row 1 widgets */}
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <VendorOverview data={dynamicVendorOverview} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <FleetStatus data={dynamicFleetStatus} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <ComplianceCard data={dynamicDocumentCompliance} />}
        </div>

        {/* Row 2 widgets */}
        <div className="lg:col-span-2">
          {isLoading ? <Skeleton className="h-96 w-full rounded-xl" /> : <RecentActivity activities={recentActivity} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-96 w-full rounded-xl" /> : <QuickActions />}
        </div>
        
      </div>
    </div>
  );
}
