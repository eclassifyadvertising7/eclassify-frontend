"use client"

export default function SortFilter({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: "date_desc", label: "Newly Posted First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "views_desc", label: "Most Viewed" },
    { value: "favorites_desc", label: "Most Favorited" },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <select
        value={sortBy || 'date_desc'}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}