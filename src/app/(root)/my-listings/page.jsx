"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/app/context/AuthContext"
import { listingService } from "@/app/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Plus
} from "lucide-react"
import { toast } from "sonner"

export default function MyListingsPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to view your listings")
      router.push("/sign-in")
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch listings and stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchListings()
      fetchStats()
    }
  }, [isAuthenticated, selectedStatus, currentPage])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const filters = {
        page: currentPage,
        limit: 12
      }
      
      if (selectedStatus !== "all") {
        filters.status = selectedStatus
      }
      
      if (searchQuery) {
        filters.search = searchQuery
      }

      const response = await listingService.getMyListings(filters)
      setListings(response.data || [])
      setPagination(response.pagination)
    } catch (error) {
      console.error("Error fetching listings:", error)
      toast.error("Failed to load listings")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await listingService.getMyStats()
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchListings()
  }

  const handleDelete = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    try {
      await listingService.deleteListing(listingId)
      toast.success("Listing deleted successfully")
      fetchListings()
      fetchStats()
    } catch (error) {
      console.error("Error deleting listing:", error)
      toast.error("Failed to delete listing")
    }
  }

  const handleMarkAsSold = async (listingId) => {
    if (!confirm("Mark this listing as sold?")) return

    try {
      await listingService.markAsSold(listingId)
      toast.success("Listing marked as sold")
      fetchListings()
      fetchStats()
    } catch (error) {
      console.error("Error marking as sold:", error)
      toast.error("Failed to mark as sold")
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      expired: { label: "Expired", className: "bg-orange-100 text-orange-800" },
      sold: { label: "Sold", className: "bg-blue-100 text-blue-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" }
    }

    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading your listings...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your ads and track their performance</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("all")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("draft")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                  <p className="text-sm text-gray-600">Draft</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("pending")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("active")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("expired")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
                  <p className="text-sm text-gray-600">Expired</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("sold")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
                  <p className="text-sm text-gray-600">Sold</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("rejected")}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your listings..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Link href="/post">
                <Button className="md:w-auto bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedStatus === "all" ? "No listings yet" : `No ${selectedStatus} listings`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus === "all" 
                    ? "Start selling by creating your first listing" 
                    : `You don't have any ${selectedStatus} listings`}
                </p>
                <Link href="/post">
                  <Button className="bg-primary hover:bg-cyan-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200">
                      {listing.media && listing.media.length > 0 ? (
                        <img
                          src={listing.media[0].thumbnailUrl || listing.media[0].mediaUrl}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(listing.status)}
                      </div>
                      {listing.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-yellow-500 text-white">Featured</Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {formatPrice(listing.price)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.viewCount} views
                        </div>
                        <div>
                          {formatDate(listing.createdAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/product-details/${listing.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {(listing.status === "draft" || listing.status === "rejected") && (
                          <Link href={`/post?edit=${listing.id}`} className="flex-1">
                            <Button variant="outline" className="w-full" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        )}
                        {listing.status === "active" && (
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            size="sm"
                            onClick={() => handleMarkAsSold(listing.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Sold
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
