"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useAuth } from "@/app/context/AuthContext"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname === "/admin") return "dashboard"
    if (pathname.startsWith("/admin/subscriptions")) return "subscription-plans"
    if (pathname.startsWith("/admin/profile")) return "profile"
    if (pathname.startsWith("/admin/categories")) return "categories"
    if (pathname.startsWith("/admin/car-data")) return "car-data"
    if (pathname.startsWith("/admin/ads")) return "ads"
    if (pathname.startsWith("/admin/users")) return "users"
    if (pathname.startsWith("/admin/payments")) return "payments"
    if (pathname.startsWith("/admin/reports")) return "reports"
    if (pathname.startsWith("/admin/settings")) return "settings"
    return "dashboard"
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])

  // Protect admin route
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        toast.error("Please login to access admin panel")
        router.push("/sign-in")
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        toast.error("Access denied. Admin privileges required.")
        router.push("/profile")
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Show loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Check authorization
  if (user?.role !== "admin" && user?.role !== "super_admin") {
    return null
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Navigate to appropriate route
    if (tab === "dashboard") {
      router.push("/admin")
    } else if (tab === "subscription-plans") {
      router.push("/admin/subscriptions")
    } else if (tab === "categories") {
      router.push("/admin/categories")
    } else if (tab === "car-data") {
      router.push("/admin/car-data")
    } else if (tab === "profile") {
      router.push("/admin/profile")
    } else if (tab === "ads") {
      router.push("/admin/ads")
    } else {
      // For other tabs, stay on main admin page
      router.push("/admin")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen} 
          setActiveTab={handleTabChange} 
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
