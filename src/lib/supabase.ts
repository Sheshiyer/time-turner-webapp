import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  avatar_url?: string
  updated_at?: string
  birth_date: string
  birth_time: string
  birth_place: string
}

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // First check if username (email prefix) meets length requirement
    const username = email.split('@')[0]
    if (username.length < 3) {
      return { 
        data: null, 
        error: new Error('Username (email prefix) must be at least 3 characters long') 
      }
    }

    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { data, error }
    if (!data.user) return { data, error: new Error('Signup failed - no user returned') }

    // Create initial profile with required fields
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id,
          username: username,
          birth_date: '', // Required by schema but will be filled later
          birth_time: '', // Required by schema but will be filled later
          birth_place: '', // Required by schema but will be filled later
          updated_at: new Date().toISOString()
        }
      ])

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.signOut()
      console.error('Profile creation failed:', profileError)
      return { 
        data: null, 
        error: new Error(`Failed to create profile: ${profileError.message}`) 
      }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Signup error:', err)
    return { 
      data: null, 
      error: new Error('An unexpected error occurred during signup') 
    }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  
  return { data, error }
}
