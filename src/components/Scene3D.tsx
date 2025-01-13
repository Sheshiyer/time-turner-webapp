import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Effects } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Suspense, useRef, useMemo } from 'react'
import { Mesh, Color } from 'three'
import ZodiacRing from './rings/ZodiacRing'

function CosmicSphere() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshPhysicalMaterial 
        color="#FFF5E0"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.3}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.4}
        ior={1.5}
      />
    </mesh>
  )
}

function SolarSphere() {
  const meshRef = useRef<Mesh>(null)
  
  // Season colors
  const seasonColors = useMemo(() => ({
    spring: new Color('#FFE5B4').multiplyScalar(1.2),
    summer: new Color('#FFD700').multiplyScalar(1.3),
    autumn: new Color('#DEB887'),
    winter: new Color('#B8860B').multiplyScalar(0.9)
  }), [])

  const currentSeason = useMemo(() => {
    const date = new Date()
    const month = date.getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  }, [])
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshPhysicalMaterial 
        color={seasonColors[currentSeason]}
        transparent
        opacity={0.6}
        roughness={0.15}
        metalness={0.8}
        clearcoat={1}
        transmission={0.4}
        ior={1.5}
        emissive={seasonColors[currentSeason]}
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

function PersonalSphere() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        color="#FFDAB9"
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.5}
        clearcoat={1}
        emissive="#FFDAB9"
        emissiveIntensity={0.3}
        ior={1.3}
      />
    </mesh>
  )
}

interface Scene3DProps {
  birthDate: string
  birthTime: string
  birthPlace: string
}

export default function Scene3D({ birthDate, birthTime, birthPlace }: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [10, 5, 10], fov: 45 }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <pointLight position={[0, 0, 10]} intensity={1.5} color="#FFF5E0" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.5}
            penumbra={0.5}
            intensity={3}
            castShadow
          />
          <Environment preset="sunset" background={false} />
          <EffectComposer>
            <Bloom 
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.8}
            />
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.2}
              bokehScale={3}
            />
          </EffectComposer>
          <CosmicSphere />
          <SolarSphere />
          <ZodiacRing />
          <PersonalSphere />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={8}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
