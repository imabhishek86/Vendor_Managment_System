import { Users, UserCheck, Contact, Car, FileClock, AlertTriangle } from 'lucide-react';

const iconMap = {
  Users,
  UserCheck,
  Contact,
  Car,
  FileClock,
  AlertTriangle
};

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' }
};

export default function StatCard({ label, value, trend, iconName, color }) {
  const Icon = iconMap[iconName] || Users;
  const colors = colorMap[color] || colorMap.blue;
  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5 transition-all hover:shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className={`flex-shrink-0 p-2.5 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} aria-hidden="true" />
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <dt className="text-sm font-medium text-slate-500 truncate">{label}</dt>
        <dd className="text-2xl font-bold text-slate-900 mt-1">{value}</dd>
      </div>
      <p className="text-xs text-slate-400 mt-2">Update from last month</p>
    </div>
  );
}
