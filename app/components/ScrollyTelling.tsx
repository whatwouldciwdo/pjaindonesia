"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, OrbitControls, ContactShadows, Center } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Model({ path, isAutoRotate, scale = 1, position = [0, 0, 0], defaultRotation = [0, 0, 0] }: { path: string, isAutoRotate: boolean, scale?: number, position?: number[], defaultRotation?: number[] }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(defaultRotation[0], defaultRotation[1], defaultRotation[2]);
    }
  }, [defaultRotation]);

  useFrame((state, delta) => {
    if (isAutoRotate && groupRef.current) {
      groupRef.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta * 0.2);
    }
  });

  return (
    <group ref={groupRef as any} scale={scale} position={position as any}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload('/3d-assets/electrical/scene.gltf');
useGLTF.preload('/3d-assets/electrical/flame_detector/scene.gltf');
useGLTF.preload('/3d-assets/electrical/h2s_gas_detector/scene.gltf');
useGLTF.preload('/3d-assets/valve/scene.gltf');
useGLTF.preload('/3d-assets/valve/butterfly_valve/scene.gltf');
useGLTF.preload('/3d-assets/valve/steam_condensate_trap/scene.gltf');

function ModelCard({ path, scale = 1, position = [0, 0, 0], defaultRotation = [0, 0, 0] }: { path: string, scale?: number, position?: number[], defaultRotation?: number[] }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const isAutoRotate = !isInteractive;

  return (
    <div className="model-card-container relative w-full aspect-square md:aspect-[4/3] group">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <Model key={path} path={path} isAutoRotate={isAutoRotate} scale={scale} position={position} defaultRotation={defaultRotation} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={50} blur={2.5} far={10} color="#000000" />
        {isInteractive && <OrbitControls enablePan={true} enableZoom={true} makeDefault />}
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => setIsInteractive(!isInteractive)}
          className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isInteractive
              ? 'bg-[#DBB884] text-white shadow-[0_0_20px_rgba(219,184,132,0.6)] scale-105'
              : 'bg-[#2A2A2A] text-neutral-300 shadow-lg hover:bg-[#333333] hover:text-white border border-neutral-700'
            }`}
        >
          {isInteractive ? 'Interactive: ON' : 'Interactive: OFF'}
        </button>
      </div>
    </div>
  );
}

export default function ScrollyTelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeElectricalModel, setActiveElectricalModel] = useState(1);
  const [activeValveModel, setActiveValveModel] = useState(0);

  const electricalModels = [
    {
      name: "CNC Control Panel",
      title: "Precision CNC<br />Control Panels",
      description: "Empower your manufacturing with our high-performance CNC Control Panels. Engineered for maximum precision, seamless integration, and unparalleled reliability in industrial automation.",
      path: "/3d-assets/electrical/scene.gltf",
      scale: 0.005,
      position: [0, 0, 0],
      defaultRotation: [1.25, 0.04, -0.24]
    },
    {
      name: "Flame Detector",
      title: "Advanced Industrial<br />Flame Detection",
      description: "Ensure absolute workplace safety with our rapid-response Flame Detectors. Featuring state-of-the-art sensor technology to instantly identify hazards and protect your critical assets.",
      path: "/3d-assets/electrical/flame_detector/scene.gltf",
      scale: 5,
      position: [0, 0, 0],
      defaultRotation: [0.86, -0.55, -0.83]
    },
    {
      name: "H2S Gas Detector",
      title: "Reliable H2S Gas<br />Monitoring Systems",
      description: "Safeguard your personnel and facilities with our highly sensitive H2S Gas Detectors. Built for extreme environments to deliver accurate, real-time continuous toxic gas monitoring.",
      path: "/3d-assets/electrical/h2s_gas_detector/scene.gltf",
      scale: 7,
      position: [0, 0, 0],
      defaultRotation: [0, 0, 0]
    }
  ];

  const valveModels = [
    {
      name: "Industrial Valve",
      title: "Heavy-Duty<br />Industrial Valves",
      description: "Optimize fluid control with our rugged Industrial Valves. Manufactured to withstand extreme pressures and temperatures, ensuring leak-proof performance and long-term operational efficiency.",
      path: "/3d-assets/valve/scene.gltf",
      scale: 7,
      position: [0, 0, 0],
      defaultRotation: [0, 0, 0]
    },
    {
      name: "Butterfly Valve",
      title: "High-Performance<br />Butterfly Valves",
      description: "Streamline flow regulation with our premium Butterfly Valves. Designed for minimal pressure drop, rapid shut-off, and exceptional durability across diverse industrial applications.",
      path: "/3d-assets/valve/butterfly_valve/scene.gltf",
      scale: 0.5,
      position: [0, 0, 0],
      defaultRotation: [0, 0, 0]
    },
    {
      name: "Condensate Trap",
      title: "Efficient Steam<br />Condensate Traps",
      description: "Maximize thermal efficiency with our robust Condensate Traps. Engineered to automatically discharge condensate and non-condensable gases without losing valuable live steam.",
      path: "/3d-assets/valve/steam_condensate_trap/scene.gltf",
      scale: 0.09,
      position: [0, 0, 0],
      defaultRotation: [0, 0, 0.14]
    }
  ];

  const currentElectrical = electricalModels[activeElectricalModel];
  const currentValve = valveModels[activeValveModel];

  useEffect(() => {
    const ctx = gsap.context(() => {
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

        const card = section.querySelector('.model-card-container');
        if (card) {
          gsap.fromTo(card,
            { scale: 0.85, opacity: 0.5, rotationX: 5 },
            {
              scale: 1,
              opacity: 1,
              rotationX: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                end: "center center",
                scrub: 1.5, // Smooth scrub for zoom effect
              }
            }
          );
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#1A1A1A] text-white pb-16 border-b border-neutral-800 overflow-hidden">

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

      <section className="reveal-section min-h-screen flex items-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center w-full gap-12 md:gap-16">
          <div className="w-full md:w-1/2 relative">
            <ModelCard
              path={currentElectrical.path}
              scale={currentElectrical.scale}
              position={currentElectrical.position}
              defaultRotation={currentElectrical.defaultRotation}
            />
          </div>
          <div className="w-full md:w-1/2 mt-10 md:mt-0 text-content flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-[#DBB884] uppercase mb-6">
              PLC & Electrical
            </h3>
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.1] mb-6 text-white tracking-tight min-h-[80px] md:min-h-0" dangerouslySetInnerHTML={{ __html: currentElectrical.title }}>
            </h2>
            <p className="text-neutral-400 font-medium text-sm sm:text-base max-w-lg leading-relaxed mb-8 md:h-[96px] transition-all duration-300">
              {currentElectrical.description}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
              {electricalModels.map((model, idx) => {
                const isActive = activeElectricalModel === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveElectricalModel(idx)}
                    className={`relative overflow-hidden group px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 flex items-center justify-center ${isActive
                        ? 'bg-[#DBB884] text-black shadow-[0_0_15px_rgba(219,184,132,0.4)] border border-[#DBB884]'
                        : 'bg-transparent text-neutral-400 border border-neutral-700 hover:border-[#DBB884] hover:text-white hover:bg-[#DBB884] hover:scale-105 shadow-sm'
                      }`}
                  >
                    {!isActive && (
                      <>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                          style={{
                            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"0\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"0\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3C/svg%3E')",
                            backgroundSize: "24px 24px"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </>
                    )}
                    <span className="relative z-10">{model.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section min-h-screen flex items-center py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center w-full gap-12 md:gap-16">
          <div className="w-full md:w-1/2 relative">
            <ModelCard
              path={currentValve.path}
              scale={currentValve.scale}
              position={currentValve.position}
              defaultRotation={currentValve.defaultRotation}
            />
          </div>
          <div className="w-full md:w-1/2 mt-10 md:mt-0 text-content flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-[#DBB884] uppercase mb-6">
              Valve Automation
            </h3>
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.1] mb-6 text-white tracking-tight min-h-[80px] md:min-h-0" dangerouslySetInnerHTML={{ __html: currentValve.title }}>
            </h2>
            <p className="text-neutral-400 font-medium text-sm sm:text-base max-w-lg leading-relaxed mb-8 md:h-[96px] transition-all duration-300">
              {currentValve.description}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
              {valveModels.map((model, idx) => {
                const isActive = activeValveModel === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveValveModel(idx)}
                    className={`relative overflow-hidden group px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 flex items-center justify-center ${isActive
                        ? 'bg-[#DBB884] text-black shadow-[0_0_15px_rgba(219,184,132,0.4)] border border-[#DBB884]'
                        : 'bg-transparent text-neutral-400 border border-neutral-700 hover:border-[#DBB884] hover:text-white hover:bg-[#DBB884] hover:scale-105 shadow-sm'
                      }`}
                  >
                    {!isActive && (
                      <>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                          style={{
                            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"0\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"0\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3C/svg%3E')",
                            backgroundSize: "24px 24px"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </>
                    )}
                    <span className="relative z-10">{model.name}</span>
                  </button>
                );
              })}
            </div>
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
  );
}
