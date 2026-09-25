'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  getHeroImages,
  uploadHeroImageFile,
  addHeroImage,
  deleteHeroImage,
  HeroImage
} from '@/lib/services/heroService'

export default function HeroImagesManagement() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const data = await getHeroImages()
      setImages(data)
    } catch (error) {
      console.error('Failed to load hero images:', error)
      setPageError('Failed to load hero images. Please refresh and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setPageError('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPageError('Image must be smaller than 5MB.')
      return
    }

    setPageError(null)
    setIsUploading(true)
    try {
      const url = await uploadHeroImageFile(file)
      if (!url) {
        setPageError('Failed to upload image. Please try again.')
        return
      }
      const saved = await addHeroImage(url, images.length)
      if (!saved) {
        setPageError('Image uploaded, but failed to save it. Please try again.')
        return
      }
      await loadImages()
    } catch (error) {
      console.error('Failed to upload hero image:', error)
      setPageError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Remove this image from the homepage slider?')) return
    setPageError(null)
    const success = await deleteHeroImage(id, imageUrl)
    if (!success) {
      setPageError('Failed to remove this image. Please try again.')
      return
    }
    await loadImages()
  }

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Hero Images</h1>
          <p className="text-gray-500 mt-2">
            Photos shown in the sliding background on your homepage. Add a few for the best effect.
          </p>
          {pageError && (
            <p className="text-red-500 text-sm mt-2">{pageError}</p>
          )}
        </div>
      </div>

      {/* Upload dropzone */}
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 bg-white mb-10">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-sm text-gray-500">
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </span>
            ) : (
              <>Click to upload a hero image</>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB &middot; landscape photos work best</p>
        </div>
      </label>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h16M4 16h16" />
          </svg>
          No hero images yet. Upload some above and they&apos;ll start sliding on your homepage right away.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, i) => (
            <div key={image.id} className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <Image src={image.imageUrl} alt={`Hero image ${i + 1}`} fill sizes="400px" className="object-cover" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">
                {i + 1}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(image.id, image.imageUrl)}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
