"use client"

import React, { useState } from 'react'
import {
  ChevronDown,
  Heart,
  MessageCircle,
  Bell,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  Star,
  HelpCircle,
  Settings,
  Download,
  LogOut,
  X
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

const UserHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Error logging out")
    }
  }
  return (
    <div>
      <div className="flex items-center space-x-4 ">
            {/* Language Selector */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium">
                  {language}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("ENGLISH")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ESPAÑOL")}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("FRANÇAIS")}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* Favorites */}
            <Button variant="ghost" className="relative">
              <Heart className="h-10 w-10 " />
            </Button>

            {/* Messages */}
            <Link href="/chats">
              <Button variant="ghost" className="relative">
                <MessageCircle className="h-10 w-10" />
                {/* <Badge className="absolute -top-1 text-[9px] right-1 h-4 w-4 rounded-full bg-blue-500 text-white  flex items-center justify-center p-0">
                  3
                </Badge> */}
              </Button>
            </Link>

            {/* Notifications */}
            <Button variant="ghost" className="relative">
              <Bell className="h-10 w-10" />
            </Button>

            {/* User Menu */}
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <div variant="ghost" className="flex items-center gap-2 p-2 bg-white cursor-pointer">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profile?.profilePhoto ? (
                      <img src={user.profile.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {user?.fullName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                {/* User Profile Section */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user?.profile?.profilePhoto ? (
                        <img src={user.profile.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                          {user?.fullName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user?.fullName || "User"}</h3>
                      <p className="text-xs text-gray-600">{user?.countryCode} {user?.mobile}</p>
                    </div>
                  </div>
                  <Link href="/profile">
                    <Button className="w-full bg-primary hover:bg-secondary text-white">View and edit profile</Button>
                  </Link>


                  {/* <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">2 steps left</span>
                    </div>
                    <Progress value={60} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600">
                      We are built on trust. Help one another to get to know each other better.
                    </p>
                  </div> */}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                    <Heart className="h-5 w-5" />
                    <span>My Favourites</span>
                  </DropdownMenuItem>

                  <Link href="/my-listings">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                      <FileText className="h-5 w-5" />
                      <span>My Listings</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/chats">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                      <MessageCircle className="h-5 w-5" />
                      <span>My Chats</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/billing">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                      <Package className="h-5 w-5" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <Link href="/request-data">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                      <HelpCircle className="h-5 w-5" />
                      <span>Request Data</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3">
                    <Download className="h-5 w-5" />
                    <span>Install App</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-4 py-3 text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    </div>
  )
}

export default UserHeader
