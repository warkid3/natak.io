
import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { mockStore } from '../services/mockStore';
import { X, Upload, Sparkles } from 'lucide-react';

export const InboxPage: React.FC = () => {
  const [items, setItems] = useState<Asset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setItems(mockStore.getInbox());
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const newItems: Asset[] = files.map((f, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: `https://picsum.photos/seed/${Math.random()}/600/800`,
        caption: 'New Reference Artifact',
        type: 'image',
        source: 'upload'
      }));

      newItems.forEach(item => mockStore.saveInbox(item));
      setItems(prev => [...newItems, ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    mockStore.updateInbox(id, caption);
    setItems(prev => prev.map(item => item.id === id ? { ...item, caption } : item));
  };

  return (
    <div className="space-y-8 bg-black p-2 h-full overflow-hidden flex flex-col font-inter">
      <header className="flex justify-between items-center bg-[#1A1A1D] p-10 rounded-[2px] border border-white/5 flex-shrink-0 shadow-2xl">
        <div>
          <h1 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">Content Inbox</h1>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">REFERENCE STYLE EXTRACTION PIPELINE</p>
        </div>
        <div className="flex gap-4">
          <label className="cursor-pointer bg-[#CCFF00] text-black px-8 py-4 rounded-[2px] font-black italic uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(204,255,0,0.1)] flex items-center gap-3">
            <Upload className="w-4 h-4" />
            Inject References
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </header>

      {isUploading && (
        <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-6 rounded-[2px] flex items-center gap-4 animate-pulse mx-2">
          <div className="w-6 h-6 border-2 border-[#CCFF00] border-t-transparent animate-spin rounded-full"></div>
          <span className="text-[#CCFF00] font-black uppercase text-[10px] tracking-widest italic">Analyzing geometry cues from uploaded artifacts...</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {items.map(item => (
            <div key={item.id} className="group bg-[#1A1A1D] border border-white/5 rounded-[2px] overflow-hidden hover:border-[#CCFF00]/40 transition-all duration-700 shadow-xl cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-1000">
                <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={item.caption} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <button className="text-[10px] bg-[#CCFF00] text-black px-4 py-2 rounded-[2px] font-black uppercase italic tracking-widest self-start shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all">MANIFEST STYLE</button>
                </div>
              </div>
              <div className="p-5 border-t border-white/5">
                <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">SEEDREF_{item.id.slice(0,4).toUpperCase()}</div>
                <input 
                  className="w-full bg-transparent text-sm text-slate-400 font-medium italic focus:outline-none focus:text-white uppercase truncate"
                  value={item.caption}
                  onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                  placeholder="Annotate..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
