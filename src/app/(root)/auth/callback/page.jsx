"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { authService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setIsAuthenticated } = useAuth()
  
  const [status, setStatus] = useState("processing") // "processing", "success", "error"
  const [message, setMessage] = useState("Processing authentication...")
  const [userNeedsMobile, setUserNeedsMobile] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error first
        const errorMessage = searchParams.get('message')
        if (errorMessage) {
          setStatus("error")
          setMessage(decodeURIComponent(errorMessage))
          return
        }

        // Get encoded data
        const encodedData = searchParams.get('data')
        if (!encodedData) {
          setStatus("error")
          setMessage("No authentication data received")
          return
        }

        // Process Google callback
        const response = await authService.handleGoogleCallback(encodedData)
        
        if (response.success) {
          const user = response.data.user
          
          // Update auth context
          setUser(user)
          setIsAuthenticated(true)
          
          setStatus("success")
          setMessage("Authentication successful!")
          
          // Check if user needs to add mobile number
          if (!user.mobile) {
            setUserNeedsMobile(true)
            setTimeout(() => {
              router.replace('/auth/complete-profile')
            }, 2000)
          } else {
            // Redirect based on user role
            const redirectPath = (user.role === "admin" || user.role === "super_admin") ? "/admin" : "/"
            setTimeout(() => {
              router.replace(redirectPath)
            }, 2000)
          }
          
          toast.success("Welcome! Authentication successful.")
        } else {
          setStatus("error")
          setMessage(response.message || "Authentication failed")
        }
      } catch (error) {
        console.error('Callback processing error:', error)
        setStatus("error")
        setMessage(error.message || "Authentication processing failed")
      }
    }

    handleCallback()
  }, [searchParams, router, setUser, setIsAuthenticated])

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />
      default:
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-blue-600"
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            eClassify
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication
            </CardTitle>
            <CardDescription className="text-gray-500">
              {status === "processing" && "Processing your authentication..."}
              {status === "success" && "Authentication completed successfully"}
              {status === "error" && "Authentication failed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>

            {/* Status Message */}
            <div className={`text-lg font-medium ${getStatusColor()}`}>
              {message}
            </div>

            {/* Additional Info */}
            {status === "success" && userNeedsMobile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Redirecting to complete your profile...
                </p>
              </div>
            )}

            {status === "success" && !userNeedsMobile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href="/sign-in"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-center hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            eClassify
          </Link>
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication
            </CardTitle>
            <CardDescription className="text-gray-500">
              Loading authentication...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <div className="text-lg font-medium text-blue-600">
              Please wait...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <AuthCallbackContent />
      </Suspense>
      <Footer />
    </>
  )
}