import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  FileText,
} from 'lucide-react';
import { SleepRecord } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';
import { MoodFaceIcon, MOOD_COLORS } from './MoodFaceIcon';
import { useTheme } from '../context/ThemeContext';
import { formatThaiDate } from '../utils/sleepMath';

interface SleepTrendsAndCalendarProps {
  records: SleepRecord[];
}

export const SleepTrendsAndCalendar: React.FC<SleepTrendsAndCalendarProps> = ({ records }) => {
  const { isDark } = useTheme();
  const [activeView, setActiveView] = useState<'chart' | 'calendar'>('chart');
  
  // Current calendar month view state (defaults to today's month)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedRecord, setSelectedRecord] = useState<SleepRecord | null>(null);

  if (!records || records.length === 0) {
    return null;
  }

  // --- 1. CHART DATA PREPARATION ---
  // Take up to the last 10 entries and sort chronologically (oldest to newest for left-to-right time chart)
  const chartData = [...records]
    .slice(0, 10)
    .reverse()
    .map((record) => {
      const moodItem = MOOD_OPTIONS.find((m) => m.value === record.mood);
      const hours = Number((record.durationMinutes / 60).toFixed(1));

      // Short Thai date label (e.g. "1/9")
      const dateParts = record.date.split('-');
      const shortDate =
        dateParts.length === 3 ? `${parseInt(dateParts[2], 10)}/${parseInt(dateParts[1], 10)}` : record.date;

      return {
        id: record.id,
        rawDate: record.date,
        shortDate,
        hours,
        durationFormatted: record.durationFormatted,
        rating: record.rating,
        moodEmoji: moodItem?.emoji || '😴',
        moodLabel: moodItem?.label || 'ปกติ',
        mood: record.mood,
        bedTime: record.bedTime,
        wakeTime: record.wakeTime,
      };
    });

  // Custom Theme Tooltip for Chart
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[170px] border ${
            isDark
              ? 'bg-slate-950/95 border-slate-700/80 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-1.5 font-semibold ${
              isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'
            }`}
          >
            <span>วันที่ {data.rawDate}</span>
            <MoodFaceIcon mood={data.mood || 3} size={20} />
          </div>
          <div className={`flex items-center justify-between ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
            <span className="flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-500" /> เวลานอน:
            </span>
            <span className="font-bold">
              {data.durationFormatted} ({data.hours} ชม.)
            </span>
          </div>
          <div className={`flex items-center justify-between ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> คุณภาพดาว:
            </span>
            <span className="font-bold">{data.rating} / 5</span>
          </div>
          <div
            className={`text-[10px] pt-1 border-t flex justify-between ${
              isDark ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-200'
            }`}
          >
            <span>
              {data.bedTime} น. → {data.wakeTime} น.
            </span>
            <span>{data.moodLabel}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // --- 2. CALENDAR COMPUTATION ---
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  const thaiMonthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];

  const thaiDaysOfWeek = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  // Calculate days in month and starting day offset
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map of records keyed by 'YYYY-MM-DD'
  const recordsByDate = new Map<string, SleepRecord>();
  records.forEach((rec) => {
    recordsByDate.set(rec.date, rec);
  });

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToTodayMonth = () => {
    setCurrentDate(new Date());
  };

  // Calendar cells generation (including leading empty padding)
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ isEmpty: true, dayNumber: 0, dateKey: '' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const monthFormatted = String(currentMonth + 1).padStart(2, '0');
    const dayFormatted = String(d).padStart(2, '0');
    const dateKey = `${currentYear}-${monthFormatted}-${dayFormatted}`;
    calendarDays.push({
      isEmpty: false,
      dayNumber: d,
      dateKey,
      record: recordsByDate.get(dateKey),
    });
  }

  return (
    <div
      id="sleep-trends-and-calendar-card"
      className={`p-4 sm:p-5 rounded-2xl border shadow-md space-y-4 transition-colors ${
        isDark ? 'bg-slate-950/70 border-slate-800/90' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Header: Title + Segmented View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          {activeView === 'chart' ? (
            <TrendingUp className="w-5 h-5 text-indigo-500 shrink-0" />
          ) : (
            <CalendarIcon className="w-5 h-5 text-indigo-500 shrink-0" />
          )}
          <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeView === 'chart' ? 'กราฟสถิติแนวโน้มการนอน (Sleep Trends)' : 'ปฏิทินบันทึกการนอน (Sleep Calendar)'}
          </h3>
        </div>

        {/* View Switcher Toggle Buttons */}
        <div
          id="view-toggle-container"
          className={`inline-flex items-center p-1 rounded-xl border self-start sm:self-auto ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-2xs'
          }`}
        >
          <button
            id="btn-view-chart"
            type="button"
            onClick={() => setActiveView('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'chart'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>มุมมองกราฟ</span>
          </button>

          <button
            id="btn-view-calendar"
            type="button"
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'calendar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>มุมมองปฏิทิน</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GRAPH VIEW */}
      {activeView === 'chart' && (
        <div className="space-y-4 animate-fade-in">
          {/* Chart Legends */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-indigo-300' : 'text-indigo-700 font-medium'}`}>
                <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-indigo-600 to-purple-500" />
                <span>ชั่วโมงการนอน (แกนซ้าย)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-amber-700 font-medium'}`}>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>คุณภาพดาว (แกนขวา)</span>
              </div>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              (แสดงสูงสุด 10 วันล่าสุด)
            </span>
          </div>

          {/* Chart Canvas */}
          <div className="h-60 sm:h-64 w-full pt-2 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="sleepBarGradientCombined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />

                <XAxis
                  dataKey="shortDate"
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                />

                {/* Left Axis: Sleep Hours */}
                <YAxis
                  yAxisId="left"
                  domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax + 1))]}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                  tick={{ fill: isDark ? '#818cf8' : '#6366f1', fontSize: 11 }}
                  unit="ชม."
                />

                {/* Right Axis: Quality Rating (1 to 5 stars) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 5]}
                  tickCount={6}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                  tick={{ fill: isDark ? '#fbbf24' : '#d97706', fontSize: 11 }}
                  unit="⭐"
                />

                {/* Target 7.5 hrs reference line */}
                <ReferenceLine
                  yAxisId="left"
                  y={7.5}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.8}
                  label={{
                    value: 'เป้าหมาย 7.5 ชม.',
                    fill: '#10b981',
                    fontSize: 10,
                    position: 'insideTopLeft',
                  }}
                />

                <Tooltip content={<CustomChartTooltip />} />

                {/* Bar: Sleep Duration */}
                <Bar yAxisId="left" dataKey="hours" fill="url(#sleepBarGradientCombined)" radius={[6, 6, 0, 0]} maxBarSize={38} />

                {/* Line: Star Rating */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rating"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ fill: '#fbbf24', r: 4, strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
                  activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`text-[11px] flex items-center justify-between pt-1 border-t ${
              isDark ? 'text-slate-400 border-slate-800/60' : 'text-slate-500 border-slate-200'
            }`}
          >
            <span>* กราฟจะอัปเดตอัตโนมัติเมื่อบันทึกข้อมูลใหม่</span>
            <span className="text-emerald-500 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" /> เส้นประสีเขียว = เกณฑ์การนอนที่แนะนำ (7.5 ชม.)
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: CALENDAR VIEW */}
      {activeView === 'calendar' && (
        <div className="space-y-4 animate-fade-in">
          {/* Calendar Month Navigation */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {thaiMonthNames[currentMonth]} {currentYear + 543}
              </h4>
              <button
                type="button"
                onClick={goToTodayMonth}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                เดือนปัจจุบัน
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-calendar-prev-month"
                type="button"
                onClick={prevMonth}
                aria-label="Previous Month"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-calendar-next-month"
                type="button"
                onClick={nextMonth}
                aria-label="Next Month"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs py-1">
            {thaiDaysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`py-1 ${
                  idx === 0
                    ? 'text-rose-500'
                    : idx === 6
                    ? 'text-indigo-400'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              if (cell.isEmpty) {
                return <div key={`empty-${idx}`} className="h-14 sm:h-18 rounded-xl opacity-0" />;
              }

              const hasRecord = !!cell.record;
              const isSelected = selectedRecord?.id === cell.record?.id;
              const moodInfo = hasRecord ? MOOD_COLORS[cell.record!.mood || 3] : null;

              // Check today and future date accurately
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const cellDate = new Date(currentYear, currentMonth, cell.dayNumber);
              cellDate.setHours(0, 0, 0, 0);

              const isToday = today.getTime() === cellDate.getTime();
              const isFuture = cellDate.getTime() > today.getTime();

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => {
                    if (hasRecord && cell.record) {
                      setSelectedRecord(cell.record);
                    }
                  }}
                  className={`relative h-14 sm:h-18 rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-between transition-all select-none ${
                    hasRecord
                      ? isDark
                        ? 'cursor-pointer active:scale-95 hover:shadow-md bg-slate-900/90 border border-slate-800 hover:border-slate-700'
                        : 'cursor-pointer active:scale-95 hover:shadow-md bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                      : isFuture
                      ? 'cursor-default opacity-40 bg-transparent'
                      : 'cursor-default opacity-60 bg-transparent'
                  } ${
                    isSelected
                      ? 'scale-[1.03] z-10 shadow-md'
                      : ''
                  }`}
                  style={
                    hasRecord && moodInfo && isSelected
                      ? {
                          borderColor: moodInfo.hex,
                          boxShadow: `0 0 0 2px ${moodInfo.hex}40`,
                        }
                      : undefined
                  }
                >
                  {/* Day Number Header */}
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-[10px] sm:text-xs font-semibold leading-none ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Small sleep hour badge on desktop */}
                    {hasRecord && cell.record && (
                      <span className="hidden sm:inline-block text-[9px] font-medium text-slate-400">
                        {(cell.record.durationMinutes / 60).toFixed(1)}h
                      </span>
                    )}
                  </div>

                  {/* Mood Face Emoji Icon representation - ONLY for days with recorded entries */}
                  {hasRecord && cell.record ? (
                    <div className="my-auto transition-transform hover:scale-110">
                      <MoodFaceIcon
                        mood={cell.record.mood}
                        size={24}
                        className="sm:w-7 sm:h-7"
                      />
                    </div>
                  ) : (
                    <div className="my-auto" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Color Mood Guide Legend */}
          <div
            className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
              isDark ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-200'
            }`}
          >
            <span className="font-medium">แตะที่อีโมจิเพื่อเปิดดูรายละเอียด</span>
            <div className="flex items-center gap-2">
              {[5, 4, 3, 2, 1].map((lvl) => (
                <div key={lvl} className="flex items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: MOOD_COLORS[lvl as 1 | 2 | 3 | 4 | 5].hex }}
                  />
                  <span className="text-[10px] hidden sm:inline">
                    {MOOD_COLORS[lvl as 1 | 2 | 3 | 4 | 5].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Detailed Record View when clicking a day on calendar */}
      {selectedRecord && (
        <div
          id="calendar-record-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className={`w-full max-w-md rounded-3xl p-5 sm:p-6 border shadow-2xl relative space-y-4 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className={`absolute top-4 right-4 p-1.5 rounded-full border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Date + Mood Icon */}
            <div className="flex items-center gap-3 border-b pb-3 pr-8">
              <MoodFaceIcon mood={selectedRecord.mood} size={42} />
              <div>
                <span className={`text-xs block ${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                  รายละเอียดการนอน
                </span>
                <h4 className="text-base sm:text-lg font-bold">
                  {formatThaiDate(selectedRecord.date)}
                </h4>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {/* Times */}
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`block mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  เวลาเข้านอน - ตื่นนอน
                </span>
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <Moon className="w-3.5 h-3.5" /> เข้านอน: {selectedRecord.bedTime} น.
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Sun className="w-3.5 h-3.5" /> ตื่นนอน: {selectedRecord.wakeTime} น.
                  </div>
                </div>
              </div>

              {/* Total Duration */}
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`block mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  เวลานอนทั้งหมด
                </span>
                <span className="text-base font-bold text-indigo-500 block">
                  {selectedRecord.durationFormatted}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({(selectedRecord.durationMinutes / 60).toFixed(1)} ชั่วโมง)
                </span>
              </div>
            </div>

            {/* Rating & Mood Info */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  คุณภาพความพึงพอใจ
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= selectedRecord.rating
                          ? 'text-amber-400 fill-amber-400'
                          : isDark
                          ? 'text-slate-700'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold ml-1">({selectedRecord.rating}/5 ดาว)</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  อารมณ์ตอนตื่น
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    color: MOOD_COLORS[selectedRecord.mood || 3]?.hex,
                    borderColor: `${MOOD_COLORS[selectedRecord.mood || 3]?.hex}40`,
                    backgroundColor: `${MOOD_COLORS[selectedRecord.mood || 3]?.hex}15`,
                  }}
                >
                  {MOOD_COLORS[selectedRecord.mood || 3]?.label}
                </span>
              </div>
            </div>

            {/* Note Section (if provided) */}
            {selectedRecord.note && (
              <div
                className={`p-3 rounded-2xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`font-semibold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> โน้ตเพิ่มเติม:
                </span>
                <p className={`italic ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  "{selectedRecord.note}"
                </p>
              </div>
            )}

            {/* Close Button at bottom */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
