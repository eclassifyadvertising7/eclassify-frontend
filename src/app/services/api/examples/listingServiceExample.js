/**
 * Listing Service Usage Examples
 * Demonstrates how to use the listing service for common operations
 */

import listingService from '../listingService';

// ============ Example 1: Create a Car Listing ============
export const createCarListingExample = async () => {
  try {
    const carData = {
      categoryId: 1,
      categoryType: 'car',
      title: 'Toyota Camry 2020 - Excellent Condition',
      description: 'Well maintained Toyota Camry with full service history. Single owner, all services done at authorized service center.',
      price: 1500000,
      priceNegotiable: true,
      stateId: 1,
      cityId: 5,
      locality: 'Andheri West',
      address: 'Near Metro Station',
      latitude: 19.1234,
      longitude: 72.5678,
      brandId: 10,
      modelId: 45,
      variantId: 120,
      year: 2020,
      registrationYear: 2020,
      condition: 'used',
      mileageKm: 25000,
      ownersCount: 1,
      fuelType: 'petrol',
      transmission: 'automatic',
      bodyType: 'sedan',
      color: 'White',
      engineCapacityCc: 2500,
      powerBhp: 180,
      seats: 5,
      registrationNumber: 'MH01AB1234',
      registrationStateId: 1,
      features: ['ABS', 'Airbags', 'Sunroof', 'Leather Seats']
    };

    const response = await listingService.createListing(carData);
    console.log('Car listing created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating car listing:', error.message);
    throw error;
  }
};

// ============ Example 2: Create a Property Listing ============
export const createPropertyListingExample = async () => {
  try {
    const propertyData = {
      categoryId: 2,
      categoryType: 'property',
      title: 'Spacious 3BHK Apartment in Prime Location',
      description: 'Beautiful 3BHK apartment with modern amenities in a prime location.',
      price: 8500000,
      priceNegotiable: true,
      stateId: 1,
      cityId: 5,
      locality: 'Bandra West',
      address: 'Near Linking Road',
      latitude: 19.0596,
      longitude: 72.8295,
      propertyType: 'apartment',
      listingType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      balconies: 2,
      areaSqft: 1200,
      carpetAreaSqft: 1000,
      floorNumber: 5,
      totalFloors: 10,
      ageYears: 3,
      facing: 'north',
      furnished: 'semi-furnished',
      parkingSpaces: 1,
      amenities: ['gym', 'pool', 'security', 'lift'],
      ownershipType: 'freehold',
      reraApproved: true,
      reraId: 'P51800012345'
    };

    const response = await listingService.createListing(propertyData);
    console.log('Property listing created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating property listing:', error.message);
    throw error;
  }
};

// ============ Example 3: Upload Media ============
export const uploadMediaExample = async (listingId, files) => {
  try {
    const formData = new FormData();
    
    // Add multiple files
    files.forEach(file => {
      formData.append('media', file);
    });

    const response = await listingService.uploadMedia(listingId, formData);
    console.log('Media uploaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error.message);
    throw error;
  }
};

// ============ Example 4: Complete Listing Flow ============
export const completeListingFlowExample = async (listingData, mediaFiles) => {
  try {
    // Step 1: Create listing
    console.log('Step 1: Creating listing...');
    const createResponse = await listingService.createListing(listingData);
    const listingId = createResponse.data.id;
    console.log('Listing created with ID:', listingId);

    // Step 2: Upload media
    console.log('Step 2: Uploading media...');
    const formData = new FormData();
    mediaFiles.forEach(file => formData.append('media', file));
    const mediaResponse = await listingService.uploadMedia(listingId, formData);
    console.log('Media uploaded:', mediaResponse.data.length, 'files');

    // Step 3: Submit for approval
    console.log('Step 3: Submitting for approval...');
    const submitResponse = await listingService.submitForApproval(listingId);
    console.log('Listing submitted:', submitResponse.data.status);

    return {
      listing: createResponse.data,
      media: mediaResponse.data,
      status: submitResponse.data.status
    };
  } catch (error) {
    console.error('Error in listing flow:', error.message);
    throw error;
  }
};

// ============ Example 5: Get My Listings with Filters ============
export const getMyListingsExample = async () => {
  try {
    // Get all active listings
    const activeListings = await listingService.getMyListings({
      status: 'active',
      page: 1,
      limit: 10
    });
    console.log('Active listings:', activeListings.data);

    // Get draft listings
    const draftListings = await listingService.getMyListings({
      status: 'draft'
    });
    console.log('Draft listings:', draftListings.data);

    // Search listings
    const searchResults = await listingService.getMyListings({
      search: 'Toyota',
      categoryId: 1
    });
    console.log('Search results:', searchResults.data);

    return {
      active: activeListings.data,
      draft: draftListings.data,
      search: searchResults.data
    };
  } catch (error) {
    console.error('Error getting listings:', error.message);
    throw error;
  }
};

// ============ Example 6: Update Listing ============
export const updateListingExample = async (listingId) => {
  try {
    const updateData = {
      title: 'Updated Toyota Camry 2020 - Price Reduced',
      price: 1450000,
      description: 'Updated description with price reduction...',
      priceNegotiable: true
    };

    const response = await listingService.updateListing(listingId, updateData);
    console.log('Listing updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error.message);
    throw error;
  }
};

// ============ Example 7: Mark as Sold ============
export const markAsSoldExample = async (listingId) => {
  try {
    const response = await listingService.markAsSold(listingId);
    console.log('Listing marked as sold:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error marking as sold:', error.message);
    throw error;
  }
};

// ============ Example 8: Delete Media ============
export const deleteMediaExample = async (listingId, mediaId) => {
  try {
    const response = await listingService.deleteMedia(listingId, mediaId);
    console.log('Media deleted successfully');
    return response;
  } catch (error) {
    console.error('Error deleting media:', error.message);
    throw error;
  }
};

// ============ Example 9: Get Statistics ============
export const getStatsExample = async () => {
  try {
    const response = await listingService.getMyStats();
    console.log('User statistics:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting stats:', error.message);
    throw error;
  }
};

// ============ Example 10: Delete Listing ============
export const deleteListingExample = async (listingId) => {
  try {
    const response = await listingService.deleteListing(listingId);
    console.log('Listing deleted successfully');
    return response;
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    throw error;
  }
};

// ============ React Component Usage Example ============
export const ReactComponentExample = `
import { useState, useEffect } from 'react';
import listingService from '@/app/services/api/listingService';

function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load listings and stats
      const [listingsRes, statsRes] = await Promise.all([
        listingService.getMyListings({ page: 1, limit: 20 }),
        listingService.getMyStats()
      ]);

      setListings(listingsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (listingId) => {
    try {
      await listingService.markAsSold(listingId);
      // Reload listings
      loadData();
    } catch (error) {
      console.error('Error marking as sold:', error);
    }
  };

  const handleDelete = async (listingId) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingService.deleteListing(listingId);
        // Reload listings
        loadData();
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Listings</h1>
      
      {/* Stats */}
      {stats && (
        <div className="stats">
          <div>Total: {stats.total}</div>
          <div>Active: {stats.active}</div>
          <div>Draft: {stats.draft}</div>
          <div>Pending: {stats.pending}</div>
        </div>
      )}

      {/* Listings */}
      <div className="listings">
        {listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <h3>{listing.title}</h3>
            <p>Price: ₹{listing.price}</p>
            <p>Status: {listing.status}</p>
            <button onClick={() => handleMarkAsSold(listing.id)}>
              Mark as Sold
            </button>
            <button onClick={() => handleDelete(listing.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
