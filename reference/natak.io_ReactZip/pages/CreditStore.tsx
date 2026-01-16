
import React, { useState, useEffect } from 'react';
import { mockStore } from '../services/mockStore';
import { Transaction, User } from '../types';
import { Zap, ShieldCheck, Check, Clock, TrendingDown, ArrowUpRight } from 'lucide-react';

const PLANS = [
  { 
    name: 'Influencer', 
    price: '$49', 
    credits: '5,000', 
    features: ['10 Identity Slots', 'SFW Only', 'Standard Speed'], 
    color: 'slate-500' 
  },
  { 
    name: 'Pro', 
    price: '$129', 
    credits: '15,000', 
    features: ['50 Identity Slots', 'NSFW Bypassing', 'Priority Rendering', '4K Video'], 
    color: '[#CCFF00]', 
    popular: true 
  },
  { 
    name: 'Agency', 
    price: '$499', 
    credits: 'Unlimited*', 
    features: ['Unlimited Identities', 'Custom LoRA Training', 'API Access', 'Dedicated Support'], 
    color: 'white' 
  }
];

const PACKS = [
  { name: 'Starter Pack', amount: '1,000', price: '$15' },
  { name: 'Studio Pack', amount: '5,000', price: '$50', bestValue: true },
  { name: 'Agency Pack', amount: '25,000', price: '$199' }
];

export const CreditStore: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setUser(mockStore.getUser());
    setTransactions(mockStore.getTransactions());
  }, []);

  return (
    <div className="h-full flex flex-col space-y-10 overflow-y-auto custom-scrollbar pr-2 bg-black font-inter">
      <header className="flex-shrink-0 bg-[#1A1A1D] p-12 rounded-[2px] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/5 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">Resource Command</h1>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">Monetization & Token Logistics</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic block mb-1">Current Active Plan</span>
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-[#CCFF00]" />
               <span className="text-2xl font-[900] text-white italic uppercase tracking-tighter">{user?.tier || 'PRO'} OPERATOR</span>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PLANS.map(plan => (
          <div key={plan.name} className={`relative bg-[#0F0F11] border-2 rounded-[2px] p-10 flex flex-col transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-[#CCFF00] shadow-[0_20px_80px_rgba(204,255,0,0.1)]' : 'border-white/5'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#CCFF00] text-black px-6 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-[2px] shadow-2xl">Recommended</div>
            )}
            <div className="mb-10">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-2">{plan.name} Tier</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-[900] text-white italic tracking-tighter">{plan.price}</span>
                <span className="text-slate-700 font-black uppercase text-[10px] tracking-widest">/ Month</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 mb-10">
              <div className="bg-black/50 p-6 rounded-[2px] border border-white/5 mb-6">
                 <div className="flex items-center gap-3 mb-1">
                   <Zap className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" />
                   <span className="text-xl font-[900] text-white italic">{plan.credits}</span>
                 </div>
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Monthly Token Infusion</span>
              </div>
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-slate-400 group">
                  <Check className="w-3.5 h-3.5 text-slate-800 group-hover:text-[#CCFF00] transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest italic transition-colors group-hover:text-white">{f}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-[2px] font-black uppercase italic tracking-[0.2em] text-sm transition-all ${
              plan.popular 
                ? 'bg-[#CCFF00] text-black shadow-xl shadow-[#CCFF00]/10 hover:bg-[#b8e600]' 
                : 'border border-white/10 text-white hover:bg-white/5'
            }`}>
              Initiate License
            </button>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
        {/* Top-Up Packs */}
        <section className="bg-[#1A1A1D]/30 border border-white/5 rounded-[2px] p-10 flex flex-col h-fit">
          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
            <Zap className="w-6 h-6 text-[#CCFF00]" />
            <h2 className="text-2xl font-[900] italic uppercase tracking-tighter">One-Time Refills</h2>
          </div>
          <div className="space-y-4">
            {PACKS.map(pack => (
              <div key={pack.name} className="flex items-center justify-between bg-black p-6 rounded-[2px] border border-white/5 group hover:border-[#CCFF00]/40 transition-all cursor-pointer">
                <div className="flex items-center gap-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">{pack.name}</span>
                      <span className="text-2xl font-[900] text-white italic tracking-tighter">+{pack.amount} CR</span>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="text-xl font-[900] text-[#CCFF00] italic">{pack.price}</span>
                   <button className="bg-white/5 text-white p-3 rounded-[2px] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <ArrowUpRight className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction History */}
        <section className="bg-[#1A1A1D]/30 border border-white/5 rounded-[2px] p-10 flex flex-col">
           <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
            <Clock className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-[900] italic uppercase tracking-tighter">Transaction Log</h2>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left">
               <thead>
                 <tr className="text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                   <th className="pb-4">Operation</th>
                   <th className="pb-4">Timestamp</th>
                   <th className="pb-4 text-right">Impact</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {transactions.map(tx => (
                   <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all">
                     <td className="py-5">
                       <div className="flex flex-col">
                         <span className="text-[11px] font-black text-slate-400 uppercase italic group-hover:text-white transition-colors">{tx.description}</span>
                         <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest">ID: {tx.id.toUpperCase()}</span>
                       </div>
                     </td>
                     <td className="py-5 text-[10px] font-black text-slate-700 italic uppercase">
                       {new Date(tx.timestamp).toLocaleDateString()}
                     </td>
                     <td className={`py-5 text-right font-[900] italic ${tx.type === 'debit' ? 'text-red-500' : 'text-[#CCFF00]'}`}>
                       {tx.type === 'debit' ? '-' : '+'}{tx.amount}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
