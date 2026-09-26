
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  getHeroImages,
  uploadHeroImageFile,
  addHeroImage,
  deleteHeroImage,
  getHeroSettings,
  updateHeroSettings,
  uploadHeroVideoFile,
  deleteHeroVideo,
  HeroImage,
  HeroSettings
} from '@/lib/services/heroService'

export default function HeroImagesManagement() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [settings, setSettings] = useState<HeroSettings>({ imagesEnabled: true, videoEnabled: false, videoUrl: null })
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const loadAll = async () => {
    try {
      setIsLoading(true)
      const [imgs, config] = await Promise.all([getHeroImages(), getHeroSettings()])
      setImages(imgs)
      setSettings(config)
    } catch (error) {
      console.error('Failed to load hero settings:', error)
      setPageError('Failed to load hero settings. Please refresh and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleToggle = async (key: 'imagesEnabled' | 'videoEnabled', value: boolean) => {
    setPageError(null)
    setIsSavingSettings(true)
    const previous = settings
    setSettings((prev) => ({ ...prev, [key]: value }))
    const success = await updateHeroSettings({ [key]: value })
    if (!success) {
      setSettings(previous)
      setPageError('Failed to save that setting. Please try again.')
    }
    setIsSavingSettings(false)
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await loadAll()
    } catch (error) {
      console.error('Failed to upload hero image:', error)
      setPageError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (id: string, imageUrl: string) => {
    if (!confirm('Remove this image from the homepage slider?')) return
    setPageError(null)
    const success = await deleteHeroImage(id, imageUrl)
    if (!success) {
      setPageError('Failed to remove this image. Please try again.')
      return
    }
    await loadAll()
  }

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setPageError('Please choose a video file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setPageError('Video must be smaller than 20MB. Try a shorter clip or compress it first.')
      return
    }

    setPageError(null)
    setIsUploadingVideo(true)
    try {
      const url = await uploadHeroVideoFile(file)
      if (!url) {
        setPageError('Failed to upload video. Please try again.')
        return
      }
      const success = await updateHeroSettings({ videoUrl: url })
      if (!success) {
        setPageError('Video uploaded, but failed to save it. Please try again.')
        return
      }
      await loadAll()
    } catch (error) {
      console.error('Failed to upload hero video:', error)
      setPageError('Failed to upload video. Please try again.')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const handleDeleteVideo = async () => {
    if (!settings.videoUrl) return
    if (!confirm('Remove the hero background video?')) return
    setPageError(null)
    const success = await deleteHeroVideo(settings.videoUrl)
    if (!success) {
      setPageError('Failed to remove the video. Please try again.')
      return
    }
    await loadAll()
  }

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-10">
        <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Hero Background</h1>
        <p className="text-gray-500 mt-2">
          Control what plays in the background of your homepage&apos;s hero section.
        </p>
        {pageError && (
          <p className="text-red-500 text-sm mt-2">{pageError}</p>
        )}
      </div>

      {/* Display mode toggles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
        <h2 className="text-lg font-serif font-semibold text-[#111111] mb-1">Display Mode</h2>
        <p className="text-sm text-gray-500 mb-6">
          If both are on, photos take priority over video. If both are off, the homepage shows its plain background as usual.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F8F8]">
            <div>
              <div className="font-semibold text-[#111111]">Image Slider</div>
              <div className="text-sm text-gray-500">Show the sliding photos below</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.imagesEnabled}
              onClick={() => handleToggle('imagesEnabled', !settings.imagesEnabled)}
              disabled={isSavingSettings}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
                settings.imagesEnabled ? 'bg-[#D4AF37]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  settings.imagesEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F8F8]">
            <div>
              <div className="font-semibold text-[#111111]">Background Video</div>
              <div className="text-sm text-gray-500">Show the looping video below instead</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.videoEnabled}
              onClick={() => handleToggle('videoEnabled', !settings.videoEnabled)}
              disabled={isSavingSettings}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
                settings.videoEnabled ? 'bg-[#D4AF37]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  settings.videoEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Video section */}
      <div className="mb-10">
        <h2 className="text-xl font-serif font-semibold text-[#111111] mb-1">Background Video</h2>
        <p className="text-sm text-gray-500 mb-4">A single looping video clip, muted and autoplaying.</p>

        {isLoading ? (
          <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse max-w-xl"></div>
        ) : settings.videoUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 max-w-xl group">
            <video src={settings.videoUrl} className="w-full aspect-video object-cover" muted loop autoPlay playsInline />
            <button
              type="button"
              onClick={handleDeleteVideo}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
              aria-label="Remove video"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-xl h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 bg-white">
            <input
              type="file"
              accept="video/*"
              onChange={handleUploadVideo}
              className="hidden"
              disabled={isUploadingVideo}
            />
            <div className="flex flex-col items-center justify-center">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="text-sm text-gray-500">
                {isUploadingVideo ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  <>Click to upload a background video</>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">MP4 or WEBM up to 20MB &middot; short, compressed clips work best</p>
            </div>
          </label>
        )}
      </div>

      {/* Images section */}
      <div className="mb-4">
        <h2 className="text-xl font-serif font-semibold text-[#111111] mb-1">Hero Images</h2>
        <p className="text-sm text-gray-500 mb-4">Photos shown in the sliding background. Add a few for the best effect.</p>
      </div>

      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300 bg-white mb-10">
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
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
                onClick={() => handleDeleteImage(image.id, image.imageUrl)}
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
