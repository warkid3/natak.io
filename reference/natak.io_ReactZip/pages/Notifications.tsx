
import React, { useState, useEffect } from 'react';
import { mockStore } from '../services/mockStore';
import { Notification } from '../types';
// Fix: 'ShieldInfo' does not exist in lucide-react, replaced with 'ShieldAlert'
import { Bell, Zap, Terminal, ShieldAlert, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(mockStore.getNotifications());
  }, []);

  const handleMarkAllRead = () => {
    notifications.forEach(n => mockStore.markNotificationRead(n.id));
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleItemClick = (n: Notification) => {
    mockStore.markNotificationRead(n.id);
    if (n.link) navigate(n.link);
    setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
  };

  return (
    <div className="h-full flex flex-col space-y-10 overflow-hidden bg-black font-inter">
      <header className="flex-shrink-0 bg-[#1A1A1D] p-12 rounded-[2px] border border-white/5 flex justify-between items-end shadow-2xl">
        <div>
          <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">Event Logs</h1>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">System Alerts & Operation Status</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="flex items-center gap-3 px-8 py-4 rounded-[2px] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-white transition-all"
        >
           <Check className="w-4 h-4" /> Acknowledge All
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
        <div className="max-w-5xl space-y-4">
           {notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => handleItemClick(n)}
                className={cn(
                  "bg-[#1A1A1D] border rounded-[2px] p-8 flex items-center justify-between transition-all cursor-pointer group",
                  n.read ? "border-white/5 opacity-60" : "border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.02)]"
                )}
              >
                 <div className="flex items-center gap-10">
                    <div className={cn(
                       "w-12 h-12 rounded-[2px] flex items-center justify-center transition-all group-hover:scale-110",
                       n.type === 'job' ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 
                       n.type === 'system' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                    )}>
                       {/* Fix: Replaced ShieldInfo with ShieldAlert */}
                       {n.type === 'job' ? <Zap className="w-5 h-5" /> : 
                        n.type === 'system' ? <Terminal className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex flex-col">
                       <div className="flex items-center gap-3 mb-1">
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></div>}
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                             {n.type.toUpperCase()} / {new Date(n.timestamp).toLocaleTimeString()}
                          </span>
                       </div>
                       <h3 className="text-xl font-[900] italic uppercase text-white tracking-tighter mb-1">{n.title}</h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{n.message}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-6">
                    {n.link && (
                       <div className="p-3 bg-white/5 rounded-[2px] text-slate-600 group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                          <ArrowUpRight className="w-5 h-5" />
                       </div>
                    )}
                 </div>
              </div>
           ))}

           {notifications.length === 0 && (
              <div className="h-80 border border-dashed border-white/5 rounded-[2px] flex flex-col items-center justify-center text-slate-900">
                 <Bell className="w-16 h-16 mb-8 opacity-10" />
                 <span className="text-[11px] font-black uppercase italic tracking-[0.5em] opacity-20">Logs Synchronized</span>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
