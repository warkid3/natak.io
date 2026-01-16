
import React, { useState } from 'react';
import { JobStatus, PipelineStep, Job } from '../types';
import { STATUS_COLORS } from '../constants';
import JobDetailsModal from './JobDetailsModal';

const MOCK_JOBS: Job[] = [
  { id: 'JOB-001', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Video', status: JobStatus.PROCESSING, currentStep: PipelineStep.VIDEO_PREP, progress: 65, timestamp: '14:20:05', cost: 0.15, retryCount: 0 },
  { id: 'JOB-002', character: 'Brand_Amb_01', platform: 'Twitter', isNSFW: true, format: 'Photo', status: JobStatus.FAILED, currentStep: PipelineStep.UPSCALE, progress: 40, timestamp: '14:21:12', cost: 0.02, error: 'Server Timeout', retryCount: 1 },
  { id: 'JOB-003', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Photo', status: JobStatus.QUEUED, currentStep: PipelineStep.BASE_GEN, progress: 0, timestamp: '14:22:15', cost: 0.05, retryCount: 0 },
  { id: 'JOB-004', character: 'Vogue_01', platform: 'Client', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:18:30', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
  { id: 'JOB-005', character: 'Brand_Amb_01', platform: 'Instagram', isNSFW: false, format: 'Video', status: JobStatus.PAUSED, currentStep: PipelineStep.CLOTH_SWAP, progress: 20, timestamp: '14:15:00', cost: 0.02, retryCount: 0 },
  { id: 'JOB-006', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:10:00', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
  { id: 'JOB-007', character: 'Vogue_01', platform: 'Client', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:05:00', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
  { id: 'JOB-008', character: 'Brand_Amb_01', platform: 'Twitter', isNSFW: true, format: 'Video', status: JobStatus.PROCESSING, currentStep: PipelineStep.BASE_GEN, progress: 15, timestamp: '14:25:00', cost: 0.15, retryCount: 0 },
];

const QueueManager: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [inspectedJob, setInspectedJob] = useState<Job | null>(null);

  // Updated toggleSelection to use React.SyntheticEvent to handle both MouseEvent and ChangeEvent
  const toggleSelection = (e: React.SyntheticEvent, id: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedJobs(newSelected);
  };

  const toggleAll = () => {
    if (selectedJobs.size === MOCK_JOBS.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(MOCK_JOBS.map(j => j.id)));
    }
  };

  const getActionRequired = (job: Job) => {
    if (job.status === JobStatus.FAILED) return { label: 'Retry Step', color: 'text-rose-500 bg-rose-500/10' };
    if (job.status === JobStatus.COMPLETED && job.qualityStatus === 'Pending') return { label: 'Ready for QC', color: 'text-blue-500 bg-blue-500/10' };
    if (job.status === JobStatus.PROCESSING && job.progress > 0) return { label: 'Monitoring', color: 'text-amber-500 bg-amber-500/10' };
    return null;
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Queue Manager</h1>
          <p className="text-zinc-500 text-sm">Monitor active GPU threads and triage exceptions.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg shadow-inner">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              Table View
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Grid View
            </button>
          </div>
        </div>
      </header>

      {/* Quick Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['All Jobs', 'Processing', 'Failed', 'QC Required', 'Stuck (>10m)'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                filter === f.toLowerCase() 
                  ? 'bg-white text-black border-white' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        {selectedJobs.size > 0 && (
          <div className="flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-right-4">
            <span className="text-xs font-bold text-indigo-400">{selectedJobs.size} Selected</span>
            <div className="h-4 w-px bg-indigo-500/30"></div>
            <button className="text-[10px] uppercase font-black text-indigo-300 hover:text-white transition-colors">Abort</button>
            <button className="text-[10px] uppercase font-black text-indigo-300 hover:text-white transition-colors">Retry</button>
            <button className="text-[10px] uppercase font-black text-indigo-300 hover:text-white transition-colors">Bulk QC</button>
          </div>
        )}
      </div>

      {viewMode === 'table' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedJobs.size === MOCK_JOBS.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 accent-indigo-500 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4">Job Info</th>
                <th className="px-6 py-4">Pipeline Status</th>
                <th className="px-6 py-4">Action Required</th>
                <th className="px-6 py-4">Metrics</th>
                <th className="px-6 py-4 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {MOCK_JOBS.map((job) => {
                const action = getActionRequired(job);
                const isSelected = selectedJobs.has(job.id);
                return (
                  <tr 
                    key={job.id} 
                    onClick={() => setInspectedJob(job)}
                    className={`hover:bg-zinc-800/30 transition-colors group cursor-pointer ${isSelected ? 'bg-indigo-500/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => toggleSelection(e, job.id)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 accent-indigo-500 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                          <img 
                            src={`https://picsum.photos/seed/${job.id}/100/100`} 
                            alt="Preview" 
                            className={`w-full h-full object-cover transition-opacity duration-300 ${job.status === JobStatus.QUEUED ? 'opacity-20 grayscale' : 'opacity-100'}`}
                          />
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {job.character}
                            {job.isNSFW && <span className="text-[9px] px-1 bg-rose-500/20 text-rose-500 rounded font-black">18+</span>}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                            {job.id} • {job.format} • {job.platform}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${STATUS_COLORS[job.status]}`}>
                          {job.status}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          Step {job.currentStep}/5
                        </span>
                      </div>
                      <div className="w-40 bg-zinc-800 h-1 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full transition-all duration-1000 ${job.status === JobStatus.FAILED ? 'bg-rose-500' : job.status === JobStatus.COMPLETED ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {action ? (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border border-transparent ${action.color}`}>
                          {action.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-700 font-medium">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-300">${job.cost.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-600 italic">{job.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-all"
                          onClick={(e) => { e.stopPropagation(); setInspectedJob(job); }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-all" onClick={(e) => e.stopPropagation()}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {MOCK_JOBS.map((job) => {
            const isSelected = selectedJobs.has(job.id);
            return (
              <div 
                key={job.id} 
                onClick={() => setInspectedJob(job)}
                className={`relative bg-zinc-900 border rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1 ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-800'
                }`}
              >
                <div className="aspect-[3/4] bg-zinc-800 relative">
                  <img 
                    src={`https://picsum.photos/seed/${job.id}/300/400`} 
                    alt="Preview" 
                    className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'} ${job.status === JobStatus.QUEUED ? 'opacity-30 grayscale' : 'opacity-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div 
                        className={`p-1 rounded bg-zinc-950/80 border border-zinc-700 backdrop-blur-sm transition-all ${isSelected ? 'bg-indigo-600 border-indigo-500' : ''}`}
                        onClick={(e) => toggleSelection(e, job.id)}
                      >
                         {isSelected ? (
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                         ) : (
                           <div className="w-3 h-3"></div>
                         )}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shadow-lg ${STATUS_COLORS[job.status]}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-white">
                      <div className="font-bold text-xs truncate">{job.character}</div>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${job.progress}%` }}></div>
                        </div>
                        <span className="text-[8px] font-bold text-zinc-300">{job.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {job.status === JobStatus.FAILED && (
                   <div className="bg-rose-500 text-white text-[9px] font-black py-1 px-2 text-center flex items-center justify-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     ERROR DETECTED
                   </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {inspectedJob && (
        <JobDetailsModal 
          job={inspectedJob} 
          onClose={() => setInspectedJob(null)} 
          onAction={(a) => {
            console.log(`Action executed for ${inspectedJob.id}: ${a}`);
            // Logic would go here to update state
            setInspectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default QueueManager;
