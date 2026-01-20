import axios from 'axios';
import { Habit, ActivityDay, UserStats } from '../types';
import { API_URL } from '../context/AuthContext';

export const habitService = {
    async getHabits(): Promise<Habit[]> {
        const response = await axios.get(`${API_URL}/habits`);
        return response.data;
    },

    async createHabit(habitData: { name: string, description: string, category: string, color: string }): Promise<Habit> {
        const response = await axios.post(`${API_URL}/habits`, habitData);
        return response.data;
    },

    async updateHabitStatus(habitId: string, date: string, completed: boolean): Promise<Habit[]> {
        // Based on backend controller, it toggles. The 'completed' param is logically determined by client but backend just toggles based on date existence.
        // We pass 'date' in body.
        const response = await axios.put(`${API_URL}/habits/${habitId}/toggle`, {
            date
        });
        return response.data;
    },

    async getStats(): Promise<{ activity: ActivityDay[], stats: UserStats }> {
        const response = await axios.get(`${API_URL}/habits/stats`);
        return response.data;
    }
};
