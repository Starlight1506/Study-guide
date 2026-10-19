import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Kunduzgi rejimga o'tish (Light Mode)" : "Tungi rejimga o'tish (Dark Mode - tungi darslar uchun)"}
      aria-label="Mavzuni almashtirish"
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8BA88E]/40 ${
        isDark 
          ? 'bg-[#1C261E] border-[#2C3E2D] text-[#8BA88E] hover:text-white hover:bg-[#253328]' 
          : 'bg-[#F5F5F0] border-[#EBE7DF] text-[#2C3E2D] hover:text-[#1A2E1C] hover:bg-[#EBE7DF]'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold whitespace-nowrap">
          {isDark ? 'Tungi rejim' : 'Kunduzgi rejim'}
        </span>
      )}
    </button>
  );
};
