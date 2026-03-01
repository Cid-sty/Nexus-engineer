
import React from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart3, Trophy, MessageSquareCode, Sparkles } from 'lucide-react';
import { UserProfile, Squad, Achievement } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Arjun Sharma",
  college: "LDRP Institute of Technology",
  year: 3,
  commitmentHours: 25,
  dedicationLevel: 'Extremely High',
  learningStyle: 'Project-based',
  primaryGoal: "Full-Stack Internship at Tier-1 Tech",
  skills: [
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 70 },
    { name: 'TypeScript', level: 65 }
  ],
  skillsToLearn: ['System Design', 'Kubernetes', 'Go'],
  preferredRole: 'Frontend',
  merit: 1250,
  credits: 450,
  tier: 'Silver',
  streak: 14,
  location: "Gandhinagar, Gujarat",
  isOnboarded: false
};

export const REWARD_ACTIVITIES = [
  { id: 'checkin', label: 'Daily Check-in', merit: 10, credits: 2, description: 'Log your daily progress with proof.', limit: '1/day' },
  { id: 'streak', label: '7-Day Streak', merit: 50, credits: 10, description: 'Maintain consistency for a full week.', limit: 'Weekly' },
  { id: 'hackathon', label: 'Hackathon Participation', merit: 100, credits: 20, description: 'Join a verified hackathon event.', limit: 'Per event' },
  { id: 'win', label: 'Hackathon Win', merit: 500, credits: 100, description: 'Secure a podium finish.', limit: 'Per win' },
  { id: 'internship', label: 'Internship Application', merit: 20, credits: 5, description: 'Apply via verified Nexus links.', limit: '3/day' },
  { id: 'contribution', label: 'Circle Contribution', merit: 30, credits: 10, description: 'High-value peer contribution.', limit: 'Peer-voted' },
];

export const REDEMPTION_OPTIONS = [
  { id: 'discount', label: '20% Premium Discount', cost: 500, description: 'Get 20% off your next month of Nexus Premium.', type: 'discount' },
  { id: 'autobuilder', label: 'Auto-Builder Access', cost: 200, description: '24-hour access to the elite squad synthesis engine.', type: 'unlock' },
  { id: 'mentorship', label: 'Mentorship Credit', cost: 1000, description: '₹50 off your next 1:1 mentorship session.', type: 'mentorship' },
];

export const STATUS_TIERS = [
  { name: 'Bronze', minXP: 0, color: 'text-stone-400', perk: 'Basic access' },
  { name: 'Silver', minXP: 1001, color: 'text-zinc-300', perk: 'Rising Talent Badge' },
  { name: 'Gold', minXP: 5001, color: 'text-amber-400', perk: 'Priority Squad Matching' },
  { name: 'Elite', minXP: 15001, color: 'text-indigo-400', perk: 'Nexus Verified Status' },
];

export const MOCK_SQUADS: Squad[] = [
  {
    id: 'squad-1',
    name: "Cloud Sentinels",
    type: 'Hackathon',
    members: [
      { id: '1', name: 'Arjun S.', role: 'Frontend', skills: ['React', 'TS'], mindsetScore: 98, activityScore: 95 },
      { id: '2', name: 'Sneha P.', role: 'Backend', skills: ['Go', 'Docker'], mindsetScore: 95, activityScore: 88 },
      { id: '3', name: 'Rohan K.', role: 'UI/UX', skills: ['Figma', 'Prototyping'], mindsetScore: 92, activityScore: 42 }
    ],
    activityLevel: 75,
    goal: "Win 'Solve for Tomorrow' Hackathon",
    isHealthy: false
  },
  {
    id: 'squad-2',
    name: "DSA Grind Circle",
    type: 'Study Circle',
    members: [
      { id: '1', name: 'Arjun S.', role: 'Lead/Pitch', skills: ['Logic'], mindsetScore: 98, activityScore: 100 },
      { id: '4', name: 'Priya M.', role: 'Backend', skills: ['C++', 'Algorithms'], mindsetScore: 99, activityScore: 96 }
    ],
    activityLevel: 98,
    goal: "Master Dynamic Programming",
    isHealthy: true
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '7 Day Streak', description: 'Maintained consistency for a week.', date: '2023-10-20', merit: 100 },
  { id: 'a2', title: 'Code Warrior', description: 'Participated in first Hackathon.', date: '2023-10-15', merit: 500 }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'ai-companion', label: 'AI Growth Companion', icon: <MessageSquareCode size={20} /> },
  { id: 'squads', label: 'Squad Builder', icon: <Users size={20} /> },
  { id: 'learning', label: 'Learning Path', icon: <BookOpen size={20} /> },
  { id: 'mentorship', label: 'Mentorship', icon: <Sparkles size={20} /> },
  { id: 'analytics', label: 'Growth Analytics', icon: <BarChart3 size={20} /> },
  { id: 'rewards', label: 'Rewards Hub', icon: <Trophy size={20} /> },
];
