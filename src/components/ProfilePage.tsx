import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, signOut } from '../lib/supabase'
import LoadingSpinner from './LoadingSpinner'
import {
  UserIcon,
  CogIcon,
  InformationCircleIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface ProfilePageProps {
  visible: boolean
  onClose: () => void
  timeAnalysis?: {
    zodiacInfo: any
    zodiacDesc: string
    biorhythm: {
      physical: number
      emotional: number
      intellectual: number
    }
    currentOrgan: string
  }
}

type Section = {
  id: string
  title: string
  icon: React.ReactNode
  subsections: {
    id: string
    title: string
    content: React.ReactNode
  }[]
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  visible, 
  onClose,
  timeAnalysis
}) => {
  const { user, profile } = useAuth()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    birth_date: profile?.birth_date || '',
    birth_time: profile?.birth_time || '',
    birth_place: profile?.birth_place || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    birth_date?: string;
    birth_time?: string;
    birth_place?: string;
  }>({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        birth_date: profile.birth_date,
        birth_time: profile.birth_time,
        birth_place: profile.birth_place
      })
    }
  }, [profile])

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores'
    }

    // Birth date validation
    if (!formData.birth_date) {
      errors.birth_date = 'Birth date is required'
    } else {
      const birthDate = new Date(formData.birth_date)
      const today = new Date()
      if (birthDate > today) {
        errors.birth_date = 'Birth date cannot be in the future'
      }
    }

    // Birth time validation
    if (!formData.birth_time) {
      errors.birth_time = 'Birth time is required'
    }

    // Birth place validation
    if (!formData.birth_place) {
      errors.birth_place = 'Birth place is required'
    } else if (formData.birth_place.length < 3) {
      errors.birth_place = 'Please enter a valid location'
    } else if (!/^[a-zA-Z\s,]+$/.test(formData.birth_place)) {
      errors.birth_place = 'Please enter a valid city and country'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }))
    setError(null)
    setUpdateSuccess(false)
  }

  const loadingMessages = [
    "Consulting the alethiometer...",
    "Aligning temporal gears...",
    "Calculating zodiac influences...",
    "Synchronizing with cosmic rhythms...",
    "Decoding meridian flows...",
    "Channeling temporal energies...",
    "Harmonizing biorhythms..."
  ]

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(prevMsg => {
          const currentIndex = loadingMessages.indexOf(prevMsg)
          return loadingMessages[(currentIndex + 1) % loadingMessages.length]
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError(null)
    setUpdateSuccess(false)
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setLoadingMessage(loadingMessages[0])

    try {
      const { error } = await updateProfile(user.id, formData)
      if (error) {
        if (error.message.includes('username')) {
          setValidationErrors(prev => ({
            ...prev,
            username: 'This username is already taken'
          }))
        } else {
          throw error
        }
      } else {
        setUpdateSuccess(true)
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setError(error.message)
    }
  }

  const sections: Section[] = [
    {
      id: 'time',
      title: 'Time Analysis',
      icon: <ClockIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'current',
          title: 'Current Analysis',
          content: timeAnalysis ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-[#CB9B51] font-medium mb-3">Zodiac Influence</h4>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-white/60">Sign</span>
                    <span>{timeAnalysis.zodiacInfo.sign}</span>
                  </p>
                  <p className="text-white/70 text-sm mt-2 p-2 bg-white/5 rounded-lg">
                    {timeAnalysis.zodiacDesc}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-[#F4A460] font-medium mb-3">TCM Meridian</h4>
                <p className="flex justify-between">
                  <span className="text-white/60">Active Organ</span>
                  <span>{timeAnalysis.currentOrgan}</span>
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-[#C0C0C0] font-medium mb-3">Biorhythm Levels</h4>
                <div className="space-y-3">
                  {Object.entries(timeAnalysis.biorhythm).map(([type, value]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/60">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.max(0, value)}%`,
                            backgroundColor: type === 'physical' ? '#FF4D4D' : 
                                          type === 'emotional' ? '#00E5FF' : '#FFD700'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/60">No time analysis available</p>
          ),
        },
      ],
    },
    {
      id: 'personal',
      title: 'Personal Details',
      icon: <UserIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'profile',
          title: 'Profile Information',
          content: (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="text-sm text-white/60">Username</label>
                <input
                  type="text"
                  name="username"
                  className={`glass-input ${validationErrors.username ? 'border-red-400' : ''}`}
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Letters, numbers, underscores only"
                  required
                />
                {validationErrors.username && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.username}</p>
                )}
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  className={`glass-input ${validationErrors.birth_date ? 'border-red-400' : ''}`}
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {validationErrors.birth_date && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.birth_date}</p>
                )}
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Time</label>
                <input
                  type="time"
                  name="birth_time"
                  className={`glass-input ${validationErrors.birth_time ? 'border-red-400' : ''}`}
                  value={formData.birth_time}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.birth_time && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.birth_time}</p>
                )}
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Place</label>
                <input
                  type="text"
                  name="birth_place"
                  className={`glass-input ${validationErrors.birth_place ? 'border-red-400' : ''}`}
                  value={formData.birth_place}
                  onChange={handleInputChange}
                  placeholder="City, Country (e.g., London, United Kingdom)"
                  required
                />
                {validationErrors.birth_place && (
                  <p className="mt-1 text-red-400 text-sm">{validationErrors.birth_place}</p>
                )}
              </div>
              {error && (
                <div className="text-red-400 text-sm mt-2 p-2 bg-red-500/10 rounded-lg">
                  {error}
                </div>
              )}
              {updateSuccess && (
                <div className="text-emerald-400 text-sm mt-2 p-2 bg-emerald-500/10 rounded-lg">
                  Profile updated successfully!
                </div>
              )}
              {loading ? (
                <div className="mt-8">
                  <LoadingSpinner message={loadingMessage} />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button w-full mt-4"
                >
                  Save Changes
                </button>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 glass-button w-full mt-4 bg-red-500/10 hover:bg-red-500/20"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          ),
        },
      ],
    },
    // ... rest of your sections
  ]

  if (!visible) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-7xl h-[90vh] mx-auto bg-black/30 backdrop-blur-xl overflow-hidden glass-effect rounded-2xl shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#F6F2C0]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#CB9B51]/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="h-full flex relative">
          {/* Sidebar */}
          <div className="w-80 border-r border-white/10 p-6 bg-black/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F6F2C0] to-[#CB9B51] bg-clip-text text-transparent">Profile</h2>
                <p className="text-sm text-white/40 mt-1">Customize your experience</p>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id === activeSection ? null : section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 text-sm group
                      ${activeSection === section.id 
                        ? 'bg-gradient-to-r from-white/10 to-white/5 shadow-lg' 
                        : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center transition-colors duration-300
                        ${activeSection === section.id 
                          ? 'text-[#CB9B51]' 
                          : 'text-white/60 group-hover:text-white/80'}`}>
                        {section.icon}
                      </span>
                      <span className={`transition-colors duration-300
                        ${activeSection === section.id 
                          ? 'text-white' 
                          : 'text-white/60 group-hover:text-white/80'}`}>
                        {section.title}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-all duration-300 
                        ${activeSection === section.id 
                          ? 'rotate-180 text-[#CB9B51]' 
                          : 'text-white/40 group-hover:text-white/60'}`}
                    />
                  </button>
                  {activeSection === section.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSubsection(subsection.id)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            activeSubsection === subsection.id
                              ? 'bg-white/10'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeSection && activeSubsection && (
              <div className="w-full max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  {sections.find((s) => s.id === activeSection)?.icon}
                  <h3 className="text-xl font-medium">
                    {sections
                      .find((s) => s.id === activeSection)
                      ?.subsections.find((sub) => sub.id === activeSubsection)?.title}
                  </h3>
                </div>
                <div className="glass-effect rounded-xl p-6">
                  {sections
                    .find((s) => s.id === activeSection)
                    ?.subsections.find((sub) => sub.id === activeSubsection)?.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
