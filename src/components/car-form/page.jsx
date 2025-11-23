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
import { getCarBrands, getCarModels, getCarVariants } from "@/app/services/api/carDataService"
import listingService from "@/app/services/api/listingService"
import { toast } from "sonner"

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"]
const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
const bodyTypes = ["Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Wagon", "Pickup", "Van"]

export default function CarForm() {
  const router = useRouter()
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
    stateId: 1, // Default - should be dynamic
    cityId: 1, // Default - should be dynamic
    locality: "",
    address: "",
    title: "",
    description: "",
    features: [],
    images: [],
  })
  // Load brands on component mount
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

  // Handle multiple image upload
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

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true)
      
      // Validate required fields for draft
      if (!formData.brandId || !formData.modelId || !formData.title || !formData.price) {
        toast.error("Please fill in brand, model, title, and price")
        return
      }

      const listingData = {
        categoryId: 1, // Cars category
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

      // Validate required fields
      if (!formData.brandId || !formData.modelId || !formData.title || !formData.price) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.images.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      // Step 1: Create listing
      const listingData = {
        categoryId: 1, // Cars category
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Toyota Camry 2020 - Excellent Condition"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Car Brand *</Label>
            <Select value={formData.brandId} onValueChange={handleBrandChange} disabled={loading.brands}>
              <SelectTrigger>
                <SelectValue placeholder={loading.brands ? "Loading brands..." : "Select car brand"} />
              </SelectTrigger>
              <SelectContent>
                {brands.featured.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Featured Brands</div>
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
            <Label htmlFor="model">Car Model *</Label>
            <Select
              value={formData.modelId}
              onValueChange={handleModelChange}
              disabled={!formData.brandId || loading.models}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="variant">Car Variant *</Label>
            <Select
              value={formData.variantId}
              onValueChange={handleVariantChange}
              disabled={!formData.modelId || loading.variants}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    loading.variants 
                      ? "Loading variants..." 
                      : !formData.modelId 
                      ? "Select model first" 
                      : "Select car variant"
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
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g., 2020"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              min="1990"
              max="2024"
            />
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
            <Label htmlFor="mileageKm">Mileage (km) *</Label>
            <Input
              id="mileageKm"
              type="number"
              placeholder="e.g., 50000"
              value={formData.mileageKm}
              onChange={(e) => handleInputChange("mileageKm", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownersCount">Number of Owners *</Label>
            <Select value={formData.ownersCount} onValueChange={(value) => handleInputChange("ownersCount", value)}>
              <SelectTrigger>
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
            <Label htmlFor="condition">Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationYear">Registration Year</Label>
            <Input
              id="registrationYear"
              type="number"
              placeholder="e.g., 2020"
              value={formData.registrationYear}
              onChange={(e) => handleInputChange("registrationYear", e.target.value)}
              min="1990"
              max="2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locality">Locality *</Label>
            <Input
              id="locality"
              placeholder="e.g., Andheri West"
              value={formData.locality}
              onChange={(e) => handleInputChange("locality", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
              <SelectTrigger>
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
            <Label htmlFor="transmission">Transmission *</Label>
            <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
              <SelectTrigger>
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
            <Label htmlFor="bodyType">Body Type *</Label>
            <Select value={formData.bodyType} onValueChange={(value) => handleInputChange("bodyType", value)}>
              <SelectTrigger>
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
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              placeholder="e.g., Red, Blue, White"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="engineCapacityCc">Engine Capacity (CC)</Label>
            <Input
              id="engineCapacityCc"
              type="number"
              placeholder="e.g., 1500"
              value={formData.engineCapacityCc}
              onChange={(e) => handleInputChange("engineCapacityCc", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="powerBhp">Power (BHP)</Label>
            <Input
              id="powerBhp"
              type="number"
              placeholder="e.g., 180"
              value={formData.powerBhp}
              onChange={(e) => handleInputChange("powerBhp", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seats">Number of Seats</Label>
            <Input
              id="seats"
              type="number"
              placeholder="e.g., 5"
              value={formData.seats}
              onChange={(e) => handleInputChange("seats", e.target.value)}
              min="2"
              max="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              placeholder="e.g., MH01AB1234"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {carFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={formData.features.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked)}
                />
                <Label htmlFor={feature} className="text-sm">
                  {feature}
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
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Describe your car's condition, any modifications, service history, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Upload Car Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="images">Car Images *</Label>
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
