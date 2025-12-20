"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Phone, Lock, Eye, EyeOff, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { authService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"
import { OTPInput } from "@/components/ui/otp-input"
import { useResendTimer } from "@/hooks/useResendTimer"

export default function SignInPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = authService.getCurrentUser()
      const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
      router.replace(redirectPath)
    }
  }, [isAuthenticated, router])
  
  // Auth Method State
  const [authMethod, setAuthMethod] = useState("password") // "password" or "otp"
  
  // Common State
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // OTP State
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  
  // Resend Timer
  const { timeLeft, canResend, startTimer, resetTimer } = useResendTimer(30)

  // Handle Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    
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
      
      const user = response?.data?.user
      const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
      
      toast.success("Login successful!")
      router.replace(redirectPath)
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.")
      setLoading(false)
    }
  }

  // Send OTP for Login
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)
    try {
      const response = await authService.sendOTP(mobile, 'login')
      
      if (response.success) {
        setOtpSent(true)
        startTimer()
        toast.success("OTP sent successfully!")
        
        // Auto-fill OTP in development mode
        if (process.env.NODE_ENV === 'development' && response.data?.otp) {
          setOtp(response.data.otp)
        }
      } else {
        toast.error(response.message || "Failed to send OTP")
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP for Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      const response = await authService.verifyOTPLogin(mobile, otp)
      
      if (response.success) {
        const user = response?.data?.user
        const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
        
        toast.success("Login successful!")
        router.replace(redirectPath)
      } else {
        toast.error(response.message || "Invalid OTP")
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return
    
    setLoading(true)
    try {
      const response = await authService.sendOTP(mobile, 'login')
      
      if (response.success) {
        startTimer()
        setOtp("")
        toast.success("OTP resent successfully!")
        
        // Auto-fill OTP in development mode
        if (process.env.NODE_ENV === 'development' && response.data?.otp) {
          setOtp(response.data.otp)
        }
      } else {
        toast.error(response.message || "Failed to resend OTP")
      }
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
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
              Welcome back! Sign in to continue
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign In
              </CardTitle>
              <CardDescription className="text-gray-500">
                Access your account
              </CardDescription>
              <p className="text-sm text-gray-600 mt-3">
                Not registered yet?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-primary hover:text-cyan-600 transition-colors underline decoration-2 underline-offset-2"
                >
                  Sign up here
                </Link>
              </p>
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
                    resetTimer()
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
                    setOtpSent(false)
                    setOtp("")
                    resetTimer()
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  OTP
                </Button>
              </div>

              {/* Password Auth Form */}
              {authMethod === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                        placeholder="Enter your password"
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
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              )}


              {/* OTP Auth Form */}
              {authMethod === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                      <div className="space-y-3">
                        <Label htmlFor="otp" className="text-center block">Enter 6-digit OTP</Label>
                        <OTPInput
                          length={6}
                          value={otp}
                          onChange={setOtp}
                          disabled={loading}
                        />
                        <p className="text-sm text-gray-600 text-center">
                          OTP sent to +91 {mobile}
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                        {loading ? "Verifying..." : "Verify & Sign In"}
                      </Button>
                      
                      <div className="flex items-center justify-between text-sm">
                        <Button
                          type="button"
                          variant="link"
                          className="text-gray-600 p-0 h-auto"
                          onClick={() => {
                            setOtpSent(false)
                            setOtp("")
                            resetTimer()
                          }}
                        >
                          Change number
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {canResend ? (
                            <Button
                              type="button"
                              variant="link"
                              className="text-primary p-0 h-auto font-semibold"
                              onClick={handleResendOtp}
                              disabled={loading}
                            >
                              Resend OTP
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Resend in {timeLeft}s</span>
                            </div>
                          )}
                        </div>
                      </div>
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
