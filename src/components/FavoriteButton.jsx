/**
 * FavoriteButton Component
 * Reusable button for toggling favorite status of listings
 */

import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoriteStatus } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

const FavoriteButton = ({ 
  listingId, 
  variant = 'outline',
  size = 'sm',
  showText = false,
  className = '',
  iconOnly = false,
  ...props 
}) => {
  const { isFavorited, loading, toggleFavorite, isAuthenticated } = useFavoriteStatus(listingId);

  if (!isAuthenticated) {
    return null; // Don't show favorite button for unauthenticated users
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "p-2 rounded-full transition-colors duration-200",
          "hover:bg-white/20 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isFavorited 
            ? "text-red-500 hover:text-red-600" 
            : "text-white hover:text-red-200",
          className
        )}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart 
            className={cn(
              "h-5 w-5 transition-all duration-200",
              isFavorited ? "fill-current" : "fill-none"
            )} 
          />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "transition-all duration-200",
        isFavorited && variant === 'outline' && "border-red-500 text-red-500 hover:bg-red-50",
        isFavorited && variant === 'default' && "bg-red-500 hover:bg-red-600",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            "h-4 w-4 transition-all duration-200",
            showText && "mr-2",
            isFavorited ? "fill-current" : "fill-none"
          )} 
        />
      )}
      {showText && (
        <span>
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;