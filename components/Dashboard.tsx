
import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { getAIRecommendation } from '../geminiService';
import { 
  Zap, Flame, Target, Star, ChevronRight, BrainCircuit, 
  Rocket, ShieldCheck, MapPin, Activity, Award, 
  TrendingUp, Clock, Coins, Medal, CheckCircle2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const hasCheckedInToday = user.lastCheckIn === new Date().toISOString().split('T')[0];

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    setIsCheckingIn(true);
    
    // Simulate PoW verification
    setTimeout(() => {
      onUpdateUser({
        merit: user.merit + 10,
        credits: user.credits + 2,
        lastCheckIn: new Date().toISOString().split('T')[0],
        streak: user.streak + 1
      });
      setIsCheckingIn(false);
      alert("Daily Check-in Verified! +10 XP, +2 NC. Streak extended!");
    }, 1500);
  };

  useEffect(() => {
    let mounted = true;
    const loadRec = async () => {
      try {
        const rec = await getAIRecommendation(user);
        if (mounted) {
          setRecommendation(rec);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    loadRec();
    return () => { mounted = false; };
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12 transition-colors duration-300"
    >
      {/* Dynamic Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase transition-colors duration-300">
            Welcome Back, <span className="text-accent">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-text-secondary mt-2 font-medium flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Active Session: Gandhinagar Edge Node
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 border-l-2 border-l-orange-500/50">
            <Flame className="text-orange-500" size={20} />
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Growth Streak</p>
              <p className="text-lg font-bold text-text-primary leading-none">{user.streak} Days</p>
            </div>
          </div>
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 border-l-2 border-l-accent/50">
            <Medal className="text-accent" size={20} />
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Merit Score</p>
              <p className="text-lg font-bold text-text-primary leading-none">{user.merit.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="glass px-5 py-3 rounded-2xl flex items-center gap-3 border-l-2 border-l-emerald-500/50">
            <Coins className="text-emerald-500" size={20} />
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Nexus Credits</p>
              <p className="text-lg font-bold text-text-primary leading-none">{user.credits.toLocaleString()} NC</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Daily Check-in Card */}
        <motion.div variants={item} className="md:col-span-6 lg:col-span-4 glass rounded-[2.5rem] p-8 border border-border-primary relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasCheckedInToday ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {hasCheckedInToday ? <CheckCircle2 size={24} /> : <Flame size={24} />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Daily Status</p>
                <p className={`text-sm font-black ${hasCheckedInToday ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {hasCheckedInToday ? 'VERIFIED' : 'PENDING'}
                </p>
              </div>
            </div>
            <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tighter uppercase">Daily Proof of Work</h3>
            <p className="text-sm text-text-secondary mb-8 font-medium leading-relaxed">Log your industrial progress today to maintain your streak and earn NC.</p>
            <button 
              onClick={handleCheckIn}
              disabled={hasCheckedInToday || isCheckingIn}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                hasCheckedInToday 
                  ? 'bg-bg-primary text-emerald-500 border border-emerald-500/20 cursor-default' 
                  : 'bg-accent text-white shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isCheckingIn ? <Loader2 className="animate-spin" size={18} /> : hasCheckedInToday ? <CheckCircle2 size={18} /> : <Zap size={18} />}
              {isCheckingIn ? 'Verifying...' : hasCheckedInToday ? 'Checked In' : 'Log Progress'}
            </button>
          </div>
        </motion.div>

        {/* Main AI Agent Card */}
        <motion.div variants={item} className="md:col-span-6 lg:col-span-8 glass rounded-[2.5rem] p-8 relative overflow-hidden group border border-accent/10 hover:border-accent/30 transition-all duration-500">
          <div className="absolute -right-16 -top-16 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 group-hover:rotate-0 duration-700 text-accent">
             <BrainCircuit size={240} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-accent/20">
                Nexus Intelligence v3.1
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Synchornized
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4 animate-pulse py-4">
                <div className="h-8 bg-bg-secondary/50 rounded-xl w-3/4"></div>
                <div className="h-4 bg-bg-secondary/50 rounded-xl w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-2xl font-bold text-text-primary leading-tight italic tracking-tight">
                  "{recommendation?.encouragement || "Stay consistent. Your commitment is your only true competitive advantage."}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-bg-primary/40 p-5 rounded-3xl border border-border-primary group-hover:bg-bg-primary/60 transition-colors">
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp size={12} /> Priority Learning
                    </p>
                    <p className="text-sm text-text-primary font-bold">{recommendation?.nextSkill}</p>
                  </div>
                  <div className="bg-bg-primary/40 p-5 rounded-3xl border border-border-primary group-hover:bg-bg-primary/60 transition-colors">
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Award size={12} /> Target Context
                    </p>
                    <p className="text-sm text-text-primary font-bold">{recommendation?.hackathonTheme}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button className="flex items-center gap-2 text-xs font-bold text-accent hover:text-text-primary transition-colors group/btn pt-2">
              Access Full Blueprint <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Quick Stats Column */}
        <motion.div variants={item} className="md:col-span-6 lg:col-span-4 flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 flex-1 border border-border-primary relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} className="text-accent" /> System Metrics
            </h3>
            <div className="space-y-5">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-text-secondary font-medium">Weekly Focus</span>
                 <span className="text-sm font-bold text-text-primary">24.5 / 25h</span>
               </div>
               <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden">
                 <div className="h-full bg-accent rounded-full shadow-[0_0_10px_var(--accent-color)]" style={{ width: '98%' }}></div>
               </div>
               <div className="flex justify-between items-center pt-2">
                 <span className="text-xs text-text-secondary font-medium">Skill Velocity</span>
                 <span className="text-sm font-bold text-emerald-500">+12%</span>
               </div>
            </div>
          </div>
          
          <div className="glass rounded-[2rem] p-6 border border-border-primary group cursor-pointer hover:bg-accent/5 transition-all">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Active Goals</h3>
               <button className="p-1.5 bg-bg-primary rounded-lg group-hover:bg-accent transition-colors">
                 <ChevronRight size={14} className="text-white" />
               </button>
             </div>
             <div className="space-y-1">
               <p className="text-sm font-bold text-text-primary">System Design (Medium)</p>
               <p className="text-[10px] text-text-secondary font-medium">8/10 modules completed</p>
             </div>
          </div>
        </motion.div>

        {/* Pillars Section - Full Width on Mobile, Grid on Desktop */}
        <div className="md:col-span-6 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Rocket size={20} />, color: 'text-accent', label: 'Industrial Roadmaps', desc: 'Production-ready tech stacks only.' },
            { icon: <Award size={20} />, color: 'text-emerald-500', label: 'Merit Signaling', desc: 'Prove skills beyond college name.' },
            { icon: <Zap size={20} />, color: 'text-orange-500', label: 'Squad Synthesis', desc: 'Synthesize elite 4-pillar squads.' },
            { icon: <MapPin size={20} />, color: 'text-blue-500', label: 'Offline Bridge', desc: 'Physical deep-work networking.' }
          ].map((pillar, i) => (
            <motion.div variants={item} key={i} className="bg-bg-secondary/40 backdrop-blur-xl rounded-3xl p-6 border border-border-primary hover:bg-accent/5 transition-all hover:-translate-y-1 duration-300">
               <div className={`p-3 rounded-2xl bg-bg-primary/50 ${pillar.color} w-fit mb-4 border border-border-primary`}>
                 {pillar.icon}
               </div>
               <h4 className="text-sm font-black text-text-primary uppercase tracking-tight mb-1">{pillar.label}</h4>
               <p className="text-xs text-text-secondary leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity / Deadlines Ticker */}
        <motion.div variants={item} className="md:col-span-6 lg:col-span-12 glass rounded-[2rem] p-6 border border-border-primary overflow-hidden relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap bg-bg-primary/80 px-4 py-2 rounded-xl border border-border-primary">
               <Activity size={14} className="text-accent" />
               <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Network Pulse</span>
            </div>
            <div className="flex-1 overflow-hidden">
               <div className="flex gap-12 animate-marquee whitespace-nowrap text-xs font-medium text-text-secondary">
                 <span className="flex items-center gap-2">• <span className="text-text-primary">@Saurabh</span> just merged a PR in Nexus Core</span>
                 <span className="flex items-center gap-2">• <span className="text-text-primary">Google STEP</span> applications close in 2 days</span>
                 <span className="flex items-center gap-2">• <span className="text-text-primary">Gandhinagar Squad</span> hosting a physical deep-work session tomorrow</span>
                 <span className="flex items-center gap-2">• <span className="text-text-primary">@Ananya</span> earned "Code Warrior" badge</span>
               </div>
            </div>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

export default Dashboard;
