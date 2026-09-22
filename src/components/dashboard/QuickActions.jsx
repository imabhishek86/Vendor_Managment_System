import { Link } from 'react-router-dom';
import { UserPlus, Contact, Car, Network, FileText, Zap } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { name: 'Add Vendor', icon: UserPlus, to: '/vendors', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' },
    { name: 'Add Driver', icon: Contact, to: '/drivers', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
    { name: 'Add Vehicle', icon: Car, to: '/vehicles', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200' },
    { name: 'View Hierarchy', icon: Network, to: '/hierarchy', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
    { name: 'Review Documents', icon: FileText, to: '/documents', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link 
              key={action.name}
              to={action.to}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${action.color}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
