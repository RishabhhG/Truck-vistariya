'use client'

import { useState } from 'react'
import { Search, Filter, Star, Truck, UserPlus, BarChart, Calendar, MapPin, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Sidebar Component
import { Sidebar } from './Sidebar';

// Mock data for drivers
const drivers = [
  { id: 1, name: "John Doe", availability: "Available", license: "CDL-A", experience: "5 years", rating: 4.8, image: "/placeholder.svg?height=40&width=40", tripsCompleted: 120, onTimeRate: 98 },
  { id: 2, name: "Jane Smith", availability: "On Trip", license: "CDL-B", experience: "3 years", rating: 4.5, image: "/placeholder.svg?height=40&width=40", tripsCompleted: 85, onTimeRate: 95 },
  { id: 3, name: "Bob Johnson", availability: "Available", license: "CDL-A", experience: "7 years", rating: 4.9, image: "/placeholder.svg?height=40&width=40", tripsCompleted: 200, onTimeRate: 99 },
  { id: 4, name: "Alice Brown", availability: "Off Duty", license: "CDL-C", experience: "2 years", rating: 4.2, image: "/placeholder.svg?height=40&width=40", tripsCompleted: 50, onTimeRate: 92 },
]

export function DriverManagementComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("All")
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (availabilityFilter === "All" || driver.availability === availabilityFilter))

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available": return "bg-green-500"
      case "On Trip": return "bg-blue-500"
      case "Off Duty": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 p-4 space-y-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Driver Management Dashboard</h1>
          <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all hover:scale-105 w-full sm:w-auto"><UserPlus className="mr-2 h-4 w-4" /> Add New Driver</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter driver's name" />
                </div>
                <div>
                  <Label htmlFor="license">License Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDL-A">CDL-A</SelectItem>
                      <SelectItem value="CDL-B">CDL-B</SelectItem>
                      <SelectItem value="CDL-C">CDL-C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input id="experience" placeholder="Years of experience" />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Trip">On Trip</SelectItem>
                      <SelectItem value="Off Duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
              </form>
              <DialogFooter>
                <Button type="submit">Add Driver</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.filter(d => d.availability === "Available").length}</div>
              <p className="text-xs text-muted-foreground">Ready for assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(2)}</div>
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
                className="pl-8 w-full sm:w-[300px] transition-all focus:w-full sm:focus:w-[400px]" />
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
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
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
                  <TableHead className="text-center" >Availability</TableHead>
                  <TableHead className="text-center">License</TableHead>
                  <TableHead className="text-center">Experience</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className="cursor-pointer transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={driver.image} alt={driver.name} />
                          <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{driver.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getAvailabilityColor(driver.availability)} text-white transition-all hover:scale-105`}>
                        {driver.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{driver.license}</TableCell>
                    <TableCell className="text-center">{driver.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{driver.rating}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {selectedDriver && (
          <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDriver.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedDriver.image} alt={selectedDriver.name} />
                    <AvatarFallback>{selectedDriver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className={`${getAvailabilityColor(selectedDriver.availability)} text-white`}>
                      {selectedDriver.availability}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{selectedDriver.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{selectedDriver.license} • {selectedDriver.experience}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Trips Completed</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedDriver.tripsCompleted}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedDriver.onTimeRate}%</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">+1 234 567 8900</p>
                  </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedDriver.name.toLowerCase().replace(' ', '.')}@example.com</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Location</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Los Angeles, CA</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="transition-all hover:scale-105 bg-black text-white"><Truck className="mr-2 h-4 w-4" /> Assign to Trip</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
    
    </div>
  );
}