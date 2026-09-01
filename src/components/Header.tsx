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
  ArrowRight,
} from 'lucide-react';
import { SleepRecord } from '../types';
import { SleepAvatar } from './SleepAvatar';

interface HeaderProps {
  records?: SleepRecord[];
}

export const Header: React.FC<HeaderProps> = ({ records = [] }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <header id="app-header" className="relative text-center pt-6 pb-4 px-4 space-y-4">
      {/* Subtle night-sky glow background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-32 bg-indigo-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* 1. Dynamic Sleep Character Avatar Banner prominently positioned at top */}
      <SleepAvatar records={records} />

      {/* Main App Title */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium shadow-inner">
        <Stars className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Sleep Cycle & Sleep Journal</span>
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-400/20 rounded-2xl shadow-lg">
          <Moon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 fill-amber-300/20" />
        </div>
        <h1
          id="app-main-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-sm"
        >
          นอนบ้าง
        </h1>
      </div>

      <p id="app-description" className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
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
              ? 'bg-indigo-600/40 text-indigo-200 border-indigo-400/50 shadow-sm'
              : 'text-indigo-300/90 hover:text-indigo-200 bg-indigo-900/30 hover:bg-indigo-900/50 border-indigo-500/20'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>ทำความเข้าใจรอบการนอน 90 นาที</span>
          {showInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          id="btn-toggle-how-to-play"
          type="button"
          onClick={() => setShowHowTo(!showHowTo)}
          className={`inline-flex items-center gap-1.5 text-xs transition-all px-3 py-1.5 rounded-xl border ${
            showHowTo
              ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-sm'
              : 'text-amber-300/90 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border-amber-500/30'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>วิธีการเล่น 3 Step</span>
          {showHowTo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Accordion 1: Sleep Cycle Concept */}
      {showInfo && (
        <div
          id="sleep-guide-card"
          className="mt-4 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-left text-xs sm:text-sm text-slate-300 shadow-xl animate-fade-in"
        >
          <h2 className="font-semibold text-indigo-200 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            หลักการคำนวณรอบการนอน (Sleep Cycle)
          </h2>
          <ul className="space-y-2 list-disc list-inside text-slate-300 leading-relaxed pl-1">
            <li>
              วงจรการนอนหลับตามธรรมชาติของมนุษย์ (Sleep Cycle) เฉลี่ยอยู่ที่ <strong className="text-indigo-200">90 นาทีต่อ 1 รอบ</strong>
            </li>
            <li>
              คนเรามักใช้เวลาประมาณ <strong className="text-amber-200">15 นาที</strong> ในการเคลิ้มผล็อยหลับ (Fall asleep latency)
            </li>
            <li>
              การตื่นนอนในจุดที่ครบรอบการนอน (เช่น 5 หรือ 6 รอบ หรือประมาณ 7.5 - 9 ชม.) จะช่วยให้สมองไม่ถูกปลุกในช่วงหลับลึก ทำให้รู้สึก <strong className="text-emerald-300">สดชื่น ไม่งัวเงีย</strong>
            </li>
          </ul>
        </div>
      )}

      {/* Accordion 2: 3-Step App Usage Guide */}
      {showHowTo && (
        <div
          id="how-to-play-card"
          className="mt-4 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-left text-xs sm:text-sm text-slate-300 shadow-xl animate-fade-in"
        >
          <h2 className="font-semibold text-amber-200 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            วิธีการใช้งานแอป "นอนบ้าง" (3 ขั้นตอนง่ายๆ)
          </h2>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                  <span>คำนวณเวลานอนที่เหมาะสม</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  เลือกโหมด <strong>"ตื่นกี่โมงดี"</strong> (กรอกเวลานอน หรือกดปุ่ม <em>นอนตอนนี้</em>) หรือโหมด <strong>"เข้านอนกี่โมงดี"</strong> เพื่อดูเวลาที่ครบรอบการนอน 90 นาที จากนั้น<strong>คลิกที่การ์ดเวลา</strong>เพื่อส่งต่อไปยังฟอร์มบันทึก
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5 text-purple-400" />
                  <span>บันทึกคุณภาพการนอน (Sleep Journal)</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  หลังตื่นนอน ให้เลือกคะแนนคุณภาพ <strong>1-5 ดาว</strong>, เลือก<strong>อีโมจิบอกอารมณ์ตอนตื่น</strong> (5 ระดับ) และพิมพ์โน้ตสั้นๆ (ไม่เกิน 100 ตัวอักษร) แล้วกด <strong>"บันทึกข้อมูลการนอน"</strong>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ติดตามสถิติและประวัติย้อนหลัง</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  ดูแถบสรุป<strong>ชั่วโมงนอนเฉลี่ยต่อคืน</strong>และ<strong>คุณภาพการนอนเฉลี่ย</strong> ข้อมูลถูกเก็บไว้ในเครื่องของคุณอัตโนมัติ ไม่หายแม้รีเฟรชหน้า
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
