
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../services/mockStore';
import { cn } from '../lib/utils';
import { Sparkles, Mail, Apple, Github, Chrome } from 'lucide-react';

const SLIDES = [
  {
    id: "identity",
    label: "Identity Engine",
    title: "IDENTITY EXTRACTION",
    description: "Train consistent digital twins of any character for hyper-realistic content production.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
    badges: [{ text: "PRECISION TRAINING", active: true }, { text: "99.9% Consistency", active: false }]
  },
  {
    id: "automation",
    label: "Automation",
    title: "BULK PIPELINES",
    description: "Scale your creative output with our enterprise-grade automation board and scheduling.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    badges: [{ text: "HIGH VOLUME", active: true }, { text: "Batch Logic", active: false }]
  },
  {
    id: "motion",
    label: "Kinetic Flux",
    title: "KINETIC MOTION",
    description: "Transform static extractions into cinematic high-fidelity video sequences instantly.",
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1200&auto=format&fit=crop",
    badges: [{ text: "PRO VIDEO V3", active: true }, { text: "4K Cinema", active: false }]
  },
  {
    id: "assets",
    label: "Asset DAM",
    title: "DIGITAL ASSETS",
    description: "A centralized command center for all your AI-generated characters and high-value media.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    badges: [{ text: "CLOUD STORAGE", active: true }]
  }
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailView, setIsEmailView] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.setUser({
      id: Math.random().toString(36).substr(2, 9),
      email: email || 'operator@natak.io',
      credits: 1000,
      tier: 'Pro'
    });
    navigate('/studio');
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-inter select-none">
      <div className="w-full lg:w-[45%] flex flex-col p-8 md:p-20 justify-between items-center relative z-10 text-center border-r border-white/5">
        <div className="w-full max-w-sm flex flex-col items-center flex-1 justify-center">
          <div className="w-12 h-12 bg-[#CCFF00] rounded-[2px] flex items-center justify-center mb-12 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
             <Sparkles className="w-6 h-6 text-black fill-black" />
          </div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">
            Welcome to natak.io
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-12 font-black">
            Login to your creative command center
          </p>

          {!isEmailView ? (
            <div className="w-full space-y-3">
              <SocialButton icon={<Chrome className="w-5 h-5" />} text="Continue with Google" />
              <SocialButton icon={<Apple className="w-5 h-5 fill-white" />} text="Continue with Apple" />
              <SocialButton icon={<Github className="w-5 h-5" />} text="Continue with Microsoft" />
              
              <div className="py-8 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-800">
                <div className="h-px flex-1 bg-white/5" />
                OR
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <button 
                onClick={() => setIsEmailView(true)}
                className="w-full h-14 bg-transparent border border-white/10 rounded-[2px] flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <input 
                type="email" 
                autoFocus
                required
                placeholder="Work Email"
                className="w-full h-14 bg-[#111113] border border-white/5 rounded-[2px] px-5 text-white placeholder:text-slate-800 focus:outline-none focus:border-[#CCFF00] transition-all font-mono text-sm uppercase italic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                required
                placeholder="Access Key"
                className="w-full h-14 bg-[#111113] border border-white/5 rounded-[2px] px-5 text-white placeholder:text-slate-800 focus:outline-none focus:border-[#CCFF00] transition-all text-sm uppercase italic"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-[#CCFF00] text-black font-[900] h-14 rounded-[2px] mt-4 shadow-[0_10px_30px_rgba(204,255,0,0.15)] hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-xs italic"
              >
                Initiate Session
              </button>
              <button 
                type="button"
                onClick={() => setIsEmailView(false)}
                className="w-full text-slate-600 text-[10px] font-black hover:text-white transition-colors py-4 uppercase tracking-[0.2em]"
              >
                Go Back
              </button>
            </form>
          )}
        </div>

        <div className="text-[9px] text-slate-800 font-black max-w-xs leading-relaxed mt-12 uppercase tracking-[0.3em]">
          By signing in, you agree to our <span className="text-slate-600 underline cursor-pointer hover:text-white transition-colors">Protocols</span> and <span className="text-slate-600 underline cursor-pointer hover:text-white transition-colors">Privacy Shield</span>.
        </div>
      </div>

      <div className="hidden lg:flex flex-1 h-screen relative bg-[#0F0F11]">
        {SLIDES.map((slide, idx) => (
          <div 
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              activeSlide === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            )}
          >
            <img src={slide.image} className="w-full h-full object-cover opacity-60 grayscale" alt={slide.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-20 pb-32 space-y-6">
              <div className="flex gap-2">
                {slide.badges.map((badge, bIdx) => (
                  <span 
                    key={bIdx}
                    className={cn(
                      "px-3 py-1.5 rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border",
                      badge.active 
                        ? "bg-[#CCFF00] text-black border-[#CCFF00]" 
                        : "bg-black/60 text-white border-white/10"
                    )}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
              
              <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                {slide.title}
              </h2>
              
              <p className="text-slate-500 text-[11px] max-w-xl font-black uppercase tracking-[0.3em] leading-loose">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 z-20 px-20 pb-16 flex items-end justify-between">
          <div className="flex gap-12">
            {SLIDES.map((slide, idx) => (
              <div 
                key={slide.id} 
                className="flex flex-col gap-3 group cursor-pointer" 
                onClick={() => setActiveSlide(idx)}
              >
                <div className="h-[1px] w-24 bg-white/5 relative overflow-hidden transition-colors">
                  {activeSlide === idx && (
                    <div className="absolute inset-0 bg-white animate-sync-line origin-left" />
                  )}
                  {activeSlide > idx && <div className="absolute inset-0 bg-white/20" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.3em] transition-all",
                  activeSlide === idx ? "text-white translate-x-1" : "text-slate-600 group-hover:text-slate-400"
                )}>
                  {slide.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Digital Content OS</span>
            <span className="text-[11px] font-black text-[#CCFF00] italic uppercase tracking-[0.3em]">NATAK.CORE_v3.5</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sync-line {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-sync-line {
          animation: sync-line 6s linear forwards;
        }
      `}</style>
    </div>
  );
};

const SocialButton = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <button className="w-full h-14 bg-transparent border border-white/10 rounded-[2px] flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all active:scale-[0.98]">
    <span className="opacity-80">{icon}</span>
    {text}
  </button>
);

export const SignupPage: React.FC = () => {
  return <LoginPage />;
};
