"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Car, Home, Building2, Store, Warehouse } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CategoryNav() {
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAllCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategoryClick = (category, filters = {}) => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()
    const url = `/browse?category=${category}${queryString ? '&' + queryString : ''}`
    
    router.push(url)
    setIsAllCategoriesOpen(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative">
      <div className="container px-4 max-w-7xl mx-auto">
        <nav className="flex items-center h-12 space-x-1 overflow-x-auto scrollbar-hide">
          {/* All Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors whitespace-nowrap"
            >
              All Categories
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isAllCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-2" />

          {/* Cars */}
          <button
            onClick={() => handleCategoryClick('cars')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors whitespace-nowrap"
          >
            <Car className="h-4 w-4 mr-2" />
            Cars
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-2" />

          {/* For Rent: Houses and Apartments */}
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'rent',
              propertyType: 'apartment,house'
            })}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors whitespace-nowrap"
          >
            <Home className="h-4 w-4 mr-2" />
            For Rent: Houses & Apartments
          </button>

          {/* For Sale: Houses and Apartments */}
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'sale',
              propertyType: 'apartment,house'
            })}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors whitespace-nowrap"
          >
            <Building2 className="h-4 w-4 mr-2" />
            For Sale: Houses & Apartments
          </button>

          {/* For Rent: Shops and Warehouses */}
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'rent',
              propertyType: 'shop,warehouse'
            })}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors whitespace-nowrap"
          >
            <Store className="h-4 w-4 mr-2" />
            For Rent: Shops & Warehouses
          </button>
        </nav>
      </div>

      {/* Mobile Version - Horizontal Scroll */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleCategoryClick('cars')}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap"
          >
            <Car className="h-3 w-3 mr-1.5" />
            Cars
          </button>
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'rent',
              propertyType: 'apartment,house'
            })}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap"
          >
            <Home className="h-3 w-3 mr-1.5" />
            Rent: Houses
          </button>
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'sale',
              propertyType: 'apartment,house'
            })}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap"
          >
            <Building2 className="h-3 w-3 mr-1.5" />
            Sale: Houses
          </button>
          <button
            onClick={() => handleCategoryClick('properties', { 
              listingType: 'rent',
              propertyType: 'shop,warehouse'
            })}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap"
          >
            <Store className="h-3 w-3 mr-1.5" />
            Rent: Shops
          </button>
        </div>
      </div>

      {/* Dropdown Menu - Positioned outside overflow container with high z-index */}
      {isAllCategoriesOpen && (
        <div className="absolute top-12 left-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
          <div className="py-2">
            <button
              onClick={() => {
                console.log("Cars clicked from dropdown")
                handleCategoryClick('cars')
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <Car className="h-4 w-4 mr-3 text-primary" />
              Cars
            </button>
            <button
              onClick={() => {
                console.log("Properties clicked from dropdown")
                handleCategoryClick('properties')
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4 mr-3 text-primary" />
              Properties
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
