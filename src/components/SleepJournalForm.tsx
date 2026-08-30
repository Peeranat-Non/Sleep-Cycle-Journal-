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
} from 'lucide-react';
import { MoodLevel, SleepRecord } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';
import {
  calculateDuration,
  getTodayDateFormatted,
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
  const [bedTime, setBedTime] = useState<string>('23:00');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [mood, setMood] = useState<MoodLevel>(4);
  const [note, setNote] = useState<string>('');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  // Sync when prefilled from calculator
  useEffect(() => {
    if (prefillBedTime) setBedTime(prefillBedTime);
  }, [prefillBedTime]);

  useEffect(() => {
    if (prefillWakeTime) setWakeTime(prefillWakeTime);
  }, [prefillWakeTime]);

  const durationInfo = calculateDuration(bedTime, wakeTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Reset optional note, keep reasonable defaults
    setNote('');
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
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h2
            id="journal-form-heading"
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5"
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
            บันทึกการนอน (Sleep Journal)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            จดบันทึกเวลา คุณภาพ และความรู้สึกหลังตื่นนอนเพื่อติดตามสุขภาพการนอน
          </p>
        </div>

        {showSavedFeedback && (
          <div
            id="save-success-badge"
            className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>บันทึกสำเร็จ!</span>
          </div>
        )}
      </div>

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
            <label
              htmlFor="journal-bedtime"
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              เวลาเข้านอน:
            </label>
            <input
              id="journal-bedtime"
              type="time"
              required
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Wake Time */}
          <div className="space-y-1.5">
            <label
              htmlFor="journal-waketime"
              className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              เวลาตื่นนอน:
            </label>
            <input
              id="journal-waketime"
              type="time"
              required
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Auto Duration Pill Box */}
        <div
          id="duration-calculator-badge"
          className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>คำนวณชั่วโมงการนอนอัตโนมัติ:</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              id="journal-calculated-hours"
              className="text-sm font-bold text-white bg-indigo-600/30 px-3 py-1 rounded-lg border border-indigo-400/30"
            >
              {durationInfo.formatted}
            </span>
            <span className="text-xs text-indigo-300 font-medium">
              ({durationInfo.cyclesEstimate})
            </span>
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

        {/* Submit Button */}
        <button
          id="btn-save-sleep-record"
          type="submit"
          className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>บันทึกข้อมูลการนอน</span>
        </button>
      </form>
    </div>
  );
};
