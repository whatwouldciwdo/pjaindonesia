import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WayangSilhouette from "./components/WayangSilhouette";
import Preloader from "./components/Preloader";
import GlobalAnimation from "./components/GlobalAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PJA Indonesia",
  description: "A curated showcase of our best work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/pjaindonesia-preloader.png" as="image" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans selection:bg-[#DBB884] selection:text-white relative">
        <Preloader />
        <GlobalAnimation />

        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-multiply overflow-hidden">
          <WayangSilhouette className="absolute -bottom-20 -right-32 w-[600px] h-auto text-[#DBB884] opacity-[0.07] md:w-[900px] md:-bottom-40 md:-right-48" />
          <WayangSilhouette className="absolute top-10 -left-32 w-[400px] h-auto text-[#DBB884] opacity-[0.04] md:w-[700px] md:top-20 md:-left-40 -rotate-[15deg]" />
        </div>

        <Header />
        <main className="flex-1 flex flex-col w-full relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
