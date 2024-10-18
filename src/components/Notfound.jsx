import { Button } from "@/components/ui/button";
import { Truck, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-900 text-white rounded-full p-3">
            <Truck className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">
          404 - Resource Not Found
        </h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600 mb-6">
            The requested resource is not available in the system.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="relative">
              <Truck className="w-16 h-16 text-gray-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <MapPin className="w-16 h-16 text-gray-400" />
          </div>
          <Button
            asChild
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>TransportCorp Management System</p>
          <p>Optimizing fleet operations and logistics</p>
        </div>
      </div>
    </div>
  );
}
