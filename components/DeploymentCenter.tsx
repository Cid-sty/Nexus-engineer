
import React, { useState, useEffect } from 'react';
import { MOCK_SQUADS } from '../constants';
import { getDeploymentRoadmap } from '../geminiService';
import { Rocket, History, Globe, Box, ChevronRight, Loader2, GitBranch, Terminal } from 'lucide-react';
import { Squad } from '../types';

const DeploymentCenter: React.FC = () => {
  const [selectedSquad, setSelectedSquad] = useState<Squad>(MOCK_SQUADS[0]);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoadmap = async () => {
      setLoading(true);
      const res = await getDeploymentRoadmap(selectedSquad);
      setRoadmap(res);
      setLoading(false);
    };
    loadRoadmap();
  }, [selectedSquad]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Launchpad <Rocket size={24} className="text-indigo-400" />
          </h2>
          <p className="text-zinc-500 mt-1">Manage project versions and monitor production readiness.</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
          {MOCK_SQUADS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSquad(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedSquad.id === s.id 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Deployment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live Instance</h3>
                  <p className="text-sm text-zinc-500">nexus-deploy-{selectedSquad.id}.web.app</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                  selectedSquad.deploymentStatus === 'Production' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {selectedSquad.deploymentStatus}
                </span>
                <span className="text-[10px] text-zinc-600 mt-1 font-mono">{selectedSquad.version}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Response Time</p>
                <p className="text-lg font-mono text-white">124ms</p>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Uptime</p>
                <p className="text-lg font-mono text-white">99.9%</p>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Error Rate</p>
                <p className="text-lg font-mono text-white">0.02%</p>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Releases</p>
                <p className="text-lg font-mono text-white">14</p>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Rocket size={18} /> Push New Deployment
            </button>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <History size={20} className="text-zinc-400" /> Release History
            </h3>
            <div className="space-y-4">
              {[
                { version: 'v1.0.0', date: 'Oct 18, 2023', user: 'Arjun S.', hash: '8f2a1b9' },
                { version: 'v0.9.4', date: 'Oct 15, 2023', user: 'Sneha P.', hash: '3e1c9d2' },
                { version: 'v0.8.2', date: 'Oct 10, 2023', user: 'Rohan K.', hash: 'a1b2c3d' }
              ].map((release, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-indigo-400">{release.version}</span>
                    <span className="text-xs text-zinc-500">{release.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">{release.user[0]}</div>
                       <span className="text-xs text-zinc-400">{release.user}</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded flex items-center gap-1">
                      <GitBranch size={10} /> {release.hash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Deployment Strategy */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
               <Terminal size={18} className="text-indigo-400" />
               <h3 className="text-md font-bold text-white">AI Versioning Strategy</h3>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-xs font-mono">Generating roadmap...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {roadmap?.milestones?.map((m: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l border-zinc-800 last:border-0 pb-6 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-zinc-900"></div>
                    <p className="text-xs font-mono font-bold text-indigo-400 mb-2 uppercase tracking-tighter">{m.version}</p>
                    <ul className="space-y-2">
                      {m.features.map((f: string, fi: number) => (
                        <li key={fi} className="text-xs text-zinc-400 flex items-start gap-2">
                           <Box size={10} className="mt-1 flex-shrink-0 text-zinc-600" />
                           {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
             <h4 className="text-sm font-bold text-white mb-2">Build Configuration</h4>
             <div className="space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Language</span>
                  <span className="text-zinc-300">TypeScript 5.x</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Framework</span>
                  <span className="text-zinc-300">React 19.x</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Build Tool</span>
                  <span className="text-zinc-300">Vite (Simulated)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentCenter;
