"use client"
import { useState } from "react"
import BrandsManagement from "./car-data/brands-management"
import ModelsManagement from "./car-data/models-management"
import VariantsManagement from "./car-data/variants-management"

export default function CarDataManagement() {
  const [activeSection, setActiveSection] = useState("brands")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Car Data Management</h2>
        <p className="text-gray-600 mt-1">Manage car brands, models, and variants</p>
      </div>

      {/* Section Filter */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSection("brands")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "brands"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Brands
        </button>
        <button
          onClick={() => setActiveSection("models")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "models"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Models
        </button>
        <button
          onClick={() => setActiveSection("variants")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "variants"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Variants
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === "brands" && <BrandsManagement />}
      {activeSection === "models" && <ModelsManagement />}
      {activeSection === "variants" && <VariantsManagement />}
    </div>
  )
}
