'use client'

import { useState, useEffect } from 'react'
import { getMenuItems } from '@/lib/services/menuService'
import { MenuCard } from '@/components/MenuCard'
import { MenuCategory } from '@/types'
import { MenuItem } from '@/types'

const categories: { value: MenuCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'swallow', label: 'Swallow' },
  { value: 'soup', label: 'Soup' },
  { value: 'rice', label: 'Rice' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'drinks', label: 'Drinks' }
]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMenu() {
      setIsLoading(true)
      try {
        const items = await getMenuItems(selectedCategory)
        setMenuItems(items)
      } catch (error) {
        console.error('Error fetching menu:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenu()
  }, [selectedCategory]);

  return (
    <div className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Our Collection</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#111111] mb-4">The Menu</h1>
          <p className="text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Explore our curated selection of authentic Nigerian dishes, each crafted with the finest ingredients and traditional techniques.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-[#111111] text-white border-2 border-[#111111]'
                  : 'bg-white text-[#666666] border-2 border-[#E5E5E5] hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl luxury-shadow-sm overflow-hidden">
                <div className="relative h-64 w-full bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuItems.map((item, index) => (
              <MenuCard key={item.id} item={item} priority={index === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
