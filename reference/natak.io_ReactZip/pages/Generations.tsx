
import React, { useState, useEffect } from 'react';
import { GenerationJob } from '../types';
import { mockStore } from '../services/mockStore';
import { Sparkles, Download, Eye, Clock } from 'lucide-react';

export const GenerationsPage: React.FC = () => {
  const [gens, setGens] = useState<GenerationJob[]>([]);

  useEffect(() => {
    setGens(mockStore.getJobs());
  }, []);

  return (
    <div className="space-y-8 bg-black p-2 h-full overflow-hidden flex flex-col font-inter">
      <header className="flex justify-between items-center bg-[#1A1A1D] p-10 rounded-[2px] border border-white/5 flex-shrink-0 shadow-2xl">
        <div>
          <h1 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">Manifest Archive</h1>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">EXTRACTION HISTORY LOGS</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#CCFF00]" />
          <span className="text-[10px] font-black uppercase text-[#CCFF00] italic tracking-widest">REAL-TIME MONITORING</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
        {gens.length === 0 ? (
          <div className="h-80 border border-dashed border-white/10 rounded-[2px] flex flex-col items-center justify-center text-slate-900">
            <Sparkles className="w-16 h-16 mb-8 opacity-10" />
            <span className="text-[11px] font-black uppercase italic tracking-[0.5em] opacity-20">NO ARTIFACTS IN LOGS</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gens.map(gen => (
              <div key={gen.id} className="group bg-[#1A1A1D] border border-white/5 rounded-[2px] overflow-hidden flex flex-col hover:border-[#CCFF00]/40 transition-all duration-700 shadow-xl cursor-pointer">
                <div className="aspect-[3/4] bg-black relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                  {(gen.status === 'posted' || gen.status === 'review') ? (
                    <>
                      <img src={gen.output_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Generated" />
                      {gen.video_model && (
                        <div className="absolute top-4 left-4 bg-[#CCFF00] text-black text-[9px] font-[900] px-3 py-1.5 rounded-[2px] shadow-2xl italic uppercase tracking-widest z-10">KINETIC_MOTION</div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
                      <div className="w-10 h-10 border-2 border-[#CCFF00] border-t-transparent animate-spin rounded-full mb-6"></div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic animate-pulse">RENDERING SEQUENCE...</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 p-10">
                    <button className="flex-1 bg-white text-black text-[10px] font-black px-4 py-3 rounded-[2px] hover:scale-[1.05] transition-transform uppercase italic tracking-widest flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> INSPECT</button>
                    <button className="flex-1 bg-[#CCFF00] text-black text-[10px] font-black px-4 py-3 rounded-[2px] hover:scale-[1.05] transition-transform uppercase italic tracking-widest flex items-center justify-center gap-2"><Download className="w-4 h-4" /> EXPORT</button>
                  </div>
                </div>
                <div className="p-6 bg-[#1A1A1D]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest italic">{new Date(gen.created_at).toLocaleDateString()}</span>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-[2px] italic uppercase tracking-widest border ${
                      (gen.status === 'posted' || gen.status === 'review') 
                        ? 'bg-[#CCFF00]/5 text-[#CCFF00] border-[#CCFF00]/20' 
                        : 'bg-black text-slate-600 border-white/5'
                    }`}>
                      {gen.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium italic line-clamp-2 uppercase leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    "{gen.prompt}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
