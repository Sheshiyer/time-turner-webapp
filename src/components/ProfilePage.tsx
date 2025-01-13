import React, { useState } from 'react';
import {
  UserIcon,
  CogIcon,
  InformationCircleIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface ProfilePageProps {
  visible: boolean;
  onClose: () => void;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  timeAnalysis?: {
    zodiacInfo: any;
    zodiacDesc: string;
    biorhythm: {
      physical: number;
      emotional: number;
      intellectual: number;
    };
    currentOrgan: string;
  };
}

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
};

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  visible, 
  onClose,
  birthDate = '',
  birthTime = '',
  birthPlace = '',
  timeAnalysis
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);

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
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-sm text-white/60">Name</label>
                <input type="text" className="glass-input" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Date</label>
                <input type="date" className="glass-input" defaultValue={birthDate} />
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Time</label>
                <input type="time" className="glass-input" defaultValue={birthTime} />
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Birth Place</label>
                <input type="text" className="glass-input" placeholder="City, Country" defaultValue={birthPlace} />
              </div>
            </div>
          ),
        },
        {
          id: 'preferences',
          title: 'Personal Preferences',
          content: (
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-sm text-white/60">Time Format</label>
                <select className="glass-input">
                  <option value="12">12-hour</option>
                  <option value="24">24-hour</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Date Format</label>
                <select className="glass-input">
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="ymd">YYYY/MM/DD</option>
                </select>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'app',
      title: 'App Details',
      icon: <DevicePhoneMobileIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'version',
          title: 'Version Information',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Build</span>
                <span>2024.1</span>
              </div>
              <button className="glass-button w-full mt-4">Check for Updates</button>
            </div>
          ),
        },
        {
          id: 'storage',
          title: 'Storage & Data',
          content: (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Cache Size</span>
                <span>2.3 MB</span>
              </div>
              <button className="glass-button w-full">Clear Cache</button>
              <button className="glass-button w-full">Export Data</button>
            </div>
          ),
        },
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <CogIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'appearance',
          title: 'Appearance',
          content: (
            <div className="space-y-4">
              <div className="form-group">
                <label className="text-sm text-white/60">Theme</label>
                <select className="glass-input">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm text-white/60">Font Size</label>
                <select className="glass-input">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          ),
        },
        {
          id: 'notifications',
          title: 'Notifications',
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Notifications</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>Daily Reminders</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      icon: <InformationCircleIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'info',
          title: 'About Time Turner',
          content: (
            <div className="space-y-4">
              <p className="text-sm text-white/80">
                Time Turner is a sophisticated chronometer that combines ancient time-keeping wisdom
                with modern biorhythm analysis. It integrates traditional Chinese medicine, zodiac influences,
                and your personal biorhythms to provide a holistic view of your temporal patterns.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                  <li>Zodiac and TCM time analysis</li>
                  <li>Personal biorhythm tracking</li>
                  <li>Traditional time unit conversions</li>
                  <li>Customizable interface</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'contact',
          title: 'Contact & Support',
          content: (
            <div className="space-y-4">
              <a href="mailto:support@timeturner.app" className="glass-button block text-center">
                Email Support
              </a>
              <a href="https://timeturner.app/docs" target="_blank" rel="noopener noreferrer" className="glass-button block text-center">
                Documentation
              </a>
              <a href="https://timeturner.app/faq" target="_blank" rel="noopener noreferrer" className="glass-button block text-center">
                FAQ
              </a>
            </div>
          ),
        },
      ],
    },
    {
      id: 'legal',
      title: 'Legal',
      icon: <ScaleIcon className="w-5 h-5" />,
      subsections: [
        {
          id: 'privacy',
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4 text-sm text-white/80">
              <p>
                We take your privacy seriously. Time Turner collects only essential data
                needed for the app's core functionality. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Birth date and time (for calculations)</li>
                <li>Location data (optional, for accurate time zones)</li>
                <li>App preferences and settings</li>
              </ul>
              <p className="mt-4">
                Your data is stored locally on your device and is never shared with third parties
                without your explicit consent.
              </p>
            </div>
          ),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          content: (
            <div className="space-y-4 text-sm text-white/80">
              <p>
                By using Time Turner, you agree to our terms of service. The app is provided
                "as is" without warranty of any kind.
              </p>
              <p>
                While we strive for accuracy in our calculations and interpretations,
                decisions made based on the app's information are solely your responsibility.
              </p>
            </div>
          ),
        },
        {
          id: 'licenses',
          title: 'Licenses',
          content: (
            <div className="space-y-4 text-sm text-white/80">
              <p>Time Turner is licensed under the MIT License.</p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Third-party Licenses</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>React - MIT License</li>
                  <li>Tailwind CSS - MIT License</li>
                  <li>Heroicons - MIT License</li>
                </ul>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  if (!visible) return null;

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
  );
};

export default ProfilePage;
