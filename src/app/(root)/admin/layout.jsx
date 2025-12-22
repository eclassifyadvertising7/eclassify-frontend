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

  // Protect admin route
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/sign-in")
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        toast.error("Access denied. Admin privileges required.")
        router.replace("/")
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Show loading state only briefly
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authorization
  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "super_admin")) {
    return null
  }

  return (
    <div className="admin-layout flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
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
