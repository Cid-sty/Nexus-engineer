import React, { useState, useEffect } from 'react';
import { UserProfile, Squad, TeamMember } from '../types';
import { suggestSquads, rebalanceSquadMember, findNearbyPeers } from '../geminiService';
import { MOCK_SQUADS } from '../constants';
import { 
  Sparkles, ShieldAlert, RefreshCw, Users, UserPlus, 
  CheckCircle2, AlertTriangle, Zap, Terminal, BrainCircuit,
  MapPin, Radio, ShieldCheck, Search, Loader2
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
    try {
      const recs = await suggestSquads(user);
      setRecommendations(recs);
    } catch (err) {
      console.error("Squad build failed", err);
    } finally {
      setLoading(false);
    }
  };

  const startOfflineScan = () => {
    setScanning(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const peers = await findNearbyPeers(
              pos.coords.latitude, 
              pos.coords.longitude, 
              user.skills.map(s => s.name)
            );
            setNearbyPeers(peers);
          } catch (err) {
            console.error("Peer discovery failed", err);
          } finally {
            setScanning(false);
          }
        }, 
        (err) => {
          console.warn("Geolocation denied or error:", err);
          alert("Geolocation denied. Using generalized regional matching.");
          setScanning(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setScanning(false);
    }
  };

  const handleRebalance = async (squadId: string) => {
    setRebalancingId(squadId);
    const squad = mySquads.find(s => s.id === squadId);
    if (!squad) return;

    const lowestMember = [...squad.members].sort((a, b) => a.activityScore - b.activityScore)[0];
    try {
      const replacement = await rebalanceSquadMember(squad.name, lowestMember.role);
      if (replacement) {
        setMySquads(prev => prev.map(s => {
          if (s.id === squadId) {
            const newMembers = s.members.map(m => m.id === lowestMember.id ? { ...replacement, id: `replaced-${Date.now()}` } : m);
            return { ...s, members: newMembers, isHealthy: true, activityLevel: 96 };
          }
          return s;
        }));
      }
    } catch (err) {
      console.error("Rebalance failed", err);
    } finally {
      setRebalancingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            SQUAD OPERATIONS <Zap className="text-indigo-400 fill-indigo-400/20" size={24} />
          </h2>
          <p className="text-zinc-500 mt-1 font-medium">Autonomous formation, active rebalancing, and local bridges.</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
          {[
            { id: 'build', label: 'Auto-Builder', icon: <Sparkles size={14} /> },
            { id: 'manage', label: 'Manage', icon: <Terminal size={14} /> },
            { id: 'offline', label: 'Offline Bridge', icon: <MapPin size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-zinc-500 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'build' && (
        <div className="space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] group-hover:bg-indigo-600/10 transition-all duration-1000"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Team Synthesis Engine</h3>
                  <p className="text-sm text-zinc-500 max-w-md leading-relaxed font-medium">Forms a balanced 4-pillar team (Logic, UI, UX, Vision) based on your technical gaps and mindset score.</p>
                </div>
                <button 
                  onClick={startAutoBuild}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50 transform hover:-translate-y-1"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
                  {recommendations.length > 0 ? 'Recalibrate Synergy' : 'Initialize Squad Build'}
                </button>
             </div>
             {loading && <div className="scan-line top-0"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-72 bg-zinc-900/20 rounded-[2rem] animate-pulse border border-zinc-800" />)
            ) : recommendations.map((rec, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group relative animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute top-6 right-6 text-emerald-500/40"><ShieldCheck size={24} /></div>
                <div className="p-2.5 w-fit bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  {rec.role}
                </div>
                <h4 className="text-2xl font-black text-white mb-1 tracking-tight">{rec.name}</h4>
                <p className="text-xs text-zinc-500 mb-8 flex items-center gap-1.5 font-bold"><MapPin size={12} className="text-indigo-500" /> {rec.location}</p>
                <div className="bg-zinc-950/60 p-5 rounded-2xl mb-8 border border-zinc-800/50 shadow-inner">
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Synergy Logic</p>
                   <p className="text-sm text-zinc-400 italic leading-relaxed font-medium">"{rec.matchingReason}"</p>
                </div>
                <button className="w-full py-4 bg-zinc-800 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-xl">
                  <UserPlus size={16} /> Send Nexus Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-8">
          {mySquads.map((squad) => (
            <div key={squad.id} className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-zinc-700 transition-colors shadow-xl">
              <div className="p-8 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-800 bg-zinc-950/40">
                <div className="flex items-center gap-6">
                  <div className={`w-4 h-4 rounded-full ${squad.isHealthy ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-orange-500 animate-pulse'}`}></div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{squad.name}</h3>
                    <p className="text-xs text-zinc-500 font-black tracking-[0.2em] uppercase mt-1">{squad.type} • Goal: {squad.goal}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRebalance(squad.id)}
                  disabled={rebalancingId === squad.id}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    squad.isHealthy 
                    ? 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-50' 
                    : 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 hover:scale-105'
                  }`}
                >
                  {rebalancingId === squad.id ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                  {squad.isHealthy ? 'Operational' : 'Invoke Rebalance'}
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                {squad.members.map((m) => (
                  <div key={m.id} className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl hover:bg-zinc-800 transition-all group">
                    <div className="flex items-center justify-between mb-5">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         {m.name[0]}
                       </div>
                       <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${m.activityScore > 80 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-orange-400 border-orange-500/20 bg-orange-500/5'}`}>
                         {m.activityScore}%
                       </div>
                    </div>
                    <p className="text-lg font-black text-white mb-1">{m.name}</p>
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
          <div className="bg-indigo-900/10 border border-indigo-500/20 p-12 rounded-[3rem] text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
            <div className="relative z-10">
              <Radio className={`mx-auto mb-6 ${scanning ? 'text-indigo-400 animate-pulse' : 'text-indigo-600'}`} size={64} />
              <h3 className="text-3xl font-black text-white mb-3">Offline Bridge Scanner</h3>
              <p className="text-zinc-400 max-w-lg mx-auto mb-10 font-medium leading-relaxed">Locating serious engineering students within 5km for peer-mentorship and deep-work sessions.</p>
              <button 
                onClick={startOfflineScan}
                disabled={scanning}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-indigo-500/20 transform hover:scale-105"
              >
                {scanning ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                SCAN RADIUS
              </button>
            </div>
            {scanning && <div className="scan-line top-0"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyPeers.map((peer, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-zinc-900 transition-all animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">{peer.name}</h4>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{peer.role} • {peer.distance} away</p>
                    <div className="mt-3 flex items-center gap-3">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Mindset: {peer.seriousnessScore}%</span>
                       <span className="text-[10px] text-zinc-600 font-bold">Active {peer.lastActive}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 p-4 rounded-2xl transition-all shadow-inner">
                  <UserPlus size={24} />
                </button>
              </div>
            ))}
            {nearbyPeers.length === 0 && !scanning && (
              <div className="col-span-full py-16 text-center text-zinc-600 italic font-medium bg-zinc-950/20 border-2 border-dashed border-zinc-800 rounded-[2.5rem]">
                "The physical world is offline. Initialize scan to bridge the gap."
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logic Note */}
      <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2rem] flex items-start gap-6 border-l-4 border-l-indigo-600">
        <div className="p-3 bg-indigo-500/10 rounded-2xl shadow-inner">
          <ShieldAlert className="text-indigo-400" size={24} />
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">Dynamic Engagement Guard</h4>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed font-medium max-w-4xl">
            Nexus monitors Squad Health via real-time telemetry. If consistency drops below 70%, squads are flagged for rebalancing. 
            High-performers (90%+) receive priority for Elite Peer discovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;