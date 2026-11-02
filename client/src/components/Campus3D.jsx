import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Compass, X, BookOpen, Laptop, Palette, Briefcase, Users, RotateCcw } from 'lucide-react';
import Button from '@/components/Button';

// Campus architectural zones
export const CAMPUS_ZONES = [
  {
    id: 'tech',
    name: 'Innovation & Tech Center',
    department: 'Engineering & Software',
    accentColor: '#0071e3',
    position: [-4.2, 0, -2.4],
    buildingSize: [2.6, 3.8, 2.4],
    floors: 4,
    stats: '14 Active Projects',
    description: 'Full-stack web applications, AI models, mobile frameworks, and hackathon teams.',
    tags: ['Next.js', 'Python', 'React', 'Cloud'],
    icon: Laptop,
    link: '/services?category=web-development',
  },
  {
    id: 'design',
    name: 'Creative Media Pavilion',
    department: 'Design, UI/UX & Film',
    accentColor: '#8b5cf6',
    position: [4.2, 0, -2.2],
    buildingSize: [2.8, 3.2, 2.4],
    floors: 3,
    stats: '9 Active Gigs',
    description: 'Figma prototypes, mobile user experience, 4K video editing, and brand systems.',
    tags: ['Figma', 'UI/UX', 'After Effects', '3D'],
    icon: Palette,
    link: '/services?category=ui-ux-design',
  },
  {
    id: 'business',
    name: 'Venture & Growth Hall',
    department: 'Business & Analytics',
    accentColor: '#34c759',
    position: [-3.8, 0, 3.2],
    buildingSize: [2.4, 2.6, 2.2],
    floors: 3,
    stats: '8 Active Gigs',
    description: 'Investor pitch decks, campus marketing, financial modeling, and data pipelines.',
    tags: ['Pitch Decks', 'Data Science', 'Growth'],
    icon: Briefcase,
    link: '/projects',
  },
  {
    id: 'academics',
    name: 'Academic Commons',
    department: 'Peer Tutoring & Research',
    accentColor: '#f59e0b',
    position: [3.8, 0, 3.4],
    buildingSize: [2.6, 3.0, 2.2],
    floors: 3,
    stats: '12 Top Tutors',
    description: '1-on-1 DSA mentoring, research paper writing, math, and machine learning guidance.',
    tags: ['DSA', 'Calculus', 'Research', 'Mentorship'],
    icon: BookOpen,
    link: '/services?category=tutoring',
  },
  {
    id: 'plaza',
    name: 'Central Agora Plaza',
    department: 'Student Collaboration Hub',
    accentColor: '#0284c7',
    position: [0, 0, 0.4],
    buildingSize: [3.2, 1.4, 3.2],
    floors: 1,
    stats: 'Open Collaboration',
    description: 'The heartbeat of OnCampus: meet teammates, share project ideas, and launch student initiatives.',
    tags: ['Hackathons', 'Meetups', 'Open Source'],
    icon: Users,
    link: '/projects',
  },
];

// Architectural Tree Component
function ArchitecturalTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#6b4c3b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.48, 12, 12]} />
        <meshStandardMaterial color="#407855" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.34, 12, 12]} />
        <meshStandardMaterial color="#528e67" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Architectural Glass Pavilion Building
