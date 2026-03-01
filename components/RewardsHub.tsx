import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  ShieldCheck, 
  Gift, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Coins,
  Medal,
  TrendingUp,
  Crown,
  Info,
  ArrowUpRight,
  Target,
  Activity
} from 'lucide-react';
import { UserProfile, StatusTier } from '../types';
import { REWARD_ACTIVITIES, REDEMPTION_OPTIONS, STATUS_TIERS } from '../constants';

interface RewardsHubProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Sneha Patel", merit: 18450, tier: "Elite", avatar: "S", trend: 'up' },
  { rank: 2, name: "Rohan Mehta", merit: 15200, tier: "Elite", avatar: "R", trend: 'down' },
  { rank: 3, name: "Priya Singh", merit: 12100, tier: "Gold", avatar: "P", trend: 'stable' },
  { rank: 4, name: "Arjun Sharma", merit: 1250, tier: "Silver", avatar: "A", isUser: true, trend: 'up' },
  { rank: 5, name: "Vikram Rao", merit: 980, tier: "Bronze", avatar: "V", trend: 'up' },
];

const RewardsHub: React.FC<RewardsHubProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem' | 'tiers' | 'leaderboard'>('earn');
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [proofText, setProofText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTier = STATUS_TIERS.find(t => t.name === user.tier) || STATUS_TIERS[0];
  const nextTier = STATUS_TIERS[STATUS_TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier ? ((user.merit - currentTier.minXP) / (nextTier.minXP - currentTier.minXP)) * 100 : 100;

  const handleLogActivity = () => {
    if (!selectedActivity) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newMerit = user.merit + selectedActivity.merit;
      const newCredits = user.credits + selectedActivity.credits;
      
      let newTier = user.tier;
      const eligibleTier = [...STATUS_TIERS].reverse().find(t => newMerit >= t.minXP);
      if (eligibleTier) newTier = eligibleTier.name as StatusTier;

      onUpdateUser({
        merit: newMerit,
        credits: newCredits,
        tier: newTier
      });
      
      setIsSubmitting(false);
      setShowProofModal(false);
      setProofText("");
    }, 1500);
  };

  const handleRedeem = (option: any) => {
    if (user.credits < option.cost) return;
    onUpdateUser({ credits: user.credits - option.cost });
    alert(`Redeemed: ${option.label}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Industrial Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-accent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Medal size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1">Merit Quotient</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-text-primary tracking-tighter">{user.merit.toLocaleString()}</h2>
              <span className="text-xs font-bold text-accent">XP</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-text-secondary">
              <TrendingUp size={12} className="text-emerald-500" />
              <span>+12% from last cycle</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-emerald-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Coins size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Nexus Credits</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-text-primary tracking-tighter">{user.credits}</h2>
              <span className="text-xs font-bold text-emerald-500">NC</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-text-secondary">
              <Activity size={12} className="text-accent" />
              <span>Liquid assets available</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-orange-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Dedication Streak</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-text-primary tracking-tighter">{user.streak}</h2>
              <span className="text-xs font-bold text-orange-500">DAYS</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-text-secondary">
              <Flame size={12} className="text-orange-500" />
              <span>Top 5% of Gandhinagar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Progress Blueprint */}
      <div className="glass p-8 rounded-3xl border border-border-primary blueprint-grid relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-border-primary"></div>
          <div className="w-2 h-2 rounded-full bg-border-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          <div className="lg:col-span-1">
            <div className="w-24 h-24 rounded-3xl bg-bg-primary border-2 border-accent flex items-center justify-center relative group">
              <ShieldCheck size={48} className="text-accent group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-black px-2 py-1 rounded-lg">
                TIER 2
              </div>
            </div>
            <div className="mt-4">
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${currentTier.color}`}>{user.tier}</h3>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Current Status Protocol</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-text-secondary mb-1">PROGRESS TO {nextTier?.name.toUpperCase() || 'MAX'}</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-text-primary">{Math.round(progressToNext)}%</span>
                  <div className="h-1 w-12 bg-border-primary"></div>
                  <span className="text-xs font-bold text-text-secondary">
                    {nextTier ? `${(nextTier.minXP - user.merit).toLocaleString()} XP REMAINING` : 'SYSTEM OPTIMIZED'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Cycle Deadline</p>
                <p className="text-sm font-black text-text-primary">14D : 22H : 05M</p>
              </div>
            </div>
            
            <div className="relative h-4 bg-bg-primary rounded-full border border-border-primary overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_20px_rgba(0,122,255,0.5)]"
              />
              <div className="absolute inset-0 blueprint-grid opacity-20"></div>
            </div>

            <div className="flex justify-between text-[10px] font-black text-text-secondary tracking-widest uppercase">
              <span>{currentTier.minXP} XP</span>
              <span>{nextTier?.minXP || 'MAX'} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-bg-secondary/50 rounded-2xl border border-border-primary w-fit mx-auto">
        {[
          { id: 'earn', label: 'EARN', icon: <Zap size={14} /> },
          { id: 'redeem', label: 'REDEEM', icon: <Gift size={14} /> },
          { id: 'tiers', label: 'TIERS', icon: <ShieldCheck size={14} /> },
          { id: 'leaderboard', label: 'RANKING', icon: <TrendingUp size={14} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 tracking-widest ${activeTab === tab.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'earn' && (
            <motion.div 
              key="earn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {REWARD_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="glass p-6 rounded-2xl border border-border-primary hover:border-accent transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-primary flex items-center justify-center text-accent">
                        <Zap size={20} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-accent">+{activity.merit} XP</p>
                        <p className="text-[10px] font-bold text-emerald-500">+{activity.credits} NC</p>
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-text-primary mb-1 uppercase tracking-tight">{activity.label}</h4>
                    <p className="text-xs text-text-secondary mb-4 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border-primary/50">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{activity.limit}</span>
                      <button 
                        onClick={() => { setSelectedActivity(activity); setShowProofModal(true); }}
                        className="flex items-center gap-1 text-[10px] font-black text-accent hover:gap-2 transition-all uppercase tracking-widest"
                      >
                        Log Activity <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'redeem' && (
            <motion.div 
              key="redeem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {REDEMPTION_OPTIONS.map((option) => (
                <div key={option.id} className="glass p-6 rounded-2xl border border-border-primary flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Gift size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-text-primary tracking-tighter">{option.cost}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Credits Required</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-text-primary mb-2 uppercase tracking-tight">{option.label}</h3>
                    <p className="text-xs text-text-secondary mb-6">{option.description}</p>
                  </div>
                  <button 
                    onClick={() => handleRedeem(option)}
                    disabled={user.credits < option.cost}
                    className={`w-full py-4 rounded-xl font-black text-[11px] tracking-[0.2em] transition-all uppercase ${
                      user.credits >= option.cost 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' 
                        : 'bg-bg-primary text-text-secondary border border-border-primary cursor-not-allowed'
                    }`}
                  >
                    {user.credits >= option.cost ? 'Initiate Redemption' : 'Insufficient Balance'}
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tiers' && (
            <motion.div 
              key="tiers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {STATUS_TIERS.map((tier) => {
                const isUnlocked = user.merit >= tier.minXP;
                const isCurrent = user.tier === tier.name;
                return (
                  <div key={tier.name} className={`glass p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${isCurrent ? 'border-accent bg-accent/5' : 'border-border-primary'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${isUnlocked ? tier.color + ' border-current' : 'text-text-secondary/20 border-border-primary'}`}>
                        <Medal size={32} />
                      </div>
                      <div>
                        <h4 className={`text-xl font-black uppercase tracking-tight ${isUnlocked ? 'text-text-primary' : 'text-text-secondary'}`}>{tier.name}</h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Threshold: {tier.minXP.toLocaleString()} XP</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black uppercase tracking-widest ${isUnlocked ? 'text-accent' : 'text-text-secondary/40'}`}>{tier.perk}</p>
                      {isCurrent && (
                        <span className="inline-block mt-2 px-3 py-1 bg-accent text-white text-[10px] font-black rounded-full uppercase tracking-widest">Active Protocol</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-3xl border border-border-primary overflow-hidden"
            >
              <div className="bg-bg-secondary/60 p-6 border-b border-border-primary flex justify-between items-center">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Global Merit Ranking</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  <span>Cycle: Feb 2026</span>
                  <div className="w-1 h-1 rounded-full bg-border-primary"></div>
                  <span>Region: Gujarat</span>
                </div>
              </div>
              <div className="divide-y divide-border-primary">
                {MOCK_LEADERBOARD.map((entry) => (
                  <div key={entry.rank} className={`p-6 flex items-center justify-between group transition-colors ${entry.isUser ? 'bg-accent/5' : 'hover:bg-bg-primary/50'}`}>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <span className={`w-8 h-8 flex items-center justify-center text-sm font-black rounded-lg border ${entry.rank === 1 ? 'bg-amber-400/10 border-amber-400 text-amber-400' : entry.rank === 2 ? 'bg-zinc-300/10 border-zinc-300 text-zinc-300' : entry.rank === 3 ? 'bg-orange-400/10 border-orange-400 text-orange-400' : 'bg-bg-primary border-border-primary text-text-secondary'}`}>
                          {entry.rank}
                        </span>
                        {entry.rank <= 3 && <Crown size={12} className="absolute -top-2 -right-2 text-amber-400" />}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-bg-primary border border-border-primary flex items-center justify-center text-lg font-black text-text-secondary">
                        {entry.avatar}
                      </div>
                      <div>
                        <p className="text-base font-black text-text-primary uppercase tracking-tight">{entry.name} {entry.isUser && <span className="text-[10px] text-accent ml-2">(YOU)</span>}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{entry.tier}</span>
                          <div className="w-1 h-1 rounded-full bg-border-primary"></div>
                          <span className={`text-[10px] font-bold uppercase ${entry.trend === 'up' ? 'text-emerald-500' : entry.trend === 'down' ? 'text-rose-500' : 'text-text-secondary'}`}>
                            {entry.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-text-primary tracking-tighter">{entry.merit.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Merit Points</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-bg-secondary/40 border-t border-border-primary text-center">
                <button className="text-[10px] font-black text-accent uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all">
                  View Full Global Registry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Industrial Proof Modal */}
      <AnimatePresence>
        {showProofModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && setShowProofModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-bg-secondary w-full max-w-lg rounded-3xl p-8 border border-border-primary shadow-2xl blueprint-grid">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">PROTOCOL: LOG_PROGRESS</h3>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">{selectedActivity?.label}</p>
                </div>
                <button onClick={() => setShowProofModal(false)} className="p-2 hover:bg-bg-primary rounded-lg transition-colors">
                  <AlertCircle size={20} className="text-text-secondary" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Activity Evidence (Text/URL)</label>
                  <textarea 
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Provide verifiable proof of your achievement..."
                    className="w-full bg-bg-primary border border-border-primary rounded-2xl p-6 text-sm text-text-primary focus:border-accent outline-none min-h-[150px] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-bg-primary border border-border-primary">
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Estimated XP</p>
                    <p className="text-lg font-black text-accent">+{selectedActivity?.merit}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-bg-primary border border-border-primary">
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Estimated NC</p>
                    <p className="text-lg font-black text-emerald-500">+{selectedActivity?.credits}</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex gap-4">
                  <Info size={18} className="text-orange-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-text-primary uppercase mb-1">Verification Notice</p>
                    <p className="text-[10px] text-text-secondary leading-relaxed">Submissions are analyzed by the Nexus AI Core. Discrepancies will trigger a manual audit and potential merit deduction.</p>
                  </div>
                </div>

                <button 
                  onClick={handleLogActivity}
                  disabled={isSubmitting || !proofText.trim()}
                  className="w-full bg-accent text-white py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-xl shadow-accent/30 disabled:opacity-50 hover:bg-accent/90 transition-all relative overflow-hidden group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Activity size={16} className="animate-pulse" /> ANALYZING_SUBMISSION...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      TRANSMIT_DATA <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsHub;
