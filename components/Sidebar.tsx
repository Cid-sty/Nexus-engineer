
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewType } from '../types';
import { LogOut, ChevronRight, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-64 h-screen bg-[#0a0a0b]/80 backdrop-blur-xl border-r border-white/[0.04] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/20 rotate-3">
            <Zap size={22} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">NEXUS</h1>
            <span className="text-[10px] font-black text-indigo-500 tracking-[0.3em] uppercase opacity-70">Engineer</span>
          </div>
        </div>
        
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                  isActive 
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-inner' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`}>
                    {item.icon}
                  </div>
                  {item.label}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]"></div>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="glass p-4 rounded-2xl border border-white/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Growth Plan</p>
            <span className="text-[10px] font-bold text-indigo-400">PRO</span>
          </div>
          <p className="text-xs text-zinc-300 font-bold">Tier-1 Roadmap Active</p>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors w-full group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
