
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewType } from '../types';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-64 h-screen bg-[#0f0f11] border-r border-zinc-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">N</div>
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

      <div className="mt-auto p-6 border-t border-zinc-800/50">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors w-full">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
