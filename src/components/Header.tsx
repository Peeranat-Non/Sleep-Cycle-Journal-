import React, { useState } from 'react';
import { Moon, Sparkles, Stars, Info, ChevronDown, ChevronUp, Clock, HeartHandshake } from 'lucide-react';

export const Header: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header id="app-header" className="relative text-center pt-8 pb-6 px-4">
      {/* Subtle night-sky glow background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-32 bg-indigo-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Main App Title */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-3 shadow-inner">
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

      {/* Info Guide Toggle */}
      <div className="mt-4 flex justify-center">
        <button
          id="btn-toggle-sleep-guide"
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-300/90 hover:text-indigo-200 transition-colors bg-indigo-900/30 hover:bg-indigo-900/50 px-3 py-1.5 rounded-xl border border-indigo-500/20"
        >
          <Info className="w-3.5 h-3.5" />
          <span>ทำความเข้าใจรอบการนอน 90 นาที</span>
          {showInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showInfo && (
        <div
          id="sleep-guide-card"
          className="mt-4 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-left text-xs sm:text-sm text-slate-300 shadow-xl transition-all"
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
    </header>
  );
};
