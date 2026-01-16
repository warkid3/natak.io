
import React from 'react';
import { Job, JobStatus, PipelineStep } from '../types';
import { STATUS_COLORS } from '../constants';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onAction: (action: string) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onAction }) => {
  const pipelineSteps = [
    { step: PipelineStep.BASE_GEN, label: 'Base Gen', time: '30-60s' },
    { step: PipelineStep.CLOTH_SWAP, label: 'Cloth Swap', time: '30-45s', optional: true },
    { step: PipelineStep.UPSCALE, label: 'Upscale', time: '60-90s' },
    { step: PipelineStep.VIDEO_PREP, label: 'Video Prep', time: '120-180s', optional: true },
    { step: PipelineStep.FINAL_RENDER, label: 'Final Render', time: 'Delivery' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500">{job.id}</span>
            <div className="h-4 w-px bg-zinc-800" />
            <h2 className="font-bold text-lg">{job.character} <span className="text-zinc-500 font-normal">Details</span></h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side: Visual QC */}
          <div className="p-6 bg-zinc-950/30 flex flex-col gap-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 relative group">
              <img 
                src={`https://picsum.photos/seed/${job.id}/600/800`} 
                alt="QC Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                 <button className="w-full py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold hover:bg-white/20 transition-all">
                   View Full Resolution
                 </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Configuration</div>
                <div className="text-xs font-semibold">{job.format} • {job.platform}</div>
                <div className={`text-[10px] font-bold mt-1 uppercase ${job.isNSFW ? 'text-rose-500' : 'text-blue-500'}`}>
                  {job.isNSFW ? 'NSFW / Pony Model' : 'SFW / Nano Model'}
                </div>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Billing</div>
                <div className="text-xs font-semibold">Cost: ${job.cost.toFixed(2)}</div>
                <div className="text-[10px] text-zinc-600 italic">ID: 0x{job.id.split('-')[1]}...</div>
              </div>
            </div>
          </div>

          {/* Right Side: Pipeline & Control */}
          <div className="p-6 flex flex-col gap-8 border-l border-zinc-800">
            {/* Pipeline Tracker */}
            <div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Pipeline Execution
              </h3>
              <div className="space-y-4">
                {pipelineSteps.map((s, idx) => {
                  const isCurrent = job.currentStep === s.step;
                  const isPast = job.currentStep > s.step || job.status === JobStatus.COMPLETED;
                  const isFailed = job.status === JobStatus.FAILED && job.currentStep === s.step;
                  
                  return (
                    <div key={idx} className={`relative pl-8 pb-4 last:pb-0 group`}>
                      {/* Line */}
                      {idx !== pipelineSteps.length - 1 && (
                        <div className={`absolute left-[11px] top-6 w-px h-full ${isPast ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                      )}
                      
                      {/* Dot */}
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${
                        isFailed ? 'bg-rose-500/20 border-rose-500 animate-pulse' :
                        isCurrent ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]' :
                        isPast ? 'bg-indigo-500 border-indigo-500' : 'bg-zinc-950 border-zinc-800'
                      }`}>
                        {isPast && !isCurrent && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className={`text-xs font-bold transition-colors ${isFailed ? 'text-rose-500' : isCurrent ? 'text-indigo-400' : isPast ? 'text-zinc-200' : 'text-zinc-600'}`}>
                            {s.label} {s.optional && <span className="font-normal opacity-40">(Opt)</span>}
                          </div>
                          <div className="text-[10px] text-zinc-500">{s.time}</div>
                        </div>
                        {isFailed && (
                          <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-black border border-rose-500/20">FAIL</span>
                        )}
                        {isCurrent && job.status === JobStatus.PROCESSING && (
                          <span className="text-[10px] text-indigo-400 font-black animate-pulse uppercase">Active</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostics (If Failed) */}
            {job.status === JobStatus.FAILED && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Error Analysis</span>
                </div>
                <p className="text-xs text-rose-300 font-mono bg-zinc-950 p-2 rounded border border-rose-500/10">
                  {job.error || "UNKNOWN_GPU_TIMEOUT: Thread 0x82f exhausted before step completion."}
                </p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onAction('retry')} className="flex-1 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase rounded hover:bg-rose-600 transition-colors">Retry From Step {job.currentStep}</button>
                  <button onClick={() => onAction('report')} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase rounded hover:text-white transition-colors">Request Refund</button>
                </div>
              </div>
            )}

            {/* Action Triage (QC Phase) */}
            {job.status === JobStatus.COMPLETED && (
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Phase 3: Quality Control</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onAction('approve')}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col items-center gap-2 hover:bg-emerald-500/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-xs font-bold text-emerald-500">Approve & DAM</span>
                    </button>
                    <button 
                      onClick={() => onAction('reject')}
                      className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col items-center gap-2 hover:bg-rose-500/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <span className="text-xs font-bold text-rose-500">Reject & Abort</span>
                    </button>
                 </div>
                 {job.format === 'Photo' && (
                   <button 
                    onClick={() => onAction('video')}
                    className="w-full py-3 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600/20 transition-all"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A1 1 0 0120 13.171v5.658a1 1 0 01-1.447.894L15 17.5V10zM5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     Send to Secondary Video Pipeline (+$0.08)
                   </button>
                 )}
              </div>
            )}

            {/* The Kill Switch (Active Monitoring Phase) */}
            {job.status === JobStatus.PROCESSING && (
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-zinc-500 font-bold uppercase">Emergency Control</div>
                  <div className="text-[10px] text-rose-500 animate-pulse font-black">ACTIVE GPU USAGE</div>
                </div>
                <button 
                  onClick={() => onAction('kill')}
                  className="w-full py-4 bg-rose-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-600/10 hover:bg-rose-700 transition-all active:scale-[0.98]"
                >
                  Terminate Job (Refund Pending Steps)
                </button>
                <p className="text-[10px] text-zinc-500 text-center mt-3 leading-relaxed">
                  "The Kill Switch": If Step 1 preview looks incorrect, abort immediately to preserve credits.
                </p>
              </div>
            )}

            {/* Queued/Paused Status */}
            {(job.status === JobStatus.QUEUED || job.status === JobStatus.PAUSED) && (
              <div className="mt-auto space-y-3">
                 <button 
                   onClick={() => onAction('resume')}
                   className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-600/10 hover:bg-emerald-700 transition-all"
                 >
                   {job.status === JobStatus.QUEUED ? 'Priority Queue Jump' : 'Resume Execution'}
                 </button>
                 <button 
                   onClick={() => onAction('kill')}
                   className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-xl font-black uppercase text-xs tracking-widest hover:text-white transition-all"
                 >
                   Cancel Job
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
