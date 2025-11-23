"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/app/services"
import { useRouter } from "next/navigation"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Load user from localStorage on mount and validate token
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authService.getCurrentUser()
        const isAuth = authService.isAuthenticated()
        
        if (storedUser && isAuth) {
          setUser(storedUser)
          setIsAuthenticated(true)
          
          // Validate token by fetching fresh profile data
          try {
            const response = await authService.getProfile()
            if (response.success && response.data) {
              setUser(response.data)
              localStorage.setItem('user', JSON.stringify(response.data))
            }
          } catch (error) {
            // If profile fetch fails with 401, token is invalid
            if (error.status === 401) {
              console.log("Token invalid, logging out")
              await authService.logout()
              setUser(null)
              setIsAuthenticated(false)
            }
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Refresh user profile from API
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      // With 7-day tokens, 401 likely means token is invalid, not expired
      // Just logout instead of trying to refresh
      if (error.status === 401) {
        await logout()
      }
      throw error
    }
  }

  // Login function
  const login = async (credentials) => {
    const response = await authService.login(credentials)
    if (response.success && response.data) {
      setUser(response.data.user)
      setIsAuthenticated(true)
    }
    return response
  }

  // Signup function
  const signup = async (userData) => {
    const response = await authService.signup(userData)
    if (response.success && response.data) {
      setUser(response.data.user)
      setIsAuthenticated(true)
    }
    return response
  }

  // Logout function
  const logout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    router.push("/sign-in")
  }

  // Update user in context
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === "admin" || user?.role === "super_admin"
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    refreshUser,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
