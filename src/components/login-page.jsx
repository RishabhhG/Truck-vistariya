// src/pages/Login.js
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../zustand/store";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.login); // Zustand login method
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password });

      // Logging to check response data
      console.log("Login successful:", response.data);

      // Set user in Zustand store
      setUser({
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        token: response.data.token,
        role: response.data.user.role,
      });

      // Store token in local storage

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative px-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute mx-auto left-[40%] -top-8 transform -translate-x-1/2 bg-[#28282B] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center z-20 shadow-lg"
        >
          <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-xl rounded-3xl overflow-hidden pt-16 md:pt-20 px-4 sm:px-6 md:px-8 lg:px-10 pb-4 md:pb-6 relative"
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-4 sm:mb-6">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-800 text-sm font-bold"
                ></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-gray-700/40 border border-gray-600 text-white placeholder-white focus:ring-2 focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-600 text-sm font-medium"
                ></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Log In
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
