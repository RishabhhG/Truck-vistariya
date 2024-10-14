import React, { useState } from "react";
import { BarChart, Package, Truck, LifeBuoy, CalendarArrowDown, UsersRound, ReceiptIndianRupee, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Clock from "./Clock";

const NavItem = ({ href, icon, text, active = false }) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200",
        active ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
      )}
    >
      {icon}
      <span className="text-lg font-medium">{text}</span>
    </a>
  );
};

const SidebarContent = ({ isLoggedIn, handleLogin, handleLogout }) => {
  const param = window.location.pathname;
  const highlight = param.split("/").pop();

  return (
    <>
      <h1 className="text-3xl font-bold mb-10 text-center text-indigo-500">TMS Admin</h1>
      <nav className="space-y-3">
        <NavItem
          href="/"
          icon={<Package className="h-6 w-6" />}
          text="Dashboard"
          active={highlight === ""}
        />
        <NavItem
          href="/truck-info"
          icon={<Truck className="h-6 w-6" />}
          text="Truck Info"
          active={highlight === "truck-info"}
        />
        <NavItem
          href="/ship"
          icon={<CalendarArrowDown className="h-6 w-6" />}
          text="Shipment"
          active={highlight === "ship"}
        />
        <NavItem
          href="/driver"
          icon={<LifeBuoy className="h-6 w-6" />}
          text="Driver"
          active={highlight === "driver"}
        />
        <NavItem
          href="/client"
          icon={<UsersRound className="h-6 w-6" />}
          text="Client"
          active={highlight === "client"}
        />
        <NavItem
          href="/billing"
          icon={<ReceiptIndianRupee className="h-6 w-6" />}
          text="Billing"
          active={highlight === "billing"}
        />
      </nav>

      <Clock />

      {/* Conditional Rendering for Login/Logout */}
      <div className="mt-10 flex flex-col space-y-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-3 text-lg font-medium text-gray-400 bg-gray-700 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Signout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center justify-center w-full p-3 text-lg font-medium text-indigo-500 bg-gray-900 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors duration-200"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </button>
        )}
      </div>
    </>
  );
};

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Logic to handle login
    setIsLoggedIn(true); // Set to true once login is successful
  };

  const handleLogout = () => {
    // Logic to handle logout
    setIsLoggedIn(false); // Set to false once logout is successful
  };

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:block w-64 bg-gray-900 text-white p-6 transition-all duration-300 ease-in-out shadow-lg">
        <SidebarContent isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
      </aside>

      {/* Sidebar for mobile */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-gray-900 text-white p-6">
          <SidebarContent isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>
    </>
  );
};
