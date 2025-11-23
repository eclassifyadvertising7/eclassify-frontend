"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Eye, Edit, Trash2, Image as ImageIcon, X } from "lucide-react"
import { categoryService } from "@/app/services"
import { toast } from "sonner"

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create") // create, edit, view
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    displayOrder: 0,
    isFeatured: true,
    isActive: true,
  })
  const [iconFile, setIconFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [iconPreview, setIconPreview] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getAllCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode)
    setSelectedCategory(category)
    
    if (mode === "create") {
      setFormData({
        name: "",
        slug: "",
        description: "",
        displayOrder: 0,
        isFeatured: true,
        isActive: true,
      })
      setIconFile(null)
      setImageFile(null)
      setIconPreview(null)
      setImagePreview(null)
    } else if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        displayOrder: category.displayOrder,
        isFeatured: category.isFeatured,
        isActive: category.isActive,
      })
      setIconPreview(category.icon)
      setImagePreview(category.imageUrl)
      setIconFile(null)
      setImageFile(null)
    }
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
    setIconFile(null)
    setImageFile(null)
    setIconPreview(null)
    setImagePreview(null)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB")
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "icon") {
          setIconFile(file)
          setIconPreview(reader.result)
        } else {
          setImageFile(file)
          setImagePreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      setSubmitting(true)
      const data = new FormData()
      data.append("name", formData.name)
      if (formData.slug) data.append("slug", formData.slug)
      if (formData.description) data.append("description", formData.description)
      data.append("displayOrder", formData.displayOrder)
      data.append("isFeatured", formData.isFeatured)
      data.append("isActive", formData.isActive)
      
      if (iconFile) data.append("icon", iconFile)
      if (imageFile) data.append("image", imageFile)

      let response
      if (modalMode === "create") {
        response = await categoryService.createCategory(data)
      } else {
        response = await categoryService.updateCategory(selectedCategory.id, data)
      }

      if (response.success) {
        toast.success(response.message)
        handleCloseModal()
        fetchCategories()
      }
    } catch (error) {
      toast.error(error.message || "Operation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await categoryService.updateCategoryStatus(id, !currentStatus)
      if (response.success) {
        toast.success("Status updated successfully")
        fetchCategories()
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status")
    }
  }

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const response = await categoryService.updateCategoryFeatured(id, !currentFeatured)
      if (response.success) {
        toast.success("Featured status updated successfully")
        fetchCategories()
      }
    } catch (error) {
      toast.error(error.message || "Failed to update featured status")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await categoryService.deleteCategory(id)
      if (response.success) {
        toast.success("Category deleted successfully")
        fetchCategories()
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete category")
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description?.substring(0, 40)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.displayOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category.id, category.isActive)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(category.id, category.isFeatured)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.isFeatured
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {category.isFeatured ? "Featured" : "Not Featured"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal("view", category)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal("edit", category)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
                {modalMode === "create" ? "Create Category" : modalMode === "edit" ? "Edit Category" : "View Category"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={modalMode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  disabled={modalMode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={modalMode === "view"}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  disabled={modalMode === "view"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Max 2MB)</label>
                  {iconPreview && (
                    <img src={iconPreview} alt="Icon preview" className="w-20 h-20 object-cover rounded mb-2" />
                  )}
                  {modalMode !== "view" && (
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileChange(e, "icon")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Max 2MB)</label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Image preview" className="w-full h-20 object-cover rounded mb-2" />
                  )}
                  {modalMode !== "view" && (
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={modalMode === "view"}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    disabled={modalMode === "view"}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              {modalMode !== "view" && (
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
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
