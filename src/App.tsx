import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SleepCycleCalculator } from './components/SleepCycleCalculator';
import { SleepJournalForm } from './components/SleepJournalForm';
import { SleepJournalHistory } from './components/SleepJournalHistory';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { SleepRecord } from './types';

const STORAGE_KEY = 'non_bang_sleep_journal_records_v1';
const SAVED_SELECTED_TIME_KEY = 'non_bang_selected_sleep_time_v1';

// Initial sample entries so the user immediately experiences the journal
const INITIAL_SAMPLE_RECORDS: SleepRecord[] = [
  {
    id: 'sample-1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    bedTime: '23:15',
    wakeTime: '07:00',
    durationMinutes: 465,
    durationFormatted: '7 ชม. 45 นาที',
    rating: 5,
    mood: 5,
    note: 'หลับสนิทมาก ตื่นตรงรอบการนอน รู้สึกสดชื่นพร้อมทำงาน',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'sample-2',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    bedTime: '00:30',
    wakeTime: '06:45',
    durationMinutes: 375,
    durationFormatted: '6 ชม. 15 นาที',
    rating: 4,
    mood: 4,
    note: 'ดื่มนมอุ่นๆ ก่อนนอน หลับง่ายขึ้น',
    createdAt: Date.now() - 172800000,
  },
];

function AppContent() {
  const { isDark } = useTheme();
  const [records, setRecords] = useState<SleepRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_SAMPLE_RECORDS;
    } catch {
      return INITIAL_SAMPLE_RECORDS;
    }
  });

  const [prefillBedTime, setPrefillBedTime] = useState<string | undefined>(() => {
    try {
      const savedTime = localStorage.getItem(SAVED_SELECTED_TIME_KEY);
      if (savedTime) {
        const parsed = JSON.parse(savedTime);
        return parsed.bedTime;
      }
    } catch {
      // fallback
    }
    return undefined;
  });

  const [prefillWakeTime, setPrefillWakeTime] = useState<string | undefined>(() => {
    try {
      const savedTime = localStorage.getItem(SAVED_SELECTED_TIME_KEY);
      if (savedTime) {
        const parsed = JSON.parse(savedTime);
        return parsed.wakeTime;
      }
    } catch {
      // fallback
    }
    return undefined;
  });

  // Check if we loaded a saved selected time on initial page load, and auto-scroll down to Sleep Journal
  useEffect(() => {
    try {
      const savedTime = localStorage.getItem(SAVED_SELECTED_TIME_KEY);
      if (savedTime) {
        // Small delay to ensure DOM is ready and styled
        const timer = setTimeout(() => {
          const formElem = document.getElementById('sleep-journal-form-card');
          if (formElem) {
            formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus note input for immediate writing if present
            const noteInput = document.getElementById('journal-note');
            if (noteInput) {
              (noteInput as HTMLInputElement).focus({ preventScroll: true });
            }
          }
        }, 400);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Failed to restore saved sleep time:', e);
    }
  }, []);

  // Save to localStorage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [records]);

  const handleAddRecord = (
    newRecordData: Omit<SleepRecord, 'id' | 'createdAt'>
  ) => {
    const newRecord: SleepRecord = {
      ...newRecordData,
      id: 'record_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: Date.now(),
    };

    // Prepend to list so newest is first
    setRecords((prev) => [newRecord, ...prev]);

    // Clear the active prefilled time from localStorage after successful save
    try {
      localStorage.removeItem(SAVED_SELECTED_TIME_KEY);
    } catch (e) {
      console.error('Failed to clear saved selected time:', e);
    }

    // Scroll smoothly to history if needed
    const historyElem = document.getElementById('sleep-journal-history-card');
    if (historyElem) {
      historyElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = () => {
    setRecords([]);
  };

  const handleSelectTimeToJournal = (bed: string, wake: string) => {
    setPrefillBedTime(bed);
    setPrefillWakeTime(wake);

    // Save to localStorage for persistent state
    try {
      localStorage.setItem(
        SAVED_SELECTED_TIME_KEY,
        JSON.stringify({ bedTime: bed, wakeTime: wake, timestamp: Date.now() })
      );
    } catch (e) {
      console.error('Failed to save selected sleep time to localStorage:', e);
    }

    // Scroll smoothly to form and focus note input
    const formElem = document.getElementById('sleep-journal-form-card');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const noteInput = document.getElementById('journal-note');
      if (noteInput) {
        (noteInput as HTMLInputElement).focus({ preventScroll: true });
      }
    }
  };

  return (
    <div
      className={`min-h-screen pb-16 w-full max-w-full overflow-x-hidden transition-colors duration-300 selection:bg-indigo-500 selection:text-white ${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Background Decorative Night/Day Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-opacity duration-300">
        {isDark ? (
          <>
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-200/35 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* Top Floating Bar with Theme Toggle */}
      <nav
        id="app-top-navbar"
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-300 border-b shadow-xs ${
          isDark
            ? 'bg-slate-950/85 border-slate-800/90 text-slate-100'
            : 'bg-white/85 border-slate-200/90 text-slate-800'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none" role="img" aria-label="Moon">
              🌙
            </span>
            <div className="flex flex-col">
              <span
                id="brand-title"
                className={`font-bold text-sm sm:text-base tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                นอนบ้าง
              </span>
              <span className="text-[10px] text-indigo-500 font-medium hidden sm:inline -mt-0.5">
                Sleep Cycle & Sleep Journal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-medium hidden sm:inline ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {isDark ? 'โหมดมืด' : 'โหมดสว่าง'}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-2">
        {/* Header section with App Title, Sleep Avatar & Sleep Cycle guide */}
        <Header records={records} />

        {/* Section 1: Sleep Cycle Calculator with 2 Modes */}
        <SleepCycleCalculator
          onSelectTimeToJournal={handleSelectTimeToJournal}
        />

        {/* Section 2: Sleep Journal Form */}
        <SleepJournalForm
          onAddRecord={handleAddRecord}
          prefillBedTime={prefillBedTime}
          prefillWakeTime={prefillWakeTime}
        />

        {/* Section 3: Sleep Journal History & Stats */}
        <SleepJournalHistory
          records={records}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAll}
        />

        {/* Footer */}
        <footer
          className={`text-center text-xs pt-6 pb-2 border-t transition-colors duration-300 ${
            isDark
              ? 'text-slate-500 border-slate-900'
              : 'text-slate-500 border-slate-200'
          }`}
        >
          <p>
            เว็บแอป "นอนบ้าง" (Sleep Cycle & Journal) • ออกแบบเพื่อการนอนที่มีคุณภาพและตื่นอย่างสดชื่นทุกวัน 🌙✨
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

