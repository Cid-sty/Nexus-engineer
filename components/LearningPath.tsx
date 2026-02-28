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
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { generateUserRoadmap, getFallbackRoadmap } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>(getFallbackRoadmap(user) as RoadmapNode[]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    // Set initial selected node from fallback
    const currentNode = roadmap.find(n => n.status === 'current') || roadmap[0];
    setSelectedNodeId(currentNode.id);

    let mounted = true;
    const loadRoadmap = async () => {
      setIsSyncing(true);
      try {
        const dynamicRoadmap = await generateUserRoadmap(user);
        if (mounted && dynamicRoadmap && dynamicRoadmap.length > 0) {
          setRoadmap(dynamicRoadmap as RoadmapNode[]);
          // Keep the current selection if it still exists, otherwise reset
          const exists = dynamicRoadmap.some((n: any) => n.id === selectedNodeId);
          if (!exists) {
            const newCurrent = dynamicRoadmap.find((n: any) => n.status === 'current') || dynamicRoadmap[0];
            setSelectedNodeId(newCurrent.id);
          }
        }
      } catch (err) {
        console.error("Critical error loading roadmap", err);
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };
    loadRoadmap();
    return () => { mounted = false; };
  }, [user]);

  const selectedNode = roadmap.find(n => n.id === selectedNodeId);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 transition-colors duration-300">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-bg-secondary/20 border border-border-primary p-8 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
               {isSyncing ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
               {isSyncing ? 'Syncing with AI...' : 'Personalized Strategy'}
             </div>
             <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase">The Nexus Path</h2>
          </div>
          <p className="text-text-secondary max-w-xl font-medium leading-relaxed">
            Industrial trajectory for <span className="text-text-primary font-bold">{user.name}</span>. 
            Bridging <span className="text-text-secondary font-bold">{user.skills[0]?.name || 'Core'}</span> fundamentals toward <span className="text-accent font-bold">Industrial Stack</span> mastery.
          </p>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right">
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-1">Target Discipline</p>
            <p className="text-xl font-bold text-text-primary italic">{user.preferredRole} Architect</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-accent font-black text-xl shadow-xl shadow-accent/5">
            {roadmap.filter(n => n.status === 'completed').length}/{roadmap.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* The Skill Tree - Left Column */}
        <div className="lg:col-span-5 relative">
          <div className="absolute left-[38px] top-10 bottom-10 w-[4px] bg-accent/10 rounded-full"></div>
          
          <div className="space-y-12 relative">
            {roadmap.map((node, idx) => {
              const isActive = selectedNodeId === node.id;
              const isCompleted = node.status === 'completed';
              const isLocked = node.status === 'locked';
              const avgProgress = node.subModules.reduce((acc, curr) => acc + curr.progress, 0) / (node.subModules.length || 1);

              return (
                <div 
                  key={node.id}
                  onClick={() => !isLocked && setSelectedNodeId(node.id)}
                  className={`flex items-start gap-10 cursor-pointer transition-all duration-500 relative group ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  {idx < roadmap.length - 1 && isCompleted && (
                    <div className="absolute left-[38px] top-16 h-12 w-[4px] bg-emerald-500/30 z-0"></div>
                  )}

                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                      isActive 
                        ? 'bg-accent border-accent/30 shadow-[0_0_40px_var(--accent-color)] scale-110 -rotate-2' 
                        : isCompleted 
                        ? 'bg-bg-secondary border-emerald-500/50' 
                        : 'bg-bg-primary border-border-primary'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="text-emerald-400" size={28} /> : isLocked ? <Lock className="text-text-secondary/30" size={24} /> : getCategoryIcon(node.category)}
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCompleted ? 'text-emerald-500' : 'text-accent'}`}>
                        {isCompleted ? 'STAGE COMPLETED' : isLocked ? 'LOCKED' : 'ACTIVE NODE'}
                      </p>
                      {avgProgress > 0 && avgProgress < 100 && (
                        <span className="text-[10px] font-bold text-text-secondary">{Math.round(avgProgress)}%</span>
                      )}
                    </div>
                    <h3 className={`text-2xl font-black ${isActive ? 'text-text-primary' : 'text-text-secondary'} transition-colors`}>{node.title}</h3>
                    <p className="text-sm text-text-secondary/70 font-medium">{node.subtitle}</p>
                    
                    {!isLocked && !isCompleted && (
                      <div className="mt-3 h-1 w-full bg-bg-primary rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_var(--accent-color)]" style={{ width: `${avgProgress}%` }}></div>
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
            <div className="bg-bg-secondary border border-border-primary rounded-[3rem] p-10 sticky top-32 shadow-2xl border-t-accent/10 animate-in zoom-in-95 duration-500">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Industrial Specs</p>
                  </div>
                  <h3 className="text-4xl font-black text-text-primary leading-tight">{selectedNode.title}</h3>
                </div>
                <div className="p-4 bg-bg-primary/50 rounded-3xl border border-border-primary shadow-inner">
                  {getCategoryIcon(selectedNode.category)}
                </div>
              </div>

              <div className="space-y-10">
                <p className="text-text-secondary leading-relaxed text-lg font-medium italic">
                  "{selectedNode.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-bg-primary/80 p-6 rounded-[2rem] border border-border-primary shadow-lg">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-4">Core Competencies</p>
                    <div className="space-y-4">
                      {selectedNode.subModules.map(mod => (
                        <div key={mod.name} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-text-secondary font-bold">{mod.name}</span>
                            <span className="text-text-secondary font-black">{mod.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${mod.progress === 100 ? 'bg-emerald-500' : 'bg-accent'}`} 
                              style={{ width: `${mod.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-bg-primary/80 p-6 rounded-[2rem] border border-border-primary">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldAlert size={12} /> Interview Focus
                      </p>
                      <p className="text-sm text-text-secondary font-medium">{selectedNode.interviewFocus}</p>
                    </div>
                    <div className="bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-500/10">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Zap size={12} /> Boss Project
                      </p>
                      <p className="text-sm text-text-secondary font-bold">{selectedNode.bossProject}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-4">
                  <button className="w-full bg-accent hover:bg-accent/80 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-accent/20">
                    OPEN WORKSPACE <ChevronRight size={20} />
                  </button>
                  
                  <div className="p-5 bg-bg-primary/40 rounded-[2rem] border border-border-primary flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Terminal size={18} className="text-accent" />
                    </div>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed">
                      <span className="text-accent font-bold">Nexus Intelligence:</span> {selectedNode.nexusTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-border-primary rounded-[3rem] p-20 text-center">
              <div>
                <Circle size={48} className="text-border-primary mx-auto mb-4" />
                <p className="text-text-secondary font-bold uppercase tracking-widest">Select an active node for blueprint access</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-gradient-to-br from-bg-secondary to-bg-primary border border-border-primary rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10 group">
        <div className="w-24 h-24 bg-accent/10 rounded-[2rem] border border-accent/20 flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
          <BrainCircuit className="text-accent" size={40} />
        </div>
        <div>
          <h4 className="text-2xl font-black text-text-primary mb-3 tracking-tight italic">"Eliminating the Pedigree Gap"</h4>
          <p className="text-text-secondary leading-relaxed font-medium">
            Nexus Paths are optimized for Tier-2/3 reality. We focus on <span className="text-accent font-bold">Open Source dominance</span> and <span className="text-text-primary">architectural competence</span>. 
            When your code speaks for itself, the name of your college becomes irrelevant. 
            Stay the course.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;