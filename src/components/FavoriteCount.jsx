/**
 * FavoriteCount Component
 * Display favorite count for listing owners and admins
 */

import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { cn } from '@/lib/utils';

const FavoriteCount = ({ 
  favoriteCount = 0,
  listingOwnerId, 
  className = '',
  variant = 'secondary',
  showIcon = true,
  showLabel = true 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user should see favorite count
  const canViewCount = isAuthenticated && (
    user?.role === 'admin' || 
    user?.role === 'super_admin' || 
    user?.id === listingOwnerId
  );

  // Don't render if user can't view count
  if (!canViewCount) {
    return null;
  }

  return (
    <Badge 
      variant={variant} 
      className={cn(
        "flex items-center gap-1",
        favoriteCount > 0 ? "text-red-600 border-red-200" : "text-gray-500",
        className
      )}
    >
      {showIcon && (
        <Heart 
          className={cn(
            "h-3 w-3",
            favoriteCount > 0 ? "fill-red-500 text-red-500" : "text-gray-400"
          )} 
        />
      )}
      <span>
        {favoriteCount}
        {showLabel && ` favorite${favoriteCount !== 1 ? 's' : ''}`}
      </span>
    </Badge>
  );
};

/**
 * SimpleFavoriteCount Component
 * Simplified version that just shows the number with heart icon
 */
export const SimpleFavoriteCount = ({ 
  favoriteCount = 0,
  listingOwnerId, 
  className = '',
  size = 'sm' 
}) => {
  const { user, isAuthenticated } = useAuth();

  const canViewCount = isAuthenticated && (
    user?.role === 'admin' || 
    user?.role === 'super_admin' || 
    user?.id === listingOwnerId
  );

  if (!canViewCount) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn(
      "flex items-center gap-1 text-gray-600",
      sizeClasses[size],
      className
    )}>
      <Heart 
        className={cn(
          iconSizes[size],
          favoriteCount > 0 ? "fill-red-500 text-red-500" : "text-gray-400"
        )} 
      />
      <span>{favoriteCount}</span>
    </div>
  );
};

export default FavoriteCount;