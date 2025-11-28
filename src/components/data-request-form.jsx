"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import dataRequestService from "@/app/services/api/dataRequestService"
import carDataService from "@/app/services/api/carDataService"
import commonService from "@/app/services/api/commonService"
import { Loader2 } from "lucide-react"

export default function DataRequestForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [requestType, setRequestType] = useState("")
  const [formData, setFormData] = useState({
    brandId: "",
    brandName: "",
    modelId: "",
    modelName: "",
    variantName: "",
    stateId: "",
    stateName: "",
    cityName: "",
    additionalDetails: "",
  })

  // Dropdown data
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [states, setStates] = useState([])
  const [loadingDropdown, setLoadingDropdown] = useState(false)

  // Load brands on mount
  useEffect(() => {
    loadBrands()
    loadStates()
  }, [])

  // Load models when brand is selected for model/variant request
  useEffect(() => {
    if (formData.brandId && (requestType === "model" || requestType === "variant")) {
      loadModels(formData.brandId)
    } else {
      setModels([])
      setFormData(prev => ({ ...prev, modelId: "", modelName: "" }))
    }
  }, [formData.brandId, requestType])

  const loadBrands = async () => {
    try {
      setLoadingDropdown(true)
      const response = await carDataService.getBrands()
      // Combine featured and all brands
      const allBrands = [...(response.data.featured || []), ...(response.data.all || [])]
      // Remove duplicates by id
      const uniqueBrands = allBrands.filter((brand, index, self) =>
        index === self.findIndex((b) => b.id === brand.id)
      )
      setBrands(uniqueBrands)
    } catch (error) {
      console.error("Failed to load brands:", error)
    } finally {
      setLoadingDropdown(false)
    }
  }

  const loadModels = async (brandId) => {
    try {
      setLoadingDropdown(true)
      const response = await carDataService.getModelsByBrand(brandId)
      setModels(response.data || [])
    } catch (error) {
      console.error("Failed to load models:", error)
      setModels([])
    } finally {
      setLoadingDropdown(false)
    }
  }

  const loadStates = async () => {
    try {
      const response = await commonService.getStates()
      setStates(response.data || [])
    } catch (error) {
      console.error("Failed to load states:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestData = { requestType }

      // Add relevant fields based on request type
      if (requestType === "brand") {
        requestData.brandName = formData.brandName
      } else if (requestType === "model") {
        requestData.brandName = formData.brandName
        requestData.modelName = formData.modelName
        requestData.variantName = formData.variantName
      } else if (requestType === "variant") {
        requestData.brandName = formData.brandName
        requestData.modelName = formData.modelName
        requestData.variantName = formData.variantName
      } else if (requestType === "city") {
        requestData.stateName = formData.stateName
        requestData.cityName = formData.cityName
      }

      if (formData.additionalDetails) {
        requestData.additionalDetails = formData.additionalDetails
      }

      await dataRequestService.createRequest(requestData)
      toast.success("Request submitted successfully! We'll review it soon.")
      
      // Reset form
      setFormData({
        brandId: "",
        brandName: "",
        modelId: "",
        modelName: "",
        variantName: "",
        stateId: "",
        stateName: "",
        cityName: "",
        additionalDetails: "",
      })
      setRequestType("")
      setModels([])
      
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error.message || "Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBrandSelect = (brandId) => {
    const selectedBrand = brands.find(b => b.id === parseInt(brandId))
    setFormData(prev => ({
      ...prev,
      brandId,
      brandName: selectedBrand?.name || "",
      modelId: "",
      modelName: ""
    }))
  }

  const handleModelSelect = (modelId) => {
    const selectedModel = models.find(m => m.id === parseInt(modelId))
    setFormData(prev => ({
      ...prev,
      modelId,
      modelName: selectedModel?.name || ""
    }))
  }

  const handleStateSelect = (stateId) => {
    const selectedState = states.find(s => s.id === parseInt(stateId))
    setFormData(prev => ({
      ...prev,
      stateId,
      stateName: selectedState?.name || ""
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requestType">Request Type *</Label>
        <Select value={requestType} onValueChange={setRequestType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brand">Car Brand</SelectItem>
            <SelectItem value="model">Car Model</SelectItem>
            <SelectItem value="variant">Car Variant</SelectItem>
            <SelectItem value="city">City</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car Brand Fields */}
      {requestType === "brand" && (
        <div>
          <Label htmlFor="brandName">Brand Name *</Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) => handleChange("brandName", e.target.value)}
            placeholder="e.g., Tesla"
            required
            minLength={2}
          />
        </div>
      )}

      {/* Car Model Fields */}
      {requestType === "model" && (
        <>
          <div>
            <Label htmlFor="brandId">Select Brand *</Label>
            <Select value={formData.brandId} onValueChange={handleBrandSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {loadingDropdown ? (
                  <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                ) : brands.length === 0 ? (
                  <SelectItem value="empty" disabled>No brands available</SelectItem>
                ) : (
                  brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="modelName">Model Name *</Label>
            <Input
              id="modelName"
              value={formData.modelName}
              onChange={(e) => handleChange("modelName", e.target.value)}
              placeholder="e.g., Model 3"
              required
              minLength={2}
            />
          </div>
          <div>
            <Label htmlFor="variantName">Variant Name *</Label>
            <Input
              id="variantName"
              value={formData.variantName}
              onChange={(e) => handleChange("variantName", e.target.value)}
              placeholder="e.g., Long Range AWD"
              required
              minLength={2}
            />
          </div>
        </>
      )}

      {/* Car Variant Fields */}
      {requestType === "variant" && (
        <>
          <div>
            <Label htmlFor="brandId">Select Brand *</Label>
            <Select value={formData.brandId} onValueChange={handleBrandSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {loadingDropdown ? (
                  <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                ) : brands.length === 0 ? (
                  <SelectItem value="empty" disabled>No brands available</SelectItem>
                ) : (
                  brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="modelId">Select Model *</Label>
            <Select 
              value={formData.modelId} 
              onValueChange={handleModelSelect} 
              required
              disabled={!formData.brandId}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.brandId ? "Select model" : "Select brand first"} />
              </SelectTrigger>
              <SelectContent>
                {loadingDropdown ? (
                  <SelectItem value="loading" disabled>Loading models...</SelectItem>
                ) : models.length === 0 ? (
                  <SelectItem value="empty" disabled>No models available</SelectItem>
                ) : (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="variantName">Variant Name *</Label>
            <Input
              id="variantName"
              value={formData.variantName}
              onChange={(e) => handleChange("variantName", e.target.value)}
              placeholder="e.g., Long Range AWD"
              required
              minLength={2}
            />
          </div>
        </>
      )}

      {/* City Fields */}
      {requestType === "city" && (
        <>
          <div>
            <Label htmlFor="stateId">Select State *</Label>
            <Select value={formData.stateId} onValueChange={handleStateSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.length === 0 ? (
                  <SelectItem value="empty" disabled>No states available</SelectItem>
                ) : (
                  states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cityName">City Name *</Label>
            <Input
              id="cityName"
              value={formData.cityName}
              onChange={(e) => handleChange("cityName", e.target.value)}
              placeholder="e.g., Panaji"
              required
              minLength={2}
            />
          </div>
        </>
      )}

      {/* Additional Details */}
      {requestType && (
        <div>
          <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
          <Textarea
            id="additionalDetails"
            value={formData.additionalDetails}
            onChange={(e) => handleChange("additionalDetails", e.target.value)}
            placeholder="Any additional information..."
            rows={3}
          />
        </div>
      )}

      <Button type="submit" disabled={loading || !requestType} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  )
}
