
import React, { useEffect, useState } from 'react';
import { UserProfile, Achievement } from '../types';
import { getAIRecommendation } from '../geminiService';
import { Zap, Flame, Target, Star, ChevronRight, BrainCircuit, ExternalLink } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRec = async () => {
      const rec = await getAIRecommendation(user);
      setRecommendation(rec);
      setLoading(false);
    };
    loadRec();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h2>
          <p className="text-zinc-500 mt-1">{user.college} • {user.year}rd Year</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Streak</p>
              <p className="text-lg font-bold text-white">{user.streak} Days</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Points</p>
              <p className="text-lg font-bold text-white">{user.points}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Companion Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-950 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <BrainCircuit size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-indigo-500/20">AI Companion</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl font-medium text-zinc-200 leading-relaxed italic">
                    "{recommendation?.encouragement}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/50">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Next Milestone</p>
                      <p className="text-sm text-zinc-300">{recommendation?.nextSkill}</p>
                    </div>
                    <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/50">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Hackathon Focus</p>
                      <p className="text-sm text-zinc-300">{recommendation?.hackathonTheme}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2"><Target size={20} className="text-indigo-400" /> Active Goals</h3>
              <button className="text-xs text-indigo-400 hover:underline">Manage Goals</button>
            </div>
            <div className="space-y-4">
               {[
                 { label: "Daily DSA (Hard)", progress: 80, color: "bg-orange-500" },
                 { label: "Nexus Web Dev Squad Project", progress: 45, color: "bg-indigo-500" },
                 { label: "Internship Applications (5/10)", progress: 50, color: "bg-emerald-500" }
               ].map((goal, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300 font-medium">{goal.label}</span>
                      <span className="text-zinc-500">{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`${goal.color} h-full rounded-full`} style={{ width: `${goal.progress}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-500" /> Quick Tasks</h3>
            <div className="space-y-3">
              <button className="w-full text-left bg-zinc-950/50 hover:bg-zinc-800/50 p-3 rounded-xl border border-zinc-800/50 transition-all flex items-center justify-between group">
                <span className="text-sm text-zinc-300">Sync with Study Circle</span>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
              <button className="w-full text-left bg-zinc-950/50 hover:bg-zinc-800/50 p-3 rounded-xl border border-zinc-800/50 transition-all flex items-center justify-between group">
                <span className="text-sm text-zinc-300">Submit Daily Log</span>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-500/10 text-red-500 p-2 rounded-lg text-xs font-bold">2d</div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">Google STEP Internship</p>
                  <p className="text-xs text-zinc-500">Apply by Oct 24th</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/10 text-blue-500 p-2 rounded-lg text-xs font-bold">5d</div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">Smart India Hackathon</p>
                  <p className="text-xs text-zinc-500">Team registration closes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
