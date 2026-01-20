
export interface Skill {
  name: string;
  level: number; // 0-100
}

export type EngineerRole = 'Frontend' | 'Backend' | 'UI/UX' | 'Lead/Pitch' | 'DevOps';

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
  points: number;
  streak: number;
  location: string;
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
  points: number;
}

export type ViewType = 'dashboard' | 'squads' | 'learning' | 'analytics' | 'rewards' | 'ai-companion';
