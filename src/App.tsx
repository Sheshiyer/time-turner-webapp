import React, { useState, useEffect } from 'react'
import AlethiometerClock from './components/AlethiometerClock'
import WelcomeIntro from './components/WelcomeIntro'
import { TimeProvider } from './context/TimeContext'
import { UserProvider } from './context/UserContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import ProfilePage from './components/ProfilePage'

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    // Check localStorage on initial render
    return !localStorage.getItem('hasVisitedBefore');
  });
  const [showProfile, setShowProfile] = useState(false);

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <div className="w-full h-full">
        <WelcomeIntro onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  return (
    <UserProvider>
      <TimeProvider>
        <div className="w-full h-full text-white relative">
          {/* Header - Absolute positioned with enhanced glass effect */}
          <div className="absolute top-0 left-0 right-0 glass-effect z-10">
            <div className="relative max-w-7xl mx-auto px-6 py-4">
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-dark)] to-[var(--gold-light)] bg-clip-text text-transparent text-center">
                Time Turner
              </h1>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-full transition-all border border-white/10 hover:scale-110"
              >
                <UserCircleIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
          
          {/* Main content - Centered with larger clock */}
          <div className="w-full h-full flex items-center justify-center pt-20">
            <div className="w-[95%] max-w-[800px] aspect-square glass-effect rounded-full p-8">
              <AlethiometerClock 
                birthDate="1991-08-13" 
                birthTime="13:31" 
                birthPlace="Bangalore" 
              />
            </div>
          </div>

          {/* Profile Page */}
          <ProfilePage
            visible={showProfile}
            onClose={() => setShowProfile(false)}
            birthDate="1991-08-13"
            birthTime="13:31"
            birthPlace="Bangalore"
          />
        </div>
      </TimeProvider>
    </UserProvider>
  )
}

export default App
