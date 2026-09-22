import Ripple from '../components/common/Ripple';
import { User, Bell, Lock, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your account settings and application preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-50 text-primary-700 font-medium transition-colors">
              <User className="w-5 h-5" />
              Profile Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Lock className="w-5 h-5" />
              Security
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Globe className="w-5 h-5" />
              Preferences
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-200 pb-2">Profile Information</h3>
            
            <form className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold shadow-inner">
                  AD
                </div>
                <div>
                  <button type="button" className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 relative overflow-hidden transition-all duration-200">
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
                <button type="button" className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
                  Cancel
                </button>
                <button type="button" className="px-4 py-2 bg-primary-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-primary-700 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(255, 255, 255, 0.3)" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
