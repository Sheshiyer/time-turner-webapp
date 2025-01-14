import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  refreshProfile: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId: string) => {
    try {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        // Set profile to null on error to prevent infinite loading
        setProfile(null)
      } else {
        setProfile(data)
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null
    let authSubscription: { unsubscribe: () => void } | null = null

    const handleAuthChange = async (session: { user: User } | null, source: string) => {
      if (!mounted) return

      try {
        console.log(`[Auth] Handling auth change from ${source}:`, session?.user ? 'User present' : 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error(`[Auth] Error handling auth change from ${source}:`, error)
        setUser(null)
        setProfile(null)
      } finally {
        if (mounted) {
          console.log(`[Auth] Finished auth change from ${source}`)
          setLoading(false)
        }
      }
    }

    const initializeAuth = async () => {
      console.log('[Auth] Starting initialization')
      
      try {
        // First try to get an existing session
        const sessionResponse = await supabase.auth.getSession()
        
        if (!mounted) {
          console.log('[Auth] Component unmounted during initialization')
          return
        }

        // Set a longer timeout for the entire auth process
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.error('[Auth] Initialization timed out after 15 seconds')
            handleAuthChange(null, 'timeout')
          }
        }, 15000)

        await handleAuthChange(sessionResponse.data.session, 'initial')

        // Set up auth state change listener
        const { data } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            await handleAuthChange(session, 'state-change')
          }
        )

        authSubscription = data.subscription
        console.log('[Auth] Successfully set up auth subscription')

      } catch (error) {
        console.error('[Auth] Error during initialization:', error)
        if (mounted) {
          handleAuthChange(null, 'error')
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
      }
    }

    // Start the auth initialization process
    initializeAuth()

    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
