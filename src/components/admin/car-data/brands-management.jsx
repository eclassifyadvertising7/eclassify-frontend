"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { getAllBrands, createBrand, updateBrand, deleteBrand } from "@/app/services/api/carDataAdminService"
import { toast } from "sonner"

export default function BrandsManagement() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // all, active, inactive
  const [filterPopular, setFilterPopular] = useState("all") // all, popular, regular
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    nameLocal: "",
    logoUrl: "",
    description: "",
    countryOfOrigin: "",
    displayOrder: 0,
    isPopular: false,
    isActive: true,
    isFeatured: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [filterStatus, filterPopular, searchTerm])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const filters = {}
      
      if (searchTerm) filters.search = searchTerm
      if (filterStatus === "active") filters.isActive = true
      if (filterStatus === "inactive") filters.isActive = false
      if (filterPopular === "popular") filters.isPopular = true
      if (filterPopular === "regular") filters.isPopular = false
      
      const response = await getAllBrands(filters)
      if (response.success) {
        setBrands(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch brands")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mode, brand = null) => {
    setModalMode(mode)
    setSelectedBrand(brand)
    
    if (mode === "create") {
      setFormData({
        name: "",
        slug: "",
        nameLocal: "",
        logoUrl: "",
        description: "",
        countryOfOrigin: "",
        displayOrder: 0,
        isPopular: false,
        isActive: true,
        isFeatured: false,
      })
    } else if (brand) {
      setFormData({
        name: brand.name || "",
        slug: brand.slug || "",
        nameLocal: brand.nameLocal || "",
        logoUrl: brand.logoUrl || "",
        description: brand.description || "",
        countryOfOrigin: brand.countryOfOrigin || "",
        displayOrder: brand.displayOrder || 0,
        isPopular: brand.isPopular || false,
        isActive: brand.isActive !== undefined ? brand.isActive : true,
        isFeatured: brand.isFeatured || false,
      })
    }
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBrand(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Brand name is required")
      return
    }

    try {
      setSubmitting(true)
      let response
      
      if (modalMode === "create") {
        response = await createBrand(formData)
      } else {
        response = await updateBrand(selectedBrand.id, formData)
      }

      if (response.success) {
        toast.success(response.message)
        handleCloseModal()
        fetchBrands()
      }
    } catch (error) {
      toast.error(error.message || "Operation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will also delete all models and variants under this brand.")) return

    try {
      const response = await deleteBrand(id)
      if (response.success) {
        toast.success("Brand deleted successfully")
        fetchBrands()
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete brand")
    }
  }

  // Filtering is now done server-side via API
  const filteredBrands = brands

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Car Brands</h3>
          <p className="text-sm text-gray-600">Manage car brands and manufacturers</p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={filterPopular}
              onChange={(e) => setFilterPopular(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Brands</option>
              <option value="popular">Popular</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading brands...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Models</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="h-10 w-10 rounded object-contain" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs font-bold">{brand.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                          <div className="text-xs text-gray-500 flex gap-2">
                            {brand.isPopular && <span className="text-blue-600">Popular</span>}
                            {brand.isFeatured && <span className="text-purple-600">Featured</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{brand.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{brand.countryOfOrigin || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {brand.totalModels || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{brand.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        brand.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal("edit", brand)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === "create" ? "Create Brand" : "Edit Brand"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local Name</label>
                  <input
                    type="text"
                    value={formData.nameLocal}
                    onChange={(e) => setFormData({ ...formData, nameLocal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={formData.countryOfOrigin}
                    onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Popular</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
