"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { getAllBrands, getAllModels, createModel, updateModel, deleteModel } from "@/app/services/api/carDataAdminService"
import { toast } from "sonner"

export default function ModelsManagement() {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBrandId, setFilterBrandId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedModel, setSelectedModel] = useState(null)
  const [formData, setFormData] = useState({
    brandId: "",
    name: "",
    slug: "",
    isActive: true,
    isDiscontinued: false,
    launchYear: new Date().getFullYear(),
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBrands()
    fetchModels()
  }, [])

  useEffect(() => {
    fetchModels()
  }, [filterBrandId])

  const fetchBrands = async () => {
    try {
      const response = await getAllBrands({ isActive: true })
      if (response.success) {
        setBrands(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error)
    }
  }

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await getAllModels(filterBrandId)
      if (response.success) {
        setModels(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch models")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mode, model = null) => {
    setModalMode(mode)
    setSelectedModel(model)
    
    if (mode === "create") {
      setFormData({
        brandId: "",
        name: "",
        slug: "",
        isActive: true,
        isDiscontinued: false,
        launchYear: new Date().getFullYear(),
      })
    } else if (model) {
      setFormData({
        brandId: model.brandId?.toString() || "",
        name: model.name || "",
        slug: model.slug || "",
        isActive: model.isActive !== undefined ? model.isActive : true,
        isDiscontinued: model.isDiscontinued || false,
        launchYear: model.launchYear || new Date().getFullYear(),
      })
    }
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedModel(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.brandId) {
      toast.error("Model name and brand are required")
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        brandId: parseInt(formData.brandId),
      }
      
      let response
      if (modalMode === "create") {
        response = await createModel(payload)
      } else {
        response = await updateModel(selectedModel.id, payload)
      }

      if (response.success) {
        toast.success(response.message)
        handleCloseModal()
        fetchModels()
      }
    } catch (error) {
      toast.error(error.message || "Operation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will also delete all variants under this model.")) return

    try {
      const response = await deleteModel(id)
      if (response.success) {
        toast.success("Model deleted successfully")
        fetchModels()
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete model")
    }
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Car Models</h3>
          <p className="text-sm text-gray-600">Manage car models for each brand</p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Model</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterBrandId}
            onChange={(e) => setFilterBrandId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading models...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Launch Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{model.name}</div>
                      {model.isDiscontinued && (
                        <span className="text-xs text-red-600">Discontinued</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{model.brand?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{model.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {model.totalVariants || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{model.launchYear || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        model.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {model.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal("edit", model)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
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
                {modalMode === "create" ? "Create Model" : "Edit Model"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Name <span className="text-red-500">*</span>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Launch Year</label>
                <input
                  type="number"
                  value={formData.launchYear}
                  onChange={(e) => setFormData({ ...formData, launchYear: parseInt(e.target.value) || "" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1900"
                  max={new Date().getFullYear() + 2}
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
                    checked={formData.isDiscontinued}
                    onChange={(e) => setFormData({ ...formData, isDiscontinued: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Discontinued</span>
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
