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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            Growth Analytics <TrendingUp className="text-accent" />
          </h2>
          <p className="text-text-secondary mt-1">Quantifying your evolution from Tier-2 student to Tier-1 engineer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consistency Heatmap */}
        <div className="lg:col-span-2 bg-bg-secondary/40 border border-border-primary rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Calendar size={16} /> Consistency Matrix (Last 20 Weeks)
            </h3>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(v => (
                <div key={v} className={`w-3 h-3 rounded-sm ${v === 0 ? 'bg-bg-primary' : v === 1 ? 'bg-accent/30' : v === 2 ? 'bg-accent/60' : 'bg-accent'}`}></div>
              ))}
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2">
            {days.map((val, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-sm transition-colors duration-500 ${
                  val === 0 ? 'bg-bg-primary/50' : 
                  val === 1 ? 'bg-accent/30' : 
                  val === 2 ? 'bg-accent/60' : 
                  'bg-accent'
                }`}
                title={`Level ${val} activity`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-text-secondary/50 font-bold uppercase tracking-wider">
            <span>Jan 2024</span>
            <span>Current Progress: 84% Consistency</span>
            <span>Jun 2024</span>
          </div>
        </div>

        {/* Skill Velocity */}
        <div className="bg-bg-secondary/40 border border-border-primary rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2 mb-6">
            <BarChart size={16} /> Skill Velocity
          </h3>
          <div className="space-y-5">
            {user.skills.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-medium">{skill.name}</span>
                  <span className="text-accent flex items-center gap-1 font-bold">
                    <ChevronUp size={12} /> +{Math.floor(Math.random() * 15) + 5}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-border-primary rounded-xl text-xs font-bold text-text-secondary hover:bg-bg-secondary transition-colors">
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
          <div key={i} className="bg-bg-secondary/30 border border-border-primary p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">{stat.value}</span>
              <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
            </div>
            <p className="text-[10px] text-text-secondary/50 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthAnalytics;