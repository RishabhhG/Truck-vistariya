"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { CREATE_DRIVER, GET_ALL_DRIVERS, UPDATE_DRIVER } from "@/utils/constant";
import {
  Search,
  Filter,
  Star,
  Truck,
  UserPlus,
  BarChart,
  Calendar,
  MapPin,
  Menu,
  TicketSlash,
  CalendarDays,
  Pen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Sidebar Component
import { Sidebar } from "./Sidebar";

export function DriverManagementComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [drivers, setDrivers] = useState([]); // State to hold drivers data

  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "", // Updated
    experience: "",
    availabilityStatus: "",
    phoneNumber: "", // Updated
    address: "",
    salary: "",
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await apiClient.get(GET_ALL_DRIVERS);
        console.log(response);
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers data:", error);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (availabilityFilter === "All" ||
        driver.availabilityStatus === availabilityFilter)
  );

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "bg-green-500";
      case "On Trip":
        return "bg-blue-500";
      case "Not Available":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "phoneNumber" || id === "salary" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      licenseNumber: "", // Updated
      experience: "",
      availabilityStatus: "",
      phoneNumber: "", // Updated
      address: "",
      salary: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.licenseNumber ||
      !formData.experience ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.salary
    ) {
      toast.error("All fields are required");
    }

    try {
      const response = await apiClient.post(CREATE_DRIVER, formData);

      if (response.status === 201) {
        // Show success toast
        toast.success("Driver created successfully!");
        setDrivers([...drivers, response.data.driver]);
      }

      console.log("Driver added successfully:", response.data);

      // Optionally close the dialog and reset form
      setIsAddDriverOpen(false);
      resetForm()
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();

    // Prepare the updated truck data only with fields that are filled
    const updatedDriverData = {};

    if (formData.availabilityStatus)
      updatedDriverData.availabilityStatus = formData.availabilityStatus;
    
    if(formData.phoneNumber)
      updatedDriverData.phoneNumber = formData.phoneNumber;

    if(formData.address)
      updatedDriverData.address = formData.address;

    if(formData.salary)
      updatedDriverData.salary = formData.salary;

    // Check if there's anything to update
    if (Object.keys(updatedDriverData).length === 0) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await apiClient.put(
        UPDATE_DRIVER.replace(":driverId", selectedDriver.driverId), // Ensure selectedTruck is defined
        updatedDriverData
      );

      if (response.status === 200) {
        console.log(response.data);
        toast.success("Driver updated successfully!");
        setDrivers((prevDriver) =>
          prevDriver.map((driver) =>
            driver.driverId === selectedDriver.driverId
              ? { ...driver, ...response.data }
              : driver
          )
        );

        setSelectedDriver(null); // Close dialog
        resetForm(); // Reset form after updating
      }
    }  catch (error) {
      console.error("Error updating truck:", error);
      toast.error("Failed to update truck.");
    }
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main content area */}
      <div className="flex-1 p-4 space-y-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Driver Management Dashboard
          </h1>
          <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all hover:scale-105 w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter the details of the new Driver here. <br />
                  Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter driver's name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter driver's license number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    placeholder="Years of experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, availabilityStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="number"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="Enter Salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Driver</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Drivers
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Drivers
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  drivers.filter((d) => d.availabilityStatus === "Available")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for assignment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length
                ).toFixed(2)}
              </div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[300px] transition-all focus:w-full sm:focus:w-[400px]"
              />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <Select onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-center">Availability</TableHead>
                  <TableHead className="text-center">License</TableHead>
                  <TableHead className="text-center">Experience</TableHead>
                  <TableHead>Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={driver.image} alt={driver.name} />
                          <AvatarFallback>
                            {driver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{driver.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getAvailabilityColor(
                          driver.availabilityStatus
                        )} text-white transition-all hover:scale-105 hover:bg-black`}
                      >
                        {driver.availabilityStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {driver.licenseNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      {driver.experience}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        
                        <span>₹ {driver.salary}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {selectedDriver && (
          <Dialog
            open={!!selectedDriver}
            onOpenChange={() => setSelectedDriver(null)}
          >
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedDriver.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={selectedDriver.image}
                      alt={selectedDriver.name}
                    />
                    <AvatarFallback>
                      {selectedDriver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className={`${getAvailabilityColor(
                        selectedDriver.availabilityStatus
                      )} text-white`}
                    >
                      {selectedDriver.availabilityStatus}
                    </Badge>
                    <div className="flex items-center">
                      <TicketSlash className="w-4 h-4  text-black mr-2" />
                      <span> {selectedDriver.licenseNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4  text-black mr-2" />
                      {selectedDriver.experience}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trips Completed
                      </CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedDriver.tripsCompleted}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        On-Time Rate
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedDriver.onTimeRate}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedDriver.phoneNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">
                      {selectedDriver.name.toLowerCase().replace(" ", ".")}
                      {selectedDriver.address}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Current Salary
                  </Label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedDriver.salary}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-black hover:bg-gray-800 text-white">
                      <Pen className="mr-2 h-4 w-4" /> Update Driver
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Update Driver</DialogTitle>
                      <DialogDescription>
                        Enter the details you want to update. <br />
                        Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      className="grid gap-4 py-4"
                      onSubmit={handleUpdateDriver}
                    >
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Phone" className="text-right">
                          Phone Number
                        </Label>
                        <Input
                          id="Phone"
                          type="number"
                          className="col-span-3"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Address" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="Address"
                          className="col-span-3"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Salary" className="text-right">
                          Salary
                        </Label>
                        <Input
                          id="Salary"
                          type="number"
                          className="col-span-3"
                          value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={formData.availabilityStatus}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              availabilityStatus: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Not Available">
                              Not Available
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
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
