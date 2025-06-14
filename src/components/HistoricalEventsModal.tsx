import React, { useState, useMemo } from 'react'
import { X, Calendar, Globe, Cpu, Palette, Microscope, Trophy, AlertTriangle, Users, Check, Plus, Sparkles } from 'lucide-react'
import { HistoricalEventsService, HistoricalEvent } from '../services/historicalEvents'
import { useEvents } from '../hooks/useEvents'
import { differenceInWeeks, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

interface HistoricalEventsModalProps {
  isOpen: boolean
  onClose: () => void
  birthdate: string
}

const categoryIcons = {
  world: Globe,
  technology: Cpu,
  culture: Palette,
  science: Microscope,
  sports: Trophy,
  disaster: AlertTriangle,
  politics: Users,
  personal: Calendar
}

const categoryColors = {
  world: '#EF4444',
  technology: '#3B82F6',
  culture: '#8B5CF6',
  science: '#10B981',
  sports: '#F59E0B',
  disaster: '#DC2626',
  politics: '#6B7280',
  personal: '#F97316'
}

const significanceLabels = {
  low: 'Minor',
  medium: 'Notable',
  high: 'Major',
  critical: 'Historic'
}

export const HistoricalEventsModal: React.FC<HistoricalEventsModalProps> = ({
  isOpen,
  onClose,
  birthdate,
}) => {
  const { createEvent, events: existingEvents } = useEvents()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['technology', 'world', 'science'])
  const [selectedSignificance, setSelectedSignificance] = useState<('low' | 'medium' | 'high' | 'critical')[]>(['high', 'critical'])
  const [includeLifeStages, setIncludeLifeStages] = useState(true)
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const availableEvents = useMemo(() => {
    let events = HistoricalEventsService.getAllHistoricalEvents(birthdate, includeLifeStages)
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      events = events.filter(event => selectedCategories.includes(event.category))
    }
    
    // Filter by significance
    events = events.filter(event => selectedSignificance.includes(event.significance))
    
    // Filter out events that already exist in user's timeline
    const existingEventTitles = new Set(existingEvents.map(e => e.title.toLowerCase()))
    events = events.filter(event => !existingEventTitles.has(event.title.toLowerCase()))
    
    return events
  }, [birthdate, selectedCategories, selectedSignificance, includeLifeStages, existingEvents])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSignificance = (significance: 'low' | 'medium' | 'high' | 'critical') => {
    setSelectedSignificance(prev => 
      prev.includes(significance)
        ? prev.filter(s => s !== significance)
        : [...prev, significance]
    )
  }

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const selectAllVisible = () => {
    setSelectedEvents(new Set(availableEvents.map(e => e.id)))
  }

  const clearSelection = () => {
    setSelectedEvents(new Set())
  }

  const addSelectedEvents = async () => {
    if (selectedEvents.size === 0) {
      toast.error('Please select at least one event to add')
      return
    }

    setLoading(true)
    try {
      const eventsToAdd = availableEvents.filter(event => selectedEvents.has(event.id))
      
      for (const event of eventsToAdd) {
        await createEvent({
          title: event.title,
          description: event.description,
          date: event.date,
          category: event.category === 'personal' ? 'personal' : 'other',
          color: categoryColors[event.category] || '#6B7280',
          attachments: [],
          notify_on_anniversary: false,
        }, birthdate)
      }

      toast.success(`Added ${eventsToAdd.length} historical events to your timeline!`)
      onClose()
    } catch (error) {
      console.error('Error adding historical events:', error)
      toast.error('Failed to add some events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const categories = Object.keys(categoryIcons) as (keyof typeof categoryIcons)[]
  const significanceLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Historical Events</h2>
              <p className="text-gray-600">Automatically populate your timeline with significant world events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category]
                    const isSelected = selectedCategories.includes(category)
                    const eventCount = HistoricalEventsService.getEventsByCategory(birthdate, [category]).length
                    
                    return (
                      <label
                        key={category}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(category)}
                          className="text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: categoryColors[category] }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 capitalize">{category}</div>
                          <div className="text-sm text-gray-500">{eventCount} events</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Significance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Significance</h3>
                <div className="space-y-2">
                  {significanceLevels.map((significance) => {
                    const isSelected = selectedSignificance.includes(significance)
                    const eventCount = HistoricalEventsService.getEventsBySignificance(birthdate, [significance]).length
                    
                    return (
                      <label
                        key={significance}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSignificance(significance)}
                          className="text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{significanceLabels[significance]}</div>
                          <div className="text-sm text-gray-500">{eventCount} events</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Life Stages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Milestones</h3>
                <label className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={includeLifeStages}
                    onChange={(e) => setIncludeLifeStages(e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Include Life Stage Milestones</div>
                    <div className="text-sm text-gray-500">Birthdays, coming of age, etc.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1 flex flex-col">
            {/* Events Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Available Events ({availableEvents.length})
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedEvents.size} selected
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={selectAllVisible}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="flex-1 overflow-y-auto p-6">
              {availableEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more historical events.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableEvents.map((event) => {
                    const Icon = categoryIcons[event.category]
                    const isSelected = selectedEvents.has(event.id)
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => toggleEventSelection(event.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-100' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {isSelected ? (
                              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon 
                                className="w-4 h-4 flex-shrink-0" 
                                style={{ color: categoryColors[event.category] }}
                              />
                              <h4 className="font-semibold text-gray-900 truncate">{event.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                event.significance === 'critical' ? 'bg-red-100 text-red-800' :
                                event.significance === 'high' ? 'bg-orange-100 text-orange-800' :
                                event.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {significanceLabels[event.significance]}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              <span className="capitalize">{event.category}</span>
                              <span>{event.source}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedEvents.size} events selected
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSelectedEvents}
                    disabled={loading || selectedEvents.size === 0}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding Events...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add {selectedEvents.size} Events</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}