import React from 'react';
import { Sparkles, Star, Clock } from 'lucide-react';
import { SleepRecord } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SleepAvatarProps {
  records: SleepRecord[];
}

interface AvatarMoodState {
  statusTitle: string;
  statusBadge: string;
  badgeColor: string;
  avatarFace: string;
  avatarColor: string;
  glowColor: string;
  borderColor: string;
  description: string;
  avgHours: number;
  avgRating: number;
  totalRecords: number;
}

export const SleepAvatar: React.FC<SleepAvatarProps> = ({ records }) => {
  const { isDark } = useTheme();

  // Determine avatar expression and status strictly based on average sleep hours and average star rating
  const calculateAvatarState = (): AvatarMoodState => {
    if (!records || records.length === 0) {
      return {
        statusTitle: 'พร้อมเริ่มต้นการนอนใหม่',
        statusBadge: 'รอข้อมูลประวัติ',
        badgeColor: isDark
          ? 'bg-slate-800 border-slate-700 text-slate-300'
          : 'bg-slate-100 border-slate-300 text-slate-700',
        avatarFace: '😴',
        avatarColor: isDark
          ? 'from-indigo-600/30 to-purple-600/30'
          : 'from-indigo-200 to-purple-200',
        glowColor: 'shadow-indigo-500/20',
        borderColor: isDark ? 'border-indigo-400/40' : 'border-indigo-300',
        description: 'เริ่มคำนวณและบันทึกประวัติการนอนเพื่อติดตามค่าเฉลี่ยชั่วโมงและคุณภาพดาว!',
        avgHours: 0,
        avgRating: 0,
        totalRecords: 0,
      };
    }

    const totalMinutes = records.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgDurationHours = totalMinutes / records.length / 60;
    const avgRating = records.reduce((acc, curr) => acc + curr.rating, 0) / records.length;
    const totalRecords = records.length;

    // 1. ระดับยอดเยี่ยม / สดชื่นเต็มที่ (Super Fresh):
    if (avgDurationHours >= 7.5 && avgRating >= 4.0) {
      return {
        statusTitle: 'สดชื่นเต็มพลัง (Super Fresh)',
        statusBadge: 'ฟื้นฟูเต็มที่ 100%',
        badgeColor: isDark
          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
          : 'bg-emerald-100 border-emerald-300 text-emerald-800',
        avatarFace: '🤩',
        avatarColor: isDark
          ? 'from-emerald-600/30 via-teal-600/20 to-indigo-600/30'
          : 'from-emerald-200 via-teal-100 to-indigo-200',
        glowColor: 'shadow-emerald-500/30',
        borderColor: isDark ? 'border-emerald-400/60' : 'border-emerald-400',
        description: `เฉลี่ยนอนเต็มอิ่ม ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว ร่างกายและสมองฟื้นฟูได้อย่างสมบูรณ์แบบ`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 2. ระดับสุขภาพดี / พักผ่อนเพียงพอ (Good Sleep):
    if (avgDurationHours >= 6.5 && avgRating >= 3.0) {
      return {
        statusTitle: 'พักผ่อนเพียงพอ สุขภาพดี (Good Sleep)',
        statusBadge: 'พลังงาน 80%',
        badgeColor: isDark
          ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-200'
          : 'bg-indigo-100 border-indigo-300 text-indigo-800',
        avatarFace: '😊',
        avatarColor: isDark
          ? 'from-indigo-600/30 via-purple-600/20 to-blue-600/30'
          : 'from-indigo-200 via-purple-100 to-blue-200',
        glowColor: 'shadow-indigo-500/30',
        borderColor: isDark ? 'border-indigo-400/60' : 'border-indigo-400',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว รักษาวินัยเวลานอนที่ดีแบบนี้ต่อไปนะ`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 3. ระดับปานกลาง / แอบงัวเงีย (A bit Sleepy):
    if (avgDurationHours >= 5.0 && avgRating >= 2.5) {
      return {
        statusTitle: 'ยังแอบงัวเงียเล็กน้อย (A bit Sleepy)',
        statusBadge: 'พลังงาน 55%',
        badgeColor: isDark
          ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
          : 'bg-amber-100 border-amber-300 text-amber-800',
        avatarFace: '🥱',
        avatarColor: isDark
          ? 'from-amber-600/30 via-orange-600/20 to-purple-600/30'
          : 'from-amber-200 via-orange-100 to-purple-200',
        glowColor: 'shadow-amber-500/25',
        borderColor: isDark ? 'border-amber-400/50' : 'border-amber-400',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว ลองเพิ่มเวลานอนอีกนิดเพื่อให้ครบรอบ 90 นาที`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 4. ระดับอ่อนเพลีย / พักผ่อนน้อย (Tired / Low Sleep):
    return {
      statusTitle: 'อ่อนเพลีย ต้องการการพักผ่อน (Tired)',
      statusBadge: 'ต้องการชาร์จพลัง',
      badgeColor: isDark
        ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
        : 'bg-rose-100 border-rose-300 text-rose-800',
      avatarFace: '😫',
      avatarColor: isDark
        ? 'from-rose-600/30 via-purple-600/20 to-slate-800/40'
        : 'from-rose-200 via-purple-100 to-slate-200',
      glowColor: 'shadow-rose-500/25',
      borderColor: isDark ? 'border-rose-400/60' : 'border-rose-400',
      description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว ร่างกายต้องการพักผ่อน คืนนี้ควรเข้านอนเร็วขึ้นนะ`,
      avgHours: avgDurationHours,
      avgRating,
      totalRecords,
    };
  };

  const state = calculateAvatarState();

  return (
    <div
      id="sleep-avatar-card"
      className={`mx-auto max-w-xl p-3.5 sm:p-4 rounded-3xl backdrop-blur-md border shadow-xl flex flex-col sm:flex-row items-center sm:items-center gap-3.5 sm:gap-4 transition-all duration-300 text-center sm:text-left ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
          : 'bg-white/95 border-slate-200 hover:border-slate-300 shadow-slate-200'
      }`}
    >
      {/* 1. Animated Circular Avatar */}
      <div className="relative shrink-0 select-none">
        {/* Soft pulsing glow ring */}
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-r ${state.avatarColor} blur-md opacity-70 animate-pulse`}
        />

        {/* Main Circular Character */}
        <div
          id="avatar-circle-character"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${state.avatarColor} border-2 ${
            state.borderColor
          } flex items-center justify-center shadow-lg ${state.glowColor} ${
            isDark ? 'bg-slate-950/90' : 'bg-white'
          }`}
        >
          {/* Facial expression icon */}
          <span className="text-2xl sm:text-3xl filter drop-shadow-xs transform transition-transform hover:scale-110 select-none">
            {state.avatarFace}
          </span>

          {/* Spark badge icon */}
          <div
            className={`absolute -top-1 -right-1 border rounded-full p-1 shadow-xs ${
              isDark
                ? 'bg-slate-950 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
        </div>
      </div>

      {/* 2 & 3. Dynamic Mood Text & Status Summary based on averages */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-1.5">
          <span
            id="avatar-status-badge"
            className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-xs ${state.badgeColor}`}
          >
            {state.statusBadge}
          </span>

          {state.totalRecords > 0 && (
            <>
              {/* Average Hours Badge */}
              <span
                id="avatar-avg-hours-badge"
                className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 transition-colors duration-300 ${
                  isDark
                    ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}
              >
                <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>เฉลี่ย {state.avgHours.toFixed(1)} ชม.</span>
              </span>

              {/* Average Rating Stars Badge */}
              <span
                id="avatar-avg-rating-badge"
                className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 transition-colors duration-300 ${
                  isDark
                    ? 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                <span>{state.avgRating.toFixed(1)} ดาว</span>
              </span>
            </>
          )}
        </div>

        {/* Character Title */}
        <h3
          id="avatar-character-title"
          className={`text-sm sm:text-base font-bold tracking-tight break-words flex items-center justify-center sm:justify-start gap-1.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>สถานะ:</span>
          <span className={isDark ? 'text-indigo-200' : 'text-indigo-600'}>
            {state.statusTitle}
          </span>
        </h3>

        {/* Short dynamic description displaying calculated stats */}
        <p
          id="avatar-character-desc"
          className={`text-xs leading-relaxed mt-0.5 break-words ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {state.description}
        </p>
      </div>
    </div>
  );
};

