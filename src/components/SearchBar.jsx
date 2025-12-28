"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { logSearchActivity, getSearchHistory } from "@/app/services/api/searchService"
import { useAuth } from "@/app/context/AuthContext"

export default function SearchBar({ 
  placeholder = "Find your dream car...",
  className = "",
  onSearch 
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef(null)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Load search history when input is focused
  useEffect(() => {
    if (showHistory && isAuthenticated) {
      loadSearchHistory()
    }
  }, [showHistory, isAuthenticated])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadSearchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await getSearchHistory(1, 5)
      if (response.success && response.data?.searches) {
        // Extract unique search queries
        const uniqueQueries = [...new Set(
          response.data.searches
            .filter(s => s.searchQuery)
            .map(s => s.searchQuery)
        )].slice(0, 5)
        setSearchHistory(uniqueQueries)
      }
    } catch (error) {
      console.error("Failed to load search history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return

    // Log search activity only for authenticated users
    if (isAuthenticated) {
      try {
        await logSearchActivity({
          searchQuery: query.trim(),
          resultsCount: 0
        })
      } catch (error) {
        console.error("Failed to log search:", error)
      }
    }

    // Perform search
    if (onSearch) {
      onSearch(query.trim())
    } else {
      // Default behavior: navigate to browse page with search query
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`)
    }

    setShowHistory(false)
    setSearchQuery("") // Clear search input after search
  }

  const handleHistoryClick = (query) => {
    setSearchQuery(query)
    handleSearch(query)
  }

  const clearHistory = (e) => {
    e.stopPropagation()
    setSearchHistory([])
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div ref={searchRef} className={`relative flex-1 ${className}`}>
      <div className="flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-l-md shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button 
          onClick={() => handleSearch()}
          className="px-6 py-2 bg-primary text-white rounded-r-md hover:bg-cyan-600 flex items-center"
        >
          <Search className="h-4 w-4 mr-2" />
        </button>
      </div>

      {/* Search History Dropdown */}
      {showHistory && isAuthenticated && searchHistory.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase">Recent Searches</span>
            <button
              onClick={clearHistory}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
          ) : (
            <ul className="py-1">
              {searchHistory.map((query, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleHistoryClick(query)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 group"
                  >
                    <Clock className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                    <span className="flex-1 text-gray-700 group-hover:text-gray-900">
                      {query}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
