"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Package,
  Plus,
  X,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Menu,
  Edit,
  Pen,
  UserRound,
  MapPin,
  MapPinCheck,
  HandCoins,
  Banknote,
  PlaneLanding,
  IndianRupee,
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
import ShipmentForm from "./Shipment-dialog";
import { ClimbingBoxLoader } from "react-spinners";

import { apiClient } from "@/lib/api-client";
import {
  UPDATE_SHIPMENT
} from "@/utils/constant";
import toast from "react-hot-toast";

export function ShipmentDashboardComponent() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [shipments, setShipments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filterPaid, setFilterPaid] = useState(null);
  const [filterToday, setFilterToday] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Manage sidebar state
  const [createShipmentOpen, setCreateShipmentOpen] = useState(false);
  const [Loading, setLoading] = useState(true);

  const statusColors = {
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    Available: "bg-green-500",
    "In Transit": "bg-blue-600",
    pending: "bg-yellow-500",
  };

  const [formData, setFormData] = useState({
    departureDate: "",
    arrivalDate: "",
    status: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleStatusChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedShipmentData = {};
    if (formData.departureDate) updatedShipmentData.departureDate = formData.departureDate;
    if (formData.arrivalDate) updatedShipmentData.arrivalDate = formData.arrivalDate;
    if (formData.status) updatedShipmentData.status = formData.status;

    if (Object.keys(updatedShipmentData).length === 0) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await apiClient.put(
        UPDATE_SHIPMENT.replace(":shipmentId", selectedShipment.shipmentId),
        updatedShipmentData
      );

      if (response.status === 200) {
        toast.success("Shipment updated successfully!");
        setShipments((prevShipment) =>
          prevShipment.map((shipment) =>
            shipment.shipmentId === selectedShipment.shipmentId
              ? { ...shipment, ...response.data}
              : shipment
          )
        );

        setSelectedShipment(null); // Close dialog
        setFormData({
          departureDate: "",
          arrivalDate: "",
          status: "",
        })
       
      }
    } catch (error) {
      console.error("Error updating Shipment:", error);
      toast.error("Failed to update Shipment.");
    }

    console.log(formData)
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
      <div className="overflow-x-auto">
        <div>
          {Loading ? ( // Conditional rendering for loading state
            <div className="flex justify-center items-center">
              <ClimbingBoxLoader />
            </div> // Display this when loading is true
          ) : (
            <Table className="min-w-full table-auto hidden sm:table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Driver Payment</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortShipments("dateOfDispatch")}
                  >
                    Dispatch
                    {sortConfig.key === "dateOfDispatch" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
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
                    <TableCell className="font-medium text-left">
                      {shipment.shipmentName}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.clientName}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.pickupLocation}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.deliveryLocation}
                    </TableCell>
                    <TableCell className="text-left">
                      <Badge
                        className={`${
                          statusColors[shipment.status]
                        } text-white`}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      ₹{shipment.paymentPending}
                    </TableCell>
                    <TableCell className="text-left">
                      ₹{shipment.driverPayment}
                    </TableCell>
                    <TableCell className="text-left">
                      {format(parseISO(shipment.departureDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-left">
                      {format(parseISO(shipment.arrivalDate), "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="border rounded-lg shadow-lg mb-6 p-5 bg-white"
              onClick={() => setSelectedShipment(shipment)}
            >
              <div className="font-semibold text-xl text-gray-800 mb-4">
                {shipment.name}
              </div>

              <div className="text-gray-600 mb-4 flex items-center">
                <span className="mr-2 ">
                  <UserRound /> {/* Replace with actual client icon */}
                </span>
                <span className="text-gray-500 mr-2">Client:</span>{" "}
                {shipment.clientName}
              </div>

              <div className="text-sm text-gray-700 mb-4 flex items-center">
                <span className="mr-2 ">
                  <MapPin /> {/* Replace with actual origin icon */}
                </span>
                <span className="font-semibold mr-2">Origin:</span>{" "}
                {shipment.origin}
              </div>

              <div className="text-sm text-gray-700 mb-4 flex items-center">
                <span className="mr-2">
                  <MapPinCheck /> {/* Replace with actual destination icon */}
                </span>
                <span className="font-semibold mr-2">Destination:</span>{" "}
                {shipment.destination}
              </div>

              <div className="text-sm text-gray-700 mb-4 flex items-center">
                <span className="mr-2">
                  <Truck />
                </span>
                <span className="font-semibold mr-2">Status:</span>{" "}
                <Badge
                  className={`${
                    statusColors[shipment.status]
                  } text-white px-2 py-1 rounded-md`}
                >
                  {shipment.status}
                </Badge>
              </div>

              <div className="text-sm mb-4 flex items-center">
                <span className="mr-2 text-gray-500">
                  <HandCoins /> {/* Replace with actual payment icon */}
                </span>
                <span className="font-semibold mr-2">Payment:</span> ₹
                {shipment.paymentPending}
              </div>

              <div className="text-sm mb-4 flex items-center">
                <span className="mr-2 text-gray-500">
                  <Banknote /> {/* Replace with actual driver payment icon */}
                </span>
                <span className="font-semibold mr-2">Driver Payment:</span> ₹
                {shipment.driverPayment}
              </div>

              <div className="text-sm mb-4 flex items-center">
                <span className="mr-2 text-gray-500">
                  <Package /> {/* Replace with actual dispatch icon */}
                </span>
                <span className="font-semibold mr-2">Dispatch:</span>{" "}
                {/* {format(parseISO(shipment.dateOfDispatch), "MMM dd, yyyy")} */}
              </div>

              <div className="text-sm flex items-center">
                <span className="mr-2 text-gray-500">
                  <PlaneLanding /> {/* Replace with actual arrival icon */}
                </span>
                <span className="font-semibold">Arrival:</span>{" "}
                {/* {format(parseISO(shipment.dateOfArrival), "MMM dd, yyyy")} */}
              </div>
            </div>
          ))}
        </div>
      </div>
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
              <Button
                onClick={() => {
                  setCreateShipmentOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Button>
              <ShipmentForm
                createShipmentOpen={createShipmentOpen}
                setCreateShipmentOpen={setCreateShipmentOpen}
                setShipments={setShipments}
                setLoading={setLoading}
              ></ShipmentForm>
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
                  <IndianRupee className="mr-2 h-4 w-4" />
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
                  <DialogTitle>{selectedShipment.shipmentName}</DialogTitle>
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
                    <p>{selectedShipment.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Destination:</p>

                    <p>{selectedShipment.deliveryLocation}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Pending:</p>
                    <p>₹{selectedShipment.paymentPending}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Driver Payment:</p>
                    <p>₹{selectedShipment.driverPayment}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Dispatch Date:</p>
                    <p>
                      {format(
                        parseISO(selectedShipment.departureDate),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Arrival Date:</p>
                    <p>
                      {format(
                        parseISO(selectedShipment.arrivalDate),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                <DialogFooter className="gap-8 flex justify-evenly mr-9">
                  {selectedShipment.status !== "Delivered" && (
                    <Button
                      variant="destructive"
                      onClick={() => closeShipment(selectedShipment.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Close Shipment
                    </Button>
                  )}

                  {activeTab === "all" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Pen className="mr-2 h-4 w-4" /> Update Shipment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold">
                            Update Shipment
                          </DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground">
                            Enter the details you want to update. <br/>Click save
                            when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={handleSubmit}
                          className="space-y-6 py-4"
                        >
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="departureDate"
                              className="text-right text-sm font-medium"
                            >
                              Dispatch Date
                            </Label>
                            <Input
                              id="departureDate"
                              type="date"
                              className="col-span-3"
                              value={formData.departureDate}
                              onChange={handleInputChange}
                              
                              
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="arrivalDate"
                              className="text-right text-sm font-medium"
                            >
                              Arrival Date
                            </Label>
                            <Input
                              id="arrivalDate"
                              type="date"
                              className="col-span-3"
                              value={formData.arrivalDate}
                              onChange={handleInputChange}
                              
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="status"
                              className="text-right text-sm font-medium"
                            >
                              Status
                            </Label>
                            <Select
                              onValueChange={handleStatusChange}
                              value={formData.status}
                              
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                                <SelectItem value="delivered">
                                  Delivered
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-4 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-primary hover:bg-primary/90"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
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
