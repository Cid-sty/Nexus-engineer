import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AICompanion from './components/AICompanion';
import SquadBuilder from './components/SquadBuilder';
import RewardsHub from './components/RewardsHub';
import GrowthAnalytics from './components/GrowthAnalytics';
import LearningPath from './components/LearningPath';
import { INITIAL_USER, REWARD_ACTIVITIES } from './constants';
import { ViewType, UserProfile } from './types';
import { Search, Bell, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const renderView = () => {
    const viewContent = (() => {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard user={user} onUpdateUser={handleUpdateUser} />;
        case 'ai-companion':
          return <AICompanion user={user} />;
        case 'squads':
          return <SquadBuilder user={user} />;
        case 'rewards':
          return <RewardsHub user={user} onUpdateUser={handleUpdateUser} />;
        case 'learning':
          return <LearningPath user={user} />;
        case 'analytics':
          return <GrowthAnalytics user={user} />;
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
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewContent}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 relative overflow-x-hidden">
      <div className="bg-glow"></div>
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8">
          <header className="flex items-center justify-between sticky top-0 bg-bg-primary/80 backdrop-blur-md z-40 py-6 border-b border-border-primary/20">
            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search hackathons, peers, or technologies..." 
                  className="w-full bg-bg-secondary border border-border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6 ml-8">
              <button 
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-accent transition-colors rounded-lg bg-bg-secondary border border-border-primary"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="relative p-2 text-text-secondary hover:text-accent transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-bg-primary"></span>
              </button>
              <div className="h-8 w-[1px] bg-border-primary"></div>
              <div className="flex items-center gap-3 bg-bg-secondary px-3 py-1.5 rounded-xl border border-border-primary">
                <div className="text-right">
                  <p className="text-xs font-bold">{user.name}</p>
                  <p className="text-[10px] text-text-secondary">Tier-2 Growth Focus</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
              </div>
            </div>
          </header>

          <div className="py-12">
            {renderView()}
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;