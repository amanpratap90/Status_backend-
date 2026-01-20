import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../services/storage';
import { User } from '../types';
import axios from 'axios';

// Configure your backend URL here
export const API_URL = 'https://status-backend-1.onrender.com/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            console.log('Loading storage data...');
            const [storedUser, storedToken] = await Promise.all([
                storage.getUser(),
                storage.getToken(),
            ]);

            console.log('Stored User:', storedUser);
            console.log('Stored Token:', storedToken ? 'Present' : 'Missing');

            if (storedUser && storedToken) {
                setUser(storedUser);
                setToken(storedToken);

                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error('Failed to load auth data', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add logging interceptor
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                console.log('API Error:', error.message);
                if (error.response) {
                    console.log('Response status:', error.response.status);
                    console.log('Response data:', error.response.data);
                } else if (error.request) {
                    console.log('No response received:', error.request);
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (newToken: string, newUser: User) => {
        try {
            await Promise.all([
                storage.setToken(newToken),
                storage.setUser(newUser),
            ]);

            setToken(newToken);
            setUser(newUser);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                storage.removeToken(),
                storage.removeUser(),
            ]);

            setToken(null);
            setUser(null);

            delete axios.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const updateUser = async (updatedUser: User) => {
        try {
            await storage.setUser(updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('Update user error', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
