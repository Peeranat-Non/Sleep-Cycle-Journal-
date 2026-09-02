import React, { useState, useMemo } from 'react';
import { Moon, Sun, Clock, Sparkles, ArrowRight, Check, Zap, AlertCircle } from 'lucide-react';
import { CalculatorMode, CycleResult } from '../types';
import {
  calculateWakeTimes,
  calculateBedTimes,
  getCurrentTimeFormatted,
} from '../utils/sleepMath';
import { useTheme } from '../context/ThemeContext';

interface SleepCycleCalculatorProps {
  onSelectTimeToJournal?: (bedTime: string, wakeTime: string) => void;
}

export const SleepCycleCalculator: React.FC<SleepCycleCalculatorProps> = ({
  onSelectTimeToJournal,
}) => {
  const { isDark } = useTheme();
  const [mode, setMode] = useState<CalculatorMode>('wake');
  // Initialize with current time
  const [inputBedTime, setInputBedTime] = useState<string>(() => getCurrentTimeFormatted());
  const [inputWakeTime, setInputWakeTime] = useState<string>(() => getCurrentTimeFormatted());
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleSetNow = () => {
    const current = getCurrentTimeFormatted();
    if (mode === 'wake') {
      setInputBedTime(current);
    } else {
      setInputWakeTime(current);
    }
  };

  const isCurrentTimeValid =
    mode === 'wake'
      ? Boolean(inputBedTime && inputBedTime.trim() !== '' && inputBedTime.includes(':'))
      : Boolean(inputWakeTime && inputWakeTime.trim() !== '' && inputWakeTime.includes(':'));

  const results: CycleResult[] = useMemo(() => {
    if (!isCurrentTimeValid) return [];
    return mode === 'wake'
      ? calculateWakeTimes(inputBedTime)
      : calculateBedTimes(inputWakeTime);
  }, [isCurrentTimeValid, mode, inputBedTime, inputWakeTime]);

  const handleApplyToJournal = (result: CycleResult) => {
    if (!onSelectTimeToJournal || !isCurrentTimeValid) return;

    if (mode === 'wake') {
      // Bed is inputBedTime, Wake is result.timeFormatted
      onSelectTimeToJournal(inputBedTime, result.timeFormatted);
      setAppliedNotice(`ใส่เวลาเข้านอน ${inputBedTime} และตื่น ${result.timeFormatted} ลงในแบบบันทึกแล้ว`);
    } else {
      // Bed is result.timeFormatted, Wake is inputWakeTime
      onSelectTimeToJournal(result.timeFormatted, inputWakeTime);
      setAppliedNotice(`ใส่เวลาเข้านอน ${result.timeFormatted} และตื่น ${inputWakeTime} ลงในแบบบันทึกแล้ว`);
    }

    setTimeout(() => {
      setAppliedNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Block 1: Standalone Mode Selector Card */}
      <section
        id="mode-selector-card"
        className={`backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white/90 border-slate-200 shadow-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span
              className={`text-xs sm:text-sm font-semibold ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              เลือกรูปแบบการคำนวณเวลานอน
            </span>
          </div>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'wake' ? 'โหมด: คำนวณเวลาตื่น' : 'โหมด: คำนวณเวลาเข้านอน'}
          </span>
        </div>

        {/* 2 Full-Width Mode Switcher Buttons */}
        <div
          id="calculator-mode-tabs-container"
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 rounded-2xl border shadow-inner transition-colors duration-300 ${
            isDark
              ? 'bg-slate-950/90 border-slate-800/90'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          {/* Tab 1: ตื่นกี่โมงดี */}
          <button
            id="tab-wake-mode"
            type="button"
            onClick={() => setMode('wake')}
            className={`w-full py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none min-h-[46px] ${
              mode === 'wake'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-950/40 border border-indigo-400/40 ring-2 ring-indigo-500/20 scale-[1.01]'
                : isDark
                ? 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
            }`}
          >
            <span className="text-base shrink-0">🌙</span>
            <span className="tracking-wide text-center">ตื่นกี่โมงดี? (นอนเวลานี้)</span>
          </button>

          {/* Tab 2: เข้านอนกี่โมงดี */}
          <button
            id="tab-bed-mode"
            type="button"
            onClick={() => setMode('bed')}
            className={`w-full py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none min-h-[46px] ${
              mode === 'bed'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-950/40 border border-indigo-400/40 ring-2 ring-indigo-500/20 scale-[1.01]'
                : isDark
                ? 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
            }`}
          >
            <span className="text-base shrink-0">☀️</span>
            <span className="tracking-wide text-center">เข้านอนกี่โมงดี? (ตื่นเวลานี้)</span>
          </button>
        </div>
      </section>

      {/* Block 2: Sleep Cycle Calculator Section */}
      <section
        id="sleep-calculator-section"
        className={`backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl border transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white/95 border-slate-200 shadow-slate-200'
        }`}
      >
        {/* Title & Description */}
        <div className="mb-5">
          <h2
            id="calculator-heading"
            className={`text-lg sm:text-2xl font-bold flex items-center gap-2.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            คำนวณรอบการนอน
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            นับรอบการนอน 90 นาที/รอบ + เผื่อเวลาเคลิ้มหลับ 15 นาที เพื่อให้คุณตื่นนอนได้อย่างสดชื่น
          </p>
        </div>

        {/* Input Form Box */}
        <div
          id="calculator-input-box"
          className={`p-4 sm:p-5 rounded-2xl border transition-all mb-6 ${
            isDark
              ? isCurrentTimeValid
                ? 'bg-slate-950/60 border-slate-800/80'
                : 'bg-slate-950/60 border-rose-500/60 ring-1 ring-rose-500/30'
              : isCurrentTimeValid
              ? 'bg-slate-50 border-slate-200'
              : 'bg-rose-50 border-rose-400 ring-1 ring-rose-400/30'
          }`}
        >
          {mode === 'wake' ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label
                  htmlFor="input-bedtime"
                  className={`text-xs sm:text-sm font-medium flex items-center gap-2 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                  เวลาที่จะเข้านอน:
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    id="btn-set-bedtime-now"
                    type="button"
                    onClick={handleSetNow}
                    className={`w-full sm:w-auto px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs border min-h-[42px] ${
                      isDark
                        ? 'bg-indigo-950/90 hover:bg-indigo-900 border-indigo-500/40 text-indigo-200'
                        : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    นอนตอนนี้ ({getCurrentTimeFormatted()})
                  </button>
                  <input
                    id="input-bedtime"
                    type="time"
                    required
                    value={inputBedTime}
                    onChange={(e) => setInputBedTime(e.target.value)}
                    className={`w-full sm:w-auto rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border min-h-[42px] text-center sm:text-left ${
                      isDark
                        ? inputBedTime
                          ? 'bg-slate-900 text-white border-slate-700'
                          : 'bg-rose-950/20 text-white border-rose-500'
                        : inputBedTime
                        ? 'bg-white text-slate-900 border-slate-300'
                        : 'bg-rose-50 text-slate-900 border-rose-400'
                    }`}
                  />
                </div>
              </div>

              {/* Popular Bedtime Presets for all screens (no hidden classes) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  เวลายอดนิยม:
                </span>
                {['22:00', '23:00', '23:30', '00:00', '01:00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInputBedTime(preset)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all active:scale-95 ${
                      inputBedTime === preset
                        ? isDark
                          ? 'bg-indigo-600/40 border-indigo-400/60 text-indigo-200 font-semibold shadow-xs'
                          : 'bg-indigo-100 border-indigo-400 text-indigo-800 font-semibold shadow-xs'
                        : isDark
                        ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {preset} น.
                  </button>
                ))}
              </div>

              {isCurrentTimeValid ? (
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  💡 หากคุณเข้านอนตอน <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{inputBedTime} น.</strong> ควรตั้งนาฬิกาปลุกเวลาใดเพื่อให้ตื่นอย่างสดชื่น:
                </p>
              ) : (
                <div
                  id="error-bedtime-required"
                  className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-500 animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>กรุณาเลือกเวลาให้ครบถ้วน</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label
                  htmlFor="input-waketime"
                  className={`text-xs sm:text-sm font-medium flex items-center gap-2 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  เวลาที่ต้องการตื่นนอน:
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    id="btn-set-waketime-now"
                    type="button"
                    onClick={handleSetNow}
                    className={`w-full sm:w-auto px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs border min-h-[42px] ${
                      isDark
                        ? 'bg-amber-950/90 hover:bg-amber-900 border-amber-500/40 text-amber-200'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ตื่นตอนนี้ ({getCurrentTimeFormatted()})
                  </button>
                  <input
                    id="input-waketime"
                    type="time"
                    required
                    value={inputWakeTime}
                    onChange={(e) => setInputWakeTime(e.target.value)}
                    className={`w-full sm:w-auto rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border min-h-[42px] text-center sm:text-left ${
                      isDark
                        ? inputWakeTime
                          ? 'bg-slate-900 text-white border-slate-700'
                          : 'bg-rose-950/20 text-white border-rose-500'
                        : inputWakeTime
                        ? 'bg-white text-slate-900 border-slate-300'
                        : 'bg-rose-50 text-slate-900 border-rose-400'
                    }`}
                  />
                </div>
              </div>

              {/* Popular Waketime Presets for all screens (no hidden classes) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  เวลายอดนิยม:
                </span>
                {['05:30', '06:00', '06:30', '07:00', '08:00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInputWakeTime(preset)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all active:scale-95 ${
                      inputWakeTime === preset
                        ? isDark
                          ? 'bg-amber-500/30 border-amber-400/60 text-amber-200 font-semibold shadow-xs'
                          : 'bg-amber-100 border-amber-400 text-amber-800 font-semibold shadow-xs'
                        : isDark
                        ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {preset} น.
                  </button>
                ))}
              </div>

              {isCurrentTimeValid ? (
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  💡 หากคุณต้องตื่นตอน <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{inputWakeTime} น.</strong> ควรเริ่มเข้านอนในเวลาใด:
                </p>
              ) : (
                <div
                  id="error-waketime-required"
                  className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-500 animate-fade-in"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>กรุณาเลือกเวลาให้ครบถ้วน</span>
                </div>
              )}
            </div>
          )}
        </div>

        {appliedNotice && (
          <div
            id="applied-toast-notice"
            className={`mb-4 px-4 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 animate-fade-in ${
              isDark
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="break-words">{appliedNotice}</span>
          </div>
        )}

        {/* Results Grid - 4 Options */}
        <div className="space-y-3">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-1 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>เวลาที่เหมาะสม 4 ตัวเลือก (เรียงจากน้อยไปมาก):</span>
            <span className={isDark ? 'text-indigo-300' : 'text-indigo-600'}>
              {isCurrentTimeValid ? 'คลิกการ์ดเพื่อนำไปลงบันทึก' : 'ระบุเวลาเพื่อดูผลลัพธ์'}
            </span>
          </div>

          {!isCurrentTimeValid ? (
            <div
              id="calculator-empty-validation-box"
              className={`p-6 sm:p-8 rounded-2xl border text-center space-y-2 ${
                isDark
                  ? 'bg-slate-950/40 border-rose-500/30 text-rose-300'
                  : 'bg-rose-50/70 border-rose-300 text-rose-700'
              }`}
            >
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <div className="font-semibold text-rose-600 dark:text-rose-400">กรุณาเลือกเวลาให้ครบถ้วน</div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                กรุณาระบุเวลา{mode === 'wake' ? 'เข้านอน' : 'ตื่นนอน'}ในช่องด้านบนเพื่อเริ่มคำนวณรอบการนอน 90 นาที
              </p>
            </div>
          ) : (
            <div
              id="cycle-results-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
            >
              {results.map((item) => {
                const isRec = item.isRecommended;

                // Color config per cycle tier
                const getBadgeConfig = (cycles: number) => {
                  switch (cycles) {
                    case 3:
                      return {
                        badgeClass: isDark
                          ? 'bg-rose-500/20 text-rose-300 border-rose-400/50'
                          : 'bg-rose-100 text-rose-800 border-rose-300',
                        durationColor: isDark ? 'text-rose-400 font-bold' : 'text-rose-700 font-bold',
                        cardBorder: isDark ? 'hover:border-rose-500/40' : 'hover:border-rose-400',
                      };
                    case 4:
                      return {
                        badgeClass: isDark
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                          : 'bg-amber-100 text-amber-800 border-amber-300',
                        durationColor: isDark ? 'text-amber-400 font-bold' : 'text-amber-700 font-bold',
                        cardBorder: isDark ? 'hover:border-amber-500/40' : 'hover:border-amber-400',
                      };
                    case 5:
                      return {
                        badgeClass: isDark
                          ? 'bg-purple-600/30 text-purple-200 border-purple-400/60 font-bold shadow-md shadow-purple-950/60'
                          : 'bg-purple-100 text-purple-800 border-purple-300 font-bold shadow-xs',
                        durationColor: isDark ? 'text-purple-300 font-bold' : 'text-purple-700 font-bold',
                        cardBorder: isDark ? 'hover:border-purple-400/70' : 'hover:border-purple-400',
                      };
                    case 6:
                      return {
                        badgeClass: isDark
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300',
                        durationColor: isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold',
                        cardBorder: isDark ? 'hover:border-emerald-500/40' : 'hover:border-emerald-400',
                      };
                    default:
                      return {
                        badgeClass: isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-slate-100 border-slate-300 text-slate-700',
                        durationColor: isDark ? 'text-indigo-300 font-bold' : 'text-indigo-700 font-bold',
                        cardBorder: isDark ? 'hover:border-slate-700' : 'hover:border-slate-300',
                      };
                  }
                };

                const tierStyle = getBadgeConfig(item.cycles);

                return (
                  <div
                    key={item.cycles}
                    id={`cycle-card-${item.cycles}`}
                    onClick={() => handleApplyToJournal(item)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between h-full min-h-[175px] active:scale-[0.98] ${
                      isDark
                        ? isRec
                          ? 'bg-gradient-to-b from-purple-950/70 via-slate-900 to-slate-950 border-purple-500/60 shadow-lg shadow-purple-950/60 hover:border-purple-400 hover:scale-[1.02]'
                          : `bg-slate-950/70 border-slate-800/90 ${tierStyle.cardBorder} hover:bg-slate-900/80`
                        : isRec
                        ? 'bg-gradient-to-b from-purple-50 via-white to-slate-50 border-purple-300 shadow-md hover:border-purple-500 hover:scale-[1.02]'
                        : `bg-white border-slate-200 ${tierStyle.cardBorder} hover:bg-slate-50 shadow-xs`
                    }`}
                  >
                    {item.tag && (
                      <div className="absolute -top-2.5 left-3">
                        <span
                          className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-sm ${tierStyle.badgeClass}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    )}

                    <div className="mt-1">
                      <div className={`text-xs flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{mode === 'wake' ? 'ตื่นตอน' : 'เข้านอนตอน'}</span>
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          ({item.cycles} รอบการนอน)
                        </span>
                      </div>

                      <div
                        className={`text-2xl sm:text-3xl font-bold tracking-tight my-1.5 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.timeFormatted}{' '}
                        <span className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          น.
                        </span>
                      </div>

                      {/* Highlighted Total Sleep Duration */}
                      <div
                        className={`mt-2 p-2 rounded-xl border flex items-center justify-between transition-colors ${
                          isDark
                            ? 'bg-slate-900/90 border-slate-800/80'
                            : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          เวลานอนรวม:
                        </span>
                        <span className={`text-xs ${tierStyle.durationColor}`}>
                          {item.hours} ชม. {item.minutes > 0 ? `${item.minutes} น.` : ''}
                        </span>
                      </div>

                      <div className={`text-[11px] leading-tight mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.subtext}
                      </div>
                    </div>

                    <div
                      className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] transition-colors ${
                        isDark
                          ? 'border-slate-800/80 text-indigo-300/80 group-hover:text-indigo-200'
                          : 'border-slate-200 text-indigo-600 group-hover:text-indigo-800'
                      }`}
                    >
                      <span className="font-medium">นำเวลาไปใส่ฟอร์ม</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


