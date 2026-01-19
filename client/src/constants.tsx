
import React from 'react';
import { LayoutDashboard, CheckSquare, Settings, StickyNote, Plus, Flame, Target, Calendar, CheckCircle2 } from 'lucide-react';

export const COLORS = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
];

export const NOTE_COLORS = [
  '#fde047', // Yellow
  '#f9a8d4', // Pink
  '#93c5fd', // Blue
  '#86efac', // Green
  '#fdba74', // Orange
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'habits', label: 'Habits', icon: <CheckSquare size={20} /> },
  { id: 'notes', label: 'Notes', icon: <StickyNote size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const CATEGORIES = ['Health', 'Work', 'Personal', 'Finance', 'Social'];
