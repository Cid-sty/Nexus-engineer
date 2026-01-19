
import React from 'react';
import { NAV_ITEMS, APP_VERSION } from '../constants';
import { ViewType } from '../types';
import { LogOut, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-64 h-screen bg-[#0f0f11] border-r border-zinc-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">N</div>
          <h1 className="text-xl font-bold tracking-tight text-white">NEXUS<span className="text-indigo-500 text-sm ml-1 font-normal italic">ENG</span></h1>
        </div>
        
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                currentView === item.id 
                ? 'bg-zinc-800/50 text-indigo-400 border border-zinc-700/50' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Platform Status</span>
            <ShieldCheck size={12} className="text-emerald-500" />
          </div>
          <p className="text-xs font-mono text-zinc-400">{APP_VERSION}</p>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors w-full border-t border-zinc-800/50 pt-6">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
