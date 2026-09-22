import Ripple from '../common/Ripple';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Bell, Search, Menu, Building2, Users, Car, FileText, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { useVendorContext } from '../../context/VendorContext';
import { useDriverContext } from '../../context/DriverContext';
import { useVehicleContext } from '../../context/VehicleContext';
import { useDocumentContext } from '../../context/DocumentContext';

export default function Header({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  // Contexts
  const { vendors } = useVendorContext();
  const { drivers } = useDriverContext();
  const { vehicles } = useVehicleContext();
  const { documents } = useDocumentContext();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Create page title from path
  const path = location.pathname.substring(1) || 'dashboard';
  const pageTitle = path.charAt(0).toUpperCase() + path.slice(1);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Filter global results
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.trim() === '') {
      return [];
    }

    const query = debouncedSearchQuery.trim().toLowerCase();
    const results = [];

    // Search Vendors (including hierarchy conceptually)
    vendors.forEach(v => {
      if (v.name.toLowerCase().includes(query) || v.email?.toLowerCase().includes(query)) {
        results.push({
          id: `vendor-${v.id}`,
          type: 'Vendor',
          title: v.name,
          subtitle: v.type,
          icon: <Building2 className="w-4 h-4 text-blue-500" />,
          onClick: () => navigate(`/vendors/${v.id}`)
        });
      }
    });

    // Search Drivers
    drivers.forEach(d => {
      if (d.name.toLowerCase().includes(query) || d.phone?.toLowerCase().includes(query)) {
        results.push({
          id: `driver-${d.id}`,
          type: 'Driver',
          title: d.name,
          subtitle: `Phone: ${d.phone}`,
          icon: <Users className="w-4 h-4 text-green-500" />,
          onClick: () => navigate(`/drivers/${d.id}`)
        });
      }
    });

    // Search Vehicles
    vehicles.forEach(v => {
      if (v.licensePlate.toLowerCase().includes(query) || v.type?.toLowerCase().includes(query)) {
        results.push({
          id: `vehicle-${v.id}`,
          type: 'Vehicle',
          title: v.licensePlate,
          subtitle: v.type,
          icon: <Car className="w-4 h-4 text-purple-500" />,
          onClick: () => navigate(`/vehicles/${v.id}`)
        });
      }
    });

    // Search Documents
    documents.forEach(d => {
      if (d.fileName.toLowerCase().includes(query) || d.documentNumber?.toLowerCase().includes(query)) {
        results.push({
          id: `doc-${d.id}`,
          type: 'Document',
          title: d.fileName,
          subtitle: d.documentType,
          icon: <FileText className="w-4 h-4 text-orange-500" />,
          onClick: () => navigate(`/documents`) // No specific doc page, route to list
        });
      }
    });

    return results;
  }, [debouncedSearchQuery, vendors, drivers, vehicles, documents, navigate]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleResultClick = (onClick) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    onClick();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 relative overflow-hidden transition-all duration-200"
        >
        <Ripple color="rgba(0, 0, 0, 0.1)" />
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
          {pageTitle.replace('-', ' ')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => { if (searchQuery) setIsDropdownOpen(true); }}
            className="pl-9 pr-4 py-2 w-72 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          
          {/* Search Results Dropdown */}
          {isDropdownOpen && debouncedSearchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.onClick)}
                      className="w-full px-4 py-2 hover:bg-slate-50 flex items-start gap-3 text-left transition-colors"
                    >
                      <div className="mt-0.5">{result.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                          <span className="font-medium">{result.type}</span>
                          <span className="mx-1">•</span>
                          <span>{result.subtitle}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 mt-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No results found for "{debouncedSearchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
        
        <button className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
