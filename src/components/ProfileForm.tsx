import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window {
    google: any
  }
}

const ProfileForm: React.FC = () => {
  const { userData, updateUser } = useUser()
  const [isEditing, setIsEditing] = useState(!userData)
  const [currentStep, setCurrentStep] = useState(0)
  const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  const [formData, setFormData] = useState(() => {
    // Initialize with userData if it exists
    if (userData) {
      return {
        name: userData.name,
        birthDate: userData.birthDate,
        birthTime: userData.birthTime,
        location: userData.location
      }
    }
    // Otherwise use empty defaults
    return {
      name: '',
      birthDate: '',
      birthTime: '',
      location: {
        address: '',
        lat: 0,
        lng: 0
      }
    }
  })

  const debouncedSetFormData = debounce(setFormData, 300)
  
  const autocompleteInput = useRef<HTMLInputElement>(null)
  const [placesLoaded, setPlacesLoaded] = useState(false)
  const [placeError, setPlaceError] = useState('')

  useEffect(() => {
    let scriptLoaded = false;
    const loadGooglePlaces = () => {
      return new Promise((resolve, reject) => {
        if (window.google?.maps?.places) {
          resolve(window.google.maps.places);
          return;
        }

        if (!document.querySelector('#google-places-script')) {
          const script = document.createElement('script');
          script.id = 'google-places-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            scriptLoaded = true;
            if (window.google?.maps?.places) {
              resolve(window.google.maps.places);
            } else {
              reject(new Error('Google Places API failed to load'));
            }
          };
          
          script.onerror = () => {
            reject(new Error('Failed to load Google Places API script'));
          };
          
          document.head.appendChild(script);
        }
      });
    };

    const initPlacesAutocomplete = async () => {
      try {
        await loadGooglePlaces();
        if (autocompleteInput.current && window.google?.maps?.places) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteInput.current,
            { types: ['(cities)'] }
          );
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.formatted_address) {
              setFormData(prev => ({
                ...prev,
                location: {
                  address: place.formatted_address,
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }
              }));
              setPlaceError('');
            } else {
              setPlaceError('Please select a location from the dropdown');
            }
          });
          
          setPlacesLoaded(true);
        }
      } catch (error) {
        console.error('Places API initialization error:', error);
        setPlaceError('Unable to load location search. Please try again later.');
      }
    };

    if (currentStep === 3) {
      initPlacesAutocomplete();
    }

    return () => {
      if (scriptLoaded) {
        const script = document.querySelector('#google-places-script');
        if (script) {
          script.remove();
        }
      }
    };
  }, [currentStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(formData)
    setIsEditing(false)
  }

  useEffect(() => {
    if (placeError) {
      const timer = setTimeout(() => setPlaceError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [placeError])

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const WelcomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 text-transparent bg-clip-text">
        Welcome to Time Turner
      </h1>
      <p className="text-gray-400 text-lg">
        Your personal chronological companion
      </p>
      <motion.button
        onClick={nextStep}
        className="px-10 py-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 font-medium tracking-wide"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Begin
      </motion.button>
    </motion.div>
  )

  const NameStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 text-transparent bg-clip-text">
        What's your name?
      </h2>
      <div className="relative group">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              e.preventDefault()
              debouncedSetFormData({ ...formData, name: e.target.value })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (formData.name) nextStep()
              }
            }}
            className="w-full bg-gray-800/50 rounded-lg px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/30 backdrop-blur-sm transition-all hover:border-gray-600/30 hover:bg-gray-800/70"
            placeholder="Enter your name"
            required
            autoFocus
          />
        </div>
      </div>
      <motion.button
        onClick={() => formData.name && nextStep()}
        disabled={!formData.name}
        className={`px-10 py-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 font-medium tracking-wide ${
          !formData.name ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={formData.name ? { scale: 1.05 } : {}}
        whileTap={formData.name ? { scale: 0.95 } : {}}
      >
        Next
      </motion.button>
    </motion.div>
  )

  const BirthdayStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 text-transparent bg-clip-text">
        Welcome {formData.name}, when were you born?
      </h2>
      <div className="relative group">
        <div>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => {
              e.preventDefault()
              debouncedSetFormData({ ...formData, birthDate: e.target.value })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (formData.birthDate) nextStep()
              }
            }}
            className="w-full bg-gray-800/50 rounded-lg px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/30 backdrop-blur-sm transition-all hover:border-gray-600/30 hover:bg-gray-800/70 [color-scheme:dark]"
            required
            autoFocus
          />
        </div>
      </div>
      <motion.button
        onClick={nextStep}
        disabled={!formData.birthDate}
        className={`px-10 py-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 font-medium tracking-wide ${
          !formData.birthDate ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={formData.birthDate ? { scale: 1.05 } : {}}
        whileTap={formData.birthDate ? { scale: 0.95 } : {}}
      >
        Next
      </motion.button>
    </motion.div>
  )

  const TimeStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 text-transparent bg-clip-text">
        What time were you born?
      </h2>
      <div className="relative group">
        <div>
          <input
            type="time"
            value={formData.birthTime}
            onChange={(e) => {
              e.preventDefault()
              debouncedSetFormData({ ...formData, birthTime: e.target.value })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (formData.birthTime) nextStep()
              }
            }}
            className="w-full bg-gray-800/50 rounded-lg px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/30 backdrop-blur-sm transition-all hover:border-gray-600/30 hover:bg-gray-800/70 [color-scheme:dark]"
            required
            autoFocus
          />
        </div>
      </div>
      <motion.button
        onClick={nextStep}
        disabled={!formData.birthTime}
        className={`px-10 py-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 font-medium tracking-wide ${
          !formData.birthTime ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={formData.birthTime ? { scale: 1.05 } : {}}
        whileTap={formData.birthTime ? { scale: 0.95 } : {}}
      >
        Next
      </motion.button>
    </motion.div>
  )

  const LocationStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-gray-300 text-transparent bg-clip-text">
        Where were you born?
      </h2>
      <div className="relative group">
        <div className="relative">
          <input
            ref={autocompleteInput}
            type="text"
            placeholder="Search for a city..."
            defaultValue={formData.location.address}
            className={`w-full bg-gray-800/50 rounded-lg px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/30 backdrop-blur-sm transition-all hover:border-gray-600/30 hover:bg-gray-800/70 ${
              placeError ? 'border-red-500/50' : ''
            } ${!placesLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
            required
            onFocus={() => setPlaceError('')}
            disabled={!placesLoaded}
            autoFocus
          />
          {!placesLoaded && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500/20 border-t-blue-500" />
            </div>
          )}
          {placeError && (
            <p className="absolute text-sm text-red-400 mt-2 pl-1">{placeError}</p>
          )}
        </div>
      </div>
      <motion.button
        onClick={handleSubmit}
        disabled={!formData.location.address}
        className={`px-10 py-4 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 font-medium tracking-wide ${
          !formData.location.address ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={formData.location.address ? { scale: 1.05 } : {}}
        whileTap={formData.location.address ? { scale: 0.95 } : {}}
      >
        Complete Profile
      </motion.button>
    </motion.div>
  )

  if (!isEditing && userData) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 mb-4 shadow-xl backdrop-blur-sm border border-gray-700/30 w-[95%] max-w-6xl mx-auto animate-fadeIn relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0))] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.08),rgba(0,0,0,0))]">
        {/* Profile view remains the same */}
      </div>
    )
  }

  const steps = [
    <WelcomeScreen key="welcome" />,
    <NameStep key="name" />,
    <BirthdayStep key="birthday" />,
    <TimeStep key="time" />,
    <LocationStep key="location" />
  ]

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 mb-4 shadow-xl backdrop-blur-sm border border-gray-700/30 w-[95%] max-w-6xl mx-auto relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0))] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.08),rgba(0,0,0,0))] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />
      <div className="min-h-[400px] flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {steps[currentStep]}
        </AnimatePresence>
      </div>
    </form>
  )
}

export default ProfileForm
