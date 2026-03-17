'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, Shield, Sparkles, Users, BarChart3, User, Lock, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, name: 'Personal', icon: User },
  { id: 2, name: 'Security', icon: Lock },
  { id: 3, name: 'Verify', icon: FileCheck },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleNextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.email)) {
      toast.error('Missing Fields', { description: 'Please fill in all required fields' })
      return
    }
    if (step === 2 && (!formData.password || formData.password !== formData.confirmPassword)) {
      toast.error('Password Error', { description: 'Passwords do not match' })
      return
    }
    if (step < 3) {
      setStep(step + 1)
      toast.success(`Step ${step} Complete`, { description: 'Moving to next step...' })
    }
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      toast.error('Terms Required', { description: 'Please agree to the terms and conditions' })
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Account Created!', { description: 'Redirecting to login...' })
      setTimeout(() => router.push('/login'), 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/istockphoto-1369016721-612x612.jpg')" }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-2s' }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shadow-emerald-500/30 overflow-hidden">
              <img src="/exchange-currency_11500178.png" alt="ForexPro" className="h-full w-full object-cover" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">ForexPro</span>
              <p className="text-xs text-white/50 tracking-wider">TRADING PLATFORM</p>
            </div>
          </div>
          
          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Start your trading<br />
                <span className="gradient-text">journey today</span>
              </h1>
              <p className="text-lg text-white/60 max-w-md">
                Create an account in minutes and join the world of professional forex trading.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Secure and regulated platform' },
                { icon: Users, text: 'Join 500K+ active traders' },
                { icon: BarChart3, text: 'Advanced trading tools' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <item.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-white/80 italic mb-4">
              {"\"ForexPro has transformed my trading. The platform is intuitive and the support is excellent.\""}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
              <div>
                <p className="text-sm font-semibold text-white">Michael Chen</p>
                <p className="text-xs text-white/50">Professional Trader</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        </div>

        <div className="relative w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <div className="text-center mb-6 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
                <img src="/exchange-currency_11500178.png" alt="ForexPro" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-white">ForexPro</span>
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-slate-400">Join thousands of successful traders</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
                  step >= s.id 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-slate-800/50 text-slate-500"
                )}>
                  <s.icon className="h-4 w-4" />
                  <span className="text-xs font-medium hidden sm:inline">{s.name}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 mx-1 rounded transition-colors duration-300",
                    step > s.id ? "bg-emerald-500" : "bg-slate-700"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Registration Card */}
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl p-8 shadow-2xl">
            <form className="space-y-5">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <h2 className="text-lg font-semibold text-white">Personal Information</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        First Name
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 bg-slate-900/50 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Security Information */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <h2 className="text-lg font-semibold text-white">Create Password</h2>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-slate-900/30 border border-slate-700/50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-300 mb-3">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'At least 8 characters',
                        'One uppercase letter',
                        'One number',
                        'One special character'
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Agreement */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <h2 className="text-lg font-semibold text-white">Verify & Agree</h2>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Account Information Confirmed</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formData.firstName || 'John'} {formData.lastName || 'Doe'} ({formData.email || 'you@example.com'})
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-500 hover:text-emerald-400">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200">
                      Your account will be created with 2FA enabled for maximum security. You can manage this in settings.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1 h-11 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={step < 3 ? handleNextStep : handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 group"
                >
                  {isSubmitting ? 'Creating Account...' : step === 3 ? 'Create Account' : 'Continue'}
                  {step < 3 && !isSubmitting && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />}
                </Button>
              </div>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-slate-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </Card>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs mt-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="hover:text-slate-400 underline">
              Terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="hover:text-slate-400 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
