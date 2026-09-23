import { Link } from 'react-router-dom';
import { Crown, Building2, Building, Users, UserRound, Car, ArrowRight, ArrowDown } from 'lucide-react';

const NodeCard = ({ icon: Icon, title, description, colorClass }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl shadow-sm border bg-white hover:shadow-md transition-shadow text-center w-full sm:w-40 md:w-36 lg:w-44 shrink-0 ${colorClass}`}>
    <div className={`p-2 rounded-lg mb-2 bg-opacity-10 ${colorClass.replace('border-', 'bg-').replace('300', '100').replace('200', '100')}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-500 leading-tight">{description}</p>
  </div>
);

export default function VendorHierarchyOverview() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col w-full mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Vendor Hierarchy Overview</h3>
          <p className="text-sm text-slate-500 mt-1">A structured network from super vendors to drivers and vehicles</p>
        </div>
        <Link to="/hierarchy" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
          View Full Hierarchy <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 w-full overflow-x-auto py-2">
        {/* Desktop / Tablet Layout (Horizontal) */}
        <div className="hidden md:flex items-center justify-center gap-2 lg:gap-4 min-w-max mx-auto">
          <NodeCard icon={Crown} title="Super Vendor" description="Top-level organization" colorClass="border-indigo-200 text-indigo-700" />
          <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
          
          <NodeCard icon={Building2} title="Regional Vendor" description="Manages multiple city vendors" colorClass="border-blue-200 text-blue-700" />
          <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
          
          <NodeCard icon={Building} title="City Vendor" description="Manages sub vendors, drivers and vehicles" colorClass="border-cyan-200 text-cyan-700" />
          <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
          
          <NodeCard icon={Users} title="Sub Vendor" description="Manages drivers and vehicles" colorClass="border-teal-200 text-teal-700" />
          
          <div className="flex flex-col justify-center items-center gap-4 shrink-0 mx-2">
             <div className="w-px h-16 bg-slate-300 absolute" style={{ zIndex: 0 }}></div>
             <div className="flex items-center relative z-10 w-full">
               <div className="w-8 border-t-2 border-slate-300 border-dashed mr-2"></div>
               <NodeCard icon={UserRound} title="Driver" description="Assigned to vehicles" colorClass="border-emerald-200 text-emerald-700" />
             </div>
             <div className="flex items-center relative z-10 w-full">
               <div className="w-8 border-t-2 border-slate-300 border-dashed mr-2"></div>
               <NodeCard icon={Car} title="Vehicle" description="Assigned to drivers" colorClass="border-purple-200 text-purple-700" />
             </div>
          </div>
        </div>

        {/* Mobile Layout (Vertical Stack) */}
        <div className="flex md:hidden flex-col items-center gap-3 w-full">
          <NodeCard icon={Crown} title="Super Vendor" description="Top-level organization" colorClass="border-indigo-200 text-indigo-700" />
          <ArrowDown className="w-5 h-5 text-slate-400" />
          
          <NodeCard icon={Building2} title="Regional Vendor" description="Manages multiple city vendors" colorClass="border-blue-200 text-blue-700" />
          <ArrowDown className="w-5 h-5 text-slate-400" />
          
          <NodeCard icon={Building} title="City Vendor" description="Manages sub vendors, drivers and vehicles" colorClass="border-cyan-200 text-cyan-700" />
          <ArrowDown className="w-5 h-5 text-slate-400" />
          
          <NodeCard icon={Users} title="Sub Vendor" description="Manages drivers and vehicles" colorClass="border-teal-200 text-teal-700" />
          <ArrowDown className="w-5 h-5 text-slate-400" />
          
          <div className="flex gap-4 w-full justify-center">
            <NodeCard icon={UserRound} title="Driver" description="Assigned to vehicles" colorClass="border-emerald-200 text-emerald-700" />
            <NodeCard icon={Car} title="Vehicle" description="Assigned to drivers" colorClass="border-purple-200 text-purple-700" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center">
          Users can be moved within the hierarchy with validation to prevent invalid relationships.
        </p>
      </div>
    </div>
  );
}
