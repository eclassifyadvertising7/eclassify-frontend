"use client"

import { useEffect, useState } from "react"
import { X, Bell, Check, Trash2, Settings, CheckCheck } from "lucide-react"
import notificationsService from "@/app/services/api/notificationsService"
import { useSocket } from "@/app/context/SocketContext"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all") // all, unread
  const { notificationUnreadCount } = useSocket()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, filter])

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = {
        page: 1,
        limit: 50
      }
      if (filter === "unread") {
        params.isRead = false
      }
      const response = await notificationsService.getNotifications(params)
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      fetchNotifications()
    } catch (error) {
      toast.error("Failed to mark as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      toast.success("All notifications marked as read")
      fetchNotifications()
    } catch (error) {
      toast.error("Failed to mark all as read")
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationsService.deleteNotification(id)
      toast.success("Notification deleted")
      fetchNotifications()
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      listing: "bg-blue-100 text-blue-800",
      chat: "bg-green-100 text-green-800",
      subscription: "bg-purple-100 text-purple-800",
      system: "bg-gray-100 text-gray-800",
      security: "bg-red-100 text-red-800",
      marketing: "bg-yellow-100 text-yellow-800"
    }
    return colors[category] || colors.system
  }

  const getCategoryIcon = (category) => {
    return category?.charAt(0).toUpperCase() || "N"
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {notificationUnreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                {notificationUnreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Close (ESC)"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === "unread"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread {notificationUnreadCount > 0 && `(${notificationUnreadCount})`}
          </button>
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-sm text-primary hover:text-secondary transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-sm text-gray-500">
                {filter === "unread" 
                  ? "You're all caught up!" 
                  : "You'll see notifications here when you get them"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Category Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getCategoryColor(notification.category)}`}>
                      {getCategoryIcon(notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-primary hover:bg-blue-100 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
          }
          to { 
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
