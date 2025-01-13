import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WelcomeIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fade in of background
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );

    // Staggered text reveal
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
    buttonRef.current && gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      paused: true,
      ease: "power2.out"
    });
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
      <div ref={overlayRef} className="absolute inset-0">
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
      
      {/* Content */}
      <div className="relative z-10 text-center p-8 mx-auto max-w-4xl">
        {/* Decorative circles */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#F6F2C0]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#CB9B51]/10 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Main content container with glass effect */}
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
            Discover the ancient wisdom of time through a unique blend of zodiac, TCM, and biorhythm cycles. 
            Explore the intricate patterns that connect your personal timeline with universal rhythms.
          </p>
          
          <div className="pt-4">
            <button
              ref={buttonRef}
              onClick={onComplete}
              onMouseEnter={() => handleButtonHover(true)}
              onMouseLeave={() => handleButtonHover(false)}
              className="relative group px-8 py-4 text-black/90 text-lg font-medium tracking-wide
                       bg-gradient-to-br from-[#F6F2C0] via-[#CB9B51] to-[#F6E27A]
                       hover:from-[#F6F2C0] hover:via-[#F6E27A] hover:to-[#CB9B51]
                       rounded-full border border-[#F6F2C0]/30 shadow-lg
                       transition-all duration-300 backdrop-blur-lg
                       hover:border-[#F6F2C0]/50 hover:shadow-[#CB9B51]/30
                       before:absolute before:inset-0 before:rounded-full before:bg-white/50 before:backdrop-blur-sm
                       after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r 
                       after:from-transparent after:via-white/10 after:to-transparent"
            >
              <span className="relative z-10">Begin Journey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;
