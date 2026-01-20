
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { suggestSquads } from '../geminiService';
import { Users, Filter, Sparkles, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface SquadBuilderProps {
  user: UserProfile;
}

const SquadBuilder: React.FC<SquadBuilderProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const recs = await suggestSquads(user);
      setRecommendations(recs);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Mindset Matching <Sparkles size={24} className="text-indigo-400" />
          </h2>
          <p className="text-zinc-500 mt-1">AI-suggested teammates based on commitment levels and technical synergy.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-900/50 border border-zinc-800 p-2 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all">
            Find Near Me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl h-64 animate-pulse"></div>
          ))
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-lg text-zinc-300">
                  {rec.name[0]}
                </div>
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded border border-indigo-500/20">
                  {rec.role}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{rec.name}</h4>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mb-4"><MapPin size={12} /> Tier 2 College • Ahmedabad</p>
              
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50 mb-6">
                <p className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Mindset Match
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed italic">{rec.matchingReason}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {rec.skills.map((skill: string) => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-[10px] text-zinc-400">
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full bg-zinc-800 group-hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Connect Profile
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-orange-500 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-orange-200">Accountability Threshold</h4>
          <p className="text-sm text-orange-200/70 mt-1">
            To maintain high-quality squads, Nexus uses a dynamic rebalancing algorithm. If activity drops below 70%, your squad will automatically be eligible for reshuffling to find more motivated peers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;
