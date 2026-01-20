
import React from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart3, Trophy, MessageSquareCode } from 'lucide-react';
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
  points: 1250,
  streak: 14,
  location: "Gandhinagar, Gujarat"
};

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
  { id: 'a1', title: '7 Day Streak', description: 'Maintained consistency for a week.', date: '2023-10-20', points: 100 },
  { id: 'a2', title: 'Code Warrior', description: 'Participated in first Hackathon.', date: '2023-10-15', points: 500 }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'ai-companion', label: 'AI Growth Companion', icon: <MessageSquareCode size={20} /> },
  { id: 'squads', label: 'Squad Builder', icon: <Users size={20} /> },
  { id: 'learning', label: 'Learning Path', icon: <BookOpen size={20} /> },
  { id: 'analytics', label: 'Growth Analytics', icon: <BarChart3 size={20} /> },
  { id: 'rewards', label: 'Rewards Hub', icon: <Trophy size={20} /> },
];