function Building({ zone, isSelected, isHovered, onSelect, onHover, onUnhover }) {
  const meshRef = useRef();
  const [w, h, d] = zone.buildingSize;
  const posY = h / 2;

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetY = isSelected ? posY + 0.3 : isHovered ? posY + 0.15 : posY;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 7, delta);
    }
  });

  return (
    <group position={[zone.position[0], 0, zone.position[2]]}>
      {/* Stone Podium Terrace */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[w + 0.5, 0.16, d + 0.5]} />
        <meshStandardMaterial color="#ebebed" roughness={0.4} />
      </mesh>

      {/* Main Glass Pavilion Body */}
      <group ref={meshRef} position={[0, posY, 0]}>
        {/* Core structure */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(zone);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(zone);
          }}
          onPointerOut={onUnhover}
          cursor="pointer"
        >
          <boxGeometry args={[w, h, d]} />
          <meshPhysicalMaterial
            color={isSelected ? '#ffffff' : isHovered ? '#f0f7ff' : '#f8fafc'}
            roughness={0.15}
            metalness={0.05}
            transmission={0.6}
            thickness={1.2}
            transparent
            opacity={0.92}
            reflectivity={0.85}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Floor slabs & mullion bands */}
        {Array.from({ length: zone.floors }).map((_, fIdx) => {
          const floorY = -h / 2 + ((fIdx + 1) * (h / (zone.floors + 1)));
          return (
            <mesh key={fIdx} position={[0, floorY, 0]}>
              <boxGeometry args={[w + 0.06, 0.05, d + 0.06]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.2} />
            </mesh>
          );
        })}

        {/* Architectural Rooftop Accent */}
        <mesh position={[0, h / 2 + 0.05, 0]}>
          <boxGeometry args={[w * 0.94, 0.09, d * 0.94]} />
          <meshStandardMaterial
            color={zone.accentColor}
            emissive={zone.accentColor}
            emissiveIntensity={isHovered || isSelected ? 0.8 : 0.35}
            roughness={0.2}
          />
        </mesh>

        {/* Floating Accent Beacon */}
        <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.25}>
          <mesh
            position={[0, h / 2 + 0.7, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(zone);
            }}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={zone.accentColor}
              emissive={zone.accentColor}
              emissiveIntensity={1.3}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

// Campus Landscaping & Travertine Plazas
function CampusLandscaping() {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Soft manicured campus green lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e8f1eb" roughness={0.85} />
      </mesh>

      {/* Central circular travertine plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0.4]}>
        <circleGeometry args={[4.4, 48]} />
        <meshStandardMaterial color="#f7f6f4" roughness={0.35} />
      </mesh>

      {/* Center reflecting pool / fountain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0.4]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#0071e3" roughness={0.05} metalness={0.15} />
      </mesh>

      {/* Granite walkways connecting pavilions */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0.4]}>
        <planeGeometry args={[17, 1.3]} />
        <meshStandardMaterial color="#edebe8" roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.018, 0.4]}>
        <planeGeometry args={[17, 1.3]} />
        <meshStandardMaterial color="#edebe8" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Scene Assembly
