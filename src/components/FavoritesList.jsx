"use client";

/**
 * FavoritesList Component
 * Display user's favorite listings with pagination and filters
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Grid, List, Filter, Loader2, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import FavoriteButton from './FavoriteButton';
import { cn } from '@/lib/utils';

const FavoritesList = ({ 
  showFilters = true, 
  showStats = true,
  viewMode: initialViewMode = 'grid',
  itemsPerPage = 12 
}) => {
  const { 
    favorites, 
    favoriteStats, 
    loading, 
    pagination, 
    fetchFavorites, 
    isAuthenticated 
  } = useFavorites();

  const [viewMode, setViewMode] = useState(initialViewMode);
  const [filters, setFilters] = useState({
    categoryId: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1
  });

  // Fetch favorites when component mounts or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites({
        ...filters,
        limit: itemsPerPage
      });
    }
  }, [isAuthenticated, filters, itemsPerPage, fetchFavorites]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    }
    return `₹${price}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">
            Please login to view your favorites
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && favoriteStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Favorites</p>
                  <p className="text-2xl font-bold">{favoriteStats.totalFavorites}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          {favoriteStats.favoritesByCategory?.map((category) => (
            <Card key={category.categoryId}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{category.listing.category.name}</p>
                    <p className="text-2xl font-bold">{category.count}</p>
                  </div>
                  <Badge variant="secondary">{category.listing.category.name}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Header with Filters and View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              My Favorites
              {pagination.totalItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pagination.totalItems}
                </Badge>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Options */}
              {showFilters && (
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-DESC">Newest First</SelectItem>
                    <SelectItem value="created_at-ASC">Oldest First</SelectItem>
                    <SelectItem value="price-DESC">Price: High to Low</SelectItem>
                    <SelectItem value="price-ASC">Price: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading favorites...</span>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 text-center max-w-md">
                Start exploring listings and add them to your favorites to see them here.
              </p>
            </div>
          ) : (
            <>
              {/* Favorites Grid/List */}
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {favorites.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite}
                    viewMode={viewMode}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={pagination.currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Individual Favorite Card Component
const FavoriteCard = ({ favorite, viewMode, formatPrice, formatDate }) => {
  const { listing } = favorite;
  const primaryImage = listing.media?.find(m => m.mediaType === 'image')?.mediaUrl;

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Heart className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(listing.price)}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(favorite.createdAt)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {listing.category.name}
                    </Badge>
                  </div>
                </div>
                <FavoriteButton listingId={listing.id} iconOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Heart className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <div className="absolute top-3 right-3">
          <FavoriteButton listingId={listing.id} iconOnly />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-xs">
            {listing.category.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
        <p className="text-xl font-bold text-primary mb-3">
          {formatPrice(listing.price)}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(favorite.createdAt)}
          </div>
          <Badge 
            variant={listing.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {listing.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesList;