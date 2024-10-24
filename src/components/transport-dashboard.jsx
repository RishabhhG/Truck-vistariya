import React, { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon, CameraIcon, MessageSquareIcon, MoreHorizontalIcon, PackageIcon, TruckIcon } from 'lucide-react'
import { Line, LineChart, Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "./Sidebar";
import { GET_DASHBOARD } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";

export function TransportDashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get(GET_DASHBOARD);
        setDashboardData(response.data.data || []); 
        console.log(response)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Process data for weekly deliveries (using last 7 days of current month)
  const processDeliveriesData = () => {
    if (!dashboardData.length) return [];
    
    // Get the last 7 months of data
    const last7Months = dashboardData.slice(-7);
    
    return last7Months.map(monthData => ({
      day: monthData.monthName.substring(0, 3), // Use first 3 letters of month name
      deliveries: monthData.shipments.count || 0
    }));
  };

  // Process data for monthly revenue trend
  const processRevenueData = () => {
    return dashboardData.slice(-6).map(month => ({
      month: month.monthName.substring(0, 3),
      revenue: month.billing.totalRevenue
    }));
  };

  // Calculate metrics for the cards
  const calculateMetrics = () => {
    if (!dashboardData.length) return {
      totalDeliveries: 0,
      deliveryChange: 0,
      revenue: 0,
      revenueChange: 0
    };

    const currentMonth = dashboardData[dashboardData.length - 1];
    const previousMonth = dashboardData[dashboardData.length - 2];

    const currentDeliveries = currentMonth.shipments.count;
    const previousDeliveries = previousMonth?.shipments.count || 0;
    const deliveryChange = previousDeliveries ? 
      ((currentDeliveries - previousDeliveries) / previousDeliveries) * 100 : 0;

    const currentRevenue = currentMonth.billing.totalRevenue;
    const previousRevenue = previousMonth?.billing.totalRevenue || 0;
    const revenueChange = previousRevenue ? 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalDeliveries: currentDeliveries,
      deliveryChange: deliveryChange.toFixed(1),
      revenue: currentRevenue,
      revenueChange: revenueChange.toFixed(1)
    };
  };

  // Process outstanding bills data
  const processOutstandingBills = () => {
    if (!dashboardData.length) return [];
    const currentMonth = dashboardData[dashboardData.length - 1];
    
    const outstanding = {
      Corporate: 0,
      SME: 0,
      Individual: 0
    };

    currentMonth.billing.details.forEach(bill => {
      if (bill.status === 'pending') {
        outstanding[bill.clientType] = (outstanding[bill.clientType] || 0) + bill.amount;
      }
    });

    return Object.entries(outstanding).map(([name, value]) => ({
      name,
      value
    }));
  };

  const metrics = calculateMetrics();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Get recent orders
  const getRecentOrders = () => {
    if (!dashboardData.length) return [];
    const currentMonth = dashboardData[dashboardData.length - 1];
    return currentMonth.shipments.details.slice(-5).map((shipment, index) => ({
      id: shipment.id || `${index + 1}`.padStart(3, '0'),
      customer: shipment.customerName || 'Customer',
      status: shipment.status,
      amount: `₹${shipment.amount?.toLocaleString() || 0}`
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Transport Management Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Deliveries"
            value={metrics.totalDeliveries.toLocaleString()}
            change={metrics.deliveryChange}
            icon={<PackageIcon className="h-4 w-4 text-blue-500" />} />
          <MetricCard
            title="Active Trucks"
            value={dashboardData[dashboardData.length - 1]?.shipments?.activeFleet || 0}
            change={0}
            icon={<TruckIcon className="h-4 w-4 text-green-500" />} />
          <MetricCard
            title="Revenue"
            value={`₹${metrics.revenue.toLocaleString()}`}
            change={metrics.revenueChange}
            icon={<ArrowUpIcon className="h-4 w-4 text-yellow-500" />} />
          <MetricCard
            title="On-Time Delivery Rate"
            value={`${((dashboardData[dashboardData.length - 1]?.shipments?.statusBreakdown?.delivered || 0) / 
              (dashboardData[dashboardData.length - 1]?.shipments?.count || 1) * 100).toFixed(1)}%`}
            change={0}
            icon={<ArrowUpIcon className="h-4 w-4 text-purple-500" />} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processDeliveriesData()}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processRevenueData()}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outstanding Bills by Client Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processOutstandingBills()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {processOutstandingBills().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">Order ID</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Customer</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getRecentOrders().map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="px-4 py-2 text-gray-900">{order.id}</td>
                        <td className="px-4 py-2 text-gray-900">{order.customer}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-900 font-semibold">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon }) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}% from last period
        </p>
      </CardContent>
    </Card>
  );
}