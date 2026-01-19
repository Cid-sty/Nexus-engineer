
import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Star, GraduationCap, Microscope, BookOpen, Clock, ChevronRight } from 'lucide-react';

interface RewardsHubProps {
  user: UserProfile;
}

const RewardsHub: React.FC<RewardsHubProps> = ({ user }) => {
  const rewards = [
    {
      id: 'r1',
      title: 'Tier-1 Professor Consultation',
      description: '1:1 session for research guidance or roadmap validation.',
      points: 2500,
      icon: <GraduationCap size={24} className="text-blue-400" />,
      tag: 'Academic'
    },
    {
      id: 'r2',
      title: 'Research Paper Collaboration',
      description: 'Opportunity to co-author a paper with specialized faculty.',
      points: 5000,
      icon: <Microscope size={24} className="text-purple-400" />,
      tag: 'Prestige'
    },
    {
      id: 'r3',
      title: 'Elite Hackathon Pass',
      description: 'Waived application fees for top-tier global hackathons.',
      points: 1500,
      icon: <Trophy size={24} className="text-orange-400" />,
      tag: 'Event'
    },
    {
      id: 'r4',
      title: 'Curated Resource Kit',
      description: 'Access to premium technical documentation and courses.',
      points: 800,
      icon: <BookOpen size={24} className="text-emerald-400" />,
      tag: 'Learning'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Trophy size={200} />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl font-bold text-white mb-2">Rewards Hub</h2>
          <p className="text-zinc-400 max-w-md">Your discipline earns you access to world-class guidance. Redeem your consistency for growth.</p>
        </div>
        <div className="relative z-10 flex flex-col items-center bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800/50 min-w-[200px]">
          <Star className="text-yellow-500 mb-2 animate-pulse" size={32} />
          <p className="text-3xl font-bold text-white">{user.points}</p>
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Available Points</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-800/50 rounded-xl">
                  {reward.icon}
                </div>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-800/30 px-2 py-1 rounded uppercase tracking-wider">
                  {reward.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{reward.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-zinc-600" />
                <span className="text-xs text-zinc-600">Points needed:</span>
                <span className={`text-sm font-bold ${user.points >= reward.points ? 'text-indigo-400' : 'text-zinc-600'}`}>
                  {reward.points}
                </span>
              </div>
              <button 
                disabled={user.points < reward.points}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  user.points >= reward.points 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                Redeem <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsHub;
