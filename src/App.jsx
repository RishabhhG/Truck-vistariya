
import './App.css'


import { DashboardComponent } from "@/components/dashboard"
import {TruckDashboard} from "@/components/truck-dashboard"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShipmentDashboardComponent } from './components/shipment-dashboard';
import { DriverManagementComponent } from './components/driver-management';

import { EnhancedClientManagement } from './components/enhanced-client-management';
import { EnhancedBillingPageComponent } from './components/enhanced-billing-page';
import Login from './components/login-page';
import Signup from './components/signup';

function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<DashboardComponent/>} />
        <Route path="/ship" element={<ShipmentDashboardComponent/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
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
