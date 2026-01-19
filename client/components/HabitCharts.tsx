
import React, { useMemo } from 'react';
import { Habit } from '../types';

interface HabitChartsProps {
  habits: Habit[];
}

const HabitCharts: React.FC<HabitChartsProps> = ({ habits }) => {
  const weeklyData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = habits.filter(h => h.completedDays.includes(date)).length;
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { dayName, count };
    });
  }, [habits]);

  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Weekly Progress Bar Chart */}
      <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 hover:border-green-500/20 hover:shadow-[0_0_20px_-5px_rgba(34,197,94,0.1)] transition-all duration-300">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
          Weekly Activity
        </h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className="w-full bg-white/5 rounded-t-xl transition-all duration-300 group-hover:bg-green-500 relative overflow-hidden"
                style={{ height: `${Math.max((d.count / maxCount) * 100, 10)}%` }} // Ensure visible min-height
              >
                <div className="absolute inset-0 bg-green-500/20 group-hover:bg-green-500 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all"></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-black font-bold text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  {d.count}
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">{d.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Distribution Ring */}
      <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center hover:border-blue-500/20 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.1)] transition-all duration-300">
        <h3 className="w-full font-semibold text-lg mb-4 text-left">Monthly Distribution</h3>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="58"
              stroke="currentColor" strokeWidth="10"
              fill="transparent" className="text-white/5"
            />
            <circle
              cx="64" cy="64" r="58"
              stroke="currentColor" strokeWidth="10"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * Math.min(1, habits.length / 10))}
              strokeLinecap="round"
              className="text-green-500 transition-all duration-1000"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{habits.length}</span>
            <span className="text-[10px] text-gray-500 uppercase">Habits</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-500">{habits.filter(h => h.completedDays.length > 0).length}</p>
            <p className="text-[10px] text-gray-500 uppercase">Active</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-orange-500">{habits.reduce((sum, h) => sum + h.streak, 0)}</p>
            <p className="text-[10px] text-gray-500 uppercase">Total Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCharts;
