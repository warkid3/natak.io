"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Sparkles, Layers, Search, Filter, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Types
type Status = 'queued' | 'processing' | 'review' | 'posted';
interface Job {
  id: string;
  character: string;
  status: Status;
  type: 'IMAGE' | 'VIDEO';
  prompt: string;
  nsfw: boolean;
  engine: string;
}

const COLUMNS: { label: string; value: Status }[] = [
  { label: 'Queued', value: 'queued' },
  { label: 'Generating', value: 'processing' },
  { label: 'Review', value: 'review' },
  { label: 'Ready', value: 'posted' }
];

const MOCK_JOBS: Job[] = [
  { id: 'JOB-8X92', character: 'Aria_V2', status: 'processing', type: 'IMAGE', prompt: 'Cyberpunk street...', nsfw: false, engine: 'SDXL' },
  { id: 'JOB-99A1', character: 'Neo_01', status: 'queued', type: 'VIDEO', prompt: 'Walking sequence...', nsfw: false, engine: 'SVD' },
  { id: 'JOB-7B22', character: 'Aria_V2', status: 'review', type: 'IMAGE', prompt: 'Portrait studio...', nsfw: false, engine: 'SDXL' },
  { id: 'JOB-1C44', character: 'Nexus_Core', status: 'posted', type: 'VIDEO', prompt: 'Hologram glitch...', nsfw: false, engine: 'SVD' },
  { id: 'JOB-2D55', character: 'Aria_V2', status: 'review', type: 'VIDEO', prompt: 'Cybernetic install...', nsfw: false, engine: 'SVD' },
  { id: 'JOB-3E66', character: 'Neo_01', status: 'queued', type: 'IMAGE', prompt: 'Neon rain...', nsfw: false, engine: 'SDXL' },
];

export default function Dashboard() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [jobs, setJobs] = useState(MOCK_JOBS);

  return (
    <div className="flex flex-col h-full w-full space-y-4 px-6 py-8 font-sans bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface p-8 rounded-[2px] border border-white/5">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Operations Center</h1>
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2">Scale Production</span>
          </div>
          <div className="flex bg-black p-1 rounded-[2px] border border-white/5">
            <button onClick={() => setView('kanban')} className={cn("px-5 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all italic", view === 'kanban' ? "bg-primary text-black" : "text-slate-500 hover:text-white")}>KANBAN</button>
            <button onClick={() => setView('table')} className={cn("px-5 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all italic", view === 'table' ? "bg-primary text-black" : "text-slate-500 hover:text-white")}>TABLE</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select className="bg-black border border-white/10 rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-primary px-4 cursor-pointer italic h-[50px] appearance-none min-w-[150px]">
            <option>Status: All</option>
            {COLUMNS.map(c => <option key={c.value}>{c.label}</option>)}
          </select>

          <Button variant="natak" className="h-[50px] px-8 py-4 text-[11px] shadow-[0_0_30px_rgba(204,255,0,0.1)]">
            Run Pipeline
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        {view === 'kanban' ? (
          <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex h-full gap-6 pb-4">
              {COLUMNS.map(col => (
                <div key={col.value} className="min-w-[350px] flex-1 flex flex-col bg-surface/50 rounded-[10px] border border-white/5 overflow-hidden">
                  <div className="p-6 flex justify-between items-center bg-black/40 border-b border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">{col.label}</h3>
                    <span className="text-[10px] font-black text-black bg-primary px-3 py-1 rounded-[10px] italic">{jobs.filter(j => j.status === col.value).length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {jobs.filter(j => j.status === col.value).map(job => (
                      <KanbanCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-500 italic border border-white/5 bg-surface/20 rounded-[10px]">
            <span className="uppercase tracking-widest font-black text-xs">Table View Placeholder</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanCard({ job }: { job: Job }) {
  return (
    <div className={cn("bg-[#1A1A1D] border border-white/5 p-6 rounded-[10px] shadow-2xl transition-all cursor-pointer hover:border-primary/40 hover:scale-[1.01] group", job.nsfw ? "border-destructive/30" : "")}>
      <div className="flex justify-between items-start mb-6">
        <span className="text-[11px] font-black text-white italic uppercase tracking-widest">@{job.character}</span>
        <span className="text-[9px] font-black text-slate-800 tracking-tighter uppercase">#{job.id}</span>
      </div>

      <div className="flex gap-3 items-center mt-4">
        <div className={cn("p-2 rounded-[10px]", job.type === 'VIDEO' ? "bg-primary/10" : "bg-white/5")}>
          {job.type === 'VIDEO' ? <Play className={cn("w-3 h-3", job.type === 'VIDEO' ? "text-primary fill-current" : "text-white")} /> : <Sparkles className="w-3 h-3 text-white" />}
        </div>

        <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-[10px] border", job.type === 'VIDEO' ? "bg-primary/10 text-primary border-primary/20" : "bg-white/10 text-white border-white/20")}>{job.type}</span>

        <span className={cn("text-[10px] font-black uppercase px-4 py-1.5 rounded-[10px] ml-auto italic border transition-all", job.status === 'processing' ? "bg-primary text-black border-transparent animate-pulse" : "bg-black text-primary border-primary/20")}>
          {job.status}
        </span>
      </div>
    </div>
  );
}
