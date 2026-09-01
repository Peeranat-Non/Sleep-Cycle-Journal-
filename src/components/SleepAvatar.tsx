import React from 'react';
import { Sparkles, Star, Clock, Flame } from 'lucide-react';
import { SleepRecord } from '../types';

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
  // Determine avatar expression and status strictly based on average sleep hours and average star rating
  const calculateAvatarState = (): AvatarMoodState => {
    if (!records || records.length === 0) {
      return {
        statusTitle: 'พร้อมเริ่มต้นการนอนใหม่',
        statusBadge: 'รอข้อมูลประวัติ',
        badgeColor: 'bg-slate-800 border-slate-700 text-slate-300',
        avatarFace: '😴',
        avatarColor: 'from-indigo-600/30 to-purple-600/30',
        glowColor: 'shadow-indigo-500/20',
        borderColor: 'border-indigo-400/40',
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
    // ชั่วโมงนอนเฉลี่ย >= 7.5 ชม. และ คุณภาพดาวเฉลี่ย >= 4.0 ดาว
    if (avgDurationHours >= 7.5 && avgRating >= 4.0) {
      return {
        statusTitle: 'สดชื่นเต็มพลัง (Super Fresh)',
        statusBadge: 'ฟื้นฟูเต็มที่ 100%',
        badgeColor: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
        avatarFace: '🤩',
        avatarColor: 'from-emerald-600/30 via-teal-600/20 to-indigo-600/30',
        glowColor: 'shadow-emerald-500/30',
        borderColor: 'border-emerald-400/60',
        description: `เฉลี่ยนอนเต็มอิ่ม ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว ร่างกายและสมองฟื้นฟูได้อย่างสมบูรณ์แบบ`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 2. ระดับสุขภาพดี / พักผ่อนเพียงพอ (Good Sleep):
    // ชั่วโมงนอนเฉลี่ย >= 6.5 ชม. และ คุณภาพดาวเฉลี่ย >= 3.0 ดาว
    if (avgDurationHours >= 6.5 && avgRating >= 3.0) {
      return {
        statusTitle: 'พักผ่อนเพียงพอ สุขภาพดี (Good Sleep)',
        statusBadge: 'พลังงาน 80%',
        badgeColor: 'bg-indigo-500/20 border-indigo-400/50 text-indigo-200',
        avatarFace: '😊',
        avatarColor: 'from-indigo-600/30 via-purple-600/20 to-blue-600/30',
        glowColor: 'shadow-indigo-500/30',
        borderColor: 'border-indigo-400/60',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว รักษาวินัยเวลานอนที่ดีแบบนี้ต่อไปนะ`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 3. ระดับปานกลาง / แอบงัวเงีย (A bit Sleepy):
    // ชั่วโมงนอนเฉลี่ย 5.0 - 6.4 ชม. หรือ คุณภาพดาวเฉลี่ย 2.5 - 2.9 ดาว
    if (avgDurationHours >= 5.0 && avgRating >= 2.5) {
      return {
        statusTitle: 'ยังแอบงัวเงียเล็กน้อย (A bit Sleepy)',
        statusBadge: 'พลังงาน 55%',
        badgeColor: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
        avatarFace: '🥱',
        avatarColor: 'from-amber-600/30 via-orange-600/20 to-purple-600/30',
        glowColor: 'shadow-amber-500/25',
        borderColor: 'border-amber-400/50',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน คุณภาพ ${avgRating.toFixed(1)}/5 ดาว ลองเพิ่มเวลานอนอีกนิดเพื่อให้ครบรอบ 90 นาที`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
      };
    }

    // 4. ระดับอ่อนเพลีย / พักผ่อนน้อย (Tired / Low Sleep):
    // ชั่วโมงนอนเฉลี่ย < 5.0 ชม. หรือ คุณภาพดาวเฉลี่ย < 2.5 ดาว
    return {
      statusTitle: 'อ่อนเพลีย ต้องการการพักผ่อน (Tired)',
      statusBadge: 'ต้องการชาร์จพลัง',
      badgeColor: 'bg-rose-500/20 border-rose-400/50 text-rose-300',
      avatarFace: '😫',
      avatarColor: 'from-rose-600/30 via-purple-600/20 to-slate-800/40',
      glowColor: 'shadow-rose-500/25',
      borderColor: 'border-rose-400/60',
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
      className="mx-auto max-w-xl p-3.5 sm:p-4 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800/90 shadow-xl flex items-center gap-3.5 sm:gap-4 transition-all duration-300 hover:border-slate-700"
    >
      {/* 1. Animated Circular Avatar */}
      <div className="relative shrink-0 select-none">
        {/* Soft pulsing glow ring */}
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-r ${state.avatarColor} blur-md opacity-70 animate-pulse`}
        />

        {/* Main Circular Character with Subtle Bobbing Animation */}
        <div
          id="avatar-circle-character"
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${state.avatarColor} bg-slate-950/90 border-2 ${state.borderColor} flex items-center justify-center shadow-lg ${state.glowColor} animate-bounce duration-1000`}
          style={{
            animationDuration: '3s',
            animationIterationCount: 'infinite',
          }}
        >
          {/* Facial expression icon */}
          <span className="text-2xl sm:text-3xl filter drop-shadow-md transform transition-transform hover:scale-110">
            {state.avatarFace}
          </span>

          {/* Spark badge icon */}
          <div className="absolute -top-1 -right-1 bg-slate-950 border border-slate-700 rounded-full p-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>
      </div>

      {/* 2 & 3. Dynamic Mood Text & Status Summary based on averages */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
          <span
            id="avatar-status-badge"
            className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${state.badgeColor}`}
          >
            {state.statusBadge}
          </span>

          {state.totalRecords > 0 && (
            <>
              {/* Average Hours Badge */}
              <span
                id="avatar-avg-hours-badge"
                className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 flex items-center gap-1"
              >
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>เฉลี่ย {state.avgHours.toFixed(1)} ชม./คืน</span>
              </span>

              {/* Average Rating Stars Badge */}
              <span
                id="avatar-avg-rating-badge"
                className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 flex items-center gap-1"
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>เฉลี่ย {state.avgRating.toFixed(1)} ดาว</span>
              </span>
            </>
          )}
        </div>

        {/* Character Title */}
        <h3
          id="avatar-character-title"
          className="text-sm sm:text-base font-bold text-white tracking-tight truncate flex items-center gap-1.5"
        >
          <span>สถานะ:</span>
          <span className="text-indigo-200">{state.statusTitle}</span>
        </h3>

        {/* Short dynamic description displaying calculated stats */}
        <p
          id="avatar-character-desc"
          className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5"
        >
          {state.description}
        </p>
      </div>
    </div>
  );
};
