
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AICompanion from './components/AICompanion';
import SquadBuilder from './components/SquadBuilder';
import RewardsHub from './components/RewardsHub';
import { INITIAL_USER } from './constants';
import { ViewType } from './types';
import { Search, Bell, Settings, TrendingUp, BookCheck, ShieldCheck } from 'lucide-react';

const LearningPathPlaceholder = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">Learning Path <BookCheck className="text-indigo-400" /></h2>
      <span className="text-zinc-500 text-sm">Target: Senior Engineer Role</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Core Fundamentals', 'Project Specialization', 'System Design'].map((stage, i) => (
        <div key={stage} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Stage 0{i+1}</div>
          <h3 className="text-lg font-bold text-white mb-4">{stage}</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-zinc-400">
                <ShieldCheck size={14} className={i === 0 ? "text-green-500" : "text-zinc-700"} />
                <span>Advanced Module {item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
     <h2 className="text-3xl font-bold text-white flex items-center gap-3">Growth Analytics <TrendingUp className="text-indigo-400" /></h2>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl h-80 flex items-center justify-center">
          <p className="text-zinc-500 italic">Consistency Heatmap Visualizer Rendering...</p>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl h-80 flex items-center justify-center">
          <p className="text-zinc-500 italic">Skill Distribution Radar Chart Rendering...</p>
        </div>
     </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewType>('dashboard');
  const [user] = useState(INITIAL_USER);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'ai-companion':
        return <AICompanion user={user} />;
      case 'squads':
        return <SquadBuilder user={user} />;
      case 'rewards':
        return <RewardsHub user={user} />;
      case 'learning':
        return <LearningPathPlaceholder />;
      case 'analytics':
        return <AnalyticsPlaceholder />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-zinc-500 space-y-4">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <Settings size={32} className="animate-spin-slow" />
            </div>
            <p className="text-lg font-medium italic">Building this module in the Nexus...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-200">
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="ml-64 p-8">
        <header className="flex items-center justify-between mb-12 sticky top-0 bg-[#0a0a0b]/80 backdrop-blur-md z-40 py-4 -mt-4 border-b border-zinc-800/50">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search hackathons, peers, or technologies..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-8">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0a0a0b]"></span>
            </button>
            <div className="h-8 w-[1px] bg-zinc-800"></div>
            <div className="flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-zinc-800">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-zinc-500">Non-elite College Student</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default App;
