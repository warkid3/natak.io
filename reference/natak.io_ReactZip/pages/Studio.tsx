
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerationJob, Status, CharacterModel, Asset } from '../types';
import { mockStore } from '../services/mockStore';

const COLUMNS: { label: string; value: Status }[] = [
  { label: 'Queued', value: 'queued' },
  { label: 'Generating', value: 'processing' },
  { label: 'Review', value: 'review' },
  { label: 'Ready', value: 'posted' }
];

export const StudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [characters, setCharacters] = useState<CharacterModel[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [inspectJob, setInspectJob] = useState<GenerationJob | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkflow, setFilterWorkflow] = useState<'all' | 'image' | 'video'>('all');
  const [sortField, setSortField] = useState<keyof GenerationJob>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setJobs(mockStore.getJobs());
    setCharacters(mockStore.getCharacters());
    setAssets(mockStore.getAssets());
  }, []);

  const processedJobs = useMemo(() => {
    let result = [...jobs];
    if (filterStatus !== 'all') result = result.filter(j => j.status === filterStatus);
    if (filterWorkflow === 'image') result = result.filter(j => !j.video_model);
    else if (filterWorkflow === 'video') result = result.filter(j => !!j.video_model);

    result.sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [jobs, filterStatus, filterWorkflow, sortField, sortOrder]);

  const handleSort = (field: keyof GenerationJob) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const refreshJobs = () => setJobs(mockStore.getJobs());

  const handleRunPipeline = () => {
    const idsToRun = jobs.filter(j => j.status === 'queued').map(j => j.id);
    mockStore.bulkUpdateJobs(idsToRun, 'processing');
    refreshJobs();
    
    idsToRun.forEach(id => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 25;
        if (prog >= 100) {
          clearInterval(interval);
          mockStore.updateJob(id, { status: 'review', progress: 100, output_url: `https://picsum.photos/seed/${id}/800/1200` });
          refreshJobs();
        } else {
          mockStore.updateJob(id, { progress: prog });
          refreshJobs();
        }
      }, 1200);
    });
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 px-2 overflow-hidden bg-black font-inter">
      <header className="flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#1A1A1D] p-8 rounded-[2px] border border-white/5">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <h1 className="text-3xl font-[900] italic tracking-tighter text-white uppercase leading-none">Automation Board</h1>
            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2">Scale Production</span>
          </div>
          <div className="flex bg-black p-1 rounded-[2px] border border-white/5">
            <button onClick={() => setView('kanban')} className={`px-5 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'kanban' ? 'bg-[#CCFF00] text-black' : 'text-slate-500 hover:text-white'}`}>KANBAN</button>
            <button onClick={() => setView('table')} className={`px-5 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'table' ? 'bg-[#CCFF00] text-black' : 'text-slate-500 hover:text-white'}`}>TABLE</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-white/10 rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-[#CCFF00] px-4 py-4 cursor-pointer italic"
          >
            <option value="all">Status: All</option>
            {COLUMNS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <button 
            onClick={handleRunPipeline} 
            className="bg-[#CCFF00] text-black hover:scale-105 px-8 py-4 rounded-[2px] font-black italic text-[11px] shadow-[0_0_30px_rgba(204,255,0,0.1)] active:scale-95 transition-all uppercase tracking-widest"
          >
            Run Pipeline
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 w-full overflow-hidden">
        {view === 'kanban' ? (
          <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="flex h-full gap-6 pb-4">
              {COLUMNS.map(col => (
                <div key={col.value} className="min-w-[380px] flex-1 flex flex-col bg-[#0F0F11]/50 rounded-[2px] border border-white/5 overflow-hidden">
                  <div className="p-6 flex justify-between items-center bg-black/40 border-b border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#CCFF00] italic">{col.label}</h3>
                    <span className="text-[10px] font-black text-black bg-[#CCFF00] px-3 py-1 rounded-[2px] italic">{processedJobs.filter(j => j.status === col.value).length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {processedJobs.filter(j => j.status === col.value).map(job => (
                      <KanbanCard 
                        key={job.id} 
                        job={job} 
                        char={characters.find(c => c.id === job.character_id)} 
                        onInspect={() => setInspectJob(job)} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-[#1A1A1D]/30 rounded-[2px] border border-white/5 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky top-0 bg-black/90 backdrop-blur-md z-10 border-b border-white/10">
                  <tr className="text-[#CCFF00] italic">
                    <SortHeader label="Identity" field="id" current={sortField} order={sortOrder} onClick={handleSort} />
                    <SortHeader label="Safety" field="is_nsfw" current={sortField} order={sortOrder} onClick={handleSort} />
                    <SortHeader label="Engine" field="image_model" current={sortField} order={sortOrder} onClick={handleSort} />
                    <SortHeader label="Motion" field="video_model" current={sortField} order={sortOrder} onClick={handleSort} />
                    <SortHeader label="Workflow" field="video_model" current={sortField} order={sortOrder} onClick={handleSort} />
                    <SortHeader label="Status" field="status" current={sortField} order={sortOrder} onClick={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {processedJobs.map(job => (
                    <tr key={job.id} onClick={() => setInspectJob(job)} className="hover:bg-white/[0.03] cursor-pointer transition-colors group italic">
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-white uppercase tracking-tight">@{characters.find(c => c.id === job.character_id)?.name}</span>
                          <span className="text-[9px] font-black text-slate-700 tracking-[0.2em] uppercase">ID: {job.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        {job.is_nsfw ? <span className="text-[9px] font-black px-2 py-1 rounded-[2px] bg-red-600/20 text-red-500 uppercase tracking-widest border border-red-500/20">NSFW</span> : <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Clear</span>}
                      </td>
                      <td className="p-6 font-black text-[10px] text-slate-500 uppercase tracking-widest">{job.image_model}</td>
                      <td className="p-6 font-black text-[10px] text-[#CCFF00] uppercase tracking-widest">{job.video_model || '—'}</td>
                      <td className="p-6">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-[2px] ${job.video_model ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-white/10 text-white border border-white/20'}`}>
                          {job.video_model ? 'VIDEO' : 'IMAGE'}
                        </span>
                      </td>
                      <td className="p-6 text-[10px] font-black uppercase italic text-slate-600">{job.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {inspectJob && (
        <JobModalManager 
          job={inspectJob} 
          char={characters.find(c => c.id === inspectJob.character_id)} 
          sourceAsset={assets.find(a => a.id === inspectJob.asset_id)}
          onClose={() => setInspectJob(null)} 
          onUpdate={refreshJobs}
          onNavigateToPrompts={(j) => navigate('/saved-prompts', { state: { job: j } })}
        />
      )}
    </div>
  );
};

const KanbanCard: React.FC<{ job: GenerationJob; char?: CharacterModel; onInspect: () => void }> = ({ job, char, onInspect }) => (
  <div onClick={onInspect} className={`bg-[#1A1A1D] border-2 p-6 rounded-[2px] shadow-2xl transition-all cursor-pointer hover:border-[#CCFF00]/40 hover:scale-[1.01] group ${job.is_nsfw ? 'border-red-900/30' : 'border-white/5'}`}>
    <div className="flex justify-between items-start mb-6">
      <span className="text-[11px] font-black text-white italic uppercase tracking-widest">@{char?.name}</span>
      <span className="text-[9px] font-black text-slate-800 tracking-tighter uppercase">#{job.id.slice(0, 8)}</span>
    </div>
    <div className="flex gap-3 items-center">
      {job.video_model ? (
        <div className="p-2.5 bg-[#CCFF00]/10 rounded-[2px]"><svg className="w-4 h-4 text-[#CCFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>
      ) : (
        <div className="p-2.5 bg-white/5 rounded-[2px]"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
      )}
      {job.is_nsfw && <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-[2px] tracking-widest uppercase">NSFW</span>}
      <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-[2px] ml-auto italic ${job.status === 'processing' ? 'bg-[#CCFF00] text-black animate-pulse' : 'bg-black text-[#CCFF00] border border-[#CCFF00]/20'}`}>
        {job.status}
      </span>
    </div>
  </div>
);

const SortHeader: React.FC<{ label: string; field: keyof GenerationJob; current: string; order: string; onClick: (f: any) => void }> = ({ label, field, current, order, onClick }) => (
  <th onClick={() => onClick(field)} className="p-6 text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] cursor-pointer hover:text-[#CCFF00] transition-colors">
    <div className="flex items-center gap-2">
      {label}
      {current === field && <svg className={`w-3 h-3 ${order === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>}
    </div>
  </th>
);

const JobModalManager: React.FC<{ 
  job: GenerationJob; 
  char?: CharacterModel; 
  sourceAsset?: Asset;
  onClose: () => void; 
  onUpdate: () => void; 
  onNavigateToPrompts: (j: GenerationJob) => void 
}> = ({ job, char, sourceAsset, onClose, onUpdate, onNavigateToPrompts }) => {
  const [isStarred, setIsStarred] = useState(mockStore.getStarredPrompts().includes(job.prompt));
  const [feedback, setFeedback] = useState('');

  const handleToggleStar = () => {
    if (isStarred) { mockStore.unstarPrompt(job.prompt); setIsStarred(false); }
    else { mockStore.starPrompt(job.prompt); setIsStarred(true); }
  };

  const handleArchive = () => { mockStore.updateJob(job.id, { status: 'archived' }); onUpdate(); onClose(); };

  return (
    <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[500] flex items-center justify-center p-10 animate-in fade-in duration-300 select-none" onClick={onClose}>
      <div className="bg-[#0F0F11] border border-white/10 rounded-md w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(204,255,0,0.05)]" onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
           <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] italic">Manifestation Metadata</span>
             <div className="w-px h-6 bg-white/10"></div>
             <span className="text-2xl font-[900] italic text-white tracking-tighter uppercase">ID: {job.id.slice(0, 10).toUpperCase()}</span>
           </div>
           <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-[#CCFF00] hover:text-black rounded-[2px] transition-all">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-black grid grid-cols-2 gap-[1px] p-[1px]">
            <div className="bg-[#0F0F11] relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-8 left-8 z-10 bg-black/80 px-4 py-2 rounded-[2px] text-[10px] font-black uppercase text-slate-500 border border-white/10 tracking-[0.2em] italic">Source Reference</div>
              {sourceAsset ? <img src={sourceAsset.url} className="w-full h-full object-cover opacity-40 grayscale" /> : <div className="text-slate-900 font-black">MISSING_SRC</div>}
            </div>
            <div className="bg-[#0F0F11] relative flex items-center justify-center overflow-hidden border-l border-white/5">
              <div className="absolute top-8 left-8 z-10 bg-[#CCFF00] px-4 py-2 rounded-[2px] text-[10px] font-black uppercase text-black shadow-2xl tracking-[0.2em] italic">Final Extraction</div>
              {job.output_url ? (
                <img src={job.output_url} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#CCFF00] font-black uppercase text-4xl italic tracking-tighter animate-pulse">Rendering...</div>
              )}
            </div>
          </div>

          <div className="w-[480px] p-12 bg-[#0F0F11] border-l border-white/5 flex flex-col space-y-12 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] border-b border-white/5 pb-4 italic">Technical Parameters</h3>
              <div className="grid grid-cols-2 gap-3">
                <SpecBox label="Persona" value={`@${char?.name}`} />
                <SpecBox label="Engine" value={job.image_model} />
                <SpecBox label="Workflow" value={job.video_model ? 'Video Sequence' : 'Still Image'} />
                <SpecBox label="Status" value={job.status} />
              </div>
            </div>

            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Extraction Script</h3>
                <div className="bg-black/40 p-10 rounded-[2px] border border-white/5 italic text-slate-400 text-xl shadow-inner min-h-[160px] leading-relaxed font-medium">
                  "{job.prompt}"
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {job.status === 'review' && (
                  <>
                    <button onClick={handleArchive} className="w-full bg-[#CCFF00] text-black py-6 rounded-[2px] font-black uppercase italic text-sm shadow-[0_20px_60px_rgba(204,255,0,0.15)] transform hover:scale-[1.01] active:scale-95 transition-all tracking-widest">Manifest to DAM</button>
                    <button className="w-full border border-white/10 text-white py-5 rounded-[2px] font-black uppercase italic text-[10px] hover:bg-white/5 transition-all tracking-widest">Refine Logic</button>
                  </>
                )}
                {job.status === 'posted' && (
                  <button className="w-full bg-[#CCFF00] text-black py-6 rounded-[2px] font-black uppercase italic text-sm tracking-widest transform hover:scale-[1.01] transition-all">Export Artifact</button>
                )}
              </div>
            </div>
            
            <div className="pt-10 border-t border-white/5 flex items-center justify-between">
              <button onClick={handleToggleStar} className={`flex items-center gap-4 px-6 py-4 rounded-[2px] font-black uppercase text-[9px] tracking-[0.2em] transition-all italic ${isStarred ? 'text-[#CCFF00] bg-[#CCFF00]/5 border border-[#CCFF00]/20' : 'text-slate-600 hover:text-white bg-white/5'}`}>
                <svg className="w-4 h-4" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                {isStarred ? 'Archive Secured' : 'Secure Template'}
              </button>
              <button onClick={() => onNavigateToPrompts(job)} className="text-slate-700 hover:text-[#CCFF00] text-[9px] font-black uppercase tracking-[0.3em] transition-colors italic border-b border-transparent hover:border-[#CCFF00]">Edit Script</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-black p-6 rounded-[2px] border border-white/5">
    <div className="text-[8px] text-slate-800 font-black uppercase mb-1 tracking-[0.3em]">{label}</div>
    <div className="text-[10px] font-black text-[#CCFF00] italic truncate uppercase tracking-widest">{value}</div>
  </div>
);
