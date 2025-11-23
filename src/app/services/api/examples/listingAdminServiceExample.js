/**
 * Listing Admin Service Usage Examples
 * Phase 2: Admin Panel Operations
 */

import { listingAdminService } from '../listingAdminService';

// ============================================
// Example 1: Get All Listings with Filters
// ============================================
async function getAllListingsExample() {
  try {
    // Get all pending listings
    const pendingListings = await listingAdminService.getAllListings({
      status: 'pending',
      page: 1,
      limit: 20
    });
    console.log('Pending listings:', pendingListings.data);
    console.log('Pagination:', pendingListings.pagination);

    // Get all active car listings
    const carListings = await listingAdminService.getAllListings({
      status: 'active',
      categoryId: 1, // Cars category
      page: 1,
      limit: 10
    });
    console.log('Active car listings:', carListings.data);

    // Search listings
    const searchResults = await listingAdminService.getAllListings({
      search: 'toyota',
      page: 1,
      limit: 20
    });
    console.log('Search results:', searchResults.data);

    // Get featured listings
    const featuredListings = await listingAdminService.getAllListings({
      isFeatured: true,
      status: 'active'
    });
    console.log('Featured listings:', featuredListings.data);

  } catch (error) {
    console.error('Error fetching listings:', error.message);
  }
}

// ============================================
// Example 2: Get Statistics
// ============================================
async function getStatsExample() {
  try {
    const stats = await listingAdminService.getStats();
    console.log('Listing statistics:', stats.data);
    // Output: { total: 1250, draft: 45, pending: 23, active: 980, expired: 150, sold: 42, rejected: 10 }
  } catch (error) {
    console.error('Error fetching stats:', error.message);
  }
}

// ============================================
// Example 3: Approve Listing
// ============================================
async function approveListingExample(listingId) {
  try {
    const result = await listingAdminService.approveListing(listingId);
    console.log('Listing approved:', result.data);
    // Listing status changes to 'active'
    // approvedAt, approvedBy, publishedAt, expiresAt are set
  } catch (error) {
    console.error('Error approving listing:', error.message);
  }
}

// ============================================
// Example 4: Reject Listing with Reason
// ============================================
async function rejectListingExample(listingId) {
  try {
    const reason = 'Images are not clear. Please upload better quality images showing all angles.';
    const result = await listingAdminService.rejectListing(listingId, reason);
    console.log('Listing rejected:', result.data);
    // Listing status changes to 'rejected'
    // User will be notified with the rejection reason
  } catch (error) {
    console.error('Error rejecting listing:', error.message);
  }
}

// ============================================
// Example 5: Make Listing Featured
// ============================================
async function makeListingFeaturedExample(listingId) {
  try {
    // Feature for 7 days
    const result = await listingAdminService.updateFeaturedStatus(listingId, true, 7);
    console.log('Listing featured:', result.data);
    // isFeatured = true, featuredUntil = 7 days from now
  } catch (error) {
    console.error('Error featuring listing:', error.message);
  }
}

// ============================================
// Example 6: Remove Featured Status
// ============================================
async function removeFeaturedExample(listingId) {
  try {
    const result = await listingAdminService.updateFeaturedStatus(listingId, false);
    console.log('Featured status removed:', result.data);
    // isFeatured = false, featuredUntil = null
  } catch (error) {
    console.error('Error removing featured:', error.message);
  }
}

// ============================================
// Example 7: Get Listing Details (Admin View)
// ============================================
async function getListingDetailsExample(listingId) {
  try {
    const listing = await listingAdminService.getListingById(listingId);
    console.log('Listing details:', listing.data);
    // Includes user information (fullName, email, mobile)
    // Includes all listing details, media, car/property data
  } catch (error) {
    console.error('Error fetching listing:', error.message);
  }
}

