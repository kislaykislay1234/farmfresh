import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_PROFILES } from '../lib/demoData'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('farmfresh_active_profile')
    return saved ? JSON.parse(saved) : DEMO_PROFILES.farmer
  })
  const [role, setRole] = useState(() => {
    return localStorage.getItem('farmfresh_active_role') || 'farmer'
  })
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            setUser(session.user)
            setIsDemo(false)
            // Fetch profile
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            if (userProfile) {
              setProfile(userProfile)
              setRole(userProfile.role || 'farmer')
            }
          }
        } catch (err) {
          console.warn('Supabase session load failed, continuing in demo mode:', err)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const switchDemoRole = (newRole) => {
    if (DEMO_PROFILES[newRole]) {
      setRole(newRole)
      setProfile(DEMO_PROFILES[newRole])
      setIsDemo(true)
      localStorage.setItem('farmfresh_active_role', newRole)
      localStorage.setItem('farmfresh_active_profile', JSON.stringify(DEMO_PROFILES[newRole]))
    }
  }

  const loginWithSupabase = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet.')
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUser(data.user)
    setIsDemo(false)
    return data
  }

  const signupWithSupabase = async (email, password, metadata) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet.')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    if (isSupabaseConfigured && supabase && user) {
      await supabase.auth.signOut()
    }
    setUser(null)
    // Return to default farmer demo
    switchDemoRole('farmer')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isDemo,
        loading,
        switchDemoRole,
        loginWithSupabase,
        signupWithSupabase,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
