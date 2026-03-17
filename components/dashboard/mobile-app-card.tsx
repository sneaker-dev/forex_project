'use client'

import { Badge } from '@/components/ui/badge'
import { toast } from "sonner"

// Unsplash: dark city skyline / neon lights — perfect fintech atmosphere
const BG_IMG =
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85&fit=crop'

// Unsplash: hand holding smartphone with charts
const PHONE_IMG =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=85&fit=crop&crop=right'

export function MobileAppCard() {
  const handleStoreClick = (store: "apple" | "google") => {
    const url = store === "apple" ? "https://www.apple.com/app-store/" : "https://play.google.com/store"
    window.open(url, "_blank", "noopener,noreferrer")
    toast.success(store === "apple" ? "Opening App Store" : "Opening Google Play")
  }

  return (
    <div className="relative overflow-hidden rounded-2xl h-full min-h-[260px] border border-white/10 shadow-2xl">

      {/* ── Full-bleed background photo ── */}
      <img
        src={BG_IMG}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/50" />

      {/* Emerald glow top-left */}
      <div className="absolute -top-8 -left-8 w-40 h-40 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
      {/* Sky glow bottom-right */}
      <div className="absolute -bottom-8 right-10 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full p-5 gap-3">

        {/* Left column */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 uppercase">
            {/* Bolt icon */}
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-emerald-400" aria-hidden>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            New App
          </div>

          <h3 className="text-xl font-extrabold text-white leading-tight mb-1.5 text-balance">
            Trade on the Go
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Full trading power in your pocket.<br />Scan the QR code to download.
          </p>

          {/* QR Code */}
          <div className="bg-white p-2.5 rounded-xl w-fit shadow-lg mb-4 ring-2 ring-emerald-400/30">
            <svg viewBox="0 0 64 64" className="w-[68px] h-[68px]" aria-label="QR code">
              {/* Finder patterns */}
              <rect x="2" y="2" width="18" height="18" rx="2" fill="#0f172a" />
              <rect x="5" y="5" width="12" height="12" rx="1" fill="white" />
              <rect x="8" y="8" width="6" height="6" fill="#10b981" />

              <rect x="44" y="2" width="18" height="18" rx="2" fill="#0f172a" />
              <rect x="47" y="5" width="12" height="12" rx="1" fill="white" />
              <rect x="50" y="8" width="6" height="6" fill="#10b981" />

              <rect x="2" y="44" width="18" height="18" rx="2" fill="#0f172a" />
              <rect x="5" y="47" width="12" height="12" rx="1" fill="white" />
              <rect x="8" y="50" width="6" height="6" fill="#10b981" />

              {/* Data modules — dense inner pattern */}
              <rect x="24" y="2" width="4" height="4" fill="#0f172a" />
              <rect x="30" y="2" width="4" height="4" fill="#0f172a" />
              <rect x="36" y="6" width="4" height="4" fill="#0f172a" />
              <rect x="24" y="10" width="4" height="4" fill="#0f172a" />
              <rect x="30" y="14" width="4" height="4" fill="#0f172a" />
              <rect x="36" y="14" width="4" height="4" fill="#0f172a" />

              <rect x="2" y="24" width="4" height="4" fill="#0f172a" />
              <rect x="10" y="24" width="4" height="4" fill="#0f172a" />
              <rect x="16" y="30" width="4" height="4" fill="#0f172a" />
              <rect x="2" y="36" width="4" height="4" fill="#0f172a" />
              <rect x="10" y="36" width="4" height="4" fill="#0f172a" />

              <rect x="24" y="24" width="6" height="6" rx="1" fill="#10b981" />
              <rect x="34" y="24" width="4" height="4" fill="#0f172a" />
              <rect x="40" y="28" width="4" height="4" fill="#0f172a" />
              <rect x="24" y="34" width="4" height="4" fill="#0f172a" />
              <rect x="34" y="34" width="4" height="4" fill="#10b981" />

              <rect x="44" y="24" width="4" height="4" fill="#0f172a" />
              <rect x="52" y="24" width="4" height="4" fill="#0f172a" />
              <rect x="58" y="30" width="4" height="4" fill="#0f172a" />
              <rect x="48" y="30" width="4" height="4" fill="#10b981" />
              <rect x="58" y="36" width="4" height="4" fill="#0f172a" />

              <rect x="24" y="44" width="4" height="4" fill="#0f172a" />
              <rect x="30" y="50" width="4" height="4" fill="#0f172a" />
              <rect x="36" y="44" width="4" height="4" fill="#10b981" />
              <rect x="24" y="56" width="4" height="4" fill="#0f172a" />
              <rect x="44" y="44" width="4" height="4" fill="#0f172a" />
              <rect x="52" y="48" width="4" height="4" fill="#0f172a" />
              <rect x="44" y="54" width="4" height="4" fill="#10b981" />
              <rect x="56" y="56" width="4" height="4" fill="#0f172a" />
            </svg>
          </div>

          {/* Download buttons */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* App Store */}
            <button
              type="button"
              onClick={() => handleStoreClick("apple")}
              className="flex items-center gap-2.5 w-full h-10 px-3 rounded-xl bg-white/10 hover:bg-white/18 border border-white/15 hover:border-white/30 text-white transition-all duration-200 group backdrop-blur-sm"
            >
              {/* Official Apple icon shape */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-white" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-white/60 font-normal">Download on the</span>
                <span className="text-[12px] font-semibold tracking-tight">App Store</span>
              </div>
            </button>

            {/* Google Play */}
            <button
              type="button"
              onClick={() => handleStoreClick("google")}
              className="flex items-center gap-2.5 w-full h-10 px-3 rounded-xl bg-white/10 hover:bg-white/18 border border-white/15 hover:border-white/30 text-white transition-all duration-200 group backdrop-blur-sm"
            >
              {/* Official Google Play icon (4-colored) */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
                <path d="M3.18 23.76c.37.2.8.22 1.21.03l10.72-6.17-2.38-2.38-9.55 8.52z" fill="#EA4335" />
                <path d="M20.96 10.06l-2.97-1.71-2.65 2.65 2.65 2.65 2.99-1.73c.85-.49.85-1.38-.02-1.86z" fill="#FBBC04" />
                <path d="M2.12.33C1.8.6 1.59 1.04 1.59 1.62v20.76c0 .58.21 1.01.54 1.29l.07.06 11.63-11.63v-.27L2.19.27l-.07.06z" fill="#4285F4" />
                <path d="M15.15 7.37L3.18.23C2.77.04 2.34.06 1.97.27l11.56 11.56 2.38-2.38-.76-.08z" fill="#34A853" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-white/60 font-normal">Get it on</span>
                <span className="text-[12px] font-semibold tracking-tight">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right — phone image */}
        <div className="hidden sm:flex w-24 shrink-0 items-end justify-center pb-1 relative">
          {/* Subtle glow under the phone */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-emerald-500/30 blur-xl rounded-full" />
          <img
            src={PHONE_IMG}
            alt="ForexPro trading app on mobile"
            className="relative h-48 w-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  )
}
