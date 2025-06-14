import React, { useState } from 'react'
import { X, Download, FileImage, FileText, Calendar, BarChart3, Package, Sparkles, Clock, Users } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { UserProfile } from '../hooks/useProfile'
import { Event } from '../hooks/useEvents'
import { useAttachments } from '../hooks/useAttachments'
import toast from 'react-hot-toast'
import { format, differenceInWeeks, differenceInYears, differenceInDays } from 'date-fns'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  timelineRef: React.RefObject<HTMLDivElement>
  profile: UserProfile
  events: Event[]
}

type ExportFormat = 'png' | 'pdf' | 'json' | 'csv' | 'comprehensive-pdf'

const exportFormats = [
  {
    id: 'png' as ExportFormat,
    name: 'PNG Image',
    description: 'High-quality timeline visualization',
    icon: FileImage,
    size: 'Small',
    features: ['Timeline visualization', 'High resolution', 'Easy sharing']
  },
  {
    id: 'pdf' as ExportFormat,
    name: 'Basic PDF',
    description: 'Simple PDF with timeline image',
    icon: FileText,
    size: 'Medium',
    features: ['Timeline image', 'Basic info', 'Print-friendly']
  },
  {
    id: 'comprehensive-pdf' as ExportFormat,
    name: 'Comprehensive PDF Report',
    description: 'Detailed life report with statistics and insights',
    icon: BarChart3,
    size: 'Large',
    features: ['Complete life analysis', 'Event details', 'Statistics', 'Insights', 'Attachment list']
  },
  {
    id: 'json' as ExportFormat,
    name: 'JSON Data',
    description: 'Raw data for backup or analysis',
    icon: Package,
    size: 'Small',
    features: ['All event data', 'Machine readable', 'Backup format', 'Import ready']
  },
  {
    id: 'csv' as ExportFormat,
    name: 'CSV Spreadsheet',
    description: 'Event data for Excel or analysis',
    icon: FileText,
    size: 'Small',
    features: ['Spreadsheet format', 'Event list', 'Easy analysis', 'Excel compatible']
  }
]

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  timelineRef,
  profile,
  events,
}) => {
  const { formatFileSize } = useAttachments()
  const [exporting, setExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('comprehensive-pdf')

  const generateLifeStatistics = () => {
    const birthDate = new Date(profile.birthdate)
    const today = new Date()
    const totalWeeks = differenceInWeeks(today, birthDate)
    const totalDays = differenceInDays(today, birthDate)
    const ageYears = differenceInYears(today, birthDate)
    
    // Event statistics
    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const eventsByYear = events.reduce((acc, event) => {
      const year = new Date(event.date).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const totalAttachments = events.reduce((total, event) => 
      total + (event.event_attachments?.length || 0), 0
    )

    const eventsWithAttachments = events.filter(event => 
      event.event_attachments && event.event_attachments.length > 0
    ).length

    const mostActiveYear = Object.entries(eventsByYear)
      .sort(([,a], [,b]) => b - a)[0]

    const topCategory = Object.entries(eventsByCategory)
      .sort(([,a], [,b]) => b - a)[0]

    return {
      basic: {
        totalWeeks,
        totalDays,
        ageYears,
        lifeProgress: Math.round((totalWeeks / (80 * 52)) * 100)
      },
      events: {
        total: events.length,
        byCategory: eventsByCategory,
        byYear: eventsByYear,
        mostActiveYear: mostActiveYear ? { year: mostActiveYear[0], count: mostActiveYear[1] } : null,
        topCategory: topCategory ? { category: topCategory[0], count: topCategory[1] } : null,
        averagePerYear: events.length / Math.max(1, ageYears),
        withReminders: events.filter(e => e.notify_on_anniversary).length
      },
      attachments: {
        total: totalAttachments,
        eventsWithAttachments,
        averagePerEvent: totalAttachments / Math.max(1, events.length)
      }
    }
  }

  const exportAsJSON = () => {
    const stats = generateLifeStatistics()
    const exportData = {
      profile: {
        name: profile.full_name,
        email: profile.email,
        birthdate: profile.birthdate,
        exportDate: new Date().toISOString()
      },
      statistics: stats,
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        category: event.category,
        color: event.color,
        weekNumber: event.week_number,
        notifyOnAnniversary: event.notify_on_anniversary,
        attachments: event.event_attachments?.map(att => ({
          fileName: att.file_name,
          fileSize: att.file_size,
          fileType: att.file_type,
          uploadDate: att.upload_date,
          description: att.description
        })) || [],
        createdAt: event.created_at
      })),
      metadata: {
        version: '1.0',
        exportedBy: 'Life in Weeks Timeline',
        totalEvents: events.length,
        totalAttachments: stats.attachments.total
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.full_name.replace(/\s+/g, '_')}_life_timeline_${format(new Date(), 'yyyy-MM-dd')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const headers = [
      'Date',
      'Week Number',
      'Title',
      'Description',
      'Category',
      'Color',
      'Has Attachments',
      'Attachment Count',
      'Notify on Anniversary',
      'Created At'
    ]

    const csvData = events.map(event => [
      event.date,
      event.week_number,
      `"${event.title.replace(/"/g, '""')}"`,
      `"${(event.description || '').replace(/"/g, '""')}"`,
      event.category,
      event.color,
      (event.event_attachments && event.event_attachments.length > 0) ? 'Yes' : 'No',
      event.event_attachments?.length || 0,
      event.notify_on_anniversary ? 'Yes' : 'No',
      event.created_at
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.full_name.replace(/\s+/g, '_')}_events_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsComprehensivePDF = async () => {
    const stats = generateLifeStatistics()
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let yPosition = margin

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
    }

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold = false, color = '#000000') => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      pdf.setTextColor(color)
      const lines = pdf.splitTextToSize(text, contentWidth)
      checkPageBreak(lines.length * (fontSize * 0.35))
      pdf.text(lines, margin, yPosition)
      yPosition += lines.length * (fontSize * 0.35) + 5
    }

    // Cover Page
    pdf.setFillColor(59, 130, 246) // Blue background
    pdf.rect(0, 0, pageWidth, 80, 'F')
    
    pdf.setTextColor('#FFFFFF')
    pdf.setFontSize(32)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Life Timeline Report', margin, 40)
    
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'normal')
    pdf.text(profile.full_name, margin, 55)
    
    pdf.setFontSize(12)
    pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, margin, 70)

    yPosition = 100
    pdf.setTextColor('#000000')

    // Executive Summary
    addText('Executive Summary', 20, true, '#1F2937')
    addText(`This comprehensive report analyzes ${profile.full_name}'s life timeline, covering ${stats.basic.ageYears} years of life with ${stats.events.total} recorded events across ${Object.keys(stats.events.byCategory).length} different categories.`, 12)
    
    yPosition += 10

    // Key Statistics
    addText('Key Life Statistics', 16, true, '#374151')
    
    const keyStats = [
      `Age: ${stats.basic.ageYears} years old`,
      `Days Lived: ${stats.basic.totalDays.toLocaleString()} days`,
      `Weeks Lived: ${stats.basic.totalWeeks.toLocaleString()} weeks`,
      `Life Progress: ${stats.basic.lifeProgress}% of expected 80-year lifespan`,
      `Total Events: ${stats.events.total} recorded events`,
      `Event Density: ${stats.events.averagePerYear.toFixed(1)} events per year`,
      `Digital Attachments: ${stats.attachments.total} files across ${stats.attachments.eventsWithAttachments} events`
    ]

    keyStats.forEach(stat => {
      addText(`• ${stat}`, 11)
    })

    yPosition += 10

    // Timeline Analysis
    checkPageBreak(60)
    addText('Timeline Analysis', 16, true, '#374151')
    
    if (stats.events.mostActiveYear) {
      addText(`Most Active Year: ${stats.events.mostActiveYear.year} with ${stats.events.mostActiveYear.count} events`, 12)
    }
    
    if (stats.events.topCategory) {
      addText(`Primary Focus Area: ${stats.events.topCategory.category} (${stats.events.topCategory.count} events)`, 12)
    }

    addText(`Anniversary Reminders: ${stats.events.withReminders} events have anniversary notifications enabled`, 12)

    yPosition += 10

    // Category Breakdown
    checkPageBreak(80)
    addText('Event Categories', 16, true, '#374151')
    
    Object.entries(stats.events.byCategory)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = ((count / stats.events.total) * 100).toFixed(1)
        addText(`• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${count} events (${percentage}%)`, 11)
      })

    yPosition += 10

    // Year-by-Year Analysis
    checkPageBreak(100)
    addText('Year-by-Year Activity', 16, true, '#374151')
    
    const sortedYears = Object.entries(stats.events.byYear)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
    
    sortedYears.forEach(([year, count]) => {
      addText(`${year}: ${count} events`, 11)
    })

    yPosition += 15

    // Detailed Event List
    checkPageBreak(60)
    addText('Complete Event Timeline', 16, true, '#374151')
    addText('Chronological list of all recorded events:', 12)
    
    yPosition += 5

    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    sortedEvents.forEach((event, index) => {
      checkPageBreak(25)
      
      // Event header
      addText(`${index + 1}. ${event.title}`, 12, true, '#1F2937')
      
      // Event details
      const eventDate = format(new Date(event.date), 'MMMM d, yyyy')
      const ageAtEvent = differenceInYears(new Date(event.date), new Date(profile.birthdate))
      
      addText(`Date: ${eventDate} (Age ${ageAtEvent})`, 10)
      addText(`Category: ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}`, 10)
      addText(`Week: ${event.week_number + 1}`, 10)
      
      if (event.description) {
        addText(`Description: ${event.description}`, 10)
      }
      
      if (event.event_attachments && event.event_attachments.length > 0) {
        addText(`Attachments: ${event.event_attachments.length} files`, 10)
        event.event_attachments.forEach(att => {
          addText(`  • ${att.file_name} (${formatFileSize(att.file_size)})`, 9)
        })
      }
      
      yPosition += 5
    })

    // Insights and Reflections
    checkPageBreak(80)
    addText('Life Insights & Patterns', 16, true, '#374151')
    
    const insights = [
      `You've documented an average of ${stats.events.averagePerYear.toFixed(1)} significant events per year of your life.`,
      `Your most active category is "${stats.events.topCategory?.category}" which represents ${((stats.events.topCategory?.count || 0) / stats.events.total * 100).toFixed(1)}% of your recorded events.`,
      `You've preserved ${stats.attachments.total} digital memories through file attachments.`,
      `${((stats.events.withReminders / stats.events.total) * 100).toFixed(1)}% of your events have anniversary reminders enabled.`,
      `You've lived ${stats.basic.lifeProgress}% of an expected 80-year lifespan, with ${80 - stats.basic.ageYears} years of potential adventures ahead.`
    ]

    insights.forEach(insight => {
      addText(`• ${insight}`, 11)
    })

    yPosition += 10

    // Footer
    checkPageBreak(30)
    addText('About This Report', 14, true, '#6B7280')
    addText('This report was generated by Life in Weeks Timeline, a personal life visualization tool. It represents your recorded events and milestones as documented in your timeline.', 10)
    addText(`Report generated on ${format(new Date(), 'MMMM d, yyyy')} at ${format(new Date(), 'h:mm a')}`, 9, false, '#9CA3AF')

    return pdf
  }

  const exportTimeline = async () => {
    setExporting(true)
    try {
      toast.loading('Preparing export...', { id: 'export' })

      switch (selectedFormat) {
        case 'json':
          exportAsJSON()
          toast.success('JSON data exported successfully!', { id: 'export' })
          break

        case 'csv':
          exportAsCSV()
          toast.success('CSV data exported successfully!', { id: 'export' })
          break

        case 'comprehensive-pdf':
          const comprehensivePdf = await exportAsComprehensivePDF()
          comprehensivePdf.save(`${profile.full_name.replace(/\s+/g, '_')}_comprehensive_life_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
          toast.success('Comprehensive PDF report exported!', { id: 'export' })
          break

        case 'png':
          if (!timelineRef.current) throw new Error('Timeline not available')
          
          const canvas = await html2canvas(timelineRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
          })

          const link = document.createElement('a')
          link.download = `${profile.full_name.replace(/\s+/g, '_')}_timeline_${format(new Date(), 'yyyy-MM-dd')}.png`
          link.href = canvas.toDataURL()
          link.click()
          
          toast.success('Timeline image exported!', { id: 'export' })
          break

        case 'pdf':
          if (!timelineRef.current) throw new Error('Timeline not available')
          
          const timelineCanvas = await html2canvas(timelineRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
          })

          const imgData = timelineCanvas.toDataURL('image/png')
          const basicPdf = new jsPDF('landscape', 'mm', 'a4')

          const imgWidth = 297
          const pageHeight = 210
          const imgHeight = (timelineCanvas.height * imgWidth) / timelineCanvas.width

          // Add title page
          basicPdf.setFontSize(24)
          basicPdf.text(`${profile.full_name}'s Life Timeline`, 20, 30)
          basicPdf.setFontSize(12)
          basicPdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 20, 40)
          basicPdf.text(`Total Events: ${events.length}`, 20, 50)

          // Add timeline image
          basicPdf.addPage()
          basicPdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight))

          basicPdf.save(`${profile.full_name.replace(/\s+/g, '_')}_timeline_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
          toast.success('Basic PDF exported!', { id: 'export' })
          break
      }

      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export timeline', { id: 'export' })
    } finally {
      setExporting(false)
    }
  }

  if (!isOpen) return null

  const selectedFormatInfo = exportFormats.find(f => f.id === selectedFormat)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Export Your Timeline</h2>
              <p className="text-gray-600">Choose your preferred format and download your life story</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Choose Export Format</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportFormats.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.id
                
                return (
                  <label
                    key={format.id}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{format.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            format.size === 'Large' ? 'bg-red-100 text-red-800' :
                            format.size === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {format.size}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                        
                        <div className="space-y-1">
                          {format.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-500">
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Preview Information */}
          {selectedFormatInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <selectedFormatInfo.icon className="w-5 h-5 text-blue-600" />
                <span>{selectedFormatInfo.name} Preview</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Timeline Data</span>
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div>• {events.length} total events</div>
                    <div>• {Object.keys(events.reduce((acc, e) => ({ ...acc, [e.category]: true }), {})).length} categories</div>
                    <div>• {events.reduce((total, e) => total + (e.event_attachments?.length || 0), 0)} attachments</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900">Personal Info</span>
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div>• Full name & details</div>
                    <div>• Age & life statistics</div>
                    <div>• Timeline milestones</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-900">Analytics</span>
                  </div>
                  <div className="space-y-1 text-gray-600">
                    {selectedFormat === 'comprehensive-pdf' ? (
                      <>
                        <div>• Detailed insights</div>
                        <div>• Category analysis</div>
                        <div>• Year-by-year breakdown</div>
                      </>
                    ) : selectedFormat === 'json' || selectedFormat === 'csv' ? (
                      <>
                        <div>• Raw event data</div>
                        <div>• Machine readable</div>
                        <div>• Import compatible</div>
                      </>
                    ) : (
                      <>
                        <div>• Visual timeline</div>
                        <div>• Basic statistics</div>
                        <div>• Print ready</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Statistics */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Export Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(events.reduce((acc, e) => ({ ...acc, [e.category]: true }), {})).length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">
                  {events.reduce((total, e) => total + (e.event_attachments?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Attachments</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">
                  {differenceInYears(new Date(), new Date(profile.birthdate))}
                </div>
                <div className="text-sm text-gray-600">Years Covered</div>
              </div>
            </div>
          </div>

          {/* Special Features Notice */}
          {selectedFormat === 'comprehensive-pdf' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Comprehensive Report Features</h4>
                  <div className="text-sm text-yellow-800 space-y-1">
                    <div>• Complete life analysis with insights and patterns</div>
                    <div>• Detailed event timeline with descriptions and attachments</div>
                    <div>• Statistical breakdowns by category and year</div>
                    <div>• Professional formatting suitable for printing or sharing</div>
                    <div>• Personalized insights based on your unique timeline</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Export will include data up to {format(new Date(), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={exportTimeline}
              disabled={exporting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export {selectedFormatInfo?.name}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}