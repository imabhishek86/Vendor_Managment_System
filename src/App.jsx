import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Hierarchy from './pages/Hierarchy';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';
import Documents from './pages/Documents';
import Delegation from './pages/Delegation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { VendorProvider } from './context/VendorContext';
import { DriverProvider } from './context/DriverContext';
import { VehicleProvider } from './context/VehicleContext';
import { DocumentProvider } from './context/DocumentContext';
import { DelegationProvider } from './context/DelegationContext';

function App() {
  return (
    <VendorProvider>
      <DriverProvider>
        <VehicleProvider>
          <DocumentProvider>
            <DelegationProvider>
              <Router>
                <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hierarchy" element={<Hierarchy />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendors/:vendorId" element={<VendorDetails />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="drivers/:driverId" element={<DriverDetails />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:vehicleId" element={<VehicleDetails />} />
          <Route path="documents" element={<Documents />} />
          <Route path="delegation" element={<Delegation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
            </DelegationProvider>
          </DocumentProvider>
        </VehicleProvider>
      </DriverProvider>
    </VendorProvider>
  );
}

export default App;
