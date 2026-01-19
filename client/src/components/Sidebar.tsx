
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewState, User, Habit } from '../types';
import { LogOut, LogIn, Circle, CheckCircle2, Flame, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  user: User | null;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  today: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, onLoginClick, user, habits, onToggleHabit, today }) => {
  // Group habits by category
  const habitsByCategory = React.useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    if (habits) {
      habits.forEach(habit => {
        if (!groups[habit.category]) {
          groups[habit.category] = [];
        }
        groups[habit.category].push(habit);
      });
    }
    return groups;
  }, [habits]);

  return (
    <>
      {/* Horizontal Navigation Bar at Top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles
                size={28}
                className="text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse will-change-transform"
                fill="currentColor"
              />
              <div className="absolute inset-0 blur-lg bg-green-400/30 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-emerald-600 tracking-tighter drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]">
              HabitFlow
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${currentView === item.id
                  ? 'bg-gradient-to-r from-green-500/20 to-green-500/5 text-green-400 font-bold shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]'
                  }`}
              >
                {item.icon}
                <span className={`${currentView === item.id ? 'tracking-wide' : ''} hidden md:inline`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Vertical Sidebar with Habits List */}
      <aside className="fixed left-0 top-16 bottom-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Your Habits</h3>
        </div>
        {habits.length > 0 ? (
          <div className="flex-1 px-4 py-4 space-y-6">
            {Object.entries(habitsByCategory).map(([category, categoryHabits]: [string, Habit[]]) => (
              <div key={category} className="space-y-2">
                <h3
                  className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg inline-block mb-1 border border-white/5 transition-all hover:scale-105 select-none"
                  style={{
                    color: categoryHabits[0].color,
                    backgroundColor: `${categoryHabits[0].color}10`,
                    boxShadow: `0 0 15px -5px ${categoryHabits[0].color}40`,
                    textShadow: `0 0 10px ${categoryHabits[0].color}60`
                  }}
                >
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryHabits.map(habit => {
                    const isCompleted = habit.completedDays.includes(today);
                    return (
                      <button
                        key={habit.id}
                        onClick={() => onToggleHabit(habit.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group relative overflow-hidden"
                      >
                        {/* Glowing background effect on hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                          style={{ background: `linear-gradient(90deg, transparent, ${habit.color}, transparent)` }}
                        />

                        <div style={{ color: isCompleted ? habit.color : '#4b5563' }} className="transition-colors relative z-10">
                          {isCompleted ? (
                            <CheckCircle2 size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                          ) : (
                            <Circle size={18} />
                          )}
                        </div>
                        <div className="flex-1 text-left relative z-10">
                          <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {habit.name}
                          </p>
                          {habit.streak > 0 && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: habit.color }}>
                                <Flame size={10} className="fill-current animate-pulse" />
                                {habit.streak} STREAK
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p className="text-gray-600 text-sm">No habits yet. Create your first habit!</p>
          </div>
        )}

        <div className="p-4 border-t border-white/5 mt-auto">
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
      </aside >
    </>
  );
};

export default React.memo(Sidebar);
