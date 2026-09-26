'use client'

import { useEffect, useState } from 'react'
import { getHeroImages, getHeroSettings, HeroImage, HeroSettings } from '@/lib/services/heroService'
import { HeroSlider } from './HeroSlider'

const DEFAULT_SETTINGS: HeroSettings = {
  imagesEnabled: true,
  videoEnabled: false,
  videoUrl: null
}

export function HeroBackground() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [images, setImages] = useState<HeroImage[]>([])
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [imgs, config] = await Promise.all([getHeroImages(), getHeroSettings()])
      if (!cancelled) {
        setImages(imgs)
        setSettings(config)
        setIsLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!isLoaded) {
    // Nothing configured yet or still loading - keep the plain gradient
    // background exactly as it was, with no flash of missing content.
    return null
  }

  if (settings.imagesEnabled && images.length > 0) {
    return <HeroSlider images={images} />
  }

  if (settings.videoEnabled && settings.videoUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={settings.videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark scrim so the hero text above stays fully readable over any video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/85 via-[#111111]/65 to-[#111111]/85" />
      </div>
    )
  }

  // Both layers off (or nothing to show) - plain gradient background,
  // identical to how the hero section looked before this feature existed.
  return null
}