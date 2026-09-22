import { Activity, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Reports() {
  const metrics = [
    { label: 'Overall Compliance', value: '94%', trend: '+2.4%', good: true },
    { label: 'Active Drivers', value: '856', trend: '+12', good: true },
    { label: 'Vehicles in Maintenance', value: '34', trend: '-5', good: true },
    { label: 'Pending Delegations', value: '18', trend: '+4', good: false },
  ];

  const complianceData = [
    { name: 'Global Fleet Inc.', score: 98, color: 'bg-green-500' },
    { name: 'Westside Logistics', score: 92, color: 'bg-green-400' },
    { name: 'Metro Cabs LLC', score: 85, color: 'bg-amber-400' },
    { name: 'Coastal Transport', score: 65, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">Monitor fleet health, compliance rates, and operational metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item, index) => (
          <div key={index} className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-6">
            <dt className="text-sm font-medium text-slate-500 truncate">{item.label}</dt>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-slate-900">{item.value}</span>
              <span className={`text-sm font-medium ${item.good ? 'text-green-600' : 'text-amber-600'}`}>
                {item.trend}
              </span>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-slate-900">Top Vendors Compliance</h3>
          </div>
          <div className="space-y-5">
            {complianceData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{data.name}</span>
                  <span className="font-bold text-slate-900">{data.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`${data.color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${data.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-slate-900">Recent System Activity</h3>
          </div>
          <div className="relative border-l border-slate-200 ml-3 space-y-6">
            <div className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
              <p className="text-sm font-medium text-slate-900">New vendor onboarded: <span className="text-primary-600">Quick Ride Agency</span></p>
              <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white"></div>
              <p className="text-sm font-medium text-slate-900">Insurance expiring for 12 vehicles</p>
              <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
              <p className="text-sm font-medium text-slate-900">System backup completed successfully</p>
              <p className="text-xs text-slate-500 mt-1">Yesterday at 11:30 PM</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white"></div>
              <p className="text-sm font-medium text-slate-900">Vendor suspended: Coastal Transport</p>
              <p className="text-xs text-slate-500 mt-1">Yesterday at 3:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
