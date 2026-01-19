
import React, { useMemo, useCallback } from 'react';
import { Habit } from '../types';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useDebouncedCallback } from '../hooks/useDebounce';

interface CalendarTrackerProps {
  habits: Habit[];
  onToggleDate: (dateStr: string, shouldComplete: boolean) => void;
}

const CalendarTracker: React.FC<CalendarTrackerProps> = ({ habits, onToggleDate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Debounce the toggle to prevent rapid successive calls
  const debouncedToggle = useDebouncedCallback(onToggleDate, 200);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Previous month padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, dateStr: '' });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];

      // Count completions for this day across all habits
      const completedHabitIds = habits
        .filter(h => h.completedDays.includes(dateStr))
        .map(h => h.id);

      days.push({
        day: i,
        dateStr,
        completionCount: completedHabitIds.length,
        isFullyCompleted: completedHabitIds.length > 0 && completedHabitIds.length === habits.length
      });
    }

    return days;
  }, [currentDate, habits]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const changeMonth = useCallback((offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleDayClick = useCallback((dateStr: string, currentCount: number) => {
    // If no habits are done, mark all as done (Tick)
    // If any are done, clear all for that day (Cross)
    const shouldCompleteAll = currentCount === 0;
    debouncedToggle(dateStr, shouldCompleteAll);
  }, [debouncedToggle]);

  return (
    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-8 shadow-xl hover:border-green-500/20 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.1)] transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold">{monthName} {year}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Interactive Tracker</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white border border-white/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-gray-600 uppercase mb-2">
            {day}
          </div>
        ))}

        {calendarData.map((item, index) => {
          if (item.day === null) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const isToday = item.dateStr === new Date().toISOString().split('T')[0];
          const hasCompletions = item.completionCount > 0;
          const isFullyDone = item.isFullyCompleted;

          let bgColor = 'bg-white/5';
          let borderColor = 'border-white/5';
          let textColor = 'text-gray-400';
          let glowClass = '';

          if (hasCompletions) {
            textColor = 'text-black';
            if (isFullyDone) {
              bgColor = 'bg-green-400';
              borderColor = 'border-green-300';
              glowClass = 'shadow-[0_0_20px_rgba(74,222,128,0.3)]';
            } else {
              bgColor = 'bg-green-600';
              borderColor = 'border-green-500';
              glowClass = 'shadow-[0_0_10px_rgba(22,163,74,0.2)]';
            }
          }

          if (isToday && !hasCompletions) {
            borderColor = 'border-blue-500/50';
            textColor = 'text-blue-400';
          }

          return (
            <button
              key={item.dateStr}
              onClick={() => handleDayClick(item.dateStr, item.completionCount)}
              className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all group relative overflow-hidden active:scale-90 ${bgColor} ${borderColor} ${glowClass}`}
            >
              <span className={`text-sm font-bold z-10 ${textColor}`}>
                {item.day}
              </span>

              {hasCompletions && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <Check size={40} strokeWidth={3} className={isFullyDone ? 'text-white' : 'text-green-200'} />
                </div>
              )}

              {/* Status indicators */}
              {item.completionCount > 0 && !isFullyDone && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {[...Array(Math.min(item.completionCount, 3))].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
                  ))}
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border border-white/10 font-bold">
                {item.completionCount === 0 ? 'Click to mark all done' : `${item.completionCount} done. Click to clear.`}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>All Done (Tick)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></div>
            <span>Missed (Cross)</span>
          </div>
        </div>
        <p className="italic text-[9px] lowercase opacity-50">Click any date to toggle</p>
      </div>
    </div>
  );
};

export default React.memo(CalendarTracker);
