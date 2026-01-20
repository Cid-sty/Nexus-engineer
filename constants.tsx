
import React from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart3, Trophy, MessageSquareCode } from 'lucide-react';
import { UserProfile, Squad, Achievement, ViewType } from './types';

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
    { name: 'TypeScript', level: 65 },
    { name: 'System Design', level: 40 }
  ],
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
      { id: '1', name: 'Arjun S.', role: 'Frontend', skills: ['React', 'TS'], mindsetScore: 98 },
      { id: '2', name: 'Sneha P.', role: 'Backend', skills: ['Go', 'Docker'], mindsetScore: 95 },
      { id: '3', name: 'Rohan K.', role: 'Design', skills: ['Figma', 'UI/UX'], mindsetScore: 92 }
    ],
    activityLevel: 88,
    goal: "Win 'Solve for Tomorrow' Hackathon"
  },
  {
    id: 'squad-2',
    name: "DSA Grind Circle",
    type: 'Study Circle',
    members: [
      { id: '1', name: 'Arjun S.', role: 'Learner', skills: ['Logic'], mindsetScore: 98 },
      { id: '4', name: 'Priya M.', role: 'Lead', skills: ['C++', 'Algorithms'], mindsetScore: 99 }
    ],
    activityLevel: 94,
    goal: "Master Dynamic Programming"
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '7 Day Streak', description: 'Maintained consistency for a week.', date: '2023-10-20', points: 100 },
  { id: 'a2', title: 'Code Warrior', description: 'Participated in first Hackathon.', date: '2023-10-15', points: 500 }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'ai-companion', label: 'AI Growth Companion', icon: <MessageSquareCode size={20} /> },
  { id: 'squads', label: 'My Squads', icon: <Users size={20} /> },
  { id: 'learning', label: 'Learning Path', icon: <BookOpen size={20} /> },
  { id: 'analytics', label: 'Growth Analytics', icon: <BarChart3 size={20} /> },
  { id: 'rewards', label: 'Rewards Hub', icon: <Trophy size={20} /> },
];
