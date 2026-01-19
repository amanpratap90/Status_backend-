
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewState, User } from '../types';
import { LogOut, LogIn } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, onLoginClick, user }) => {
  return (
    <aside className="w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tighter flex items-center gap-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
          HabitFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === item.id
              ? 'bg-gradient-to-r from-green-500/20 to-green-500/5 text-green-400 font-bold shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] border border-green-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]'
              }`}
          >
            {item.icon}
            <span className={currentView === item.id ? 'tracking-wide' : ''}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        {user ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl transition-all font-bold"
          >
            <LogIn size={20} />
            <span>Login to Sync</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
