import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Star,
  Calendar,
  Smile,
  PlusCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { MoodLevel, SleepRecord } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';
import {
  calculateDuration,
  getTodayDateFormatted,
  getCurrentTimeFormatted,
} from '../utils/sleepMath';
import { useTheme } from '../context/ThemeContext';

interface SleepJournalFormProps {
  onAddRecord: (record: Omit<SleepRecord, 'id' | 'createdAt'>) => void;
  prefillBedTime?: string;
  prefillWakeTime?: string;
}

export const SleepJournalForm: React.FC<SleepJournalFormProps> = ({
  onAddRecord,
  prefillBedTime,
  prefillWakeTime,
}) => {
  const { isDark } = useTheme();
  const [date, setDate] = useState<string>(getTodayDateFormatted());
  
  // Track if a valid selection from the 4 recommendation cards has been made
  const [hasSelectedFromCards, setHasSelectedFromCards] = useState<boolean>(() => {
    return Boolean(
      prefillBedTime &&
      prefillWakeTime &&
      prefillBedTime !== prefillWakeTime &&
      prefillBedTime.includes(':') &&
      prefillWakeTime.includes(':')
    );
  });

  // Initialize with prefill if provided and valid, otherwise current time
  const [bedTime, setBedTime] = useState<string>(
    () => prefillBedTime || getCurrentTimeFormatted()
  );
  const [wakeTime, setWakeTime] = useState<string>(
    () => prefillWakeTime || getCurrentTimeFormatted()
  );
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [mood, setMood] = useState<MoodLevel>(4);
  const [note, setNote] = useState<string>('');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Sync when prefilled from calculator (4 options card clicked)
  useEffect(() => {
    if (prefillBedTime && prefillWakeTime && prefillBedTime !== prefillWakeTime) {
      setBedTime(prefillBedTime);
      setWakeTime(prefillWakeTime);
      setHasSelectedFromCards(true);
      setAlertError(null);
    }
  }, [prefillBedTime, prefillWakeTime]);

  const isBedTimeValid = Boolean(bedTime && bedTime.trim() !== '' && bedTime.includes(':'));
  const isWakeTimeValid = Boolean(wakeTime && wakeTime.trim() !== '' && wakeTime.includes(':'));
  const isSameTime = bedTime === wakeTime;

  // Calculate duration with safe zero handling (never converts same time to 24 hrs)
  const durationInfo =
    isBedTimeValid && isWakeTimeValid
      ? calculateDuration(bedTime, wakeTime)
      : {
          totalMinutes: 0,
          formatted: 'กรุณาระบุเวลา',
          hours: 0,
          minutes: 0,
          cyclesEstimate: '-',
          isSameTime: false,
        };

  // Check if form is completely valid to submit
  const isFormValid =
    isBedTimeValid &&
    isWakeTimeValid &&
    !isSameTime &&
    hasSelectedFromCards &&
    durationInfo.totalMinutes > 0;

  const scrollToCalculatorCards = () => {
    const target =
      document.getElementById('cycle-results-grid') ||
      document.getElementById('sleep-calculator-card') ||
      document.getElementById('mode-selector-card');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleBedTimeChange = (newBedTime: string) => {
    setBedTime(newBedTime);
    if (newBedTime === wakeTime) {
      setHasSelectedFromCards(false);
      setAlertError('กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อน');
    } else {
      setAlertError(null);
    }
  };

  const handleWakeTimeChange = (newWakeTime: string) => {
    setWakeTime(newWakeTime);
    if (bedTime === newWakeTime) {
      setHasSelectedFromCards(false);
      setAlertError('กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อน');
    } else {
      setAlertError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation
    if (!isFormValid || isSameTime || !hasSelectedFromCards) {
      const errorMsg = 'กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อน';
      setAlertError(errorMsg);

      // Scroll to alert or calculator options
      const alertElement = document.getElementById('form-validation-alert-box');
      if (alertElement) {
        alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        scrollToCalculatorCards();
      }
      return;
    }

    onAddRecord({
      date,
      bedTime,
      wakeTime,
      durationMinutes: durationInfo.totalMinutes,
      durationFormatted: durationInfo.formatted,
      rating,
      mood,
      note: note.trim().slice(0, 100),
    });

    // Reset optional note, keep record feedback
    setNote('');
    setAlertError(null);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return 'แย่มาก (หลับไม่สนิท/ตื่นบ่อย)';
      case 2:
        return 'ไม่ค่อยดี (หลับยาก)';
      case 3:
        return 'พอใช้ได้ (หลับปานกลาง)';
      case 4:
        return 'ดี (หลับสบาย)';
      case 5:
        return 'ดีเยี่ยม (หลับสนิทตลอดคืน)';
      default:
        return '';
    }
  };

  return (
    <div
      id="sleep-journal-form-card"
      className={`backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 border transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/95 border-slate-200 shadow-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            id="journal-form-heading"
            className={`text-xl sm:text-2xl font-bold flex items-center gap-2.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
            บันทึกการนอน (Sleep Journal)
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            จดบันทึกเวลา คุณภาพ และความรู้สึกหลังตื่นนอนเพื่อติดตามสุขภาพการนอน (สามารถปรับเปลี่ยนเวลาเข้านอนและเวลาตื่นนอนให้ตรงกับความเป็นจริงได้)
          </p>
          {hasSelectedFromCards && !isSameTime && (
            <div
              id="restored-time-banner"
              className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium animate-fade-in border ${
                isDark
                  ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>ดึงเวลาที่คุณเลือกจาก 4 ตัวเลือก: เข้านอน {bedTime} น. / ตื่น {wakeTime} น.</span>
            </div>
          )}
        </div>

        {showSavedFeedback && (
          <div
            id="save-success-badge"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 animate-fade-in self-start sm:self-auto border ${
              isDark
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>บันทึกสำเร็จ!</span>
          </div>
        )}
      </div>

      {/* Main Validation Alert Banner */}
      {(!hasSelectedFromCards || isSameTime || alertError) && (
        <div
          id="form-validation-alert-box"
          className={`p-4 rounded-2xl border-2 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fade-in ${
            isDark
              ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 shadow-rose-950/50'
              : 'bg-rose-50 border-rose-300 text-rose-800 shadow-rose-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div
                className={`font-bold text-sm sm:text-base flex items-center gap-2 ${
                  isDark ? 'text-rose-300' : 'text-rose-900'
                }`}
              >
                <span>กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อน</span>
                {isSameTime && (
                  <span
                    className={`text-xs font-normal px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'text-rose-300 bg-rose-900/60 border-rose-500/40'
                        : 'text-rose-800 bg-rose-100 border-rose-300'
                    }`}
                  >
                    เวลาเข้านอนและตื่นนอนเป็นเวลาเดียวกัน
                  </span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-rose-300/90' : 'text-rose-700'}`}>
                ระบบคำนวณจะไม่บันทึกเวลาที่ซ้ำกัน และต้องเลือกเวลาที่แนะนำจากตัวเลือก 4 ชุดด้านบนเพื่อความถูกต้องของรอบการนอน
              </p>
            </div>
          </div>

          <button
            id="btn-alert-go-select-card"
            type="button"
            onClick={scrollToCalculatorCards}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs active:scale-95 min-h-[40px] ${
              isDark
                ? 'bg-rose-500/30 hover:bg-rose-500/40 border-rose-400/60 text-rose-100'
                : 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 shrink-0" />
            <span>เลือกเวลาจาก 4 ตัวเลือก</span>
          </button>
        </div>
      )}

      <form id="form-sleep-entry" onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Date & Sleep Times */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label
              htmlFor="journal-date"
              className={`text-xs font-medium flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              วันที่บันทึก:
            </label>
            <input
              id="journal-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none border transition-colors min-h-[44px] ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Bedtime */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="journal-bedtime"
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                เวลาเข้านอน:
              </label>
              {isSameTime && (
                <span className="text-[11px] text-rose-500 font-bold">* เวลาซ้ำ</span>
              )}
            </div>
            <input
              id="journal-bedtime"
              type="time"
              required
              value={bedTime}
              onChange={(e) => handleBedTimeChange(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border min-h-[44px] ${
                isSameTime
                  ? isDark
                    ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/40 text-rose-200'
                    : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/40 text-rose-900'
                  : isDark
                  ? isBedTimeValid
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-rose-950/20 border-rose-500 text-white'
                  : isBedTimeValid
                  ? 'bg-white border-slate-300 text-slate-900'
                  : 'bg-rose-50 border-rose-500 text-slate-900'
              }`}
            />
          </div>

          {/* Wake Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="journal-waketime"
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                เวลาตื่นนอน:
              </label>
              {isSameTime && (
                <span className="text-[11px] text-rose-500 font-bold">* เวลาซ้ำ</span>
              )}
            </div>
            <input
              id="journal-waketime"
              type="time"
              required
              value={wakeTime}
              onChange={(e) => handleWakeTimeChange(e.target.value)}
              className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors border min-h-[44px] ${
                isSameTime
                  ? isDark
                    ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/40 text-rose-200'
                    : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/40 text-rose-900'
                  : isDark
                  ? isWakeTimeValid
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-rose-950/20 border-rose-500 text-white'
                  : isWakeTimeValid
                  ? 'bg-white border-slate-300 text-slate-900'
                  : 'bg-rose-50 border-rose-500 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Helper tip: Can customize bedtime and waketime to match reality */}
        <div
          id="time-adjustment-tip"
          className={`flex items-start sm:items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
            isDark
              ? 'bg-indigo-950/30 border-indigo-500/25 text-indigo-200'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong className={isDark ? 'text-indigo-300' : 'text-indigo-900'}>💡 ข้อแนะนำ:</strong> คุณสามารถกดคลิกเพื่อปรับเปลี่ยนเวลาเข้านอนและเวลาตื่นนอนในช่องด้านบนได้ตลอดเวลา เพื่อให้บันทึกตรงกับเวลาที่คุณเข้านอนและตื่นจริง
          </span>
        </div>

        {/* Auto Duration Pill Box */}
        <div
          id="duration-calculator-badge"
          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
            isSameTime
              ? isDark
                ? 'bg-rose-950/40 border-rose-500/40'
                : 'bg-rose-50 border-rose-300'
              : isFormValid
              ? isDark
                ? 'bg-indigo-950/40 border-indigo-500/20'
                : 'bg-indigo-50/70 border-indigo-200'
              : isDark
              ? 'bg-slate-950/50 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>คำนวณชั่วโมงการนอนอัตโนมัติ:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              id="journal-calculated-hours"
              className={`text-sm font-bold px-3 py-1 rounded-lg border ${
                isSameTime
                  ? isDark
                    ? 'text-rose-300 bg-rose-900/40 border-rose-500/40'
                    : 'text-rose-800 bg-rose-100 border-rose-300'
                  : isFormValid
                  ? isDark
                    ? 'text-white bg-indigo-600/30 border-indigo-400/30'
                    : 'text-indigo-950 bg-indigo-100 border-indigo-300'
                  : isDark
                  ? 'text-slate-500 bg-slate-900 border-slate-800'
                  : 'text-slate-400 bg-slate-100 border-slate-200'
              }`}
            >
              {durationInfo.formatted}
            </span>
            {isSameTime ? (
              <span className="text-xs text-rose-500 font-semibold">
                (เวลาซ้ำกัน = 0 ชม.)
              </span>
            ) : isFormValid ? (
              <span className={`text-xs font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                ({durationInfo.cyclesEstimate})
              </span>
            ) : null}
          </div>
        </div>

        {/* Row 2: Sleep Quality Stars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              id="label-quality-rating"
              className={`text-xs font-medium flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              คุณภาพการนอน (1 - 5 ดาว):
            </label>
            <span className={`text-xs font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {getRatingLabel(hoverRating ?? rating)}
            </span>
          </div>

          <div
            id="star-rating-selector"
            className={`flex items-center justify-between sm:justify-start gap-1 sm:gap-3 p-3 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {[1, 2, 3, 4, 5].map((starNum) => {
              const isFilled = (hoverRating ?? rating) >= starNum;
              return (
                <button
                  key={starNum}
                  id={`btn-star-${starNum}`}
                  type="button"
                  onClick={() => setRating(starNum)}
                  onMouseEnter={() => setHoverRating(starNum)}
                  onMouseLeave={() => setHoverRating(null)}
                  className={`p-2 sm:p-2.5 rounded-xl transition-transform active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                  }`}
                  aria-label={`Rate ${starNum} stars`}
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : isDark
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Wake Mood Selection (5 Emojis) */}
        <div className="space-y-2">
          <label
            id="label-wake-mood"
            className={`text-xs font-medium flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            อารมณ์/ความรู้สึกตอนตื่น (เลือก 1 แบบ):
          </label>

          <div
            id="mood-emoji-selector"
            className="grid grid-cols-5 gap-1.5 sm:gap-3"
          >
            {MOOD_OPTIONS.map((item) => {
              const isSelected = mood === item.value;
              return (
                <button
                  key={item.value}
                  id={`btn-mood-${item.value}`}
                  type="button"
                  onClick={() => setMood(item.value)}
                  className={`flex flex-col items-center justify-center p-1.5 sm:p-3 rounded-2xl border transition-all min-h-[66px] sm:min-h-[76px] active:scale-95 ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-md shadow-indigo-950/60 scale-[1.02] ring-1 ring-indigo-400'
                        : 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-md shadow-indigo-100 scale-[1.02] ring-1 ring-indigo-500 font-semibold'
                      : isDark
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl sm:text-3xl mb-1 filter drop-shadow-xs select-none">
                    {item.emoji}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight break-words px-0.5">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Short Note (max 100 chars) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="journal-note"
              className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
              โน้ตสั้นๆ เกี่ยวกับการนอน:
            </label>
            <span
              className={`text-[11px] ${
                note.length >= 90
                  ? isDark
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-600 font-bold'
                  : isDark
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              {note.length} / 100 ตัวอักษร
            </span>
          </div>
          <input
            id="journal-note"
            type="text"
            maxLength={100}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ดื่มชาคาโมมายล์ก่อนนอน, ฝันดี, ตื่นมาออกกำลังกาย"
            className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border transition-colors min-h-[44px] ${
              isDark
                ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Submit Button with Validation Protection */}
        <div className="space-y-2">
          <button
            id="btn-save-sleep-record"
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:border disabled:border-slate-200 dark:disabled:border-slate-700/80 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-950/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] min-h-[48px]"
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span>บันทึกข้อมูลการนอน</span>
          </button>

          {!isFormValid && (
            <p className="text-center text-xs text-rose-500 font-medium flex items-center justify-center gap-1 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อนเพื่อเปิดใช้งานปุ่มบันทึก</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
