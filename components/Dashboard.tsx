
import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { getAIRecommendation } from '../geminiService';
import { 
  Zap, Flame, Target, Star, ChevronRight, BrainCircuit, 
  Rocket, ShieldCheck, MapPin, Activity, Award, 
  TrendingUp, Clock
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadRec = async () => {
      try {
        const rec = await getAIRecommendation(user);
        if (mounted) {
          setRecommendation(rec);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    loadRec();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
            Welcome Back, <span className="text-indigo-500">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-zinc-500 mt-2 font-medium flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Active Session: Gandhinagar Edge Node
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 border-l-2 border-l-orange-500/50">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Growth Streak</p>
              <p className="text-lg font-bold text-white leading-none">{user.streak} Days</p>
            </div>
          </div>
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 border-l-2 border-l-yellow-500/50">
            <Star className="text-yellow-500" size={20} />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Nexus Rank</p>
              <p className="text-lg font-bold text-white leading-none">#{Math.floor(user.points / 100)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Main AI Agent Card */}
        <div className="md:col-span-6 lg:col-span-8 glass rounded-[2.5rem] p-8 relative overflow-hidden group border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500">
          <div className="absolute -right-16 -top-16 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
             <BrainCircuit size={240} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-indigo-500/20">
                Nexus Intelligence v3.1
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Synchornized
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4 animate-pulse py-4">
                <div className="h-8 bg-zinc-800/50 rounded-xl w-3/4"></div>
                <div className="h-4 bg-zinc-800/50 rounded-xl w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-2xl font-bold text-white leading-tight italic tracking-tight">
                  "{recommendation?.encouragement}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-950/40 p-5 rounded-3xl border border-zinc-800/50 group-hover:bg-zinc-950/60 transition-colors">
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp size={12} /> Priority Learning
                    </p>
                    <p className="text-sm text-zinc-200 font-bold">{recommendation?.nextSkill}</p>
                  </div>
                  <div className="bg-zinc-950/40 p-5 rounded-3xl border border-zinc-800/50 group-hover:bg-zinc-950/60 transition-colors">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Award size={12} /> Target Context
                    </p>
                    <p className="text-sm text-zinc-200 font-bold">{recommendation?.hackathonTheme}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors group/btn pt-2">
              Access Full Blueprint <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 flex-1 border border-zinc-800/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" /> System Metrics
            </h3>
            <div className="space-y-5">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-zinc-400 font-medium">Weekly Focus</span>
                 <span className="text-sm font-bold text-white">24.5 / 25h</span>
               </div>
               <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '98%' }}></div>
               </div>
               <div className="flex justify-between items-center pt-2">
                 <span className="text-xs text-zinc-400 font-medium">Skill Velocity</span>
                 <span className="text-sm font-bold text-emerald-500">+12%</span>
               </div>
            </div>
          </div>
          
          <div className="glass rounded-[2rem] p-6 border border-zinc-800/50 group cursor-pointer hover:bg-zinc-800/20 transition-all">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Active Goals</h3>
               <button className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-indigo-600 transition-colors">
                 <ChevronRight size={14} className="text-white" />
               </button>
             </div>
             <div className="space-y-1">
               <p className="text-sm font-bold text-zinc-200">System Design (Medium)</p>
               <p className="text-[10px] text-zinc-500 font-medium">8/10 modules completed</p>
             </div>
          </div>
        </div>

        {/* Pillars Section - Full Width on Mobile, Grid on Desktop */}
        <div className="md:col-span-6 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Rocket />, color: 'text-indigo-400', label: 'Industrial Roadmaps', desc: 'Production-ready tech stacks only.' },
            { icon: <Award />, color: 'text-emerald-400', label: 'Merit Signaling', desc: 'Prove skills beyond college name.' },
            { icon: <Zap />, color: 'text-orange-400', label: 'Squad Synergy', desc: 'Find your high-performance peers.' },
            { icon: <MapPin />, color: 'text-blue-400', label: 'Offline Bridge', desc: 'Physical deep-work networking.' }
          ].map((pillar, i) => (
            <div key={i} className="glass rounded-3xl p-6 border border-zinc-800/50 hover:bg-zinc-800/30 transition-all hover:-translate-y-1 duration-300">
               <div className={`p-3 rounded-2xl bg-zinc-950/50 ${pillar.color} w-fit mb-4 border border-white/5`}>
                 {React.cloneElement(pillar.icon as React.ReactElement, { size: 20 })}
               </div>
               <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{pillar.label}</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity / Deadlines Ticker */}
        <div className="md:col-span-6 lg:col-span-12 glass rounded-[2rem] p-6 border border-zinc-800/50 overflow-hidden relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap bg-zinc-950/80 px-4 py-2 rounded-xl border border-zinc-800/50">
               <Activity size={14} className="text-indigo-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Network Pulse</span>
            </div>
            <div className="flex-1 overflow-hidden">
               <div className="flex gap-12 animate-marquee whitespace-nowrap text-xs font-medium text-zinc-500">
                 <span className="flex items-center gap-2">• <span className="text-zinc-300">@Saurabh</span> just merged a PR in Nexus Core</span>
                 <span className="flex items-center gap-2">• <span className="text-zinc-300">Google STEP</span> applications close in 2 days</span>
                 <span className="flex items-center gap-2">• <span className="text-zinc-300">Gandhinagar Squad</span> hosting a physical deep-work session tomorrow</span>
                 <span className="flex items-center gap-2">• <span className="text-zinc-300">@Ananya</span> earned "Code Warrior" badge</span>
               </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
          width: 200%;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
