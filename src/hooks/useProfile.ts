import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export interface UserProfile {
  id: string
  full_name: string
  email: string
  birthdate: string
  created_at?: string
}

export const useProfile = () => {
  const { user, session } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user || !session) {
      setLoading(false)
      return
    }

    try {
      // Query by id (which matches auth.uid())
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this might happen for existing auth users
          console.log('No profile found for user:', user.id)
          setProfile(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('Profile updated successfully!')
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user, session])

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  }
}