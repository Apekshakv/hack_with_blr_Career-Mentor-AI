// Career Mentor Data Types
export interface Skill {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  dateAdded: Date;
  category: 'frontend' | 'backend' | 'data' | 'devops' | 'soft' | 'other';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  dateCompleted: Date;
  link?: string;
  impact?: string;
}

export interface InternshipApplication {
  id: string;
  company: string;
  position: string;
  appliedDate: Date;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  notes?: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  currentRole?: string;
  targetRole?: string;
  skills: Skill[];
  projects: Project[];
  applications: InternshipApplication[];
  resume?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorMemory {
  experiences: string[]; // User's career experiences
  observations: string[]; // AI insights about user
  mentalModels: string[]; // User's goals and preferences
}

export interface FeedbackResult {
  category: string;
  feedback: string;
  suggestions: string[];
  score?: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: string;
  requiredLevel: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  resources?: string[];
}
