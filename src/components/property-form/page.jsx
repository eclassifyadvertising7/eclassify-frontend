"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StateSelect } from "@/components/ui/state-select"
import { CitySelect } from "@/components/ui/city-select"
import listingService from "@/app/services/api/listingService"
import { toast } from "sonner"
import { 
  Home, 
  FileText, 
  Settings, 
  Image as ImageIcon, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  DollarSign,
  Maximize,
  Bed,
  Bath,
  Zap
} from "lucide-react"

const propertyTypes = ["apartment", "house", "villa", "plot", "commercial", "office", "shop", "warehouse"]
const listingTypes = ["sale", "rent", "pg", "hostel"]
const furnishingTypes = ["fully-furnished", "semi-furnished", "unfurnished"]
const facingDirections = ["north", "south", "east", "west", "north-east", "north-west", "south-east", "south-west"]

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

const STEPS = [
  { id: 1, title: "Basic Details", icon: Home, description: "Property Info & Location" },
  { id: 2, title: "Specifications", icon: Settings, description: "Property Specs" },
  { id: 3, title: "Amenities", icon: Zap, description: "Features & Amenities" },
  { id: 4, title: "Images", icon: ImageIcon, description: "Upload Photos" },
]

export default function PropertyForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
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
    stateId: "",
    cityId: "",
    locality: "",
    address: "",
    description: "",
    amenities: [],
    ownershipType: "freehold",
    reraApproved: false,
    reraId: "",
    images: [],
    coverPhotoIndex: 0,
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
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      let newCoverPhotoIndex = prev.coverPhotoIndex
      
      if (index === prev.coverPhotoIndex) {
        newCoverPhotoIndex = 0
      } else if (index < prev.coverPhotoIndex) {
        newCoverPhotoIndex = prev.coverPhotoIndex - 1
      }
      
      return {
        ...prev,
        images: newImages,
        coverPhotoIndex: newImages.length > 0 ? newCoverPhotoIndex : 0,
      }
    })
  }

  const handleSetCoverPhoto = (index) => {
    setFormData((prev) => ({ ...prev, coverPhotoIndex: index }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.propertyType || !formData.listingType || !formData.title || !formData.price || !formData.stateId || !formData.cityId || !formData.locality) {
          toast.error("Please fill in all required fields")
          return false
        }
        return true
      case 2:
        if (!formData.areaSqft) {
          toast.error("Please fill in area")
          return false
        }
        return true
      case 3:
        return true
      case 4:
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true)
      
      if (!formData.propertyType || !formData.listingType || !formData.title || !formData.price) {
        toast.error("Please fill in property type, listing type, title, and price")
        return
      }

      const listingData = {
        categoryId: 2,
        categoryType: "property",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId ? parseInt(formData.stateId) : null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
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
        router.push("/my-listings")
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

      if (!formData.propertyType || !formData.listingType || !formData.title || !formData.price) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.images.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      const listingData = {
        categoryId: 2,
        categoryType: "property",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId ? parseInt(formData.stateId) : null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
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

      const mediaFormData = new FormData()
      formData.images.forEach((file, index) => {
        mediaFormData.append("media", file)
        if (index === formData.coverPhotoIndex) {
          mediaFormData.append("is_primary", index)
        }
      })

      await listingService.uploadMedia(listingId, mediaFormData)
      await listingService.submitForApproval(listingId)

      toast.success("Listing submitted successfully! Awaiting admin approval.")
      router.push("/my-listings")
    } catch (error) {
      console.error("Error submitting listing:", error)
      toast.error(error.message || "Failed to submit listing")
    } finally {
      setSubmitting(false)
    }
  }

  const progressPercentage = (currentStep / STEPS.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Step {currentStep} of {STEPS.length}</h3>
                <p className="text-sm text-muted-foreground">{STEPS[currentStep - 1].description}</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between gap-2">
              {STEPS.map((step) => {
                const StepIcon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${isCompleted ? "bg-primary text-white" : ""}
                        ${isCurrent ? "bg-primary text-white ring-4 ring-primary/20" : ""}
                        ${!isCompleted && !isCurrent ? "bg-muted text-muted-foreground" : ""}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center hidden md:block ${isCurrent ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Basic Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Property information and location</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="listingType" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Listing Type *
                  </Label>
                  <Select value={formData.listingType} onValueChange={(value) => handleInputChange("listingType", value)}>
                    <SelectTrigger className="h-11">
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
                  <Label htmlFor="propertyType" className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Property Type *
                  </Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                    <SelectTrigger className="h-11">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Listing Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-11">
                    <Checkbox
                      id="priceNegotiable"
                      checked={formData.priceNegotiable}
                      onCheckedChange={(checked) => handleInputChange("priceNegotiable", checked)}
                    />
                    <Label htmlFor="priceNegotiable" className="text-sm cursor-pointer">
                      Price Negotiable
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StateSelect
                  value={formData.stateId}
                  onChange={(stateId) => {
                    handleInputChange("stateId", stateId)
                    handleInputChange("cityId", "")
                  }}
                  required
                  className="w-full"
                />

                <CitySelect
                  stateId={formData.stateId}
                  value={formData.cityId}
                  onChange={(cityId) => handleInputChange("cityId", cityId)}
                  required
                  className="w-full"
                />

                <div className="space-y-2">
                  <Label htmlFor="locality" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Locality *
                  </Label>
                  <Input
                    id="locality"
                    placeholder="e.g., Bandra West"
                    value={formData.locality}
                    onChange={(e) => handleInputChange("locality", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Full Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, nearby landmarks, transportation, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ownershipType" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Ownership Type
                  </Label>
                  <Select value={formData.ownershipType} onValueChange={(value) => handleInputChange("ownershipType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freehold">Freehold</SelectItem>
                      <SelectItem value="leasehold">Leasehold</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2 h-11">
                    <Checkbox
                      id="reraApproved"
                      checked={formData.reraApproved}
                      onCheckedChange={(checked) => handleInputChange("reraApproved", checked)}
                    />
                    <Label htmlFor="reraApproved" className="text-sm cursor-pointer">
                      RERA Approved
                    </Label>
                  </div>
                </div>

                {formData.reraApproved && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="reraId" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      RERA ID
                    </Label>
                    <Input
                      id="reraId"
                      placeholder="e.g., P51800012345"
                      value={formData.reraId}
                      onChange={(e) => handleInputChange("reraId", e.target.value)}
                      className="h-11"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Specifications */}
        {currentStep === 2 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Property Specifications</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Property details and specifications</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="areaSqft" className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" />
                    Area (sq ft) *
                  </Label>
                  <Input
                    id="areaSqft"
                    type="number"
                    placeholder="e.g., 1200"
                    value={formData.areaSqft}
                    onChange={(e) => handleInputChange("areaSqft", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carpetAreaSqft" className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" />
                    Carpet Area (sq ft)
                  </Label>
                  <Input
                    id="carpetAreaSqft"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.carpetAreaSqft}
                    onChange={(e) => handleInputChange("carpetAreaSqft", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-primary" />
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-primary" />
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balconies" className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Balconies
                  </Label>
                  <Input
                    id="balconies"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.balconies}
                    onChange={(e) => handleInputChange("balconies", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnished" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Furnishing Status
                  </Label>
                  <Select value={formData.furnished} onValueChange={(value) => handleInputChange("furnished", value)}>
                    <SelectTrigger className="h-11">
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
                  <Label htmlFor="floorNumber" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Floor Number
                  </Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.floorNumber}
                    onChange={(e) => handleInputChange("floorNumber", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalFloors" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Total Floors
                  </Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.totalFloors}
                    onChange={(e) => handleInputChange("totalFloors", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageYears" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Property Age (years)
                  </Label>
                  <Input
                    id="ageYears"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.ageYears}
                    onChange={(e) => handleInputChange("ageYears", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facing" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Facing Direction
                  </Label>
                  <Select value={formData.facing} onValueChange={(value) => handleInputChange("facing", value)}>
                    <SelectTrigger className="h-11">
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
                  <Label htmlFor="parkingSpaces" className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Parking Spaces
                  </Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    placeholder="e.g., 1"
                    value={formData.parkingSpaces}
                    onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    className="h-11 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Amenities */}
        {currentStep === 3 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Property Amenities</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Select all amenities available in your property</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${formData.amenities.includes(amenity) 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked)}
                    />
                    <Label htmlFor={amenity} className="text-sm cursor-pointer flex-1">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.amenities.length > 0 && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-2">
                    Selected Amenities ({formData.amenities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="bg-primary/10 text-primary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Images */}
        {currentStep === 4 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Upload Property Images</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add high-quality photos of your property</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Property Images *
                </Label>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-primary">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">
                        Upload multiple images (JPG, PNG, WEBP)
                      </p>
                    </div>
                  </Label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Uploaded Images ({formData.images.length})
                    </Label>
                    <Badge variant="outline" className="text-primary border-primary">
                      {formData.images.length} {formData.images.length === 1 ? "image" : "images"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          index === formData.coverPhotoIndex ? "border-primary ring-2 ring-primary/20" : "border-border"
                        }`}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-10"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {index === formData.coverPhotoIndex ? (
                          <Badge className="absolute bottom-2 left-2 bg-primary">
                            Cover Photo
                          </Badge>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverPhoto(index)}
                            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Badge variant="outline" className="bg-white/90 hover:bg-primary hover:text-white cursor-pointer">
                              Set as Cover
                            </Badge>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep >= 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={submitting || savingDraft}
              className="flex items-center gap-2 mx-auto"
            >
              {savingDraft ? "Saving..." : "Save as Draft"}
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitting || savingDraft}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              {submitting ? "Submitting..." : "Submit for Approval"}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
