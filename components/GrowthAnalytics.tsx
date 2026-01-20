import React from 'react';
import { TrendingUp, Award, Calendar, BarChart, ChevronUp } from 'lucide-react';
import { UserProfile } from '../types';

interface AnalyticsProps {
  user: UserProfile;
}

const GrowthAnalytics: React.FC<AnalyticsProps> = ({ user }) => {
  // Mock data for the heatmap
  const days = Array.from({ length: 140 }, (_, i) => Math.floor(Math.random() * 4));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Growth Analytics <TrendingUp className="text-indigo-400" />
          </h2>
          <p className="text-zinc-500 mt-1">Quantifying your evolution from Tier-2 student to Tier-1 engineer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consistency Heatmap */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Calendar size={16} /> Consistency Matrix (Last 20 Weeks)
            </h3>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(v => (
                <div key={v} className={`w-3 h-3 rounded-sm ${v === 0 ? 'bg-zinc-800' : v === 1 ? 'bg-indigo-900' : v === 2 ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
              ))}
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2">
            {days.map((val, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-sm transition-colors duration-500 ${
                  val === 0 ? 'bg-zinc-800/50' : 
                  val === 1 ? 'bg-indigo-900/60' : 
                  val === 2 ? 'bg-indigo-600/80' : 
                  'bg-indigo-400'
                }`}
                title={`Level ${val} activity`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
            <span>Jan 2024</span>
            <span>Current Progress: 84% Consistency</span>
            <span>Jun 2024</span>
          </div>
        </div>

        {/* Skill Velocity */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-6">
            <BarChart size={16} /> Skill Velocity
          </h3>
          <div className="space-y-5">
            {user.skills.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{skill.name}</span>
                  <span className="text-indigo-400 flex items-center gap-1 font-bold">
                    <ChevronUp size={12} /> +{Math.floor(Math.random() * 15) + 5}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 transition-colors">
            Generate Full Skill Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Study Hours', value: '6.4h', trend: '+12%', sub: 'vs last week' },
          { label: 'Problems Solved', value: '342', trend: '+45', sub: 'this month' },
          { label: 'PRs Merged', value: '18', trend: 'Top 5%', sub: 'in college' },
          { label: 'Mindset Score', value: '94/100', trend: 'Elite', sub: 'Nexus Certified' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthAnalytics;