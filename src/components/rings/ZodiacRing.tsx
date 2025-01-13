import { useRef, useMemo, useEffect } from 'react'
import { Mesh, Group, CanvasTexture, Texture } from 'three'
import { useFrame } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

function createSVGTexture(sign: ZodiacSign): Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  // Load SVG content
  fetch(ICON_PATHS[sign])
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
      const svgElement = svgDoc.documentElement
      
      // Draw SVG to canvas
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 256, 256)
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement))
    })

  return new CanvasTexture(canvas)
}

type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 
                  'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces'

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const ICON_PATHS: Record<ZodiacSign, string> = {
  'Aries': '/icons/zodiac/aries.svg',
  'Taurus': '/icons/zodiac/taurus.svg',
  'Gemini': '/icons/zodiac/gemini.svg',
  'Cancer': '/icons/zodiac/cancer.svg',
  'Leo': '/icons/zodiac/leo.svg',
  'Virgo': '/icons/zodiac/virgo.svg',
  'Libra': '/icons/zodiac/libra.svg',
  'Scorpio': '/icons/zodiac/scorpio.svg',
  'Sagittarius': '/icons/zodiac/sagittarius.svg',
  'Capricorn': '/icons/zodiac/capricorn.svg',
  'Aquarius': '/icons/zodiac/aquarius.svg',
  'Pisces': '/icons/zodiac/pisces.svg'
}


export default function ZodiacRing() {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05  // Slower rotation for better readability
    }
  })

  return (
    <group ref={groupRef}>
      {ZODIAC_SIGNS.map((sign, index) => {
        const angle = (index / 12) * Math.PI * 2
        const radius = 3.2 // Further increased radius to be outside the cosmic sphere
        const x = Math.sin(angle) * radius
        const y = 0.5 // Slight upward offset
        const z = Math.cos(angle) * radius

        return (
          <mesh
            key={sign}
            position={[x, y, z]}
            rotation={[0, -angle + Math.PI / 2, 0]} // Face the center
            scale={[0.8, 0.8, 1]} // Increased size
          >
            <planeGeometry args={[1, 1]} />
            <meshPhysicalMaterial
              map={useMemo(() => createSVGTexture(sign), [sign])}
              transparent
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}
