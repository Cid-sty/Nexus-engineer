
import React, { useState, useEffect } from 'react';
import { UserProfile, Squad, TeamMember } from '../types';
import { suggestSquads, rebalanceSquadMember, findNearbyPeers } from '../geminiService';
import { MOCK_SQUADS } from '../constants';
import { 
  Sparkles, ShieldAlert, RefreshCw, Users, UserPlus, 
  CheckCircle2, AlertTriangle, Zap, Terminal, BrainCircuit,
  MapPin, Radio, ShieldCheck, Search, Loader2, Radar, Crosshair
} from 'lucide-react';

interface SquadBuilderProps { user: UserProfile; }

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
    } catch (err) { console.error("Squad build failed", err); }
    finally { setLoading(false); }
  };

  const startOfflineScan = () => {
    setScanning(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const peers = await findNearbyPeers(pos.coords.latitude, pos.coords.longitude, user.skills.map(s => s.name));
            setNearbyPeers(peers);
          } catch (err) { console.error("Peer discovery failed", err); }
          finally { setScanning(false); }
        }, 
        (err) => {
          alert("Geolocation denied. Using generalized regional matching.");
          setScanning(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
            SQUAD OPS <Zap className="text-indigo-400 fill-indigo-400" size={28} />
          </h2>
          <p className="text-zinc-500 mt-2 font-medium">Autonomous formation, active rebalancing, and local bridge discovery.</p>
        </div>
        <div className="flex glass p-1.5 rounded-[1.5rem] border border-white/[0.05] shadow-2xl">
          {[
            { id: 'build', label: 'Synthesis', icon: <BrainCircuit size={14} /> },
            { id: 'manage', label: 'Fleet', icon: <Terminal size={14} /> },
            { id: 'offline', label: 'Bridges', icon: <Radar size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-[0.2em] ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 translate-y-[-2px]' : 'text-zinc-500 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'build' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="glass rounded-[3rem] p-10 relative overflow-hidden group border border-indigo-500/10">
             <div className="absolute -right-32 -top-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Team Synthesis Engine</h3>
                  <p className="text-zinc-400 max-w-lg leading-relaxed font-medium">Analyzing mindset vectors and technical proficiency gaps to synthesize an elite 4-pillar squad.</p>
                </div>
                <button 
                  onClick={startAutoBuild}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={22} />}
                  {recommendations.length > 0 ? 'Recalibrate Synergy' : 'Initialize Synthesis'}
                </button>
             </div>
             {loading && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <div key={i} className="glass rounded-[2.5rem] p-8 hover:border-indigo-500/40 transition-all group relative border border-white/[0.03] animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute top-8 right-8 text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                <div className="px-3 py-1.5 w-fit bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  {rec.role}
                </div>
                <h4 className="text-2xl font-black text-white mb-1 tracking-tighter">{rec.name}</h4>
                <p className="text-xs text-zinc-500 mb-8 flex items-center gap-1.5 font-bold italic"><MapPin size={12} className="text-indigo-500" /> {rec.location}</p>
                <div className="bg-zinc-950/40 p-5 rounded-2xl mb-8 border border-white/[0.03] italic text-zinc-400 text-sm leading-relaxed">
                  "{rec.matchingReason}"
                </div>
                <button className="w-full py-4 bg-zinc-800 hover:bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl">
                  <UserPlus size={16} /> Send Nexus Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'offline' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="relative glass rounded-[3.5rem] p-20 text-center overflow-hidden border border-white/[0.03]">
            <div className="absolute inset-0 blueprint-grid opacity-20"></div>
            <div className="relative z-10">
              <div className="relative w-48 h-48 mx-auto mb-10">
                <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/20 ${scanning ? 'animate-ping' : ''}`}></div>
                <div className={`absolute inset-0 rounded-full border-t-2 border-indigo-500 ${scanning ? 'animate-spin-radar' : 'opacity-20'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radar size={64} className={`${scanning ? 'text-indigo-400' : 'text-zinc-700'}`} />
                </div>
                {scanning && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,1)]"></div>}
              </div>
              
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Physical Bridge Scanner</h3>
              <p className="text-zinc-500 max-w-lg mx-auto mb-12 font-medium leading-relaxed">Pinging local edge nodes to discover elite engineering peers within your 5km physical radius.</p>
              
              <button 
                onClick={startOfflineScan}
                disabled={scanning}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4 mx-auto shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {scanning ? <Loader2 className="animate-spin" /> : <Crosshair size={22} />}
                SCAN RADIUS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyPeers.map((peer, i) => (
              <div key={i} className="glass rounded-[2rem] p-8 flex items-center justify-between group hover:bg-white/[0.02] border border-white/[0.03] transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Users className="text-indigo-400" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tighter">{peer.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1 italic">{peer.role} • {peer.distance} away</p>
                    <div className="mt-4 flex items-center gap-4">
                       <span className="text-[10px] font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">MINDSET: {peer.seriousnessScore}%</span>
                       <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Active {peer.lastActive}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 p-5 rounded-[1.5rem] transition-all">
                  <UserPlus size={28} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Guard Note */}
      <div className="p-8 glass rounded-[2.5rem] border-l-4 border-l-indigo-600 flex items-start gap-8 shadow-2xl">
        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4 className="text-xl font-black text-white uppercase tracking-tight">Meritocratic Rebalance Protocol</h4>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed font-medium max-w-5xl">
            Nexus autonomously rebalances squads every 14 days. If consistency metrics fall below established thresholds, replacements are synthesized from the available peer pool. High-performing students (Mindset 95+) receive "Anchor" priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;
