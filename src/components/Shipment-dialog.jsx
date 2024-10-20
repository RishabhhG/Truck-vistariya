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
    clientId: null,
    pickupLocation: "",
    deliveryLocation: "",
    cargoWeight: null,
    driverId: null,
    departureDate: "",
    arrivalDate: "",
    truckId: null,
    cargoType: "",
    specialInstructions: "", // New field for special instructions
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
      console.log("truck", availableTrucks.data.availableTrucks);
    }
    fetchTrucks();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      const availableClients = await apiClient.get(GET_ALL_CLIENTS);
      console.log("client", availableClients.data);
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
    if (id === "cargoWeight") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: parseInt(value, 10),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSelectChange = (id, value) => {
    console.log(id, value);
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-auto flex flex-col">
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
            <Label htmlFor="clientId">Select Available client</Label>
            <Select
              value={formData.clientId?.toString()}
              onValueChange={(value) =>
                handleSelectChange("clientId", parseInt(value, 10))
              }
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((prop) => (
                  <SelectItem
                    key={prop.clientId}
                    value={prop.clientId.toString()}
                  >
                    {prop.clientName} (ID: {prop.clientId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-red-500 text-xs">{errors.clientId}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={handleInputChange}
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs">{errors.pickupLocation}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryLocation">Delivery Location</Label>
              <Input
                id="deliveryLocation"
                placeholder="Enter delivery location"
                value={formData.deliveryLocation}
                onChange={handleInputChange}
              />
              {errors.deliveryLocation && (
                <p className="text-red-500 text-xs">
                  {errors.deliveryLocation}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargoWeight">Cargo Weight</Label>
              <Input
                id="cargoWeight"
                type="number"
                value={formData.cargoWeight}
                onChange={handleInputChange}
              />
              {errors.cargoWeight && (
                <p className="text-red-500 text-xs">{errors.cargoWeight}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Select Available Driver</Label>
              <Select
                value={formData.driverId?.toString()}
                onValueChange={(value) =>
                  handleSelectChange("driverId", parseInt(value, 10))
                }
              >
                <SelectTrigger id="driverId">
                  <SelectValue placeholder="Select a Driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem
                      key={driver.driverId}
                      value={driver.driverId.toString()}
                    >
                      {driver.name} (ID: {driver.driverId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverId && (
                <p className="text-red-500 text-xs">{errors.driverId}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">Date of Dispatch</Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleInputChange}
              />
              {errors.departureDate && (
                <p className="text-red-500 text-xs">{errors.departureDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivalDate">Date of Arrival</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleInputChange}
              />
              {errors.arrivalDate && (
                <p className="text-red-500 text-xs">{errors.arrivalDate}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="truckId">Select Available Truck</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("truckId", parseInt(value, 10))
                }
              >
                <SelectTrigger id="truckId">
                  <SelectValue placeholder="Select a Truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.truckId} value={truck.truckId}>
                      {truck.registrationNumber} (ID: {truck.truckId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.truckId && (
                <p className="text-red-500 text-xs">{errors.truckId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargoType">Cargo Type</Label>
              <Input
                id="cargoType"
                placeholder="Enter Cargo Type"
                value={formData.cargoType}
                onChange={handleInputChange}
              />
              {errors.cargoType && (
                <p className="text-red-500 text-xs">{errors.cargoType}</p>
              )}
            </div>
          </div>

          {/* New Special Instructions Field */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Input
              id="specialInstructions"
              placeholder="Enter any special instructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
            />
            {errors.specialInstructions && (
              <p className="text-red-500 text-xs">
                {errors.specialInstructions}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit">Create Shipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
