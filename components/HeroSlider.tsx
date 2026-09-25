'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { getHeroImages, HeroImage } from '@/lib/services/heroService'

const AUTO_ADVANCE_MS = 6000
const TRANSITION_MS = 700

export function HeroSlider() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  // Index into the "extended" list below (real images plus one clone of the
  // last image at the start and one clone of the first at the end - this is
  // what makes the next/prev loop feel seamless instead of jumping backward
  // through every slide when wrapping around).
  const [index, setIndex] = useState(1)
  const [withTransition, setWithTransition] = useState(true)
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await getHeroImages()
      if (!cancelled) {
        setImages(data)
        setIsLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const count = images.length
  const extended = count > 1 ? [images[count - 1], ...images, images[0]] : images

  const goNext = () => {
    if (count <= 1) return
    setWithTransition(true)
    setIndex((prev) => prev + 1)
  }

  const goPrev = () => {
    if (count <= 1) return
    setWithTransition(true)
    setIndex((prev) => prev - 1)
  }

  const goToReal = (realIndex: number) => {
    if (count <= 1) return
    setWithTransition(true)
    setIndex(realIndex + 1)
  }

  // After a slide finishes animating onto a cloned end-slide, snap instantly
  // (no transition) back to the matching real slide so looping feels
  // seamless instead of sweeping backward through the whole set.
  useEffect(() => {
    if (count <= 1) return
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
    snapTimeoutRef.current = setTimeout(() => {
      if (index === extended.length - 1) {
        setWithTransition(false)
        setIndex(1)
      } else if (index === 0) {
        setWithTransition(false)
        setIndex(count)
      }
    }, TRANSITION_MS)
    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
    }
  }, [index, count, extended.length])

  // Re-enable the transition on the next paint after a transition-less snap.
  useEffect(() => {
    if (withTransition) return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setWithTransition(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [withTransition])

  // Auto-advance, restarting after any manual interaction.
  useEffect(() => {
    if (count <= 1) return
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    autoTimerRef.current = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, index])

  if (!isLoaded || count === 0) {
    // No hero images configured yet - render nothing, so the section keeps
    // its existing plain gradient background exactly as it was.
    return null
  }

  const activeRealIndex = ((index - 1) % count + count) % count

  return (
    <div className="absolute inset-0 overflow-hidden">
      {count === 1 ? (
        <div className="absolute inset-0">
          <Image src={images[0].imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      ) : (
        extended.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className={`absolute inset-0 ${withTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(${(i - index) * 100}%)` }}
          >
            <Image src={img.imageUrl} alt="" fill priority={i === 1} sizes="100vw" className="object-cover" />
          </div>
        ))
      )}

      {/* Dark scrim so the hero text above stays fully readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/85 via-[#111111]/65 to-[#111111]/85" />

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#111111] hover:border-[#D4AF37] transition-all duration-300"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#111111] hover:border-[#D4AF37] transition-all duration-300"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goToReal(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeRealIndex ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
