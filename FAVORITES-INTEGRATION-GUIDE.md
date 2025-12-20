# User Favorites Integration Guide

This guide explains how to integrate the user favorites functionality into your marketplace platform.

## 🚀 Quick Start

The favorites system has been fully integrated with the following components:

### 1. **Profile Page Integration** ✅
- **Location**: `src/app/(root)/profile/page.jsx`
- **Features**: 
  - Tab navigation between Profile and Favorites
  - Complete favorites list with pagination
  - Favorite statistics display
  - Filter and sort options

### 2. **API Service Layer** ✅
- **Location**: `src/app/services/api/favoritesService.js`
- **Features**:
  - Add/remove favorites
  - Get user favorites with pagination
  - Check favorite status
  - Get favorite statistics
  - Admin analytics endpoints

### 3. **React Hooks** ✅
- **Location**: `src/hooks/useFavorites.js`
- **Hooks**:
  - `useFavorites()` - Complete favorites management
  - `useFavoriteStatus(listingId)` - Single listing favorite status

### 4. **UI Components** ✅
- **FavoriteButton**: `src/components/FavoriteButton.jsx`
- **FavoritesList**: `src/components/FavoritesList.jsx`
- **FavoriteCount**: `src/components/FavoriteCount.jsx`

## 📋 Implementation Checklist

### ✅ Completed Features

1. **Mark/Unmark Favorites**
   - ✅ Authenticated users can add listings to favorites
   - ✅ Remove listings from favorites
   - ✅ Toggle favorite status with visual feedback
   - ✅ Toast notifications for user feedback

2. **Favorites List**
   - ✅ Display user's favorite listings
   - ✅ Pagination support (20 items per page)
   - ✅ Filter by category, price range
   - ✅ Sort by date, price
   - ✅ Grid and list view modes
   - ✅ Favorite statistics display

3. **Favorite Count Display**
   - ✅ Show favorite count for listing owners
   - ✅ Show favorite count for super admins
   - ✅ Hide count from regular users (privacy)
   - ✅ Multiple display variants (badge, simple)

4. **Profile Integration**
   - ✅ Favorites tab in user profile
   - ✅ Statistics overview
   - ✅ Seamless navigation

## 🔧 Usage Examples

### 1. Adding Favorite Button to Listing Cards

```jsx
import FavoriteButton from '@/components/FavoriteButton';

// In your listing card component
<FavoriteButton 
  listingId={listing.id} 
  iconOnly 
  className="absolute top-3 right-3"
/>

// With text
<FavoriteButton 
  listingId={listing.id} 
  showText 
  variant="outline"
/>
```

### 2. Displaying Favorite Count (Owner/Admin Only)

```jsx
import FavoriteCount, { SimpleFavoriteCount } from '@/components/FavoriteCount';

// Badge style (favoriteCount comes from listing API response)
<FavoriteCount 
  favoriteCount={listing.favoriteCount}
  listingOwnerId={listing.userId}
/>

// Simple count
<SimpleFavoriteCount 
  favoriteCount={listing.favoriteCount}
  listingOwnerId={listing.userId}
  size="sm"
/>
```

### 3. Using Favorites Hook

```jsx
import { useFavorites, useFavoriteStatus } from '@/hooks/useFavorites';

// Complete favorites management
const { 
  favorites, 
  favoriteStats, 
  loading, 
  fetchFavorites, 
  addToFavorites, 
  removeFromFavorites 
} = useFavorites();

// Single listing status
const { isFavorited, loading, toggleFavorite } = useFavoriteStatus(listingId);
```

### 4. Integrating into Existing Components

See `src/components/ListingCardExample.jsx` for complete examples of:
- Standard listing cards with favorites
- Detailed product pages with stats
- Compact list items

## 🎯 Integration Points

### Where to Add Favorite Buttons

1. **Listing Grid/Search Results**
   ```jsx
   // Top-right corner of listing cards
   <div className="absolute top-3 right-3">
     <FavoriteButton listingId={listing.id} iconOnly />
   </div>
   ```

2. **Product Details Page**
   ```jsx
   // Next to main action buttons
   <div className="flex gap-3">
     <Button>Contact Seller</Button>
     <FavoriteButton listingId={listing.id} showText />
   </div>
   ```

