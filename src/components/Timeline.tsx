import React, { useState, useRef } from 'react'
import { differenceInWeeks, addWeeks, format, isToday, isSameWeek, differenceInDays } from 'date-fns'
import { Plus, Download, Calendar, Filter, X, Menu, Sparkles, Maximize2, Paperclip } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useEvents, Event } from '../hooks/useEvents'
import { EventModal } from './EventModal'
import { ExportModal } from './ExportModal'
import { HistoricalEventsModal } from './HistoricalEventsModal'
import { WeekDetailsModal } from './WeekDetailsModal'

type ViewLevel = 'week' | 'month' | 'quarter' | 'year'

const categories = [
  { value: 'personal', label: 'Personal', color: '#3B82F6' },
  { value: 'career', label: 'Career', color: '#8B5CF6' },
  { value: 'education', label: 'Education', color: '#10B981' },
  { value: 'travel', label: 'Travel', color: '#F59E0B' },
  { value: 'health', label: 'Health', color: '#EF4444' },
  { value: 'family', label: 'Family', color: '#F97316' },
  { value: 'achievement', label: 'Achievement', color: '#06B6D4' },
  { value: 'other', label: 'Other', color: '#8B5A2B' },
]

export const Timeline: React.FC = () => {
  const { profile } = useProfile()
  const { events } = useEvents()
  const [viewLevel, setViewLevel] = useState<ViewLevel>('month')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isHistoricalEventsModalOpen, setIsHistoricalEventsModalOpen] = useState(false)
  const [isWeekDetailsModalOpen, setIsWeekDetailsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [showMobileControls, setShowMobileControls] = useState(false)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)
  const [selectedWeekForDetails, setSelectedWeekForDetails] = useState<number | null>(null)
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const timelineRef = useRef<HTMLDivElement>(null)

  if (!profile) return null

  const birthDate = new Date(profile.birthdate)
  const today = new Date()
  const totalWeeks = differenceInWeeks(today, birthDate)
  const totalDays = differenceInDays(today, birthDate)
  const expectedLifespan = 80 * 52 // 80 years in weeks

  // Filter events based on selected categories
  const filteredEvents = selectedCategories.length > 0 
    ? events.filter(event => selectedCategories.includes(event.category))
    : events

  const getViewConfig = () => {
    switch (viewLevel) {
      case 'week': return { weeksPerView: 1, gridCols: 1, itemSize: 'w-full h-40 sm:h-48' }
      case 'month': return { weeksPerView: 4, gridCols: 4, itemSize: 'w-full aspect-square' }
      case 'quarter': return { weeksPerView: 13, gridCols: 13, itemSize: 'w-8 h-8 sm:w-10 sm:h-10' }
      case 'year': return { weeksPerView: 52, gridCols: 52, itemSize: 'w-4 h-4 sm:w-5 sm:h-5' }
      default: return { weeksPerView: 4, gridCols: 4, itemSize: 'w-full aspect-square' }
    }
  }

  const { weeksPerView, itemSize } = getViewConfig()

  const getResponsiveGridCols = () => {
    switch (viewLevel) {
      case 'year': return 'grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-26 2xl:grid-cols-52'
      case 'quarter': return 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13'
      case 'month': return 'grid-cols-2 sm:grid-cols-4'
      case 'week': return 'grid-cols-1'
      default: return 'grid-cols-2 sm:grid-cols-4'
    }
  }

  const getWeekEvents = (weekNumber: number) => {
    const weekStartDate = addWeeks(birthDate, weekNumber)
    const weekEndDate = addWeeks(weekStartDate, 1)
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= weekStartDate && eventDate < weekEndDate
    })
  }

  const getWeekDate = (weekNumber: number) => {
    return addWeeks(birthDate, weekNumber)
  }

  const isCurrentWeek = (weekNumber: number) => {
    const weekDate = getWeekDate(weekNumber)
    return isSameWeek(weekDate, today)
  }

  const scrollToCurrentWeek = () => {
    if (timelineRef.current) {
      const currentWeekElement = timelineRef.current.querySelector(`[data-week="${totalWeeks}"]`)
      if (currentWeekElement) {
        currentWeekElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleWeekClick = (weekNumber: number, e: React.MouseEvent) => {
    // Clear any existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
    }

    // Set a timeout for single click
    const timeout = setTimeout(() => {
      setSelectedWeek(weekNumber)
      setEditingEvent(null)
      setIsEventModalOpen(true)
      setClickTimeout(null)
    }, 250) // 250ms delay to detect double click

    setClickTimeout(timeout)
  }

  const handleWeekDoubleClick = (weekNumber: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Clear the single click timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
    }

    // Open week details modal
    setSelectedWeekForDetails(weekNumber)
    setIsWeekDetailsModalOpen(true)
  }

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEvent(event)
    const eventWeek = differenceInWeeks(new Date(event.date), birthDate)
    setSelectedWeek(eventWeek)
    setIsEventModalOpen(true)
  }

  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryValue)
        ? prev.filter(cat => cat !== categoryValue)
        : [...prev, categoryValue]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
  }

  const getTotalAttachments = (weekEvents: Event[]) => {
    return weekEvents.reduce((total, event) => {
      return total + (event.event_attachments?.length || 0)
    }, 0)
  }

  const renderWeek = (weekNumber: number) => {
    const weekEvents = getWeekEvents(weekNumber)
    const weekDate = getWeekDate(weekNumber)
    const isCurrent = isCurrentWeek(weekNumber)
    const isLived = weekNumber <= totalWeeks
    const isToday = isCurrent && isLived
    const isHovered = hoveredWeek === weekNumber
    const totalAttachments = getTotalAttachments(weekEvents)

    const getWeekIntensity = () => {
      if (weekEvents.length === 0) return isLived ? 'bg-gradient-to-br from-blue-300 to-blue-500' : 'bg-gray-100'
      if (weekEvents.length === 1) return 'bg-gradient-to-br from-yellow-400 to-orange-500'
      if (weekEvents.length <= 3) return 'bg-gradient-to-br from-orange-500 to-red-500'
      return 'bg-gradient-to-br from-red-500 to-purple-600'
    }

    return (
      <div
        key={weekNumber}
        data-week={weekNumber}
        onClick={(e) => handleWeekClick(weekNumber, e)}
        onDoubleClick={(e) => handleWeekDoubleClick(weekNumber, e)}
        onMouseEnter={() => setHoveredWeek(weekNumber)}
        onMouseLeave={() => setHoveredWeek(null)}
        className={`
          relative ${itemSize} rounded-lg cursor-pointer transition-all duration-300 transform
          ${getWeekIntensity()}
          ${isToday ? 'ring-4 ring-green-400 ring-opacity-75 shadow-lg animate-pulse' : ''}
          ${isHovered ? 'scale-110 shadow-xl z-10' : 'hover:scale-105 hover:shadow-lg'}
          ${weekEvents.length > 0 ? 'ring-2 ring-yellow-300 ring-offset-1' : ''}
          ${!isLived ? 'opacity-40 hover:opacity-60' : ''}
        `}
        title={`Week ${weekNumber + 1} - ${format(weekDate, 'MMM d, yyyy')}${weekEvents.length > 0 ? ` (${weekEvents.length} events)` : ''}${totalAttachments > 0 ? ` • ${totalAttachments} attachments` : ''}`}
      >
        {/* Event indicators */}
        {weekEvents.length > 0 && (
          <>
            {viewLevel !== 'week' && (
              <div className={`absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center justify-center font-bold shadow-lg ${
                viewLevel === 'year' || viewLevel === 'quarter' ? 'w-3 h-3 text-[8px]' : 'w-5 h-5'
              }`}>
                {weekEvents.length > 9 ? '9+' : weekEvents.length}
              </div>
            )}
            
            {/* Attachment indicator */}
            {totalAttachments > 0 && viewLevel !== 'week' && (
              <div className={`absolute -top-1 -left-1 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg ${
                viewLevel === 'year' || viewLevel === 'quarter' ? 'w-3 h-3 text-[8px]' : 'w-4 h-4'
              }`}>
                <Paperclip className={`${viewLevel === 'year' || viewLevel === 'quarter' ? 'w-2 h-2' : 'w-3 h-3'}`} />
              </div>
            )}
            
            {/* Event category indicators for small views */}
            {(viewLevel === 'year' || viewLevel === 'quarter') && (
              <div className="absolute inset-0 flex flex-wrap">
                {weekEvents.slice(0, 4).map((event, index) => (
                  <div
                    key={event.id}
                    className="w-1/2 h-1/2 rounded-sm"
                    style={{ backgroundColor: event.color }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Current week pulse effect */}
        {isToday && (
          <div className="absolute inset-0 rounded-lg border-2 border-white animate-ping opacity-75" />
        )}

        {/* Detailed view for week view level */}
        {viewLevel === 'week' && (
          <div className="absolute inset-2 overflow-hidden">
            <div className="text-xs font-bold text-white mb-2 opacity-90 bg-black bg-opacity-20 rounded px-2 py-1">
              Week {weekNumber + 1}
              {totalAttachments > 0 && (
                <span className="ml-2 inline-flex items-center space-x-1">
                  <Paperclip className="w-3 h-3" />
                  <span>{totalAttachments}</span>
                </span>
              )}
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {weekEvents.slice(0, 6).map((event, index) => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className="bg-white bg-opacity-95 rounded-md px-2 py-1 text-xs truncate hover:bg-opacity-100 transition-all cursor-pointer shadow-sm transform hover:scale-105"
                  style={{ borderLeft: `3px solid ${event.color}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 truncate flex-1">{event.title}</div>
                    {event.event_attachments && event.event_attachments.length > 0 && (
                      <div className="flex items-center space-x-1 ml-2">
                        <Paperclip className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] text-gray-500">{event.event_attachments.length}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <div className="text-gray-600 text-[10px] truncate">{event.description}</div>
                  )}
                </div>
              ))}
              {weekEvents.length > 6 && (
                <div className="text-xs text-white opacity-75 text-center bg-black bg-opacity-20 rounded px-1">
                  +{weekEvents.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Month view event preview */}
        {viewLevel === 'month' && weekEvents.length > 0 && (
          <div className="absolute inset-1 overflow-hidden">
            <div className="text-[10px] text-white font-bold opacity-90 mb-1 bg-black bg-opacity-20 rounded px-1 flex items-center justify-between">
              <span>{weekEvents.length} event{weekEvents.length > 1 ? 's' : ''}</span>
              {totalAttachments > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="w-2 h-2" />
                  <span>{totalAttachments}</span>
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              {weekEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className="w-full h-1.5 rounded-full shadow-sm"
                  style={{ backgroundColor: event.color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hover tooltip for small views */}
        {isHovered && (viewLevel === 'year' || viewLevel === 'quarter') && weekEvents.length > 0 && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-20 shadow-lg">
            <div className="font-semibold">Week {weekNumber + 1}</div>
            <div>{format(weekDate, 'MMM d, yyyy')}</div>
            <div>{weekEvents.length} event{weekEvents.length > 1 ? 's' : ''}</div>
            {totalAttachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3" />
                <span>{totalAttachments} attachments</span>
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    )
  }

  const getVisibleWeeks = () => {
    if (selectedCategories.length > 0) {
      const weeksWithFilteredEvents = new Set<number>()
      
      filteredEvents.forEach(event => {
        const eventWeek = differenceInWeeks(new Date(event.date), birthDate)
        weeksWithFilteredEvents.add(eventWeek)
      })
      
      return Array.from(weeksWithFilteredEvents).sort((a, b) => a - b)
    }
    
    const weeks = []
    const maxWeeks = Math.min(expectedLifespan, totalWeeks + 520)
    
    for (let i = 0; i < maxWeeks; i += weeksPerView) {
      if (viewLevel === 'week') {
        weeks.push(i)
      } else {
        for (let j = 0; j < weeksPerView && i + j < maxWeeks; j++) {
          weeks.push(i + j)
        }
      }
    }
    return weeks
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span>Your Life Timeline</span>
            </h2>
            <div className="text-gray-600 mt-1 space-y-1">
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-blue-600">{totalWeeks.toLocaleString()}</span> weeks lived • 
                <span className="font-semibold text-green-600"> {totalDays.toLocaleString()}</span> days lived
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-medium">{Math.round((totalWeeks / expectedLifespan) * 100)}%</span> of expected ~{expectedLifespan.toLocaleString()} weeks lifespan
              </p>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-blue-600 font-medium">
                  Showing {filteredEvents.length} events in {selectedCategories.length} selected categories
                </p>
              )}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* View Level Controls */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {(['week', 'month', 'quarter', 'year'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewLevel(view)}
                  className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                    viewLevel === view
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={scrollToCurrentWeek}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Go to Current Week"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm">Current</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategories.length > 0 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {selectedCategories.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              {showCategoryFilter && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64 z-20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map((category) => {
                      const eventCount = events.filter(e => e.category === category.value).length
                      const isSelected = selectedCategories.includes(category.value)
                      
                      return (
                        <label
                          key={category.value}
                          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCategory(category.value)}
                            className="text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {category.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {eventCount}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setIsHistoricalEventsModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Historical Events</span>
            </button>

            <button
              onClick={() => {
                setSelectedWeek(totalWeeks)
                setEditingEvent(null)
                setIsEventModalOpen(true)
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Mobile Controls Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border shadow-sm"
            >
              <Menu className="w-4 h-4" />
              <span>Controls</span>
            </button>
          </div>
        </div>

        {/* Mobile Controls Panel */}
        {showMobileControls && (
          <div className="lg:hidden mt-4 p-4 bg-white rounded-xl shadow-lg border space-y-4">
            {/* View Level Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Level</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['week', 'month', 'quarter', 'year'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setViewLevel(view)}
                    className={`flex-1 px-2 py-2 rounded-md text-xs font-medium capitalize transition-all ${
                      viewLevel === view
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <button
                onClick={scrollToCurrentWeek}
                className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Go to Current Week</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const eventCount = events.filter(e => e.category === category.value).length
                  const isSelected = selectedCategories.includes(category.value)
                  
                  return (
                    <label
                      key={category.value}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(category.value)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {category.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {eventCount}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsHistoricalEventsModalOpen(true)
                  setShowMobileControls(false)
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Historical Events</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedWeek(totalWeeks)
                    setEditingEvent(null)
                    setIsEventModalOpen(true)
                    setShowMobileControls(false)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>

                <button
                  onClick={() => {
                    setIsExportModalOpen(true)
                    setShowMobileControls(false)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {selectedCategories.length > 0 && (
        <div className="px-4 sm:px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-900">Active filters:</span>
            {selectedCategories.map((categoryValue) => {
              const category = categories.find(cat => cat.value === categoryValue)
              return (
                <span
                  key={categoryValue}
                  className="inline-flex items-center space-x-1 bg-white px-3 py-1 rounded-full text-sm border border-blue-200 shadow-sm"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <span>{category?.label}</span>
                  <button
                    onClick={() => toggleCategory(categoryValue)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline Container */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Click to add event</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👆</span>
              <span>Double-click for details</span>
            </div>
          </div>
        </div>

        <div 
          ref={timelineRef}
          className="overflow-auto border-2 border-gray-100 rounded-xl p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white"
          style={{ 
            maxHeight: viewLevel === 'week' ? '600px' : '700px'
          }}
        >
          <div 
            className={`grid gap-1 sm:gap-2 ${getResponsiveGridCols()}`}
            style={{ 
              minHeight: viewLevel === 'week' ? '500px' : 'auto'
            }}
          >
            {getVisibleWeeks().map(renderWeek)}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-300 to-blue-500 rounded shadow-sm"></div>
            <span className="text-gray-700 font-medium">Weeks Lived</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded ring-2 ring-green-300 shadow-sm animate-pulse"></div>
            <span className="text-gray-700 font-medium">Current Week</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded border border-gray-200 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Future Weeks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded ring-2 ring-yellow-300 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Has Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-purple-600 rounded ring-2 ring-red-300 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Many Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
              <Paperclip className="w-2 h-2 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Has Attachments</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false)
            setEditingEvent(null)
            setSelectedWeek(null)
          }}
          weekNumber={selectedWeek}
          birthdate={profile.birthdate}
          event={editingEvent}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          timelineRef={timelineRef}
          profile={profile}
          events={events}
        />
      )}

      {isHistoricalEventsModalOpen && (
        <HistoricalEventsModal
          isOpen={isHistoricalEventsModalOpen}
          onClose={() => setIsHistoricalEventsModalOpen(false)}
          birthdate={profile.birthdate}
        />
      )}

      {isWeekDetailsModalOpen && selectedWeekForDetails !== null && (
        <WeekDetailsModal
          isOpen={isWeekDetailsModalOpen}
          onClose={() => {
            setIsWeekDetailsModalOpen(false)
            setSelectedWeekForDetails(null)
          }}
          weekNumber={selectedWeekForDetails}
          birthdate={profile.birthdate}
          events={getWeekEvents(selectedWeekForDetails)}
        />
      )}
    </div>
  )
}