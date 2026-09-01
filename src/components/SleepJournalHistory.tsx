import React, { useState } from 'react';
import {
  History,
  Trash2,
  Moon,
  Sun,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Smile,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SleepRecord } from '../types';
import { MOOD_OPTIONS } from '../constants/moods';
import { formatThaiDate } from '../utils/sleepMath';
import { ConfirmModal } from './ConfirmModal';
import { SleepTrendsChart } from './SleepTrendsChart';

interface SleepJournalHistoryProps {
  records: SleepRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

const INITIAL_DISPLAY_COUNT = 4;

export const SleepJournalHistory: React.FC<SleepJournalHistoryProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getMoodData = (moodValue: number) => {
    return (
      MOOD_OPTIONS.find((m) => m.value === moodValue) || {
        emoji: '😴',
        label: 'ไม่ระบุ',
        description: '',
      }
    );
  };

  // Quick stats calculation
  const totalEntries = records.length;
  const avgMinutes =
    totalEntries > 0
      ? Math.round(
          records.reduce((acc, curr) => acc + curr.durationMinutes, 0) /
            totalEntries
        )
      : 0;
  const avgHoursFormatted = `${Math.floor(avgMinutes / 60)} ชม. ${
    avgMinutes % 60 > 0 ? (avgMinutes % 60) + ' นาที' : ''
  }`;
  const avgRating =
    totalEntries > 0
      ? (
          records.reduce((acc, curr) => acc + curr.rating, 0) / totalEntries
        ).toFixed(1)
      : '0.0';

  // Visible records slice
  const displayedRecords = isExpanded
    ? records
    : records.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = records.length > INITIAL_DISPLAY_COUNT;

  return (
    <div
      id="sleep-journal-history-card"
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            id="journal-history-heading"
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5"
          >
            <History className="w-6 h-6 text-indigo-400" />
            ประวัติการนอนที่บันทึก
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            เรียงลำดับจากล่าสุดไปเก่าสุด ({records.length} รายการ)
          </p>
        </div>

        {records.length > 0 && (
          <button
            id="btn-clear-all-history"
            type="button"
            onClick={() => setShowClearAllModal(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างประวัติทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Summary Mini Bar if there are records */}
      {records.length > 0 && (
        <div
          id="history-stats-bar"
          className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800"
        >
          <div className="text-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 block">บันทึกทั้งหมด</span>
            <span className="text-base sm:text-lg font-bold text-white">
              {totalEntries} วัน
            </span>
          </div>
          <div className="text-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 block">เฉลี่ยต่อคืน</span>
            <span className="text-base sm:text-lg font-bold text-indigo-300">
              {avgHoursFormatted}
            </span>
          </div>
          <div className="text-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 block">คุณภาพเฉลี่ย</span>
            <span className="text-base sm:text-lg font-bold text-amber-300 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
              {avgRating} / 5
            </span>
          </div>
        </div>
      )}

      {/* Sleep Trends Chart (Visualizing duration + ratings) */}
      {records.length > 0 && <SleepTrendsChart records={records} />}

      {/* List of Entries */}
      {records.length === 0 ? (
        <div
          id="empty-history-state"
          className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            ยังไม่มีประวัติการนอน
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            กรอกข้อมูลเวลาเข้านอนและตื่นนอนในฟอร์มด้านบน แล้วกด "บันทึกข้อมูลการนอน" เพื่อเริ่มเก็บสถิติ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              แสดง {displayedRecords.length} จากทั้งหมด {records.length} รายการ
            </span>
            {hasMore && !isExpanded && (
              <span className="text-indigo-300 text-[11px]">
                มีอีก {records.length - INITIAL_DISPLAY_COUNT} รายการด้านล่าง
              </span>
            )}
          </div>

          <div id="sleep-history-list" className="space-y-3">
            {displayedRecords.map((record) => {
              const moodData = getMoodData(record.mood);

              return (
                <div
                  key={record.id}
                  id={`history-entry-${record.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 transition-all shadow-md flex flex-col gap-3"
                >
                  {/* Header: Date + Delete button */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold text-white">
                        {formatThaiDate(record.date)}
                      </span>
                    </div>

                    <button
                      id={`btn-delete-entry-${record.id}`}
                      type="button"
                      onClick={() => setDeleteTargetId(record.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="ลบรายการนี้"
                      aria-label={`Delete record for ${record.date}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content: Times, Duration, Rating, Mood */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Bed & Wake Times */}
                    <div className="flex flex-col justify-center space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>เข้านอน: <strong>{record.bedTime} น.</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>ตื่นนอน: <strong>{record.wakeTime} น.</strong></span>
                      </div>
                    </div>

                    {/* Sleep Duration */}
                    <div className="flex flex-col justify-center">
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>เวลานอนทั้งหมด:</span>
                      </div>
                      <div className="inline-flex items-center self-start px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 text-xs font-bold">
                        {record.durationFormatted}
                      </div>
                    </div>

                    {/* Rating & Mood */}
                    <div className="flex flex-col justify-center space-y-1.5">
                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= record.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">
                          ({record.rating}/5)
                        </span>
                      </div>

                      {/* Mood Badge */}
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-200">
                        <span className="text-lg leading-none">{moodData.emoji}</span>
                        <span className="font-medium text-slate-300">
                          {moodData.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Note section (if provided) */}
                  {record.note && (
                    <div className="pt-2 border-t border-slate-800/40 text-xs text-slate-300 bg-slate-900/40 px-3 py-2 rounded-xl">
                      <span className="text-slate-400 font-medium">โน้ต: </span>
                      <span>"{record.note}"</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {hasMore && (
            <div className="pt-2 flex justify-center">
              <button
                id="btn-toggle-show-more-history"
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-950/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-indigo-300 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 active:scale-95"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 text-indigo-400" />
                    <span>ย่อประวัติลง (แสดงเพียง 4 รายการล่าสุด)</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 text-indigo-400" />
                    <span>
                      ดูเพิ่มเติม (+{records.length - INITIAL_DISPLAY_COUNT} รายการ)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Single Item Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="ต้องการลบประวัติการนอนนี้หรือไม่?"
        message="เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลของวันนี้ได้"
        confirmText="ลบรายการนี้"
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteRecord(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onClose={() => setDeleteTargetId(null)}
      />

      {/* Clear All Modal */}
      <ConfirmModal
        isOpen={showClearAllModal}
        title="ต้องการล้างประวัติการนอนทั้งหมดหรือไม่?"
        message="ประวัติการนอนทั้งหมดของคุณจะถูกลบออกจากเครื่องอย่างถาวร"
        confirmText="ล้างประวัติทั้งหมด"
        onConfirm={() => {
          onClearAll();
          setShowClearAllModal(false);
        }}
        onClose={() => setShowClearAllModal(false)}
      />
    </div>
  );
};
