"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Lock, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { authService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const { login, signup, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = authService.getCurrentUser()
      if (user?.role === "admin" || user?.role === "super_admin") {
        router.push("/admin")
      } else {
        router.push("/profile")
      }
    }
  }, [isAuthenticated, router])
  
  // View State
  const [isSignUp, setIsSignUp] = useState(false)
  const [authMethod, setAuthMethod] = useState("password") // "password" or "otp"
  
  // Common State
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Sign Up Specific
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // OTP State
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  // Handle Password Auth (Sign In or Sign Up)
  const handlePasswordAuth = async (e) => {
    e.preventDefault()
    
    if (isSignUp) {
      // Sign Up Validation
      if (!name || !mobile || !password || !confirmPassword) {
        toast.error("Please fill in all fields")
        return
      }
      if (name.length < 2) {
        toast.error("Name must be at least 2 characters")
        return
      }
      if (mobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number")
        return
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      setLoading(true)
      try {
        const response = await signup({
          fullName: name,
          mobile: mobile,
          password: password,
          countryCode: "+91"
        })
        
        toast.success("Account created successfully!")
        
        const user = response?.data?.user
        if (user?.role === "admin" || user?.role === "super_admin") {
          router.push("/admin")
        } else {
          router.push("/profile")
        }
      } catch (error) {
        toast.error(error.message || "Signup failed. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      // Sign In Validation
      if (!mobile || !password) {
        toast.error("Please enter mobile number and password")
        return
      }
      if (mobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number")
        return
      }

      setLoading(true)
      try {
        const response = await login({
          mobile: mobile,
          password: password
        })
        
        toast.success("Login successful!")
        
        const user = response?.data?.user
        if (user?.role === "admin" || user?.role === "super_admin") {
          router.push("/admin")
        } else {
          router.push("/profile")
        }
      } catch (error) {
        toast.error(error.message || "Login failed. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Send OTP
  const handleSendOtp = async () => {
    if (isSignUp && (!name || name.length < 2)) {
      toast.error("Please enter your full name (at least 2 characters)")
      return
    }
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)
    try {
      await authService.sendOTP(mobile)
      setOtpSent(true)
      toast.success("OTP sent successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      const response = await authService.verifyOTP(mobile, otp)
      
      if (response.success) {
        toast.success(isSignUp ? "Account created successfully!" : "Login successful!")
        
        const user = response?.data?.user
        if (user?.role === "admin" || user?.role === "super_admin") {
          router.push("/admin")
        } else {
          router.push("/profile")
        }
      } else {
        toast.error(response.message || "Invalid OTP")
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Switch between Sign In and Sign Up
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setAuthMethod("password")
    setMobile("")
    setPassword("")
    setName("")
    setConfirmPassword("")
    setOtp("")
    setOtpSent(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleGoogleAuth = () => {
    toast.info("Google authentication coming soon!")
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
              {isSignUp ? "Create your account to get started" : "Welcome back! Sign in to continue"}
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
              <CardDescription className="text-gray-500">
                {isSignUp ? "Join our marketplace today" : "Access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auth Method Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  type="button"
                  variant={authMethod === "password" ? "default" : "ghost"}
                  className={`flex-1 ${authMethod === "password" ? "shadow-sm" : ""}`}
                  onClick={() => {
                    setAuthMethod("password")
                    setOtpSent(false)
                    setOtp("")
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "otp" ? "default" : "ghost"}
                  className={`flex-1 ${authMethod === "otp" ? "shadow-sm" : ""}`}
                  onClick={() => {
                    setAuthMethod("otp")
                    setPassword("")
                    setConfirmPassword("")
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  OTP
                </Button>
              </div>

              {/* Password Auth Form */}
              {authMethod === "password" && (
                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          className="pl-10 pr-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
                  </Button>
                </form>
              )}

              {/* OTP Auth Form */}
              {authMethod === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name-otp">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name-otp"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={otpSent}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile-otp">Mobile Number</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="mobile-otp"
                          type="tel"
                          placeholder="10-digit mobile number"
                          className="pl-10"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          maxLength={10}
                          disabled={otpSent}
                        />
                      </div>
                      {!otpSent && (
                        <Button
                          type="button"
                          onClick={handleSendOtp}
                          variant="outline"
                          disabled={loading}
                          className="whitespace-nowrap"
                        >
                          Send OTP
                        </Button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verifying..." : (isSignUp ? "Verify & Create Account" : "Verify & Sign In")}
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm w-full text-gray-600"
                        onClick={() => {
                          setOtpSent(false)
                          setOtp("")
                        }}
                      >
                        Change number
                      </Button>
                    </>
                  )}
                </form>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 hover:bg-gray-50"
                onClick={handleGoogleAuth}
              >
                <img src="./assets/img/google.png" alt="Google" className="w-5 h-5" />
                <span className="font-medium">Google</span>
              </Button>

              {/* Toggle Sign In / Sign Up */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {isSignUp ? "Already have an account?" : "Not registered yet?"}{" "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-semibold text-primary hover:text-cyan-600 transition-colors underline decoration-2 underline-offset-2"
                  >
                    {isSignUp ? "Sign in here" : "Sign up here"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
