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
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            id="journal-form-heading"
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5"
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
            บันทึกการนอน (Sleep Journal)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            จดบันทึกเวลา คุณภาพ และความรู้สึกหลังตื่นนอนเพื่อติดตามสุขภาพการนอน (สามารถปรับเปลี่ยนเวลาเข้านอนและเวลาตื่นนอนให้ตรงกับความเป็นจริงได้)
          </p>
          {hasSelectedFromCards && !isSameTime && (
            <div
              id="restored-time-banner"
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-medium animate-fade-in"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>ดึงเวลาที่คุณเลือกจาก 4 ตัวเลือก: เข้านอน {bedTime} น. / ตื่น {wakeTime} น.</span>
            </div>
          )}
        </div>

        {showSavedFeedback && (
          <div
            id="save-success-badge"
            className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-fade-in self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>บันทึกสำเร็จ!</span>
          </div>
        )}
      </div>

      {/* Main Validation Alert Banner */}
      {(!hasSelectedFromCards || isSameTime || alertError) && (
        <div
          id="form-validation-alert-box"
          className="p-4 rounded-2xl bg-rose-950/70 border-2 border-rose-500/80 text-rose-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/50 animate-fade-in"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-rose-300 text-sm sm:text-base flex items-center gap-2">
                <span>กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อน</span>
                {isSameTime && (
                  <span className="text-xs font-normal text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-500/40">
                    เวลาเข้านอนและตื่นนอนเป็นเวลาเดียวกัน
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                ระบบคำนวณจะไม่บันทึกเวลาที่ซ้ำกัน และต้องเลือกเวลาที่แนะนำจากตัวเลือก 4 ชุดด้านบนเพื่อความถูกต้องของรอบการนอน
              </p>
            </div>
          </div>

          <button
            id="btn-alert-go-select-card"
            type="button"
            onClick={scrollToCalculatorCards}
            className="px-4 py-2 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 border border-rose-400/60 text-rose-100 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm active:scale-95"
          >
            <ArrowUpCircle className="w-4 h-4 text-rose-300" />
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
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              วันที่บันทึก:
            </label>
            <input
              id="journal-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Bedtime */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="journal-bedtime"
                className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                เวลาเข้านอน:
              </label>
              {isSameTime && (
                <span className="text-[11px] text-rose-400 font-bold">* เวลาซ้ำ</span>
              )}
            </div>
            <input
              id="journal-bedtime"
              type="time"
              required
              value={bedTime}
              onChange={(e) => handleBedTimeChange(e.target.value)}
              className={`w-full bg-slate-950 border text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                isSameTime
                  ? 'border-rose-500 bg-rose-950/30 ring-2 ring-rose-500/40 text-rose-200'
                  : isBedTimeValid
                  ? 'border-slate-700'
                  : 'border-rose-500 bg-rose-950/20'
              }`}
            />
          </div>

          {/* Wake Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="journal-waketime"
                className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                เวลาตื่นนอน:
              </label>
              {isSameTime && (
                <span className="text-[11px] text-rose-400 font-bold">* เวลาซ้ำ</span>
              )}
            </div>
            <input
              id="journal-waketime"
              type="time"
              required
              value={wakeTime}
              onChange={(e) => handleWakeTimeChange(e.target.value)}
              className={`w-full bg-slate-950 border text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                isSameTime
                  ? 'border-rose-500 bg-rose-950/30 ring-2 ring-rose-500/40 text-rose-200'
                  : isWakeTimeValid
                  ? 'border-slate-700'
                  : 'border-rose-500 bg-rose-950/20'
              }`}
            />
          </div>
        </div>

        {/* Helper tip: Can customize bedtime and waketime to match reality */}
        <div
          id="time-adjustment-tip"
          className="flex items-start sm:items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/25 text-indigo-200 text-xs"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-indigo-300">💡 ข้อแนะนำ:</strong> คุณสามารถกดคลิกเพื่อปรับเปลี่ยนเวลาเข้านอนและเวลาตื่นนอนในช่องด้านบนได้ตลอดเวลา เพื่อให้บันทึกตรงกับเวลาที่คุณเข้านอนและตื่นจริง
          </span>
        </div>

        {/* Auto Duration Pill Box */}
        <div
          id="duration-calculator-badge"
          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
            isSameTime
              ? 'bg-rose-950/40 border-rose-500/40'
              : isFormValid
              ? 'bg-indigo-950/40 border-indigo-500/20'
              : 'bg-slate-950/50 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>คำนวณชั่วโมงการนอนอัตโนมัติ:</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              id="journal-calculated-hours"
              className={`text-sm font-bold px-3 py-1 rounded-lg border ${
                isSameTime
                  ? 'text-rose-300 bg-rose-900/40 border-rose-500/40'
                  : isFormValid
                  ? 'text-white bg-indigo-600/30 border-indigo-400/30'
                  : 'text-slate-500 bg-slate-900 border-slate-800'
              }`}
            >
              {durationInfo.formatted}
            </span>
            {isSameTime ? (
              <span className="text-xs text-rose-400 font-semibold">
                (เวลาซ้ำกัน = 0 ชม.)
              </span>
            ) : isFormValid ? (
              <span className="text-xs text-indigo-300 font-medium">
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
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              คุณภาพการนอน (1 - 5 ดาว):
            </label>
            <span className="text-xs text-amber-300 font-medium">
              {getRatingLabel(hoverRating ?? rating)}
            </span>
          </div>

          <div
            id="star-rating-selector"
            className="flex items-center gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-2xl"
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
                  className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 transition-transform active:scale-90"
                  aria-label={`Rate ${starNum} stars`}
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-all ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600'
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
            className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
          >
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            อารมณ์/ความรู้สึกตอนตื่น (เลือก 1 แบบ):
          </label>

          <div
            id="mood-emoji-selector"
            className="grid grid-cols-5 gap-2 sm:gap-3"
          >
            {MOOD_OPTIONS.map((item) => {
              const isSelected = mood === item.value;
              return (
                <button
                  key={item.value}
                  id={`btn-mood-${item.value}`}
                  type="button"
                  onClick={() => setMood(item.value)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-md shadow-indigo-950/60 scale-[1.02] ring-1 ring-indigo-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-sm select-none">
                    {item.emoji}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-center whitespace-nowrap">
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
            <label htmlFor="journal-note" className="font-medium text-slate-300">
              โน้ตสั้นๆ เกี่ยวกับการนอน:
            </label>
            <span
              className={`text-[11px] ${
                note.length >= 90 ? 'text-amber-400 font-bold' : 'text-slate-400'
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
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Submit Button with Validation Protection */}
        <div className="space-y-2">
          <button
            id="btn-save-sleep-record"
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700/80 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>บันทึกข้อมูลการนอน</span>
          </button>

          {!isFormValid && (
            <p className="text-center text-xs text-rose-400 font-medium flex items-center justify-center gap-1 pt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>กรุณาเลือกเวลาจาก 4 ตัวเลือกก่อนเพื่อเปิดใช้งานปุ่มบันทึก</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};


