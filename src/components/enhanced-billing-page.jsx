"use client";
import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  ArrowUpDown,
  Search,
  DollarSign,
  Users,
  Calendar,
  PieChart,
  Menu,
  IndianRupee,
  Pen,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sidebar } from "./Sidebar";

export function EnhancedBillingPageComponent() {
  // ... (useState and other logic remain the same)

  const [bills, setBills] = useState([
    {
      id: 1,
      clientName: "Acme Corp",
      amount: 5000,
      dueDate: "2023-07-15",
      status: "Unpaid",
      description: "Web development services",
      createdAt: "2023-06-15",
    },
    {
      id: 2,
      clientName: "TechStart Inc",
      amount: 3500,
      dueDate: "2023-07-20",
      status: "Paid",
      description: "UI/UX design project",
      createdAt: "2023-06-20",
    },
    {
      id: 3,
      clientName: "Global Solutions",
      amount: 7500,
      dueDate: "2023-07-25",
      status: "Unpaid",
      description: "Mobile app development",
      createdAt: "2023-06-25",
    },
    {
      id: 4,
      clientName: "Innovate LLC",
      amount: 6000,
      dueDate: "2023-08-01",
      status: "Paid",
      description: "Cloud infrastructure setup",
      createdAt: "2023-07-01",
    },
    {
      id: 5,
      clientName: "FutureTech",
      amount: 4500,
      dueDate: "2023-08-05",
      status: "Unpaid",
      description: "AI integration project",
      createdAt: "2023-07-05",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    clientName: "",
    amount: 0,
    dueDate: "",
    status: "Unpaid",
    description: "",
    payment : "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = Math.max(...bills.map((bill) => bill.id)) + 1;
    const createdAt = new Date().toISOString().split("T")[0];
    setBills((prev) => [...prev, { ...newBill, id: newId, createdAt }]);
    setIsOpen(false);
    setNewBill({
      clientName: "",
      amount: 0,
      dueDate: "",
      status: "Unpaid",
      description: "",

    });
  };

  const filteredAndSortedBills = useMemo(() => {
    return bills
      .filter(
        (bill) =>
          bill.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (statusFilter === "All" || bill.status === statusFilter)
      )
      .sort((a, b) =>
        sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      );
  }, [bills, searchTerm, sortOrder, statusFilter]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const totalBilled = useMemo(
    () => bills.reduce((sum, bill) => sum + bill.amount, 0),
    [bills]
  );
  const totalPaid = useMemo(
    () =>
      bills
        .filter((bill) => bill.status === "Paid")
        .reduce((sum, bill) => sum + bill.amount, 0),
    [bills]
  );
  const totalUnpaid = useMemo(
    () =>
      bills
        .filter((bill) => bill.status === "Unpaid")
        .reduce((sum, bill) => sum + bill.amount, 0),
    [bills]
  );

  const chartData = useMemo(() => {
    const data = bills.reduce((acc, bill) => {
      const month = new Date(bill.dueDate).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + bill.amount;
      return acc;
    }, {});
    return Object.entries(data).map(([month, amount]) => ({ month, amount }));
  }, [bills]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 p-4 lg:p-8 space-y-6">
        <Button
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6">
          Billing Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Billed", value: totalBilled, icon: IndianRupee },
            { title: "Total Paid", value: totalPaid, icon: Users },
            { title: "Total Unpaid", value: totalUnpaid, icon: Calendar },
            { title: "Total Invoices", value: bills.length, icon: PieChart },
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {typeof item.value === "number" &&
                  item.title !== "Total Invoices"
                    ? `₹${item.value.toFixed(2)}`
                    : item.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Billing Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Bill
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* ... (Dialog content remains the same) */}

              <DialogHeader>
                <DialogTitle>Create New Bill</DialogTitle>
                <DialogDescription>
                  Enter the details of the new Bill here. <br />
                  Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="clientName"
                  placeholder="Client Name"
                  value={newBill.clientName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="ShipmentName"
                  placeholder="Shipment Name"
                  value={newBill.ShipmentName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  value={newBill.amount}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="dueDate"
                  type="date"
                  placeholder="Due Date"
                  value={newBill.dueDate}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  name="status"
                  onValueChange={(value) =>
                    setNewBill((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  name="Payment"
                  onValueChange={(value) =>
                    setNewBill((prev) => ({ ...prev, payment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Card</SelectItem>
                    <SelectItem value="Unpaid">Bank Transfer</SelectItem>
                    <SelectItem value="Unpaid">Cash</SelectItem>
                  </SelectContent>
                </Select>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={newBill.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-white text-black placeholder:text-black"
                  required
                />
                <Button type="submit" className="w-full">
                  Create Bill
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={toggleSortOrder}
                    className="font-semibold text-left bg-white"
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedBills.map((bill) => (
                <TableRow
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <TableCell className="font-medium text-left">
                    {bill.clientName}
                  </TableCell>
                  <TableCell className="text-left px-8">
                    ${bill.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-left">{bill.dueDate}</TableCell>
                  <TableCell className="text-left">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bill.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Dialog
          open={!!selectedBill}
          onOpenChange={() => setSelectedBill(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bill Details</DialogTitle>
            </DialogHeader>
            {selectedBill && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Client Name</h3>
                  <p>{selectedBill.clientName}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Amount</h3>
                  <p>${selectedBill.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Due Date</h3>
                  <p>{selectedBill.dueDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{selectedBill.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{selectedBill.description}</p>
                </div>
                <div className="flex gap-x-52">
                  <div>
                  <h3 className="font-semibold">Created At</h3>
                  <p>{selectedBill.createdAt}</p>
                  </div>

                  <div>
                  <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-black hover:bg-gray-800 text-white mt-2">
                          <Pen className="mr-2 h-4 w-4" /> Update Bill
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Bill</DialogTitle>
                          <DialogDescription>
                            Enter the details you want to update. <br/>Click save
                            when you're done.
                          </DialogDescription>
                        </DialogHeader>

                        <form className="grid gap-4 py-4">
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Payment Status
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  Paid
                                </SelectItem>
                                <SelectItem value="On Trip">
                                   UnPaid
                                </SelectItem>

                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Salary" className="text-right">
                            Additional Note
                            </Label>
                            <Input id="Salary" type = "text" className="col-span-3" />
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
                </div>


              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
