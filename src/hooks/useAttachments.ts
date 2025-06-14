import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { EventAttachment } from './useEvents'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // Documents
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Audio
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
  // Video
  'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
  // Archives
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
]

export const useAttachments = () => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not supported'
    }

    return null
  }

  const uploadAttachment = async (file: File, eventId: string, description?: string): Promise<EventAttachment | null> => {
    if (!user) {
      toast.error('You must be logged in to upload files')
      return null
    }

    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      return null
    }

    setUploading(true)
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${eventId}/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('event-attachments')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Create attachment record
      const { data: attachment, error: dbError } = await supabase
        .from('event_attachments')
        .insert({
          event_id: eventId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
          description: description || null,
        })
        .select()
        .single()

      if (dbError) throw dbError

      toast.success('File uploaded successfully!')
      return attachment
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteAttachment = async (attachment: EventAttachment): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('event-attachments')
        .remove([attachment.storage_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('event_attachments')
        .delete()
        .eq('id', attachment.id)

      if (dbError) throw dbError

      toast.success('File deleted successfully!')
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
      return false
    }
  }

  const getAttachmentUrl = async (attachment: EventAttachment): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('event-attachments')
        .createSignedUrl(attachment.storage_path, 3600) // 1 hour expiry

      return data?.signedUrl || null
    } catch (error) {
      console.error('Error getting file URL:', error)
      return null
    }
  }

  const downloadAttachment = async (attachment: EventAttachment): Promise<void> => {
    try {
      const url = await getAttachmentUrl(attachment)
      if (!url) {
        toast.error('Failed to generate download link')
        return
      }

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = attachment.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download started!')
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error('Failed to download file')
    }
  }

  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return '📦'
    return '📎'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageFile = (fileType: string): boolean => {
    return fileType.startsWith('image/')
  }

  const isVideoFile = (fileType: string): boolean => {
    return fileType.startsWith('video/')
  }

  const isAudioFile = (fileType: string): boolean => {
    return fileType.startsWith('audio/')
  }

  return {
    uploading,
    uploadAttachment,
    deleteAttachment,
    getAttachmentUrl,
    downloadAttachment,
    getFileIcon,
    formatFileSize,
    isImageFile,
    isVideoFile,
    isAudioFile,
    validateFile,
    maxFileSize: MAX_FILE_SIZE,
    allowedFileTypes: ALLOWED_FILE_TYPES,
  }
}