
import './App.css'


import { DashboardComponent } from "@/components/dashboard"
import {TruckDashboard} from "@/components/truck-dashboard"
import { Sidebar } from './components/Sidebar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShipmentDashboardComponent } from './components/shipment-dashboard';
import { DriverManagementComponent } from './components/driver-management';
import { AuthForms } from './components/auth-forms';
import { EnhancedClientManagement } from './components/enhanced-client-management';
import { EnhancedBillingPageComponent } from './components/enhanced-billing-page';

function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<DashboardComponent/>} />
        <Route path="/ship" element={<ShipmentDashboardComponent/>} />
        <Route path="/login" element={<AuthForms/>} />
        <Route path="/truck-info" element={<TruckDashboard/>} />
        <Route path="/driver" element={<DriverManagementComponent/>} />
        <Route path="/client" element={<EnhancedClientManagement/>} />
        <Route path="/billing" element={<EnhancedBillingPageComponent/>} />
        

        </Routes>
      </Router>
    </div>
  )
}

export default App
