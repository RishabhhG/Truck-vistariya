import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { apiClient } from "@/lib/api-client";
import {
  GET_AVAILABLE_DRIVERS,
  GET_AVAILABLE_TRUCK,
  GET_ALL_CLIENTS,
  CREATE_SHIPMENT,
} from "@/utils/constant";

export default function CreateShipmentModal({
  createShipmentOpen,
  setCreateShipmentOpen,
}) {
  const [formData, setFormData] = useState({
    shipmentName: "",
    clientName: "",
    origin: "",
    destination: "",
    paymentPending: "0",
    driver: "",
    dispatchDate: "",
    arrivalDate: "",
    truck: "",
    cargoType: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchDrivers() {
      const availableDrivers = await apiClient.get(GET_AVAILABLE_DRIVERS);
      setDrivers(availableDrivers.data);
    }
    fetchDrivers();
  }, []);

  useEffect(() => {
    async function fetchTrucks() {
      const availableTrucks = await apiClient.get(GET_AVAILABLE_TRUCK);
      setTrucks(availableTrucks.data.availableTrucks);
    }
    fetchTrucks();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      const availableClients = await apiClient.get(GET_ALL_CLIENTS);
      console.log(availableClients.data);
      setClients(availableClients.data);
    }
    fetchClients();
  }, []);

  const onClose = () => {
    setCreateShipmentOpen(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("Shipment created:", formData);
      await apiClient.post(CREATE_SHIPMENT, formData);
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorResponse = error.response.data;
        const validationErrors = {};
        errorResponse.forEach((err) => {
          validationErrors[err.path] = err.msg;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <Dialog open={createShipmentOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Shipment
          </DialogTitle>
        </DialogHeader>
       
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Enter the details for the new shipment.
            </p>
            <div className="space-y-2">
              <Label htmlFor="shipmentName">Shipment Name</Label>
              <Input
                id="shipmentName"
                placeholder="Enter shipment name"
                value={formData.shipmentName}
                onChange={handleInputChange}
              />
              {errors.shipmentName && <p className="text-red-500 text-xs">{errors.shipmentName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Select Client</Label>
              <Select
                onValueChange={(value) => handleSelectChange("clientName", value)}
              >
                <SelectTrigger id="clientName">
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.clienId} value={client.clienId}>
                      {client.clientName} (ID: {client.clienId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  placeholder="Enter origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                />
                {errors.origin && <p className="text-red-500 text-xs">{errors.origin}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                />
                {errors.destination && <p className="text-red-500 text-xs">{errors.destination}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentPending">Payment Pending</Label>
                <Input
                  id="paymentPending"
                  type="number"
                  value={formData.paymentPending}
                  onChange={handleInputChange}
                />
                {errors.paymentPending && <p className="text-red-500 text-xs">{errors.paymentPending}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">Select Available Driver</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("driver", value)}
                >
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Select a Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.driverId} value={driver.driverId}>
                        {driver.name} (ID: {driver.driverId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driver && <p className="text-red-500 text-xs">{errors.driver}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dispatchDate">Date of Dispatch</Label>
                <Input
                  id="dispatchDate"
                  type="date"
                  value={formData.dispatchDate}
                  onChange={handleInputChange}
                />
                {errors.dispatchDate && <p className="text-red-500 text-xs">{errors.dispatchDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Date of Arrival</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                />
                {errors.arrivalDate && <p className="text-red-500 text-xs">{errors.arrivalDate}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="truck">Select Available Truck</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("truck", value)}
                >
                  <SelectTrigger id="truck">
                    <SelectValue placeholder="Select a Truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.map((truck) => (
                      <SelectItem key={truck._id} value={truck._id}>
                        {truck.registrationNumber} (ID: {truck._id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.truck && <p className="text-red-500 text-xs">{errors.truck}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargoType">Cargo Type</Label>
                <Input
                  id="cargoType"
                  placeholder="Enter Cargo Type"
                  value={formData.cargoType}
                  onChange={handleInputChange}
                />
                {errors.cargoType && <p className="text-red-500 text-xs">{errors.cargoType}</p>}
              </div>
            </div>
          </form>
        
        <div className="p-4 mt-4">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Create Shipment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}