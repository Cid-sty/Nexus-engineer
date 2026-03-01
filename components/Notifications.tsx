import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Zap, 
  Target, 
  Users, 
  Trophy, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'priority' | 'normal' | 'system';
  category: 'hackathon' | 'circle' | 'reward' | 'roadmap' | 'mentorship';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'priority',
    category: 'hackathon',
    title: 'Hackathon Squad Match!',
    description: 'We found 3 peers matching your React/Node.js expertise for the upcoming FinTech Hackathon.',
    time: '2m ago',
    isRead: false
  },
  {
    id: 'n2',
    type: 'priority',
    category: 'roadmap',
    title: 'New Milestone Available',
    description: 'Based on your progress, we suggest starting the "System Design Fundamentals" milestone.',
    time: '1h ago',
    isRead: false
  },
  {
    id: 'n3',
    type: 'normal',
    category: 'reward',
    title: 'Merit Points Earned',
    description: 'You earned +50 XP for completing your daily check-in streak.',
    time: '3h ago',
    isRead: true
  },
  {
    id: 'n4',
    type: 'normal',
    category: 'circle',
    title: 'Study Circle Update',
    description: 'The "Distributed Systems" circle has scheduled a new sync session for tomorrow.',
    time: '5h ago',
    isRead: true
  }
];

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'hackathon': return <Zap className="text-orange-500" size={18} />;
      case 'roadmap': return <Target className="text-accent" size={18} />;
      case 'reward': return <Trophy className="text-amber-400" size={18} />;
      case 'circle': return <Users className="text-emerald-500" size={18} />;
      case 'mentorship': return <Sparkles className="text-purple-500" size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-[70] bg-bg-secondary border-l border-border-primary shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-border-primary flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">Notifications</h3>
                <p className="text-text-secondary text-xs font-medium">Stay updated with your growth journey.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-xl transition-colors text-text-secondary">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="px-4 py-2">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Priority Updates</p>
              </div>
              
              {MOCK_NOTIFICATIONS.filter(n => n.type === 'priority').map(notification => (
                <div key={notification.id} className="surface rounded-2xl p-6 border-l-4 border-l-accent relative group hover:bg-bg-primary transition-all cursor-pointer">
                  {!notification.isRead && <div className="absolute top-6 right-6 w-2 h-2 bg-accent rounded-full"></div>}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center border border-border-primary">
                      {getIcon(notification.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-text-primary">{notification.title}</h4>
                        <span className="text-[10px] text-text-secondary font-medium">{notification.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">{notification.description}</p>
                      <button className="flex items-center gap-1 text-[10px] font-black text-accent uppercase tracking-widest hover:gap-2 transition-all">
                        Take Action <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="px-4 py-2 mt-8">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Recent Activity</p>
              </div>

              {MOCK_NOTIFICATIONS.filter(n => n.type === 'normal').map(notification => (
                <div key={notification.id} className="surface rounded-2xl p-6 border-border-primary relative group hover:bg-bg-primary transition-all cursor-pointer">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center border border-border-primary opacity-60">
                      {getIcon(notification.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-text-primary opacity-80">{notification.title}</h4>
                        <span className="text-[10px] text-text-secondary font-medium">{notification.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{notification.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-border-primary bg-bg-primary/50">
              <button className="w-full btn-secondary py-3 text-xs uppercase tracking-widest">
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Notifications;
