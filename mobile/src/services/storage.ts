import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    HABITS: 'habitflow_habits_backup',
    NOTES: 'habitflow_notes_backup',
    USER_SESSION: 'habitflow_user_session',
    AUTH_TOKEN: 'habitflow_auth_token',
    SYNC_QUEUE: 'habitflow_sync_queue',
} as const;

export const storage = {
    // Generic get/set
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    },

    async set<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },

    // Specific data accessors
    getHabits: () => storage.get<any[]>(STORAGE_KEYS.HABITS),
    setHabits: (habits: any[]) => storage.set(STORAGE_KEYS.HABITS, habits),

    getNotes: () => storage.get<any[]>(STORAGE_KEYS.NOTES),
    setNotes: (notes: any[]) => storage.set(STORAGE_KEYS.NOTES, notes),

    getUser: () => storage.get<any>(STORAGE_KEYS.USER_SESSION),
    setUser: (user: any) => storage.set(STORAGE_KEYS.USER_SESSION, user),
    removeUser: () => storage.remove(STORAGE_KEYS.USER_SESSION),

    getToken: () => storage.get<string>(STORAGE_KEYS.AUTH_TOKEN),
    setToken: (token: string) => storage.set(STORAGE_KEYS.AUTH_TOKEN, token),
    removeToken: () => storage.remove(STORAGE_KEYS.AUTH_TOKEN),

    getSyncQueue: () => storage.get<any[]>(STORAGE_KEYS.SYNC_QUEUE),
    setSyncQueue: (queue: any[]) => storage.set(STORAGE_KEYS.SYNC_QUEUE, queue),
};