function Scene({ onSelectZone, selectedZone, hoveredZone, setHoveredZone }) {
  const trees = useMemo(
    () => [
      [-6.5, 0, -4.0], [-5.8, 0, -1.5], [-6.2, 0, 1.8], [-5.5, 0, 4.6],
      [6.5, 0, -3.8], [5.8, 0, -1.0], [6.2, 0, 2.5], [5.5, 0, 5.0],
      [-2.0, 0, -5.5], [2.0, 0, -5.2], [0, 0, -5.6],
      [-2.2, 0, 5.8], [2.2, 0, 5.6], [0, 0, 6.2],
      [-1.6, 0, -2.2], [1.6, 0, -2.0], [-1.6, 0, 2.6], [1.6, 0, 2.4],
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[22, 28, 18]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-16, 14, -16]} intensity={0.4} color="#e0f2fe" />

      {/* Landscaping */}
      <CampusLandscaping />

      {/* Trees */}
      {trees.map((pos, i) => (
        <ArchitecturalTree key={i} position={pos} scale={0.72 + ((i % 4) * 0.1)} />
      ))}

      {/* Pavilions */}
      {CAMPUS_ZONES.map((zone) => (
        <Building
          key={zone.id}
          zone={zone}
          isSelected={selectedZone?.id === zone.id}
          isHovered={hoveredZone?.id === zone.id}
          onSelect={onSelectZone}
          onHover={setHoveredZone}
          onUnhover={() => setHoveredZone(null)}
        />
      ))}

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.3}
        scale={26}
        blur={2}
        far={7}
      />

      {/* Axonometric Orbit Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        target={[0, 0.6, 0]}
        minDistance={14}
        maxDistance={32}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 6}
        autoRotate={!selectedZone && !hoveredZone}
        autoRotateSpeed={0.45}
        dampingFactor={0.05}
      />
    </>
  );
}

// 2D Interactive Blueprint Fallback
function FallbackCampus2D({ onSelectZone, selectedZone }) {
  return (
    <div className="w-full h-full p-5 sm:p-6 flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#121214]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
          <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Virtual Campus Blueprint
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#86868b]">Select any pavilion to explore</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-auto">
        {CAMPUS_ZONES.map((zone) => {
          const Icon = zone.icon;
          const isSelected = selectedZone?.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              className={`
                text-left p-3.5 rounded-xl border transition-all duration-150
                ${
                  isSelected
                    ? 'bg-white dark:bg-[#1c1c1e] border-[#0071e3] shadow-md scale-[1.01]'
                    : 'bg-white/80 dark:bg-[#161617]/80 border-black/[0.06] dark:border-white/[0.08] hover:bg-white dark:hover:bg-[#1c1c1e]'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: zone.accentColor }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-white">
                  {zone.stats}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1d1d1f] dark:text-white leading-snug">
                {zone.name}
              </h4>
              <p className="text-[11px] text-[#86868b] mt-0.5 line-clamp-2">
                {zone.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Campus3D() {
  const [selectedZone, setSelectedZone] = useState(CAMPUS_ZONES[0]);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  // Check WebGL availability
  useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLFailed(true);
    } catch {
      setWebGLFailed(true);
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* 3D Canvas Frame */}
      <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#f0f7ff]/70 via-[#faf9f6] to-[#f4f7f5] dark:from-[#111827]/40 dark:via-[#0c0c0e] dark:to-[#0f172a]/30 border border-black/[0.08] dark:border-white/[0.1] shadow-apple-card">
        {webGLFailed ? (
          <FallbackCampus2D onSelectZone={setSelectedZone} selectedZone={selectedZone} />
        ) : (
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-2.5">
                <div className="w-7 h-7 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-[#86868b]">Rendering interactive 3D campus...</span>
              </div>
            }
          >
            <Canvas
              shadows
              camera={{ position: [20, 16, 20], fov: 28 }}
              className="cursor-grab active:cursor-grabbing w-full h-full"
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.0;
              }}
            >
              <Scene
                onSelectZone={setSelectedZone}
                selectedZone={selectedZone}
                hoveredZone={hoveredZone}
                setHoveredZone={setHoveredZone}
              />
            </Canvas>
          </Suspense>
        )}

        {/* Viewport Header Controls Pill */}
        <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-black/[0.06] dark:border-white/[0.1] shadow-xs text-[11px] sm:text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Interactive 3D Campus • Drag to rotate • Click pavilion</span>
        </div>

        {/* Floating Building Detail Card */}
        {selectedZone && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-xs z-20 bg-white/95 dark:bg-[#161617]/95 backdrop-blur-2xl rounded-2xl border border-black/[0.08] dark:border-white/[0.12] p-3.5 sm:p-4 shadow-apple-modal">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs flex-shrink-0"
                  style={{ backgroundColor: selectedZone.accentColor }}
                >
                  {React.createElement(selectedZone.icon || Sparkles, { className: 'w-3.5 h-3.5' })}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1d1d1f] dark:text-white leading-tight">
                    {selectedZone.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-[#0071e3]">
                    {selectedZone.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                aria-label="Close card"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed mb-2.5">
              {selectedZone.description}
            </p>

            {/* Action */}
            <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[10px] font-bold text-[#34c759]">
                {selectedZone.stats}
              </span>
              <Button to={selectedZone.link} variant="primary" size="xs" icon={ArrowRight} iconPosition="right">
                Explore
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pavilion Quick Switch Pills (Right below canvas for optical balance) */}
      <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        {CAMPUS_ZONES.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5
                ${
                  isSelected
                    ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] shadow-xs scale-105'
                    : 'bg-white/80 dark:bg-[#161617]/80 text-[#6e6e73] dark:text-[#a1a1a6] border border-black/[0.06] dark:border-white/[0.08] hover:text-[#1d1d1f] dark:hover:text-white'
                }
              `}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.accentColor }} />
              <span>{zone.name.split(' ')[0]} {zone.name.split(' ')[1] || ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
