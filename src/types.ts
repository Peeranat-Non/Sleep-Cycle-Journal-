export type CalculatorMode = 'wake' | 'bed';

export interface CycleResult {
  cycles: number;
  timeFormatted: string; // HH:mm format
  totalMinutes: number;
  hours: number;
  minutes: number;
  isRecommended?: boolean;
  tag?: string;
  subtext: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  value: MoodLevel;
  emoji: string;
  label: string;
  description: string;
}

export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationMinutes: number;
  durationFormatted: string; // e.g. "7 ชม. 30 นาที"
  rating: number; // 1 to 5
  mood: MoodLevel;
  note: string; // max 100 characters
  createdAt: number; // timestamp
}
