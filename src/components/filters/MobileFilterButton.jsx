"use client"
import { Filter } from "lucide-react"

export default function MobileFilterButton({ onClick, activeFiltersCount }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-6 right-6 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-colors z-40"
    >
      <Filter className="w-6 h-6" />
      {activeFiltersCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
          {activeFiltersCount}
        </span>
      )}
    </button>
  )
}