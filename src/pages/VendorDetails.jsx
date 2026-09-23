import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Mail, Users, Shield, Clock, CheckCircle2, Network, Car } from 'lucide-react';
import { useVendorContext } from '../context/VendorContext';
import { useDriverContext } from '../context/DriverContext';
import { useVehicleContext } from '../context/VehicleContext';
import StatusBadge from '../components/common/StatusBadge';

export default function VendorDetails() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();

  const vendor = vendors.find(v => v.id === vendorId);
  
  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Vendor Not Found</h2>
        <p className="text-slate-500">The vendor you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/vendors')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          &larr; Back to Vendors
        </button>
      </div>
    );
  }

  const parentVendor = vendor.parentId ? vendors.find(v => v.id === vendor.parentId) : null;
  const childVendors = vendors.filter(v => v.parentId === vendor.id);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/vendors')}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {vendor.name}
            <StatusBadge status={vendor.status} />
          </h2>
          <p className="mt-1 text-sm text-slate-500">Vendor ID: {vendor.id} • Joined {vendor.joinDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Core Info */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              Company Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Vendor Type</dt>
                <dd className="text-sm font-semibold text-slate-900">{vendor.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Parent Manager</dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {parentVendor ? parentVendor.name : <span className="text-slate-400 italic">None (Root Level)</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Contact Person</dt>
                <dd className="text-sm font-semibold text-slate-900">{vendor.contactPerson}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Email</dt>
                <dd className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {vendor.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Phone</dt>
                <dd className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {vendor.phone}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Network className="w-5 h-5 text-primary-500" />
              Sub-Vendors ({childVendors.length})
            </h3>
            {childVendors.length === 0 ? (
              <p className="text-sm text-slate-500 italic">This vendor has no sub-vendors assigned.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {childVendors.map(child => (
                  <li key={child.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm text-slate-900">{child.name}</div>
                      <div className="text-xs text-slate-500">{child.type}</div>
                    </div>
                    <button onClick={() => navigate(`/vendors/${child.id}`)} className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded">View</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column - Metrics & Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Metrics Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded shadow-sm text-blue-600"><Users className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Total Drivers</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{drivers.filter(d => d.vendorId === vendor.id).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded shadow-sm text-indigo-600"><Car className="w-5 h-5" /></div>
                  <span className="font-medium text-slate-700">Total Vehicles</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{vehicles.filter(v => v.vendorId === vendor.id).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Permissions Summary
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Add/Edit Sub-Vendors</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Manage Drivers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> View Analytics</li>
              <li className="flex items-center gap-2 text-slate-400 line-through decoration-slate-300"><Clock className="w-4 h-4 text-slate-300" /> System Config</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
