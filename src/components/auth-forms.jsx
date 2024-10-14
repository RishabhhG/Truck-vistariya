'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Mail, ChevronRight, Eye, EyeOff } from "lucide-react"

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isLogin ? 'Login' : 'Signup', { email, password, name })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative px-4">
      {/* Apply a subtle blur to the background */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative z-10">
        {/* User Icon on top of the card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute mx-auto left-[40%] -top-8 transform -translate-x-1/2 bg-[#28282B] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center z-20 shadow-lg">
          <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/30 border border-white/20 shadow-xl rounded-3xl overflow-hidden pt-16 md:pt-20 px-4 sm:px-6 md:px-8 lg:px-10 pb-4 md:pb-6 relative">
          
          {/* Glass effect and form content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-4 sm:mb-6">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-600 text-sm font-medium"></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 md:w-5 md:h-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      className="pl-10 bg-gray-700/40 border border-gray-600 text-white placeholder-white focus:ring-2 focus:ring-indigo-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 text-sm font-bold"></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-gray-700/40 border border-gray-600 text-white placeholder-white focus:ring-2 focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-600 text-sm font-medium"></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black hover:bg-black text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </form>
          </div>
          
          {/* Switch between login and signup */}
          <div className="px-6 py-4 flex justify-between items-center border-t ">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="ghost"
              className="text-white hover:text-black hover:font-bold transition duration-300 ease-in-out">
              {isLogin ? 'Sign Up' : 'Log In'}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
