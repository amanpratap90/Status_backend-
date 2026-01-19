import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, Key, LogIn, X, Loader2, User as UserIcon } from 'lucide-react';
import { login, register } from '../services/api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setIsLoading(true);
        try {
            let loggedUser = null;
            if (isLoginMode) {
                loggedUser = await login(authEmail, authPassword);
            } else {
                loggedUser = await register(authName, authEmail, authPassword);
            }

            if (loggedUser) {
                onAuthSuccess(loggedUser);
                onClose();
            } else {
                setAuthError('Authentication failed. Please check your credentials.');
            }
        } catch (err) {
            setAuthError('An error occurred during authentication.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#141414] w-full max-w-md border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold tracking-tight">{isLoginMode ? 'Welcome Back' : 'Get Started'}</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
                    <button
                        onClick={() => { setIsLoginMode(true); setAuthError(''); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${isLoginMode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLoginMode(false); setAuthError(''); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isLoginMode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLoginMode && (
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={authName}
                                onChange={e => setAuthName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-green-500 text-white"
                            />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={authEmail}
                            onChange={e => setAuthEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-green-500 text-white"
                        />
                    </div>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={authPassword}
                            onChange={e => setAuthPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-green-500 text-white"
                        />
                    </div>
                    {authError && <p className="text-red-500 text-xs text-center animate-pulse">{authError}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-5 bg-green-500 text-black font-black text-lg rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-500/20">
                        {isLoading ? <Loader2 className="animate-spin" /> : (isLoginMode ? 'Enter Flow' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
