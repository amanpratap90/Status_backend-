
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import ActivityMap from './components/ActivityMap';
import HabitItem from './components/HabitItem';
import HabitCharts from './components/HabitCharts';
import NotesSection from './components/NotesSection';
import DailyProgressHistogram from './components/DailyProgressHistogram';
import CalendarTracker from './components/CalendarTracker';
import { ViewState, Habit, User } from './types';
import { calculateStats, login, register, logout, getCurrentUser } from './services/api';
import { useHabits, useCreateHabit, useDeleteHabit, useToggleHabit, useToggleSubtask } from './hooks/useData';
import { Flame, Target, CheckCircle2, Calendar, Plus, X, Loader2, ListPlus, User as UserIcon, Mail, Shield, LogOut } from 'lucide-react';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // React Query Hooks
  const { data: habits = [], isLoading } = useHabits();
  const createHabitMutation = useCreateHabit();
  const deleteHabitMutation = useDeleteHabit();
  const toggleHabitMutation = useToggleHabit();
  const toggleSubtaskMutation = useToggleSubtask();

  // Auth Form State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // New Habit State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [newSubtasks, setNewSubtasks] = useState<string[]>([]);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const stats = useMemo(() => calculateStats(habits), [habits]);

  const handleAuth = async (e: React.FormEvent) => {
    // Auth logic remains manual as it sets user session
    e.preventDefault();
    setAuthError('');
    try {
      let loggedUser = null;
      if (isLoginMode) {
        loggedUser = await login(authEmail, authPassword);
      } else {
        loggedUser = await register(authName, authEmail, authPassword);
      }

      if (loggedUser) {
        setUser(loggedUser);
        setIsAuthModalOpen(false);
        if (isModalOpen === false) setIsModalOpen(true);
      } else {
        setAuthError('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setAuthError('An error occurred during authentication.');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView(ViewState.DASHBOARD);
    // React Query cache will naturally be stale/invalid but we could clear it if needed
  };

  const handleOpenAddHabit = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setNewSubtasks([...newSubtasks, subtaskInput.trim()]);
      setSubtaskInput('');
    }
  };

  const handleAddHabit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newHabitName || 'New Habit',
      description: '',
      category: newHabitCategory,
      createdAt: new Date().toISOString(),
      completedDays: [],
      streak: 0,
      color: '#22c55e',
      subtasks: newSubtasks.map(text => ({
        id: Math.random().toString(36).substr(2, 5),
        text,
        completed: false
      })),
      userId: user.id
    };
    await createHabitMutation.mutateAsync(habit);
    setIsModalOpen(false);
    resetNewHabitFields();
  };

  const resetNewHabitFields = () => {
    setNewHabitName('');
    setNewHabitCategory('Health');
    setNewSubtasks([]);
    setSubtaskInput('');
  };

  const handleToggle = async (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    await toggleHabitMutation.mutateAsync({ id, date: today });
  };

  const handleToggleDateBulk = async (dateStr: string, shouldComplete: boolean) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Loop through affected habits and toggle individually
    // Note: Ideally backend supports bulk, but we loop here
    for (const h of habits) {
      const isDone = h.completedDays.includes(dateStr);
      if ((shouldComplete && !isDone) || (!shouldComplete && isDone)) {
        toggleHabitMutation.mutate({ id: h.id, date: dateStr });
      }
    }
  };

  const handleToggleSubtask = async (hId: string, sId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    await toggleSubtaskMutation.mutateAsync({ habitId: hId, subtaskId: sId });
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (confirm('Delete this habit?')) {
      await deleteHabitMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-[#050505] text-white">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onLoginClick={() => setIsAuthModalOpen(true)}
        user={user}
      />

      <main className="flex-1 ml-64 p-12 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-start mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-4xl font-bold mb-2">
              {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Start Your Flow'}
            </h2>
            <p className="text-gray-400 font-medium tracking-wide">{todayFormatted}</p>
          </div>
          <button
            onClick={handleOpenAddHabit}
            className="w-14 h-14 bg-green-500 hover:bg-green-400 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 transition-all hover:scale-105"
          >
            <Plus size={32} />
          </button>
        </header>

        {isLoading && habits.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : (
          <>
            {currentView === ViewState.DASHBOARD && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Best Streak" value={stats.currentStreak} icon={<Flame size={20} />} colorClass="text-orange-500" />
                  <StatsCard title="Goal Accuracy" value={`${stats.completionRate}%`} icon={<Target size={20} />} colorClass="text-green-500" />
                  <StatsCard title="Total Wins" value={stats.totalCheckIns} icon={<CheckCircle2 size={20} />} colorClass="text-blue-500" />
                  <StatsCard title="Flow States" value={stats.activeHabits} icon={<Calendar size={20} />} colorClass="text-purple-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CalendarTracker habits={habits} onToggleDate={handleToggleDateBulk} />
                  <div className="space-y-8">
                    <HabitCharts habits={habits} />
                    <DailyProgressHistogram habits={habits} />
                  </div>
                </div>

                <ActivityMap habits={habits} />

                <section className="mt-12">
                  <h3 className="text-xl font-bold mb-6">Today's Focus</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {habits.length === 0 ? (
                      <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-gray-600 mb-4">You haven't tracked anything yet.</p>
                        <button onClick={handleOpenAddHabit} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all">
                          {user ? 'Add Your First Habit' : 'Sign In to Start Tracking'}
                        </button>
                      </div>
                    ) : (
                      habits.map(habit => (
                        <HabitItem key={habit.id} habit={habit} onToggle={handleToggle} onDelete={handleDelete} onToggleSubtask={handleToggleSubtask} today={today} />
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {currentView === ViewState.HABITS && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-3xl font-bold mb-8">Manage Habits</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {habits.map(habit => (
                    <HabitItem key={habit.id} habit={habit} onToggle={handleToggle} onDelete={handleDelete} onToggleSubtask={handleToggleSubtask} today={today} />
                  ))}
                  <button
                    onClick={handleOpenAddHabit}
                    className="bg-[#141414] border border-white/5 border-dashed rounded-2xl p-6 flex items-center justify-center gap-3 text-gray-500 hover:border-green-500/50 hover:text-green-500 transition-all group"
                  >
                    <Plus className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Add New Routine</span>
                  </button>
                </div>
              </section>
            )}

            {currentView === ViewState.NOTES && <NotesSection />}

            {currentView === ViewState.SETTINGS && (
              <div className="space-y-10 animate-in fade-in zoom-in duration-300">
                {user ? (
                  <>
                    <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-green-500 to-emerald-800 flex items-center justify-center text-5xl font-black text-black shadow-xl">
                          {user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-xl border-4 border-[#141414] text-black">
                          <Shield size={16} />
                        </div>
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-3xl font-bold mb-1">{user.name}</h3>
                        <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mb-4">
                          <Mail size={16} /> {user.email}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 border border-white/5">
                            Member since {new Date().getFullYear()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-[#141414] border border-white/5 rounded-3xl p-8">
                        <h4 className="text-xl font-bold mb-6 flex items-center gap-2"><UserIcon size={20} className="text-green-500" /> Account Details</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                              <p className="font-bold">Full Name</p>
                              <p className="text-sm text-gray-500">{user.name}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                              <p className="font-bold">Email Address</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#141414] border border-white/5 rounded-3xl p-8">
                        <h4 className="text-xl font-bold mb-6">Preference Hub</h4>
                        <div className="space-y-4">
                          <button className="w-full py-4 text-left px-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm">Export My Data (JSON)</button>
                          <div className="pt-4 mt-4 border-t border-white/5">
                            <button className="w-full py-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-2xl hover:bg-red-500/10 transition-all font-bold text-sm">Delete Account & Data</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <UserIcon size={40} />
                    </div>
                    <h3 className="text-3xl font-bold">Join the Community</h3>
                    <p className="text-gray-400 max-w-md mx-auto">Create an account to sync your habits across devices, unlock advanced analytics, and save your progress permanently.</p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-10 py-4 bg-green-500 text-black font-black text-xl rounded-2xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/20"
                    >
                      Login or Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          setIsAuthModalOpen(false);
          if (isModalOpen === false) setIsModalOpen(true);
        }}
      />

      {/* Add Habit Modal */}
      {isModalOpen && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] w-full max-w-lg rounded-[2.5rem] p-10 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight">Create Habit</h3>
              <button onClick={() => { setIsModalOpen(false); resetNewHabitFields(); }} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">The Goal</label>
                <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="e.g. Master React" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 text-white placeholder-gray-700 text-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Category</label>
                <select value={newHabitCategory} onChange={(e) => setNewHabitCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-green-500 text-white appearance-none">
                  <option value="Health">Health</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Finance">Finance</option>
                  <option value="Social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Subtasks (Steps)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={subtaskInput} onChange={(e) => setSubtaskInput(e.target.value)} placeholder="Add a step..." onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-green-500 text-white" />
                  <button onClick={handleAddSubtask} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><ListPlus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
                  {newSubtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-xs group animate-in slide-in-from-left-2">
                      <span className="text-gray-300">{st}</span>
                      <button onClick={() => setNewSubtasks(newSubtasks.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500 transition-colors"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleAddHabit} className="w-full py-5 bg-green-500 text-black font-black text-xl rounded-2xl hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 mt-4 active:scale-95">Launch Flow</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
