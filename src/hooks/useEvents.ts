import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { differenceInWeeks, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

export interface EventAttachment {
  id: string
  event_id: string
  file_name: string
  file_size: number
  file_type: string
  storage_path: string
  upload_date: string
  description?: string
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  description: string | null
  date: string
  week_number: number
  category: string
  color: string
  attachments: string[]
  notify_on_anniversary: boolean
  created_at: string
  event_attachments?: EventAttachment[]
}

export const useEvents = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attachments (*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'week_number' | 'event_attachments'>, birthdate: string) => {
    if (!user) return

    try {
      const weekNumber = differenceInWeeks(parseISO(eventData.date), parseISO(birthdate))

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id,
          week_number: weekNumber,
        })
        .select()
        .single()

      if (error) throw error

      setEvents(prev => [...prev, { ...data, event_attachments: [] }])
      toast.success('Event created successfully!')
      return data
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
      throw error
    }
  }

  const updateEvent = async (id: string, updates: Partial<Event>, birthdate?: string) => {
    try {
      const updateData: any = { ...updates }
      
      if (updates.date && birthdate) {
        updateData.week_number = differenceInWeeks(parseISO(updates.date), parseISO(birthdate))
      }

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          event_attachments (*)
        `)
        .single()

      if (error) throw error

      setEvents(prev => prev.map(event => event.id === id ? data : event))
      toast.success('Event updated successfully!')
      return data
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
      throw error
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      // First, delete all attachments from storage
      const event = events.find(e => e.id === id)
      if (event?.event_attachments) {
        for (const attachment of event.event_attachments) {
          await supabase.storage
            .from('event_attachments')
            .remove([attachment.storage_path])
        }
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEvents(prev => prev.filter(event => event.id !== id))
      toast.success('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
      throw error
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [user])

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}