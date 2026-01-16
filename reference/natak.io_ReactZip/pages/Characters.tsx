
import React, { useState, useEffect } from 'react';
import { CharacterModel } from '../types';
import { mockStore } from '../services/mockStore';
import { BlurFade } from '../components/ui/blur-fade';
import { Sparkles, Plus, X, Camera, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterModel[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [showCreditAlert, setShowCreditAlert] = useState(true);
  
  const user = mockStore.getUser();

  useEffect(() => {
    setCharacters(mockStore.getCharacters());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newChar: CharacterModel = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      name,
      trigger_word: Math.random().toString(36).substr(2, 4),
      status: 'training',
      created_at: new Date().toISOString(),
    };

    mockStore.saveCharacter(newChar);
    setCharacters(prev => [...prev, newChar]);
    setIsCreating(false);
    setName('');
    setImages([]);

    setTimeout(() => {
      mockStore.updateCharacterStatus(newChar.id, 'ready');
      setCharacters(mockStore.getCharacters());
    }, 15000);
  };

  const heroImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529139513055-119d59aba1bb?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
  ];

  return (
    <div className="h-full bg-black text-white overflow-y-auto custom-scrollbar font-inter">
      {/* Editorial Hero Section */}
      <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-16">
          {heroImages.map((src, i) => (
            <BlurFade key={i} delay={i * 0.1}>
              <div 
                className={cn(
                  "w-32 h-48 md:w-44 md:h-64 rounded-[2px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 hover:scale-110 hover:z-50 grayscale hover:grayscale-0",
                  i === 0 && "-rotate-6 translate-x-4",
                  i === 1 && "-rotate-3 translate-x-2",
                  i === 2 && "rotate-3 -translate-x-2",
                  i === 3 && "rotate-6 -translate-x-4"
                )}
              >
                <img src={src} className="w-full h-full object-cover" alt="Editorial sample" />
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.4}>
          <h1 className="text-6xl md:text-8xl font-[900] uppercase tracking-tighter mb-8 leading-[0.85] italic">
            IDENTITY<br/><span className="text-[#CCFF00]">EXTRACTION</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl mx-auto mb-12 py-6 border-y border-white/5">
            Train consistent digital twins of any character for hyper-realistic content production.
          </p>
        </BlurFade>

        <BlurFade delay={0.6}>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#CCFF00] text-black hover:bg-[#b8e600] px-12 py-6 rounded-[2px] font-black uppercase text-xs tracking-widest flex items-center gap-4 mx-auto transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(204,255,0,0.2)] italic"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            Initiate Training
          </button>
        </BlurFade>
      </section>

      {/* Characters Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {characters.map((char, i) => (
            <BlurFade key={char.id} delay={0.8 + (i * 0.1)}>
              <CharacterCard char={char} />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Floating Credit Alert */}
      {showCreditAlert && (
        <div className="fixed bottom-12 right-12 z-[200] animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-[#1C1C1E] border border-white/10 rounded-[2px] p-6 flex items-center gap-6 shadow-2xl pr-4">
            <div className="flex flex-col gap-1 pl-2">
              <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Protocol Alert</span>
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Credits depleted</span>
            </div>
            <button className="bg-[#CCFF00] text-black px-6 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest hover:bg-[#b8e600] transition-colors italic">
              Upgrade
            </button>
            <button onClick={() => setShowCreditAlert(false)} className="p-2 text-slate-700 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0F0F11] border border-white/10 p-12 rounded-md w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
            <button onClick={() => setIsCreating(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>

            <h2 className="text-4xl font-[900] uppercase italic tracking-tighter mb-10 text-white">Train New Identity</h2>
            
            <form onSubmit={handleCreate} className="space-y-10">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 block">Identifier / Model Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. EXTRACTION_UNIT_01"
                  className="w-full bg-[#1A1A1D] border border-white/5 rounded-[2px] px-6 py-5 text-white text-lg focus:outline-none focus:border-[#CCFF00] transition-all font-mono uppercase italic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="border border-dashed border-white/10 rounded-[2px] p-16 text-center cursor-pointer hover:bg-white/[0.02] transition-colors group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="hidden" 
                  id="file-upload" 
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-[2px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Camera className="w-10 h-10 text-[#CCFF00]" />
                  </div>
                  <div className="text-xl font-[900] text-white italic uppercase tracking-tighter mb-3">
                    {images.length > 0 ? `${images.length} ARTIFACTS SELECTED` : 'Inject 10-20 Reference Frames'}
                  </div>
                  <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto">High-fidelity studio frames required for geometry mapping.</div>
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="submit"
                  disabled={!name || images.length < 10}
                  className="flex-1 bg-[#CCFF00] text-black disabled:bg-slate-900 disabled:text-slate-700 py-6 rounded-[2px] font-[900] uppercase italic text-sm shadow-xl shadow-[#CCFF00]/10 transform hover:scale-[1.01] active:scale-95 transition-all tracking-widest"
                >
                  Initiate Training Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterCard: React.FC<{ char: CharacterModel }> = ({ char }) => {
  const [hovered, setHovered] = React.useState(false);
  
  return (
    <div 
      className="group relative aspect-[3/4] rounded-[2px] overflow-hidden bg-[#1A1A1D] border border-white/5 cursor-pointer transition-all duration-700 hover:border-[#CCFF00]/40 hover:shadow-[0_0_60px_rgba(204,255,0,0.1)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0">
        <img 
          src={`https://picsum.photos/seed/${char.id}/800/1200`} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-[2000ms] grayscale group-hover:grayscale-0",
            hovered ? "scale-110" : "scale-100",
            char.status === 'training' && "opacity-30 blur-sm"
          )} 
          alt={char.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {char.status === 'training' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-20">
          <div className="w-14 h-14 border border-[#CCFF00] border-t-transparent animate-spin rounded-full mb-6"></div>
          <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#CCFF00] animate-pulse italic">Analyzing Geometry</span>
          <p className="text-slate-600 text-[9px] mt-3 max-w-[160px] font-black uppercase tracking-widest">Extracting core identity features...</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-start gap-2 z-10">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#CCFF00] opacity-80 italic">
          Seed Frame Active
        </span>
        <h3 className="text-4xl font-[900] uppercase tracking-tighter text-white drop-shadow-2xl italic">
          {char.name}
        </h3>
      </div>

      {char.status === 'ready' && (
        <div className="absolute top-8 right-8 p-3 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <Sparkles className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" />
        </div>
      )}
    </div>
  );
};
