"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { CREATE_TRUCK, GET_ALL_TRUCKS, UPDATE_TRUCK } from "@/utils/constant";
import { Toaster, toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  Package,
  Plus,
  User,
  Search,
  Menu,
  Fuel,
  CircleGauge,
  Pen,
  SquareM,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./Sidebar";
// Mock data for trucks with additional details
const onWayTruck = [
  {
    id: 1,
    name: "Truck A",
    destination: "New York",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    status: "On Time",
    driver: "John Doe",
    cargo: "Electronics",
    fuelLevel: "75%",
    expectedDelivery: "2023-10-15",
  },
  {
    id: 2,
    name: "Truck B",
    destination: "Los Angeles",
    startTime: "09:30 AM",
    endTime: "06:30 PM",
    status: "Delayed",
    driver: "Jane Smith",
    cargo: "Furniture",
    fuelLevel: "60%",
    expectedDelivery: "2023-10-16",
  },
  {
    id: 3,
    name: "Truck C",
    destination: "Chicago",
    startTime: "07:45 AM",
    endTime: "03:45 PM",
    status: "On Time",
    driver: "Bob Johnson",
    cargo: "Food supplies",
    fuelLevel: "80%",
    expectedDelivery: "2023-10-14",
  },
  {
    id: 4,
    name: "Truck D",
    destination: "Houston",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    status: "On Time",
    driver: "Alice Brown",
    cargo: "Machinery",
    fuelLevel: "70%",
    expectedDelivery: "2023-10-15",
  },
  {
    id: 5,
    name: "Truck E",
    destination: "Phoenix",
    startTime: "09:15 AM",
    endTime: "05:15 PM",
    status: "Delayed",
    driver: "Charlie Davis",
    cargo: "Textiles",
    fuelLevel: "65%",
    expectedDelivery: "2023-10-17",
  },
];

const allTruck = [
  {
    id: 1,
    name: "Truck A",
    lastMaintenance: "2023-05-15",
    nextMaintenance: "2023-11-15",
    model: "Freightliner Cascadia",
    capacity: "80,000 lbs",
    status: "Available",
    fuel: "Petrol",
    mileage: "30 kmpl",
  },
  {
    id: 2,
    name: "Truck B",
    lastMaintenance: "2023-06-01",
    nextMaintenance: "2023-12-01",
    model: "Peterbilt 579",
    capacity: "70,000 lbs",
    status: "In Transit",
    fuel: "Petrol",
    mileage: "30 kmpl",
  },
  {
    id: 3,
    name: "Truck C",
    lastMaintenance: "2023-04-30",
    nextMaintenance: "2023-10-30",
    model: "Kenworth T680",
    capacity: "75,000 lbs",
    status: "Maintenance",
    fuel: "Electic",
    mileage: "50 kmpl",
  },
  {
    id: 4,
    name: "Truck D",
    lastMaintenance: "2023-05-20",
    nextMaintenance: "2023-11-20",
    model: "Volvo VNL",
    capacity: "85,000 lbs",
    status: "Available",
    fuel: "Diesel",
    mileage: "60 kmpl",
  },
];

const statusColors = {
  "On Time": "bg-green-500",
  "Not Available": "bg-red-500",
  Available: "bg-green-500",
  "In Transit": "bg-blue-600",
  Maintenance: "bg-yellow-500",
};

export function TruckDashboard() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddNewTruckOpen, setIsAddNewTruckOpen] = useState(false);
  const [allTrucks, setAllTrucks] = useState([]);
  const [onWayTrucks, setOnWayTrucks] = useState([]);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    capacity: "",
    fuelType: "",
    mileage: "",
    serviceDate: "",
    policyNumber: "",
    expiryDate: "",
    availabilityStatus: "",
  });

  useEffect(() => {
    // API call to get all trucks
    const fetchTrucks = async () => {
      try {
        const response = await apiClient.get(GET_ALL_TRUCKS);
        console.log(response);
        setAllTrucks(response.data.trucks); // Assuming response.data contains the list of trucks

        const filteredOnWayTrucks = response.data.trucks.filter(
          (truck) => truck.availabilityStatus === "Not Available" // Adjust the condition as per your status
        );
        setOnWayTrucks(filteredOnWayTrucks);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      }
    };

    fetchTrucks();
  }, [allTrucks]); // Empty dependency array to run this once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Update the specific field based on its name attribute
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Update select fields dynamically
    }));
  };

  const resetForm = () => {
    setFormData({
      registrationNumber: "",
      model: "",
      capacity: "",
      fuelType: "",
      mileage: "",
      serviceDate: "",
      policyNumber: "",
      expiryDate: "",
      availabilityStatus: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure capacity and mileage are stored as numbers
    const newTruck = {
      registrationNumber: formData.registrationNumber,
      model: formData.model,
      capacity: Number(formData.capacity),
      fuelType: formData.fuelType,
      mileage: Number(formData.mileage),
      serviceDate: formData.serviceDate,
      availabilityStatus: formData.availabilityStatus,
      insuranceDetails: {
        policyNumber: formData.policyNumber,
        expiryDate: formData.expiryDate,
      },
    };

    if (
      !formData.registrationNumber ||
      !formData.model ||
      !formData.capacity ||
      !formData.fuelType ||
      !formData.mileage ||
      !formData.serviceDate ||
      !formData.availabilityStatus ||
      !formData.policyNumber ||
      !formData.expiryDate
    ) {
      toast.error("All fields are required");
    }

    try {
      const response = await apiClient.post(CREATE_TRUCK, newTruck);

      if (response.status === 201) {
        // Show success toast
        toast.success("Truck created successfully!");
        setAllTrucks((prevTrucks) => [...prevTrucks, response.data.truck]);
      }

      setIsAddNewTruckOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateTruck = async (e) => {
    e.preventDefault();

    console.log("Selected Truck:", selectedTruck);

    // Prepare the updated truck data only with fields that are filled
    const updatedTruckData = {};

    if (formData.model) updatedTruckData.model = formData.model;
    if (formData.capacity)
      updatedTruckData.capacity = Number(formData.capacity);
    if (formData.availabilityStatus)
      updatedTruckData.availabilityStatus = formData.availabilityStatus;
    if (formData.fuelType) updatedTruckData.fuelType = formData.fuelType;
    if (formData.mileage) updatedTruckData.mileage = Number(formData.mileage);
    if (formData.policyNumber)
      updatedTruckData.insuranceDetails = {
        ...updatedTruckData.insuranceDetails,
        policyNumber: formData.policyNumber,
      };
    if (formData.expiryDate)
      updatedTruckData.insuranceDetails = {
        ...updatedTruckData.insuranceDetails,
        expiryDate: formData.expiryDate,
      };

    // Check if there's anything to update
    if (Object.keys(updatedTruckData).length === 0) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await apiClient.put(
        UPDATE_TRUCK.replace(":truckId", selectedTruck.truckId), // Ensure selectedTruck is defined
        updatedTruckData
      );

      if (response.status === 200) {
        toast.success("Truck updated successfully!");
        setAllTrucks((prevTrucks) =>
          prevTrucks.map((truck) =>
            truck.truckId === selectedTruck.truckId
              ? { ...truck, ...response.data.truck }
              : truck
          )
        );

        setSelectedTruck(null); // Close dialog
        resetForm(); // Reset form after updating
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      toast.error("Failed to update truck.");
    }
  };

  const filteredTrucks = Array.isArray(allTrucks)
    ? allTrucks.filter(
        (truck) =>
          truck.registrationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.availabilityStatus
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          truck.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.insuranceDetails.policyNumber.includes(searchTerm)
      )
    : [];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        <Button
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800 mt-4">
          Transport Management Dashboard
        </h1>

        <Tabs defaultValue="onway" className="w-full">
          <TabsList className="mb-4 bg-white shadow-md rounded-lg gap-5 flex-wrap">
            <TabsTrigger
              value="onway"
              className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              On the Way
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black"
            >
              All Trucks
            </TabsTrigger>
          </TabsList>

          <Dialog open={isAddNewTruckOpen} onOpenChange={setIsAddNewTruckOpen}>
            <div className="flex justify-end relative right-28 items-center mb-4 mt-5 ">
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add New Truck
                </Button>
              </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Truck</DialogTitle>
                <DialogDescription>
                  Enter the details for the new truck here.
                  <br />
                  Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="registrationNumber" className="text-right">
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    className="col-span-3"
                    placeholder="Truck Number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Model
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    className="col-span-3"
                    placeholder="Truck Model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    className="col-span-3"
                    placeholder="Truck Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fuelType" className="text-right">
                    Fuel Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("fuelType", value)
                    }
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mileage" className="text-right">
                    Mileage
                  </Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    className="col-span-3"
                    placeholder="Truck Mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serviceDate" className="text-right">
                    Last service date
                  </Label>
                  <Input
                    id="serviceDate"
                    name="serviceDate"
                    type="date"
                    className="col-span-3"
                    value={formData.serviceDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="policyNumber" className="text-right">
                    Insurance Policy Number
                  </Label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    className="col-span-3"
                    placeholder="Policy number"
                    value={formData.policyNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    Insurance Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    className="col-span-3"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="availabilityStatus" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("availabilityStatus", value)
                    }
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">
                        Not Available
                      </SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Truck
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <TabsContent value="onway">
            <Carousel className="w-full max-w-5xl mx-auto mt-5">
              <CarouselContent className="-ml-2 md:-ml-4">
                {onWayTrucks.map((truck) => (
                  <CarouselItem
                    key={truck.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="bg-gray-50 rounded-t-lg">
                        <CardTitle className="flex items-center text-base font-bold md:text-lg">
                          <Truck className="mr-2 text-black h-4 w-4 md:h-5 md:w-5" />
                          {truck.registrationNumber}
                        </CardTitle>
                        <CardDescription>
                          <Badge
                            className={`${
                              statusColors[truck.availabilityStatus]
                            } text-white mt-2`}
                          >
                            {truck.availabilityStatus}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="flex items-center text-sm gap-1">
                          <SquareM className="mr-2 text-black h-4 w-4" />{" "}
                          <span className="font-bold">Model : </span>
                          {truck.model}
                        </p>
                        <p className="flex items-center text-sm mt-2 gap-1">
                          <Fuel className="mr-2 text-black h-4 w-4" />{" "}
                          <span className="font-bold">Fuel : </span>
                          {truck.fuelType}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="mt-4 w-full bg-black hover:bg-gray-800 text-white text-sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white max-w-md w-full">
                            <DialogHeader>
                              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">
                                {truck.name} Details
                              </DialogTitle>
                              <DialogDescription>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  <div className="flex items-center">
                                    <MapPin className="mr-2 text-green-500 h-4 w-4" />
                                    <div className="font-bold mr-1">
                                      Destination:
                                    </div>{" "}
                                    {truck.deliveryLocation}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-2 text-purple-500 h-4 w-4" />
                                    <div className="font-bold mr-1">
                                      Pickup:
                                    </div>{" "}
                                    {truck.pickupLocation}
                                  </div>
                                  <div className="flex items-center">
                                    <User className="mr-2 text-blue-500 h-4 w-4" />
                                    <div className="font-bold mr-1">
                                      Driver:
                                    </div>{" "}
                                    {truck.driver}
                                  </div>
                                  <div className="flex items-center">
                                    <Package className="mr-2 text-yellow-500 h-4 w-4" />
                                    <div className="font-bold mr-1">Cargo:</div>{" "}
                                    <div className="text-sm">
                                      {truck.cargoType}
                                    </div>
                                  </div>
                                  <div className="flex items-center col-span-full">
                                    <Calendar className="mr-2 text-indigo-500 h-4 w-4" />
                                    <div className="font-bold mr-1">
                                      Expected Delivery:
                                    </div>
                                    {new Date(
                                      truck.arrivalDate
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center col-span-full">
                                    <Badge
                                      className={`${
                                        statusColors[truck.availabilityStatus]
                                      } text-white`}
                                    >
                                      {truck.availabilityStatus}
                                    </Badge>
                                  </div>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="hidden md:flex items-center justify-center text-white bg-black rounded-full p-2" />
              <CarouselPrevious className="hidden md:flex items-center justify-center text-white bg-black rounded-full p-2" />
            </Carousel>
          </TabsContent>

          <TabsContent value="all">
            <div className="mb-4 flex flex-col sm:flex-row items-center mt-5">
              <Input
                type="text"
                placeholder="Search trucks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-sm mb-2 sm:mb-0 sm:mr-2"
              />
              <Button className="w-full sm:w-auto bg-black hover:bg-gray-700 text-white mt-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-left px-4 py-2">Name</TableHead>
                    <TableHead className="text-left px-4 py-2 hidden md:table-cell">
                      Model
                    </TableHead>
                    <TableHead className="text-left px-4 py-2 hidden lg:table-cell">
                      Capacity
                    </TableHead>
                    <TableHead className="text-left px-4 py-2">
                      Status
                    </TableHead>
                    <TableHead className="text-left px-4 py-2">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrucks.map((truck) => (
                    <TableRow key={truck.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium px-4 py-2 text-left">
                        {truck.registrationNumber}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left hidden md:table-cell">
                        {truck.model}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left hidden lg:table-cell">
                        {truck.capacity}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left">
                        <Badge
                          className={`${
                            statusColors[truck.availabilityStatus]
                          } text-white`}
                        >
                          {truck.availabilityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left">
                        <Button
                          variant="outline"
                          className="hover:bg-black hover:text-white text-xs md:text-sm"
                          size="sm"
                          onClick={() => setSelectedTruck(truck)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        {selectedTruck && (
          <Dialog
            open={!!selectedTruck}
            onOpenChange={() => setSelectedTruck(null)}
          >
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {selectedTruck.name} Details
                </DialogTitle>
                <DialogDescription>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center mt-2">
                      <Calendar className="mr-2 text-green-500" />
                      Policy number:{" "}
                      {selectedTruck.insuranceDetails.policyNumber}
                    </div>

                    <div className="flex items-center mt-2">
                      <Calendar className="mr-2 text-green-500" />
                      Policy Expiry:{" "}
                      {new Date(
                        selectedTruck.insuranceDetails.expiryDate
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-2">
                      <Truck className="mr-2 text-blue-500" /> Model:{" "}
                      {selectedTruck.model}
                    </div>
                    <div className="flex items-center mt-2">
                      <Package className="mr-2 text-purple-500" /> Capacity:{" "}
                      {selectedTruck.capacity}
                    </div>

                    <div className="flex items-center mt-2">
                      <Fuel className="mr-2 text-yellow-800" /> Fuel Type:{" "}
                      {selectedTruck.fuelType}
                    </div>

                    <div className="flex items-center mt-2">
                      <CircleGauge className="mr-2 text-red-600" /> Mileage:{" "}
                      {selectedTruck.mileage}
                    </div>

                    <div className="flex items-center font-bold text-black ">
                      Status:{" "}
                      <Badge
                        className={`${
                          statusColors[selectedTruck.availabilityStatus]
                        } text-white ml-2`}
                      >
                        {selectedTruck.availabilityStatus}
                      </Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-black hover:bg-gray-800 text-white mt-1">
                          <Pen className="mr-3 h-4 w-4" /> Update Truck
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Truck</DialogTitle>
                          <DialogDescription>
                            Enter the details only you want to update.
                            <br />
                            Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          className="grid gap-4 py-4"
                          onSubmit={handleUpdateTruck}
                        >
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right">
                              Model
                            </Label>
                            <Input
                              id="model"
                              name="model"
                              value={formData.model}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">
                              Capacity
                            </Label>
                            <Input
                              id="capacity"
                              name="capacity"
                              value={formData.capacity}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("availabilityStatus", value)
                              }
                              value={formData.availabilityStatus}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  Available
                                </SelectItem>
                                <SelectItem value="Not Available">
                                  Not Available
                                </SelectItem>
                                <SelectItem value="Maintenance">
                                  Maintenance
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Save Truck
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
