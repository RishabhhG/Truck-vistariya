import React, { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, CameraIcon, MessageSquareIcon, MoreHorizontalIcon, PackageIcon, TruckIcon } from 'lucide-react'
import { Line, LineChart, Bar, BarChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "./Sidebar";

export function TransportDashboardComponent() {
  const deliveriesData = [
    { day: 'Mon', deliveries: 120 },
    { day: 'Tue', deliveries: 140 },
    { day: 'Wed', deliveries: 160 },
    { day: 'Thu', deliveries: 130 },
    { day: 'Fri', deliveries: 170 },
    { day: 'Sat', deliveries: 110 },
    { day: 'Sun', deliveries: 90 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 5000 },
    { month: 'Feb', revenue: 5500 },
    { month: 'Mar', revenue: 6000 },
    { month: 'Apr', revenue: 5800 },
    { month: 'May', revenue: 6200 },
    { month: 'Jun', revenue: 6800 },
  ];

  const outstandingBillsData = [
    { name: 'Corporate', value: 500000 },
    { name: 'SME', value: 300000 },
    { name: 'Individual', value: 100000 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  const recentOrders = [
    { id: '001', customer: 'John Doe', status: 'Delivered', amount: '₹1,200' },
    { id: '002', customer: 'Jane Smith', status: 'In Transit', amount: '₹950' },
    { id: '003', customer: 'Bob Johnson', status: 'Pending', amount: '₹750' },
    { id: '004', customer: 'Alice Brown', status: 'Delivered', amount: '₹1,500' },
    { id: '005', customer: 'Charlie Wilson', status: 'In Transit', amount: '₹1,100' },
  ]

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Transport Management Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Deliveries"
            value="1,234"
            change={-20.1}
            icon={<PackageIcon className="h-4 w-4 text-blue-500" />} />
          <MetricCard
            title="Active Trucks"
            value="45"
            change={3}
            icon={<TruckIcon className="h-4 w-4 text-green-500" />} />
          <MetricCard
            title="Revenue"
            value="₹54,231"
            change={15}
            icon={<ArrowUpIcon className="h-4 w-4 text-yellow-500" />} />
          <MetricCard
            title="On-Time Delivery Rate"
            value="98.5%"
            change={2.3}
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
                  <BarChart data={deliveriesData}>
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
                  <LineChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
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
                    data={outstandingBillsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {outstandingBillsData.map((entry, index) => (
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
          {recentOrders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-4 py-2 text-gray-900">{order.id}</td>
              <td className="px-4 py-2 text-gray-900">{order.customer}</td>
              <td className="px-4 py-2">
  <span className={`inline-block px-2 py-1 rounded text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
    {order.status}
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
