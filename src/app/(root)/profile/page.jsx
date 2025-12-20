"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StateSelect } from "@/components/ui/state-select"
import { CitySelect } from "@/components/ui/city-select"
import { Calendar, Phone, Share2, Edit3, Loader2, Save, X, Camera, Mail, User, Heart, Clock } from "lucide-react"
import Header from "@/components/Header"
import FavoritesList from "@/components/FavoritesList"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"
import { authService } from "@/app/services"
import { OTPInput } from "@/components/ui/otp-input"
import { useResendTimer } from "@/hooks/useResendTimer"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, isAuthenticated, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    stateId: "",
    cityId: "",
    bio: "",
    avatar: "",
  })
  
  // OTP verification states
  const [otpStates, setOtpStates] = useState({
    mobile: {
      sent: false,
      verified: false,
      otp: "",
      loading: false,
      error: ""
    },
    email: {
      sent: false,
      verified: false,
      otp: "",
      loading: false,
      error: ""
    }
  })

  // Resend timers for OTP
  const mobileTimer = useResendTimer(30)
  const emailTimer = useResendTimer(30)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to view your profile")
      router.push("/sign-in")
    }
  }, [loading, isAuthenticated, router])

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.mobile || "",
        stateId: user.profile?.stateId || "",
        cityId: user.profile?.cityId || "",
        bio: user.profile?.bio || "",
        avatar: user.profile?.profilePhoto || "",
      })
    }
  }, [user])

  // Refresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          await refreshUser()
        } catch (error) {
          console.error("Error refreshing user data:", error)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // OTP handling functions
  const sendOTP = async (type, value) => {
    setOtpStates(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "" }
    }))

    try {
      let response
      if (type === 'mobile') {
        response = await authService.sendOTP(value, 'verification', 'sms')
      } else {
        response = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: value,
            type: 'verification',
            channel: 'email'
          })
        })
        response = await response.json()
      }

      if (response.success) {
        setOtpStates(prev => ({
          ...prev,
          [type]: { ...prev[type], sent: true, loading: false }
        }))
        
        // Start the appropriate timer
        if (type === 'mobile') {
          mobileTimer.startTimer()
        } else {
          emailTimer.startTimer()
        }
        
        toast.success(`OTP sent to your ${type}`)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      setOtpStates(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false, error: error.message }
      }))
      toast.error(`Failed to send OTP: ${error.message}`)
    }
  }

  // Resend OTP function
  const resendOTP = async (type, value) => {
    const timer = type === 'mobile' ? mobileTimer : emailTimer
    if (!timer.canResend) return
    
    await sendOTP(type, value)
  }

  const verifyOTP = async (type, value) => {
    const otpValue = otpStates[type].otp
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setOtpStates(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: "" }
    }))

    try {
      let response
      if (type === 'mobile') {
        response = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile: value,
            otp: otpValue,
            type: 'verification'
          })
        })
      } else {
        response = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: value,
            otp: otpValue,
            type: 'verification'
          })
        })
      }
      
      const data = await response.json()
      
      if (data.success) {
        setOtpStates(prev => ({
          ...prev,
          [type]: { ...prev[type], verified: true, loading: false }
        }))
        toast.success(`${type === 'mobile' ? 'Mobile number' : 'Email'} verified successfully!`)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      setOtpStates(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false, error: error.message }
      }))
      toast.error(`Verification failed: ${error.message}`)
    }
  }

  const handleSave = async () => {
    // Check if mobile number changed and needs verification
    const mobileChanged = formData.phone !== user.mobile
    const emailChanged = formData.email !== user.email

    if (mobileChanged && !otpStates.mobile.verified) {
      toast.error("Please verify your mobile number before saving changes")
      return
    }

    if (emailChanged && !otpStates.email.verified) {
      toast.error("Please verify your email address before saving changes")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      // Reset OTP states
      setOtpStates({
        mobile: { sent: false, verified: false, otp: "", loading: false, error: "" },
        email: { sent: false, verified: false, otp: "", loading: false, error: "" }
      })
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.mobile || "",
        stateId: user.profile?.stateId || "",
        cityId: user.profile?.cityId || "",
        bio: user.profile?.bio || "",
        avatar: user.profile?.profilePhoto || "",
      })
    }
    // Reset OTP states
    setOtpStates({
      mobile: { sent: false, verified: false, otp: "", loading: false, error: "" },
      email: { sent: false, verified: false, otp: "", loading: false, error: "" }
    })
    setIsEditing(false)
  }

  const handleOtpChange = (type, value) => {
    setOtpStates(prev => ({
      ...prev,
      [type]: { ...prev[type], otp: value.replace(/\D/g, "").slice(0, 6) }
    }))
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name || "User"} />
                      <AvatarFallback className="text-2xl">{formData.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar" className="absolute bottom-0 right-0 cursor-pointer">
                      <div className="bg-primary text-white p-2 rounded-full hover:bg-primary/90">
                        <Camera className="h-4 w-4" />
                      </div>
                    </Label>
                    <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                ) : (
                  <Avatar className="h-24 w-24 md:h-32 md:w-32">
                    <AvatarImage src={user.profile?.profilePhoto || "/placeholder.svg"} alt={user.fullName} />
                    <AvatarFallback className="text-2xl">{user.fullName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="text-2xl md:text-3xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        required
                      />
                    ) : (
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.fullName}</h1>
                    )}
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
                    {(user.email || isEditing) && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {isEditing ? (
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 text-sm"
                          />
                        ) : (
                          user.email
                        )}
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
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                      <Share2 className="h-4 w-4" />
                      Share Profile
                    </Button>
                    <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Information
                </div>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'favorites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  My Favorites
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {activeTab === 'profile' ? (
            isEditing ? (
            /* Edit Mode - Show All Fields */
            <div className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-2">Contact Information</h4>
                    
                    {/* Mobile Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <div className="space-y-3">
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit mobile number"
                            className="pl-10"
                            maxLength={10}
                          />
                          {formData.phone !== user.mobile && formData.phone.length === 10 && !otpStates.mobile.sent && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => sendOTP('mobile', formData.phone)}
                              disabled={otpStates.mobile.loading}
                              className="absolute right-2 top-1 h-8"
                            >
                              {otpStates.mobile.loading ? "Sending..." : "Send OTP"}
                            </Button>
                          )}
                          {otpStates.mobile.verified && (
                            <Badge variant="secondary" className="absolute right-3 top-2 bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        {otpStates.mobile.sent && !otpStates.mobile.verified && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm text-gray-600 block mb-2">Enter 6-digit OTP</Label>
                              <OTPInput
                                length={6}
                                value={otpStates.mobile.otp}
                                onChange={(value) => handleOtpChange('mobile', value)}
                                disabled={otpStates.mobile.loading}
                              />
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                OTP sent to +91 {formData.phone}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => verifyOTP('mobile', formData.phone)}
                                disabled={otpStates.mobile.loading || otpStates.mobile.otp.length !== 6}
                                className="flex-1 mr-2"
                              >
                                {otpStates.mobile.loading ? "Verifying..." : "Verify OTP"}
                              </Button>
                              
                              {mobileTimer.canResend ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resendOTP('mobile', formData.phone)}
                                  disabled={otpStates.mobile.loading}
                                >
                                  Resend
                                </Button>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{mobileTimer.timeLeft}s</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {otpStates.mobile.error && (
                          <p className="text-sm text-red-600">{otpStates.mobile.error}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            className="pl-10"
                          />
                          {formData.email !== user.email && formData.email.includes('@') && !otpStates.email.sent && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => sendOTP('email', formData.email)}
                              disabled={otpStates.email.loading}
                              className="absolute right-2 top-1 h-8"
                            >
                              {otpStates.email.loading ? "Sending..." : "Send OTP"}
                            </Button>
                          )}
                          {otpStates.email.verified && (
                            <Badge variant="secondary" className="absolute right-3 top-2 bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        {otpStates.email.sent && !otpStates.email.verified && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm text-gray-600 block mb-2">Enter 6-digit OTP</Label>
                              <OTPInput
                                length={6}
                                value={otpStates.email.otp}
                                onChange={(value) => handleOtpChange('email', value)}
                                disabled={otpStates.email.loading}
                              />
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                OTP sent to {formData.email}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => verifyOTP('email', formData.email)}
                                disabled={otpStates.email.loading || otpStates.email.otp.length !== 6}
                                className="flex-1 mr-2"
                              >
                                {otpStates.email.loading ? "Verifying..." : "Verify OTP"}
                              </Button>
                              
                              {emailTimer.canResend ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resendOTP('email', formData.email)}
                                  disabled={otpStates.email.loading}
                                >
                                  Resend
                                </Button>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{emailTimer.timeLeft}s</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {otpStates.email.error && (
                          <p className="text-sm text-red-600">{otpStates.email.error}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StateSelect
                      value={formData.stateId}
                      onChange={(stateId) => {
                        setFormData((prev) => ({ ...prev, stateId, cityId: "" }))
                      }}
                      showLabel
                      className="w-full"
                    />

                    <CitySelect
                      stateId={formData.stateId}
                      value={formData.cityId}
                      onChange={(cityId) => {
                        setFormData((prev) => ({ ...prev, cityId }))
                      }}
                      showLabel
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell others about yourself..."
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-sm text-gray-500">{formData.bio.length}/500 characters</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* View Mode - Show Profile Info */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p className="text-gray-900 mt-1">{user.fullName || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-900 mt-1">{user.email || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                    <p className="text-gray-900 mt-1">{user.countryCode} {user.mobile}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bio</Label>
                    <p className="text-gray-900 mt-1 min-h-[60px] p-3 bg-gray-50 rounded-md">
                      {user.profile?.bio || "No bio added yet."}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                    <p className="text-gray-900 mt-1">{formatMemberSince(user.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          ) : activeTab === 'favorites' ? (
            <FavoritesList />
          ) : null}
        </div>
      </div>
    </>
  )
}