"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import favoritesService from "@/app/services/api/favoritesService"
import ListingCard from "@/components/ListingCard"
import { toast } from "sonner"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }
    fetchFavorites()
  }, [isAuthenticated, currentPage])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await favoritesService.getUserFavorites({
        page: currentPage,
        limit: 20
      })
      
      if (response.success) {
        setFavorites(response.data.favorites)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast.error("Failed to load favorites")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (listingId) => {
    try {
      await favoritesService.removeFromFavorites(listingId)
      toast.success("Removed from favorites")
      fetchFavorites()
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast.error("Failed to remove from favorites")
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <FooterSection />
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            My Favourites
          </h1>
          <p className="text-gray-600 mt-2">
            {pagination?.totalItems || 0} saved listings
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500">Start adding listings to your favorites to see them here</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <ListingCard
                  key={favorite.id}
                  listing={favorite.listing}
                  onFavoriteRemove={() => handleRemoveFavorite(favorite.listingId)}
                  showFavoriteButton={true}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </section>
      <FooterSection />
    </>
  )
}
