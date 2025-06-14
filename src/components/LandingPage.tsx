import React, { useState } from 'react'
import { Calendar, Clock, Download, Globe, Paperclip, BarChart3, Shield, Sparkles, ArrowRight, Play, CheckCircle, Star, Users, Zap, Heart } from 'lucide-react'
import { AuthForm } from './AuthForm'

export const LandingPage: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const features = [
    {
      icon: Calendar,
      title: 'Visual Life Timeline',
      description: 'See your entire life mapped out week by week in a beautiful, interactive timeline that brings your story to life.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Paperclip,
      title: 'Rich Memory Attachments',
      description: 'Upload photos, documents, videos, and any files to preserve your precious memories with each life event.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Historical Context',
      description: 'Automatically add world events, technology milestones, and cultural moments that happened during your lifetime.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Life Analytics',
      description: 'Get insights into your life patterns, most active periods, and meaningful statistics about your journey.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Download,
      title: 'Comprehensive Exports',
      description: 'Export your timeline as beautiful PDFs, images, or data files. Create detailed life reports to share or preserve.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your life story is precious. We use enterprise-grade security to keep your memories safe and private.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Life Coach',
      content: 'This app helped me visualize my journey and identify patterns I never noticed. It\'s like having a bird\'s eye view of your entire life.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Writer',
      content: 'Perfect for documenting life stories. The historical context feature is brilliant - it shows how my personal journey intersected with world events.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Thompson',
      role: 'Therapist',
      content: 'I recommend this to my clients for reflection and goal setting. The visual timeline makes it easy to see growth and progress over time.',
      avatar: '👩‍⚕️'
    }
  ]

  const stats = [
    { number: '4,160', label: 'Weeks in 80 years', icon: Clock },
    { number: '29,200', label: 'Days to make count', icon: Calendar },
    { number: '∞', label: 'Memories to preserve', icon: Heart },
    { number: '1', label: 'Life to document', icon: Star }
  ]

  if (showAuthForm) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Life in Weeks</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode('signin')
                  setShowAuthForm(true)
                }}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthForm(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Visualize Your Life Story</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Life in
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Weeks</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your life story into a beautiful visual timeline. Document every milestone, 
              preserve precious memories, and see the bigger picture of your incredible journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthForm(true)
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
              >
                <span>Start Your Timeline</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all border border-gray-200 shadow-lg">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                    <div className="flex items-center justify-center mb-3">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Document Your Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you capture, organize, and reflect on your life's most important moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and begin documenting your life story with our intuitive interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Account</h3>
              <p className="text-gray-600">Sign up with your email and birthdate to generate your personalized timeline.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full text-white text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Your Events</h3>
              <p className="text-gray-600">Document important moments, upload photos, and add historical context to your timeline.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Explore & Export</h3>
              <p className="text-gray-600">Visualize your life story, gain insights, and export beautiful reports to share or preserve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Life Documentarians
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what people are saying about their experience with Life in Weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Life Timeline?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of people who are already documenting their life stories. 
            Your journey is unique and worth preserving.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setAuthMode('signup')
                setShowAuthForm(true)
              }}
              className="flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
            >
              <span>Create Your Timeline</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <CheckCircle className="w-5 h-5" />
              <span>Free to start • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Life in Weeks</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2025 Life in Weeks. Made with ❤️ for life storytellers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}