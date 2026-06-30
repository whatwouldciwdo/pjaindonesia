"use client";

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, Center, Loader } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

useGLTF.preload('/3d-assets/3d-logo-pja.gltf');
useGLTF.preload('/3d-assets/electrical/flame_detector/scene.gltf');
useGLTF.preload('/3d-assets/valve/scene.gltf');

function DetailModel({ path, scale = 1, defaultRotation = [0, 0, 0] }: { path: string; scale?: number; defaultRotation?: [number, number, number] }) {
  const { scene } = useGLTF(path);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(defaultRotation[0], defaultRotation[1], defaultRotation[2]);
    }
  }, [defaultRotation]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta * 0.4);
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function Stars() {
  const count = 350;
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread stars wide and deep
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = -Math.random() * 25 - 2; // Always behind floating logos
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Twinkle/rotate stars slowly over time
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.1}
        sizeAttenuation={true}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function FloatingLogoInstance({
  path,
  basePos,
  scale,
  speed,
  scrollProgress,
  index,
}: {
  path: string;
  basePos: [number, number, number];
  scale: number;
  speed: number;
  scrollProgress: React.MutableRefObject<number>;
  index: number;
}) {
  const { scene } = useGLTF(path);
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    // Traverse and hide the background plane/quad that comes with the GLTF file
    clone.traverse((child: any) => {
      if (
        child.name === 'background' || 
        child.name.toLowerCase().includes('background') || 
        (child.isMesh && child.name.toLowerCase().includes('plane'))
      ) {
        child.visible = false;
      }
    });
    return clone;
  }, [scene]);

  const meshRef = useRef<THREE.Group>(null);

  // Random rotation offset
  const rotSpeed = React.useMemo(() => (Math.random() - 0.5) * 0.15 + 0.05, []);
  const rotAxis = React.useMemo(() => {
    const axes = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1)];
    return axes[index % 3];
  }, [index]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate logo on its axis
      meshRef.current.rotateOnAxis(rotAxis, delta * rotSpeed);

      // Scroll interpolation
      const p = scrollProgress.current;

      // Parallax scroll effect:
      // 1. Z position: moves forward (increases) based on scroll progress
      // 2. X and Y positions: drift outward slightly to enhance depth
      const zOffset = p * 16 * speed;
      meshRef.current.position.z = basePos[2] + zOffset;

      const xDrift = p * basePos[0] * 0.6 * speed;
      meshRef.current.position.x = basePos[0] + xDrift;

      const yDrift = p * basePos[1] * 0.4 * speed;
      meshRef.current.position.y = basePos[1] + yDrift;

      // Fade out/scale down when passing the camera (Z goes close to camera at Z=5)
      if (meshRef.current.position.z > 3) {
        const factor = Math.max(0, 1 - (meshRef.current.position.z - 3) / 2);
        meshRef.current.scale.setScalar(scale * factor);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={meshRef} position={basePos} scale={scale}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function FloatingLogos({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const logoPath = '/3d-assets/3d-logo-pja.gltf';
  // Compensating for the 0.05 native mesh node scaling with ~10x larger scales (e.g., 6.0 - 10.0)
  const instances = [
    { basePos: [0, 0.5, -4] as [number, number, number], scale: 10.0, speed: 0.8 },      // Center hero
    { basePos: [-3.5, 2, -2] as [number, number, number], scale: 8.0, speed: 1.4 },       // Top-left foreground
    { basePos: [4, -1.8, -1] as [number, number, number], scale: 9.0, speed: 1.6 },       // Bottom-right foreground
    { basePos: [2.5, 2.2, -6] as [number, number, number], scale: 6.0, speed: 0.9 },      // Top-right background
    { basePos: [-3, -2.2, -5] as [number, number, number], scale: 6.5, speed: 1.0 },      // Bottom-left background
    { basePos: [0.2, -3.2, -3] as [number, number, number], scale: 7.5, speed: 1.2 },      // Bottom-center medium
  ];

  return (
    <>
      {instances.map((inst, idx) => (
        <FloatingLogoInstance
          key={idx}
          index={idx}
          path={logoPath}
          basePos={inst.basePos}
          scale={inst.scale}
          speed={inst.speed}
          scrollProgress={scrollProgress}
        />
      ))}
    </>
  );
}

export default function ScrollyTelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const brands = [
    { name: "ABB", src: "/image-assets/logo-brands/electrical-brands/ABB.png", category: "instrument" as const },
    { name: "B&R", src: "/image-assets/logo-brands/electrical-brands/b&r.svg", category: "instrument" as const },
    { name: "Bently Nevada", src: "/image-assets/logo-brands/electrical-brands/bently nevada.png", category: "instrument" as const },
    { name: "Honeywell", src: "/image-assets/logo-brands/electrical-brands/Honeywell.png", category: "instrument" as const },
    { name: "Mitsubishi Electric", src: "/image-assets/logo-brands/electrical-brands/mitsubishi-electric.png", category: "instrument" as const },
    { name: "Omron", src: "/image-assets/logo-brands/electrical-brands/Omron.png", category: "instrument" as const },
    { name: "Parker", src: "/image-assets/logo-brands/electrical-brands/parker.png", category: "valve" as const },
    { name: "Pepperl+Fuchs", src: "/image-assets/logo-brands/electrical-brands/pepperl+fuchs.svg", category: "instrument" as const },
    { name: "Phoenix Contact", src: "/image-assets/logo-brands/electrical-brands/phoenix-contact-seeklogo.png", category: "instrument" as const },
    { name: "Siemens", src: "/image-assets/logo-brands/electrical-brands/siemens.png", category: "instrument" as const },
    { name: "SMC", src: "/image-assets/logo-brands/electrical-brands/SMC.png", category: "valve" as const },
    { name: "Yaskawa", src: "/image-assets/logo-brands/electrical-brands/Yaskawa.png", category: "instrument" as const },
  ];

  const products = {
    instrument: {
      eyebrow: "Instrument",
      title: "Flame Detector",
      spec: "Ensure absolute workplace safety with our rapid-response Flame Detectors. Featuring state-of-the-art sensor technology to instantly identify hazards and protect your critical assets. Built for extreme industrial environments, delivering accurate, real-time continuous monitoring across diverse applications. Engineered for maximum precision, seamless integration, and unparalleled reliability in industrial automation and safety systems.",
      model: { path: "/3d-assets/electrical/flame_detector/scene.gltf", scale: 5, defaultRotation: [0.86, -0.55, -0.83] as [number, number, number] },
    },
    valve: {
      eyebrow: "Valve",
      title: "Block Valve",
      spec: "Optimize fluid control with our rugged Industrial Valves. Manufactured to withstand extreme pressures and temperatures, ensuring leak-proof performance and long-term operational efficiency. Designed for minimal pressure drop, rapid shut-off, and exceptional durability across diverse industrial applications. Streamline flow regulation with premium engineering and robust materials built for the most demanding operating conditions.",
      model: { path: "/3d-assets/valve/scene.gltf", scale: 7, defaultRotation: [0, 0, 0] as [number, number, number] },
    },
  };

  const [activeCategory, setActiveCategory] = useState<"instrument" | "valve">("instrument");
  const currentProduct = products[activeCategory];

  const handleBrandClick = (category: "instrument" | "valve") => {
    setActiveCategory(category);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  useEffect(() => {
    const ctx = gsap.context(() => {
      // ScrollTrigger to track overall scroll progress for background 3D scene
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        }
      });

      const sections = gsap.utils.toArray('.reveal-section');
      sections.forEach((section: any) => {
        const textContent = section.querySelector('.text-content');
        if (textContent) {
          gsap.fromTo(textContent,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-white pb-16 border-b border-neutral-800 overflow-hidden bg-transparent">
      
      {/* 1. Deep Space Gradient Background (Bottom Layer) */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#030510] via-[#090e22] to-[#040614] z-0 pointer-events-none" />

      {/* 2. Background 3D Canvas (Middle Layer) */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <pointLight position={[0, 0, 5]} intensity={1.0} color="#DBB884" />
          <Stars />
          <Suspense fallback={null}>
            <FloatingLogos scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. Foreground Content (Top Layer) */}
      <div className="relative z-20 w-full">

        <section className="reveal-section min-h-screen flex flex-col items-center justify-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto text-center">
          <div className="text-content">
            <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-[#DBB884] uppercase mb-6">
              The Story
            </h3>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.1] mb-8 text-white tracking-tight max-w-4xl">
              We bring life to your<br />industrial operations.
            </h1>
            <p className="text-neutral-400 font-medium text-sm sm:text-base max-w-2xl leading-relaxed mx-auto">
              PJA Indonesia is leading the way in industrial automation and system integration.
              With precision, safety, and robustness at our core, we deliver world-class solutions for your most critical assets.
            </p>
          </div>
        </section>

        <section className="reveal-section min-h-screen flex flex-col items-center justify-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
          <div className="text-content w-full flex flex-col items-center">
            <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-[#DBB884] uppercase mb-6 text-center">
              Our Brands
            </h3>
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.1] mb-6 text-white tracking-tight text-center">
              Powered by world-class<br />technology partners.
            </h2>
            <p className="text-neutral-400 font-medium text-sm sm:text-base max-w-2xl leading-relaxed mb-16 text-center mx-auto">
              We integrate industry-leading automation and electrical brands to deliver reliable, high-performance solutions for your most critical assets.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 w-full max-w-6xl">
              {Array.from({ length: 28 }).map((_, i) => {
                const brand = brands[i];
                if (brand) {
                  return (
                    <button
                      key={brand.name}
                      type="button"
                      onClick={() => handleBrandClick(brand.category)}
                      aria-label={`Lihat produk ${brand.category === "valve" ? "valve" : "instrument"} dari ${brand.name}`}
                      className="group relative flex items-center justify-center aspect-[3/2] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition-all duration-500 hover:border-[#DBB884]/40 hover:bg-white/[0.08] hover:-translate-y-1 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DBB884]"
                    >
                      <img
                        src={brand.src}
                        alt={`Logo ${brand.name} - Mitra Brand PJA Indonesia`}
                        loading="lazy"
                        className="max-h-8 sm:max-h-10 w-auto object-contain transition-all duration-500 filter brightness-0 invert opacity-60 group-hover:opacity-100"
                      />
                    </button>
                  );
                }
                return (
                  <div
                    key={`empty-${i}`}
                    aria-hidden="true"
                    className="aspect-[3/2] rounded-2xl border border-white/5 bg-white/[0.02]"
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section
          ref={detailRef}
          className="reveal-section min-h-screen flex items-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto scroll-mt-24"
        >
          <div className="text-content w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-[#DBB884] uppercase mb-3">
                {currentProduct.eyebrow}
              </h3>
              <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.05] mb-6 text-white tracking-tight">
                {currentProduct.title}
              </h2>
              <p className="text-neutral-400 font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl">
                <span className="font-bold text-neutral-200">Spesification :</span> {currentProduct.spec}
              </p>
            </div>

            <div className="order-1 lg:order-2 relative w-full aspect-square md:aspect-[4/3] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden">
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Environment preset="city" />
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                <Suspense fallback={null}>
                  <DetailModel
                    key={activeCategory}
                    path={currentProduct.model.path}
                    scale={currentProduct.model.scale}
                    defaultRotation={currentProduct.model.defaultRotation}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </section>

        <section className="reveal-section min-h-[60vh] flex flex-col items-center justify-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto text-center">
          <div className="text-content">
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-8 text-white tracking-tight">
              Explore PJA Indonesia
            </h2>
            <p className="text-neutral-400 font-medium text-sm sm:text-base mb-16 max-w-lg leading-relaxed mx-auto">
              Discover how we can transform your business with our comprehensive engineering solutions. Scroll down to see our curated showcase.
            </p>
            <div className="animate-bounce flex justify-center">
              <svg className="w-8 h-8 text-[#DBB884]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

      </div>
      <Loader />
    </div>
  );
}
