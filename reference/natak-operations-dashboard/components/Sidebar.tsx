
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Analytics', Icon: Icons.Dashboard },
    { id: 'queue', label: 'Queue Manager', Icon: Icons.Queue },
    { id: 'assets', label: 'Asset Library', Icon: Icons.Assets },
    { id: 'config', label: 'Configuration', Icon: Icons.Config },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col h-screen sticky top-0 bg-[#0a0a0b]">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic">N</div>
          <span className="text-xl font-bold tracking-tight">NATAK <span className="text-zinc-500 font-normal">Ops</span></span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.Icon />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-800">
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Credits Left</span>
            <span className="text-xs text-emerald-500 font-bold underline">Add Funds</span>
          </div>
          <div className="text-lg font-bold text-white">$4,281.50</div>
          <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full w-2/3"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
