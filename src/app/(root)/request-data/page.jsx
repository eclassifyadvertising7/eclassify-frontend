"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DataRequestForm from "@/components/data-request-form"
import dataRequestService from "@/app/services/api/dataRequestService"
import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DataRequestPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("submit")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to submit data requests")
      router.push("/sign-in")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && activeTab === "my-requests") {
      fetchMyRequests()
    }
  }, [isAuthenticated, activeTab])

  const fetchMyRequests = async () => {
    try {
      setLoading(true)
      const response = await dataRequestService.getMyRequests()
      setMyRequests(response.data)
    } catch (error) {
      toast.error("Failed to fetch your requests")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    if (status === "pending") return <Clock className="h-5 w-5 text-yellow-600" />
    if (status === "approved") return <CheckCircle className="h-5 w-5 text-green-600" />
    if (status === "rejected") return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getRequestDetails = (request) => {
    if (request.requestType === "brand") return request.brandName
    if (request.requestType === "model") return `${request.brandName} - ${request.modelName}`
    if (request.requestType === "variant") return `${request.brandName} ${request.modelName} - ${request.variantName}`
    if (request.requestType === "state") return request.stateName
    if (request.requestType === "city") return `${request.stateName} - ${request.cityName}`
    return ""
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Request</h1>
            <p className="text-gray-600">
              Can't find a car brand, model, variant, state, or city? Request it here and we'll add it to our database.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">Submit Request</TabsTrigger>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="submit">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
                <DataRequestForm onSuccess={() => {
                  setActiveTab("my-requests")
                  fetchMyRequests()
                }} />
              </div>
            </TabsContent>

            <TabsContent value="my-requests">
              <div className="bg-white rounded-lg shadow">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : myRequests.length === 0 ? (
                  <div className="text-center p-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>You haven't submitted any requests yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {myRequests.map((request) => (
                      <div key={request.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {getRequestTypeLabel(request.requestType)}
                              </h3>
                              <p className="text-sm text-gray-600">{getRequestDetails(request)}</p>
                            </div>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        {request.additionalDetails && (
                          <p className="text-sm text-gray-600 mb-3 ml-8">
                            <span className="font-medium">Details:</span> {request.additionalDetails}
                          </p>
                        )}

                        {request.status === "rejected" && request.rejectionReason && (
                          <div className="ml-8 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                              <span className="font-medium">Rejection Reason:</span> {request.rejectionReason}
                            </p>
                          </div>
                        )}

                        {request.status === "approved" && (
                          <div className="ml-8 mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              ✓ Your request has been approved and is now available on the website!
                            </p>
                          </div>
                        )}

                        <div className="ml-8 mt-3 text-xs text-gray-500">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()} at{" "}
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  )
}
