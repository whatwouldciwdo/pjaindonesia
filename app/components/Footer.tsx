"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="w-full bg-[#202020] text-gray-200 py-16 md:py-20 px-6 md:px-16 overflow-hidden relative z-20"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"0\" cy=\"0\" r=\"40\" stroke=\"%23333333\" stroke-width=\"1\" fill=\"none\"%2F%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"40\" stroke=\"%23333333\" stroke-width=\"1\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"0\" r=\"40\" stroke=\"%23333333\" stroke-width=\"1\" fill=\"none\"%2F%3E%3Ccircle cx=\"0\" cy=\"80\" r=\"40\" stroke=\"%23333333\" stroke-width=\"1\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"80\" r=\"40\" stroke=\"%23333333\" stroke-width=\"1\" fill=\"none\"%2F%3E%3C/svg%3E')",
        backgroundSize: "80px 80px",
        backgroundPosition: "center top"
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">

        <div className="lg:col-span-5 flex flex-col justify-between min-h-[220px]">
          <div>
            <h2 className="text-[28px] sm:text-[38px] font-bold leading-[1.1] mb-8 text-white tracking-tight">
              Let's build something<br />awesome.
            </h2>
            <button className="relative overflow-hidden group w-full sm:w-[206px] h-[39px] flex items-center justify-center border border-[#DBB884] text-[#DBB884] bg-transparent backdrop-blur-[17.5px] text-[9px] font-bold rounded-[99px] tracking-[0.2em] uppercase hover:bg-[#DBB884] hover:text-white transition-all duration-500 hover:scale-105 shadow-[inset_0px_4px_4px_#B2B2B2]">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"0\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"40\" cy=\"40\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"0\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"0\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3Ccircle cx=\"80\" cy=\"80\" r=\"40\" stroke=\"%23ffffff\" stroke-width=\"4\" fill=\"none\"%2F%3E%3C/svg%3E')",
                  backgroundSize: "24px 24px"
                }}
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 group-hover:tracking-[0.3em] transition-all duration-500 block w-full text-center">Talk To Us</span>
            </button>
          </div>
          <div className="mt-16 lg:mt-0 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo-pja.png" alt="PJA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-extrabold text-xl tracking-tight text-white">
              PJA<span className="font-medium text-neutral-400">INDONESIA</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-4 ml-0 lg:ml-20">
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 mb-6 uppercase">Navigate</h4>
            <ul className="space-y-4 font-bold text-xs sm:text-[13px] text-white">
              <li><Link href="/" className="hover:text-[#DBB884] transition-colors">Home</Link></li>
              <li><Link href="/brands" className="hover:text-[#DBB884] transition-colors">Brands</Link></li>
              <li><Link href="/projects" className="hover:text-[#DBB884] transition-colors">Projects</Link></li>
              <li><Link href="/contacts" className="hover:text-[#DBB884] transition-colors">Contacts</Link></li>
              <li><Link href="/about" className="hover:text-[#DBB884] transition-colors">About us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 mb-6 uppercase">Social</h4>
            <ul className="space-y-4 font-bold text-xs sm:text-[13px] text-white">
              <li><Link href="#" className="hover:text-[#DBB884] transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-[#DBB884] transition-colors">Linkedin</Link></li>
              <li><Link href="#" className="hover:text-[#DBB884] transition-colors">Facebook</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 mb-6 uppercase">Affiliate</h4>
            <ul className="space-y-4 font-bold text-xs sm:text-[13px] text-white">
              <li><Link href="#" className="hover:text-[#DBB884] transition-colors">Mount.Klcr</Link></li>
              <li><Link href="#" className="hover:text-[#DBB884] transition-colors">Astranegara</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex justify-start lg:justify-end mt-16 relative z-10">
        <p className="text-[10px] text-neutral-400 font-medium tracking-wide">All Rights Reserved</p>
      </div>
    </footer>
  );
}