3. **Search Results**
   ```jsx
   // In list view items
   <FavoriteButton listingId={listing.id} size="sm" />
   ```

### Where to Show Favorite Counts

1. **For Listing Owners** (My Listings page)
   ```jsx
   <SimpleFavoriteCount 
     favoriteCount={listing.favoriteCount}
     listingOwnerId={listing.userId}
   />
   ```

2. **For Admins** (Admin Dashboard)
   ```jsx
   <FavoriteCount 
     favoriteCount={listing.favoriteCount}
     listingOwnerId={listing.userId}
     showLabel
   />
   ```

## 🔐 Authentication & Permissions

### User Permissions
- **Authenticated Users**: Can add/remove favorites, view their favorites
- **Listing Owners**: Can see favorite count on their own listings
- **Admins/Super Admins**: Can see favorite count on all listings
- **Unauthenticated Users**: Cannot interact with favorites (buttons hidden)

### API Endpoints Used
- `POST /api/end-user/favorites` - Add to favorites
- `DELETE /api/end-user/favorites/:listingId` - Remove from favorites
- `GET /api/end-user/favorites` - Get user favorites
- `GET /api/end-user/favorites/check/:listingId` - Check favorite status
- `GET /api/end-user/favorites/stats` - Get user stats
- `GET /api/panel/favorites/analytics/most-favorited` - Admin analytics

## 🎨 Styling & Customization

### FavoriteButton Variants
```jsx
// Icon only (for overlays)
<FavoriteButton listingId={id} iconOnly />

// With text
<FavoriteButton listingId={id} showText />

// Different sizes
<FavoriteButton listingId={id} size="sm" />
<FavoriteButton listingId={id} size="lg" />

// Custom styling
<FavoriteButton 
  listingId={id} 
  className="bg-white/20 backdrop-blur-sm" 
/>
```

### FavoriteCount Variants
```jsx
// Badge style (using favoriteCount from listing data)
<FavoriteCount favoriteCount={listing.favoriteCount} listingOwnerId={ownerId} />

// Simple count
<SimpleFavoriteCount favoriteCount={listing.favoriteCount} listingOwnerId={ownerId} />

// Different sizes
<SimpleFavoriteCount favoriteCount={listing.favoriteCount} listingOwnerId={ownerId} size="lg" />
```

## 🚀 Next Steps

### Recommended Integrations

1. **Add to Existing Listing Components**
   - Find your listing card components
   - Add `<FavoriteButton listingId={listing.id} iconOnly />` to card overlays
   - Add `<SimpleFavoriteCount />` for owners/admins

2. **Product Details Pages**
   - Add favorite button next to main actions
   - Show favorite count for owners/admins
   - Include in listing statistics section

3. **Admin Dashboard**
   - Use `favoritesService.getMostFavorited()` for analytics
   - Show favorite trends and popular listings
   - Add favorite count to listing management tables

4. **Search & Filter**
   - Consider adding "Show only favorites" filter
   - Sort by "Most favorited" option
   - Favorite-based recommendations

### Performance Considerations

1. **Lazy Loading**: Favorite counts are fetched on-demand
2. **Caching**: Consider implementing client-side caching for favorite status
3. **Batch Operations**: For listing grids, consider batch checking favorite status
4. **Optimistic Updates**: UI updates immediately, syncs with server

## 🐛 Troubleshooting

### Common Issues

1. **Favorite button not showing**
   - Check if user is authenticated
   - Verify `listingId` is provided

2. **Favorite count not displaying**
   - Ensure user is listing owner or admin
   - Check API permissions

3. **Toast notifications not working**
   - Verify Sonner is properly configured
   - Check import statements

### Debug Tips

```jsx
// Check authentication status
const { isAuthenticated, user } = useAuth();
console.log('Auth status:', isAuthenticated, user);

// Check favorite status
const { isFavorited, loading } = useFavoriteStatus(listingId);
console.log('Favorite status:', isFavorited, loading);
```

## 📚 API Reference

See `API-Docs/user-favorites.md` for complete API documentation including:
- Request/response formats
- Error handling
- Query parameters
- Authentication requirements

---

**🎉 Integration Complete!** 

The favorites system is now fully functional. Users can mark listings as favorites, view their favorites in their profile, and listing owners/admins can see favorite counts on their listings.