"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// User-selected theme backgrounds from /public
const DARK_BG = "url('/istockphoto-1369016721-612x612.jpg')"
const LIGHT_BG = "url('/360_F_298846909_mssb9MpliUGU22kW0r0i7dMjPwdGMkZy.jpg')"

export function BackgroundProvider() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundColor: "#f8fafc",
        }}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        backgroundImage: isDark ? DARK_BG : LIGHT_BG,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Theme-specific overlay */}
      {isDark ? (
        <>
          {/* Dark overlay — deep navy tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(4,10,24,0.88) 0%, rgba(6,14,32,0.82) 50%, rgba(4,10,24,0.88) 100%)",
            }}
          />
          {/* Emerald accent glow top-right */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "50vw",
              height: "50vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Blue accent glow bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-5%",
              width: "45vw",
              height: "45vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <>
          {/* Light overlay — bright white-blue tint that mutes the photo just enough */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(248,250,252,0.84) 0%, rgba(241,245,249,0.78) 50%, rgba(248,250,252,0.84) 100%)",
            }}
          />
          {/* Soft green accent — top-left */}
          <div
            style={{
              position: "absolute",
              top: "-5%",
              left: "10%",
              width: "40vw",
              height: "40vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          {/* Soft sky accent — bottom-right */}
          <div
            style={{
              position: "absolute",
              bottom: "-5%",
              right: "5%",
              width: "35vw",
              height: "35vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </div>
  )
}
