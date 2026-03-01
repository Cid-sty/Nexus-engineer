
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
  const [recommendations, setRecommendations] = useState<any[]>([
    { name: "Sneha Patel", role: "Backend Engineer", matchingReason: "Expert in Go and Distributed Systems. Matches your Node.js background for a robust full-stack duo.", skills: ["Go", "Docker", "PostgreSQL"], location: "Ahmedabad, Gujarat" },
    { name: "Rohan Mehta", role: "UI/UX Designer", matchingReason: "High-fidelity prototyping specialist. Can translate your React components into a polished product.", skills: ["Figma", "Design Systems"], location: "Gandhinagar, Gujarat" },
    { name: "Priya Singh", role: "DevOps/Cloud", matchingReason: "AWS Certified. Complements your goal of learning Kubernetes and Cloud infrastructure.", skills: ["AWS", "Kubernetes", "Terraform"], location: "Remote / Vadodara" }
  ]);
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
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-primary pb-8">
        <div>
          <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase flex items-center gap-4">
            SQUAD OPS <Zap className="text-accent fill-accent" size={28} />
          </h2>
          <p className="text-text-secondary mt-2 font-medium">Autonomous formation, active rebalancing, and local bridge discovery.</p>
        </div>
        <div className="flex bg-bg-secondary/80 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-border-primary shadow-2xl">
          {[
            { id: 'build', label: 'Synthesis', icon: <BrainCircuit size={14} /> },
            { id: 'manage', label: 'Fleet', icon: <Terminal size={14} /> },
            { id: 'offline', label: 'Bridges', icon: <Radar size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-[0.2em] ${activeTab === tab.id ? 'bg-accent text-white shadow-xl shadow-accent/40 translate-y-[-2px]' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'build' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-bg-secondary/40 backdrop-blur-xl rounded-[3rem] p-10 relative overflow-hidden group border border-accent/10">
             <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent/10 rounded-full blur-[100px] group-hover:bg-accent/20 transition-all duration-1000"></div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-black text-text-primary mb-3 tracking-tighter uppercase">Team Synthesis Engine</h3>
                  <p className="text-text-secondary max-w-lg leading-relaxed font-medium">Analyzing mindset vectors and technical proficiency gaps to synthesize an elite 4-pillar squad.</p>
                </div>
                <button 
                  onClick={startAutoBuild}
                  disabled={loading}
                  className="bg-accent hover:bg-accent/80 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={22} />}
                  {recommendations.length > 0 ? 'Recalibrate Synergy' : 'Initialize Synthesis'}
                </button>
             </div>
             {loading && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] p-8 hover:border-accent/40 transition-all group relative border border-border-primary animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute top-8 right-8 text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                <div className="px-3 py-1.5 w-fit bg-accent/10 rounded-xl border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
                  {rec.role}
                </div>
                <h4 className="text-2xl font-black text-text-primary mb-1 tracking-tighter">{rec.name}</h4>
                <p className="text-xs text-text-secondary mb-8 flex items-center gap-1.5 font-bold italic"><MapPin size={12} className="text-accent" /> {rec.location}</p>
                <div className="bg-bg-primary/40 p-5 rounded-2xl mb-8 border border-border-primary italic text-text-secondary text-sm leading-relaxed">
                  "{rec.matchingReason}"
                </div>
                <button className="w-full py-4 bg-bg-primary hover:bg-accent text-text-primary hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl border border-border-primary">
                  <UserPlus size={16} /> Send Nexus Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mySquads.map((squad) => (
              <div key={squad.id} className="bg-bg-secondary/40 backdrop-blur-xl rounded-[3rem] p-10 border border-border-primary relative overflow-hidden group hover:border-accent/40 transition-all duration-500">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover:bg-accent/10 transition-all duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${squad.isHealthy ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                          {squad.type} • {squad.isHealthy ? 'OPTIMAL' : 'REBALANCE REQ'}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-text-primary tracking-tighter uppercase">{squad.name}</h3>
                      <p className="text-sm text-text-secondary font-medium mt-1 italic">Goal: {squad.goal}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">Synergy</p>
                      <div className="text-2xl font-black text-accent">{squad.activityLevel}%</div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-10">
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Active Fleet Members</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {squad.members.map((member) => (
                        <div key={member.id} className="bg-bg-primary/40 p-4 rounded-2xl border border-border-primary flex items-center justify-between group/member hover:bg-bg-primary/60 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${member.name.includes('Arjun') ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-bg-secondary text-text-secondary border border-border-primary'}`}>
                              {member.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{member.name} {member.name.includes('Arjun') && <span className="text-[10px] text-accent font-black ml-1">(YOU)</span>}</p>
                              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-tight">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-text-secondary font-black uppercase">Mindset</p>
                            <p className={`text-xs font-black ${member.mindsetScore > 90 ? 'text-emerald-500' : 'text-orange-500'}`}>{member.mindsetScore}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-bg-primary hover:bg-bg-primary/80 text-text-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border-primary transition-all flex items-center justify-center gap-2">
                      <Terminal size={14} /> SQUAD COMMS
                    </button>
                    <button className="flex-1 bg-accent/10 hover:bg-accent text-accent hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-accent/20 transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={14} /> REBALANCE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'offline' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="relative bg-bg-secondary/40 backdrop-blur-xl rounded-[3.5rem] p-20 text-center overflow-hidden border border-border-primary">
            <div className="absolute inset-0 blueprint-grid opacity-20"></div>
            <div className="relative z-10">
              <div className="relative w-48 h-48 mx-auto mb-10">
                <div className={`absolute inset-0 rounded-full border-2 border-accent/20 ${scanning ? 'animate-ping' : ''}`}></div>
                <div className={`absolute inset-0 rounded-full border-t-2 border-accent ${scanning ? 'animate-scan-radar' : 'opacity-20'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radar size={64} className={`${scanning ? 'text-accent' : 'text-text-secondary/30'}`} />
                </div>
                {scanning && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_var(--accent-color)]"></div>}
              </div>
              
              <h3 className="text-4xl font-black text-text-primary mb-4 tracking-tighter uppercase">Physical Bridge Scanner</h3>
              <p className="text-text-secondary max-w-lg mx-auto mb-12 font-medium leading-relaxed">Pinging local edge nodes to discover elite engineering peers within your 5km physical radius.</p>
              
              <button 
                onClick={startOfflineScan}
                disabled={scanning}
                className="bg-accent hover:bg-accent/80 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4 mx-auto shadow-[0_0_50px_var(--accent-color)] hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {scanning ? <Loader2 className="animate-spin" /> : <Crosshair size={22} />}
                SCAN RADIUS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyPeers.map((peer, i) => (
              <div key={i} className="bg-bg-secondary/40 backdrop-blur-xl rounded-[2rem] p-8 flex items-center justify-between group hover:bg-bg-primary/20 border border-border-primary transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-bg-secondary to-bg-primary rounded-3xl flex items-center justify-center border border-border-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Users className="text-accent" size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-text-primary tracking-tighter">{peer.name}</h4>
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1 italic">{peer.role} • {peer.distance} away</p>
                    <div className="mt-4 flex items-center gap-4">
                       <span className="text-[10px] font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">MINDSET: {peer.seriousnessScore}%</span>
                       <span className="text-[10px] text-text-secondary/50 font-bold uppercase tracking-widest">Active {peer.lastActive}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 p-5 rounded-[1.5rem] transition-all">
                  <UserPlus size={28} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Guard Note */}
      <div className="p-8 bg-bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border-l-4 border-l-accent flex items-start gap-8 shadow-2xl border border-border-primary">
        <div className="p-4 bg-accent/10 rounded-2xl text-accent border border-accent/20">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4 className="text-xl font-black text-text-primary uppercase tracking-tight">Meritocratic Rebalance Protocol</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed font-medium max-w-5xl">
            Nexus autonomously rebalances squads every 14 days. If consistency metrics fall below established thresholds, replacements are synthesized from the available peer pool. High-performing students (Mindset 95+) receive "Anchor" priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;
