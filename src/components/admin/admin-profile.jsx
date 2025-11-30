"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Phone, Mail, MapPin, Shield, Edit3, Save, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { commonService, userService } from "@/app/services"

export default function AdminProfile() {
  const { user, updateUser, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    countryCode: user?.countryCode || "+91",
    dob: user?.profile?.dob || "",
    gender: user?.profile?.gender || "",
    about: user?.profile?.about || "",
    addressLine1: user?.profile?.addressLine1 || "",
    addressLine2: user?.profile?.addressLine2 || "",
    city: user?.profile?.city || "",
    stateId: user?.profile?.stateId || "",
    pincode: user?.profile?.pincode || "",
  })

  // Load states on component mount
  useEffect(() => {
    loadStates()
  }, [])

  // Load cities when state changes
  useEffect(() => {
    if (formData.stateId) {
      loadCities(formData.stateId)
    } else {
      setCities([])
    }
  }, [formData.stateId])

  const loadStates = async () => {
    try {
      const response = await commonService.getStates()
      if (response.success && response.data) {
        setStates(response.data)
      }
    } catch (error) {
      console.error("Error loading states:", error)
    }
  }

  const loadCities = async (stateId) => {
    setLoadingCities(true)
    try {
      const response = await commonService.getCitiesByState(stateId)
      if (response.success && response.data) {
        setCities(response.data)
      }
    } catch (error) {
      console.error("Error loading cities:", error)
      toast.error("Failed to load cities")
    } finally {
      setLoadingCities(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await userService.updateProfile(formDataToSend)
      
      if (response.success) {
        await refreshUser()
        setIsEditing(false)
        toast.success("Profile updated successfully!")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      countryCode: user?.countryCode || "+91",
      dob: user?.profile?.dob || "",
      gender: user?.profile?.gender || "",
      about: user?.profile?.about || "",
      addressLine1: user?.profile?.addressLine1 || "",
      addressLine2: user?.profile?.addressLine2 || "",
      city: user?.profile?.city || "",
      stateId: user?.profile?.stateId || "",
      pincode: user?.profile?.pincode || "",
    })
    setIsEditing(false)
  }

  const handleStateChange = (value) => {
    setFormData(prev => ({ ...prev, stateId: value, city: "" }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullName} />
                <AvatarFallback className="text-3xl bg-primary text-white">
                  {user?.fullName?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 shadow-lg">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role === "super_admin" ? "Super Admin" : "Admin"}
                </Badge>
                {user?.isPhoneVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Phone className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user?.countryCode} {user?.mobile}</span>
                </div>
                {user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user?.createdAt)}</span>
                </div>
                {user?.last_login_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Last login: {formatDate(user?.last_login_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-20"
                    placeholder="+91"
                  />
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Mobile number"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateId">State</Label>
                <Select value={formData.stateId?.toString()} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select 
                  value={formData.city} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  disabled={!formData.stateId || loadingCities}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
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
              <Button onClick={handleCancel} variant="outline" disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account Status</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {user?.status || "Active"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Phone Verified</span>
              <Badge variant="secondary" className={user?.isPhoneVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {user?.isPhoneVerified ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Verified</span>
              <Badge variant="secondary" className={user?.isEmailVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {user?.isEmailVerified ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Role</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user?.role === "super_admin" ? "Super Admin" : user?.role || "Admin"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plan</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {user?.subscriptionType?.toUpperCase() || "FREE"}
              </Badge>
            </div>
            {user?.subscriptionExpiresAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expires On</span>
                <span className="text-sm font-medium">{formatDate(user?.subscriptionExpiresAt)}</span>
              </div>
            )}
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">Update your password regularly for security</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
