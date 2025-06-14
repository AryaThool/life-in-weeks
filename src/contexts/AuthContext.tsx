import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, birthdate: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, birthdate: string) => {
    try {
      // Step 1: Create auth user with metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (signUpError) {
        console.error("Signup failed:", signUpError.message)
        throw signUpError
      }

      // Step 2: Ensure session is available (wait for login to complete)
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const user = signUpData.user || session?.user

      if (!user || !user.id) {
        console.error("Session missing, user not authenticated.")
        throw new Error("Authentication failed - no user session")
      }

      // Step 3: Insert profile with correct user_id
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: user.id,               // Must match auth.uid()
            full_name: fullName,
            email: email,
            birthdate: birthdate
          }
        ])

      if (profileError) {
        console.error("Profile creation error:", profileError.message)
        throw profileError
      } else {
        console.log("✅ Profile created successfully.")
        toast.success('Account created successfully!')
      }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to create account')
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle specific email confirmation error
        if (error.message === 'Email not confirmed') {
          toast.error('This account was created when email confirmation was required. Please try creating a new account or contact support.')
          throw new Error('This account was created when email confirmation was required. Please try creating a new account.')
        }
        throw error
      }

      toast.success('Welcome back!')
    } catch (error) {
      const authError = error as AuthError
      
      // Don't show the generic error message if we already handled the email confirmation case
      if (authError.message !== 'This account was created when email confirmation was required. Please try creating a new account.') {
        toast.error(authError.message || 'Failed to sign in')
      }
      
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success('Signed out successfully')
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to sign out')
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}