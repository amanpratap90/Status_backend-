
export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  completedDays: string[]; // ISO Date strings YYYY-MM-DD
  streak: number;
  color: string;
  subtasks: SubTask[];
  userId?: string;
}

export interface Note {
  id: string;
  content: string;
  color: string; // Hex color
  createdAt: string;
  userId?: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export enum ViewState {
  DASHBOARD = 'dashboard',
  HABITS = 'habits',
  NOTES = 'notes',
  SETTINGS = 'settings'
}

export interface UserStats {
  currentStreak: number;
  completionRate: number;
  totalCheckIns: number;
  activeHabits: number;
}
