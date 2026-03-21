'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CandlestickChart, Eye, EyeOff, ArrowRight,
  ShieldCheck, Globe2, TrendingUp, Sparkles, BarChart2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const BG_IMAGE = '/istockphoto-1369016721-612x612.jpg'

const features = [
  { Icon: ShieldCheck, text: 'Bank-grade security & 2FA protection' },
  { Icon: Globe2,      text: '24/7 access to 60+ global markets' },
  { Icon: BarChart2,   text: 'Real-time charts & advanced analytics' },
]

const stats = [
  { value: '$2.8B+', label: 'Trading Volume' },
  { value: '500K+', label: 'Active Traders' },
  { value: '150+',  label: 'Countries' },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const remembered = localStorage.getItem("forexpro-remembered-email")
    if (remembered) {
      setEmail(remembered)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Missing Fields', { description: 'Please enter email and password' })
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem("forexpro-remembered-email", email)
      } else {
        localStorage.removeItem("forexpro-remembered-email")
      }
      setIsLoading(false)
      toast.success('Welcome back!', { description: 'Redirecting to dashboard...' })
      setTimeout(() => router.push('/'), 1000)
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} Login`, { description: `Connecting to ${provider}...` })
    setTimeout(() => router.push('/'), 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — Branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Real Unsplash trading photography */}
        <img
          src={BG_IMAGE}
          alt="Trading desk"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          loading="eager"
        />
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-emerald-950/50" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/3 w-[360px] h-[360px] bg-emerald-500/10 rounded-full blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] bg-sky-500/10 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-xl shadow-emerald-500/20">
              <img src="/exchange-currency_11500178.png" alt="ForexPro" className="h-full w-full object-cover" />
              <span className="absolute -top-0.5 -right-0.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              </span>
            </div>
            <div className="leading-none">
              <p className="text-[22px] font-bold text-white tracking-tight">ForexPro</p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mt-0.5">Trading Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Trade smarter with<br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  advanced analytics
                </span>
              </h1>
              <p className="text-white/55 text-lg max-w-sm leading-relaxed">
                Join 500,000+ traders worldwide and experience the future of forex trading.
              </p>
            </div>

            <div className="space-y-3.5">
              {features.map(({ Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 backdrop-blur border border-white/10">
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/45 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — Form ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Mobile-only background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        </div>

        <div className="relative w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg">
              <img src="/exchange-currency_11500178.png" alt="ForexPro" className="h-full w-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 mt-1">Sign in to your trading dashboard</p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/5">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/60 border-slate-700/60 text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 h-11"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/60 border-slate-700/60 text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 pr-10 h-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <span className="group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-[1.02] group"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-transparent text-slate-500">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  className="h-11 border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all gap-2"
                >
                  {/* Google G */}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Apple')}
                  className="h-11 border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all gap-2"
                >
                  {/* Apple */}
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                  Apple
                </Button>
              </div>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              {"Don't have an account? "}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </Card>

          <p className="text-center text-slate-600 text-xs mt-5">
            By signing in you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-400 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </p>
          <p className="text-center text-slate-600 text-xs mt-2">
            <Link href="/admin" className="text-slate-500 hover:text-slate-400 transition-colors">
              Admin CRM (staff)
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
