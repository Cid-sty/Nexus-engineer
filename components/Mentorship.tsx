import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  Video,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  reviews: number;
  expertise: string[];
  price: number;
  avatar: string;
  isFree: boolean;
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    company: 'Google',
    rating: 4.9,
    reviews: 124,
    expertise: ['React', 'System Design', 'Career Growth'],
    price: 0,
    avatar: 'S',
    isFree: true
  },
  {
    id: 'm2',
    name: 'David Miller',
    role: 'Tech Lead',
    company: 'Stripe',
    rating: 5.0,
    reviews: 89,
    expertise: ['Backend', 'Fintech', 'Leadership'],
    price: 499,
    avatar: 'D',
    isFree: false
  },
  {
    id: 'm3',
    name: 'Ananya Rao',
    role: 'Product Designer',
    company: 'Airbnb',
    rating: 4.8,
    reviews: 56,
    expertise: ['UI/UX', 'Product Strategy', 'Figma'],
    price: 299,
    avatar: 'A',
    isFree: false
  },
  {
    id: 'm4',
    name: 'James Wilson',
    role: 'DevOps Engineer',
    company: 'AWS',
    rating: 4.7,
    reviews: 42,
    expertise: ['Kubernetes', 'CI/CD', 'Cloud Architecture'],
    price: 399,
    avatar: 'J',
    isFree: false
  }
];

interface MentorshipProps {
  user: UserProfile;
}

const Mentorship: React.FC<MentorshipProps> = ({ user }) => {
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingStep, setBookingStep] = useState(0);

  const filteredMentors = MOCK_MENTORS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBooking = () => {
    setBookingStep(1);
    setTimeout(() => {
      setBookingStep(2);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">Mentorship Marketplace</h2>
          <p className="text-text-secondary font-medium">Connect with industry experts for 1:1 guidance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by expertise..." 
              className="bg-bg-secondary border border-border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-bg-secondary border border-border-primary rounded-xl text-text-secondary hover:text-accent transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="surface rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-widest mb-6">
              <Zap size={14} /> Limited Offer
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">First Session is Free</h3>
            <p className="text-text-secondary text-lg mb-8 max-w-lg leading-relaxed font-medium">Every Nexus Engineer gets one complimentary 30-minute session with a top-tier mentor to kickstart their growth roadmap.</p>
            <button className="btn-primary px-8 py-4 text-lg flex items-center gap-3">
              Claim Free Session <ChevronRight size={20} />
            </button>
          </div>
          <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
            {MOCK_MENTORS.slice(0, 4).map(m => (
              <div key={m.id} className="aspect-square rounded-3xl bg-bg-primary border border-border-primary flex items-center justify-center text-3xl font-black text-text-secondary group-hover:border-accent/30 transition-all">
                {m.avatar}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="surface rounded-[2rem] p-8 hover:border-accent/40 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-primary flex items-center justify-center text-2xl font-black text-text-secondary group-hover:scale-110 transition-transform">
                {mentor.avatar}
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
                <Star size={16} fill="currentColor" /> {mentor.rating}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-xl font-black text-text-primary tracking-tight">{mentor.name}</h4>
              <p className="text-sm text-text-secondary font-medium">{mentor.role} at <span className="text-text-primary">{mentor.company}</span></p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {mentor.expertise.map(exp => (
                <span key={exp} className="px-2 py-1 bg-bg-primary border border-border-primary rounded-lg text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  {exp}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Session Fee</p>
                <p className="text-xl font-black text-text-primary">
                  {mentor.isFree ? 'FREE' : `₹${mentor.price}`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedMentor(mentor)}
                className="btn-secondary px-6 py-2.5 text-xs uppercase tracking-widest"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingStep(0) || setSelectedMentor(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-secondary w-full max-w-xl rounded-[3rem] p-10 border border-border-primary shadow-2xl"
            >
              {bookingStep === 0 && (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-black text-text-primary tracking-tighter uppercase">Book Session</h3>
                      <p className="text-text-secondary font-medium mt-1">30-minute 1:1 with <span className="text-accent font-bold">{selectedMentor.name}</span></p>
                    </div>
                    <button onClick={() => setSelectedMentor(null)} className="text-text-secondary hover:text-text-primary">
                      <Lock size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-border-primary bg-bg-primary">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Select Date</p>
                        <div className="flex items-center gap-3 text-text-primary font-bold">
                          <Calendar size={18} className="text-accent" />
                          March 5, 2026
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border-primary bg-bg-primary">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Select Time</p>
                        <div className="flex items-center gap-3 text-text-primary font-bold">
                          <Clock size={18} className="text-accent" />
                          6:00 PM IST
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border-primary bg-bg-primary space-y-4">
                      <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Session Details</p>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                          <Video size={20} />
                        </div>
                        <div>
                          <p className="text-text-primary">Video Call via Nexus Meet</p>
                          <p className="text-text-secondary text-xs">Link will be shared after booking</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <p className="text-text-primary">Pre-session Chat</p>
                          <p className="text-text-secondary text-xs">Discuss your goals before the call</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                      <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Amount</p>
                        <p className="text-2xl font-black text-text-primary">{selectedMentor.isFree ? 'FREE' : `₹${selectedMentor.price}`}</p>
                      </div>
                      <button 
                        onClick={handleBooking}
                        className="btn-primary px-8 py-4 uppercase tracking-widest"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </>
              )}

              {bookingStep === 1 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-8">
                    <Zap className="animate-pulse" size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Processing Session</h3>
                  <p className="text-text-secondary font-medium max-w-xs">We are coordinating with {selectedMentor.name} and setting up your secure meeting link...</p>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Session Confirmed!</h3>
                  <p className="text-text-secondary font-medium mb-12 max-w-xs">Your mentorship session with {selectedMentor.name} is scheduled for March 5th at 6:00 PM.</p>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setSelectedMentor(null) || setBookingStep(0)}
                      className="btn-secondary flex-1 py-4 uppercase tracking-widest"
                    >
                      Close
                    </button>
                    <button className="btn-primary flex-1 py-4 uppercase tracking-widest">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentorship;
