"use client"

import { useState } from "react"
import {
  ChevronDown,
  MapPin,
  Search,
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { updateLocation, getLocationDisplayName } = useLocation()
  const router = useRouter()
  const pathname = usePathname()

  const handleSellClick = () => {
    if (!isAuthenticated) {
      // Only navigate if not already on sign-in page
      if (pathname !== "/sign-in") {
        router.push("/sign-in")
      }
    } else {
      // Only navigate if not already on post page
      if (pathname !== "/post") {
        router.push("/post")
      }
    }
  }


  const categories = [
    "Cars",
    "Property",
  ]


  const mainCategories = [
    "Sedans ",
    "SUVs",
    "Hatchbacks ",
    "Luxury ",
    "Electric Cars ",
    "Certified Cars",
    
    "Other",
  ]
  return (
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


                {/* Search Input */}
                <div className="flex flex-1">
                  <input
                    type="text"
                    placeholder="Find your dream car..."
                    className="w-full px-4 py-2 border rounded-l-md shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {/* Search Button */}
                  <button className="px-6 py-2 bg-primary text-white rounded-r-md hover:bg-cyan-600 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {/* Add Location - Hidden on mobile */}

              {/* Auth Links - Hidden on mobile */}

              <div className="hidden md:flex">
                {!isAuthenticated ? (
                  <Link href="/sign-in" className="hidden md:flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-gray-900 font-bold">Sign In</button>
                  </Link>
                ) : (
                  <UserHeader />
                )}
              </div>

              {/* Right Side Navigation */}


              {/* Add Listing Button */}
              <button 
                onClick={handleSellClick}
                className="flex text-white bg-gradient-to-r from-blue-500 via-primary to-primary hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-md shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <PlusIcon className="h-4 w-4 mr-2 font-extrabold" />SELL
              </button>

              {/* Language Selector - Hidden on mobile */}
              {/* <div className="hidden lg:flex items-center space-x-1">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">en</span>
                <ChevronDown className="h-3 w-3 text-gray-600" />
              </div> */}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
               {/* Category Navigation */}
      {/* <div className="hidden lg:block border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 h-12 overflow-x-auto">
            {mainCategories.map((category) => (
              <button
                key={category}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap text-sm font-medium flex items-center"
              >
                {category}
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
            ))}
          </nav>
        </div>
      </div> */}
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
        
        {/* Mobile Search */}
        <div className="flex">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 text-sm py-2 border rounded-l-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-cyan-600">
            <Search className="h-4 w-4" />
          </button>
        </div>
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
            {/* <button className="block w-full text-left py-2 text-gray-600 hover:text-gray-900">Register</button> */}
            <button 
              onClick={handleSellClick}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-cyan-600 mt-2 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" /> SELL
            </button>
            {/* <div className="flex items-center py-2 text-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm">English</span>
            </div> */}
          </div>
        </div>
      )}

      {/* Category Navigation */}
      {/* <div className="hidden lg:block border-b border-gray-200 max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 h-12 overflow-x-auto">
            {mainCategories.map((category) => (
              <button
                key={category}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap text-sm font-medium flex items-center"
              >
                {category}
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
            ))}
          </nav>
        </div>
      </div> */}

      {/* Mobile Category Navigation */}
      {/* <div className="lg:hidden border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
            {mainCategories.map((category) => (
              <button
                key={category}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap text-sm font-medium py-2"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div> */}
    </header>
  )
}
