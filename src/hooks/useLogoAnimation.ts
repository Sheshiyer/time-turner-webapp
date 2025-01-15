import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const useLogoAnimation = () => {
  const logoRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!logoRef.current) return

    // Initial animation on mount
    gsap.fromTo(
      logoRef.current,
      {
        opacity: 0,
        x: -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
      }
    )

    // Glow animation on hover
    const glowElement = logoRef.current.querySelector('.logo-glow')
    if (glowElement) {
      const glowTimeline = gsap.timeline({ paused: true })
      glowTimeline
        .to(glowElement, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        })
        .to(logoRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.inOut',
        }, '<')

      // Add hover event listeners
      logoRef.current.addEventListener('mouseenter', () => {
        glowTimeline.play()
      })

      logoRef.current.addEventListener('mouseleave', () => {
        glowTimeline.reverse()
      })
    }
  }, [])

  return logoRef
}
