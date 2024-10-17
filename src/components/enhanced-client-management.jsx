"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Search,
  BarChart,
  PieChart,
  DollarSign,
  Users,
  Star,
  Activity,
  Menu,
  IndianRupee,
} from "lucide-react";
import { Sidebar } from "./Sidebar";

export function EnhancedClientManagement() {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clients = [
    {
      id: 1,
      name: "Acme Corp",
      status: "active",
      projects: 3,
      totalValue: 45000,
      rating: 4.8,
      industry: "Technology",
    },
    {
      id: 2,
      name: "TechStart Inc",
      status: "inactive",
      projects: 1,
      totalValue: 12000,
      rating: 4.2,
      industry: "Startup",
    },
    {
      id: 3,
      name: "Global Solutions",
      status: "active",
      projects: 5,
      totalValue: 78000,
      rating: 4.9,
      industry: "Consulting",
    },
    {
      id: 4,
      name: "EcoGreen Innovations",
      status: "active",
      projects: 2,
      totalValue: 35000,
      rating: 4.5,
      industry: "Environmental",
    },
    {
      id: 5,
      name: "MediCare Systems",
      status: "active",
      projects: 4,
      totalValue: 62000,
      rating: 4.7,
      industry: "Healthcare",
    },
  ];

  const filteredClients = clients
    .filter(
      (client) =>
        (selectedIndustry === "all" ||
          client.industry.toLowerCase() === selectedIndustry.toLowerCase()) &&
        (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.industry.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-grow p-4 md:p-6 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Button
            className=" lg:hidden md: mb-4 sm:mb-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center sm:text-left mb-4 sm:mb-0">
            Client Management
          </h1>
          <Button
            className="bg-primary text-primary-foreground w-full sm:w-auto"
            onClick={() => setIsNewClientDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </header>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Clients"
            value={clients.length}
            icon={<Users className="h-4 w-4" />}
            trend="+5% from last month"
          />
          <MetricCard
            title="Active Clients"
            value={clients.filter((c) => c.status === "active").length}
            icon={<Activity className="h-4 w-4" />}
            trend="2 new this week"
          />
          <MetricCard
            title="Total Value"
            value={`₹ ${clients
              .reduce((acc, c) => acc + c.totalValue, 0)
              .toLocaleString()}`}
            icon={<IndianRupee className="h-4 w-4" />}
            trend="+12% YoY"
          />
          <MetricCard
            title="Avg. Client Rating"
            value={
              clients.reduce((acc, c) => acc + c.rating, 0) / clients.length
            }
            icon={<Star className="h-4 w-4" />}
            trend="Up 0.2 points"
          />
        </div>

        <Tabs defaultValue="table" className="space-y-4">
          <TabsContent value="table" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedIndustry}
                onValueChange={setSelectedIndustry}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer whitespace-nowrap"
                      aria-sort={sortColumn === "name" ? sortDirection : "none"}
                    >
                      Client{" "}
                      {sortColumn === "name" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("status")}
                      className="cursor-pointer whitespace-nowrap"
                      aria-sort={
                        sortColumn === "status" ? sortDirection : "none"
                      }
                    >
                      Status{" "}
                      {sortColumn === "status" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("industry")}
                      className="cursor-pointer whitespace-nowrap"
                      aria-sort={
                        sortColumn === "industry" ? sortDirection : "none"
                      }
                    >
                      Industry{" "}
                      {sortColumn === "industry" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("projects")}
                      className="cursor-pointer whitespace-nowrap"
                      aria-sort={
                        sortColumn === "projects" ? sortDirection : "none"
                      }
                    >
                      Projects{" "}
                      {sortColumn === "projects" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("totalValue")}
                      className="cursor-pointer whitespace-nowrap"
                      aria-sort={
                        sortColumn === "totalValue" ? sortDirection : "none"
                      }
                    >
                      Total Value{" "}
                      {sortColumn === "totalValue" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </TableHead>
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
                        {client.name}
                      </TableCell>
                      <TableCell className="text-left">
                        <StatusBadge status={client.status} />
                      </TableCell>
                      <TableCell className="text-left">
                        {client.industry}
                      </TableCell>
                      <TableCell className="text-left">
                        {client.projects}
                      </TableCell>
                      <TableCell className="text-left">
                        ₹{client.totalValue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <NewClientDialog
          open={isNewClientDialogOpen}
          onOpenChange={setIsNewClientDialogOpen}
        />
        <ClientDetailsDialog
          client={selectedClient}
          open={!!selectedClient}
          onOpenChange={() => setSelectedClient(null)}
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }) {
  return (
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
}

function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}


function NewClientDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" type="tel" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input id="company" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input id="industry" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea id="notes" className="col-span-3" />
          </div>
          <Button type="submit" className="ml-auto">
            Add Client
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ClientDetailsDialog({ client, open, onOpenChange }) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Status</Label>
            <div className="col-span-3">
              <StatusBadge status={client.status} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Industry</Label>
            <div className="col-span-3">{client.industry}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Projects</Label>
            <div className="col-span-3">{client.projects}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Total Value</Label>
            <div className="col-span-3">
              ${client.totalValue.toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
