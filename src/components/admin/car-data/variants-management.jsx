"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { 
  getAllBrands, 
  getAllModels, 
  getAllVariants, 
  createVariant, 
  updateVariant, 
  deleteVariant 
} from "@/app/services/api/carDataAdminService"
import { toast } from "sonner"

const fuelTypes = ["petrol", "diesel", "electric", "hybrid", "cng", "lpg"]
const transmissionTypes = ["manual", "automatic", "cvt", "semi-automatic"]
const bodyTypes = ["sedan", "hatchback", "suv", "coupe", "convertible", "wagon", "pickup", "van", "mpv"]

export default function VariantsManagement() {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterModelId, setFilterModelId] = useState("")
  const [filterBrandId, setFilterBrandId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [formData, setFormData] = useState({
    brandId: "",
    modelId: "",
    variantName: "",
    slug: "",
    fullName: "",
    modelYear: new Date().getFullYear(),
    bodyType: "",
    fuelType: "",
    transmissionType: "",
    seatingCapacity: 5,
    doorCount: 4,
    exShowroomPrice: "",
    isActive: true,
    isDiscontinued: false,
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBrands()
    fetchVariants()
  }, [])

  useEffect(() => {
    if (filterBrandId) {
      fetchModels(filterBrandId)
    } else {
      setModels([])
      setFilterModelId("")
    }
  }, [filterBrandId])

  useEffect(() => {
    fetchVariants()
  }, [filterModelId])

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

  const fetchModels = async (brandId) => {
    try {
      const response = await getAllModels(brandId)
      if (response.success) {
        setModels(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    }
  }

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const response = await getAllVariants(filterModelId)
      if (response.success) {
        setVariants(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch variants")
    } finally {
      setLoading(false)
    }
  }

  const handleBrandChangeInForm = async (brandId) => {
    setFormData({ ...formData, brandId, modelId: "" })
    if (brandId) {
      try {
        const response = await getAllModels(brandId)
        if (response.success) {
          setModels(Array.isArray(response.data) ? response.data : [])
        }
      } catch (error) {
        console.error("Failed to fetch models:", error)
      }
    } else {
      setModels([])
    }
  }

  const handleOpenModal = async (mode, variant = null) => {
    setModalMode(mode)
    setSelectedVariant(variant)
    
    if (mode === "create") {
      setFormData({
        brandId: "",
        modelId: "",
        variantName: "",
        slug: "",
        fullName: "",
        modelYear: new Date().getFullYear(),
        bodyType: "",
        fuelType: "",
        transmissionType: "",
        seatingCapacity: 5,
        doorCount: 4,
        exShowroomPrice: "",
        isActive: true,
        isDiscontinued: false,
      })
      setModels([])
    } else if (variant) {
      setFormData({
        brandId: variant.brandId?.toString() || "",
        modelId: variant.modelId?.toString() || "",
        variantName: variant.variantName || "",
        slug: variant.slug || "",
        fullName: variant.fullName || "",
        modelYear: variant.modelYear || new Date().getFullYear(),
        bodyType: variant.bodyType || "",
        fuelType: variant.fuelType || "",
        transmissionType: variant.transmissionType || "",
        seatingCapacity: variant.seatingCapacity || 5,
        doorCount: variant.doorCount || 4,
        exShowroomPrice: variant.exShowroomPrice || "",
        isActive: variant.isActive !== undefined ? variant.isActive : true,
        isDiscontinued: variant.isDiscontinued || false,
      })
      
      if (variant.brandId) {
        try {
          const response = await getAllModels(variant.brandId)
          if (response.success) {
            setModels(Array.isArray(response.data) ? response.data : [])
          }
        } catch (error) {
          console.error("Failed to fetch models:", error)
        }
      }
    }
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedVariant(null)
    setModels([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.variantName.trim() || !formData.brandId || !formData.modelId) {
      toast.error("Variant name, brand, and model are required")
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        brandId: parseInt(formData.brandId),
        modelId: parseInt(formData.modelId),
        exShowroomPrice: parseFloat(formData.exShowroomPrice) || 0,
      }
      
      let response
      if (modalMode === "create") {
        response = await createVariant(payload)
      } else {
        response = await updateVariant(selectedVariant.id, payload)
      }

      if (response.success) {
        toast.success(response.message)
        handleCloseModal()
        fetchVariants()
      }
    } catch (error) {
      toast.error(error.message || "Operation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this variant?")) return

    try {
      const response = await deleteVariant(id)
      if (response.success) {
        toast.success("Variant deleted successfully")
        fetchVariants()
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete variant")
    }
  }

  const filteredVariants = variants.filter(variant =>
    variant.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.model?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Car Variants</h3>
          <p className="text-sm text-gray-600">Manage car variants for each model</p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variant</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search variants..."
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
          <select
            value={filterModelId}
            onChange={(e) => setFilterModelId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!filterBrandId}
          >
            <option value="">All Models</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading variants...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel/Trans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVariants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{variant.variantName}</div>
                      <div className="text-xs text-gray-500">{variant.modelYear}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{variant.model?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{variant.brand?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="capitalize">{variant.fuelType}</div>
                      <div className="text-xs text-gray-500 capitalize">{variant.transmissionType}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{parseFloat(variant.exShowroomPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        variant.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {variant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal("edit", variant)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(variant.id)}
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === "create" ? "Create Variant" : "Edit Variant"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => handleBrandChangeInForm(e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.modelId}
                    onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.brandId}
                    required
                  >
                    <option value="">Select Model</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.variantName}
                    onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2.5L V6 Automatic"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Toyota Camry 2.5L V6 Automatic"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    value={formData.transmissionType}
                    onChange={(e) => setFormData({ ...formData, transmissionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {transmissionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <select
                    value={formData.bodyType}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {bodyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Year</label>
                  <input
                    type="number"
                    value={formData.modelYear}
                    onChange={(e) => setFormData({ ...formData, modelYear: parseInt(e.target.value) || "" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1900"
                    max={new Date().getFullYear() + 2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seating</label>
                  <input
                    type="number"
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="2"
                    max="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                  <input
                    type="number"
                    value={formData.doorCount}
                    onChange={(e) => setFormData({ ...formData, doorCount: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="2"
                    max="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.exShowroomPrice}
                    onChange={(e) => setFormData({ ...formData, exShowroomPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
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
