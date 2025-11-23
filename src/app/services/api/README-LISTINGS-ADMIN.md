# Listings Admin Service - Phase 2 Integration

## Overview
Phase 2 of the listings feature is now complete. Admin panel integration with backend API for managing all listings, approving/rejecting submissions, and managing featured listings.

## Implementation Status

### ✅ Completed
- Admin listing service (`listingAdminService.js`)
- Ads Management UI component with full backend integration
- Approve/Reject workflow with reason tracking
- Featured listings management
- Admin statistics dashboard
- Filters and search functionality
- Pagination support
- Delete listings (admin)

## Files Created/Updated

### New Files
1. **`src/app/services/api/listingAdminService.js`**
   - Admin panel API service
   - All Phase 2 endpoints integrated

2. **`src/app/(root)/admin/ads/page.jsx`**
   - Admin ads page route

3. **`src/app/services/api/README-LISTINGS-ADMIN.md`**
   - This documentation file

### Updated Files
1. **`src/components/admin/ads-management.jsx`**
   - Complete rewrite with backend integration
   - Real-time data fetching
   - Approve/Reject modals
   - Featured management
   - Filters and pagination

2. **`src/app/(root)/admin/layout.jsx`**
   - Added ads route handling

## Admin Service API

### Available Methods

```javascript
import { listingAdminService } from '@/app/services/api/listingAdminService'

// Get all listings with filters
const listings = await listingAdminService.getAllListings({
  status: 'pending',
  categoryId: 1,
  search: 'toyota',
  page: 1,
  limit: 20
})

// Get statistics
const stats = await listingAdminService.getStats()

// Get listing by ID (with user info)
const listing = await listingAdminService.getListingById(123)

// Approve listing
await listingAdminService.approveListing(123)

// Reject listing with reason
await listingAdminService.rejectListing(123, 'Images are not clear')

// Update featured status
await listingAdminService.updateFeaturedStatus(123, true, 7) // Featured for 7 days

// Delete listing
await listingAdminService.deleteListing(123)
```

## Features

### 1. Listings Management
- View all listings across all users
- Filter by status, category, search
- Pagination support
- Real-time statistics

### 2. Approval Workflow
- **Approve**: One-click approval for pending listings
- **Reject**: Reject with mandatory reason (user gets notified)
- Status badges for easy identification

### 3. Featured Management
- Make listings featured with custom duration (1-30 days)
- Remove featured status
- Visual indicator (star icon) for featured listings

### 4. Filters & Search
- Status filter (draft, pending, active, expired, sold, rejected)
- Search by title/description
- Pagination controls

### 5. Statistics Dashboard
- Total listings count
- Pending approvals count
- Active listings count
- Rejected listings count

## UI Components

### Ads Management Component
Located at: `src/components/admin/ads-management.jsx`

**Features:**
- Responsive table layout
- Image thumbnails
- User information display
- Action buttons (Approve, Reject, Featured, Delete)
- Modal dialogs for reject and featured actions
- Loading states
- Empty states
- Toast notifications

### Status Badges
- **Draft**: Gray
- **Pending**: Yellow
- **Active**: Green
- **Expired**: Orange
- **Sold**: Blue
- **Rejected**: Red

## Usage

### Access Admin Ads Page
Navigate to: `/admin` → Click "Ads" in sidebar → `/admin/ads`

### Approve a Listing
1. Find pending listing in the table
2. Click the green checkmark icon
3. Listing is immediately approved and becomes active

### Reject a Listing
1. Find pending listing in the table
2. Click the red X icon
3. Enter rejection reason in modal
4. Click "Reject Listing"
5. User receives notification with reason

### Make Listing Featured
1. Find active/expired listing
2. Click the star icon
3. Set duration (1-30 days)
4. Click "Make Featured"

### Remove Featured Status
1. Find featured listing (yellow star)
2. Click the star icon
3. Click "Remove Featured"

## API Endpoints Used

All endpoints from `API-Docs/listings.md` Phase 2:

- `GET /api/panel/listings` - Get all listings
- `GET /api/panel/listings/stats` - Get statistics
- `GET /api/panel/listings/:id` - Get listing details
- `PATCH /api/panel/listings/approve/:id` - Approve listing
- `PATCH /api/panel/listings/reject/:id` - Reject listing
- `PATCH /api/panel/listings/featured/:id` - Update featured
- `DELETE /api/panel/listings/:id` - Delete listing

## Error Handling

All API calls include proper error handling with toast notifications:
- Success messages for completed actions
- Error messages for failed operations
- Loading states during API calls

## Next Steps (Phase 3)

Phase 3 will implement public browsing features:
- Browse active listings (public)
- Search and advanced filters
- View listing details by slug
- Track view counts
- Featured listings carousel

## Testing

To test the admin integration:

1. **Login as Admin**
   - Navigate to `/sign-in`
   - Login with admin credentials

2. **View Listings**
   - Go to `/admin/ads`
   - Should see all listings from all users

3. **Test Approval**
   - Create a listing as regular user
   - Submit for approval
   - Login as admin
   - Approve the listing

4. **Test Rejection**
   - Submit another listing
   - Reject with reason
   - Check user sees rejection reason

5. **Test Featured**
   - Make an active listing featured
   - Set duration
   - Verify featured status

## Notes

- Admin role required (`role: 'admin'` or `role: 'super_admin'`)
- All actions are logged on backend
- Soft delete preserves data
- Featured listings auto-expire after duration
- Rejection reasons are stored and visible to users
