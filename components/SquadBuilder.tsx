import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { suggestSquads } from '../geminiService';
import { Filter, Sparkles, MapPin, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface SquadBuilderProps {
  user: UserProfile;
}

const SquadBuilder: React.FC<SquadBuilderProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const recs = await suggestSquads(user);
        if (mounted) {
          setRecommendations(recs);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [user]);

  const handleConnect = (id: number) => {
    setConnectingId(id);
    setTimeout(() => {
      setConnectingId(null);
      // Logic for adding to "Pending" list could go here
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Mindset Matching <Sparkles size={24} className="text-indigo-400" />
          </h2>
          <p className="text-zinc-500 mt-1">AI-suggested teammates based on commitment levels and technical synergy.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-900/50 border border-zinc-800 p-2.5 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Users size={18} /> Find Near Me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-8 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl"></div>
                <div className="w-20 h-6 bg-zinc-800 rounded"></div>
              </div>
              <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-20 bg-zinc-800 rounded-xl"></div>
              <div className="h-10 bg-zinc-800 rounded-xl"></div>
            </div>
          ))
        ) : recommendations.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
             <AlertCircle size={48} className="mx-auto text-zinc-700 mb-4" />
             <p className="text-zinc-500 font-medium">The Nexus is currently calibrating profiles.<br/>Check back in a few moments.</p>
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                  {rec.name[0]}
                </div>
                <div className="flex flex-col items-end">
                   <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded border border-indigo-500/20 mb-1">
                    {rec.role}
                  </span>
                  <div className="flex items-center gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                     <span className="text-[10px] text-zinc-500">Active now</span>
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{rec.name}</h4>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mb-4">
                <MapPin size={12} /> Non-elite College • {rec.location || 'Tier-2 City'}
              </p>
              
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/50 mb-6 group-hover:bg-zinc-950 transition-colors">
                <p className="text-[10px] font-bold text-indigo-400 mb-2 flex items-center gap-1 uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Synergy Analysis
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed italic">"{rec.matchingReason}"</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {rec.skills.map((skill: string) => (
                  <span key={skill} className="px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-[10px] text-zinc-400 group-hover:border-zinc-600 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => handleConnect(idx)}
                disabled={connectingId === idx}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                  connectingId === idx 
                  ? 'bg-zinc-800 text-zinc-500' 
                  : 'bg-zinc-800 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                {connectingId === idx ? 'Requesting...' : 'Request Connection'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <AlertCircle size={24} className="text-orange-500" />
        </div>
        <div>
          <h4 className="font-bold text-orange-200">Accountability Rebalancing</h4>
          <p className="text-sm text-orange-200/70 mt-1 leading-relaxed">
            Nexus monitors squad commitment metrics. If your individual consistency drops below the 70% threshold, your current squad matches will be suspended until discipline is restored. Use Growth Analytics to track your standing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;