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
import { getCarBrands, getCarModels, getCarVariants } from "@/app/services/api/carDataService"
import listingService from "@/app/services/api/listingService"
import { toast } from "sonner"
import { 
  Car, 
  FileText, 
  Settings, 
  Image as ImageIcon, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  DollarSign,
  Gauge,
  Calendar,
  Palette,
  Zap
} from "lucide-react"

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"]
const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
const bodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Wagon", "Pickup", "Van"]

const carFeatures = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "ABS",
  "Airbags",
  "Alloy Wheels",
  "Fog Lights",
  "Music System",
  "Central Locking",
  "Sunroof",
  "Leather Seats",
  "GPS Navigation",
  "Bluetooth",
  "Parking Sensors",
  "Backup Camera",
]

const STEPS = [
  { id: 1, title: "Basic Info", icon: Car, description: "Brand, Model & Variant" },
  { id: 2, title: "Details", icon: FileText, description: "Price & Location" },
  { id: 3, title: "Specifications", icon: Settings, description: "Technical Details" },
  { id: 4, title: "Features", icon: Zap, description: "Car Features" },
  { id: 5, title: "Images", icon: ImageIcon, description: "Upload Photos" },
]

export default function CarForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [brands, setBrands] = useState({ featured: [], all: [] })
  const [models, setModels] = useState([])
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState({ brands: false, models: false, variants: false })
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  
  const [formData, setFormData] = useState({
    brandId: "",
    modelId: "",
    variantId: "",
    year: "",
    registrationYear: "",
    price: "",
    priceNegotiable: false,
    mileageKm: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    color: "",
    engineCapacityCc: "",
    powerBhp: "",
    seats: "",
    ownersCount: "",
    condition: "used",
    registrationNumber: "",
    stateId: 1,
    cityId: 1,
    locality: "",
    address: "",
    title: "",
    description: "",
    features: [],
    images: [],
  })

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    setLoading((prev) => ({ ...prev, brands: true }))
    try {
      const response = await getCarBrands()
      if (response.success) {
        setBrands(response.data)
      }
    } catch (error) {
      console.error("Failed to load brands:", error)
    } finally {
      setLoading((prev) => ({ ...prev, brands: false }))
    }
  }

  const loadModels = async (brandId) => {
    setLoading((prev) => ({ ...prev, models: true }))
    setModels([])
    try {
      const response = await getCarModels(brandId)
      if (response.success) {
        setModels(response.data)
      }
    } catch (error) {
      console.error("Failed to load models:", error)
    } finally {
      setLoading((prev) => ({ ...prev, models: false }))
    }
  }

  const loadVariants = async (modelId) => {
    setLoading((prev) => ({ ...prev, variants: true }))
    setVariants([])
    try {
      const response = await getCarVariants(modelId)
      if (response.success) {
        setVariants(response.data)
      }
    } catch (error) {
      console.error("Failed to load variants:", error)
    } finally {
      setLoading((prev) => ({ ...prev, variants: false }))
    }
  }

  const handleBrandChange = (brandId) => {
    setFormData((prev) => ({ ...prev, brandId, modelId: "", variantId: "" }))
    setModels([])
    setVariants([])
    if (brandId) {
      loadModels(brandId)
    }
  }

  const handleModelChange = (modelId) => {
    setFormData((prev) => ({ ...prev, modelId, variantId: "" }))
    setVariants([])
    if (modelId) {
      loadVariants(modelId)
    }
  }

  const handleVariantChange = (variantId) => {
    setFormData((prev) => ({ ...prev, variantId }))
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (feature, checked) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, feature] : prev.features.filter((f) => f !== feature),
    }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.brandId || !formData.modelId) {
          toast.error("Please select brand and model")
          return false
        }
        return true
      case 2:
        if (!formData.title || !formData.price || !formData.locality) {
          toast.error("Please fill in title, price, and locality")
          return false
        }
        return true
      case 3:
        if (!formData.fuelType || !formData.transmission || !formData.bodyType || !formData.year || !formData.mileageKm || !formData.ownersCount) {
          toast.error("Please fill in all required specifications")
          return false
        }
        return true
      case 4:
        return true
      case 5:
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
      
      if (!formData.brandId || !formData.modelId || !formData.title || !formData.price) {
        toast.error("Please fill in brand, model, title, and price")
        return
      }

      const listingData = {
        categoryId: 1,
        categoryType: "car",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId,
        cityId: formData.cityId,
        locality: formData.locality,
        address: formData.address,
        brandId: parseInt(formData.brandId),
        modelId: parseInt(formData.modelId),
        variantId: formData.variantId ? parseInt(formData.variantId) : null,
        year: parseInt(formData.year),
        registrationYear: formData.registrationYear ? parseInt(formData.registrationYear) : parseInt(formData.year),
        condition: formData.condition,
        mileageKm: parseInt(formData.mileageKm),
        ownersCount: parseInt(formData.ownersCount),
        fuelType: formData.fuelType.toLowerCase(),
        transmission: formData.transmission.toLowerCase(),
        bodyType: formData.bodyType.toLowerCase(),
        color: formData.color,
        engineCapacityCc: formData.engineCapacityCc ? parseInt(formData.engineCapacityCc) : null,
        powerBhp: formData.powerBhp ? parseInt(formData.powerBhp) : null,
        seats: formData.seats ? parseInt(formData.seats) : null,
        registrationNumber: formData.registrationNumber,
        features: formData.features,
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

      if (!formData.brandId || !formData.modelId || !formData.title || !formData.price) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.images.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      const listingData = {
        categoryId: 1,
        categoryType: "car",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        priceNegotiable: formData.priceNegotiable,
        stateId: formData.stateId,
        cityId: formData.cityId,
        locality: formData.locality,
        address: formData.address,
        brandId: parseInt(formData.brandId),
        modelId: parseInt(formData.modelId),
        variantId: formData.variantId ? parseInt(formData.variantId) : null,
        year: parseInt(formData.year),
        registrationYear: formData.registrationYear ? parseInt(formData.registrationYear) : parseInt(formData.year),
        condition: formData.condition,
        mileageKm: parseInt(formData.mileageKm),
        ownersCount: parseInt(formData.ownersCount),
        fuelType: formData.fuelType.toLowerCase(),
        transmission: formData.transmission.toLowerCase(),
        bodyType: formData.bodyType.toLowerCase(),
        color: formData.color,
        engineCapacityCc: formData.engineCapacityCc ? parseInt(formData.engineCapacityCc) : null,
        powerBhp: formData.powerBhp ? parseInt(formData.powerBhp) : null,
        seats: formData.seats ? parseInt(formData.seats) : null,
        registrationNumber: formData.registrationNumber,
        features: formData.features,
      }

      const createResponse = await listingService.createListing(listingData)
      
      if (!createResponse.success) {
        throw new Error(createResponse.message || "Failed to create listing")
      }

      const listingId = createResponse.data.id

      const mediaFormData = new FormData()
      formData.images.forEach((file) => {
        mediaFormData.append("media", file)
      })

      await listingService.uploadMedia(listingId, mediaFormData)
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
              {STEPS.map((step, index) => {
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
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Select your car's brand, model, and variant</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    Car Brand *
                  </Label>
                  <Select value={formData.brandId} onValueChange={handleBrandChange} disabled={loading.brands}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={loading.brands ? "Loading brands..." : "Select car brand"} />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.featured.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-semibold text-primary">Featured Brands</div>
                          {brands.featured.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                          <div className="my-1 h-px bg-border" />
                        </>
                      )}
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">All Brands</div>
                      {brands.all.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    Car Model *
                  </Label>
                  <Select
                    value={formData.modelId}
                    onValueChange={handleModelChange}
                    disabled={!formData.brandId || loading.models}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue 
                        placeholder={
                          loading.models 
                            ? "Loading models..." 
                            : !formData.brandId 
                            ? "Select brand first" 
                            : "Select car model"
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="variant" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Car Variant
                  </Label>
                  <Select
                    value={formData.variantId}
                    onValueChange={handleVariantChange}
                    disabled={!formData.modelId || loading.variants}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue 
                        placeholder={
                          loading.variants 
                            ? "Loading variants..." 
                            : !formData.modelId 
                            ? "Select model first" 
                            : "Select car variant (optional)"
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id.toString()}>
                          {variant.variantName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Condition *
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Manufacturing Year *
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    min="1990"
                    max="2025"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Listing Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add title, price, and location information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Listing Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Toyota Camry 2020 - Excellent Condition"
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
                    className="h-11"
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
                <div className="space-y-2">
                  <Label htmlFor="locality" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Locality *
                  </Label>
                  <Input
                    id="locality"
                    placeholder="e.g., Andheri West"
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
                  placeholder="Describe your car's condition, any modifications, service history, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Specifications */}
        {currentStep === 3 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Vehicle Specifications</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Technical details and specifications</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Fuel Type *
                  </Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Transmission *
                  </Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((trans) => (
                        <SelectItem key={trans} value={trans}>
                          {trans}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyType" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    Body Type *
                  </Label>
                  <Select value={formData.bodyType} onValueChange={(value) => handleInputChange("bodyType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyTypes.map((body) => (
                        <SelectItem key={body} value={body}>
                          {body}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    Color
                  </Label>
                  <Input
                    id="color"
                    placeholder="e.g., Red, Blue, White"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileageKm" className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    Mileage (km) *
                  </Label>
                  <Input
                    id="mileageKm"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.mileageKm}
                    onChange={(e) => handleInputChange("mileageKm", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownersCount" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Number of Owners *
                  </Label>
                  <Select value={formData.ownersCount} onValueChange={(value) => handleInputChange("ownersCount", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select owners" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Owner</SelectItem>
                      <SelectItem value="2">2nd Owner</SelectItem>
                      <SelectItem value="3">3rd Owner</SelectItem>
                      <SelectItem value="4">4+ Owners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationYear" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Registration Year
                  </Label>
                  <Input
                    id="registrationYear"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.registrationYear}
                    onChange={(e) => handleInputChange("registrationYear", e.target.value)}
                    min="1990"
                    max="2025"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    placeholder="e.g., MH01AB1234"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engineCapacityCc" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Engine Capacity (CC)
                  </Label>
                  <Input
                    id="engineCapacityCc"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.engineCapacityCc}
                    onChange={(e) => handleInputChange("engineCapacityCc", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="powerBhp" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Power (BHP)
                  </Label>
                  <Input
                    id="powerBhp"
                    type="number"
                    placeholder="e.g., 180"
                    value={formData.powerBhp}
                    onChange={(e) => handleInputChange("powerBhp", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    Number of Seats
                  </Label>
                  <Input
                    id="seats"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                    min="2"
                    max="20"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Features */}
        {currentStep === 4 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Car Features</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Select all features available in your car</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carFeatures.map((feature) => (
                  <div
                    key={feature}
                    className={`
                      flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${formData.features.includes(feature) 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                    onClick={() => handleFeatureChange(feature, !formData.features.includes(feature))}
                  >
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked)}
                    />
                    <Label htmlFor={feature} className="text-sm cursor-pointer flex-1">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.features.length > 0 && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-2">
                    Selected Features ({formData.features.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-primary/10 text-primary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 5: Images */}
        {currentStep === 5 && (
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Upload Car Images</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Add high-quality photos of your car</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Car Images *
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
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-primary">
                            Cover Photo
                          </Badge>
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

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={submitting || savingDraft}
            className="flex items-center gap-2"
          >
            {savingDraft ? "Saving..." : "Save as Draft"}
          </Button>

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
