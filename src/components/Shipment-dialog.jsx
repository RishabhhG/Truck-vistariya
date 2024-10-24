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
  GET_ALL_SHIPMENTS,
} from "@/utils/constant";
import { Card } from "./ui/card";

export default function CreateShipmentModal({
  createShipmentOpen,
  setCreateShipmentOpen,
  setShipments,
  setLoading,
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

  useEffect(() => {
    async function fetchShipments() {
      try {
        const response = await apiClient.get(GET_ALL_SHIPMENTS);
        console.log("shipment", response);
        setShipments(response.data); // Assuming setShipments is provided as a prop
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
      finally {
        setLoading(false); // Stop loading when data fetching completes
      }
    }
  
    fetchShipments();
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
      const response = await apiClient.post(CREATE_SHIPMENT, formData);

      console.log("shipment created", response)
      
      // Assuming the response contains the created shipment
      const newShipment = response.data.shipment; // Adjust based on your API response structure
  
      // Update the state to include the new shipment
      setShipments((prevShipments) => [...prevShipments, newShipment]);
  
      // Optionally close the modal or reset the form
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold">
            Create New Shipment
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter the details for the new shipment.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Client Selection */}

          <div className="space-y-1">
            <Label htmlFor="clientId" className="text-sm font-medium">
              Enter Shipment Name
            </Label>
            <Input
              id="shipmentName"
              placeholder="Enter Shipment Name"
              value={formData.shipmentName}
              onChange={handleInputChange}
              className="h-8"
            />
            {errors.shipmentName && (
              <p className="text-red-500 text-xs mt-1">{errors.shipmentName}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="clientId" className="text-sm font-medium">
              Select Available Client
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("clientId", parseInt(value, 10))
              }
            >
              <SelectTrigger id="clientId" className="h-8">
                <SelectValue placeholder="Select a client">
                  {formData.clientId
                    ? clients.find(
                        (client) => client.clientId === formData.clientId
                      )?.clientName
                    : "Select a client"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clients.map((prop) => (
                  <SelectItem key={prop.clientId} value={prop.clientId}>
                    {prop.clientName} (ID: {prop.clientId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>
            )}
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pickupLocation" className="text-sm font-medium">
                Pickup Location
              </Label>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pickupLocation}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="deliveryLocation" className="text-sm font-medium">
                Delivery Location
              </Label>
              <Input
                id="deliveryLocation"
                placeholder="Enter delivery location"
                value={formData.deliveryLocation}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.deliveryLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.deliveryLocation}
                </p>
              )}
            </div>
          </div>

          {/* Cargo and Driver Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="cargoWeight" className="text-sm font-medium">
                Cargo Weight (kg)
              </Label>
              <Input
                id="cargoWeight"
                type="number"
                value={formData.cargoWeight}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.cargoWeight && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cargoWeight}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="driverId" className="text-sm font-medium">
                Select Available Driver
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("driverId", parseInt(value, 10))
                }
              >
                <SelectTrigger id="driverId" className="h-8">
                  <SelectValue placeholder="Select a Driver">
                    {formData.driverId
                      ? drivers.find(
                          (driver) => driver.driverId === formData.driverId
                        )?.name
                      : "Select a Driver"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.driverId} value={driver.driverId}>
                      {driver.name} (ID: {driver.driverId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverId && (
                <p className="text-red-500 text-xs mt-1">{errors.driverId}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="departureDate" className="text-sm font-medium">
                Date of Dispatch
              </Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.departureDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.departureDate}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="arrivalDate" className="text-sm font-medium">
                Date of Arrival
              </Label>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.arrivalDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.arrivalDate}
                </p>
              )}
            </div>
          </div>

          {/* Truck and Cargo Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="truckId" className="text-sm font-medium">
                Select Available Truck
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("truckId", parseInt(value, 10))
                }
              >
                <SelectTrigger id="truckId" className="h-8">
                  <SelectValue placeholder="Select a Truck">
                    {formData.truckId
                      ? trucks.find(
                          (truck) => truck.truckId === formData.truckId
                        )?.model
                      : "Select a Truck"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.truckId} value={truck.truckId}>
                      {truck.model} (ID: {truck.truckId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.truckId && (
                <p className="text-red-500 text-xs mt-1">{errors.truckId}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cargoType" className="text-sm font-medium">
                Cargo Type
              </Label>
              <Input
                id="cargoType"
                placeholder="Enter cargo type"
                value={formData.cargoType}
                onChange={handleInputChange}
                className="h-8"
              />
              {errors.cargoType && (
                <p className="text-red-500 text-xs mt-1">{errors.cargoType}</p>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1">
            <Label
              htmlFor="specialInstructions"
              className="text-sm font-medium"
            >
              Special Instructions
            </Label>
            <Input
              id="specialInstructions"
              placeholder="Enter special instructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              className="h-8"
            />
            {errors.specialInstructions && (
              <p className="text-red-500 text-xs mt-1">
                {errors.specialInstructions}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create Shipment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
