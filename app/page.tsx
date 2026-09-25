'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getMenuItems } from '@/lib/services/menuService'
import { MenuItem } from '@/types'
import { MenuCard } from '@/components/MenuCard'
import { HeroSlider } from '@/components/HeroSlider'

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const menuItems = await getMenuItems()
        setFeaturedItems(menuItems.slice(0, 4))
      } catch (error) {
        console.error('Error fetching menu items:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="luxury-gradient text-white py-24 md:py-32 relative overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#D4AF37] blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#D4AF37] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[#D4AF37] text-sm tracking-[0.4em] uppercase mb-6 font-medium">Exquisite Nigerian Cuisine</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight">
              Elevate Your Dining Experience
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed">
              Authentic Nigerian dishes crafted with passion, using the finest ingredients, delivered with elegance to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/menu" className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#111111] px-10 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-white transition-all duration-300">
                Explore Menu
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/track-order" className="inline-flex items-center gap-3 border-2 border-[#D4AF37] text-white px-10 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-20 md:py-28 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <div>
              <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Curated Selection</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Featured Dishes</h2>
            </div>
            <Link href="/menu" className="hidden md:inline-flex items-center gap-2 text-[#111111] font-semibold hover:text-[#D4AF37] transition-colors duration-300">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
          <div className="md:hidden mt-8 text-center">
            <Link href="/menu" className="inline-flex items-center gap-2 text-[#111111] font-semibold hover:text-[#D4AF37] transition-colors duration-300">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Our Promise</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Why Choose Joviter&apos;s?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl hover:bg-[#F8F8F8] transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-[#111111]">Authentic Recipes</h3>
              <p className="text-[#666666] leading-relaxed">Traditional Nigerian dishes made with the freshest local ingredients and time-honored techniques.</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-[#F8F8F8] transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-[#111111]">Premium Delivery</h3>
              <p className="text-[#666666] leading-relaxed">Hot, fresh meals delivered with care to your doorstep in elegant, temperature-controlled packaging.</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-[#F8F8F8] transition-colors duration-300">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-[#111111]">Secure Payment</h3>
              <p className="text-[#666666] leading-relaxed">Safe, secure, and seamless payment options for your peace of mind with every order.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
