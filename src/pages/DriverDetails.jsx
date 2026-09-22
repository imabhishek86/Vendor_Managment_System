import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle2, Mail, Phone, Building2, Car, ShieldCheck, FileText, Star, Clock } from 'lucide-react';
import { useDriverContext } from '../context/DriverContext';
import { useVendorContext } from '../context/VendorContext';
import { mockVehicles } from '../data/mockVehicles';
import DriverStatusBadge from '../components/driver/DriverStatusBadge';

export default function DriverDetails() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const { drivers } = useDriverContext();
  const { vendors } = useVendorContext();

  const driver = drivers.find(d => d.id === driverId);
  
  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Driver Not Found</h2>
        <p className="text-slate-500">The driver you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/drivers')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          &larr; Back to Drivers
        </button>
      </div>
    );
  }

  const vendor = vendors.find(v => v.id === driver.vendorId);
  const vehicle = mockVehicles.find(vh => vh.id === driver.assignedVehicle);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/drivers')}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {driver.name}
            <DriverStatusBadge status={driver.status} type="status" />
          </h2>
          <p className="mt-1 text-sm text-slate-500">Driver ID: {driver.id} • Registered {driver.joinDate || 'Unknown'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Core Info */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <UserCircle2 className="w-5 h-5 text-primary-500" />
              Personal & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Full Name</dt>
                <dd className="text-sm font-semibold text-slate-900">{driver.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Rating</dt>
                <dd className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {driver.rating?.toFixed(1) || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Phone</dt>
                <dd className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {driver.phone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Email</dt>
                <dd className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {driver.email || <span className="text-slate-400 italic">Not provided</span>}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              License & Documentation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Driving License Number</dt>
                <dd className="text-sm font-semibold text-slate-900 font-mono">{driver.licenseNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">License Expiry</dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {driver.licenseExpiry || '2025-12-31'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">License Status</dt>
                <dd className="mt-1"><DriverStatusBadge status={driver.licenseStatus || 'Verified'} type="license" /></dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Background Check / Docs</dt>
                <dd className="mt-1"><DriverStatusBadge status={driver.documentStatus || 'Verified'} type="document" /></dd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assignments */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              Vendor Assignment
            </h3>
            {vendor ? (
              <div className="space-y-1 cursor-pointer group" onClick={() => navigate(`/vendors/${vendor.id}`)}>
                <div className="font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  {vendor.name}
                </div>
                <div className="text-xs text-slate-500">ID: {vendor.id} • {vendor.type}</div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  Click to view vendor details &rarr;
                </div>
              </div>
            ) : (
              <span className="text-sm text-slate-400 italic">No vendor assigned</span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Car className="w-5 h-5 text-amber-500" />
              Vehicle Assignment
            </h3>
            {vehicle ? (
              <div className="space-y-1 cursor-pointer group" onClick={() => navigate(`/vehicles`)}>
                <div className="font-semibold text-slate-900">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </div>
                <div className="text-sm text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded inline-block mt-1">
                  {vehicle.licensePlate}
                </div>
                <div className="text-xs text-slate-500 mt-1">Vehicle ID: {vehicle.id}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Unassigned</span>
                <span className="text-xs text-slate-500">This driver currently has no vehicle assigned.</span>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </div>
            <ul className="space-y-3 text-xs text-slate-600 mt-3 relative before:absolute before:inset-y-0 before:left-1.5 before:w-px before:bg-slate-300 ml-1">
              <li className="relative pl-6">
                <span className="absolute left-0 top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></span>
                <p className="font-medium text-slate-900">Profile Updated</p>
                <p className="text-slate-500">Today at 10:42 AM</p>
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-white"></span>
                <p className="font-medium text-slate-900">Assigned to Vehicle {driver.assignedVehicle || 'VH-X'}</p>
                <p className="text-slate-500">Oct 12, 2025</p>
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                <p className="font-medium text-slate-900">Background Check Cleared</p>
                <p className="text-slate-500">Oct 10, 2025</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
