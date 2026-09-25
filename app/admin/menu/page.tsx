'use client'

import { useEffect, useState } from 'react'
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '@/lib/services/menuService'
import { MenuItem } from '@/types'
import Image from 'next/image'

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'swallow' as MenuItem['category'],
    ingredients: [] as string[],
    preparationTime: 30,
    isAvailable: true
  })

  const loadMenu = async () => {
    try {
      setIsLoading(true)
      const items = await getMenuItems()
      setMenuItems(items)
    } catch (error) {
      console.error('Failed to load menu:', error)
      setPageError('Failed to load the menu. Please refresh and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(true)
      setFormError(null)
      try {
        const imageUrl = await uploadMenuImage(file)
        if (imageUrl) {
          setFormData(prev => ({ ...prev, image: imageUrl }))
        } else {
          setFormError('Image upload failed. Please check your connection and try again.')
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
        setFormError('Image upload failed. Please check your connection and try again.')
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    try {
      const result = editingItem
        ? await updateMenuItem(editingItem.id, formData)
        : await createMenuItem(formData)

      if (!result) {
        setFormError('Failed to save this menu item. Please try again.')
        return
      }

      await loadMenu()
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to save menu item:', error)
      setFormError('Failed to save this menu item. Please try again.')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormError(null)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      category: item.category,
      ingredients: item.ingredients || [],
      preparationTime: item.preparationTime || 30,
      isAvailable: item.isAvailable !== false
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setPageError(null)
      const success = await deleteMenuItem(id)
      if (!success) {
        setPageError('Failed to delete this item. Please try again.')
        return
      }
      await loadMenu()
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormError(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'swallow',
      ingredients: [],
      preparationTime: 30,
      isAvailable: true
    })
  }

  const handleIngredientInput = (value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: value.split(',').map(i => i.trim()).filter(Boolean)
    }))
  }

  const statusConfig: Record<string, { bg: string; text: string }> = {
    true: { bg: 'bg-green-100 text-green-800', text: 'Available' },
    false: { bg: 'bg-red-100 text-red-800', text: 'Unavailable' }
  }

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Menu Management</h1>
          <p className="text-gray-500 mt-2">Add, edit, and remove menu items from your restaurant</p>
          {pageError && (
            <p className="text-red-500 text-sm mt-2">{pageError}</p>
          )}
        </div>
        <button 
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="w-full sm:w-auto px-8 py-3 bg-[#111111] text-white font-semibold rounded-full hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Item
        </button>
      </div>

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-56 bg-gray-100 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-7 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-5 bg-gray-100 rounded animate-pulse w-1/3" />
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <div className="relative h-56 overflow-hidden">
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusConfig[String(item.isAvailable)].bg} ${statusConfig[String(item.isAvailable)].text}`}>
                    {statusConfig[String(item.isAvailable)].text}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-[#D4AF37] text-[#111111] px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-serif font-semibold text-[#111111] leading-tight">{item.name}</h3>
                  <span className="text-[#D4AF37] font-bold font-serif text-xl">₦{item.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#111111]">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-[#111111] transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                  placeholder="e.g. Jollof Rice with Chicken"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111] resize-none"
                  placeholder="Describe this delicious dish..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MenuItem['category'] }))}
                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                  >
                    <option value="swallow">Swallow</option>
                    <option value="soup">Soup</option>
                    <option value="rice">Rice</option>
                    <option value="snacks">Snacks</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Dish Image</label>
                <div className="space-y-4">
                  {formData.image ? (
                    <div className="relative">
                      <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-100">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-sm text-gray-500">
                          {uploadingImage ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </span>
                          ) : (
                            <>Click to upload or drag and drop</>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                    placeholder="Or paste an image URL here..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={formData.ingredients.join(', ')}
                  onChange={(e) => handleIngredientInput(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                  placeholder="Rice, Tomatoes, Pepper, Onions, Chicken"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-3 tracking-wide">Preparation Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: Number(e.target.value) }))}
                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-100 rounded-xl hover:border-[#D4AF37]/50 transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="w-5 h-5 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                    />
                    <span className="text-sm font-semibold text-[#111111]">Available for Order</span>
                  </label>
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-sm text-center">{formError}</p>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-[#111111] text-white font-semibold rounded-full hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 shadow-lg"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}