import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, FileText, UserCircle2, Building2, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useVehicleContext } from '../context/VehicleContext';
import { useVendorContext } from '../context/VendorContext';
import { useDriverContext } from '../context/DriverContext';
import ComplianceStatusBadge from '../components/vehicle/ComplianceStatusBadge';
import StatusBadge from '../components/common/StatusBadge';
import { getExpiryStatus } from '../utils/dateStatus';

export default function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  
  const { vehicles } = useVehicleContext();
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();

  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-slate-500">The vehicle you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/vehicles')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          &larr; Back to Vehicles
        </button>
      </div>
    );
  }

  const vendor = vendors.find(v => v.id === vehicle.vendorId);
  const driver = drivers.find(d => d.id === vehicle.driverId);
  
  // Calculate quick compliance health
  const regStatus = getExpiryStatus(vehicle.registrationExpiry);
  const insStatus = getExpiryStatus(vehicle.insuranceExpiry);
  const permitStatus = getExpiryStatus(vehicle.permitExpiry);
  
  const hasExpired = [regStatus, insStatus, permitStatus].includes('Expired');
  const hasExpiringSoon = [regStatus, insStatus, permitStatus].includes('Expiring Soon');
  
  let healthBanner = { color: 'bg-green-50 border-green-200 text-green-800', text: 'All documents are fully compliant and up to date.' };
  if (hasExpired) {
    healthBanner = { color: 'bg-red-50 border-red-200 text-red-800', text: 'URGENT: One or more critical documents have expired.' };
  } else if (hasExpiringSoon) {
    healthBanner = { color: 'bg-amber-50 border-amber-200 text-amber-800', text: 'WARNING: Documents are expiring within the next 30 days.' };
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate('/vehicles')}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {vehicle.make} {vehicle.model} ({vehicle.year})
            <StatusBadge status={vehicle.status} />
          </h2>
          <p className="mt-1 text-sm text-slate-500">Vehicle ID: {vehicle.id} • Added to fleet {vehicle.joinDate || 'Unknown'}</p>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border ${healthBanner.color} flex items-center gap-3 font-medium text-sm mb-4`}>
        {hasExpired ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        {healthBanner.text}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Core Info & Compliance */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Car className="w-5 h-5 text-primary-500" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">License Plate</dt>
                <dd className="text-sm font-bold text-slate-900 uppercase font-mono bg-slate-100 px-2 py-1 rounded inline-block">{vehicle.licensePlate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Vehicle Type</dt>
                <dd className="text-sm font-semibold text-slate-900">{vehicle.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Make & Model</dt>
                <dd className="text-sm font-semibold text-slate-900">{vehicle.make} {vehicle.model}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Manufacturing Year</dt>
                <dd className="text-sm font-semibold text-slate-900">{vehicle.year}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Compliance & Documentation
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Registration Certificate</div>
                  <div className="font-medium text-slate-900 font-mono text-sm">{vehicle.registrationNumber}</div>
                  <div className="text-xs text-slate-500 mt-1">Expires: {vehicle.registrationExpiry}</div>
                </div>
                <ComplianceStatusBadge date={vehicle.registrationExpiry} />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Insurance Policy</div>
                  <div className="font-medium text-slate-900 text-sm">Policy details on file</div>
                  <div className="text-xs text-slate-500 mt-1">Expires: {vehicle.insuranceExpiry}</div>
                </div>
                <ComplianceStatusBadge date={vehicle.insuranceExpiry} />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Commercial Permit</div>
                  <div className="font-medium text-slate-900 text-sm">Permit details on file</div>
                  <div className="text-xs text-slate-500 mt-1">Expires: {vehicle.permitExpiry}</div>
                </div>
                <ComplianceStatusBadge date={vehicle.permitExpiry} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assignments & Activity */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <UserCircle2 className="w-5 h-5 text-amber-500" />
              Assigned Driver
            </h3>
            {driver ? (
              <div className="space-y-1 cursor-pointer group" onClick={() => navigate(`/drivers/${driver.id}`)}>
                <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {driver.name}
                </div>
                <div className="text-xs text-slate-500">{driver.phone}</div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  Click to view driver details &rarr;
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Unassigned</span>
                <span className="text-xs text-slate-500">No driver is currently authorized to operate this vehicle.</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              Vendor Network
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
              <span className="text-sm text-slate-400 italic">No vendor assigned (Orphaned Vehicle)</span>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </div>
            <ul className="space-y-3 text-xs text-slate-600 mt-3 relative before:absolute before:inset-y-0 before:left-1.5 before:w-px before:bg-slate-300 ml-1">
              <li className="relative pl-6">
                <span className="absolute left-0 top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></span>
                <p className="font-medium text-slate-900">Vehicle Added/Updated</p>
                <p className="text-slate-500">Recently modified</p>
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-white"></span>
                <p className="font-medium text-slate-900">Maintenance Check</p>
                <p className="text-slate-500">Last month</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
