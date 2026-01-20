
import React, { useState, useEffect } from 'react';
import { UserProfile, Squad, TeamMember } from '../types';
import { suggestSquads, rebalanceSquadMember, findNearbyPeers } from '../geminiService';
import { MOCK_SQUADS } from '../constants';
import { 
  Sparkles, ShieldAlert, RefreshCw, Users, UserPlus, 
  CheckCircle2, AlertTriangle, Zap, Terminal, BrainCircuit,
  MapPin, Radio, ShieldCheck, Search
} from 'lucide-react';

interface SquadBuilderProps {
  user: UserProfile;
}

const SquadBuilder: React.FC<SquadBuilderProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'build' | 'manage' | 'offline'>('build');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [nearbyPeers, setNearbyPeers] = useState<any[]>([]);
  const [mySquads, setMySquads] = useState<Squad[]>(MOCK_SQUADS);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [rebalancingId, setRebalancingId] = useState<string | null>(null);

  const startAutoBuild = async () => {
    setLoading(true);
    const recs = await suggestSquads(user);
    setRecommendations(recs);
    setLoading(false);
  };

  const startOfflineScan = () => {
    setScanning(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const peers = await findNearbyPeers(
          pos.coords.latitude, 
          pos.coords.longitude, 
          user.skills.map(s => s.name)
        );
        setNearbyPeers(peers);
        setScanning(false);
      }, () => {
        alert("Geolocation denied. Using default regional pool.");
        setScanning(false);
      });
    }
  };

  const handleRebalance = async (squadId: string) => {
    setRebalancingId(squadId);
    const squad = mySquads.find(s => s.id === squadId);
    if (!squad) return;

    const lowestMember = [...squad.members].sort((a, b) => a.activityScore - b.activityScore)[0];
    const replacement = await rebalanceSquadMember(squad.name, lowestMember.role);
    
    if (replacement) {
      setTimeout(() => {
        setMySquads(prev => prev.map(s => {
          if (s.id === squadId) {
            const newMembers = s.members.map(m => m.id === lowestMember.id ? { ...replacement, id: Math.random().toString() } : m);
            return { ...s, members: newMembers, isHealthy: true, activityLevel: 96 };
          }
          return s;
        }));
        setRebalancingId(null);
      }, 2000);
    } else {
      setRebalancingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Squad Operations <Zap className="text-indigo-400" />
          </h2>
          <p className="text-zinc-500 mt-1">Autonomous formation, active rebalancing, and local bridges.</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
          {[
            { id: 'build', label: 'Auto-Builder', icon: <Sparkles size={14} /> },
            { id: 'manage', label: 'Manage', icon: <Terminal size={14} /> },
            { id: 'offline', label: 'Offline Bridge', icon: <MapPin size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'build' && (
        <div className="space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Team Synthesis Engine</h3>
                  <p className="text-sm text-zinc-400 max-w-md">Forms a balanced 4-pillar team (Logic, UI, UX, Vision) based on your technical gaps.</p>
                </div>
                <button 
                  onClick={startAutoBuild}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <BrainCircuit size={20} />}
                  {recommendations.length > 0 ? 'Recalibrate Synergy' : 'Initialize Squad Build'}
                </button>
             </div>
             {loading && <div className="scan-line top-0"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-900/20 rounded-2xl animate-pulse border border-zinc-800" />)
            ) : recommendations.map((rec, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group relative">
                <div className="absolute top-4 right-4 text-emerald-500/40"><ShieldCheck size={20} /></div>
                <div className="p-2 w-fit bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase mb-4">
                  {rec.role}
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{rec.name}</h4>
                <p className="text-xs text-zinc-500 mb-6 flex items-center gap-1"><MapPin size={12} /> {rec.location}</p>
                <div className="bg-zinc-950/60 p-4 rounded-xl mb-6 border border-zinc-800/50">
                   <p className="text-[10px] text-indigo-400 font-bold uppercase mb-2">Mindset Synergy</p>
                   <p className="text-xs text-zinc-400 italic leading-relaxed">"{rec.matchingReason}"</p>
                </div>
                <button className="w-full py-3 bg-zinc-800 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                  <UserPlus size={14} /> Send Nexus Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-6">
          {mySquads.map((squad) => (
            <div key={squad.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
              <div className="p-6 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-800 bg-zinc-950/20">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${squad.isHealthy ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-orange-500 animate-pulse'}`}></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{squad.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{squad.type} • Target: {squad.goal}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRebalance(squad.id)}
                  disabled={rebalancingId === squad.id}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    squad.isHealthy 
                    ? 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed' 
                    : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  }`}
                >
                  {rebalancingId === squad.id ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                  {squad.isHealthy ? 'System Balanced' : 'Invoke Rebalance'}
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {squad.members.map((m) => (
                  <div key={m.id} className="p-5 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900 transition-all">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                         {m.name[0]}
                       </div>
                       <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${m.activityScore > 80 ? 'text-emerald-400 border-emerald-500/20' : 'text-orange-400 border-orange-500/20'}`}>
                         {m.activityScore}%
                       </div>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{m.name}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'offline' && (
        <div className="space-y-8">
          <div className="bg-indigo-900/10 border border-indigo-500/20 p-8 rounded-3xl text-center relative overflow-hidden group">
            <div className="relative z-10">
              <Radio className={`mx-auto mb-4 ${scanning ? 'text-indigo-400 animate-ping' : 'text-indigo-600'}`} size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">Offline Bridge Scanner</h3>
              <p className="text-zinc-400 max-w-md mx-auto mb-8">Locating high-performing engineers nearby for focused study meetups and deep-work sessions.</p>
              <button 
                onClick={startOfflineScan}
                disabled={scanning}
                className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 mx-auto"
              >
                {scanning ? <RefreshCw className="animate-spin" /> : <Search size={18} />}
                Scan Radius (5km)
              </button>
            </div>
            {scanning && <div className="scan-line top-0"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyPeers.map((peer, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:bg-zinc-900 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{peer.name}</h4>
                    <p className="text-xs text-zinc-500">{peer.role} • {peer.distance} away</p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Mindset: {peer.seriousnessScore}%</span>
                       <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                       <span className="text-[10px] text-zinc-600">Active {peer.lastActive}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 p-3 rounded-xl transition-all">
                  <UserPlus size={20} />
                </button>
              </div>
            ))}
            {nearbyPeers.length === 0 && !scanning && (
              <div className="col-span-full py-12 text-center text-zinc-600 italic">
                Initialize scan to bridge the digital-physical gap.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logic Note */}
      <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <ShieldAlert className="text-indigo-400" size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Dynamic Engagement Guard</h4>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            The Nexus monitors "Squad Health" using real-time activity metrics. If your individual consistency drops below the 70% threshold, 
            your current squad matches will be flagged for rebalancing. High-performing students (90%+) are prioritized for the **Offline Bridge**.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;
