"use client";

import React, { useState } from "react";
import {
  Truck,
  Package,
  Plus,
  X,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format, isToday, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar"; // Import Sidebar
import { cn } from "@/lib/utils"; // Ensure this import exists for className utility

export function ShipmentDashboardComponent() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [shipments, setShipments] = useState([
    {
      id: 1,
      name: "Shipment A",
      clientName: "Acme Corp",
      origin: "New York",
      destination: "Los Angeles",
      status: "In Transit",
      paymentPending: 1000,
      dateOfDispatch: "2023-06-01",
      dateOfArrival: "2023-06-05",
      driverPayment: 500,
    },
    {
      id: 2,
      name: "Shipment B",
      clientName: "TechCo",
      origin: "Chicago",
      destination: "Miami",
      status: "Pending",
      paymentPending: 0,
      dateOfDispatch: "2023-06-03",
      dateOfArrival: new Date().toISOString().split("T")[0],
      driverPayment: 600,
    },
    {
      id: 3,
      name: "Shipment C",
      clientName: "GlobalTrade",
      origin: "Seattle",
      destination: "Boston",
      status: "Delivered",
      paymentPending: 0,
      dateOfDispatch: "2023-05-28",
      dateOfArrival: "2023-06-01",
      driverPayment: 550,
    },
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filterPaid, setFilterPaid] = useState(null);
  const [filterToday, setFilterToday] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar state

  const statusColors = {
    Delivered: "bg-green-500",
    Delayed: "bg-red-500",
    Available: "bg-green-500",
    "In Transit": "bg-blue-600",
    Pending: "bg-yellow-500",
  };

  const form = useForm({
    defaultValues: {
      name: "",
      clientName: "",
      origin: "",
      destination: "",
      paymentPending: 0,
      dateOfDispatch: "",
      dateOfArrival: "",
      driverPayment: 0,
    },
  });

  const onSubmit = (data) => {
    const newShipment = {
      id: shipments.length + 1,
      ...data,
      status: "Pending",
    };
    setShipments([...shipments, newShipment]);
  };

  const closeShipment = (id) => {
    setShipments(
      shipments.map((shipment) =>
        shipment.id === id ? { ...shipment, status: "Delivered" } : shipment
      )
    );
    setSelectedShipment(null);
  };

  const sortShipments = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredShipments = shipments
    .filter((shipment) => {
      if (filterPaid === true && shipment.paymentPending > 0) return false;
      if (filterPaid === false && shipment.paymentPending === 0) return false;
      if (filterToday && !isToday(parseISO(shipment.dateOfArrival)))
        return false;
      if (
        searchTerm &&
        !shipment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    const renderShipmentTable = (shipments) => (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead className="hidden lg:table-cell">Origin</TableHead>
              <TableHead className="hidden lg:table-cell">Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Payment</TableHead>
              <TableHead className="hidden xl:table-cell">Driver Payment</TableHead>
              <TableHead
                className="cursor-pointer hidden md:table-cell"
                onClick={() => sortShipments("dateOfDispatch")}
              >
                Dispatch
                {sortConfig.key === "dateOfDispatch" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hidden sm:table-cell"
                onClick={() => sortShipments("dateOfArrival")}
              >
                Arrival
                {sortConfig.key === "dateOfArrival" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow
                key={shipment.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedShipment(shipment)}
              >
                <TableCell className="font-medium text-left">{shipment.name}</TableCell>
                <TableCell className="hidden md:table-cell text-left">{shipment.clientName}</TableCell>
                <TableCell className="hidden lg:table-cell text-left">{shipment.origin}</TableCell>
                <TableCell className="hidden lg:table-cell text-left">{shipment.destination}</TableCell>
                <TableCell className="hidden lg:table-cell text-left">
                  <Badge className={`${statusColors[shipment.status]} text-white`}>
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-left">${shipment.paymentPending}</TableCell>
                <TableCell className="hidden xl:table-cell text-left">${shipment.driverPayment}</TableCell>
                <TableCell className="hidden md:table-cell text-left">
                  {format(parseISO(shipment.dateOfDispatch), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-left">
                  {format(parseISO(shipment.dateOfArrival), "MMM dd, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          className="lg:w-64 lg:flex-shrink-0"
        />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Mobile Toggle Button */}
          <header className="flex items-center justify-between bg-white p-4 shadow-md lg:hidden">
            <Button variant="ghost" onClick={() => setIsSidebarOpen(true)}>
              <Menu color="#f7f7f7" className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Shipment Dashboard</h1>
            <div></div>
          </header>
  
          <main className="flex-1 overflow-auto p-4 bg-gray-100">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 hidden lg:block">
              Shipment Management Dashboard
            </h1>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-11 space-y-4 sm:space-y-0">
                <TabsList className="gap-2 sm:gap-10">
                  <TabsTrigger
                    value="ongoing"
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Ongoing Shipments</span>
                    <span className="sm:hidden">Ongoing</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">All Shipments</span>
                    <span className="sm:hidden">All</span>
                  </TabsTrigger>
                </TabsList>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Shipment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Shipment</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new shipment.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {/* Form fields remain the same */}
                        
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipment Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter shipment name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter client name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter origin" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter destination"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="paymentPending"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Pending</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter pending payment"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="driverPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver Payment</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter driver payment"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfDispatch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Dispatch</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfArrival"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Arrival</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="availableTruck"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Available Truck</FormLabel>
                              <FormControl>
                                <select {...field} className="truck-select">
                                  <option value="">Select a truck</option>
                                  <option value="truck1">Truck 1</option>
                                  <option value="truck2">Truck 2</option>
                                  <option value="truck3">Truck 3</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit">Create Shipment</Button>

                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-4">
                  <div className="w-full sm:flex-1 sm:min-w-[200px]">
                    <Input
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilterPaid(
                        filterPaid === null ? true : filterPaid ? false : null
                      )
                    }
                    className={cn(
                      "w-full sm:w-auto sm:min-w-[120px]",
                      filterPaid === null
                        ? ""
                        : filterPaid
                        ? "bg-green-100"
                        : "bg-red-100"
                    )}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {filterPaid === null ? "All" : filterPaid ? "Paid" : "Unpaid"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFilterToday(!filterToday)}
                    className={cn(
                      "w-full sm:w-auto sm:min-w-[160px]",
                      filterToday ? "bg-blue-100" : ""
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Arriving Today
                  </Button>
                </CardContent>
              </Card>
              <TabsContent value="ongoing">
                {renderShipmentTable(
                  filteredShipments.filter((s) => s.status !== "Delivered")
                )}
              </TabsContent>
              <TabsContent value="all">
                {renderShipmentTable(filteredShipments)}
              </TabsContent>
            </Tabs>
            {selectedShipment && (
              <Dialog
                open={!!selectedShipment}
                onOpenChange={() => setSelectedShipment(null)}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedShipment.name}</DialogTitle>
                    <DialogDescription>Shipment Details</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Shipment details remain the same */}

                    <div>
                    <p className="font-semibold">Client:</p>
                    <p>{selectedShipment.clientName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status:</p>
                    <Badge
                      variant={
                        selectedShipment.status === "Delivered"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {selectedShipment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold">Origin:</p>
                    <p>{selectedShipment.origin}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Destination:</p>

                    <p>{selectedShipment.destination}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Pending:</p>
                    <p>${selectedShipment.paymentPending}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Driver Payment:</p>
                    <p>${selectedShipment.driverPayment}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Dispatch Date:</p>
                    <p>
                      {format(
                        parseISO(selectedShipment.dateOfDispatch),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Arrival Date:</p>
                    <p>
                      {format(
                        parseISO(selectedShipment.dateOfArrival),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>

                  </div>
                  <DialogFooter>
                    {selectedShipment.status !== "Delivered" && (
                      <Button
                        variant="destructive"
                        onClick={() => closeShipment(selectedShipment.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Close Shipment
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </main>
        </div>
      </div>
    );
  }
