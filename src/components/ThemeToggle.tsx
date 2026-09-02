import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
      title={isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
      className={`relative inline-flex items-center justify-between p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg active:scale-95 ${
        isDark
          ? 'bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-200'
          : 'bg-white/95 border border-slate-200 hover:border-slate-300 text-slate-800 shadow-slate-200'
      } ${className}`}
    >
      {/* Sliding Pill Indicator */}
      <div
        className={`absolute top-1 bottom-1 w-[26px] rounded-full transition-transform duration-300 ease-in-out shadow-sm flex items-center justify-center ${
          isDark
            ? 'left-1 translate-x-0 bg-indigo-600 text-white'
            : 'left-1 translate-x-[28px] bg-amber-500 text-white'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-white text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-white text-white" />
        )}
      </div>

      {/* Background Icons */}
      <div className="flex items-center gap-2 px-1 text-xs font-medium">
        <span
          className={`w-6 h-6 flex items-center justify-center rounded-full transition-opacity duration-200 ${
            isDark ? 'opacity-100 text-indigo-300' : 'opacity-40 text-slate-400'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </span>
        <span
          className={`w-6 h-6 flex items-center justify-center rounded-full transition-opacity duration-200 ${
            !isDark ? 'opacity-100 text-amber-500' : 'opacity-40 text-slate-400'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </span>
      </div>

      <span className="sr-only">
        {isDark ? 'โหมดมืด (Dark Mode)' : 'โหมดสว่าง (Light Mode)'}
      </span>
    </button>
  );
};
