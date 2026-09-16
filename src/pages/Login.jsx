import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Utensils, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/ToastContext'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, demoCredentials } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // If already authenticated, redirect to /dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleFillDemo = () => {
    setEmail(demoCredentials.email)
    setPassword(demoCredentials.password)
    setErrorMsg('')
    toast.info('Demo Credentials Loaded', 'Click "Log In" to access the operations dashboard.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim()) {
      setErrorMsg('Please enter your operational email address.')
      return
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your administrator password.')
      return
    }

    setIsSubmitting(true)

    try {
      await login(email, password, rememberMe)
      toast.success(
        'Authentication Successful',
        `Welcome to Silver Catering Operations, ${email.split('@')[0]}.`
      )
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setErrorMsg('Invalid login credentials. Please try again.')
      toast.error('Login Failed', 'Could not authenticate administrator credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e1f16] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#c29c5e]/30 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#163324]/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c29c5e]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          {/* Emblem */}
          <div className="inline-flex p-1 rounded-2xl bg-gradient-to-br from-[#c29c5e] via-[#dfbe82] to-[#9d8050] shadow-xl">
            <div className="w-14 h-14 bg-[#163324] rounded-xl flex items-center justify-center">
              <Utensils className="w-7 h-7 text-[#c29c5e]" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-white font-sans">
              SILVER CATERING
            </h1>
            <p className="text-xs sm:text-sm font-light text-[#cbd5e1] tracking-wide mt-1">
              Event Administration & Operations
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge variant="gold" size="sm">
              Manager Portal
            </Badge>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-[11px] text-[#94a3b8] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              Internal Access Only
            </span>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-modal border border-[#244b36]/40 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#0f172a] tracking-tight">
              Administrator Sign In
            </h2>
            <p className="text-xs text-[#64748b]">
              Enter your authorized staff credentials to manage active events.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-xs text-[#991b1b] font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[#334155] tracking-wide"
              >
                Operational Email
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@silvercatering.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm pl-9 pr-3.5 py-2.5 placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[#334155] tracking-wide"
                >
                  Password
                </label>
              </div>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm pl-9 pr-10 py-2.5 placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94a3b8] hover:text-[#0f172a] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#163324] focus:ring-[#163324]/20 cursor-pointer accent-[#163324]"
                />
                <span className="text-xs text-[#475569] font-medium">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-[#9d8050] hover:text-[#866a39] font-medium hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Fill Demo Credentials
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2 text-sm font-semibold tracking-wide py-2.5"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Development / Demo Quick Assist Box */}
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[11px] text-[#64748b] space-y-1">
            <div className="flex items-center justify-between text-[#334155] font-semibold">
              <span>Development Mock Access</span>
              <span className="text-[#10b981] font-mono">Phase 2</span>
            </div>
            <p>
              Email: <code className="text-[#0f172a] font-mono font-medium">admin@silvercatering.in</code>
            </p>
            <p>
              Password: <code className="text-[#0f172a] font-mono font-medium">admin123</code>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-[#94a3b8] font-light">
          © {new Date().getFullYear()} Silver Catering • Central Kitchen & Field Operations
        </p>
      </div>
    </div>
  )
}

