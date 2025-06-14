import React from 'react'
import { X, Calendar, Clock, Tag, MapPin, Users, Star, Paperclip, Download, Eye } from 'lucide-react'
import { format, addWeeks, differenceInYears, differenceInDays } from 'date-fns'
import { Event } from '../hooks/useEvents'
import { useAttachments } from '../hooks/useAttachments'

interface WeekDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  weekNumber: number
  birthdate: string
  events: Event[]
}

const categories = [
  { value: 'personal', label: 'Personal', color: '#3B82F6', icon: Users },
  { value: 'career', label: 'Career', color: '#8B5CF6', icon: Star },
  { value: 'education', label: 'Education', color: '#10B981', icon: Star },
  { value: 'travel', label: 'Travel', color: '#F59E0B', icon: MapPin },
  { value: 'health', label: 'Health', color: '#EF4444', icon: Star },
  { value: 'family', label: 'Family', color: '#F97316', icon: Users },
  { value: 'achievement', label: 'Achievement', color: '#06B6D4', icon: Star },
  { value: 'other', label: 'Other', color: '#8B5A2B', icon: Tag },
]

export const WeekDetailsModal: React.FC<WeekDetailsModalProps> = ({
  isOpen,
  onClose,
  weekNumber,
  birthdate,
  events,
}) => {
  const { downloadAttachment, formatFileSize, getFileIcon } = useAttachments()

  if (!isOpen) return null

  const birthDate = new Date(birthdate)
  const weekDate = addWeeks(birthDate, weekNumber)
  const weekEndDate = addWeeks(weekDate, 1)
  const ageAtWeek = differenceInYears(weekDate, birthDate)
  const daysSinceBirth = differenceInDays(weekDate, birthDate)

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1]
  }

  const getSeasonEmoji = (date: Date) => {
    const month = date.getMonth()
    if (month >= 2 && month <= 4) return '🌸' // Spring
    if (month >= 5 && month <= 7) return '☀️' // Summer
    if (month >= 8 && month <= 10) return '🍂' // Fall
    return '❄️' // Winter
  }

  const getLifeStageInfo = (age: number) => {
    if (age < 5) return { stage: 'Early Childhood', emoji: '👶', description: 'Learning and growing' }
    if (age < 13) return { stage: 'Childhood', emoji: '🧒', description: 'School and play' }
    if (age < 20) return { stage: 'Teenage Years', emoji: '🧑', description: 'Discovery and growth' }
    if (age < 30) return { stage: 'Young Adult', emoji: '👨', description: 'Building foundations' }
    if (age < 50) return { stage: 'Adult', emoji: '👨‍💼', description: 'Career and family' }
    if (age < 65) return { stage: 'Middle Age', emoji: '👨‍🦳', description: 'Experience and wisdom' }
    return { stage: 'Senior Years', emoji: '👴', description: 'Reflection and legacy' }
  }

  const lifeStage = getLifeStageInfo(ageAtWeek)
  const totalAttachments = events.reduce((total, event) => total + (event.event_attachments?.length || 0), 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="pr-12">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Week {weekNumber + 1}</h2>
                <p className="text-blue-100">
                  {format(weekDate, 'MMMM d')} - {format(weekEndDate, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Age {ageAtWeek}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{getSeasonEmoji(weekDate)}</span>
                <span>{format(weekDate, 'MMMM')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{lifeStage.emoji}</span>
                <span>{lifeStage.stage}</span>
              </div>
              {totalAttachments > 0 && (
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4" />
                  <span>{totalAttachments} attachments</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Life Context */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <span>{lifeStage.emoji}</span>
              <span>Life Context</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-semibold text-blue-600">{ageAtWeek} years old</div>
                <div className="text-gray-600">{lifeStage.description}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-semibold text-purple-600">{daysSinceBirth.toLocaleString()} days</div>
                <div className="text-gray-600">since birth</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="font-semibold text-green-600">{Math.round((weekNumber / (80 * 52)) * 100)}%</div>
                <div className="text-gray-600">of expected lifespan</div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <span>Events This Week</span>
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {events.length}
              </span>
            </h3>

            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-medium">No events recorded</p>
                <p className="text-sm">This was a quiet week in your timeline</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const categoryInfo = getCategoryInfo(event.category)
                  const Icon = categoryInfo.icon
                  const attachments = event.event_attachments || []
                  
                  return (
                    <div
                      key={event.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div 
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${categoryInfo.color}20` }}
                        >
                          <Icon 
                            className="w-5 h-5" 
                            style={{ color: categoryInfo.color }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {event.title}
                            </h4>
                            <span 
                              className="px-2 py-1 text-xs rounded-full text-white font-medium"
                              style={{ backgroundColor: categoryInfo.color }}
                            >
                              {categoryInfo.label}
                            </span>
                            {attachments.length > 0 && (
                              <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                <Paperclip className="w-3 h-3" />
                                <span>{attachments.length}</span>
                              </span>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                            </div>
                            {event.notify_on_anniversary && (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <span>🔔</span>
                                <span>Anniversary reminder</span>
                              </div>
                            )}
                          </div>

                          {/* Attachments */}
                          {attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                                <Paperclip className="w-4 h-4" />
                                <span>Attachments ({attachments.length})</span>
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <span className="text-sm">{getFileIcon(attachment.file_type)}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 truncate">
                                        {attachment.file_name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(attachment.file_size)}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => downloadAttachment(attachment)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Download"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Week Statistics */}
          {events.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Week Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="font-semibold text-blue-600">{events.length}</div>
                  <div className="text-xs text-gray-600">Total Events</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="font-semibold text-green-600">
                    {new Set(events.map(e => e.category)).size}
                  </div>
                  <div className="text-xs text-gray-600">Categories</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="font-semibold text-purple-600">
                    {events.filter(e => e.notify_on_anniversary).length}
                  </div>
                  <div className="text-xs text-gray-600">With Reminders</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="font-semibold text-orange-600">
                    {events.filter(e => e.description && e.description.length > 0).length}
                  </div>
                  <div className="text-xs text-gray-600">With Details</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="font-semibold text-red-600">{totalAttachments}</div>
                  <div className="text-xs text-gray-600">Attachments</div>
                </div>
              </div>
            </div>
          )}

          {/* Fun Facts */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <span>✨</span>
              <span>Fun Facts</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• This was week #{weekNumber + 1} of your life</p>
              <p>• You were {ageAtWeek} years old during this week</p>
              <p>• It was {format(weekDate, 'EEEE, MMMM do')} when this week started</p>
              <p>• You had lived {daysSinceBirth.toLocaleString()} days by this point</p>
              {events.length > 0 && (
                <p>• You recorded {events.length} significant {events.length === 1 ? 'event' : 'events'} this week</p>
              )}
              {totalAttachments > 0 && (
                <p>• You uploaded {totalAttachments} {totalAttachments === 1 ? 'file' : 'files'} for this week's events</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Week {weekNumber + 1} • {format(weekDate, 'MMMM d, yyyy')}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}