export interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
  details: string[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}
