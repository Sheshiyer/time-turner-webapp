import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  birthTime: Date | null;
  birthPlace: string;
}

interface WelcomeIntroProps {
  onComplete: () => void;
}

export default function WelcomeIntro({ onComplete }: WelcomeIntroProps) {
  const { refreshProfile } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: null,
    birthTime: new Date(),
    birthPlace: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "Inscribing your temporal signature...",
    "Aligning celestial coordinates...",
    "Calculating astrological resonance...",
    "Synchronizing biorhythms...",
    "Mapping your destiny lines..."
  ];

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(prevMsg => {
          const currentIndex = loadingMessages.indexOf(prevMsg);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (!formData.birthDate || !formData.birthTime || !formData.birthPlace) {
        throw new Error('Please fill in all required fields');
      }

      // Validate inputs
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        throw new Error('Please enter your full name');
      }

      // Format username to meet DB constraints
      const username = `${formData.firstName}_${formData.lastName}`.toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 50); // Reasonable max length

      // Format birth time to 24-hour format HH:mm:ss
      const birthTime = formData.birthTime?.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const profileData = {
        id: user.id,
        birth_date: formData.birthDate?.toISOString().split('T')[0],
        birth_time: birthTime,
        birth_place: formData.birthPlace.trim(),
        username: username,
        updated_at: new Date().toISOString()
      };

      // Validate all required fields are present
      const requiredFields = ['birth_date', 'birth_time', 'birth_place', 'username'] as const;
      for (const field of requiredFields) {
        if (!profileData[field]) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }

      console.log('Updating profile with:', profileData);

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        if (upsertError.message?.includes('username')) {
          throw new Error('This username is already taken. Please try a different name.');
        }
        if (upsertError.message?.includes('violates foreign key constraint')) {
          throw new Error('User account not found. Please try logging in again.');
        }
        throw new Error(`Failed to save profile: ${upsertError.message}`);
      }

      // Save to local storage for quick access
      localStorage.setItem('userProfile', JSON.stringify({
        ...profileData,
        firstName: formData.firstName,
        lastName: formData.lastName
      }));

      // Refresh profile in context and trigger completion
      await refreshProfile();
      onComplete();
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      return; // Don't proceed with completion on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from local storage
    const cached = localStorage.getItem('userProfile');
    if (cached) {
      const parsed = JSON.parse(cached);
      setFormData({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        birthDate: parsed.birth_date ? new Date(parsed.birth_date) : null,
        birthTime: parsed.birth_time ? new Date(`1970-01-01T${parsed.birth_time}`) : new Date(),
        birthPlace: parsed.birth_place || ''
      });
    }

    // Initial fade in of background
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" }
      );
    }

    // Staggered text reveal
    if (titleRef.current && descRef.current && buttonRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      )
      .fromTo(descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

      // Button hover animation
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        paused: true,
        ease: "power2.out"
      });
    }
  }, []);

  const handleButtonHover = (isEnter: boolean) => {
    gsap.to(buttonRef.current, {
      scale: isEnter ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden alethiometer-bg">
      {/* Radial overlay for depth */}
      <div className="absolute inset-0">
        {/* Dark vignette edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#462523]/80 via-transparent to-[#462523]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#462523]/80 via-transparent to-[#462523]/80" />
        {/* Engraved pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0, 10 10 T20 10' fill='none' stroke='%23F6F2C0' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      <div className="relative z-10 text-center p-8 mx-auto max-w-4xl">
        {/* Decorative circles */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#F6F2C0]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#CB9B51]/10 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="glass-effect rounded-2xl p-12 space-y-8 backdrop-blur-xl">
          {/* Logo/Icon */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F6F2C0] to-[#CB9B51] rounded-full opacity-20 blur-md" />
            <div className="relative w-full h-full rounded-full border-2 border-[#F6F2C0]/30 flex items-center justify-center">
              <span className="text-4xl">⌛</span>
            </div>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-5xl font-bold"
          >
            <span className="bg-gradient-to-r from-[#F6F2C0] via-[#CB9B51] to-[#F6E27A] bg-clip-text text-transparent">
              Welcome to Time Turner
            </span>
          </h1>
          
          <p 
            ref={descRef}
            className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed"
          >
            Begin your journey through time's ancient wisdom and cosmic rhythms.
            Please provide your birth details to unlock personalized insights.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 rounded-lg border border-[#F6F2C0]/30 
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 rounded-lg border border-[#F6F2C0]/30 
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  selected={formData.birthDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Date of Birth"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg border border-[#F6F2C0]/30 
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all"
                  required
                  showYearDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                />
              </div>
              <div>
                <DatePicker
                  selected={formData.birthTime}
                  onChange={(date) => setFormData(prev => ({ ...prev, birthTime: date }))}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Time of Birth"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg border border-[#F6F2C0]/30 
                           text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                           backdrop-blur-sm transition-all"
                  required
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Place of Birth"
              value={formData.birthPlace}
              onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 rounded-lg border border-[#F6F2C0]/30 
                       text-white placeholder-white/50 focus:outline-none focus:border-[#F6F2C0]
                       backdrop-blur-sm transition-all"
              required
            />

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="pt-4">
              {isLoading ? (
                <div className="mt-8">
                  <LoadingSpinner message={loadingMessage} />
                </div>
              ) : (
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => handleButtonHover(true)}
                  onMouseLeave={() => handleButtonHover(false)}
                  className="relative group w-full px-8 py-4 text-black/90 text-lg font-medium tracking-wide
                           bg-gradient-to-br from-[#F6F2C0] via-[#CB9B51] to-[#F6E27A]
                           hover:from-[#F6F2C0] hover:via-[#F6E27A] hover:to-[#CB9B51]
                           rounded-full border border-[#F6F2C0]/30 shadow-lg
                           transition-all duration-300 backdrop-blur-lg
                           hover:border-[#F6F2C0]/50 hover:shadow-[#CB9B51]/30
                           before:absolute before:inset-0 before:rounded-full before:bg-white/50 before:backdrop-blur-sm
                           after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r 
                           after:from-transparent after:via-white/10 after:to-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">Begin Journey</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
