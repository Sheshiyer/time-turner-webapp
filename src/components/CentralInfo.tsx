import React, { useEffect, useRef, useState } from 'react';
import { Ring } from '../types/rings';
import { getZodiacInfo, getZodiacDescription, getElementColor } from '../utils/zodiac';
import ProfilePage from './ProfilePage';

interface CentralInfoProps {
  visible: boolean;
  onClose: () => void;
  rings: Ring[];
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const CentralInfo: React.FC<CentralInfoProps> = ({
  visible,
  onClose,
  rings,
  birthDate,
  birthTime,
  birthPlace
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (visible && e.key === 'Escape') {
        if (showProfile) {
          setShowProfile(false);
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose, showProfile]);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  const getBiorhythmInfo = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    
    const calculateCycle = (period: number) => {
      const position = Math.sin((2 * Math.PI * days) / period);
      return Math.round(position * 100);
    };

    return {
      physical: calculateCycle(23),
      emotional: calculateCycle(28),
      intellectual: calculateCycle(33)
    };
  };

  const getTcmTimeInfo = (time: string) => {
    const [hour] = time.split(':').map(Number);
    const organs = [
      { time: 23, organ: 'Gallbladder' },
      { time: 1, organ: 'Liver' },
      { time: 3, organ: 'Lung' },
      { time: 5, organ: 'Large Intestine' },
      { time: 7, organ: 'Stomach' },
      { time: 9, organ: 'Spleen' },
      { time: 11, organ: 'Heart' },
      { time: 13, organ: 'Small Intestine' },
      { time: 15, organ: 'Bladder' },
      { time: 17, organ: 'Kidney' },
      { time: 19, organ: 'Pericardium' },
      { time: 21, organ: 'Triple Burner' }
    ];

    return organs.find(o => Math.abs(o.time - hour) <= 1)?.organ || organs[0].organ;
  };

  if (!visible) return null;

  const zodiacInfo = getZodiacInfo(new Date(birthDate));
  const zodiacDesc = getZodiacDescription(zodiacInfo.sign);
  const biorhythm = getBiorhythmInfo(birthDate);
  const currentOrgan = getTcmTimeInfo(new Date().getHours().toString());

  if (showProfile) {
    return (
      <ProfilePage
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        birthDate={birthDate}
        birthTime={birthTime}
        birthPlace={birthPlace}
        timeAnalysis={{
          zodiacInfo,
          zodiacDesc,
          biorhythm,
          currentOrgan
        }}
      />
    );
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="absolute inset-0 modal-backdrop bg-black/60 flex items-center justify-center z-[9999]" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-[#1a1a1a]/95 border border-white/10 p-4 rounded-2xl w-[90%] max-h-[80vh] overflow-y-auto mx-auto shadow-2xl backdrop-blur-xl animate-in slide-up duration-300 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30" 
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-medium bg-gradient-to-r from-[#F6F2C0] to-[#CB9B51] bg-clip-text text-transparent">
              Current Time Analysis
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowProfile(true)}
                className="rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all duration-200 border border-white/10"
                aria-label="Open profile"
              >
                <span className="text-white/70 hover:text-white text-sm">Profile</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="rounded-full p-1.5 hover:bg-white/5 transition-all duration-200 border border-white/10"
                aria-label="Close modal"
              >
                <span className="text-white/70 hover:text-white text-sm">✕</span>
              </button>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-[#CB9B51] font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">♈</span>
              Zodiac Influence
            </h3>
            <div className="space-y-2">
              <p className="text-white/90 flex justify-between">
                <span className="text-white/60">Sign</span>
                {zodiacInfo.sign}
              </p>
              <p className="text-white/90 flex justify-between">
                <span className="text-white/60">Element</span>
                <span style={{ color: getElementColor(zodiacInfo.element) }}>{zodiacInfo.element}</span>
              </p>
              <p className="text-white/90 flex justify-between">
                <span className="text-white/60">Quality</span>
                {zodiacInfo.quality}
              </p>
              <p className="text-white/70 text-sm mt-2 p-2 bg-white/5 rounded-lg">{zodiacDesc}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-[#F4A460] font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">☯</span>
              TCM Meridian
            </h3>
            <p className="text-white/90 flex justify-between">
              <span className="text-white/60">Active Organ</span>
              {currentOrgan}
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-[#C0C0C0] font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Biorhythm Levels
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60">Physical</span>
                  <span className="text-[#FF4D4D]">{biorhythm.physical}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FF4D4D] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, biorhythm.physical)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60">Emotional</span>
                  <span className="text-[#00E5FF]">{biorhythm.emotional}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00E5FF] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, biorhythm.emotional)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60">Intellectual</span>
                  <span className="text-[#FFD700]">{biorhythm.intellectual}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFD700] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, biorhythm.intellectual)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralInfo;
