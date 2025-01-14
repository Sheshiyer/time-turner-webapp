import { useState, useEffect } from 'react'
import { signInWithEmail, signUpWithEmail } from '../lib/supabase'
import LoadingSpinner from './LoadingSpinner'

type AuthMode = 'signin' | 'signup'

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({})

  const loadingMessages = {
    signin: [
      "Unlocking temporal gates...",
      "Verifying temporal signature...",
      "Accessing time streams...",
      "Synchronizing timelines..."
    ],
    signup: [
      "Creating temporal anchor...",
      "Initializing time crystal...",
      "Calibrating chronometric sensors...",
      "Establishing temporal link..."
    ]
  }

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[mode][0])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(prevMsg => {
          const messages = loadingMessages[mode]
          const currentIndex = messages.indexOf(prevMsg)
          return messages[(currentIndex + 1) % messages.length]
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [loading, mode])

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {}
    
    // Email validation
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address'
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required'
    } else if (mode === 'signup' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setLoadingMessage(loadingMessages[mode][0])

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password')
          } else {
            throw error
          }
        }
      } else {
        // Validate username length before signup
        const username = email.split('@')[0]
        if (username.length < 3) {
          setError('Email prefix must be at least 3 characters long')
          return
        }

        const { data, error } = await signUpWithEmail(email, password)
        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered')
          } else if (error.message.includes('weak password')) {
            setError('Password is too weak. Please include numbers and special characters')
          } else {
            throw error
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="alethiometer-bg">
      {/* Radial overlay for depth */}
      <div className="absolute inset-0">
        {/* Dark vignette edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#462523]/80 via-transparent to-[#462523]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#462523]/80 via-transparent to-[#462523]/80" />
        {/* Engraved pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0, 10 10 T20 10' fill='none' stroke='%23F6F2C0' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      <div className="responsive-container min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Decorative circles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-[#F6F2C0]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-[#CB9B51]/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="glass-effect rounded-2xl p-8 sm:p-12 space-y-8 backdrop-blur-xl relative">
            {/* Logo/Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F6F2C0] to-[#CB9B51] rounded-full opacity-20 blur-md" />
              <div className="relative w-full h-full rounded-full border-2 border-[#F6F2C0]/30 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">⌛</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-center">
              <span className="bg-gradient-to-r from-[#F6F2C0] via-[#CB9B51] to-[#F6E27A] bg-clip-text text-transparent">
                Time Turner
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed text-center">
              {mode === 'signin' 
                ? "Return to your temporal journey and explore the mystical patterns of time."
                : "Begin your journey through time's ancient wisdom and cosmic rhythms."}
            </p>

            <form onSubmit={handleSubmit} className="form-container space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setValidationErrors(prev => ({...prev, email: undefined}))
                  }}
                  className={`w-full px-4 py-3 bg-white/10 rounded-lg border 
                           ${validationErrors.email ? 'border-red-400' : 'border-[#F6F2C0]/30'}
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all`}
                  required
                  placeholder="Email address"
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setValidationErrors(prev => ({...prev, password: undefined}))
                  }}
                  className={`w-full px-4 py-3 bg-white/10 rounded-lg border 
                           ${validationErrors.password ? 'border-red-400' : 'border-[#F6F2C0]/30'}
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all`}
                  required
                  placeholder={mode === 'signup' ? 'Password (min 6 characters)' : 'Password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.password}</p>
                )}
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="mt-8">
                  <LoadingSpinner message={loadingMessage} />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="relative group w-full px-6 sm:px-8 py-3 sm:py-4 text-black/90 text-base sm:text-lg font-medium tracking-wide
                           bg-gradient-to-br from-[#F6F2C0] via-[#CB9B51] to-[#F6E27A]
                           hover:from-[#F6F2C0] hover:via-[#F6E27A] hover:to-[#CB9B51]
                           rounded-full border border-[#F6F2C0]/30 shadow-lg
                           transition-all duration-300 backdrop-blur-lg
                           hover:border-[#F6F2C0]/50 hover:shadow-[#CB9B51]/30
                           before:absolute before:inset-0 before:rounded-full before:bg-white/50 before:backdrop-blur-sm
                           after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r 
                           after:from-transparent after:via-white/10 after:to-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </span>
                </button>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-[#F6F2C0] hover:text-[#CB9B51] transition-colors text-sm"
                >
                  {mode === 'signin'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
