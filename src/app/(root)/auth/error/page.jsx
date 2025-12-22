"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('message') || "Authentication failed"

  const getErrorDetails = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('cancelled')) {
      return {
        title: "Authentication Cancelled",
        description: "You cancelled the authentication process.",
        suggestion: "Please try signing in again to continue."
      }
    }
    
    if (lowerMessage.includes('failed')) {
      return {
        title: "Authentication Failed",
        description: "We couldn't authenticate your account.",
        suggestion: "Please check your credentials and try again."
      }
    }
    
    if (lowerMessage.includes('processing')) {
      return {
        title: "Processing Error",
        description: "There was an error processing your authentication.",
        suggestion: "Please try again or contact support if the problem persists."
      }
    }
    
    return {
      title: "Authentication Error",
      description: message,
      suggestion: "Please try again or contact support if you need assistance."
    }
  }

  const errorDetails = getErrorDetails(decodeURIComponent(errorMessage))

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
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
                {errorDetails.title}
              </CardTitle>
              <CardDescription className="text-gray-500">
                Something went wrong during authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>

              {/* Error Message */}
              <div className="space-y-3">
                <p className="text-gray-700 font-medium">
                  {errorDetails.description}
                </p>
                <p className="text-sm text-gray-600">
                  {errorDetails.suggestion}
                </p>
              </div>

              {/* Error Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-mono break-all">
                  {decodeURIComponent(errorMessage)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/sign-in">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Try Sign In Again
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Need help?{" "}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    Contact Support
                  </Link>
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