
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  Layers, 
  UserCircle, 
  Archive, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Bell, 
  LogOut,
  Zap
} from 'lucide-react';
import { mockStore } from '../services/mockStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = mockStore.getUser();

  const handleLogout = () => {
    mockStore.setUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-72 h-full bg-[#0F0F11] border-r border-white/5 flex flex-col p-6 font-inter select-none">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#CCFF00] rounded-[2px] flex items-center justify-center">
          <Zap className="w-5 h-5 text-black fill-black" />
        </div>
        <div className="text-xl font-[900] tracking-tighter text-white uppercase italic">
          natak<span className="text-[#CCFF00]">.</span>io
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {/* Workspace Section */}
        <section>
          <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 ml-3 italic">Workspace</h3>
          <div className="space-y-1">
            <SidebarItem to="/studio" icon={<Home className="w-4 h-4" />} label="Automation Board" />
            <SidebarItem to="/creative" icon={<Sparkles className="w-4 h-4" />} label="Creative Mode" />
            <SidebarItem to="/assets" icon={<Layers className="w-4 h-4" />} label="Asset DAM" />
            <SidebarItem to="/characters" icon={<UserCircle className="w-4 h-4" />} label="Characters" />
            <SidebarItem to="/saved-prompts" icon={<Archive className="w-4 h-4" />} label="Prompt Archive" />
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 ml-3 italic">Management</h3>
          <div className="space-y-1">
            <SidebarItem to="/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" />
            <SidebarItem to="/credits" icon={<CreditCard className="w-4 h-4" />} label="Credit Store" />
            <SidebarItem to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings & API" />
            <SidebarItem to="/support" icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" />
          </div>
        </section>
      </div>

      {/* User Footer */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between px-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{user?.tier || 'PRO'} OPERATOR</span>
            <span className="text-[13px] font-black text-white italic truncate max-w-[120px]">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="text-slate-700 hover:text-[#CCFF00] transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
        <NavLink to="/credits" className="flex items-center justify-between bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-4 rounded-[2px] hover:bg-[#CCFF00]/10 transition-all group">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" />
            <span className="text-[11px] font-[900] text-[#CCFF00] italic uppercase tracking-widest">
              {user?.credits?.toLocaleString()} CR
            </span>
          </div>
          <PlusIcon className="w-3 h-3 text-[#CCFF00] opacity-30 group-hover:opacity-100" />
        </NavLink>
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-4 px-4 py-3.5 rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
        isActive 
          ? 'bg-[#CCFF00] text-black shadow-[0_4px_20px_rgba(204,255,0,0.15)]' 
          : 'text-slate-500 hover:text-white hover:bg-white/5'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
  </svg>
);
