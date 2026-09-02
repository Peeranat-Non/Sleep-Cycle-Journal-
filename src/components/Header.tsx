import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  Stars,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Calculator,
  PenLine,
  TrendingUp,
} from 'lucide-react';
import { SleepRecord } from '../types';
import { SleepAvatar } from './SleepAvatar';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  records?: SleepRecord[];
}

export const Header: React.FC<HeaderProps> = ({ records = [] }) => {
  const { isDark } = useTheme();
  const [showInfo, setShowInfo] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <header id="app-header" className="relative text-center pt-4 pb-2 px-4 space-y-4">
      {/* Subtle night/day sky glow background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-32 bg-indigo-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Main App Title */}
      <div
        className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-inner transition-colors duration-300 ${
          isDark
            ? 'bg-indigo-950/70 border border-indigo-500/30 text-indigo-300'
            : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
        }`}
      >
        <Stars className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Sleep Cycle & Sleep Journal</span>
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <div
          className={`p-2.5 rounded-2xl shadow-lg border transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-indigo-400/20'
              : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-200'
          }`}
        >
          <Moon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-400/30" />
        </div>
        <h1
          id="app-main-title"
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight drop-shadow-xs transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          นอนบ้าง
        </h1>
      </div>

      <p
        id="app-description"
        className={`mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed transition-colors duration-300 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        วางแผนเวลาเข้านอนและตื่นนอนให้ตรงรอบการนอน 90 นาที เพื่อตื่นอย่างสดชื่น พร้อมบันทึกคุณภาพการนอนประจำวัน
      </p>

      {/* Toggle Buttons: Sleep Cycle Info & How to use 3 Steps */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button
          id="btn-toggle-sleep-guide"
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className={`inline-flex items-center gap-1.5 text-xs transition-all px-3 py-1.5 rounded-xl border ${
            showInfo
              ? isDark
                ? 'bg-indigo-600/40 text-indigo-200 border-indigo-400/50 shadow-xs'
                : 'bg-indigo-100 text-indigo-800 border-indigo-300 shadow-xs'
              : isDark
              ? 'text-indigo-300/90 hover:text-indigo-200 bg-indigo-900/30 hover:bg-indigo-900/50 border-indigo-500/20'
              : 'text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border-indigo-200 shadow-xs'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>ทำความเข้าใจรอบการนอน 90 นาที</span>
          {showInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          id="btn-toggle-how-to-play"
          type="button"
          onClick={() => setShowHowTo(!showHowTo)}
          className={`inline-flex items-center gap-1.5 text-xs transition-all px-3 py-1.5 rounded-xl border ${
            showHowTo
              ? isDark
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-xs'
                : 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              : isDark
              ? 'text-amber-300/90 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border-amber-500/30'
              : 'text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-50 border-amber-200 shadow-xs'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>วิธีการเล่น 3 Step</span>
          {showHowTo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Accordion 1: Sleep Cycle Concept */}
      {showInfo && (
        <div
          id="sleep-guide-card"
          className={`mt-4 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm shadow-xl animate-fade-in border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900/90 border-indigo-500/30 text-slate-300'
              : 'bg-white border-indigo-200 text-slate-700 shadow-slate-200'
          }`}
        >
          <h2
            className={`font-semibold mb-2 flex items-center gap-2 ${
              isDark ? 'text-indigo-200' : 'text-indigo-900'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            หลักการคำนวณรอบการนอน (Sleep Cycle)
          </h2>
          <ul
            className={`space-y-2 list-disc list-inside leading-relaxed pl-1 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <li>
              วงจรการนอนหลับตามธรรมชาติของมนุษย์ (Sleep Cycle) เฉลี่ยอยู่ที่{' '}
              <strong className={isDark ? 'text-indigo-200' : 'text-indigo-700'}>
                90 นาทีต่อ 1 รอบ
              </strong>
            </li>
            <li>
              คนเรามักใช้เวลาประมาณ{' '}
              <strong className={isDark ? 'text-amber-200' : 'text-amber-700'}>
                15 นาที
              </strong>{' '}
              ในการเคลิ้มผล็อยหลับ (Fall asleep latency)
            </li>
            <li>
              การตื่นนอนในจุดที่ครบรอบการนอน (เช่น 5 หรือ 6 รอบ หรือประมาณ 7.5 - 9 ชม.)
              จะช่วยให้สมองไม่ถูกปลุกในช่วงหลับลึก ทำให้รู้สึก{' '}
              <strong className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
                สดชื่น ไม่งัวเงีย
              </strong>
            </li>
          </ul>
        </div>
      )}

      {/* Accordion 2: 3-Step App Usage Guide */}
      {showHowTo && (
        <div
          id="how-to-play-card"
          className={`mt-4 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm shadow-xl animate-fade-in border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900/90 border-amber-500/30 text-slate-300'
              : 'bg-white border-amber-200 text-slate-700 shadow-slate-200'
          }`}
        >
          <h2
            className={`font-semibold mb-3 flex items-center gap-2 ${
              isDark ? 'text-amber-200' : 'text-amber-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            วิธีการใช้งานแอป "นอนบ้าง" (3 ขั้นตอนง่ายๆ)
          </h2>

          <div className="space-y-3">
            {/* Step 1 */}
            <div
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors duration-300 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-400/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <div
                  className={`font-medium flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                  <span>คำนวณเวลานอนที่เหมาะสม</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  เลือกโหมด <strong>"ตื่นกี่โมงดี"</strong> (กรอกเวลานอน หรือกดปุ่ม <em>นอนตอนนี้</em>) หรือโหมด <strong>"เข้านอนกี่โมงดี"</strong> เพื่อดูเวลาที่ครบรอบการนอน 90 นาที จากนั้น<strong>คลิกที่การ์ดเวลา</strong>เพื่อส่งต่อไปยังฟอร์มบันทึก
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors duration-300 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-400/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <div
                  className={`font-medium flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5 text-purple-500" />
                  <span>บันทึกคุณภาพการนอน (Sleep Journal)</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  หลังตื่นนอน ให้เลือกคะแนนคุณภาพ <strong>1-5 ดาว</strong>, เลือก<strong>อีโมจิบอกอารมณ์ตอนตื่น</strong> (5 ระดับ) และพิมพ์โน้ตสั้นๆ (ไม่เกิน 100 ตัวอักษร) แล้วกด <strong>"บันทึกข้อมูลการนอน"</strong>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors duration-300 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <div
                  className={`font-medium flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ติดตามสถิติและประวัติย้อนหลัง</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ดูแถบสรุป<strong>ชั่วโมงนอนเฉลี่ยต่อคืน</strong>และ<strong>คุณภาพการนอนเฉลี่ย</strong> ข้อมูลถูกเก็บไว้ในเครื่องของคุณอัตโนมัติ ไม่หายแม้รีเฟรชหน้า
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Sleep Character Avatar Banner - positioned below guide/how-to section */}
      <div className="pt-2">
        <SleepAvatar records={records} />
      </div>
    </header>
  );
};

