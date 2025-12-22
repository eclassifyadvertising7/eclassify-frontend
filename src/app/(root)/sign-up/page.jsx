"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, User, Mail, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { authService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"
import { OTPInput } from "@/components/ui/otp-input"
import { useResendTimer } from "@/hooks/useResendTimer"

export default function SignUpPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = authService.getCurrentUser()
      const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
      router.replace(redirectPath)
    }
  }, [isAuthenticated, router])
  
  // Form State
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Flow State
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  
  // Resend Timer
  const { timeLeft, canResend, startTimer, resetTimer } = useResendTimer(30)

  // Handle Edit Details - Reset verification state
  const handleEditDetails = () => {
    setOtpVerified(false)
    setOtpSent(false)
    setOtp("")
    resetTimer()
    toast.info("You can now edit your details. Please verify again after making changes.")
  }

  // Send OTP
  const handleSendOtp = async () => {
    // Validation
    if (!fullName || fullName.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters)")
      return
    }
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    // Reset verification state if user is re-sending after editing
    if (otpVerified) {
      setOtpVerified(false)
    }

    setLoading(true)
    try {
      const response = await authService.sendOTP(mobile, 'signup', '+91', fullName.trim(), email.trim())
      
      if (response.success) {
        setOtpSent(true)
        startTimer()
        toast.success("OTP has been sent to your email address!")
        
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      const response = await authService.verifyOTP(mobile, otp, '+91')
      
      if (response.success) {
        setOtpVerified(true)
        toast.success("OTP verified successfully! Email is now restricted.")
      } else {
        toast.error(response.message || "Invalid OTP")
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Submit (Complete Registration)
  const handleSubmit = async () => {
    if (!otpVerified) {
      toast.error("Please verify your OTP first")
      return
    }

    setLoading(true)
    try {
      const response = await authService.otpSignup(
        mobile,
        email.trim(),
        fullName.trim(),
        '+91',
        navigator.userAgent
      )
      
      if (response.success) {
        const user = response?.data?.user
        const redirectPath = (user?.role === "admin" || user?.role === "super_admin") ? "/admin" : "/"
        
        toast.success("Account created successfully!")
        router.replace(redirectPath)
      } else {
        toast.error(response.message || "Failed to create account")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return
    
    setLoading(true)
    try {
      const response = await authService.sendOTP(mobile, 'signup', '+91', fullName.trim(), email.trim())
      
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
    try {
      authService.initiateGoogleAuth()
    } catch (error) {
      toast.error("Failed to initiate Google authentication")
    }
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
              Create your account to get started
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Join our marketplace today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signup Form */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={otpSent && !otpVerified}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
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
                      disabled={otpSent && !otpVerified}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={otpVerified} // Restrict editing after verification
                    />
                  </div>
                </div>

                {/* Send OTP Button */}
                {!otpSent && !otpVerified && (
                  <Button
                    onClick={handleSendOtp}
                    className="w-full"
                    disabled={loading || !fullName || !mobile || !email}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                )}

                {/* Re-send OTP Button (after editing details) */}
                {!otpSent && otpVerified && (
                  <Button
                    onClick={handleSendOtp}
                    className="w-full"
                    disabled={loading || !fullName || !mobile || !email}
                  >
                    {loading ? "Sending OTP..." : "Send OTP Again"}
                  </Button>
                )}

                {/* OTP Sent Message */}
                {otpSent && !otpVerified && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm text-center">
                      OTP has been sent to your email address: <strong>{email}</strong>
                    </p>
                  </div>
                )}

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="space-y-3">
                    <Label htmlFor="otp" className="text-center block">Enter 6-digit OTP</Label>
                    <OTPInput
                      length={6}
                      value={otp}
                      onChange={setOtp}
                      disabled={loading}
                    />
                    
                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
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
                        Change details
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
                  </div>
                )}

                {/* OTP Verified Message */}
                {otpVerified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-800">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">Email Verified ✓</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEditDetails}
                        className="text-xs"
                      >
                        Edit Details
                      </Button>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your credentials have been verified. Click "Edit Details" to modify them.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                {otpVerified && !otpSent && (
                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Submit"}
                  </Button>
                )}
              </div>

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

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-primary hover:text-cyan-600 transition-colors underline decoration-2 underline-offset-2"
                  >
                    Sign in here
                  </Link>
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