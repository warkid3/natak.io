
import React, { useState } from 'react';

const ConfigPanel: React.FC = () => {
  const [character, setCharacter] = useState('Model_A_V2');
  const [platform, setPlatform] = useState('Instagram');
  const [format, setFormat] = useState('Photo');
  const [outfitMode, setOutfitMode] = useState('Default');
  const [quantity, setQuantity] = useState(1);

  const isNSFW = platform === 'Twitter';
  const totalCost = (format === 'Video' ? 0.15 : 0.05) * quantity;

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold">New Batch Configuration</h1>
        <p className="text-zinc-500 text-sm">Define job parameters to minimize rework and maximize output quality.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Parameters */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">1. Identity & Safety</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-400">Character LoRA</label>
              <select 
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="Model_A_V2">Model_A_V2 (Stable)</option>
                <option value="Brand_Amb_01">Brand_Ambassador_01</option>
                <option value="Vogue_Style">Vogue_01_HighRes</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-400">Target Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {['Twitter', 'Instagram', 'Client'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                      platform === p 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-1 italic text-zinc-600">
                {isNSFW ? '⚠️ NSFW Protocol: Enabled (Pony Model)' : '✓ SFW Protocol: Enabled (Nano Model)'}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">2. Media Format</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormat('Photo')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  format === 'Photo' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="font-bold">Photo Only</span>
                <span className="text-[10px] opacity-60">$0.05 / Image</span>
              </button>
              <button 
                onClick={() => setFormat('Video')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  format === 'Video' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="font-bold">Photo + Video</span>
                <span className="text-[10px] opacity-60">$0.15 / Image</span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">3. Batch Control</h3>
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-zinc-400">Quantity (1-50)</label>
                <input 
                  type="range" min="1" max="50" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-indigo-500" 
                />
              </div>
              <div className="text-2xl font-bold w-12 text-center">{quantity}</div>
            </div>
          </section>
        </div>

        {/* Right Side: Preview & Review */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold mb-6">Pre-Queue Checklist</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">✓</div>
              <span>{character} LoRA Selected</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">✓</div>
              <span>Platform: {platform} ({isNSFW ? 'NSFW' : 'SFW'})</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">✓</div>
              <span>Format: {format === 'Video' ? 'Wan 2.2 / LTX-2' : 'Static'}</span>
            </li>
          </ul>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-xs text-zinc-500 font-medium">Estimated Cost</div>
                <div className="text-3xl font-bold">${totalCost.toFixed(2)}</div>
              </div>
              <div className="text-xs text-right text-zinc-600 font-semibold">
                Available Credits:<br/>
                <span className="text-emerald-500">$4,281.50</span>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-[10px] text-amber-500 mb-4 leading-relaxed">
              <strong>CREDIT CONSERVATION RULE:</strong> Always run a 1-image test batch before queuing 50 images to prevent wasting credits on misconfigured jobs.
            </div>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3">
              <span>Initialize Production Batch</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
