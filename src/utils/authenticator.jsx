/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";
import useAuthStore from "../zustand/store";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log("Is authenticated (PrivateRoute):", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log("Is authenticated (PublicRoute):", isAuthenticated);

  return isAuthenticated ? <Navigate to="/" /> : children;
};

const AdminRoute = ({ children }) => {
  const userRole = useAuthStore((state) => state.user?.role);

  console.log("User role (AdminRoute):", userRole);

  return userRole === "admin" ? children : <Navigate to="/login" />;
};
export { PrivateRoute, PublicRoute, AdminRoute };
