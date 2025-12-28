"use client"

import { useState } from "react"
import {
  Menu,
  PlusIcon,
  X
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import UserHeader from "./user-header/page"
import { useAuth } from "@/app/context/AuthContext"
import { useLocation } from "@/app/context/LocationContext"
import LocationButton from "./LocationButton"
import LocationSelector from "./LocationSelector"
import CategoryNav from "./CategoryNav"
import SearchBar from "./SearchBar"
import MobileSearchBar from "./MobileSearchBar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { updateLocation, getLocationDisplayName } = useLocation()
  const router = useRouter()
  const pathname = usePathname()

  const handleSellClick = () => {
    if (!isAuthenticated) {
      if (pathname !== "/sign-in") {
        router.push("/sign-in")
      }
    } else {
      if (pathname !== "/post") {
        router.push("/post")
      }
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm ">
      {/* Top Header */}
      <div className="border-b border-gray-200 ">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">eC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">eClassify</h1>
                <p className="text-xs text-gray-500 -mt-1">Buy & Sell Anything</p>
              </div>
            </Link>
            <LocationButton 
              className="hidden lg:flex ml-4"
              onLocationReceived={(location) => {
                console.log('Location received:', location);
                updateLocation({
                  type: 'current',
                  name: 'Current Location',
                  coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                  }
                });
              }}
            />

            {/* Location Selector & Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 w-xl justify-center mx-8 ">
              <div className="flex w-full items-center space-x-3">
                {/* Location Selector */}
                <LocationSelector 
                  onLocationSelect={(location) => {
                    console.log('Selected location:', location);
                    updateLocation(location);
                  }}
                  placeholder={getLocationDisplayName()}
                />

                {/* Search Bar with History */}
                <SearchBar placeholder="Find your dream car..." />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex">
                {!isAuthenticated ? (
                  <Link href="/sign-in" className="hidden md:flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-gray-900 font-bold">Sign In</button>
                  </Link>
                ) : (
                  <UserHeader />
                )}
              </div>

              {/* Add Listing Button */}
              <button 
                onClick={handleSellClick}
                className="flex text-white bg-gradient-to-r from-blue-500 via-primary to-primary hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-md shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <PlusIcon className="h-4 w-4 mr-2 font-extrabold" />SELL
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-b border-gray-200 p-4 space-y-3">
        {/* Mobile Location Selector */}
        <LocationSelector 
          onLocationSelect={(location) => {
            console.log('Selected location:', location);
            updateLocation(location);
          }}
          placeholder={getLocationDisplayName()}
          className="w-full"
        />
        
        {/* Mobile Search with History */}
        <MobileSearchBar placeholder="Search..." />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-2">
            <LocationButton 
              className="w-full justify-start py-2"
              onLocationReceived={(location) => {
                console.log('Location received:', location);
                updateLocation({
                  type: 'current',
                  name: 'Current Location',
                  coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                  }
                });
              }}
            />

            {!isAuthenticated ? (
              <Link href="/sign-in" className="block w-full text-left py-2 text-gray-600 hover:text-gray-900">
                <button className="w-full text-left">Sign In</button>
              </Link>
            ) : (
              <UserHeader />
            )}
            <button 
              onClick={handleSellClick}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-cyan-600 mt-2 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" /> SELL
            </button>
          </div>
        </div>
      )}
    </header>

    {/* Category Navigation Bar */}
    <CategoryNav />
    </>
  )
}
