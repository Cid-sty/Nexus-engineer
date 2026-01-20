
export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface UserProfile {
  name: string;
  college: string;
  year: number;
  commitmentHours: number;
  dedicationLevel: 'Moderate' | 'High' | 'Extremely High';
  learningStyle: 'Project-based' | 'Theoretical' | 'Collaborative';
  primaryGoal: string;
  skills: Skill[];
  points: number;
  streak: number;
  location: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  mindsetScore: number;
}

export interface Squad {
  id: string;
  name: string;
  type: 'Hackathon' | 'Study Circle' | 'Research';
  members: TeamMember[];
  activityLevel: number; // 0-100
  goal: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
}

export type ViewType = 'dashboard' | 'squads' | 'learning' | 'analytics' | 'rewards' | 'ai-companion';
