import React from 'react';
import Link from 'next/link';
import PatternBorder from './components/PatternBorder';
import ProjectsCarousel from './components/ProjectsCarousel';
import Preloader from './components/Preloader';
import ScrollyTelling from './components/ScrollyTelling';

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollyTelling />
      
      <div id="white-section" className="w-full min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#DBB884] selection:text-white relative z-20">

      <section className="flex flex-col md:flex-row items-center md:items-start justify-between py-16 px-6 md:px-16 w-full max-w-[1400px] mx-auto gap-16 md:gap-8">

        <div className="w-full md:w-1/2 pt-8 md:pt-16">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-neutral-500 uppercase">
              Team. Customer. Community
            </h3>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1] mb-8 text-neutral-900 tracking-tight">
            We Work With the<br />Best Brands in the world
          </h1>

          <p className="text-neutral-600 font-medium text-sm sm:text-base mb-10 max-w-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </p>

          <Link href="/brands" className="relative overflow-hidden group w-full sm:w-[206px] h-[39px] flex items-center justify-center bg-[#DBB884] backdrop-blur-[17.5px] text-white text-[10px] font-bold uppercase rounded-[99px] transition-all duration-500 shadow-[inset_0px_4px_4px_#B2B2B2] hover:scale-105 active:scale-95">
            <div
              className="absolute inset-0 opacity-20 md:opacity-0 group-hover:opacity-25 group-active:opacity-30 transition-opacity duration-500"
              style={{
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"0\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"0\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3C/svg%3E')",
                backgroundSize: "24px 24px"
              }}
            />
            <div className="absolute inset-0 bg-black/10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 tracking-[0.2em] md:tracking-widest group-hover:tracking-[0.25em] transition-all duration-500 block w-full text-center">Read More</span>
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[#E5E5E5] flex items-center justify-center p-4">
                <span className="text-[10px] font-extrabold text-neutral-800 uppercase tracking-widest">Logo Brands</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center py-12">
        <div className="text-[9px] font-bold text-neutral-500 tracking-widest uppercase text-center w-12 leading-tight">
          Scroll To Explore
        </div>
      </div>

      <section className="py-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto flex flex-col items-center">

        <div className="w-full flex flex-col items-start mb-20 max-w-5xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold text-neutral-800">Projects</span>
            <div className="h-px bg-neutral-300 w-48"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            A curated showcase of<br />our best work.
          </h2>
        </div>

        <div className="w-full mb-16 relative">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DBB884]/40 to-transparent mb-10" />

          <div className="flex flex-wrap items-center justify-between gap-y-10 gap-x-4 w-full">
            {[
              { src: '/logo-projects/pjaindonesia-pertamina.png', alt: 'Logo Pertamina – Mitra PLC & Valve Automation PJA Indonesia', h: 'h-7 md:h-9' },
              { src: '/logo-projects/pjaindonesia-gojek.png', alt: 'Logo Gojek – Mitra Data Center Infrastructure PJA Indonesia', h: 'h-6 md:h-8' },
              { src: '/logo-projects/pjaindonesia-indonesiapower.png', alt: 'Logo Indonesia Power – Mitra SCADA & PLC PJA Indonesia', h: 'h-7 md:h-9' },
              { src: '/logo-projects/pjaindonesia-kai.png', alt: 'Logo KAI – Mitra Railway Signaling System PJA Indonesia', h: 'h-5 md:h-7' },
              { src: '/logo-projects/pjaindonesia-chandraasri.png', alt: 'Logo Chandra Asri – Mitra Safety Instrumented System PJA Indonesia', h: 'h-8 md:h-10' },
              { src: '/logo-projects/pjaindonesia-telkom.png', alt: 'Logo Telkom Indonesia – Mitra BTS Power System PJA Indonesia', h: 'h-7 md:h-9' },
            ].map((logo, i, arr) => (
              <div key={logo.src} className="flex items-center gap-4 md:gap-6">
                <div className="group/logo flex flex-col items-center gap-2 cursor-default">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.h} w-auto object-contain transition-all duration-500 filter grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100`}
                  />
                  <div className="w-0 h-px bg-[#DBB884] group-hover/logo:w-full transition-all duration-500" />
                </div>

                {i < arr.length - 1 && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 opacity-30 flex-shrink-0 hidden sm:block" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="#DBB884" />
                    <rect x="3.5" y="3.5" width="5" height="5" transform="rotate(45 6 6)" fill="none" stroke="white" strokeWidth="0.8" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DBB884]/40 to-transparent mt-10" />
        </div>

        <ProjectsCarousel />
      </section>

      <section className="pt-12 pb-24 px-6 md:px-16 w-full max-w-[1400px] mx-auto">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-between gap-16">

          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-neutral-800">Contacts</span>
              <div className="h-px bg-neutral-300 w-full max-w-[200px]"></div>
            </div>
            <h2 className="text-[28px] md:text-3xl font-bold leading-[1.2] text-neutral-900 tracking-tight">
              Whatever your brands need, we're ready to deliver.<br />
              Consult with our team now.
            </h2>
          </div>

          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8 mt-1 lg:mt-10">
            <div>
              <h4 className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider mb-2">Email Address</h4>
              <p className="font-extrabold text-[15px] text-neutral-800">marketing@pjaindonesia.com</p>
            </div>
            <div>
              <h4 className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider mb-2">Phone Numbers</h4>
              <p className="font-extrabold text-[15px] text-neutral-800">+62 812 3456 7890</p>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider mb-4">Lets Connects</h4>
              <div className="flex gap-10">
                <a href="#" className="font-extrabold text-[15px] text-neutral-800 hover:text-neutral-500 transition-colors">Instagram</a>
                <a href="#" className="font-extrabold text-[15px] text-neutral-800 hover:text-neutral-500 transition-colors">Linkedin</a>
                <a href="#" className="font-extrabold text-[15px] text-neutral-800 hover:text-neutral-500 transition-colors">Facebook</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="w-full h-[41px] flex overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <PatternBorder key={i} className="flex-shrink-0" />
        ))}
      </div>

      <div className="w-full h-[400px] md:h-[500px] bg-[#D9D9D9] flex justify-center items-center">
        <span className="font-bold text-lg text-neutral-800 tracking-wide">Photo</span>
      </div>

    </div>
    </>
  );
}
