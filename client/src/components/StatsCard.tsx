
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass }) => {
  // Map colorClass to specific styles for glow effects
  // We use explicit classes to ensure Tailwind scans them
  const getStyles = (cls: string) => {
    if (cls.includes('orange')) return {
      border: 'hover:border-orange-500/30',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]',
      bg: 'bg-orange-500/10',
      text: 'text-orange-500'
    };
    if (cls.includes('green')) return {
      border: 'hover:border-green-500/30',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]',
      bg: 'bg-green-500/10',
      text: 'text-green-500'
    };
    if (cls.includes('blue')) return {
      border: 'hover:border-blue-500/30',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500'
    };
    if (cls.includes('purple')) return {
      border: 'hover:border-purple-500/30',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
      bg: 'bg-purple-500/10',
      text: 'text-purple-500'
    };
    return {
      border: 'hover:border-white/10',
      shadow: '',
      bg: 'bg-white/5',
      text: 'text-white'
    };
  };

  const styles = getStyles(colorClass);

  return (
    <div className={`bg-[#141414] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 group ${styles.border} ${styles.shadow}`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.bg} ${styles.text}`}>
          {/* Clone element to force size if needed, or just render */}
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-bold mb-2 tracking-tight">{value}</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
