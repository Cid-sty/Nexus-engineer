import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Terminal, 
  Zap, 
  ChevronRight, 
  Lock, 
  Layout, 
  Database, 
  Server, 
  ShieldAlert,
  ArrowUpRight,
  Code2,
  Workflow,
  Cpu,
  Globe,
  Loader2,
  BrainCircuit
} from 'lucide-react';
import { UserProfile } from '../types';
import { generateUserRoadmap } from '../geminiService';

interface SubModule {
  name: string;
  progress: number;
}

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'locked';
  description: string;
  subModules: SubModule[];
  bossProject: string;
  interviewFocus: string;
  nexusTip: string;
  category?: string;
}

const getCategoryIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'frontend': return <Layout size={24} />;
    case 'backend': return <Server size={24} />;
    case 'systems': return <Cpu size={24} />;
    case 'cloud': return <Globe size={24} />;
    default: return <Code2 size={24} />;
  }
};

const LearningPath: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const loadRoadmap = async () => {
      setLoading(true);
      try {
        const dynamicRoadmap = await generateUserRoadmap(user);
        if (dynamicRoadmap && dynamicRoadmap.length > 0) {
          setRoadmap(dynamicRoadmap);
          const currentNode = dynamicRoadmap.find(n => n.status === 'current') || dynamicRoadmap[0];
          setSelectedNodeId(currentNode.id);
        }
      } catch (err) {
        console.error("Failed to load roadmap", err);
      } finally {
        setLoading(false);
      }
    };
    loadRoadmap();
  }, [user]);

  const selectedNode = roadmap.find(n => n.id === selectedNodeId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-500" size={64} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-indigo-400/40" size={24} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Synthesizing Nexus Roadmap</h3>
          <p className="text-zinc-500 mt-2">Mapping {user.skills.length} existing competencies to Tier-1 industrial standards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-zinc-900/20 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] group-hover:bg-indigo-600/10 transition-all duration-1000"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Personalized Growth Path</div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">The Nexus Path</h2>
          </div>
          <p className="text-zinc-500 max-w-xl font-medium leading-relaxed">
            Targeted trajectory for <span className="text-white font-bold">{user.name}</span>. 
            Bridging <span className="text-zinc-300 font-bold">{user.skills[0]?.name || 'Core'}</span> mastery toward <span className="text-indigo-400 font-bold">{user.skillsToLearn[0] || 'Elite'}</span> competence.
          </p>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Target Discipline</p>
            <p className="text-xl font-bold text-white italic">{user.preferredRole} Engineer</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl shadow-xl shadow-indigo-500/5">
            {roadmap.filter(n => n.status === 'completed').length}/{roadmap.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* The Skill Tree - Left Column */}
        <div className="lg:col-span-5 relative">
          <div className="absolute left-[39px] top-10 bottom-10 w-[3px] bg-zinc-800/50 rounded-full"></div>
          
          <div className="space-y-12 relative">
            {roadmap.map((node, idx) => {
              const isActive = selectedNodeId === node.id;
              const isCompleted = node.status === 'completed';
              const isLocked = node.status === 'locked';
              const avgProgress = node.subModules.reduce((acc, curr) => acc + curr.progress, 0) / node.subModules.length;

              return (
                <div 
                  key={node.id}
                  onClick={() => !isLocked && setSelectedNodeId(node.id)}
                  className={`flex items-start gap-10 cursor-pointer transition-all duration-500 relative group ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  {idx < roadmap.length - 1 && isCompleted && (
                    <div className="absolute left-[39px] top-16 h-12 w-[3px] bg-emerald-500/40 z-0"></div>
                  )}

                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-300 shadow-[0_0_40px_rgba(79,70,229,0.4)] scale-110 -rotate-2' 
                        : isCompleted 
                        ? 'bg-zinc-900 border-emerald-500/50' 
                        : 'bg-zinc-950 border-zinc-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="text-emerald-400" size={28} /> : isLocked ? <Lock className="text-zinc-700" size={24} /> : getCategoryIcon(node.category)}
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCompleted ? 'text-emerald-500' : 'text-indigo-400'}`}>
                        {isCompleted ? 'STAGE COMPLETED' : isLocked ? 'LOCKED' : 'ACTIVE NODE'}
                      </p>
                      {avgProgress > 0 && avgProgress < 100 && (
                        <span className="text-[10px] font-bold text-zinc-500">{Math.round(avgProgress)}%</span>
                      )}
                    </div>
                    <h3 className={`text-2xl font-black ${isActive ? 'text-white' : 'text-zinc-500'} transition-colors`}>{node.title}</h3>
                    <p className="text-sm text-zinc-600 font-medium">{node.subtitle}</p>
                    
                    {!isLocked && !isCompleted && (
                      <div className="mt-3 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.5)]" style={{ width: `${avgProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Blueprint - Right Column */}
        <div className="lg:col-span-7">
          {selectedNode ? (
            <div className="bg-[#0f0f12] border border-zinc-800 rounded-[3rem] p-10 sticky top-32 shadow-2xl border-t-indigo-500/10 animate-in zoom-in-95 duration-500">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Node Specification</p>
                  </div>
                  <h3 className="text-4xl font-black text-white">{selectedNode.title}</h3>
                </div>
                <div className="p-4 bg-zinc-900/50 rounded-3xl border border-zinc-800 shadow-inner">
                  {getCategoryIcon(selectedNode.category)}
                </div>
              </div>

              <div className="space-y-10">
                <p className="text-zinc-400 leading-relaxed text-lg font-medium italic">
                  "{selectedNode.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950/80 p-6 rounded-[2rem] border border-zinc-800/50 shadow-lg">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Core Competencies</p>
                    <div className="space-y-4">
                      {selectedNode.subModules.map(mod => (
                        <div key={mod.name} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-300 font-bold">{mod.name}</span>
                            <span className="text-zinc-500 font-black">{mod.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${mod.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${mod.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-zinc-950/80 p-6 rounded-[2rem] border border-zinc-800/50">
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldAlert size={12} /> Interview Focus
                      </p>
                      <p className="text-sm text-zinc-300 font-medium">{selectedNode.interviewFocus}</p>
                    </div>
                    <div className="bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-500/10">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Zap size={12} /> Boss Project
                      </p>
                      <p className="text-sm text-zinc-300 font-bold">{selectedNode.bossProject}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-4">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-indigo-500/20">
                    ACCESS DRILL ENVIRONMENT <ChevronRight size={20} />
                  </button>
                  
                  <div className="p-5 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Terminal size={18} className="text-indigo-400" />
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">
                      <span className="text-indigo-400 font-bold">Nexus Tip:</span> {selectedNode.nexusTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
              <div>
                <Circle size={48} className="text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 font-bold uppercase tracking-widest">Select an active node to inspect</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-gradient-to-br from-zinc-900 to-[#0a0a0b] border border-zinc-800 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10 group">
        <div className="w-24 h-24 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
          <BrainCircuit className="text-indigo-400" size={40} />
        </div>
        <div>
          <h4 className="text-2xl font-black text-white mb-3 tracking-tight italic">"The Industrial Advantage"</h4>
          <p className="text-zinc-500 leading-relaxed font-medium">
            This roadmap is generated dynamically using Nexus Intelligence. It prioritizes <span className="text-indigo-400 font-bold">industrial reliability</span> over simple syntax mastery. 
            By following these milestones, you eliminate the pedigree gap through sheer technical competence. 
            Keep the drift high.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;