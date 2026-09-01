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
    <section
      id="sleep-calculator-section"
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2
            id="calculator-heading"
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5"
          >
            <Clock className="w-6 h-6 text-indigo-400" />
            คำนวณรอบการนอน
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            นับรอบการนอน 90 นาที/รอบ + เผื่อเวลาเคลิ้มหลับ 15 นาที
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div
          id="calculator-mode-tabs"
          className="inline-flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800 self-start sm:self-auto"
        >
          <button
            id="tab-wake-mode"
            type="button"
            onClick={() => setMode('wake')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              mode === 'wake'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>ตื่นกี่โมงดี</span>
          </button>
          <button
            id="tab-bed-mode"
            type="button"
            onClick={() => setMode('bed')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              mode === 'bed'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>เข้านอนกี่โมงดี</span>
          </button>
        </div>
      </div>

      {/* Input Form Box */}
      <div
        id="calculator-input-box"
        className={`p-4 sm:p-5 rounded-2xl bg-slate-950/60 border transition-all mb-6 ${
          isCurrentTimeValid ? 'border-slate-800/80' : 'border-rose-500/60 ring-1 ring-rose-500/30'
        }`}
      >
        {mode === 'wake' ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label
                htmlFor="input-bedtime"
                className="text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                เวลาที่จะเข้านอน:
              </label>

              <div className="flex items-center gap-2">
                <button
                  id="btn-set-bedtime-now"
                  type="button"
                  onClick={handleSetNow}
                  className="px-3 py-2 text-xs font-medium bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
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
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label
                htmlFor="input-waketime"
                className="text-sm font-medium text-slate-200 flex items-center gap-2"
              >
                <Sun className="w-4 h-4 text-amber-400" />
                เวลาที่ต้องการตื่นนอน:
              </label>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5">
                  {['06:00', '07:00', '08:00'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputWakeTime(preset)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                        inputWakeTime === preset
                          ? 'bg-indigo-600/30 border-indigo-400/50 text-indigo-200 font-medium'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
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

              return (
                <div
                  key={item.cycles}
                  id={`cycle-card-${item.cycles}`}
                  onClick={() => handleApplyToJournal(item)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isRec
                      ? 'bg-gradient-to-b from-indigo-950/90 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/50 hover:border-indigo-400 hover:scale-[1.02]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {item.tag && (
                    <div className="absolute -top-2.5 left-3">
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border shadow-sm ${
                          isRec
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <div className="mt-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>{mode === 'wake' ? 'ตื่นตอน' : 'เข้านอนตอน'}</span>
                      <span className="text-indigo-300 font-medium">
                        ({item.cycles} รอบการนอน)
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white my-1.5">
                      {item.timeFormatted} <span className="text-sm font-normal text-slate-400">น.</span>
                    </div>

                    <div className="text-[11px] text-slate-400 leading-tight">
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
  );
};

