import { UserPlus, FileUp, CheckCircle, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

const iconMap = {
  UserPlus,
  FileUp,
  CheckCircle,
  ShieldCheck,
  AlertTriangle
};

const statusColorMap = {
  success: 'bg-green-100 text-green-600',
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600'
};

const ringColorMap = {
  success: 'ring-green-100',
  info: 'ring-blue-100',
  warning: 'ring-amber-100',
  error: 'ring-red-100'
};

export default function RecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full lg:col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <ul className="relative border-l-2 border-slate-100 ml-3 space-y-6">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.icon] || Activity;
            const colorClass = statusColorMap[activity.status] || statusColorMap.info;
            const ringClass = ringColorMap[activity.status] || ringColorMap.info;
            
            return (
              <li key={activity.id} className="relative pl-6">
                <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