// ============================================
// Example 8: Delete Listing (Admin)
// ============================================
async function deleteListingExample(listingId) {
  try {
    await listingAdminService.deleteListing(listingId);
    console.log('Listing deleted successfully');
    // Soft delete - listing is marked as deleted but data is preserved
  } catch (error) {
    console.error('Error deleting listing:', error.message);
  }
}

// ============================================
// Example 9: Complete Approval Workflow
// ============================================
async function approvalWorkflowExample() {
  try {
    // Step 1: Get all pending listings
    const pending = await listingAdminService.getAllListings({
      status: 'pending',
      page: 1,
      limit: 10
    });

    console.log(`Found ${pending.data.length} pending listings`);

    // Step 2: Review each listing
    for (const listing of pending.data) {
      console.log(`\nReviewing listing: ${listing.title}`);
      
      // Get full details
      const details = await listingAdminService.getListingById(listing.id);
      
      // Check if listing has images
      if (!details.data.media || details.data.media.length === 0) {
        // Reject if no images
        await listingAdminService.rejectListing(
          listing.id,
          'At least one image is required for listing approval.'
        );
        console.log('Rejected: No images');
      } else {
        // Approve if has images
        await listingAdminService.approveListing(listing.id);
        console.log('Approved');
      }
    }

    // Step 3: Get updated stats
    const stats = await listingAdminService.getStats();
    console.log('\nUpdated statistics:', stats.data);

  } catch (error) {
    console.error('Error in approval workflow:', error.message);
  }
}

// ============================================
// Example 10: Featured Listings Management
// ============================================
async function manageFeaturedListingsExample() {
  try {
    // Get top performing active listings
    const topListings = await listingAdminService.getAllListings({
      status: 'active',
      sortBy: 'views_desc', // Sort by views (if supported)
      limit: 5
    });

    console.log('Top 5 listings by views:');
    
    // Feature the top listings
    for (const listing of topListings.data) {
      if (!listing.isFeatured) {
        await listingAdminService.updateFeaturedStatus(listing.id, true, 7);
        console.log(`Featured: ${listing.title} for 7 days`);
      }
    }

    // Get all currently featured listings
    const featured = await listingAdminService.getAllListings({
      isFeatured: true,
      status: 'active'
    });

    console.log(`\nTotal featured listings: ${featured.data.length}`);

  } catch (error) {
    console.error('Error managing featured listings:', error.message);
  }
}

// ============================================
// Example 11: Filter by Price Range
// ============================================
async function filterByPriceExample() {
  try {
    // Get luxury car listings (price > 20 lakhs)
    const luxuryCars = await listingAdminService.getAllListings({
      categoryId: 1, // Cars
      minPrice: 2000000,
      status: 'active',
      page: 1,
      limit: 20
    });

    console.log('Luxury car listings:', luxuryCars.data);

    // Get affordable properties (price < 50 lakhs)
    const affordableProperties = await listingAdminService.getAllListings({
      categoryId: 2, // Properties
      maxPrice: 5000000,
      status: 'active',
      page: 1,
      limit: 20
    });

    console.log('Affordable properties:', affordableProperties.data);

  } catch (error) {
    console.error('Error filtering by price:', error.message);
  }
}

// ============================================
// Example 12: User-Specific Listings
// ============================================
async function getUserListingsExample(userId) {
  try {
    const userListings = await listingAdminService.getAllListings({
      userId: userId,
      page: 1,
      limit: 50
    });

    console.log(`User ${userId} has ${userListings.pagination.total} listings`);
    console.log('Listings:', userListings.data);

  } catch (error) {
    console.error('Error fetching user listings:', error.message);
  }
}

// Export examples for use in components
export {
  getAllListingsExample,
  getStatsExample,
  approveListingExample,
  rejectListingExample,
  makeListingFeaturedExample,
  removeFeaturedExample,
  getListingDetailsExample,
  deleteListingExample,
  approvalWorkflowExample,
  manageFeaturedListingsExample,
  filterByPriceExample,
  getUserListingsExample
};
