import { useState, useEffect } from 'react';
import { dashboardData } from '../data/dashboardData';
import StatCard from '../components/dashboard/StatCard';
import VendorOverview from '../components/dashboard/VendorOverview';
import FleetStatus from '../components/dashboard/FleetStatus';
import ComplianceCard from '../components/dashboard/ComplianceCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { SkeletonCard, Skeleton } from '../components/common/Skeleton';

export default function Dashboard() {
  const { stats, vendorOverview, fleetStatus, documentCompliance, recentActivity } = dashboardData;
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
          : stats.map((stat) => (
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
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <VendorOverview data={vendorOverview} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <FleetStatus data={fleetStatus} />}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-[340px] w-full rounded-xl" /> : <ComplianceCard data={documentCompliance} />}
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
