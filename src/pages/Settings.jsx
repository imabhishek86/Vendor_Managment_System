import Ripple from '../components/common/Ripple';
import { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSave = () => {
    setNotification('Settings saved successfully.');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-6 max-w-5xl relative h-full flex flex-col">
      {notification && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-md border border-green-200 flex items-center gap-2 animate-popover-enter">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your account settings and application preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-200 pb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            
            {activeTab === 'profile' && (
              <form className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold shadow-inner">
                  AD
                </div>
                <div>
                  <button type="button" onClick={() => setNotification('Avatar upload coming soon.')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
                    Change Avatar
                  </button>
                  <p className="mt-2 text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input type="text" id="first-name" defaultValue="Admin" className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white shadow-sm" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input type="text" id="last-name" defaultValue="User" className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                  <input type="email" id="email" defaultValue="admin@fleethub.com" className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-white shadow-sm" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 mt-10">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Weekly Reports</h4>
                    <p className="text-sm text-slate-500">Receive a weekly summary of fleet performance.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Document Expiry Alerts</h4>
                    <p className="text-sm text-slate-500">Get notified when a document is expiring within 30 days.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => { setActiveTab(''); setTimeout(() => setActiveTab('profile'), 0); }} className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
                  Cancel
                </button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-primary-700 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(255, 255, 255, 0.3)" />
                  Save Changes
                </button>
              </div>
            </form>
            )}
            
            {activeTab !== 'profile' && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Coming Soon</h3>
                <p className="text-sm text-slate-500">This section is currently under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
