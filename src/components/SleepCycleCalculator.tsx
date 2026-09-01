import React, { useState } from 'react';
import { Moon, Sun, Clock, Sparkles, ArrowRight, Check, Zap, AlertCircle } from 'lucide-react';
import { CalculatorMode, CycleResult } from '../types';
import {
  calculateWakeTimes,
  calculateBedTimes,
  getCurrentTimeFormatted,
} from '../utils/sleepMath';

interface SleepCycleCalculatorProps {
  onSelectTimeToJournal?: (bedTime: string, wakeTime: string) => void;
}

export const SleepCycleCalculator: React.FC<SleepCycleCalculatorProps> = ({
  onSelectTimeToJournal,
}) => {
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

  const results: CycleResult[] = isCurrentTimeValid
    ? mode === 'wake'
      ? calculateWakeTimes(inputBedTime)
      : calculateBedTimes(inputWakeTime)
    : [];

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
        className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl"
      >
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              เลือกรูปแบบการคำนวณเวลานอน
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {mode === 'wake' ? 'โหมด: คำนวณเวลาตื่น' : 'โหมด: คำนวณเวลาเข้านอน'}
          </span>
        </div>

        {/* 2 Full-Width Mode Switcher Buttons */}
        <div
          id="calculator-mode-tabs-container"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800/90 shadow-inner"
        >
          {/* Tab 1: ตื่นกี่โมงดี */}
          <button
            id="tab-wake-mode"
            type="button"
            onClick={() => setMode('wake')}
            className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none ${
              mode === 'wake'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-950/80 border border-indigo-400/40 ring-2 ring-indigo-500/20 scale-[1.01]'
                : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <span className="text-base">🌙</span>
            <span className="tracking-wide">ตื่นกี่โมงดี? (นอนเวลานี้)</span>
          </button>

          {/* Tab 2: เข้านอนกี่โมงดี */}
          <button
            id="tab-bed-mode"
            type="button"
            onClick={() => setMode('bed')}
            className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none ${
              mode === 'bed'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-950/80 border border-indigo-400/40 ring-2 ring-indigo-500/20 scale-[1.01]'
                : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <span className="text-base">☀️</span>
            <span className="tracking-wide">เข้านอนกี่โมงดี? (ตื่นเวลานี้)</span>
          </button>
        </div>
      </section>

      {/* Block 2: Sleep Cycle Calculator Section */}
      <section
        id="sleep-calculator-section"
        className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl"
      >
        {/* Title & Description */}
        <div className="mb-6">
          <h2
            id="calculator-heading"
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5"
          >
            <Clock className="w-6 h-6 text-purple-400" />
            คำนวณรอบการนอน
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            นับรอบการนอน 90 นาที/รอบ + เผื่อเวลาเคลิ้มหลับ 15 นาที เพื่อให้คุณตื่นนอนได้อย่างสดชื่น
          </p>
        </div>

      {/* Input Form Box */}
      <div
        id="calculator-input-box"
        className={`p-4 sm:p-5 rounded-2xl bg-slate-950/60 border transition-all mb-6 ${
          isCurrentTimeValid ? 'border-slate-800/80' : 'border-rose-500/60 ring-1 ring-rose-500/30'
        }`}
      >
        {mode === 'wake' ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label
                htmlFor="input-bedtime"
                className="text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                เวลาที่จะเข้านอน:
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-set-bedtime-now"
                  type="button"
                  onClick={handleSetNow}
                  className="px-3 py-2 text-xs font-semibold bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  นอนตอนนี้ ({getCurrentTimeFormatted()})
                </button>
                <input
                  id="input-bedtime"
                  type="time"
                  required
                  value={inputBedTime}
                  onChange={(e) => setInputBedTime(e.target.value)}
                  className={`bg-slate-900 border text-white rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                    inputBedTime ? 'border-slate-700' : 'border-rose-500 bg-rose-950/20'
                  }`}
                />
              </div>
            </div>

            {/* Popular Bedtime Presets for all screens (no hidden classes) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">เวลายอดนิยม:</span>
              {['22:00', '23:00', '23:30', '00:00', '01:00'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputBedTime(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    inputBedTime === preset
                      ? 'bg-indigo-600/40 border-indigo-400/60 text-indigo-200 font-semibold shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {preset} น.
                </button>
              ))}
            </div>

            {isCurrentTimeValid ? (
              <p className="text-xs text-slate-400 mt-2">
                💡 หากคุณเข้านอนตอน <strong>{inputBedTime} น.</strong> ควรตั้งนาฬิกาปลุกเวลาใดเพื่อให้ตื่นอย่างสดชื่น:
              </p>
            ) : (
              <div
                id="error-bedtime-required"
                className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-400 animate-fade-in"
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
                className="text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <Sun className="w-4 h-4 text-amber-400" />
                เวลาที่ต้องการตื่นนอน:
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-set-waketime-now"
                  type="button"
                  onClick={handleSetNow}
                  className="px-3 py-2 text-xs font-semibold bg-amber-950/90 hover:bg-amber-900 border border-amber-500/40 text-amber-200 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  ตื่นตอนนี้ ({getCurrentTimeFormatted()})
                </button>
                <input
                  id="input-waketime"
                  type="time"
                  required
                  value={inputWakeTime}
                  onChange={(e) => setInputWakeTime(e.target.value)}
                  className={`bg-slate-900 border text-white rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                    inputWakeTime ? 'border-slate-700' : 'border-rose-500 bg-rose-950/20'
                  }`}
                />
              </div>
            </div>

            {/* Popular Waketime Presets for all screens (no hidden classes) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">เวลายอดนิยม:</span>
              {['05:30', '06:00', '06:30', '07:00', '08:00'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputWakeTime(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    inputWakeTime === preset
                      ? 'bg-amber-500/30 border-amber-400/60 text-amber-200 font-semibold shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {preset} น.
                </button>
              ))}
            </div>

            {isCurrentTimeValid ? (
              <p className="text-xs text-slate-400 mt-2">
                💡 หากคุณต้องตื่นตอน <strong>{inputWakeTime} น.</strong> ควรเริ่มเข้านอนในเวลาใด:
              </p>
            ) : (
              <div
                id="error-waketime-required"
                className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-400 animate-fade-in"
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
          className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-fade-in"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Results Grid - 4 Options */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>เวลาที่เหมาะสม 4 ตัวเลือก (เรียงจากน้อยไปมาก):</span>
          <span>{isCurrentTimeValid ? 'คลิกการ์ดเพื่อนำไปลงบันทึก' : 'ระบุเวลาเพื่อดูผลลัพธ์'}</span>
        </div>

        {!isCurrentTimeValid ? (
          <div
            id="calculator-empty-validation-box"
            className="p-8 rounded-2xl bg-slate-950/40 border border-rose-500/30 text-center text-rose-300 space-y-2"
          >
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <div className="font-semibold text-rose-400">กรุณาเลือกเวลาให้ครบถ้วน</div>
            <p className="text-xs text-slate-400">
              กรุณาระบุเวลา{mode === 'wake' ? 'เข้านอน' : 'ตื่นนอน'}ในช่องด้านบนเพื่อเริ่มคำนวณรอบการนอน 90 นาที
            </p>
          </div>
        ) : (
          <div
            id="cycle-results-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {results.map((item) => {
              const isRec = item.isRecommended;

              // Color config per cycle tier
              // cycles 3 = ขั้นต่ำ (ส้ม/แดง)
              // cycles 4 = พอใช้ (เหลือง)
              // cycles 5 = แนะนำ (ม่วง)
              // cycles 6 = เต็มอิ่ม (เขียว)
              const getBadgeConfig = (cycles: number) => {
                switch (cycles) {
                  case 3:
                    return {
                      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
                      durationColor: 'text-rose-400 font-bold',
                      cardBorder: 'hover:border-rose-500/40',
                    };
                  case 4:
                    return {
                      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
                      durationColor: 'text-amber-400 font-bold',
                      cardBorder: 'hover:border-amber-500/40',
                    };
                  case 5:
                    return {
                      badgeClass: 'bg-purple-600/30 text-purple-200 border-purple-400/60 font-bold shadow-md shadow-purple-950/60',
                      durationColor: 'text-purple-300 font-bold',
                      cardBorder: 'hover:border-purple-400/70',
                    };
                  case 6:
                    return {
                      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
                      durationColor: 'text-emerald-400 font-bold',
                      cardBorder: 'hover:border-emerald-500/40',
                    };
                  default:
                    return {
                      badgeClass: 'bg-slate-800 border-slate-700 text-slate-300',
                      durationColor: 'text-indigo-300 font-bold',
                      cardBorder: 'hover:border-slate-700',
                    };
                }
              };

              const tierStyle = getBadgeConfig(item.cycles);

              return (
                <div
                  key={item.cycles}
                  id={`cycle-card-${item.cycles}`}
                  onClick={() => handleApplyToJournal(item)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isRec
                      ? 'bg-gradient-to-b from-purple-950/70 via-slate-900 to-slate-950 border-purple-500/60 shadow-lg shadow-purple-950/60 hover:border-purple-400 hover:scale-[1.02]'
                      : `bg-slate-950/70 border-slate-800/90 ${tierStyle.cardBorder} hover:bg-slate-900/80`
                  }`}
                >
                  {item.tag && (
                    <div className="absolute -top-2.5 left-3">
                      <span
                        className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-sm ${tierStyle.badgeClass}`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <div className="mt-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>{mode === 'wake' ? 'ตื่นตอน' : 'เข้านอนตอน'}</span>
                      <span className="text-slate-300 font-medium">
                        ({item.cycles} รอบการนอน)
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white my-1.5">
                      {item.timeFormatted} <span className="text-sm font-normal text-slate-400">น.</span>
                    </div>

                    {/* Highlighted Total Sleep Duration */}
                    <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">เวลานอนรวม:</span>
                      <span className={`text-xs ${tierStyle.durationColor}`}>
                        {item.hours} ชม. {item.minutes > 0 ? `${item.minutes} น.` : ''}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-tight mt-2">
                      {item.subtext}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-300/80 group-hover:text-indigo-200">
                    <span>นำเวลาไปใส่ฟอร์ม</span>
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

