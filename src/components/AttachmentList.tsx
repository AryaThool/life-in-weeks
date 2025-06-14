import React, { useState } from 'react'
import { Download, Trash2, Eye, FileText, Image, Video, Music, Archive, ExternalLink } from 'lucide-react'
import { EventAttachment } from '../hooks/useEvents'
import { useAttachments } from '../hooks/useAttachments'
import { AttachmentPreview } from './AttachmentPreview'

interface AttachmentListProps {
  attachments: EventAttachment[]
  onDelete: (attachment: EventAttachment) => void
  className?: string
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDelete,
  className = '',
}) => {
  const { downloadAttachment, formatFileSize, isImageFile, isVideoFile, isAudioFile } = useAttachments()
  const [previewAttachment, setPreviewAttachment] = useState<EventAttachment | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (attachment: EventAttachment) => {
    setDeletingId(attachment.id)
    await onDelete(attachment)
    setDeletingId(null)
  }

  const getFileTypeIcon = (fileType: string) => {
    if (isImageFile(fileType)) return <Image className="w-5 h-5 text-blue-600" />
    if (isVideoFile(fileType)) return <Video className="w-5 h-5 text-purple-600" />
    if (isAudioFile(fileType)) return <Music className="w-5 h-5 text-green-600" />
    if (fileType === 'application/pdf') return <FileText className="w-5 h-5 text-red-600" />
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) {
      return <Archive className="w-5 h-5 text-orange-600" />
    }
    return <FileText className="w-5 h-5 text-gray-600" />
  }

  const canPreview = (attachment: EventAttachment) => {
    return isImageFile(attachment.file_type) || 
           isVideoFile(attachment.file_type) || 
           isAudioFile(attachment.file_type) ||
           attachment.file_type === 'application/pdf'
  }

  if (attachments.length === 0) {
    return null
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Attachments ({attachments.length})</span>
        </h4>
        
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {/* File Type Icon */}
              <div className="flex-shrink-0">
                {getFileTypeIcon(attachment.file_type)}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.file_name}
                  </p>
                  {canPreview(attachment) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Previewable
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attachment.upload_date).toLocaleDateString()}
                  </p>
                </div>
                
                {attachment.description && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {attachment.description}
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-1">
                {canPreview(attachment) && (
                  <button
                    onClick={() => setPreviewAttachment(attachment)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => downloadAttachment(attachment)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(attachment)}
                  disabled={deletingId === attachment.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete file"
                >
                  {deletingId === attachment.id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          isOpen={true}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </>
  )
}