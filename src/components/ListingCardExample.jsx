/**
 * ListingCardExample Component
 * Example implementation showing how to integrate favorites functionality into listing cards
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Eye } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import FavoriteCount, { SimpleFavoriteCount } from './FavoriteCount';

/**
 * Standard Listing Card with Favorites
 * Use this pattern for listing grids and search results
 */
export const ListingCard = ({ listing, currentUser }) => {
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

  const primaryImage = listing.media?.find(m => m.mediaType === 'image')?.mediaUrl;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-gray-200 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Eye className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Overlay Elements */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Category Badge */}
          <Badge variant="secondary" className="bg-white/90 text-xs">
            {listing.category?.name}
          </Badge>

          {/* Favorite Button */}
          <FavoriteButton 
            listingId={listing.id} 
            iconOnly 
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          />
        </div>

        {/* Status Badge */}
        {listing.status !== 'active' && (
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant={listing.status === 'sold' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {listing.status.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-xl font-bold text-primary mb-3">
          {formatPrice(listing.price)}
          {listing.priceNegotiable && (
            <span className="text-sm font-normal text-gray-500 ml-1">
              (Negotiable)
            </span>
          )}
        </p>

        {/* Location */}
        {listing.locality && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{listing.locality}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Show favorite count for listing owner or admin */}
          <SimpleFavoriteCount 
            favoriteCount={listing.favoriteCount}
            listingOwnerId={listing.userId}
          />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Detailed Listing Card for Product Details Page
 * Shows more information and favorite count for owners/admins
 */
export const DetailedListingCard = ({ listing, currentUser }) => {
  const isOwner = currentUser?.id === listing.userId;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Gallery */}
          <div className="md:w-1/2">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {listing.media?.[0] ? (
                <img
                  src={listing.media[0].mediaUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  ₹{listing.price?.toLocaleString()}
                </p>
              </div>

              {/* Favorite Button */}
              <FavoriteButton 
                listingId={listing.id} 
                showText 
                variant="outline"
              />
            </div>

            {/* Stats for Owner/Admin */}
            {(isOwner || isAdmin) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Listing Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-lg font-semibold">{listing.viewCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Favorites</p>
                    <div className="flex items-center gap-2">
                      <FavoriteCount 
                        favoriteCount={listing.favoriteCount}
                        listingOwnerId={listing.userId}
                        showLabel={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other listing details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{listing.category?.name}</Badge>
                <Badge 
                  variant={listing.status === 'active' ? 'default' : 'secondary'}
                >
                  {listing.status}
                </Badge>
              </div>

              {listing.locality && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.locality}</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Compact Listing Card for Lists
 * Horizontal layout for search results or admin panels
 */
export const CompactListingCard = ({ listing, currentUser }) => {
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price?.toLocaleString()}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {listing.media?.[0] ? (
              <img
                src={listing.media[0].mediaUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Eye className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {listing.title}
                </h3>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(listing.price)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {listing.category?.name}
                  </Badge>
                  <SimpleFavoriteCount 
                    favoriteCount={listing.favoriteCount}
                    listingOwnerId={listing.userId}
                    size="sm"
                  />
                </div>
              </div>

              <FavoriteButton 
                listingId={listing.id} 
                iconOnly 
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;