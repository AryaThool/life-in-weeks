import React from 'react'
import { LogOut, User, Calendar, BarChart3, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useEvents } from '../hooks/useEvents'
import { Timeline } from './Timeline'
import { differenceInWeeks, differenceInYears } from 'date-fns'

export const Dashboard: React.FC = () => {
  const { signOut, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { events, loading: eventsLoading } = useEvents()

  // Show loading while any critical data is loading
  if (authLoading || profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center text-gray-600 mt-4">
            {profileLoading ? 'Loading your profile...' : 'Loading your timeline...'}
          </p>
        </div>
      </div>
    )
  }

  const birthDate = new Date(profile.birthdate)
  const today = new Date()
  const weeksLived = differenceInWeeks(today, birthDate)
  const yearsLived = differenceInYears(today, birthDate)
  const eventsThisYear = events.filter(event => 
    new Date(event.date).getFullYear() === today.getFullYear()
  ).length

  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Life in Weeks</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {profile.full_name}
                </div>
                <div className="text-xs text-gray-500">
                  {yearsLived} years old
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {weeksLived.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Weeks Lived</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {yearsLived}
                </div>
                <div className="text-sm text-gray-600">Years Old</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {events.length}
                </div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {eventsThisYear}
                </div>
                <div className="text-sm text-gray-600">This Year</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        {events.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">Most Active Category</div>
                <div className="text-blue-700 mt-1 capitalize">
                  {topCategory ? `${topCategory[0]} (${topCategory[1]} events)` : 'No events yet'}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">Life Progress</div>
                <div className="text-green-700 mt-1">
                  {Math.round((weeksLived / (80 * 52)) * 100)}% of expected lifespan
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900">Event Categories</div>
                <div className="text-purple-700 mt-1">
                  {Object.keys(categoryStats).length} different categories
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <Timeline />
      </div>
    </div>
  )
}