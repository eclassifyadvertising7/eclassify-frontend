"use client"
import { BarChart3, Users, BookOpen, Calendar, Settings, Home, Award, X, FolderTree, Car, FileText, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname()
  
  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: Home, href: "/admin" },
    { id: "ads", name: "Ads", icon: BookOpen, href: "/admin/ads" },
    { id: "users", name: "Users", icon: Users, href: "/admin/users" },
    { id: "categories", name: "Categories", icon: FolderTree, href: "/admin/categories" },
    { id: "subscription-plans", name: "Subscription Plans", icon: Award, href: "/admin/subscriptions" },
    { id: "user-subscriptions", name: "User Subscriptions", icon: Users, href: "/admin/user-subscriptions" },
    { id: "manual-payments", name: "Manual Payments", icon: CreditCard, href: "/admin/manual-payments" },
    { id: "payments", name: "Payments", icon: BarChart3, href: "/admin/payments" },
    { id: "reports", name: "Reports", icon: Calendar, href: "/admin/reports" },
    { id: "settings", name: "Settings", icon: Settings, href: "/admin/settings" },
    { id: "car-data", name: "Car Data", icon: Car, href: "/admin/car-data" },
    { id: "data-requests", name: "Data Requests", icon: FileText, href: "/admin/data-requests" },
  ]

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">eC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">eClassify</h1>
            <p className="text-xs text-gray-500 -mt-1">Buy & Sell Anything</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-6 px-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 mb-1 ${
              isActive(item.href)
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
