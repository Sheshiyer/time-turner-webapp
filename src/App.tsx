import React, { useState } from 'react'
import Scene3D from './components/Scene3D'
import AlethiometerClock from './components/AlethiometerClock'
import ViewToggle from './components/ViewToggle'
import ViewTransition from './components/ViewTransition'
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
  const [is3D, setIs3D] = useState<boolean>(() => {
    const savedView = localStorage.getItem('preferredView');
    return savedView ? savedView === '3d' : true;
  });

  const handleViewToggle = () => {
    const newView = !is3D;
    setIs3D(newView);
    localStorage.setItem('preferredView', newView ? '3d' : '2d');
  };

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
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <ViewToggle is3D={is3D} onToggle={handleViewToggle} />
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 hover:bg-white/5 rounded-full transition-all border border-white/10 hover:scale-110"
                >
                  <UserCircleIcon className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content - Centered with larger clock */}
          <div className="w-full h-full flex items-center justify-center pt-20">
            <div className="w-[95%] max-w-[800px] aspect-square glass-effect rounded-full p-8">
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <ViewTransition show={is3D}>
                    <Scene3D 
                      birthDate="1991-08-13" 
                      birthTime="13:31" 
                      birthPlace="Bangalore" 
                    />
                  </ViewTransition>
                </div>
                <div className="absolute inset-0">
                  <ViewTransition show={!is3D}>
                    <AlethiometerClock 
                      birthDate="1991-08-13" 
                      birthTime="13:31" 
                      birthPlace="Bangalore" 
                    />
                  </ViewTransition>
                </div>
              </div>
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
