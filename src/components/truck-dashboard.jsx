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
const onWayTrucks = [
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

const allTrucks = [
  {
    id: 1,
    name: "Truck A",
    lastMaintenance: "2023-05-15",
    nextMaintenance: "2023-11-15",
    model: "Freightliner Cascadia",
    capacity: "80,000 lbs",
    status: "Available",
    fuel : "Petrol",
    mileage : "30 kmpl",
  },
  {
    id: 2,
    name: "Truck B",
    lastMaintenance: "2023-06-01",
    nextMaintenance: "2023-12-01",
    model: "Peterbilt 579",
    capacity: "70,000 lbs",
    status: "In Transit",
    fuel : "Petrol",
    mileage : "30 kmpl",
  },
  {
    id: 3,
    name: "Truck C",
    lastMaintenance: "2023-04-30",
    nextMaintenance: "2023-10-30",
    model: "Kenworth T680",
    capacity: "75,000 lbs",
    status: "Maintenance",
    fuel : "Electic",
    mileage : "50 kmpl",
  },
  {
    id: 4,
    name: "Truck D",
    lastMaintenance: "2023-05-20",
    nextMaintenance: "2023-11-20",
    model: "Volvo VNL",
    capacity: "85,000 lbs",
    status: "Available",
    fuel : "Diesel",
    mileage : "60 kmpl",
  },
];

const statusColors = {
  "On Time": "bg-green-500",
  Delayed: "bg-red-500",
  Available: "bg-green-500",
  "In Transit": "bg-blue-600",
  Maintenance: "bg-yellow-500",
};

export function TruckDashboard() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddNewTruckOpen, setIsAddNewTruckOpen] = useState(false);

  const filteredTrucks = allTrucks.filter(
    (truck) =>
      truck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          <Dialog>
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
                  
                  Enter the details for the new truck here. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" placeholder = "Truck Number" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Model
                  </Label>
                  <Input id="model" className="col-span-3" placeholder = "Truck Model"/>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input id="capacity" className="col-span-3" placeholder = "Truck Capacity"/>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Fuel Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">petrol</SelectItem>
                      <SelectItem value="intransit">Diesel</SelectItem>
                      <SelectItem value="maintenance">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Mileage
                  </Label>
                  <Input id="capacity" className="col-span-3" placeholder = "Truck Mileage"/>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serviceDate" className="text-right">
                    Last service date
                  </Label>
                  <Input
                    id="serviceDate"
                    type="date" // This will render a date picker (calendar) in most browsers
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    insurance Details
                  </Label>
                  <Input id="capacity" className="col-span-3" placeholder = "Policy number"/>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="intransit">In Transit</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
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
                          {truck.name}
                        </CardTitle>
                        <CardDescription>
                          <Badge
                            className={`${
                              statusColors[truck.status]
                            } text-white mt-2`}
                          >
                            {truck.status}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="flex items-center text-sm">
                          <MapPin className="mr-2 text-black h-4 w-4" />{" "}
                          {truck.destination}
                        </p>
                        <p className="flex items-center text-sm mt-2">
                          <Clock className="mr-2 text-black h-4 w-4" />{" "}
                          {truck.startTime} - {truck.endTime}
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
                                    <div className="font-bold">
                                      Destination:
                                    </div>{" "}
                                    {truck.destination}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="mr-2 text-purple-500 h-4 w-4" />
                                    <div className="font-bold">Time:</div>{" "}
                                    {truck.startTime} - {truck.endTime}
                                  </div>
                                  <div className="flex items-center">
                                    <User className="mr-2 text-blue-500 h-4 w-4" />
                                    <div className="font-bold">Driver:</div>{" "}
                                    {truck.driver}
                                  </div>
                                  <div className="flex items-center">
                                    <Package className="mr-2 text-yellow-500 h-4 w-4" />
                                    <div className="font-bold">Cargo:</div>{" "}
                                    {truck.cargo}
                                  </div>
                                  <div className="flex items-center col-span-full">
                                    <Calendar className="mr-2 text-indigo-500 h-4 w-4" />
                                    Expected Delivery: {truck.expectedDelivery}
                                  </div>
                                  <div className="flex items-center col-span-full">
                                    <Badge
                                      className={`${
                                        statusColors[truck.status]
                                      } text-white`}
                                    >
                                      {truck.status}
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
                        {truck.name}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left hidden md:table-cell">
                        {truck.model}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left hidden lg:table-cell">
                        {truck.capacity}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left">
                        <Badge
                          className={`${statusColors[truck.status]} text-white`}
                        >
                          {truck.status}
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
                      <Wrench className="mr-2 text-yellow-500" /> Last
                      Maintenance: {selectedTruck.lastMaintenance}
                    </div>
                    <div className="flex items-center mt-2">
                      <Calendar className="mr-2 text-green-500" /> Next
                      Maintenance: {selectedTruck.nextMaintenance}
                    </div>
                    <div className="flex items-center mt-2" >
                      <Truck className="mr-2 text-blue-500" /> Model:{" "}
                      {selectedTruck.model}
                    </div>
                    <div className="flex items-center mt-2">
                      <Package className="mr-2 text-purple-500" /> Capacity:{" "}
                      {selectedTruck.capacity}
                    </div>

                    <div className="flex items-center mt-2">
                      <Fuel className="mr-2 text-yellow-800" /> Fuel Type:{" "}
                      {selectedTruck.fuel}
                    </div>

                    <div className="flex items-center mt-2">
                      <CircleGauge className="mr-2 text-red-600" /> Mileage:{" "}
                      {selectedTruck.mileage}
                    </div>



                    <div className="flex items-center font-bold text-black ">
                      Status:{" "}
                      <Badge
                        className={`${
                          statusColors[selectedTruck.status]
                        } text-white ml-2`}
                      >
                        {selectedTruck.status}
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
                            Enter the details you want to update. Click save
                            when you're done.
                          </DialogDescription>
                        </DialogHeader>

                        <form className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right">
                              Model
                            </Label>
                            <Input id="model" className="col-span-3" />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">
                              Capacity
                            </Label>
                            <Input id="capacity" className="col-span-3" />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  Available
                                </SelectItem>
                                <SelectItem value="intransit">
                                  In Transit
                                </SelectItem>
                                <SelectItem value="maintenance">
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
