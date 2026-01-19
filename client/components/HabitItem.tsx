
import React, { useState } from 'react';
import { CheckCircle2, Circle, Flame, Trash2, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (habitId: string, subtaskId: string) => void;
  today: string;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onDelete, onToggleSubtask, today }) => {
  const isCompleted = habit.completedDays.includes(today);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group bg-[#141414] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`, // Default border-like shadow
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px -5px ${habit.color}40, 0 0 0 1px ${habit.color}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.05)`;
      }}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggle(habit.id)}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: isCompleted ? habit.color : '#4b5563' }}
          >
            {isCompleted ? (
              <CheckCircle2 size={24} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            ) : (
              <Circle size={24} />
            )}
          </button>
          <div>
            <h4 className={`font-bold text-lg transition-all ${isCompleted ? 'text-gray-500 line-through decoration-white/20' : 'text-white'}`}>
              {habit.name}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white font-bold tracking-wide border border-white/5"
                style={{ backgroundColor: `${habit.color}20`, borderColor: `${habit.color}40` }}
              >
                {habit.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest" style={{ color: habit.color }}>
                <Flame size={12} className={habit.streak > 0 ? "fill-current animate-pulse" : ""} />
                {habit.streak} streak
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {habit.subtasks.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isExpanded && habit.subtasks.length > 0 && (
        <div className="px-12 pb-4 space-y-2 border-t border-white/5 pt-4 bg-white/[0.02]">
          {habit.subtasks.map(sub => (
            <div
              key={sub.id}
              onClick={() => onToggleSubtask(habit.id, sub.id)}
              className="flex items-center gap-3 text-sm cursor-pointer hover:text-white transition-colors text-gray-400 group/sub"
            >
              <div className={`transition-all ${sub.completed ? 'text-green-500' : 'text-gray-600 group-hover/sub:text-gray-400'}`}>
                {sub.completed ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <span className={sub.completed ? 'line-through text-gray-600 decoration-gray-700' : ''}>{sub.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitItem;
