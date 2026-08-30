import { MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 5,
    emoji: '🤩',
    label: 'สดชื่นมาก',
    description: 'กระปรี้กระเปร่า ตื่นตัวเต็มที่',
  },
  {
    value: 4,
    emoji: '😊',
    label: 'สดชื่นดี',
    description: 'รู้สึกสบาย อารมณ์ดี',
  },
  {
    value: 3,
    emoji: '😐',
    label: 'ปานกลาง',
    description: 'ไม่ง่วงมาก แต่ยังไม่สดชื่นเต็มที่',
  },
  {
    value: 2,
    emoji: '🥱',
    label: 'งัวเงีย',
    description: 'ยังง่วงเพลีย อยากนอนต่อ',
  },
  {
    value: 1,
    emoji: '😫',
    label: 'เพลียมาก',
    description: 'ล้า ปวดหัว หรือนอนไม่พอ',
  },
];
