"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import dataRequestService from "@/app/services/api/dataRequestService"
import { Loader2, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DataRequestsManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({
    status: "pending",
    requestType: "",
    search: "",
    page: 1,
    limit: 20,
  })
  const [pagination, setPagination] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [approvalData, setApprovalData] = useState({})
  const [rejectionReason, setRejectionReason] = useState("")
  const [nestedModelData, setNestedModelData] = useState({})
  const [nestedVariantData, setNestedVariantData] = useState({})
  const [enableModelCreation, setEnableModelCreation] = useState(false)
  const [enableVariantCreation, setEnableVariantCreation] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchStatistics()
  }, [filters])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await dataRequestService.getAllRequests(filters)
      setRequests(response.data)
      setPagination(response.pagination)
    } catch (error) {
      toast.error("Failed to fetch requests")
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await dataRequestService.getStatistics()
      setStats(response.data)
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    setActionLoading(true)
    try {
      // Build the createData object with nested entities
      let createData = { ...approvalData }
      
      // Add nested model if enabled (for brand requests)
      if (selectedRequest.requestType === "brand" && enableModelCreation && nestedModelData.name) {
        createData.model = { ...nestedModelData }
        
        // Add nested variant if enabled (for brand->model requests)
        if (enableVariantCreation && nestedVariantData.variantName) {
          createData.model.variant = { ...nestedVariantData }
        }
      }
      
      // Add nested variant if enabled (for model requests)
      if (selectedRequest.requestType === "model" && enableVariantCreation && nestedVariantData.variantName) {
        createData.variant = { ...nestedVariantData }
      }

      await dataRequestService.approveRequest(selectedRequest.id, createData)
      
      // Show success message based on what was created
      let successMsg = "Request approved successfully!"
      if (enableModelCreation && enableVariantCreation) {
        successMsg = "Brand, model, and variant created successfully!"
      } else if (enableModelCreation) {
        successMsg = "Brand and model created successfully!"
      } else if (enableVariantCreation) {
        successMsg = selectedRequest.requestType === "brand" 
          ? "Brand and variant created successfully!" 
          : "Model and variant created successfully!"
      }
      
      toast.success(successMsg)
      setShowApproveDialog(false)
      resetApprovalForm()
      fetchRequests()
      fetchStatistics()
    } catch (error) {
      toast.error(error.message || "Failed to approve request")
    } finally {
      setActionLoading(false)
    }
  }

  const resetApprovalForm = () => {
    setApprovalData({})
    setNestedModelData({})
    setNestedVariantData({})
    setEnableModelCreation(false)
    setEnableVariantCreation(false)
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setActionLoading(true)
    try {
      await dataRequestService.rejectRequest(selectedRequest.id, rejectionReason)
      toast.success("Request rejected")
      setShowRejectDialog(false)
      setRejectionReason("")
      fetchRequests()
      fetchStatistics()
    } catch (error) {
      toast.error(error.message || "Failed to reject request")
    } finally {
      setActionLoading(false)
    }
  }

  const openApproveDialog = (request) => {
    setSelectedRequest(request)
    resetApprovalForm()
    
    // Pre-fill approval data based on request type
    const data = {}
    if (request.requestType === "brand") {
      data.name = request.brandName
      // Pre-fill nested model if provided in request
      if (request.modelName) {
        setNestedModelData({ name: request.modelName })
        setEnableModelCreation(true)
      }
      // Pre-fill nested variant if provided in request
      if (request.variantName) {
        setNestedVariantData({ variantName: request.variantName })
        setEnableVariantCreation(true)
      }
    } else if (request.requestType === "model") {
      data.name = request.modelName
      // Pre-fill nested variant if provided in request
      if (request.variantName) {
        setNestedVariantData({ variantName: request.variantName })
        setEnableVariantCreation(true)
      }
    } else if (request.requestType === "variant") {
      data.variantName = request.variantName
    } else if (request.requestType === "state") {
      data.name = request.stateName
    } else if (request.requestType === "city") {
      data.name = request.cityName
    }
    setApprovalData(data)
    setShowApproveDialog(true)
  }

  const openRejectDialog = (request) => {
    setSelectedRequest(request)
    setShowRejectDialog(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getRequestTypeLabel = (type) => {
    const labels = {
      brand: "Car Brand",
      model: "Car Model",
      variant: "Car Variant",
      state: "State",
      city: "City",
    }
    return labels[type] || type
  }

  const getRequestDetails = (request) => {
    if (request.requestType === "brand") return request.brandName
    if (request.requestType === "model") return `${request.brandName} - ${request.modelName}`
    if (request.requestType === "variant") return `${request.brandName} ${request.modelName} - ${request.variantName}`
    if (request.requestType === "state") return request.stateName
    if (request.requestType === "city") return `${request.stateName} - ${request.cityName}`
    return ""
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-800">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-800">Approved</p>
            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <p className="text-sm text-red-800">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={filters.requestType || "all"}
              onValueChange={(value) => setFilters({ ...filters, requestType: value === "all" ? "" : value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="brand">Car Brand</SelectItem>
                <SelectItem value="model">Car Model</SelectItem>
                <SelectItem value="variant">Car Variant</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="city">City</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, user, mobile..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No requests found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {getRequestTypeLabel(request.requestType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{getRequestDetails(request)}</div>
                        {request.additionalDetails && (
                          <div className="text-xs text-gray-500 mt-1">{request.additionalDetails}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.user?.fullName}</div>
                        <div className="text-xs text-gray-500">{request.user?.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                        {request.status === "rejected" && request.rejectionReason && (
                          <div className="text-xs text-red-600 mt-1">{request.rejectionReason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => openApproveDialog(request)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openRejectDialog(request)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Provide details to create the {selectedRequest?.requestType}
              {(selectedRequest?.requestType === "brand" || selectedRequest?.requestType === "model") && 
                " (with optional nested entities)"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Brand Fields */}
            {selectedRequest?.requestType === "brand" && (
              <>
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-blue-900">Brand Details</h3>
                  <div>
                    <Label>Brand Name *</Label>
                    <Input
                      value={approvalData.name || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, name: e.target.value })}
                      placeholder="e.g., Tesla"
                    />
                  </div>
                  <div>
                    <Label>Local Name</Label>
                    <Input
                      value={approvalData.nameLocal || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, nameLocal: e.target.value })}
                      placeholder="e.g., टेस्ला"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={approvalData.description || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, description: e.target.value })}
                      placeholder="Brief description of the brand"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Country of Origin</Label>
                    <Input
                      value={approvalData.countryOfOrigin || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, countryOfOrigin: e.target.value })}
                      placeholder="e.g., USA, Germany, Japan"
                    />
                  </div>
                </div>

                {/* Add Model Option */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <Checkbox
                    id="add-model"
                    checked={enableModelCreation}
                    onCheckedChange={(checked) => {
                      setEnableModelCreation(checked)
                      if (!checked) {
                        setNestedModelData({})
                        setEnableVariantCreation(false)
                        setNestedVariantData({})
                      }
                    }}
                  />
                  <Label htmlFor="add-model" className="cursor-pointer font-medium">
                    Also create a model for this brand
                  </Label>
                </div>

                {/* Nested Model Fields */}
                {enableModelCreation && (
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50 ml-4">
                    <h3 className="font-semibold text-green-900">Model Details</h3>
                    <div>
                      <Label>Model Name *</Label>
                      <Input
                        value={nestedModelData.name || ""}
                        onChange={(e) => setNestedModelData({ ...nestedModelData, name: e.target.value })}
                        placeholder="e.g., Model 3"
                      />
                    </div>
                    <div>
                      <Label>Launch Year</Label>
                      <Input
                        type="number"
                        value={nestedModelData.launchYear || ""}
                        onChange={(e) => setNestedModelData({ ...nestedModelData, launchYear: parseInt(e.target.value) || "" })}
                        placeholder="e.g., 2017"
                      />
                    </div>

                    {/* Add Variant Option */}
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                      <Checkbox
                        id="add-variant"
                        checked={enableVariantCreation}
                        onCheckedChange={(checked) => {
                          setEnableVariantCreation(checked)
                          if (!checked) setNestedVariantData({})
                        }}
                      />
                      <Label htmlFor="add-variant" className="cursor-pointer font-medium">
                        Also create a variant for this model
                      </Label>
                    </div>

                    {/* Nested Variant Fields */}
                    {enableVariantCreation && (
                      <div className="space-y-4 p-4 border rounded-lg bg-purple-50 ml-4">
                        <h3 className="font-semibold text-purple-900">Variant Details</h3>
                        <div>
                          <Label>Variant Name *</Label>
                          <Input
                            value={nestedVariantData.variantName || ""}
                            onChange={(e) => setNestedVariantData({ ...nestedVariantData, variantName: e.target.value })}
                            placeholder="e.g., Long Range AWD"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Model Year</Label>
                            <Input
                              type="number"
                              value={nestedVariantData.modelYear || ""}
                              onChange={(e) => setNestedVariantData({ ...nestedVariantData, modelYear: parseInt(e.target.value) || "" })}
                              placeholder="e.g., 2024"
                            />
                          </div>
                          <div>
                            <Label>Body Type</Label>
                            <Select
                              value={nestedVariantData.bodyType || ""}
                              onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, bodyType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedan">Sedan</SelectItem>
                                <SelectItem value="suv">SUV</SelectItem>
                                <SelectItem value="hatchback">Hatchback</SelectItem>
                                <SelectItem value="coupe">Coupe</SelectItem>
                                <SelectItem value="convertible">Convertible</SelectItem>
                                <SelectItem value="wagon">Wagon</SelectItem>
                                <SelectItem value="van">Van</SelectItem>
                                <SelectItem value="truck">Truck</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Fuel Type</Label>
                            <Select
                              value={nestedVariantData.fuelType || ""}
                              onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, fuelType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="electric">Electric</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="cng">CNG</SelectItem>
                                <SelectItem value="lpg">LPG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Transmission</Label>
                            <Select
                              value={nestedVariantData.transmissionType || ""}
                              onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, transmissionType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="automatic">Automatic</SelectItem>
                                <SelectItem value="cvt">CVT</SelectItem>
                                <SelectItem value="dct">DCT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Seating Capacity</Label>
                          <Input
                            type="number"
                            value={nestedVariantData.seatingCapacity || ""}
                            onChange={(e) => setNestedVariantData({ ...nestedVariantData, seatingCapacity: parseInt(e.target.value) || "" })}
                            placeholder="e.g., 5"
                            min="2"
                            max="20"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Model Fields */}
            {selectedRequest?.requestType === "model" && (
              <>
                <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                  <h3 className="font-semibold text-green-900">Model Details</h3>
                  <div>
                    <Label>Model Name *</Label>
                    <Input
                      value={approvalData.name || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, name: e.target.value })}
                      placeholder="e.g., Model 3"
                    />
                  </div>
                  <div>
                    <Label>Launch Year</Label>
                    <Input
                      type="number"
                      value={approvalData.launchYear || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, launchYear: parseInt(e.target.value) || "" })}
                      placeholder="e.g., 2017"
                    />
                  </div>
                </div>

                {/* Add Variant Option */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
                  <Checkbox
                    id="add-variant-model"
                    checked={enableVariantCreation}
                    onCheckedChange={(checked) => {
                      setEnableVariantCreation(checked)
                      if (!checked) setNestedVariantData({})
                    }}
                  />
                  <Label htmlFor="add-variant-model" className="cursor-pointer font-medium">
                    Also create a variant for this model
                  </Label>
                </div>

                {/* Nested Variant Fields for Model */}
                {enableVariantCreation && (
                  <div className="space-y-4 p-4 border rounded-lg bg-purple-50 ml-4">
                    <h3 className="font-semibold text-purple-900">Variant Details</h3>
                    <div>
                      <Label>Variant Name *</Label>
                      <Input
                        value={nestedVariantData.variantName || ""}
                        onChange={(e) => setNestedVariantData({ ...nestedVariantData, variantName: e.target.value })}
                        placeholder="e.g., Long Range AWD"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Model Year</Label>
                        <Input
                          type="number"
                          value={nestedVariantData.modelYear || ""}
                          onChange={(e) => setNestedVariantData({ ...nestedVariantData, modelYear: parseInt(e.target.value) || "" })}
                          placeholder="e.g., 2024"
                        />
                      </div>
                      <div>
                        <Label>Body Type</Label>
                        <Select
                          value={nestedVariantData.bodyType || ""}
                          onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, bodyType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="hatchback">Hatchback</SelectItem>
                            <SelectItem value="coupe">Coupe</SelectItem>
                            <SelectItem value="convertible">Convertible</SelectItem>
                            <SelectItem value="wagon">Wagon</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Fuel Type</Label>
                        <Select
                          value={nestedVariantData.fuelType || ""}
                          onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, fuelType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="cng">CNG</SelectItem>
                            <SelectItem value="lpg">LPG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Transmission</Label>
                        <Select
                          value={nestedVariantData.transmissionType || ""}
                          onValueChange={(value) => setNestedVariantData({ ...nestedVariantData, transmissionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="cvt">CVT</SelectItem>
                            <SelectItem value="dct">DCT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Seating Capacity</Label>
                      <Input
                        type="number"
                        value={nestedVariantData.seatingCapacity || ""}
                        onChange={(e) => setNestedVariantData({ ...nestedVariantData, seatingCapacity: parseInt(e.target.value) || "" })}
                        placeholder="e.g., 5"
                        min="2"
                        max="20"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Variant Fields */}
            {selectedRequest?.requestType === "variant" && (
              <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
                <h3 className="font-semibold text-purple-900">Variant Details</h3>
                <div>
                  <Label>Variant Name *</Label>
                  <Input
                    value={approvalData.variantName || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, variantName: e.target.value })}
                    placeholder="e.g., Long Range AWD"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Model Year</Label>
                    <Input
                      type="number"
                      value={approvalData.modelYear || ""}
                      onChange={(e) => setApprovalData({ ...approvalData, modelYear: parseInt(e.target.value) || "" })}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <Label>Body Type</Label>
                    <Select
                      value={approvalData.bodyType || ""}
                      onValueChange={(value) => setApprovalData({ ...approvalData, bodyType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="coupe">Coupe</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                        <SelectItem value="wagon">Wagon</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fuel Type</Label>
                    <Select
                      value={approvalData.fuelType || ""}
                      onValueChange={(value) => setApprovalData({ ...approvalData, fuelType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="lpg">LPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transmission</Label>
                    <Select
                      value={approvalData.transmissionType || ""}
                      onValueChange={(value) => setApprovalData({ ...approvalData, transmissionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                        <SelectItem value="dct">DCT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Seating Capacity</Label>
                  <Input
                    type="number"
                    value={approvalData.seatingCapacity || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, seatingCapacity: parseInt(e.target.value) || "" })}
                    placeholder="e.g., 5"
                    min="2"
                    max="20"
                  />
                </div>
              </div>
            )}

            {/* State Fields */}
            {selectedRequest?.requestType === "state" && (
              <div className="space-y-4">
                <div>
                  <Label>State Name *</Label>
                  <Input
                    value={approvalData.name || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Region Slug</Label>
                  <Input
                    value={approvalData.regionSlug || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, regionSlug: e.target.value })}
                    placeholder="e.g., west, north, south"
                  />
                </div>
                <div>
                  <Label>Region Name</Label>
                  <Input
                    value={approvalData.regionName || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, regionName: e.target.value })}
                    placeholder="e.g., West India"
                  />
                </div>
              </div>
            )}

            {/* City Fields */}
            {selectedRequest?.requestType === "city" && (
              <div className="space-y-4">
                <div>
                  <Label>City Name *</Label>
                  <Input
                    value={approvalData.name || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={approvalData.latitude || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, latitude: parseFloat(e.target.value) || "" })}
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={approvalData.longitude || ""}
                    onChange={(e) => setApprovalData({ ...approvalData, longitude: parseFloat(e.target.value) || "" })}
                  />
                </div>
              </div>
            )}

            {/* Creation Summary */}
            {(selectedRequest?.requestType === "brand" || selectedRequest?.requestType === "model") && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What will be created:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  {selectedRequest?.requestType === "brand" && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Brand: {approvalData.name || "(name required)"}
                      </li>
                      {enableModelCreation && nestedModelData.name && (
                        <li className="flex items-center gap-2 ml-4">
                          <CheckCircle className="h-4 w-4" />
                          Model: {nestedModelData.name}
                        </li>
                      )}
                      {enableModelCreation && enableVariantCreation && nestedVariantData.variantName && (
                        <li className="flex items-center gap-2 ml-8">
                          <CheckCircle className="h-4 w-4" />
                          Variant: {nestedVariantData.variantName}
                        </li>
                      )}
                    </>
                  )}
                  {selectedRequest?.requestType === "model" && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Model: {approvalData.name || "(name required)"}
                      </li>
                      {enableVariantCreation && nestedVariantData.variantName && (
                        <li className="flex items-center gap-2 ml-4">
                          <CheckCircle className="h-4 w-4" />
                          Variant: {nestedVariantData.variantName}
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button onClick={handleApprove} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve & Create"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Reason *</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                rows={4}
                minLength={10}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading || rejectionReason.length < 10}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
