
import React, { useState, useEffect } from 'react';
import { mockStore } from '../services/mockStore';
import { Ticket } from '../types';
import { HelpCircle, Terminal, MessageSquare, Send, ShieldAlert, CheckCircle2, AlertCircle, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'billing' | 'technical' | 'general'>('technical');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTickets(mockStore.getTickets());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Changed 'new Ticket' to 'newTicket' to correctly declare a variable of type Ticket.
    const newTicket: Ticket = {
      id: `TK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      subject,
      category,
      status: 'open',
      timestamp: new Date().toISOString()
    };
    mockStore.saveTicket(newTicket);
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="h-full flex flex-col space-y-10 overflow-y-auto custom-scrollbar pr-2 bg-black font-inter">
      <header className="flex-shrink-0 bg-[#1A1A1D] p-12 rounded-[2px] border border-white/5 flex justify-between items-end shadow-2xl">
        <div>
          <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">Support Terminal</h1>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">Incident Reporting & Documentation</p>
        </div>
        <div className="flex items-center gap-4 bg-black/50 px-8 py-4 border border-[#CCFF00]/20 rounded-[2px]">
           <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse"></div>
           <span className="text-[11px] font-[900] text-[#CCFF00] uppercase italic tracking-[0.2em]">Live Operator Assistance: Active</span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <StatusCard label="Inference Clusters" status="operational" icon={<CheckCircle2 className="w-5 h-5" />} />
         <StatusCard label="Training Pipeline" status="operational" icon={<CheckCircle2 className="w-5 h-5" />} />
         <StatusCard label="Asset Storage DAM" status="degraded" icon={<AlertCircle className="w-5 h-5" />} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
         {/* FAQ / Knowledge Base */}
         <section className="space-y-6">
            <h2 className="text-2xl font-[900] italic uppercase tracking-tighter mb-8 flex items-center gap-4">
               <HelpCircle className="w-6 h-6 text-slate-700" /> System Protocols
            </h2>
            <div className="space-y-4">
               <FAQItem 
                 question="How do I maximize identity consistency?" 
                 answer="Inject a minimum of 15 high-fidelity studio frames with varied lighting. Ensure the trigger word matches the model identifier." 
               />
               <FAQItem 
                 question="Token Manifestation failed, are credits refunded?" 
                 answer="Failed inference sequences (status: failed) are automatically credited back to your Resource Command center within 10 minutes." 
               />
               <FAQItem 
                 question="What are the limits on Agency API calls?" 
                 answer="Standard Agency tier allows 60 manifests per minute. Contact technical support for enterprise-scale orchestration overrides." 
               />
            </div>
         </section>

         {/* Support Tickets */}
         <section className="space-y-6">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-[900] italic uppercase tracking-tighter flex items-center gap-4">
                  <MessageSquare className="w-6 h-6 text-slate-700" /> Service Tickets
               </h2>
               <button 
                 onClick={() => setShowForm(true)}
                 className="bg-[#CCFF00] text-black px-8 py-3 rounded-[2px] font-black uppercase italic text-[10px] tracking-widest shadow-xl shadow-[#CCFF00]/10"
               >
                 Open New Ticket
               </button>
            </div>

            <div className="space-y-3">
               {tickets.map(tk => (
                  <div key={tk.id} className="bg-[#1A1A1D] border border-white/5 rounded-[2px] p-6 flex justify-between items-center group hover:border-white/20 transition-all">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic mb-1">{tk.id} / {tk.category}</span>
                        <span className="text-[13px] font-black text-white italic uppercase">{tk.subject}</span>
                     </div>
                     <div className={cn(
                        "px-4 py-1.5 rounded-[2px] text-[9px] font-black uppercase tracking-widest italic",
                        tk.status === 'open' ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-black text-slate-700 border border-white/5'
                     )}>
                        {tk.status}
                     </div>
                  </div>
               ))}
               {tickets.length === 0 && (
                  <div className="h-40 border border-dashed border-white/5 rounded-[2px] flex items-center justify-center text-slate-900 italic font-black uppercase tracking-[0.5em]">
                     Logs Clear
                  </div>
               )}
            </div>
         </section>
      </div>

      {/* Ticket Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#0F0F11] border border-white/10 p-12 rounded-md w-full max-w-xl shadow-2xl relative">
              <button onClick={() => setShowForm(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
                 <X className="w-8 h-8" />
              </button>

              <h2 className="text-4xl font-[900] uppercase italic tracking-tighter mb-10 text-white">New Incident</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 block italic">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#1A1A1D] border border-white/5 rounded-[2px] px-6 py-4 text-xs font-mono text-white italic focus:outline-none"
                    >
                       <option value="technical">Technical Manifestation Issue</option>
                       <option value="billing">Resource Pack / Billing</option>
                       <option value="general">Protocol Inquiry</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 block italic">Subject Header</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. LATENCY_ON_WAN_ENGINE"
                      className="w-full bg-[#1A1A1D] border border-white/5 rounded-[2px] px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#CCFF00] transition-all uppercase italic"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 block italic">Detailed Log</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Input diagnostic data here..."
                      className="w-full bg-[#1A1A1D] border border-white/5 rounded-[2px] px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-[#CCFF00] transition-all italic resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                 </div>

                 <button 
                   type="submit"
                   className="w-full bg-[#CCFF00] text-black py-6 rounded-[2px] font-[900] uppercase italic text-sm tracking-widest flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-[#CCFF00]/10"
                 >
                    <Send className="w-5 h-5" /> Dispatch Report
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusCard = ({ label, status, icon }: { label: string, status: 'operational' | 'degraded' | 'outage', icon: React.ReactNode }) => (
  <div className="bg-[#1A1A1D] border border-white/5 p-8 rounded-[2px] flex items-center justify-between">
     <div className="flex items-center gap-6">
        <div className={cn(
           "p-3 rounded-[2px]",
           status === 'operational' ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 
           status === 'degraded' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
        )}>
           {icon}
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic mb-1">{label}</span>
           <span className="text-sm font-black text-white italic uppercase tracking-widest">
              {status}
           </span>
        </div>
     </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
   const [open, setOpen] = useState(false);
   return (
      <div className="bg-[#1A1A1D] border border-white/5 rounded-[2px] overflow-hidden">
         <button 
           onClick={() => setOpen(!open)}
           className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-white/[0.02] transition-all"
         >
            <span className="text-[12px] font-black text-white italic uppercase tracking-widest">{question}</span>
            <ChevronDown className={cn("w-4 h-4 text-slate-700 transition-transform duration-300", open && "rotate-180 text-[#CCFF00]")} />
         </button>
         {open && (
            <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-loose italic border-t border-white/5 pt-6">
                  {answer}
               </p>
            </div>
         )}
      </div>
   );
};
