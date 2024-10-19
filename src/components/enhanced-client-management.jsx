"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { CREATE_CLIENT, GET_ALL_CLIENTS, UPDATE_CLIENT } from "@/utils/constant";
import {
  Menu,
  Users,
  Activity,
  IndianRupee,
  Star,
  Search,
  UserPlus,
  Building2,
  Mail,
  PhoneOutgoing,
  Pen,
  Factory,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import toast from "react-hot-toast";

// Changed to named export
export function EnhancedClientManagement() {
  // Rest of the component code remains exactly the same
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clients, setclients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    clientName: "",
    email: "", // Updated
    phoneNumber: "",
    companyName: "",
    industry: "", // Updated
    status: "",
    note: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CLIENTS);
        console.log(response);
        setclients(response.data);
      } catch (error) {
        console.error("Error fetching Client data:", error);
      }finally {
        setLoading(false); // Stop loading when data fetching completes
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "phoneNumber" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      email: "", // Updated
      phoneNumber: "",
      companyName: "",
      industry: "", // Updated
      status: "",
      note: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.clientName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.companyName ||
      !formData.industry
    ) {
      toast.error("All fields are required");
    }

    console.log(formData);

    try {
      const response = await apiClient.post(CREATE_CLIENT, formData);

      if (response.status === 201) {
        // Show success toast
        toast.success("Client created successfully!");
        setclients([...clients, response.data.client]);
      }

      console.log("Client added successfully:", response.data);

      // Optionally close the dialog and reset form
      setIsNewClientDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    const updatedClientData = {};

    if (formData.clientName) updatedClientData.clientName = formData.clientName;
    if (formData.email) updatedClientData.email = formData.email;
    if (formData.phoneNumber)
      updatedClientData.phoneNumber = formData.phoneNumber;
    if (formData.companyName)
      updatedClientData.companyName = formData.companyName;
    if (formData.industry) updatedClientData.industry = formData.industry;
    if (formData.status) updatedClientData.status = formData.status;
    if (formData.note) updatedClientData.note = formData.note;

    if (Object.keys(updatedClientData).length === 0) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await apiClient.put(
        UPDATE_CLIENT.replace(":clientId", selectedClient.clientId),
        updatedClientData
      );

      if (response.status === 200) {
        toast.success("Client updated successfully!");
        setclients((prevClient) =>
          prevClient.map((client) =>
            client.clientId === selectedClient.clientId
              ? { ...client, ...response.data.client}
              : client
          )
        );

        setSelectedClient(null); // Close dialog
        resetForm(); // Reset form after updating
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      toast.error("Failed to update truck.");
    }

    console.log(updatedClientData);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredClients = clients
    .filter(
      (client) =>
        (selectedIndustry === "all" ||
          client.industry.toLowerCase() === selectedIndustry.toLowerCase()) &&
        (client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const renderMetricCard = (title, value, icon, trend) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? value.toFixed(1) : value}
        </div>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );

  const renderStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-500 text-white",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // const renderRating = (value) => (
  //   <div className="flex items-center">
  //     <span className="text-yellow-400 mr-1">★</span>
  //     <span>{value.toFixed(1)}</span>
  //   </div>
  // );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-grow p-4 md:p-6 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Button
            className="lg:hidden md:mb-4 sm:mb-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center sm:text-left mb-4 sm:mb-0">
            Client Management
          </h1>
          <Dialog
            open={isNewClientDialogOpen}
            onOpenChange={setIsNewClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="transition-all hover:scale-105 w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details of the new Client here. <br />
                  Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="clientName">Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter Client's name"
                    value={formData.clientName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="email">email</Label>
                  <Input
                    id="email"
                    placeholder="Enter Client's email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
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
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter Client's companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">industry</Label>
                  <Input
                    id="industry"
                    placeholder="Enter Client's industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="status">status</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="note">note</Label>
                  <Input
                    id="note"
                    placeholder="Enter note"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard(
            "Total Clients",
            clients.length,
            <Users className="h-4 w-4" />,
            "+5% from last month"
          )}
          {renderMetricCard(
            "Active Clients",
            clients.filter((c) => c.status === "Active").length,
            <Activity className="h-4 w-4" />,
            "2 new this week"
          )}
          {renderMetricCard(
            "Total Value",
            `₹ ${clients
              .reduce((acc, c) => acc + c.totalValue, 0)
              .toLocaleString()}`,
            <IndianRupee className="h-4 w-4" />,
            "+12% YoY"
          )}
          {renderMetricCard(
            "Avg. Client Rating",
            clients.reduce((acc, c) => acc + c.rating, 0) / clients.length,
            <Star className="h-4 w-4" />,
            "Up 0.2 points"
          )}
        </div>

        <div>

        {loading ? ( // Conditional rendering for loading state
              <div className="flex justify-center items-center">
                <ClimbingBoxLoader />
              </div> // Display this when loading is true
            ) : (
        <Tabs defaultValue="table" className="space-y-4">
          <TabsContent value="table" className="space-y-4">
            
            <div className="overflow-x-auto">

              
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { key: "name", label: "Client" },
                      { key: "status", label: "Status" },
                      { key: "industry", label: "Industry" },
                      { key: "projects", label: "Projects" },
                      { key: "totalValue", label: "Total Value" },
                      { key: "rating", label: "Rating" },
                    ].map((column) => (
                      <TableHead
                        key={column.key}
                        onClick={() => handleSort(column.key)}
                        className="cursor-pointer whitespace-nowrap"
                        aria-sort={
                          sortColumn === column.key ? sortDirection : "none"
                        }
                      >
                        {column.label}{" "}
                        {sortColumn === column.key &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedClient(client)}
                    >
                      <TableCell className="font-medium text-left">
                        {client.clientName}
                      </TableCell>
                      <TableCell className="text-left">
                        {renderStatusBadge(client.status)}
                      </TableCell>
                      <TableCell className="text-left">
                        {client.industry}
                      </TableCell>
                      {/* <TableCell className="text-left">
                        {client.projects}
                      </TableCell>
                      <TableCell className="text-left">
                        ₹{client.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>{renderRating(client.rating)}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedClient && (
              <Dialog
                open={!!selectedClient}
                onOpenChange={() => setSelectedClient(null)}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedClient.clientName}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center font-bold text-black gap-2">
                      <Label className="text-right font-semibold">Status</Label>
                      <div className="col-span-3">
                        {renderStatusBadge(selectedClient.status)}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Building2 className="w-4 h-4  text-black mr-2" />
                      <span className="font-semibold mr-1">Company :</span>{" "}
                      {selectedClient.companyName}
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-black mr-2 mt-1" />
                      <span className="font-semibold mr-1"></span>{" "}
                      {selectedClient.email}
                    </div>

                    <div className="flex items-center">
                      <PhoneOutgoing className="w-4 h-4 text-black mr-2 mt-1" />
                      <span className="font-semibold mr-1">Phone :</span>{" "}
                      {selectedClient.phoneNumber}
                    </div>

                    <div className="flex items-center">
                      <Factory className="w-4 h-4 text-black mr-2" />
                      <span className="font-semibold mr-1">
                        Industry :
                      </span>{" "}
                      {selectedClient.industry}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-black hover:bg-gray-800 text-white mt-1">
                          <Pen className="mr-3 h-4 w-4" /> Update Truck
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Client</DialogTitle>
                          <DialogDescription>
                            Enter the details only you want to update.
                            <br />
                            Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          className="grid gap-4 py-4"
                          onSubmit={handleUpdateClient}
                        >
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter Client's email"
                              className="col-span-3"
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                              Phone Number
                            </Label>
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              type="number"
                              placeholder="Enter phone number"
                              className="col-span-3"
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                              }
                              value={formData.status}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
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

                    {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Industry</Label>
              <div className="col-span-3">{selectedClient.industry}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Projects</Label>
              <div className="col-span-3">{selectedClient.projects}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Total Value</Label>
              <div className="col-span-3">
                ₹{selectedClient.totalValue.toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Rating</Label>
              <div className="col-span-3">
                {renderRating(selectedClient.rating)}
              </div>
            </div> */}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            ;
          </TabsContent>
        </Tabs>
         )}
        </div>


      </div>
    </div>
  );
}
