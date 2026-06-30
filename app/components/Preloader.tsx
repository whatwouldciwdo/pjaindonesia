"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import PatternBorder from "./PatternBorder";

const LOGO_PATH = `M 217 366 L 217 376 L 218 377 L 217 378 L 217 381 L 219 384 L 218 385 L 219 386 L 219 389 L 221 392 L 221 394 L 223 396 L 224 400 L 228 406 L 232 410 L 232 411 L 240 418 L 251 424 L 253 424 L 259 427 L 260 426 L 264 428 L 269 428 L 270 429 L 271 428 L 277 428 L 279 429 L 280 428 L 284 428 L 288 426 L 289 427 L 292 425 L 297 424 L 309 417 L 320 406 L 324 400 L 292 369 L 291 369 L 286 374 L 286 375 L 305 393 L 303 396 L 295 403 L 285 408 L 282 408 L 281 409 L 268 409 L 267 408 L 264 408 L 253 403 L 245 396 L 245 395 L 240 389 L 236 379 L 237 378 L 236 377 L 236 373 L 235 372 L 236 370 L 236 362 L 237 361 Z M 169 267 L 159 288 L 158 310 L 164 329 L 178 346 L 202 358 L 223 359 L 248 349 L 265 333 L 326 394 L 330 385 L 331 369 L 280 319 L 286 313 L 332 359 L 348 357 L 366 348 L 379 335 L 388 316 L 389 293 L 381 271 L 365 254 L 344 245 L 336 245 L 334 263 L 346 265 L 362 277 L 369 289 L 370 309 L 361 326 L 342 338 L 336 335 L 222 222 L 217 235 L 217 245 L 271 298 L 265 305 L 206 246 L 186 252 Z M 194 269 L 198 267 L 236 305 L 237 305 L 239 307 L 239 308 L 241 309 L 244 312 L 244 313 L 247 315 L 247 316 L 249 317 L 250 320 L 248 322 L 248 323 L 244 327 L 243 327 L 239 331 L 238 331 L 233 335 L 229 336 L 224 339 L 221 339 L 220 340 L 210 340 L 209 339 L 205 339 L 200 336 L 196 335 L 193 332 L 192 332 L 183 323 L 178 313 L 178 310 L 177 309 L 177 294 L 179 290 L 179 287 L 181 285 L 183 280 Z M 273 119 L 233 197 L 230 216 L 239 233 L 245 238 L 257 243 L 274 241 L 285 233 L 291 223 L 292 211 L 290 205 L 284 198 L 278 195 L 271 195 L 266 197 L 260 204 L 260 216 L 268 222 L 273 222 L 278 217 L 278 215 L 275 217 L 270 213 L 272 207 L 277 206 L 281 210 L 281 220 L 274 227 L 267 228 L 258 224 L 254 219 L 251 209 L 253 198 L 274 159 L 304 216 L 312 235 L 312 251 L 306 265 L 304 265 L 304 252 L 296 257 L 296 288 L 327 288 L 330 280 L 319 279 L 325 271 L 330 258 L 331 242 L 329 229 L 318 203 L 275 119 Z`;

