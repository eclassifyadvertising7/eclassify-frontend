/**
 * useFavorites Hook
 * Custom hook for managing user favorites functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { favoritesService } from '@/app/services';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteStats, setFavoriteStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  /**
   * Fetch user's favorites with optional filters
   */
  const fetchFavorites = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await favoritesService.getUserFavorites(params);
      if (response.success) {
        setFavorites(response.data.favorites);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch user's favorite statistics
   */
  const fetchFavoriteStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await favoritesService.getFavoriteStats();
      if (response.success) {
        setFavoriteStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching favorite stats:', error);
    }
  }, [isAuthenticated]);

  /**
   * Add listing to favorites
   */
  const addToFavorites = useCallback(async (listingId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return false;
    }

    try {
      const response = await favoritesService.addToFavorites(listingId);
      if (response.success) {
        toast.success('Added to favorites!');
        // Refresh favorites list if it's loaded
        if (favorites.length > 0) {
          fetchFavorites();
        }
        // Refresh stats
        fetchFavoriteStats();
        return true;
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
      return false;
    }
  }, [isAuthenticated, favorites.length, fetchFavorites, fetchFavoriteStats]);

  /**
   * Remove listing from favorites
   */
  const removeFromFavorites = useCallback(async (listingId) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage favorites');
      return false;
    }

    try {
      const response = await favoritesService.removeFromFavorites(listingId);
      if (response.success) {
        toast.success('Removed from favorites');
        // Update local state immediately
        setFavorites(prev => prev.filter(fav => fav.listingId !== parseInt(listingId)));
        // Refresh stats
        fetchFavoriteStats();
        return true;
      }
    } catch (error) {
      if (error.status === 404) {
        toast.error('Not found in favorites');
      } else {
        toast.error('Failed to remove from favorites');
      }
      return false;
    }
  }, [isAuthenticated, fetchFavoriteStats]);

  /**
   * Check if a listing is favorited
   */
  const checkIsFavorited = useCallback(async (listingId) => {
    if (!isAuthenticated) return false;

    try {
      const response = await favoritesService.checkIsFavorited(listingId);
      return response.success ? response.data.isFavorited : false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }, [isAuthenticated]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(async (listingId, currentStatus) => {
    if (currentStatus) {
      return await removeFromFavorites(listingId);
    } else {
      return await addToFavorites(listingId);
    }
  }, [addToFavorites, removeFromFavorites]);

  // Load favorites and stats on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteStats();
    }
  }, [isAuthenticated, fetchFavoriteStats]);

  return {
    // State
    favorites,
    favoriteStats,
    loading,
    pagination,
    
    // Actions
    fetchFavorites,
    fetchFavoriteStats,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorited,
    toggleFavorite,
    
    // Utilities
    isAuthenticated
  };
};

/**
 * useFavoriteStatus Hook
 * Lightweight hook for checking and toggling favorite status of a single listing
 */
export const useFavoriteStatus = (listingId) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check favorite status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated || !listingId) return;

      try {
        const response = await favoritesService.checkIsFavorited(listingId);
        if (response.success) {
          setIsFavorited(response.data.isFavorited);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkStatus();
  }, [listingId, isAuthenticated]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        const response = await favoritesService.removeFromFavorites(listingId);
        if (response.success) {
          setIsFavorited(false);
          toast.success('Removed from favorites');
        }
      } else {
        const response = await favoritesService.addToFavorites(listingId);
        if (response.success) {
          setIsFavorited(true);
          toast.success('Added to favorites!');
        }
      }
    } catch (error) {
      if (error.status === 400 && !isFavorited) {
        toast.error('Already in favorites');
        setIsFavorited(true);
      } else if (error.status === 404 && isFavorited) {
        toast.error('Not found in favorites');
        setIsFavorited(false);
      } else {
        toast.error(`Failed to ${isFavorited ? 'remove from' : 'add to'} favorites`);
      }
    } finally {
      setLoading(false);
    }
  }, [listingId, isFavorited, isAuthenticated]);

  return {
    isFavorited,
    loading,
    toggleFavorite,
    isAuthenticated
  };
};