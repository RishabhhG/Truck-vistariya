import "./App.css";

import { DashboardComponent } from "@/components/dashboard";
import { TruckDashboard } from "@/components/truck-dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShipmentDashboardComponent } from "./components/shipment-dashboard";
import { DriverManagementComponent } from "./components/driver-management";

import { EnhancedClientManagement } from "./components/enhanced-client-management";
import { EnhancedBillingPageComponent } from "./components/enhanced-billing-page";
import Login from "./components/login-page";
import Signup from "./components/signup";
import NotFound from "./components/Notfound";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster />

      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardComponent />} />
          <Route path="/ship" element={<ShipmentDashboardComponent />} />

          <Route path="/truck-info" element={<TruckDashboard />} />
          <Route path="/driver" element={<DriverManagementComponent />} />
          <Route path="/client" element={<EnhancedClientManagement />} />
          <Route path="/billing" element={<EnhancedBillingPageComponent />} />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