// Style GPU-accelerated untuk semua piece SVG
const PIECE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
  opacity: 0,
  willChange: "transform, opacity",
  // transform3d memaksa layer GPU dari awal — tidak ada biaya compositing saat animasi
  transform: "translateZ(0)",
};

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress]   = useState(0);

  const ringRef       = useRef<HTMLDivElement>(null);
  const stageRef      = useRef<HTMLDivElement>(null);
  const pieceTopRef   = useRef<SVGSVGElement>(null);
  const pieceLeftRef  = useRef<SVGSVGElement>(null);
  const pieceRightRef = useRef<SVGSVGElement>(null);
  const pieceSlashRef = useRef<SVGSVGElement>(null);
  const logoFinalRef  = useRef<SVGSVGElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // ── Progress bar — pakai gsap ticker agar satu loop dengan animasi ──
    const DURATION = 2500; // ms
    const startTime = performance.now();

    const tickProgress = () => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
    };
    gsap.ticker.add(tickProgress);

    const hideTimer = setTimeout(() => {
      gsap.ticker.remove(tickProgress);
      setIsLoading(false);
      document.body.style.overflow = "";
    }, DURATION + 500);

    // ── GSAP logo assembly ──
    const pieces = [
      pieceTopRef.current,
      pieceLeftRef.current,
      pieceRightRef.current,
      pieceSlashRef.current,
    ];

    const tl = gsap.timeline({
      defaults: { ease: "expo.out", force3D: true },
    });

    // Set posisi awal — semua pakai transform3d agar sudah di GPU layer
    tl.set(pieceTopRef.current,   { x: 0,   y: -70, scale: 0.88, rotation: -8,  z: 0, transformOrigin: "50% 50%" })
      .set(pieceLeftRef.current,  { x: -70, y:  32, scale: 0.88, rotation:  8,  z: 0, transformOrigin: "50% 50%" })
      .set(pieceRightRef.current, { x:  70, y:  28, scale: 0.88, rotation: -8,  z: 0, transformOrigin: "50% 50%" })
      .set(pieceSlashRef.current, { x: 0,   y: 100, scale: 0.85, rotation:  0,  z: 0, transformOrigin: "50% 50%" })

      // Ring pulse — hanya opacity + scale, tidak ada filter
      .to(ringRef.current, { opacity: 1, scale: 1,    duration: 0.5,  ease: "power2.out" }, 0)
      .to(ringRef.current, { opacity: 0, scale: 1.22, duration: 0.75, ease: "power2.in"  }, 0.4)

      // Fade-in pieces
      .to(pieces, { opacity: 1, duration: 0.25, stagger: 0.05 }, 0.05)

      // Fly-in — durasi lebih panjang + expo.out untuk deceleration yang buttery smooth
      .to(pieceTopRef.current,   { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.35 }, 0.12)
      .to(pieceLeftRef.current,  { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.35 }, 0.20)
      .to(pieceRightRef.current, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.35 }, 0.24)
      .to(pieceSlashRef.current, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.25 }, 0.30)

      // Pieces keluar, logo utuh muncul — hanya opacity + scale (tidak ada blur/filter)
      .to(pieces, { opacity: 0, duration: 0.2, ease: "power1.out" }, 1.28)
      .to(logoFinalRef.current, {
        opacity: 1,
        scale:   1,
        duration: 0.5,
        ease: "power2.out",
      }, 1.22)

      // Pulse akhir — hanya scale (bukan filter), GPU-friendly
      .to(stageRef.current, {
        scale:    1.05,
        duration: 0.22,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      }, 1.52);

    return () => {
      tl.kill();
      gsap.ticker.remove(tickProgress);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#111111] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        isLoading
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* ── Logo GSAP di tengah ── */}
      <div className="flex flex-col items-center gap-4">
        <div
          ref={stageRef}
          style={{
            position: "relative",
            width: "clamp(80px, 16vw, 140px)",
            aspectRatio: "1",
            willChange: "transform",
          }}
        >
          {/* Ring pulse — hanya scale + opacity */}
          <div
            ref={ringRef}
            style={{
              position: "absolute",
              inset: "9%",
              border: "1px solid rgba(255,255,255,.35)",
              borderRadius: "999px",
              opacity: 0,
              transform: "scale(.72) translateZ(0)",
              willChange: "transform, opacity",
            }}
          />

          {/* Piece — atas */}
          <svg ref={pieceTopRef} viewBox="0 0 548 548" aria-hidden="true" style={PIECE_STYLE}>
            <defs>
              <clipPath id="clip-top">
                <rect x="185" y="80" width="180" height="230" rx="4" />
              </clipPath>
            </defs>
            <path
              fill="white" fillRule="evenodd" clipPath="url(#clip-top)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              d={LOGO_PATH}
            />
          </svg>

          {/* Piece — kiri */}
          <svg ref={pieceLeftRef} viewBox="0 0 548 548" aria-hidden="true" style={PIECE_STYLE}>
            <defs>
              <clipPath id="clip-left">
                <rect x="118" y="230" width="210" height="230" rx="4" />
              </clipPath>
            </defs>
            <path
              fill="white" fillRule="evenodd" clipPath="url(#clip-left)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              d={LOGO_PATH}
            />
          </svg>

          {/* Piece — kanan */}
          <svg ref={pieceRightRef} viewBox="0 0 548 548" aria-hidden="true" style={PIECE_STYLE}>
            <defs>
              <clipPath id="clip-right">
                <rect x="255" y="220" width="180" height="210" rx="4" />
              </clipPath>
            </defs>
            <path
              fill="white" fillRule="evenodd" clipPath="url(#clip-right)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              d={LOGO_PATH}
            />
          </svg>

          {/* Piece — garis diagonal */}
          <svg ref={pieceSlashRef} viewBox="0 0 548 548" aria-hidden="true" style={PIECE_STYLE}>
            <defs>
              <clipPath id="clip-slash">
                <polygon points="198,198 375,375 346,404 169,227" />
              </clipPath>
            </defs>
            <path
              fill="white" fillRule="evenodd" clipPath="url(#clip-slash)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              d={LOGO_PATH}
            />
          </svg>

          {/* Logo utuh — hanya opacity + scale, tanpa filter blur */}
          <svg
            ref={logoFinalRef}
            viewBox="0 0 548 548"
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              overflow: "visible",
              opacity: 0,
              transform: "scale(.94) translateZ(0)",
              willChange: "transform, opacity",
            }}
          >
            <path fill="white" fillRule="evenodd" d={LOGO_PATH} />
          </svg>
        </div>

        {/* Brand name */}
        <div className="font-extrabold text-2xl tracking-tight text-white">
          PJA<span className="font-medium text-neutral-400">INDONESIA</span>
        </div>
      </div>

      {/* ── Progress bar bawah ── */}
      <div className="absolute bottom-0 left-0 w-full mb-4 md:mb-8">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="relative w-full h-[41px] overflow-hidden opacity-50">
            <div className="absolute inset-0 flex opacity-20 filter grayscale">
              {Array.from({ length: 6 }).map((_, i) => (
                <PatternBorder key={i} className="flex-shrink-0 min-w-full md:min-w-0" />
              ))}
            </div>
            <div
              className="absolute inset-0 flex"
              style={{
                WebkitMaskImage: `linear-gradient(to right, black ${progress / 2}%, transparent ${progress / 2}%, transparent ${100 - progress / 2}%, black ${100 - progress / 2}%)`,
                maskImage: `linear-gradient(to right, black ${progress / 2}%, transparent ${progress / 2}%, transparent ${100 - progress / 2}%, black ${100 - progress / 2}%)`,
              }}
            >
              <div className="flex w-full min-w-max">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PatternBorder key={i} className="flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
