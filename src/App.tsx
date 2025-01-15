import React, { useState } from 'react'
import ClockControls, { RingType } from './components/ClockControls'
import { useLogoAnimation } from './hooks/useLogoAnimation'
// import Scene3D from './components/Scene3D' // Disabled 3D view
import AlethiometerClock from './components/AlethiometerClock'
// import ViewToggle from './components/ViewToggle' // Disabled view toggle
// import ViewTransition from './components/ViewTransition' // Disabled view transition
import WelcomeIntro from './components/WelcomeIntro'
import { TimeProvider } from './context/TimeContext'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import ProfilePage from './components/ProfilePage'
import { AuthForm } from './components/AuthForm'
import { useAuth } from './context/AuthContext'

const MainContent: React.FC = () => {
  const { profile } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [visibleRings, setVisibleRings] = useState<Record<RingType, boolean>>({
    zodiac: true,
    tcm: true,
    daily: true,
    biorhythm: true
  })
  const [showCentralInfo, setShowCentralInfo] = useState(false)
  const logoRef = useLogoAnimation()

  return (
    <UserProvider>
      <TimeProvider>
        <div className="w-full h-full text-white relative">
          {/* Header - Absolute positioned with enhanced glass effect */}
          <div className="absolute top-0 left-0 right-0 glass-effect z-10">
            <div className="relative max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <h1 ref={logoRef} className="text-3xl font-semibold bg-gradient-to-r from-[#F6F2C0] via-[#CB9B51] to-[#F6F2C0] bg-clip-text text-transparent cursor-default relative">
                  <span className="relative z-10">Time Turner</span>
                  <div className="logo-glow absolute inset-0 bg-gradient-to-r from-[#F6F2C0]/20 via-[#CB9B51]/20 to-[#F6F2C0]/20 blur-lg opacity-0"></div>
                </h1>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 hover:bg-white/5 rounded-full transition-all border border-white/10 hover:scale-110"
                >
                  <UserCircleIcon className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Clock Controls */}
          <ClockControls
            visibleRings={visibleRings}
            onToggleRing={(ring: RingType) => setVisibleRings(prev => ({ ...prev, [ring]: !prev[ring] }))}
            onShowInfo={() => setShowCentralInfo(true)}
          />

          {/* Main content - Centered with larger clock */}
          <div className="w-full h-full flex items-center justify-center pt-20">
            <div className="w-[95%] max-w-[800px] aspect-square glass-effect rounded-full p-8 mx-auto relative">
              <AlethiometerClock
                birthDate={profile?.birth_date || ''}
                birthTime={profile?.birth_time || ''}
                birthPlace={profile?.birth_place || ''}
                visibleRings={visibleRings}
                showCentralInfo={showCentralInfo}
                onCloseCentralInfo={() => setShowCentralInfo(false)}
              />
            </div>
          </div>

          {/* Profile Page */}
          <ProfilePage
            visible={showProfile}
            onClose={() => setShowProfile(false)}
          />
        </div>
      </TimeProvider>
    </UserProvider>
  )
}

const AuthenticatedContent: React.FC = () => {
  const { user, profile, loading, profileLoading, refreshProfile } = useAuth()

  const LoadingSpinner = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F6F2C0]"></div>
    </div>
  )

  if (loading || profileLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthForm />
  }

  // Show welcome screen if user has no profile data
  if (!profile?.birth_date || !profile?.birth_time || !profile?.birth_place) {
    return <WelcomeIntro onComplete={refreshProfile} />
  }

  return <MainContent />
}

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a0f0d] text-white">
      <AuthProvider>
        <AuthenticatedContent />
      </AuthProvider>
    </div>
  )
}

export default App
