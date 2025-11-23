"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import listingService from "@/app/services/api/listingService"
import { toast } from "sonner"

const propertyTypes = ["apartment", "house", "villa", "plot", "commercial", "office", "shop", "warehouse"]
const listingTypes = ["sale", "rent", "pg", "hostel"]
const furnishingTypes = ["fully-furnished", "semi-furnished", "unfurnished"]
const facingDirections = ["north", "south", "east", "west", "north-east", "north-west", "south-east", "south-west"]

export default function PropertyForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    listingType: "",
    price: "",
    priceNegotiable: false,
    areaSqft: "",
    carpetAreaSqft: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    furnished: "",
    floorNumber: "",
    totalFloors: "",
    ageYears: "",
    facing: "",
    parkingSpaces: "",
    stateId: 1, // Default - should be dynamic
    cityId: 1, // Default - should be dynamic
    locality: "",
    address: "",
    description: "",
    amenities: [],
    ownershipType: "freehold",
    reraApproved: false,
    reraId: "",
    images: [],
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenity, checked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true)
      
      // Validate required fields for draft
      if (!formData.propertyType || !formData.listingType || !formData.title || !formData.price) {
        toast.error("Please fill in property type, listing type, title, and price")
        return
      }

      const listingData = {
        categoryId: 2, // Property category
        categoryType: "property",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId,
        cityId: formData.cityId,
        locality: formData.locality,
        address: formData.address,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        balconies: formData.balconies ? parseInt(formData.balconies) : null,
        areaSqft: formData.areaSqft ? parseInt(formData.areaSqft) : null,
        carpetAreaSqft: formData.carpetAreaSqft ? parseInt(formData.carpetAreaSqft) : null,
        floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        ageYears: formData.ageYears ? parseInt(formData.ageYears) : null,
        facing: formData.facing,
        furnished: formData.furnished,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
        amenities: formData.amenities,
        ownershipType: formData.ownershipType,
        reraApproved: formData.reraApproved,
        reraId: formData.reraId,
      }

      const response = await listingService.createListing(listingData)
      
      if (response.success) {
        toast.success("Listing saved as draft")
        router.push("/profile/listings")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.error(error.message || "Failed to save draft")
    } finally {
      setSavingDraft(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)

      // Validate required fields
      if (!formData.propertyType || !formData.listingType || !formData.title || !formData.price) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.images.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      // Step 1: Create listing
      const listingData = {
        categoryId: 2, // Property category
        categoryType: "property",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId,
        cityId: formData.cityId,
        locality: formData.locality,
        address: formData.address,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        balconies: formData.balconies ? parseInt(formData.balconies) : null,
        areaSqft: formData.areaSqft ? parseInt(formData.areaSqft) : null,
        carpetAreaSqft: formData.carpetAreaSqft ? parseInt(formData.carpetAreaSqft) : null,
        floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        ageYears: formData.ageYears ? parseInt(formData.ageYears) : null,
        facing: formData.facing,
        furnished: formData.furnished,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
        amenities: formData.amenities,
        ownershipType: formData.ownershipType,
        reraApproved: formData.reraApproved,
        reraId: formData.reraId,
      }

      const createResponse = await listingService.createListing(listingData)
      
      if (!createResponse.success) {
        throw new Error(createResponse.message || "Failed to create listing")
      }

      const listingId = createResponse.data.id

      // Step 2: Upload media
      const mediaFormData = new FormData()
      formData.images.forEach((file) => {
        mediaFormData.append("media", file)
      })

      await listingService.uploadMedia(listingId, mediaFormData)

      // Step 3: Submit for approval
      await listingService.submitForApproval(listingId)

      toast.success("Listing submitted successfully! Awaiting admin approval.")
      router.push("/profile/listings")
    } catch (error) {
      console.error("Error submitting listing:", error)
      toast.error(error.message || "Failed to submit listing")
    } finally {
      setSubmitting(false)
    }
  }

  const propertyAmenities = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Security",
    "Lift",
    "Power Backup",
    "Garden",
    "Playground",
    "Club House",
    "Intercom",
    "Gas Pipeline",
    "Water Supply",
    "Maintenance Staff",
    "Visitor Parking",
    "CCTV",
    "Fire Safety",
    "Waste Disposal",
    "Internet/Wi-Fi",
    "Air Conditioning",
    "Modular Kitchen",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingType">Listing Type *</Label>
            <Select value={formData.listingType} onValueChange={(value) => handleInputChange("listingType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
              <SelectContent>
                {listingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "sale" ? "For Sale" : type === "rent" ? "For Rent" : type === "pg" ? "PG" : "Hostel"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 flex items-center space-x-2 pt-8">
            <Checkbox
              id="priceNegotiable"
              checked={formData.priceNegotiable}
              onCheckedChange={(checked) => handleInputChange("priceNegotiable", checked)}
            />
            <Label htmlFor="priceNegotiable" className="text-sm">
              Price Negotiable
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaSqft">Area (sq ft) *</Label>
            <Input
              id="areaSqft"
              type="number"
              placeholder="e.g., 1200"
              value={formData.areaSqft}
              onChange={(e) => handleInputChange("areaSqft", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carpetAreaSqft">Carpet Area (sq ft)</Label>
            <Input
              id="carpetAreaSqft"
              type="number"
              placeholder="e.g., 1000"
              value={formData.carpetAreaSqft}
              onChange={(e) => handleInputChange("carpetAreaSqft", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              placeholder="e.g., 3"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange("bedrooms", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              placeholder="e.g., 2"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange("bathrooms", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balconies">Balconies</Label>
            <Input
              id="balconies"
              type="number"
              placeholder="e.g., 2"
              value={formData.balconies}
              onChange={(e) => handleInputChange("balconies", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="furnished">Furnishing Status</Label>
            <Select value={formData.furnished} onValueChange={(value) => handleInputChange("furnished", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select furnishing" />
              </SelectTrigger>
              <SelectContent>
                {furnishingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="floorNumber">Floor Number</Label>
            <Input
              id="floorNumber"
              type="number"
              placeholder="e.g., 5"
              value={formData.floorNumber}
              onChange={(e) => handleInputChange("floorNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalFloors">Total Floors</Label>
            <Input
              id="totalFloors"
              type="number"
              placeholder="e.g., 10"
              value={formData.totalFloors}
              onChange={(e) => handleInputChange("totalFloors", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageYears">Property Age (years)</Label>
            <Input
              id="ageYears"
              type="number"
              placeholder="e.g., 3"
              value={formData.ageYears}
              onChange={(e) => handleInputChange("ageYears", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facing">Facing Direction</Label>
            <Select value={formData.facing} onValueChange={(value) => handleInputChange("facing", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select facing" />
              </SelectTrigger>
              <SelectContent>
                {facingDirections.map((direction) => (
                  <SelectItem key={direction} value={direction}>
                    {direction.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingSpaces">Parking Spaces</Label>
            <Input
              id="parkingSpaces"
              type="number"
              placeholder="e.g., 1"
              value={formData.parkingSpaces}
              onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipType">Ownership Type</Label>
            <Select value={formData.ownershipType} onValueChange={(value) => handleInputChange("ownershipType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehold">Freehold</SelectItem>
                <SelectItem value="leasehold">Leasehold</SelectItem>
                <SelectItem value="cooperative">Cooperative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-center space-x-2 pt-8">
            <Checkbox
              id="reraApproved"
              checked={formData.reraApproved}
              onCheckedChange={(checked) => handleInputChange("reraApproved", checked)}
            />
            <Label htmlFor="reraApproved" className="text-sm">
              RERA Approved
            </Label>
          </div>

          {formData.reraApproved && (
            <div className="space-y-2">
              <Label htmlFor="reraId">RERA ID</Label>
              <Input
                id="reraId"
                placeholder="e.g., P51800012345"
                value={formData.reraId}
                onChange={(e) => handleInputChange("reraId", e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="locality">Locality *</Label>
            <Input
              id="locality"
              placeholder="e.g., Bandra West"
              value={formData.locality}
              onChange={(e) => handleInputChange("locality", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {propertyAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked)}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property, nearby landmarks, transportation, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="images">Property Images *</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {/* Preview uploaded images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={submitting || savingDraft}>
          {submitting ? "Submitting..." : "Submit for Approval"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={handleSaveDraft}
          disabled={submitting || savingDraft}
        >
          {savingDraft ? "Saving..." : "Save as Draft"}
        </Button>
      </div>
    </form>
  )
}
