import React from 'react';
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
import { TrendingUp, Moon, Star, Sparkles } from 'lucide-react';
import { SleepRecord } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';

interface SleepTrendsChartProps {
  records: SleepRecord[];
}

export const SleepTrendsChart: React.FC<SleepTrendsChartProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return null;
  }

  // Take up to the last 10 entries and sort chronologically (oldest to newest for left-to-right time chart)
  const chartData = [...records]
    .slice(0, 10)
    .reverse()
    .map((record) => {
      const moodItem = MOOD_OPTIONS.find((m) => m.value === record.mood);
      const hours = Number((record.durationMinutes / 60).toFixed(1));
      
      // Short Thai date label (e.g., "1 ก.ย." or "01/09")
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
        bedTime: record.bedTime,
        wakeTime: record.wakeTime,
      };
    });

  // Custom Dark Theme Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-semibold text-slate-200">
            <span>วันที่ {data.rawDate}</span>
            <span className="text-base">{data.moodEmoji}</span>
          </div>
          <div className="flex items-center justify-between text-indigo-300">
            <span className="flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-400" /> เวลานอน:
            </span>
            <span className="font-bold">{data.durationFormatted} ({data.hours} ชม.)</span>
          </div>
          <div className="flex items-center justify-between text-amber-300">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> คุณภาพดาว:
            </span>
            <span className="font-bold">{data.rating} / 5</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex justify-between">
            <span>{data.bedTime} น. → {data.wakeTime} น.</span>
            <span>{data.moodLabel}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="sleep-trends-chart-card"
      className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-md space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            กราฟสถิติแนวโน้มการนอน (Sleep Trends)
          </h3>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-indigo-600 to-purple-500" />
            <span>ชั่วโมงการนอน (แกนซ้าย)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>คุณภาพดาว (แกนขวา)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 sm:h-64 w-full pt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="sleepBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="shortDate"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />

            {/* Left Axis: Sleep Hours */}
            <YAxis
              yAxisId="left"
              domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax + 1))]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#818cf8', fontSize: 11 }}
              unit="ชม."
            />

            {/* Right Axis: Quality Rating (1 to 5 stars) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 5]}
              tickCount={6}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#fbbf24', fontSize: 11 }}
              unit="⭐"
            />

            {/* Target 7.5 hrs reference line */}
            <ReferenceLine
              yAxisId="left"
              y={7.5}
              stroke="#34d399"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: 'เป้าหมาย 7.5 ชม.',
                fill: '#34d399',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Bar: Sleep Duration */}
            <Bar
              yAxisId="left"
              dataKey="hours"
              fill="url(#sleepBarGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />

            {/* Line: Star Rating */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rating"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={{ fill: '#fbbf24', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span>* แสดงสถิติสูงสุด 10 รายการล่าสุดตามลำดับเวลา</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> เส้นประสีเขียว = เกณฑ์การนอนที่แนะนำ (7.5 ชม.)
        </span>
      </div>
    </div>
  );
};
