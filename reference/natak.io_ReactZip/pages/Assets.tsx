
import React, { useState, useEffect } from 'react';
import { Asset, CharacterModel, ImageModel, VideoModel, PromptingModel, GenerationJob } from '../types';
import { mockStore } from '../services/mockStore';
import { X } from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [characters, setCharacters] = useState<CharacterModel[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [showQueueSidebar, setShowQueueSidebar] = useState(false);
  
  const [promptingModel, setPromptingModel] = useState<PromptingModel>('Gemini 1.5 Flash');
  const [imageModel, setImageModel] = useState<ImageModel>('Pony Realism (SDXL)');
  const [videoModel, setVideoModel] = useState<VideoModel>('Wan 2.6');
  const [useVideo, setUseVideo] = useState(false);
  const [isNsfw, setIsNsfw] = useState(false);

  useEffect(() => {
    setAssets(mockStore.getAssets());
    setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedAssetIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleQueueToAuto = () => {
    if (selectedAssetIds.length === 0) return;
    setShowQueueSidebar(true);
  };

  const submitBatch = () => {
    if (characters.length === 0) return alert('No character selected');
    
    selectedAssetIds.forEach(id => {
      const asset = assets.find(a => a.id === id);
      const newJob: GenerationJob = {
        id: Math.random().toString(36).substr(2, 9),
        asset_id: id,
        character_id: characters[0].id,
        prompting_model: promptingModel,
        image_model: imageModel,
        video_model: useVideo ? videoModel : undefined,
        status: 'queued' as const,
        is_nsfw: isNsfw,
        prompt: asset?.caption || 'Auto-generated sequence',
        created_at: new Date().toISOString(),
        progress: 0
      };
      mockStore.saveJob(newJob);
    });

    setSelectedAssetIds([]);
    setShowQueueSidebar(false);
    alert('Batch manifestations initiated.');
  };

  return (
    <div className="flex h-full gap-4 relative overflow-hidden bg-black text-white p-2 font-inter">
      <div className={`flex-1 space-y-6 transition-all duration-300 ${showQueueSidebar ? 'mr-[420px]' : ''}`}>
        <header className="flex justify-between items-center bg-[#1A1A1D] p-8 rounded-[2px] border border-white/5">
          <div>
            <h1 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">Asset DAM</h1>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2">Digital Asset Management</p>
          </div>
          <div className="flex gap-4">
            {selectedAssetIds.length > 0 && (
              <button 
                onClick={handleQueueToAuto}
                className="bg-[#CCFF00] text-black px-8 py-3 rounded-[2px] font-black uppercase text-xs tracking-widest italic shadow-[0_10px_40px_rgba(204,255,0,0.2)]"
              >
                PROCEED WITH ({selectedAssetIds.length})
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
          {assets.map(asset => (
            <div 
              key={asset.id} 
              onClick={() => toggleSelect(asset.id)}
              className={`group relative bg-[#1A1A1D] border rounded-[2px] overflow-hidden transition-all cursor-pointer ${selectedAssetIds.includes(asset.id) ? 'border-[#CCFF00]' : 'border-white/5'}`}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img src={asset.url} className={`w-full h-full object-cover transition-transform duration-1000 ${selectedAssetIds.includes(asset.id) ? 'scale-110' : 'group-hover:scale-110'}`} />
                <div className="absolute top-4 right-4 z-10">
                  <div className={`w-8 h-8 rounded-[2px] border flex items-center justify-center transition-all ${selectedAssetIds.includes(asset.id) ? 'bg-[#CCFF00] border-[#CCFF00]' : 'bg-black/60 border-white/20'}`}>
                    {selectedAssetIds.includes(asset.id) && <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[9px] font-black text-[#CCFF00] uppercase tracking-widest mb-1 italic">{asset.source}</div>
                <div className="text-xs text-slate-300 truncate font-medium uppercase tracking-tight italic">{asset.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className={`fixed right-4 top-[88px] bottom-6 w-[400px] bg-[#0F0F11] border border-white/10 z-50 p-10 rounded-md flex flex-col transform transition-all duration-500 ${showQueueSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-[900] tracking-tighter italic uppercase text-white">Batch Config</h2>
          <button onClick={() => setShowQueueSidebar(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
        </div>
        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <section className="space-y-6">
             <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Orchestration (Vision-to-Text)</label>
              <select 
                value={promptingModel} 
                onChange={(e) => setPromptingModel(e.target.value as PromptingModel)} 
                className="w-full bg-black border border-white/10 rounded-[2px] px-6 py-4 text-sm text-white focus:outline-none font-mono"
              >
                <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (SFW Analysis)</option>
                <option value="xAI Grok Beta">xAI Grok Beta (NSFW/Uncensored)</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Synthesis Engine</label>
              <select 
                value={imageModel} 
                onChange={(e) => setImageModel(e.target.value as ImageModel)} 
                className="w-full bg-black border border-white/10 rounded-[2px] px-6 py-4 text-sm text-white focus:outline-none font-mono"
              >
                <option value="Pony Realism (SDXL)">Pony Realism (LoRA Compatible)</option>
                <option value="Nano Banana Pro">Nano Banana Pro (Fast SFW)</option>
                <option value="Seedream 4.0">Seedream 4.0 (Uncensored Base)</option>
                <option value="Seedream 4.5">Seedream 4.5 (High-Fidelity)</option>
              </select>
            </div>

            <div className="bg-black p-6 rounded-[2px] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">NSFW Logic</span>
                <button 
                  onClick={() => setIsNsfw(!isNsfw)} 
                  className={`px-3 py-1 text-[9px] font-black rounded-[2px] border transition-colors ${isNsfw ? 'bg-red-600/20 text-red-500 border-red-500' : 'text-slate-600 border-slate-800'}`}
                >
                  BYPASS {isNsfw ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Motion Sequence</span>
                <button 
                  onClick={() => setUseVideo(!useVideo)} 
                  className={`px-3 py-1 text-[9px] font-black rounded-[2px] border transition-colors ${useVideo ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]' : 'text-slate-600 border-slate-800'}`}
                >
                  VIDEO {useVideo ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>

            {useVideo && (
              <div className="space-y-3 animate-in slide-in-from-top-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Motion Engine</label>
                <select 
                  value={videoModel} 
                  onChange={(e) => setVideoModel(e.target.value as VideoModel)} 
                  className="w-full bg-black border border-white/10 rounded-[2px] px-6 py-4 text-sm text-white focus:outline-none font-mono"
                >
                  <option value="Wan 2.6">Wan 2.6 (High Fidelity Realism)</option>
                  <option value="Wan 2.5">Wan 2.5 (Realistic Motion)</option>
                  <option value="Wan 2.2 Animate">Wan 2.2 Animate (NSFW Specialist)</option>
                  <option value="Kling 2.6 Pro">Kling 2.6 Pro (High Quality SFW)</option>
                  <option value="Kling 2.5 Turbo">Kling 2.5 Turbo (Fast Sequence)</option>
                  <option value="Kling Motion Control">Kling Motion Control (Transfer)</option>
                  <option value="Kling O1">Kling O1 (Experimental)</option>
                  <option value="Veo 3.1">Google Veo 3.1 (Commercial SFW)</option>
                  <option value="LTX-2">LTX-2 (Cinematic/Open Weights)</option>
                </select>
              </div>
            )}
          </section>
        </div>
        <button 
          onClick={submitBatch} 
          className="w-full bg-[#CCFF00] text-black font-black py-5 rounded-[2px] shadow-[0_10px_40px_rgba(204,255,0,0.2)] mt-8 uppercase tracking-widest text-sm italic"
        >
          Initiate Manifestation
        </button>
      </aside>
    </div>
  );
};
