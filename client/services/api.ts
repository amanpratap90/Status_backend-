
import { Habit, UserStats, Note, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

const LOCAL_HABITS_KEY = 'habitflow_habits_backup';
const LOCAL_NOTES_KEY = 'habitflow_notes_backup';
const USER_SESSION_KEY = 'habitflow_user_session';

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    const user = await response.json();
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    const user = await response.json();
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(USER_SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(USER_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Helper to handle fallbacks to LocalStorage
const getLocalData = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// HABITS API
export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await fetch(`${API_BASE}/habits`);
    if (!response.ok) throw new Error('Server unreachable');
    const data = await response.json();
    saveLocalData(LOCAL_HABITS_KEY, data);
    return data;
  } catch (error) {
    return getLocalData<Habit>(LOCAL_HABITS_KEY);
  }
};

export const saveHabit = async (habit: Habit): Promise<Habit[]> => {
  try {
    const response = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit),
    });
    const data = await response.json();
    saveLocalData(LOCAL_HABITS_KEY, data);
    return data;
  } catch (error) {
    const habits = getLocalData<Habit>(LOCAL_HABITS_KEY);
    const updated = [habit, ...habits];
    saveLocalData(LOCAL_HABITS_KEY, updated);
    return updated;
  }
};

export const deleteHabit = async (id: string): Promise<Habit[]> => {
  try {
    const response = await fetch(`${API_BASE}/habits/${id}`, { method: 'DELETE' });
    const data = await response.json();
    saveLocalData(LOCAL_HABITS_KEY, data);
    return data;
  } catch (error) {
    const habits = getLocalData<Habit>(LOCAL_HABITS_KEY);
    const updated = habits.filter(h => h.id !== id);
    saveLocalData(LOCAL_HABITS_KEY, updated);
    return updated;
  }
};

export const toggleHabitCompletion = async (id: string, date: string): Promise<Habit[]> => {
  try {
    const response = await fetch(`${API_BASE}/habits/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    const data = await response.json();
    saveLocalData(LOCAL_HABITS_KEY, data);
    return data;
  } catch (error) {
    const habits = getLocalData<Habit>(LOCAL_HABITS_KEY);
    const updated = habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDays.includes(date);
        const newCompletedDays = isCompleted
          ? h.completedDays.filter(d => d !== date)
          : [...h.completedDays, date];
        return { ...h, completedDays: newCompletedDays, streak: newCompletedDays.length };
      }
      return h;
    });
    saveLocalData(LOCAL_HABITS_KEY, updated);
    return updated;
  }
};

export const toggleSubtask = async (habitId: string, subtaskId: string): Promise<Habit[]> => {
  try {
    const response = await fetch(`${API_BASE}/habits/${habitId}/subtask/${subtaskId}`, { method: 'PATCH' });
    const data = await response.json();
    saveLocalData(LOCAL_HABITS_KEY, data);
    return data;
  } catch (error) {
    const habits = getLocalData<Habit>(LOCAL_HABITS_KEY);
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const subtasks = h.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        return { ...h, subtasks };
      }
      return h;
    });
    saveLocalData(LOCAL_HABITS_KEY, updated);
    return updated;
  }
};

// NOTES API
export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE}/notes`);
    const data = await response.json();
    saveLocalData(LOCAL_NOTES_KEY, data);
    return data;
  } catch (error) {
    return getLocalData<Note>(LOCAL_NOTES_KEY);
  }
};

export const saveNote = async (note: Note): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    saveLocalData(LOCAL_NOTES_KEY, data);
    return data;
  } catch (error) {
    const notes = getLocalData<Note>(LOCAL_NOTES_KEY);
    const updated = [note, ...notes];
    saveLocalData(LOCAL_NOTES_KEY, updated);
    return updated;
  }
};

export const deleteNote = async (id: string): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    const data = await response.json();
    saveLocalData(LOCAL_NOTES_KEY, data);
    return data;
  } catch (error) {
    const notes = getLocalData<Note>(LOCAL_NOTES_KEY);
    const updated = notes.filter(n => n.id !== id);
    saveLocalData(LOCAL_NOTES_KEY, updated);
    return updated;
  }
};

export const calculateStats = (habits: Habit[]): UserStats => {
  const totalHabits = habits.length;
  const totalCheckIns = habits.reduce((acc, h) => acc + (h.completedDays?.length || 0), 0);
  const currentStreak = habits.length > 0 ? Math.max(0, ...habits.map(h => h.streak || 0)) : 0;
  const completionRate = totalHabits > 0 ? Math.round((totalCheckIns / (totalHabits * 30)) * 100) : 0;

  return {
    currentStreak,
    completionRate: Math.min(100, completionRate),
    totalCheckIns,
    activeHabits: totalHabits
  };
};
