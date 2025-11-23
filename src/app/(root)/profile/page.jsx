"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Phone, MapPin, Share2, Edit3, Star, ShoppingBag, Loader2 } from "lucide-react"
import Header from "@/components/Header"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, isAuthenticated, refreshUser } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to view your profile")
      router.push("/sign-in")
    }
  }, [loading, isAuthenticated, router])

  // Refresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        setRefreshing(true)
        try {
          await refreshUser()
        } catch (error) {
          console.error("Error refreshing user data:", error)
        } finally {
          setRefreshing(false)
        }
      }
    }

    fetchUserData()
  }, [])

  // Format date
  const formatMemberSince = (dateString) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Show loading state
  if (loading || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.fullName}'s Profile`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Profile link copied to clipboard!")
    }
  }

  return (
    <>
    <Header/>
        <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.fullName} />
                <AvatarFallback className="text-2xl">{user.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.fullName}</h1>
                  {user.isPhoneVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Phone className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {user.role === "admin" && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Admin
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {user.countryCode} {user.mobile}
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <span>📧</span>
                      {user.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {formatMemberSince(user.createdAt)}
                  </div>
                  {user.subscriptionType && user.subscriptionType !== "free" && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {user.subscriptionType.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
              <Link href="/edit-profile">
                <Button className="bg-blue-600 hover:bg-secondary flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Stats */}
          {/* <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ads Posted</span>
                    <span className="font-semibold">{user.adsPosted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-semibold">2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Phone Number Verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Email Not Verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">ID Not Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Right Column - Ads Section */}
          <div className="lg:col-span-4">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <img
                    src="./assets/img/no-publications.webp"
                    alt="No ads illustration"
                    className="mx-auto h-48 w-auto"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't listed anything yet</h3>
                <p className="text-gray-600 mb-6">Let go of what you don't use anymore</p>
                <Link href="/post">
                  <Button className="bg-blue-600 hover:bg-secondary px-8 py-3">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Start selling
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>


    </>
  )
}
