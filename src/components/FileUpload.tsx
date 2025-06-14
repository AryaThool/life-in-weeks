import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, AlertCircle } from 'lucide-react'
import { useAttachments } from '../hooks/useAttachments'
import { EventAttachment } from '../hooks/useEvents'

interface FileUploadProps {
  eventId: string
  onUploadComplete: (attachment: EventAttachment) => void
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  eventId,
  onUploadComplete,
  className = '',
}) => {
  const { uploadAttachment, uploading, validateFile, formatFileSize, getFileIcon } = useAttachments()
  const [dragActive, setDragActive] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<File[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadQueue(acceptedFiles)
    
    for (const file of acceptedFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        continue // Skip invalid files
      }

      const attachment = await uploadAttachment(file, eventId)
      if (attachment) {
        onUploadComplete(attachment)
      }
    }
    
    setUploadQueue([])
  }, [eventId, uploadAttachment, onUploadComplete, validateFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragActive || dragActive
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDragActive ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-6 h-6 ${
                isDragActive ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Upload attachments'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Drag & drop files or click to browse
            </p>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported: Images, Documents, Audio, Video, Archives</p>
            <p>Max size: 50MB per file</p>
          </div>
        </div>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Upload Queue</h4>
          {uploadQueue.map((file, index) => {
            const validationError = validateFile(file)
            
            return (
              <div
                key={`${file.name}-${index}`}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  validationError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {validationError ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <span className="text-lg">{getFileIcon(file.type)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  {validationError && (
                    <p className="text-xs text-red-600 mt-1">{validationError}</p>
                  )}
                </div>
                
                <button
                  onClick={() => removeFromQueue(index)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-700 font-medium">Uploading files...</span>
        </div>
      )}
    </div>
  )
}