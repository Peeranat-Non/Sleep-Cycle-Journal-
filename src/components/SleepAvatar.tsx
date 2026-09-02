import React, { useState } from 'react';
import { Sparkles, Star, Clock, Heart, Zap, Award } from 'lucide-react';
import { SleepRecord, MoodLevel } from '../types';
import { useTheme } from '../context/ThemeContext';
import { MOOD_COLORS } from './MoodFaceIcon';

interface SleepAvatarProps {
  records: SleepRecord[];
}

interface AvatarMoodState {
  statusTitle: string;
  statusBadge: string;
  badgeColor: string;
  moodLevel: MoodLevel;
  primaryColor: string;
  glowColor: string;
  borderColor: string;
  description: string;
  avgHours: number;
  avgRating: number;
  totalRecords: number;
  eyesType: 'sparkle' | 'happy' | 'neutral' | 'sleepy' | 'tired' | 'rest';
  mouthType: 'big-smile' | 'smile' | 'line' | 'frown' | 'deep-frown' | 'sleeping';
  accessory: string;
}

export const SleepAvatar: React.FC<SleepAvatarProps> = ({ records }) => {
  const { isDark } = useTheme();
  const [isInteracting, setIsInteracting] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Determine avatar expression and status strictly based on average sleep hours and average star rating
  const calculateAvatarState = (): AvatarMoodState => {
    if (!records || records.length === 0) {
      return {
        statusTitle: 'พร้อมเริ่มต้นบันทึกการนอน',
        statusBadge: 'รอข้อมูลประวัติ',
        badgeColor: isDark
          ? 'bg-slate-800 border-slate-700 text-slate-300'
          : 'bg-slate-100 border-slate-300 text-slate-700',
        moodLevel: 3,
        primaryColor: '#818CF8', // Indigo
        glowColor: 'shadow-indigo-500/30',
        borderColor: isDark ? 'border-indigo-400/50' : 'border-indigo-300',
        description: 'กดคำนวณรอบการนอนและบันทึกประวัติเพื่อปลดล็อกตัวละครของคุณ!',
        avgHours: 0,
        avgRating: 0,
        totalRecords: 0,
        eyesType: 'rest',
        mouthType: 'smile',
        accessory: '💤',
      };
    }

    const totalMinutes = records.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgDurationHours = totalMinutes / records.length / 60;
    const avgRating = records.reduce((acc, curr) => acc + curr.rating, 0) / records.length;
    const totalRecords = records.length;

    // 1. ระดับยอดเยี่ยม / สดชื่นเต็มที่ (Super Fresh) - เขียวเข้ม
    if (avgDurationHours >= 7.5 && avgRating >= 4.0) {
      return {
        statusTitle: 'สดชื่นเต็มพลัง (Super Fresh)',
        statusBadge: 'ฟื้นฟูเต็มที่ 100%',
        badgeColor: isDark
          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
          : 'bg-emerald-100 border-emerald-300 text-emerald-800',
        moodLevel: 5,
        primaryColor: MOOD_COLORS[5].hex, // #1EB854
        glowColor: MOOD_COLORS[5].glow,
        borderColor: 'border-[#1EB854]',
        description: `เฉลี่ยนอนเต็มอิ่ม ${avgDurationHours.toFixed(1)} ชม./คืน (${avgRating.toFixed(1)}/5 ดาว) ร่างกายและสมองฟื้นฟูเต็มพลัง`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
        eyesType: 'sparkle',
        mouthType: 'big-smile',
        accessory: '✨',
      };
    }

    // 2. ระดับสุขภาพดี / พักผ่อนเพียงพอ (Good Sleep) - เขียวอ่อน
    if (avgDurationHours >= 6.5 && avgRating >= 3.0) {
      return {
        statusTitle: 'พักผ่อนเพียงพอ สุขภาพดี (Good Sleep)',
        statusBadge: 'พลังงาน 80%',
        badgeColor: isDark
          ? 'bg-lime-500/20 border-lime-400/50 text-lime-300'
          : 'bg-lime-100 border-lime-300 text-lime-800',
        moodLevel: 4,
        primaryColor: MOOD_COLORS[4].hex, // #88D03C
        glowColor: MOOD_COLORS[4].glow,
        borderColor: 'border-[#88D03C]',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน (${avgRating.toFixed(1)}/5 ดาว) รักษาวินัยการนอนที่ดีเยี่ยมต่อไปนะ`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
        eyesType: 'happy',
        mouthType: 'smile',
        accessory: '🌱',
      };
    }

    // 3. ระดับปานกลาง / แอบงัวเงีย (A bit Sleepy) - สีเหลือง
    if (avgDurationHours >= 5.0 && avgRating >= 2.5) {
      return {
        statusTitle: 'ยังแอบงัวเงียเล็กน้อย (A bit Sleepy)',
        statusBadge: 'พลังงาน 55%',
        badgeColor: isDark
          ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
          : 'bg-amber-100 border-amber-300 text-amber-800',
        moodLevel: 3,
        primaryColor: MOOD_COLORS[3].hex, // #FAC017
        glowColor: MOOD_COLORS[3].glow,
        borderColor: 'border-[#FAC017]',
        description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน (${avgRating.toFixed(1)}/5 ดาว) ลองเพิ่มเวลานอนอีกนิดเพื่อให้ครบรอบ 90 นาที`,
        avgHours: avgDurationHours,
        avgRating,
        totalRecords,
        eyesType: 'neutral',
        mouthType: 'line',
        accessory: '☕',
      };
    }

    // 4. ระดับอ่อนเพลีย / พักผ่อนน้อย (Tired / Low Sleep) - สีส้ม/แดง
    const isVeryTired = avgDurationHours < 4.5 || avgRating < 2.0;
    return {
      statusTitle: isVeryTired ? 'เพลียสะสมมาก (Exhausted)' : 'อ่อนเพลีย ต้องการการพักผ่อน (Tired)',
      statusBadge: isVeryTired ? 'วิกฤติต้องการนอน' : 'ต้องการชาร์จพลัง',
      badgeColor: isDark
        ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
        : 'bg-rose-100 border-rose-300 text-rose-800',
      moodLevel: isVeryTired ? 1 : 2,
      primaryColor: isVeryTired ? MOOD_COLORS[1].hex : MOOD_COLORS[2].hex,
      glowColor: isVeryTired ? MOOD_COLORS[1].glow : MOOD_COLORS[2].glow,
      borderColor: isVeryTired ? 'border-[#EF4444]' : 'border-[#F97924]',
      description: `เฉลี่ยนอน ${avgDurationHours.toFixed(1)} ชม./คืน (${avgRating.toFixed(1)}/5 ดาว) ร่างกายต้องการการพักผ่อน คืนนี้ควรเข้านอนเร็วขึ้นนะ`,
      avgHours: avgDurationHours,
      avgRating,
      totalRecords,
      eyesType: isVeryTired ? 'tired' : 'sleepy',
      mouthType: isVeryTired ? 'deep-frown' : 'frown',
      accessory: '💤',
    };
  };

  const state = calculateAvatarState();

  const handleAvatarClick = () => {
    setIsInteracting(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  };

  return (
    <div
      id="sleep-avatar-card"
      className={`mx-auto max-w-xl p-4 sm:p-5 rounded-3xl backdrop-blur-md border shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-all duration-300 text-center sm:text-left relative overflow-hidden ${
        isDark
          ? 'bg-slate-900/85 border-slate-800/90 hover:border-slate-700 shadow-slate-950/50'
          : 'bg-white/95 border-slate-200 hover:border-slate-300 shadow-slate-200/80'
      }`}
    >
      {/* Decorative ambient background glow matching character state */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: state.primaryColor }}
      />

      {/* 1. Animated Moving Avatar Mascot (ขยับได้: floating, blinking, interactive) */}
      <div
        className="relative shrink-0 select-none cursor-pointer group"
        onClick={handleAvatarClick}
        title="คลิกที่ตัวละครเพื่อทักทาย!"
      >
        {/* Floating Zzz / Sparkle particles */}
        <div className="absolute -top-3 -right-2 pointer-events-none">
          <span
            className="inline-block text-xs sm:text-sm font-black animate-float-zzz select-none text-indigo-400"
            style={{ animationDelay: '0s' }}
          >
            {state.accessory}
          </span>
        </div>

        {/* Soft glowing halo */}
        <div
          className={`absolute -inset-1.5 rounded-full blur-md opacity-60 transition-all duration-500 ${state.glowColor}`}
          style={{ backgroundColor: state.primaryColor }}
        />

        {/* Floating Animated Character Circle */}
        <div
          id="avatar-circle-character"
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 shadow-xl flex items-center justify-center transition-all duration-300 ${
            state.borderColor
          } ${isInteracting ? 'scale-110 rotate-6' : 'animate-avatar-float'}`}
          style={{
            backgroundColor: state.primaryColor,
            boxShadow: `0 8px 24px -4px ${state.primaryColor}55`,
          }}
        >
          {/* Subtle top light highlight gloss */}
          <div className="absolute top-1 left-3 right-3 h-5 rounded-full bg-white/25 blur-[1px] pointer-events-none" />

          {/* SVG Expressive Face with Animated Blinking Eyes */}
          <svg
            width="68"
            height="68"
            viewBox="0 0 100 100"
            className="w-full h-full p-2.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cheeks (Blush) */}
            {(state.moodLevel >= 3) && (
              <>
                <circle cx="22" cy="54" r="7" fill="#FF5E7E" opacity="0.4" />
                <circle cx="78" cy="54" r="7" fill="#FF5E7E" opacity="0.4" />
              </>
            )}

            {/* Eyes Group with Blinking animation */}
            <g className="animate-avatar-blink">
              {state.eyesType === 'sparkle' ? (
                <>
                  {/* Happy closed crescent eyes */}
                  <path
                    d="M 26 44 Q 34 33 42 44"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 58 44 Q 66 33 74 44"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                </>
              ) : state.eyesType === 'tired' ? (
                <>
                  {/* Drooping tired eyes */}
                  <circle cx="34" cy="42" r="6" fill="#111827" />
                  <circle cx="66" cy="42" r="6" fill="#111827" />
                  {/* Under eye bags */}
                  <path
                    d="M 28 50 Q 34 54 40 50"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2.5"
                    opacity="0.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 50 Q 66 54 72 50"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2.5"
                    opacity="0.6"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  {/* Standard Round Eyes */}
                  <circle cx="34" cy="40" r="6" fill="#111827" />
                  <circle cx="66" cy="40" r="6" fill="#111827" />
                  {/* Eye sparkle reflection */}
                  <circle cx="36" cy="38" r="2" fill="#FFFFFF" />
                  <circle cx="68" cy="38" r="2" fill="#FFFFFF" />
                </>
              )}
            </g>

            {/* Mouth Path */}
            {state.mouthType === 'big-smile' && (
              <path
                d="M 26 56 C 32 78, 68 78, 74 56"
                fill="none"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {state.mouthType === 'smile' && (
              <path
                d="M 30 58 C 36 72, 64 72, 70 58"
                fill="none"
                stroke="#111827"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            )}
            {state.mouthType === 'line' && (
              <line
                x1="30"
                y1="64"
                x2="70"
                y2="64"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {state.mouthType === 'frown' && (
              <path
                d="M 31 68 C 36 54, 64 54, 69 68"
                fill="none"
                stroke="#111827"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            )}
            {state.mouthType === 'deep-frown' && (
              <path
                d="M 28 72 C 34 50, 66 50, 72 72"
                fill="none"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Sparkle icon badge */}
          <div
            className={`absolute -bottom-1 -right-1 border rounded-full p-1 shadow-md transition-transform group-hover:scale-110 ${
              isDark
                ? 'bg-slate-950 border-slate-700 text-amber-400'
                : 'bg-white border-slate-200 text-amber-500'
            }`}
          >
            {clickCount > 0 ? (
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-ping" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>

      {/* 2. Character Details & Health Stats */}
      <div className="flex-1 min-w-0 w-full space-y-1.5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          <span
            id="avatar-status-badge"
            className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-xs transition-all ${state.badgeColor}`}
          >
            {state.statusBadge}
          </span>

          {state.totalRecords > 0 ? (
            <>
              {/* Average Hours Badge */}
              <span
                id="avatar-avg-hours-badge"
                className={`text-[10px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 transition-colors duration-300 ${
                  isDark
                    ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}
              >
                <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>เฉลี่ย {state.avgHours.toFixed(1)} ชม./คืน</span>
              </span>

              {/* Average Rating Stars Badge */}
              <span
                id="avatar-avg-rating-badge"
                className={`text-[10px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 transition-colors duration-300 ${
                  isDark
                    ? 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                <span>{state.avgRating.toFixed(1)} ดาว</span>
              </span>
            </>
          ) : (
            <span
              className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Zap className="w-3 h-3 text-indigo-400" />
              <span>โหมดเริ่มต้น</span>
            </span>
          )}
        </div>

        {/* Character Title with mood indicator */}
        <h3
          id="avatar-character-title"
          className={`text-sm sm:text-base font-bold tracking-tight break-words flex items-center justify-center sm:justify-start gap-1.5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>สถานะ:</span>
          <span
            className="font-extrabold"
            style={{ color: state.primaryColor }}
          >
            {state.statusTitle}
          </span>
        </h3>

        {/* Dynamic description displaying calculated stats */}
        <p
          id="avatar-character-desc"
          className={`text-xs leading-relaxed break-words ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {state.description}
        </p>

        {/* 5-Color Mood Spectrum Indicator Bar */}
        <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ระดับสุขภาพ:
          </span>
          <div className="flex items-center gap-1">
            {[5, 4, 3, 2, 1].map((lvl) => {
              const active = state.moodLevel === lvl;
              return (
                <div
                  key={lvl}
                  className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'scale-125 ring-1 ring-white/50 shadow-xs'
                      : 'opacity-40'
                  }`}
                  style={{
                    backgroundColor: MOOD_COLORS[lvl as MoodLevel].hex,
                  }}
                  title={MOOD_COLORS[lvl as MoodLevel].label}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
