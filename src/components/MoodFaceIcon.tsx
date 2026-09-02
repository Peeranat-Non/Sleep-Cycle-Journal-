import React from 'react';
import { MoodLevel } from '../types';

export const MOOD_COLORS: Record<MoodLevel, { bg: string; hex: string; border: string; glow: string; label: string }> = {
  5: {
    bg: 'bg-[#1EB854]',
    hex: '#1EB854',
    border: 'border-[#1EB854]',
    glow: 'shadow-[#1EB854]/40',
    label: 'สดชื่นมาก',
  },
  4: {
    bg: 'bg-[#88D03C]',
    hex: '#88D03C',
    border: 'border-[#88D03C]',
    glow: 'shadow-[#88D03C]/40',
    label: 'สดชื่นดี',
  },
  3: {
    bg: 'bg-[#FAC017]',
    hex: '#FAC017',
    border: 'border-[#FAC017]',
    glow: 'shadow-[#FAC017]/40',
    label: 'ปานกลาง',
  },
  2: {
    bg: 'bg-[#F97924]',
    hex: '#F97924',
    border: 'border-[#F97924]',
    glow: 'shadow-[#F97924]/40',
    label: 'งัวเงีย',
  },
  1: {
    bg: 'bg-[#EF4444]',
    hex: '#EF4444',
    border: 'border-[#EF4444]',
    glow: 'shadow-[#EF4444]/40',
    label: 'เพลียมาก',
  },
};

interface MoodFaceIconProps {
  mood: MoodLevel | number;
  size?: number; // size in px, e.g. 32, 40, 48
  className?: string;
  animate?: boolean;
}

export const MoodFaceIcon: React.FC<MoodFaceIconProps> = ({
  mood,
  size = 36,
  className = '',
  animate = false,
}) => {
  const safeMood = (Math.max(1, Math.min(5, Math.round(mood))) || 3) as MoodLevel;
  const moodData = MOOD_COLORS[safeMood];

  // Render SVG based on exact design in reference image
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 select-none ${animate ? 'transition-transform duration-200 hover:scale-110' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Mood face level ${safeMood} (${moodData.label})`}
      role="img"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill={moodData.hex} />

      {/* Eyes */}
      <circle cx="34" cy="40" r="6" fill="#111827" />
      <circle cx="66" cy="40" r="6" fill="#111827" />

      {/* Mouth based on Mood level from reference picture */}
      {safeMood === 5 && (
        /* Dark Green: Big smiling arc */
        <path
          d="M 28 55 C 34 76, 66 76, 72 55"
          fill="none"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}

      {safeMood === 4 && (
        /* Light Green: Friendly smiling arc */
        <path
          d="M 31 58 C 36 72, 64 72, 69 58"
          fill="none"
          stroke="#111827"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      )}

      {safeMood === 3 && (
        /* Yellow: Straight flat line */
        <line
          x1="30"
          y1="64"
          x2="70"
          y2="64"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}

      {safeMood === 2 && (
        /* Orange: Curved frown */
        <path
          d="M 31 68 C 36 54, 64 54, 69 68"
          fill="none"
          stroke="#111827"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      )}

      {safeMood === 1 && (
        /* Red: Deep curved frown */
        <path
          d="M 28 71 C 34 50, 66 50, 72 71"
          fill="none"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

interface MoodSpectrumBarProps {
  selectedMood: MoodLevel;
  onSelectMood?: (mood: MoodLevel) => void;
  className?: string;
}

export const MoodSpectrumBar: React.FC<MoodSpectrumBarProps> = ({
  selectedMood,
  onSelectMood,
  className = '',
}) => {
  const levels: MoodLevel[] = [5, 4, 3, 2, 1];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* 5-segment continuous bar matching reference picture */}
      <div className="w-full h-3 sm:h-3.5 rounded-full overflow-hidden flex shadow-inner border border-black/10 dark:border-white/10">
        {levels.map((level) => {
          const isSelected = selectedMood === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelectMood && onSelectMood(level)}
              aria-label={`Select mood level ${level}`}
              className={`h-full flex-1 transition-all ${MOOD_COLORS[level].bg} ${
                isSelected
                  ? 'brightness-110 ring-2 ring-white dark:ring-slate-900 z-10 scale-y-125'
                  : 'hover:brightness-105 opacity-90'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
