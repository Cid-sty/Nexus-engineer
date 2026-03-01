
export interface Skill {
  name: string;
  level: number; // 0-100
}

export type EngineerRole = 'Frontend' | 'Backend' | 'UI/UX' | 'Lead/Pitch' | 'DevOps';

export type StatusTier = 'Bronze' | 'Silver' | 'Gold' | 'Elite';

export interface UserProfile {
  name: string;
  college: string;
  year: number;
  commitmentHours: number;
  dedicationLevel: 'Moderate' | 'High' | 'Extremely High';
  learningStyle: 'Project-based' | 'Theoretical' | 'Collaborative';
  primaryGoal: string;
  skills: Skill[];
  skillsToLearn: string[];
  preferredRole: EngineerRole;
  merit: number; // XP
  credits: number; // Spendable NC
  tier: StatusTier;
  streak: number;
  lastCheckIn?: string;
  location: string;
  isOnboarded: boolean;
  goals?: string[];
  commitment?: string;
  style?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: EngineerRole;
  skills: string[];
  mindsetScore: number;
  activityScore: number; // 0-100 for rebalancing logic
}

export interface Squad {
  id: string;
  name: string;
  type: 'Hackathon' | 'Study Circle' | 'Research';
  members: TeamMember[];
  activityLevel: number; // 0-100
  goal: string;
  isHealthy: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  merit: number;
}

export interface RewardActivity {
  id: string;
  label: string;
  merit: number;
  credits: number;
  icon: string;
  description: string;
  limit?: string;
}

export interface RedemptionOption {
  id: string;
  label: string;
  cost: number;
  description: string;
  type: 'discount' | 'unlock' | 'mentorship';
}

export type ViewType = 'dashboard' | 'squads' | 'learning' | 'analytics' | 'rewards' | 'ai-companion' | 'mentorship' | 'profile';
