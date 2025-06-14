import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, Tag, Palette, Bell, Trash2, Paperclip } from 'lucide-react'
import { format, addWeeks } from 'date-fns'
import { useEvents, Event, EventAttachment } from '../hooks/useEvents'
import { useAttachments } from '../hooks/useAttachments'
import { FileUpload } from './FileUpload'
import { AttachmentList } from './AttachmentList'
import toast from 'react-hot-toast'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  weekNumber: number | null
  birthdate: string
  event?: Event | null
}

interface EventFormData {
  title: string
  description: string
  date: string
  category: string
  color: string
  notify_on_anniversary: boolean
}

const categories = [
  'personal',
  'career',
  'education',
  'travel',
  'health',
  'family',
  'achievement',
  'other'
]

const colors = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#F97316', // orange
  '#06B6D4', // cyan
  '#8B5A2B', // brown
]

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  weekNumber,
  birthdate,
  event,
}) => {
  const { createEvent, updateEvent, deleteEvent, refetch } = useEvents()
  const { deleteAttachment } = useAttachments()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [attachments, setAttachments] = useState<EventAttachment[]>([])
  const [showAttachments, setShowAttachments] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EventFormData>({
    defaultValues: event ? {
      title: event.title,
      description: event.description || '',
      date: event.date,
      category: event.category,
      color: event.color,
      notify_on_anniversary: event.notify_on_anniversary,
    } : {
      title: '',
      description: '',
      date: weekNumber !== null 
        ? format(addWeeks(new Date(birthdate), weekNumber), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      category: 'personal',
      color: colors[0],
      notify_on_anniversary: false,
    }
  })

  const selectedColor = watch('color')

  // Initialize attachments when event changes
  useEffect(() => {
    if (event?.event_attachments) {
      setAttachments(event.event_attachments)
      setShowAttachments(event.event_attachments.length > 0)
    } else {
      setAttachments([])
      setShowAttachments(false)
    }
  }, [event])

  const onSubmit = async (data: EventFormData) => {
    if (weekNumber === null) return

    setLoading(true)
    try {
      if (event) {
        await updateEvent(event.id, data, birthdate)
      } else {
        await createEvent({
          ...data,
          attachments: [],
        }, birthdate)
      }
      onClose()
      reset()
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return

    setLoading(true)
    try {
      await deleteEvent(event.id)
      onClose()
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const handleAttachmentUpload = (attachment: EventAttachment) => {
    setAttachments(prev => [...prev, attachment])
    if (!showAttachments) {
      setShowAttachments(true)
    }
    // Refetch events to update the attachment count
    refetch()
  }

  const handleAttachmentDelete = async (attachment: EventAttachment) => {
    const success = await deleteAttachment(attachment)
    if (success) {
      setAttachments(prev => prev.filter(a => a.id !== attachment.id))
      // Refetch events to update the attachment count
      refetch()
    }
  }

  if (!isOpen) return null

  const weekDate = weekNumber !== null 
    ? addWeeks(new Date(birthdate), weekNumber)
    : new Date()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {event ? 'Edit Event' : 'Add Event'}
            </h2>
            <p className="text-gray-600 mt-1">
              Week {(weekNumber || 0) + 1} - {format(weekDate, 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {event && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="What happened this week?"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Add more details about this event..."
            />
          </div>

          {/* Date and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-1" />
              Event Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-8 h-8 rounded-full transition-all transform hover:scale-110 ${
                    selectedColor === color 
                      ? 'ring-2 ring-offset-2 ring-gray-400' 
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Anniversary Notification */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notify"
              {...register('notify_on_anniversary')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notify" className="flex items-center text-sm text-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Remind me on anniversary dates
            </label>
          </div>

          {/* Attachments Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Paperclip className="w-5 h-5" />
                <span>Attachments</span>
                {attachments.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {attachments.length}
                  </span>
                )}
              </h3>
              
              {!showAttachments && (
                <button
                  type="button"
                  onClick={() => setShowAttachments(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add Files
                </button>
              )}
            </div>

            {showAttachments && (
              <div className="space-y-4">
                {/* File Upload */}
                {event && (
                  <FileUpload
                    eventId={event.id}
                    onUploadComplete={handleAttachmentUpload}
                  />
                )}
                
                {!event && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 Save the event first to add attachments
                    </p>
                  </div>
                )}

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <AttachmentList
                    attachments={attachments}
                    onDelete={handleAttachmentDelete}
                  />
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {event ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Event?
              </h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. The event and all its attachments will be permanently removed from your timeline.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}