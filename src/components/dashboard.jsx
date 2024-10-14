import React, { useState } from "react";
import { BarChart, Package, Truck, Activity, Users, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "./Sidebar"; // Import the Sidebar component
import Clock from "./Clock";

const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith("+");
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={isPositive ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
};

export function DashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-[100vh] bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center m-auto">Transport Management Dashboard</h2>
          <button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu color="#f7f7f7" className="h-5 w-5" />
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <MetricCard
            title="Total Deliveries"
            value="1,234"
            change="-20.1% from last period"
            icon={<Package className="h-4 w-4 text-blue-500" />}
          />
          <MetricCard
            title="Active Trucks"
            value="45"
            change="+3 from last period"
            icon={<Truck className="h-4 w-4 text-green-500" />}
          />
          <MetricCard
            title="Revenue"
            value="$54,231"
            change="+15% from last period"
            icon={<BarChart className="h-4 w-4 text-yellow-500" />}
          />
          <MetricCard
            title="On-Time Delivery Rate"
            value="98.5%"
            change="+2.3% from last period"
            icon={<Package className="h-4 w-4 text-purple-500" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Delivery Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "On-Time", value: 75 },
                  { category: "Delayed", value: 15 },
                  { category: "Early", value: 10 },
                ].map(({ category, value }) => (
                  <div key={category} className="flex items-center">
                    <div className="w-24 font-medium">{category}</div>
                    <Progress value={value} className="flex-1 mr-4" />
                    <div className="w-12 text-right">{value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Fleet Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: "In Transit", value: 60 },
                  { status: "Loading", value: 20 },
                  { status: "Maintenance", value: 15 },
                  { status: "Idle", value: 5 },
                ].map(({ status, value }) => (
                  <div key={status} className="flex items-center">
                    <div className="w-28 font-medium">{status}</div>
                    <Progress value={value} className="flex-1 mr-4" />
                    <div className="w-12 text-right">{value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
