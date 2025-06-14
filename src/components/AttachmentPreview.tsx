import React, { useState, useEffect } from 'react'
import { X, Download, ExternalLink, AlertCircle } from 'lucide-react'
import { EventAttachment } from '../hooks/useEvents'
import { useAttachments } from '../hooks/useAttachments'

interface AttachmentPreviewProps {
  attachment: EventAttachment
  isOpen: boolean
  onClose: () => void
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  isOpen,
  onClose,
}) => {
  const { getAttachmentUrl, downloadAttachment, formatFileSize, isImageFile, isVideoFile, isAudioFile } = useAttachments()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && attachment) {
      loadPreviewUrl()
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [isOpen, attachment])

  const loadPreviewUrl = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = await getAttachmentUrl(attachment)
      if (url) {
        setPreviewUrl(url)
      } else {
        setError('Failed to load preview')
      }
    } catch (err) {
      setError('Failed to load preview')
    } finally {
      setLoading(false)
    }
  }

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      )
    }

    if (error || !previewUrl) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Preview not available'}</p>
            <button
              onClick={() => downloadAttachment(attachment)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      )
    }

    // Image preview
    if (isImageFile(attachment.file_type)) {
      return (
        <div className="flex items-center justify-center max-h-[70vh] overflow-hidden">
          <img
            src={previewUrl}
            alt={attachment.file_name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onError={() => setError('Failed to load image')}
          />
        </div>
      )
    }

    // Video preview
    if (isVideoFile(attachment.file_type)) {
      return (
        <div className="flex items-center justify-center">
          <video
            src={previewUrl}
            controls
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            onError={() => setError('Failed to load video')}
          >
            Your browser does not support video playback.
          </video>
        </div>
      )
    }

    // Audio preview
    if (isAudioFile(attachment.file_type)) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🎵</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{attachment.file_name}</h3>
              <audio
                src={previewUrl}
                controls
                className="w-full max-w-md"
                onError={() => setError('Failed to load audio')}
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          </div>
        </div>
      )
    }

    // PDF preview
    if (attachment.file_type === 'application/pdf') {
      return (
        <div className="h-[70vh]">
          <iframe
            src={previewUrl}
            className="w-full h-full rounded-lg border"
            title={attachment.file_name}
            onError={() => setError('Failed to load PDF')}
          />
        </div>
      )
    }

    // Fallback for other file types
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{attachment.file_name}</h3>
          <p className="text-gray-600 mb-4">Preview not available for this file type</p>
          <button
            onClick={() => downloadAttachment(attachment)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {attachment.file_name}
            </h2>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>{formatFileSize(attachment.file_size)}</span>
              <span>{new Date(attachment.upload_date).toLocaleDateString()}</span>
              <span className="capitalize">{attachment.file_type.split('/')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => downloadAttachment(attachment)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download file"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {previewUrl && (
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {attachment.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{attachment.description}</p>
            </div>
          )}
          
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  )
}