"use client"

export default function PropertyFilters({ filters, onFilterChange }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
        Property Specifications
      </h4>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type
        </label>
        <select
          value={filters.listingType || ''}
          onChange={(e) => onFilterChange('listingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Types</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => onFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Property Types</option>
          <option value="RK">RK (Room + Kitchen)</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="4BHK">4 BHK</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms || ''}
          onChange={(e) => onFilterChange('bedrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Any</option>
          <option value="0">Studio</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4 Bedrooms</option>
          <option value="5">5+ Bedrooms</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <select
          value={filters.bathrooms || ''}
          onChange={(e) => onFilterChange('bathrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Any</option>
          <option value="1">1 Bathroom</option>
          <option value="2">2 Bathrooms</option>
          <option value="3">3 Bathrooms</option>
          <option value="4">4+ Bathrooms</option>
        </select>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing
        </label>
        <select
          value={filters.furnishing || ''}
          onChange={(e) => onFilterChange('furnishing', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Any</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi Furnished</option>
          <option value="fully-furnished">Fully Furnished</option>
        </select>
      </div>

      {/* Area Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Area (sq ft)
          </label>
          <input
            type="number"
            placeholder="500"
            value={filters.minArea || ''}
            onChange={(e) => onFilterChange('minArea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Area (sq ft)
          </label>
          <input
            type="number"
            placeholder="5000"
            value={filters.maxArea || ''}
            onChange={(e) => onFilterChange('maxArea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Parking */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parking
        </label>
        <select
          value={filters.parking || ''}
          onChange={(e) => onFilterChange('parking', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Any</option>
          <option value="0">No Parking</option>
          <option value="1">1 Car</option>
          <option value="2">2 Cars</option>
          <option value="3">3+ Cars</option>
        </select>
      </div>
    </div>
  )
}