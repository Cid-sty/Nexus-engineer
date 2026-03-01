import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Target, 
  Clock, 
  Rocket, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Nexus',
    description: 'The growth-focused platform for serious engineering students.',
    icon: <Rocket className="text-accent" size={48} />
  },
  {
    id: 'goals',
    title: 'What are your goals?',
    description: 'Select your primary focus areas for the next 6 months.',
    icon: <Target className="text-accent" size={48} />
  },
  {
    id: 'commitment',
    title: 'Time Commitment',
    description: 'How many hours per week can you dedicate to growth?',
    icon: <Clock className="text-accent" size={48} />
  },
  {
    id: 'style',
    title: 'Learning Style',
    description: 'How do you learn best?',
    icon: <BrainCircuit className="text-accent" size={48} />
  },
  {
    id: 'analyzing',
    title: 'AI Assessment',
    description: 'We are crafting your personalized growth roadmap...',
    icon: <Sparkles className="text-accent animate-pulse" size={48} />
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    commitment: '',
    style: ''
  });

  const nextStep = () => {
    if (step === STEPS.length - 1) {
      onComplete({
        ...formData,
        isOnboarded: true
      } as any);
      return;
    }
    setStep(s => s + 1);
    
    if (step === STEPS.length - 2) {
      // Simulate AI analysis
      setTimeout(() => {
        setStep(s => s + 1);
      }, 3000);
    }
  };

  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-primary flex items-center justify-center p-6 overflow-hidden">
      <div className="bg-glow"></div>
      
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="surface rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="flex flex-col items-center text-center mb-12">
              <div className="mb-8 p-6 bg-accent/5 rounded-3xl border border-accent/10">
                {STEPS[step].icon}
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">{STEPS[step].title}</h2>
              <p className="text-text-secondary text-lg max-w-md">{STEPS[step].description}</p>
            </div>

            {step === 0 && (
              <div className="flex flex-col gap-4">
                <button onClick={nextStep} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                  Get Started <ChevronRight size={20} />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-4 mb-12">
                {['Web Development', 'AI/ML', 'Blockchain', 'System Design', 'Mobile Dev', 'DevOps'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      formData.goals.includes(goal) 
                        ? 'border-accent bg-accent/5 text-accent' 
                        : 'border-border-primary hover:border-accent/30'
                    }`}
                  >
                    <div className="font-bold">{goal}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4 mb-12">
                {['5-10 hours', '10-20 hours', '20-40 hours', 'Full-time Focus'].map(time => (
                  <button
                    key={time}
                    onClick={() => { setFormData(prev => ({ ...prev, commitment: time })); nextStep(); }}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      formData.commitment === time 
                        ? 'border-accent bg-accent/5 text-accent' 
                        : 'border-border-primary hover:border-accent/30'
                    }`}
                  >
                    <div className="font-bold">{time}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4 mb-12">
                {[
                  { id: 'visual', label: 'Visual Learner', desc: 'Videos, diagrams, and live demos' },
                  { id: 'hands-on', label: 'Hands-on Builder', desc: 'Coding projects and hackathons' },
                  { id: 'theoretical', label: 'Theoretical Thinker', desc: 'Documentation, books, and deep dives' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => { setFormData(prev => ({ ...prev, style: style.id })); nextStep(); }}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      formData.style === style.id 
                        ? 'border-accent bg-accent/5 text-accent' 
                        : 'border-border-primary hover:border-accent/30'
                    }`}
                  >
                    <div className="font-bold">{style.label}</div>
                    <div className="text-xs opacity-60">{style.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="w-full bg-bg-primary h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-accent"
                  />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {[
                    'Analyzing learning style...',
                    'Mapping industry requirements...',
                    'Identifying optimal study circles...',
                    'Generating roadmap milestones...'
                  ].map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.7 }}
                      className="flex items-center gap-3 text-sm text-text-secondary"
                    >
                      <CheckCircle2 size={16} className="text-accent" />
                      {text}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step > 0 && step < 4 && (
              <div className="flex items-center justify-between mt-8">
                <button onClick={prevStep} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
                  <ArrowLeft size={18} /> Back
                </button>
                {step === 1 && (
                  <button 
                    onClick={nextStep} 
                    disabled={formData.goals.length === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}

            {step === 4 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                onClick={nextStep}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                Enter Nexus <Zap size={20} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-accent' : 'w-2 bg-border-primary'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
