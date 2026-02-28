
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
    <aside className="w-64 h-screen bg-bg-secondary/80 backdrop-blur-xl border-r border-border-primary/20 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-accent/20 rotate-3">
            <Zap size={22} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-text-primary leading-none">NEXUS</h1>
            <span className="text-[10px] font-black text-accent tracking-[0.3em] uppercase opacity-70">Engineer</span>
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
                  ? 'bg-accent/10 text-text-primary border border-accent/20 shadow-inner' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-accent/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary'} transition-colors`}>
                    {item.icon}
                  </div>
                  {item.label}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-color)]"></div>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="glass p-4 rounded-2xl border border-border-primary">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Growth Plan</p>
            <span className="text-[10px] font-bold text-accent">PRO</span>
          </div>
          <p className="text-xs text-text-primary font-bold">Tier-1 Roadmap Active</p>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-secondary hover:text-red-400 transition-colors w-full group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
