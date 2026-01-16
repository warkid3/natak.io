
import React from 'react';
import { useLocation } from 'react-router-dom';
import { mockStore } from '../services/mockStore';
import { Sidebar } from './Sidebar';
import { Zap } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = mockStore.getUser();

  if (!user) return <>{children}</>;

  const isFullPage = ['/creative', '/characters'].includes(location.pathname);

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden font-inter select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between flex-shrink-0 bg-black/40 backdrop-blur-3xl z-40">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic">System Status</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></div>
                 <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Core Synchronized</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] italic">Resource Pack</span>
                <span className="text-[12px] font-black text-[#CCFF00] uppercase italic tracking-widest">{user.tier || 'PRO'} EDITION</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="bg-black border border-[#CCFF00]/30 px-6 py-2 rounded-[2px] flex items-center gap-3 shadow-[0_0_20px_rgba(204,255,0,0.05)]">
                 <Zap className="w-3.5 h-3.5 text-[#CCFF00] fill-[#CCFF00]" />
                 <span className="text-sm font-black italic text-white tracking-tighter">{user.credits?.toLocaleString()} CR</span>
              </div>
           </div>
        </header>

        <main className={`flex-1 overflow-hidden flex flex-col ${isFullPage ? 'p-0' : 'p-10'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
