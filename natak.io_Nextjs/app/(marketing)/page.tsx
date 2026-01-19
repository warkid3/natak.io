"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, Globe, Cpu, Monitor, Shield, Smartphone } from 'lucide-react';
import { HeroVisual } from '@/components/landing/HeroVisual';
import { Features } from '@/components/landing/Features';
import { GalleryWall } from '@/components/landing/GalleryWall';

import FAQSection from '@/components/ui/faq-section';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const TrustBar = () => (
  <div className="w-full bg-black border-y border-white/5 py-12 overflow-hidden relative">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
    <div className="flex whitespace-nowrap animate-marquee items-center gap-16">
      {[...Array(2)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-default">
            <Cpu size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Nvidia Computing</span>
          </div>
          <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
            <Database size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Secure Cloud Storage</span>
          </div>
          <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
            <Globe size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Global Network</span>
          </div>
          <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
            <Shield size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Pro Encryption</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Systematic Steps Section
const StepsSection = () => (
  <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden bg-black">
    <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">

      {/* Left Side: The Steps */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-zinc-900 overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full bg-gradient-to-b from-lime to-zinc-900"
          />
        </div>

        <div className="space-y-40">
          {[
            { step: "01", title: "TRAIN IDENTITY", desc: "Upload 10-20 reference images of your AI character. Our GPU infrastructure trains a custom Identity Model (LoRA) in 30 minutes—permanent facial consistency guaranteed.", icon: <Database size={24} /> },
            { step: "02", title: "BATCH GENERATION", desc: "Queue 50+ image generations simultaneously. Our neural pipeline handles upscaling, style extraction, and metadata tagging—all automated at industrial scale.", icon: <Cpu size={24} /> },
            { step: "03", title: "ETL DEPLOYMENT", desc: "Extract insights from performance data, Transform assets with AI-driven optimization, Load to your distribution channels. Content velocity without creative burnout.", icon: <Globe size={24} /> }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative pl-24 group"
            >
              {/* Icon Box */}
              <div className="absolute left-0 top-[-8px] w-20 h-20 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-lime transition-all duration-500 group-hover:border-lime/40 group-hover:bg-zinc-900/50 shadow-2xl z-10">
                <div className="group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lime text-xs font-black tracking-[0.2em] italic">STEP {item.step}</span>
                  <div className="w-6 h-[1px] bg-lime/30" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-lg max-w-md font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="hidden lg:block relative"
      >
        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <img
            src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            alt="Infrastructure Visualization"
            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Decorative Tech Elements */}
          <div className="absolute bottom-12 left-12 right-12">
            <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-lime">Pipeline Status: Optimized</span>
                </div>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '88%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-full bg-lime"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Syncing global assets to private cloud lake...</p>
            </div>
          </div>
        </div>

        {/* Background Accent */}
        <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-lime/5 blur-[120px] rounded-full" />
      </motion.div>

    </div>
  </section>
);

// Call to Action Section
const CTASection = ({ isSystemActive }: { isSystemActive: boolean }) => (
  <section className="py-60 px-6 text-center relative overflow-hidden bg-black">
    <div className="absolute inset-0 bg-lime/5 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #DFFF00 0%, transparent 70%)' }} />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto relative z-10">
      <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] mb-12">Ready to <br /> <span className="text-lime">Scale AI Creator Operations?</span></h2>
      <p className="text-zinc-500 text-lg md:text-xl font-medium uppercase tracking-tight mb-16 max-w-2xl mx-auto">Join the teams building industrial-grade AI influencer pipelines with NATAK ETL infrastructure.</p>
      <a href="/signup" className="inline-flex">
        <button className="bg-lime text-black px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(223,255,0,0.3)] transition-all flex items-center gap-4 mx-auto group">
          Start Your Pipeline <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </a>
    </motion.div>
  </section>
);

export default function Home() {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen bg-void text-white selection:bg-lime selection:text-black flex flex-col font-sans">
      <Navbar isSystemActive={isSystemActive} />

      <main className="flex-1 flex flex-col">
        {/* Device View Toggle */}
        <div className="absolute top-24 right-12 z-[90] hidden lg:flex bg-neutral-900/50 backdrop-blur-md p-1 rounded-xl border border-white/5 shadow-2xl scale-75 origin-right">
          <button
            onClick={() => setView('desktop')}
            className={`p-2 rounded-lg transition-all ${view === 'desktop' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setView('mobile')}
            className={`p-2 rounded-lg transition-all ${view === 'mobile' ? 'bg-lime text-black font-bold shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        {/* Hero Visualizer */}
        <section className="relative w-full flex justify-center items-center overflow-hidden">
          <div className={`transition-all duration-700 ease-in-out ${view === 'mobile' ? 'max-w-[390px] border-x border-white/10 shadow-2xl my-10 rounded-[3rem] overflow-hidden' : 'w-full'}`}>
            <HeroVisual view={view} isSystemActive={isSystemActive} setIsSystemActive={setIsSystemActive} />
          </div>
        </section>

        <TrustBar />
        <Features />

        {/* Gallery Wall placed after Features for visual break */}
        <GalleryWall />

        <StepsSection />



        <FAQSection />

        <CTASection isSystemActive={isSystemActive} />
      </main>

      <Footer />

      <div className="fixed bottom-6 left-8 z-50 pointer-events-none hidden md:block">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 mono italic">
          NATAK_OS // PRODUCTION_INFRASTRUCTURE
        </div>
      </div>
    </div>
  );
}
