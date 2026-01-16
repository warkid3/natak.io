
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import QueueManager from './components/QueueManager';
import ConfigPanel from './components/ConfigPanel';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'queue':
        return <QueueManager />;
      case 'config':
        return <ConfigPanel />;
      case 'assets':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
            <Icons.Assets />
            <p className="mt-4 font-medium text-lg text-white">Asset Library / DAM Integration</p>
            <p className="text-sm">This section is currently being indexed by the content team.</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-zinc-100 selection:bg-indigo-500/30">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 flex flex-col">
        {/* Top Header / Status Bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0b]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">System Online</span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="text-xs font-semibold text-zinc-500">
              GPU Cluster: <span className="text-zinc-300">84% Load</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-zinc-800 rounded-full relative text-zinc-400 hover:text-white transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#0a0a0b]"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
               <img src="https://picsum.photos/seed/ops/32/32" alt="Avatar" />
             </div>
          </div>
        </header>

        {/* Floating Red Flag Alert Bar */}
        {isAlertOpen && (
          <div className="mx-8 mt-6 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-lg animate-pulse">
                <Icons.Alert />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-500 uppercase tracking-tight">Critical Red Flag: High Batch Failure</h4>
                <p className="text-xs text-rose-300/80">Cloth Swap (Step 2) success rate dropped to 62% in the last 15 minutes. Potential system degradation.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="px-4 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-all">Pause All Batches</button>
               <button onClick={() => setIsAlertOpen(false)} className="text-rose-500/50 hover:text-rose-500 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>
        )}

        <div className="p-8 pb-16">
          {renderContent()}
        </div>
      </main>

      {/* Persistent Call-to-Action / Summary */}
      <div className="fixed bottom-0 right-0 left-64 h-14 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between px-8 z-40 backdrop-blur-xl">
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Active Batches</span>
             <span className="text-sm font-bold">12</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Pending QC</span>
             <span className="text-sm font-bold text-amber-500">48 Items</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] text-zinc-500 font-bold uppercase">Actions Required</span>
           <button className="px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-bold uppercase rounded-md shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
             Start Bulk QC Review
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;
