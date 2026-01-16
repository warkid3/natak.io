
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockStore } from '../services/mockStore';

export const SavedPromptsPage: React.FC = () => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const initialJob = location.state?.job;

  useEffect(() => {
    setPrompts(mockStore.getStarredPrompts());
  }, []);

  const handleUnstar = (p: string) => {
    mockStore.unstarPrompt(p);
    setPrompts(mockStore.getStarredPrompts());
  };

  const handleCopy = (p: string) => {
    navigator.clipboard.writeText(p);
    alert('Manifest sequence copied to system memory.');
  };

  const handleSendToCreative = (p: string) => {
    navigate('/creative');
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 bg-black text-white p-2 font-inter">
      <header className="flex justify-between items-center bg-[#1A1A1D] p-12 rounded-[2px] border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">Prompt Archive</h1>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3">High-Consistency Script Templates</p>
        </div>
        <div className="text-[10px] font-black text-[#CCFF00] bg-[#CCFF00]/5 px-8 py-4 rounded-[2px] border border-[#CCFF00]/20 tracking-[0.3em] uppercase italic">
          {prompts.length} Stored Sequences
        </div>
      </header>

      {initialJob && (
        <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-10 rounded-[2px] flex justify-between items-center animate-in slide-in-from-top-4 shadow-xl">
          <div className="flex-1">
             <div className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mb-3 italic">Incoming Extraction Script</div>
             <div className="text-xl italic text-slate-400 truncate max-w-4xl font-medium">"{initialJob.prompt}"</div>
          </div>
          <button 
            onClick={() => { mockStore.starPrompt(initialJob.prompt); setPrompts(mockStore.getStarredPrompts()); }} 
            className="bg-[#CCFF00] text-black px-10 py-4 rounded-[2px] font-black italic text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Archive Script
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
        {prompts.length === 0 ? (
          <div className="h-80 border border-dashed border-white/10 rounded-[2px] flex flex-col items-center justify-center text-slate-900">
            <svg className="w-20 h-20 mb-8 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            <span className="text-[11px] font-black uppercase italic tracking-[0.5em] opacity-20">Archive Static</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {prompts.map((p, idx) => (
              <div key={idx} className="bg-[#1A1A1D] border border-white/5 rounded-[2px] p-12 flex flex-col space-y-10 hover:border-[#CCFF00]/40 hover:shadow-[0_0_60px_rgba(204,255,0,0.05)] transition-all group relative">
                <div className="absolute top-10 right-10">
                  <button onClick={() => handleUnstar(p)} className="text-slate-800 hover:text-red-500 transition-colors p-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                  </button>
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                   <div className="w-2.5 h-2.5 rounded-[2px] bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.3)]"></div>
                   SCRIPT_UNIT_{idx + 1001}
                </div>
                <div className="text-xl text-slate-400 italic leading-relaxed font-medium line-clamp-5">
                  "{p}"
                </div>
                <div className="flex gap-4 mt-auto">
                  <button onClick={() => handleCopy(p)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-[2px] text-[10px] font-black uppercase italic tracking-[0.2em] transition-all border border-white/5">Copy Metadata</button>
                  <button onClick={() => handleSendToCreative(p)} className="flex-1 bg-[#CCFF00] text-black py-5 rounded-[2px] text-[10px] font-black uppercase italic tracking-[0.2em] transition-all shadow-xl shadow-[0_10px_30px_rgba(204,255,0,0.1)] hover:scale-[1.02] active:scale-95">Execute in Studio</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
