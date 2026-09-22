import { Building2, Mail, Phone, Calendar, Users, Car, MapPin, Shield } from 'lucide-react';

export default function VendorDetailsPanel({ vendor }) {
  if (!vendor) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Building2 className="w-12 h-12 text-slate-300 mb-4" />
        <p>Select a vendor from the hierarchy tree to view details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary-100 text-primary-700 rounded-xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{vendor.name}</h2>
            <p className="text-sm text-slate-500">{vendor.type} • ID: {vendor.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Drivers</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{vendor.metrics.drivers}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Car className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Vehicles</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{vendor.metrics.vehicles}</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Contact Information</h3>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Contact Person</p>
              <p className="text-sm font-medium text-slate-900">{vendor.contactPerson}</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email Address</p>
              <a href={`mailto:${vendor.email}`} className="text-sm font-medium text-primary-600 hover:underline">{vendor.email}</a>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone Number</p>
              <a href={`tel:${vendor.phone}`} className="text-sm font-medium text-slate-900">{vendor.phone}</a>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Joined Date</p>
              <p className="text-sm font-medium text-slate-900">{new Date(vendor.joinDate).toLocaleDateString()}</p>
            </div>
          </li>
        </ul>

        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            Manage Documents
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            Add Sub-Vendor
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-200 hover:bg-red-50 text-red-600 hover:border-red-200 rounded-lg text-sm font-medium transition-colors">
            Suspend Vendor
          </button>
        </div>
      </div>
    </div>
  );
}
