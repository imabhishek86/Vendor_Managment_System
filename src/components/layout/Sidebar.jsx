import Ripple from '../common/Ripple';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  Building2, 
  Users, 
  User, 
  Car, 
  FileText, 
  UserPlus, 
  Shield, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Vendor Hierarchy', path: '/hierarchy', icon: Network },
  { name: 'Vendors', path: '/vendors', icon: Users },
  { name: 'Drivers', path: '/drivers', icon: User },
  { name: 'Vehicles', path: '/vehicles', icon: Car },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Delegation', path: '/delegation', icon: UserPlus },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-primary-600">
            <Car className="w-6 h-6" />
            <span className="text-xl font-bold text-slate-900">FleetHub</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-700 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@fleethub.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
