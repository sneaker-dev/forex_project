"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
        background: isDark ? "#050b1a" : "#f8fafc",
      }}
    />
  )
}
