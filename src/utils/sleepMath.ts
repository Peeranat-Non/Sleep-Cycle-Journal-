import { CycleResult } from '../types';

/**
 * Calculates wake-up times based on bedtime.
 * Formula: bedtime + (cycles * 90 mins) + 15 mins fall-asleep latency.
 */
export function calculateWakeTimes(bedTimeStr: string): CycleResult[] {
  const [hours, minutes] = bedTimeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return [];

  const baseMinutes = hours * 60 + minutes;
  const fallAsleepBuffer = 15; // 15 mins to fall asleep
  const cycleDuration = 90; // 90 mins per cycle

  // 3, 4, 5, 6 cycles
  const cycleCounts = [3, 4, 5, 6];

  return cycleCounts.map((cycles) => {
    const sleepDuration = cycles * cycleDuration + fallAsleepBuffer;
    let targetMinutes = (baseMinutes + sleepDuration) % (24 * 60);
    if (targetMinutes < 0) targetMinutes += 24 * 60;

    const targetH = Math.floor(targetMinutes / 60);
    const targetM = targetMinutes % 60;
    const formatted = `${String(targetH).padStart(2, '0')}:${String(targetM).padStart(2, '0')}`;

    const totalHours = Math.floor(sleepDuration / 60);
    const remainMins = sleepDuration % 60;

    let tag: string | undefined;
    let isRecommended = false;

    if (cycles === 5) {
      tag = 'แนะนำที่สุด (ยอดนิยม)';
      isRecommended = true;
    } else if (cycles === 6) {
      tag = 'พักผ่อนเต็มอิ่ม';
    } else if (cycles === 4) {
      tag = 'พอใช้ได้';
    } else if (cycles === 3) {
      tag = 'เวลานอนขั้นต่ำ';
    }

    return {
      cycles,
      timeFormatted: formatted,
      totalMinutes: sleepDuration,
      hours: totalHours,
      minutes: remainMins,
      isRecommended,
      tag,
      subtext: `รวม ${totalHours} ชม. ${remainMins > 0 ? remainMins + ' นาที' : ''} (รวม 15 นาทีเคลิ้มหลับ)`,
    };
  });
}

/**
 * Calculates optimal bedtimes based on desired wake-up time.
 * Formula: wakeTime - (cycles * 90 mins) - 15 mins fall-asleep latency.
 */
export function calculateBedTimes(wakeTimeStr: string): CycleResult[] {
  const [hours, minutes] = wakeTimeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return [];

  const baseMinutes = hours * 60 + minutes;
  const fallAsleepBuffer = 15;
  const cycleDuration = 90;

  // 3, 4, 5, 6 cycles (sorted from least cycles to most cycles)
  const cycleCounts = [3, 4, 5, 6];

  return cycleCounts.map((cycles) => {
    const sleepDuration = cycles * cycleDuration + fallAsleepBuffer;
    let targetMinutes = (baseMinutes - sleepDuration) % (24 * 60);
    if (targetMinutes < 0) targetMinutes += 24 * 60;

    const targetH = Math.floor(targetMinutes / 60);
    const targetM = targetMinutes % 60;
    const formatted = `${String(targetH).padStart(2, '0')}:${String(targetM).padStart(2, '0')}`;

    const totalHours = Math.floor(sleepDuration / 60);
    const remainMins = sleepDuration % 60;

    let tag: string | undefined;
    let isRecommended = false;

    if (cycles === 5) {
      tag = 'แนะนำที่สุด (ยอดนิยม)';
      isRecommended = true;
    } else if (cycles === 6) {
      tag = 'พักผ่อนเต็มอิ่ม';
    } else if (cycles === 4) {
      tag = 'พอใช้ได้';
    } else if (cycles === 3) {
      tag = 'เวลานอนขั้นต่ำ';
    }

    return {
      cycles,
      timeFormatted: formatted,
      totalMinutes: sleepDuration,
      hours: totalHours,
      minutes: remainMins,
      isRecommended,
      tag,
      subtext: `นอน ${totalHours} ชม. ${remainMins > 0 ? remainMins + ' นาที' : ''} (ให้เวลาเคลิ้มหลับ 15 นาที)`,
    };
  });
}

/**
 * Calculates sleep duration between bedTime and wakeTime.
 */
export function calculateDuration(bedTimeStr: string, wakeTimeStr: string): {
  totalMinutes: number;
  formatted: string;
  hours: number;
  minutes: number;
  cyclesEstimate: string;
  isSameTime: boolean;
} {
  const [bedH, bedM] = bedTimeStr.split(':').map(Number);
  const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);

  if (isNaN(bedH) || isNaN(bedM) || isNaN(wakeH) || isNaN(wakeM)) {
    return {
      totalMinutes: 0,
      formatted: '0 ชม. 0 นาที',
      hours: 0,
      minutes: 0,
      cyclesEstimate: '0 รอบ',
      isSameTime: false,
    };
  }

  const bedTotal = bedH * 60 + bedM;
  const wakeTotal = wakeH * 60 + wakeM;

  // If bedtime and wake time are identical, duration is 0 (NOT 24 hours)
  if (bedTotal === wakeTotal) {
    return {
      totalMinutes: 0,
      formatted: '0 ชม. 0 นาที',
      hours: 0,
      minutes: 0,
      cyclesEstimate: '0 รอบ',
      isSameTime: true,
    };
  }

  let diff = wakeTotal - bedTotal;
  if (diff < 0) {
    diff += 24 * 60; // crossed midnight
  }

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  const formatted = `${hours} ชม. ${minutes > 0 ? `${minutes} นาที` : '00 นาที'}`;
  const cycles = (diff / 90).toFixed(1);

  return {
    totalMinutes: diff,
    formatted,
    hours,
    minutes,
    cyclesEstimate: `~${cycles} รอบการนอน`,
    isSameTime: false,
  };
}

/**
 * Formats date string (YYYY-MM-DD) into Thai readable date
 */
export function formatThaiDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const dayOfWeek = thaiDays[date.getDay()];
    const thaiYear = year + 543;
    return `วัน${dayOfWeek}ที่ ${day} ${thaiMonths[month - 1]} ${thaiYear}`;
  } catch {
    return dateStr;
  }
}

/**
 * Gets current local time formatted as HH:mm
 */
export function getCurrentTimeFormatted(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Gets today's date formatted as YYYY-MM-DD
 */
export function getTodayDateFormatted(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
