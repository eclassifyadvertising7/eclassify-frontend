"use client"

import { createContext, useContext, useEffect, useState } from "react"
import socketService from "@/app/services/socketService"
import { useAuth } from "./AuthContext"

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [chatUnreadCount, setChatUnreadCount] = useState(0)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)

  // Connect socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      // Small delay to ensure token is fully written to localStorage
      const timer = setTimeout(() => {
        const token = localStorage.getItem('access_token')
        
        if (token) {
          console.log('Connecting socket for authenticated user...')
          socketService.connect(token)
        } else {
          console.warn('User is authenticated but no access_token found in localStorage')
          console.log('Auth state:', { isAuthenticated, hasUser: !!user })
        }
      }, 100)

      return () => clearTimeout(timer)
    } else {
      // Disconnect when user logs out
      if (socketService.getConnectionStatus()) {
        console.log('Disconnecting socket - user not authenticated')
        socketService.disconnect()
      }
      setChatUnreadCount(0)
      setNotificationUnreadCount(0)
    }
  }, [isAuthenticated, user])

  // Setup event listeners
  useEffect(() => {
    // Connection status
    const unsubscribeStatus = socketService.on('connection_status', ({ connected }) => {
      setIsConnected(connected)
    })

    // Initial counts on connection
    const unsubscribeCounts = socketService.on('unread_counts', (data) => {
      console.log('Setting initial counts:', data)
      setChatUnreadCount(data.chats || 0)
      setNotificationUnreadCount(data.notifications || 0)
    })

    // Chat count updates
    const unsubscribeChat = socketService.on('chat_count_update', (data) => {
      console.log('Updating chat count:', data.count)
      setChatUnreadCount(data.count || 0)
    })

    // Notification count updates
    const unsubscribeNotification = socketService.on('notification_count_update', (data) => {
      console.log('Updating notification count:', data.count)
      setNotificationUnreadCount(data.count || 0)
    })

    // Error handling
    const unsubscribeError = socketService.on('socket_error', (error) => {
      console.error('Socket error:', error)
      // Handle auth errors
      if (error.message?.includes('auth') || error.message?.includes('token')) {
        // Token might be expired, let AuthContext handle it
        console.warn('Socket authentication error - token may be expired')
      }
    })

    // Cleanup listeners on unmount
    return () => {
      unsubscribeStatus()
      unsubscribeCounts()
      unsubscribeChat()
      unsubscribeNotification()
      unsubscribeError()
    }
  }, [])

  // Manual refresh function
  const refreshUnreadCounts = () => {
    socketService.requestUnreadCounts()
  }

  const value = {
    isConnected,
    chatUnreadCount,
    notificationUnreadCount,
    refreshUnreadCounts,
    socketService
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export default SocketContext
