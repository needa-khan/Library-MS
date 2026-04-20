import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden font-sans">

      {/* 1. BACKGROUND IMAGE LAYER */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/mal.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <nav className="relative z-20 w-full flex justify-between items-center px-8 py-6">
        {/* Logo + Name — drop your logo at /public/amu-logo.png */}
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src="/amu2.jpg"
              alt="AMU Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span>AMU</span>
        </div>

        {/* Solid white button — actually visible against dark overlay */}
        <Link href="/login">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold transition-all shadow-md">
            <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
          </Button>
        </Link>
      </nav>

      {/* 3. CENTER HERO CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center text-white px-6 pb-16">
        <div className="space-y-6 max-w-4xl">

          {/* Fixed title: intentional line break, italic only on "Library" for contrast */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Maulana Azad
            <br />
            <span className="italic">Library</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Founded in 1877, MAL stands as a beacon of knowledge. Experience a digitized
            gateway to over 1.8 million volumes of history and science.
          </p>

          {/* Primary hero CTA — centered, hard to miss */}
          <div className="pt-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold text-base px-8 py-6 shadow-xl transition-all"
              >
                Explore the Catalogue
              </Button>
            </Link>
          </div>
        </div>

        {/* 4. STATS — pb-16 on main prevents clipping */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 mt-20 border-t border-white/10 w-full max-w-5xl">
          <StatBox label="Volumes" value="1.8M+" />
          <StatBox label="Manuscripts" value="15K+" />
          <StatBox label="Architecture" value="7 Storeys" />
          <StatBox label="Active Members" value="28K+" />
        </div>
      </main>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mt-1">{label}</p>
    </div>
  );
}