'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight,
  Gift, Trophy, Users2, ArrowRight, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from "next/navigation"

// Curated Unsplash finance/trading images (free-to-use, no auth required via CDN)
const banners = [
  {
    id: 1,
    title: 'Deposit Now & Get',
    highlight: '20% Bonus',
    description: 'Trade with extra capital. Activate your bonus before the offer expires.',
    bgImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&q=85&fit=crop',
    gradient: 'from-slate-950/90 via-emerald-950/70 to-transparent',
    accentClass: 'from-emerald-300 to-emerald-500',
    btnClass: 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30 text-white',
    cta: 'Deposit Now',
    Icon: Gift,
    tag: 'Limited Time',
  },
  {
    id: 2,
    title: 'Join Our Trading',
    highlight: 'Competition',
    description: 'Compete with elite traders. Win prizes up to $50,000 cash.',
    bgImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1400&q=85&fit=crop',
    gradient: 'from-slate-950/90 via-blue-950/70 to-transparent',
    accentClass: 'from-blue-300 to-sky-400',
    btnClass: 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/30 text-white',
    cta: 'Register Now',
    Icon: Trophy,
    tag: 'Live Event',
  },
  {
    id: 3,
    title: 'Refer & Earn',
    highlight: 'Unlimited',
    description: "Earn lifetime commissions on every trade your network makes.",
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&fit=crop',
    gradient: 'from-slate-950/90 via-violet-950/70 to-transparent',
    accentClass: 'from-violet-300 to-purple-500',
    btnClass: 'bg-violet-500 hover:bg-violet-400 shadow-violet-500/30 text-white',
    cta: 'View Program',
    Icon: Users2,
    tag: 'IB Program',
  },
]

const INTERVAL_MS = 6000

export function BannerCarousel() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)
    const step = 50
    const increment = (step / INTERVAL_MS) * 100
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + increment, 100))
    }, step)
    const slideTimer = setTimeout(() => {
      setCurrent((c) => (c + 1) % banners.length)
    }, INTERVAL_MS)
    return () => {
      clearInterval(progressTimer)
      clearTimeout(slideTimer)
    }
  }, [current])

  const go = (index: number) => setCurrent((index + banners.length) % banners.length)
  const handleCtaClick = (id: number) => {
    if (id === 1) router.push("/funds?tab=deposit")
    else if (id === 2) router.push("/competitions")
    else router.push("/referrals")
  }

  return (
    <div className="relative overflow-hidden rounded-2xl h-56 md:h-64 shadow-2xl ring-1 ring-white/5">
      {banners.map((banner, index) => {
        const { Icon } = banner
        const isActive = index === current
        return (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              isActive ? "opacity-100 translate-x-0 scale-100 z-10"
                : index < current
                ? "opacity-0 -translate-x-8 scale-[0.98] z-0"
                : "opacity-0 translate-x-8 scale-[0.98] z-0"
            )}
          >
            {/* Real photography background */}
            <img
              src={banner.bgImage}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Dark gradient overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-r", banner.gradient)} />
            {/* Fine dot grid texture */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Content */}
            <div className="relative h-full flex items-center px-8 md:px-12 gap-8">
              <div className="flex-1">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3",
                  "bg-white/10 backdrop-blur border border-white/15 text-white/90",
                  isActive && "animate-slide-up"
                )}>
                  <Sparkles className="h-2.5 w-2.5 text-yellow-300" />
                  {banner.tag}
                </div>

                <h3 className={cn("text-2xl md:text-3xl font-bold text-white/90 leading-tight", isActive && "animate-slide-up")}
                  style={{ animationDelay: '60ms' }}>
                  {banner.title}
                </h3>
                <h3
                  className={cn("text-3xl md:text-4xl font-extrabold mb-3 tracking-tight", isActive && "animate-slide-up")}
                  style={{
                    animationDelay: '120ms',
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <span
                    className={cn("bg-gradient-to-r bg-clip-text text-transparent", banner.accentClass)}
                  >
                    {banner.highlight}
                  </span>
                </h3>
                <p
                  className={cn("text-white/60 text-sm md:text-base mb-6 max-w-sm leading-relaxed", isActive && "animate-slide-up")}
                  style={{ animationDelay: '180ms' }}
                >
                  {banner.description}
                </p>

                <Button
                  onClick={() => handleCtaClick(banner.id)}
                  className={cn(
                    "group gap-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                    banner.btnClass,
                    isActive && "animate-slide-up"
                  )}
                  style={{ animationDelay: '240ms' }}
                >
                  {banner.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Decorative icon orb */}
              <div className={cn(
                "hidden md:flex h-28 w-28 shrink-0 items-center justify-center rounded-full",
                "bg-white/5 backdrop-blur border border-white/10",
                isActive && "animate-float"
              )}>
                <Icon className="h-14 w-14 text-white/30" />
              </div>
            </div>
          </div>
        )
      })}

      {/* Arrow controls */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur border border-white/10 text-white hover:bg-black/50 transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur border border-white/10 text-white hover:bg-black/50 transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "bg-white w-8" : "bg-white/35 w-2 hover:bg-white/55"
            )}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          className="h-full bg-white/50 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
