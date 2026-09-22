import { dashboardData } from '../data/dashboardData';
import StatCard from '../components/dashboard/StatCard';
import VendorOverview from '../components/dashboard/VendorOverview';
import FleetStatus from '../components/dashboard/FleetStatus';
import ComplianceCard from '../components/dashboard/ComplianceCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { stats, vendorOverview, fleetStatus, documentCompliance, recentActivity } = dashboardData;

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
        {stats.map((stat) => (
          <StatCard 
            key={stat.id}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            iconName={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Grid Layout for widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Row 1 widgets */}
        <div className="lg:col-span-1">
          <VendorOverview data={vendorOverview} />
        </div>
        <div className="lg:col-span-1">
          <FleetStatus data={fleetStatus} />
        </div>
        <div className="lg:col-span-1">
          <ComplianceCard data={documentCompliance} />
        </div>

        {/* Row 2 widgets */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        
      </div>
    </div>
  );
}
