"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, User, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { authService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuth()
  
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect if not authenticated or already has mobile
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in first")
      router.replace('/sign-in')
      return
    }
    
    if (user?.mobile) {
      const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
      router.replace(redirectPath)
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)
    try {
      const response = await authService.completeGoogleProfile(mobile, '+91')
      
      if (response.success) {
        // Update user in context
        setUser(response.data)
        
        toast.success("Profile completed successfully!")
        
        // Redirect based on user role
        const redirectPath = (response.data.role === "admin" || response.data.role === "super_admin") 
          ? "/admin" 
          : "/"
        router.replace(redirectPath)
      } else {
        toast.error(response.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
    router.replace(redirectPath)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">
              eClassify
            </Link>
            <p className="text-gray-600 mt-2">
              Complete your profile
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome, {user.fullName}!
              </CardTitle>
              <CardDescription className="text-gray-500">
                Add your mobile number to complete your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Profile Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">{user.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">{user.email}</span>
                </div>
              </div>

              {/* Mobile Number Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="pl-10"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Adding a mobile number helps secure your account and enables SMS notifications
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !mobile || mobile.length !== 10}
                >
                  {loading ? "Updating..." : "Complete Profile"}
                </Button>
              </form>

              {/* Skip Option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleSkip}
              >
                Skip for Now
              </Button>

              {/* Info Text */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 text-center">
                  You can add your mobile number later from your profile settings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}