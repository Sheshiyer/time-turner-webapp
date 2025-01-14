import React, { createContext, useContext, useEffect, useState } from 'react'
import { Profile, supabase } from '../lib/supabase'

interface UserContextType {
  profile: Profile | null
  updateProfile: (data: Partial<Profile>) => void
  isProfileComplete: boolean
  error: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load profile data from storage on mount
    const loadProfile = () => {
      try {
        const storedProfile = localStorage.getItem('userProfile')
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data')
      }
    }
    loadProfile()
  }, [])

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!profile?.id) {
        throw new Error('No profile ID found')
      }

      // Update local state first for immediate UI feedback
      const updatedProfile = { ...profile, ...data }
      setProfile(updatedProfile)
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

      // Then update Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profile.id)

      if (updateError) {
        throw updateError
      }

      setError(null)
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      // Revert local state on error
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      }
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        profile,
        updateProfile,
        error,
        isProfileComplete: !!(
          profile?.username &&
          profile?.birth_date &&
          profile?.birth_time &&
          profile?.birth_place
        )
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
