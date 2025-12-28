"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import CarEditForm from "@/components/car-form/edit"
import PropertyEditForm from "@/components/property-form/edit"
import { listingService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to edit listings")
      router.push("/sign-in")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchListing()
    }
  }, [isAuthenticated, params.id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const response = await listingService.getMyListingById(params.id)
      
      if (response.success) {
        const listingData = response.data
        
        // Use categoryType from backend if available, otherwise detect from data structure
        if (!listingData.categoryType) {
          // Fallback: Determine category type from the data structure
          if (listingData.carListing) {
            listingData.categoryType = "car"
          } else if (listingData.propertyListing) {
            listingData.categoryType = "property"
          }
        }
        
        setListing(listingData)
      } else {
        throw new Error(response.message || "Failed to load listing")
      }
    } catch (error) {
      console.error("Error fetching listing:", error)
      toast.error("Failed to load listing for editing")
      router.push("/my-listings")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/my-listings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Listings
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-primary">Edit Your Listing</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {listing.categoryType === "car" && <CarEditForm listing={listing} />}
          {listing.categoryType === "property" && <PropertyEditForm listing={listing} />}
        </div>
      </main>
    </div>
  )
}
