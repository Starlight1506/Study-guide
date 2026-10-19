// ============================================================================
// DARS JADVALI VA KALENDAR TIZIMI (SCHEDULE & LESSON REMINDER SERVICE)
// ============================================================================

export interface StudentScheduleGroup {
  id: string;
  name: string;
  shortName: string;
  timeSlot: string; // e.g., "10:00 - 11:30"
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  days: number[]; // 0=Yakshanba, 1=Dushanba, 2=Seshanba, 4=Payshanba
  dayNames: string[]; // ["Dushanba", "Payshanba", "Yakshanba"]
  studentNames: string[];
  studentLogins: string[];
  room: string;
  subject: string;
  themeColor: {
    badge: string;
    bg: string;
    border: string;
    text: string;
    accent: string;
    gradient: string;
  };
}

export interface NextLessonInfo {
  group: StudentScheduleGroup;
  lessonDate: Date;
  isToday: boolean;
  isOngoing: boolean;
  startsSoon: boolean; // within 30 minutes
  formattedDate: string;
  formattedDayName: string;
  formattedTime: string;
  diffMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ReminderSettings {
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  alertBeforeMinutes: number; // 15, 30, 60
  lastNotifiedLessonKey?: string;
}

// ----------------------------------------------------------------------------
// GURUHLAR VA DARS JADVALI MA'LUMOTLARI
// ----------------------------------------------------------------------------
export const SCHEDULE_GROUPS: StudentScheduleGroup[] = [
  {
    id: 'group_1',
    name: "1-Guruh (Ertalabki)",
    shortName: "1-Guruh (10:00)",
    timeSlot: "10:00 - 11:30",
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    days: [1, 4, 0], // Dushanba (1), Payshanba (4), Yakshanba (0)
    dayNames: ["Dushanba", "Payshanba", "Yakshanba"],
    studentNames: ["Shoxruz", "Abdurahmon", "Islomxoja", "Muso"],
    studentLogins: ["shoxruz", "abdurahmon", "islomxoja", "muso"],
    room: "IT Laboratoriyasi (1-Xona)",
    subject: "IT Savodxonlik & Algoritmlar",
    themeColor: {
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800/60",
      text: "text-emerald-700 dark:text-emerald-300",
      accent: "from-emerald-500 to-teal-600",
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-700",
    },
  },
  {
    id: 'group_2',
    name: "2-Guruh (Kunduzgi)",
    shortName: "2-Guruh (14:30)",
    timeSlot: "14:30 - 16:00",
    startHour: 14,
    startMinute: 30,
    endHour: 16,
    endMinute: 0,
    days: [1, 2, 0], // Dushanba (1), Seshanba (2), Yakshanba (0)
    dayNames: ["Dushanba", "Seshanba", "Yakshanba"],
    studentNames: ["Sunnatilla", "Baxodir", "Dovud", "Fozilaxmad"],
    studentLogins: ["sunnatilla", "baxodir", "dovud", "fozilaxmad"],
    room: "Grafik Dizayn & Multimedia Lab (2-Xona)",
    subject: "Grafik Dizayn & Vizual Ijodkorlik",
    themeColor: {
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800/60",
      text: "text-blue-700 dark:text-blue-300",
      accent: "from-blue-500 to-indigo-600",
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-800",
    },
  },
  {
    id: 'group_3',
    name: "3-Guruh (Kechki)",
    shortName: "3-Guruh (16:30)",
    timeSlot: "16:30 - 18:00",
    startHour: 16,
    startMinute: 30,
    endHour: 18,
    endMinute: 0,
    days: [1, 2, 0], // Dushanba (1), Seshanba (2), Yakshanba (0)
    dayNames: ["Dushanba", "Seshanba", "Yakshanba"],
    studentNames: ["Dilmurod", "Nafosat", "Abdulaziz"],
    studentLogins: ["dilmurod", "nafosat", "abdulaziz"],
    room: "IT Amaliyot Zali (3-Xona)",
    subject: "Frontend & IT Savodxonlik Amaliyoti",
    themeColor: {
      badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-700",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800/60",
      text: "text-purple-700 dark:text-purple-300",
      accent: "from-purple-500 to-violet-600",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-700",
    },
  },
];

// O'zbek tilidagi hafta kunlari
export const UZBEK_DAYS = [
  { index: 0, key: 'sun', short: 'Yak', full: 'Yakshanba' },
  { index: 1, key: 'mon', short: 'Dush', full: 'Dushanba' },
  { index: 2, key: 'tue', short: 'Sesh', full: 'Seshanba' },
  { index: 3, key: 'wed', short: 'Chor', full: 'Chorshanba' },
  { index: 4, key: 'thu', short: 'Pay', full: 'Payshanba' },
  { index: 5, key: 'fri', short: 'Jum', full: 'Juma' },
  { index: 6, key: 'sat', short: 'Shan', full: 'Shanba' },
];

// Oylarning o'zbekcha nomlari
export const UZBEK_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

// ----------------------------------------------------------------------------
// HELPER FUNKSIYALAR
// ----------------------------------------------------------------------------

/**
 * Talaba ismi yoki loginiga qarab uning guruhini aniqlash
 */
export function getGroupByStudent(studentNameOrLogin: string | undefined | null): StudentScheduleGroup | null {
  if (!studentNameOrLogin) return null;
  const normalized = studentNameOrLogin.toLowerCase().trim().replace(/['`’‘]/g, '');

  for (const group of SCHEDULE_GROUPS) {
    const hasName = group.studentNames.some(name => 
      name.toLowerCase().replace(/['`’‘]/g, '') === normalized ||
      normalized.includes(name.toLowerCase().replace(/['`’‘]/g, ''))
    );
    const hasLogin = group.studentLogins.some(login => 
      login.toLowerCase() === normalized ||
      normalized.includes(login.toLowerCase())
    );
    if (hasName || hasLogin) {
      return group;
    }
  }

  return null;
}

/**
 * Guruh uchun eng yaqin keyingi dars vaqtini hisoblash
 */
export function getNextLessonForGroup(group: StudentScheduleGroup, referenceDate: Date = new Date()): NextLessonInfo {
  const now = referenceDate;
  
  // Bugungi dars holatini tekshirish
  const currentDayIndex = now.getDay();
  const todayIsLessonDay = group.days.includes(currentDayIndex);

  if (todayIsLessonDay) {
    const todayStart = new Date(now);
    todayStart.setHours(group.startHour, group.startMinute, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(group.endHour, group.endMinute, 0, 0);

    // Agar ayni vaqtda dars bo'layotgan bo'lsa
    if (now >= todayStart && now <= todayEnd) {
      const remainingMs = todayEnd.getTime() - now.getTime();
      return formatLessonInfo(group, todayStart, remainingMs, true, true);
    }

    // Agar bugun dars hali boshlanmagan bo'lsa
    if (now < todayStart) {
      const diffMs = todayStart.getTime() - now.getTime();
      return formatLessonInfo(group, todayStart, diffMs, true, false);
    }
  }

  // Keyingi eng yaqin kunni topish (keyingi 7 kun ichida)
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    const dayOfWeek = nextDate.getDay();

    if (group.days.includes(dayOfWeek)) {
      nextDate.setHours(group.startHour, group.startMinute, 0, 0);
      const diffMs = nextDate.getTime() - now.getTime();
      return formatLessonInfo(group, nextDate, diffMs, false, false);
    }
  }

  // Fallback
  const fallbackDate = new Date(now);
  fallbackDate.setDate(now.getDate() + 1);
  fallbackDate.setHours(group.startHour, group.startMinute, 0, 0);
  return formatLessonInfo(group, fallbackDate, 86400000, false, false);
}

function formatLessonInfo(
  group: StudentScheduleGroup,
  lessonDate: Date,
  diffMs: number,
  isToday: boolean,
  isOngoing: boolean
): NextLessonInfo {
  const safeMs = Math.max(0, diffMs);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const dayObj = UZBEK_DAYS[lessonDate.getDay()];
  const monthName = UZBEK_MONTHS[lessonDate.getMonth()];
  const formattedDate = `${lessonDate.getDate()}-${monthName}, ${lessonDate.getFullYear()}`;
  const formattedDayName = dayObj ? dayObj.full : '';
  const formattedTime = group.timeSlot;

  const startsSoon = !isOngoing && diffMs <= 30 * 60 * 1000 && diffMs > 0;

  return {
    group,
    lessonDate,
    isToday,
    isOngoing,
    startsSoon,
    formattedDate,
    formattedDayName,
    formattedTime,
    diffMs,
    days,
    hours,
    minutes,
    seconds,
  };
}

/**
 * O'quvchi uchun eng yaqin navbatdagi dars
 */
export function getNextLessonForStudent(studentNameOrLogin: string | undefined | null, referenceDate: Date = new Date()): NextLessonInfo | null {
  const group = getGroupByStudent(studentNameOrLogin);
  if (!group) return null;
  return getNextLessonForGroup(group, referenceDate);
}

/**
 * O'qituvchi uchun: Barcha guruhlar ichida ayni damda davom etayotgan yoki eng yaqin bo'ladigan dars
 */
export function getTeacherScheduleOverview(referenceDate: Date = new Date()): {
  ongoingLessons: NextLessonInfo[];
  nextLessons: NextLessonInfo[];
  todaysLessons: { group: StudentScheduleGroup; timeSlot: string; status: 'completed' | 'ongoing' | 'upcoming' }[];
} {
  const now = referenceDate;
  const currentDayIndex = now.getDay();

  const allNext = SCHEDULE_GROUPS.map(g => getNextLessonForGroup(g, now));
  const ongoingLessons = allNext.filter(n => n.isOngoing);
  const nextLessons = allNext
    .filter(n => !n.isOngoing)
    .sort((a, b) => a.diffMs - b.diffMs);

  // Bugungi darslar
  const todaysLessons: { group: StudentScheduleGroup; timeSlot: string; status: 'completed' | 'ongoing' | 'upcoming' }[] = [];
  SCHEDULE_GROUPS.forEach(group => {
    if (group.days.includes(currentDayIndex)) {
      const todayStart = new Date(now);
      todayStart.setHours(group.startHour, group.startMinute, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(group.endHour, group.endMinute, 0, 0);

      let status: 'completed' | 'ongoing' | 'upcoming' = 'upcoming';
      if (now > todayEnd) {
        status = 'completed';
      } else if (now >= todayStart && now <= todayEnd) {
        status = 'ongoing';
      }
      todaysLessons.push({ group, timeSlot: group.timeSlot, status });
    }
  });

  return { ongoingLessons, nextLessons, todaysLessons };
}

// ----------------------------------------------------------------------------
// AUDIYA & BILDIRISHNOMA (AUDIO CHIME & BROWSER NOTIFICATIONS)
// ----------------------------------------------------------------------------

/**
 * Ovozli qo'ng'iroq / eslatma tovushini ijro etish (Web Audio API orqali, hechnarsa yuklamasdan)
 */
export function playLessonChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Friendly 2-tone chime: E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.5Hz)
    const tones = [
      { freq: 659.25, time: 0, dur: 0.18 },
      { freq: 783.99, time: 0.15, dur: 0.22 },
      { freq: 1046.5, time: 0.32, dur: 0.45 },
    ];

    tones.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (e) {
    console.warn("Audio chime ijro etilmadi:", e);
  }
}

/**
 * Brauzer bildirishnomasi jo'natish
 */
export async function sendBrowserNotification(title: string, body: string): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
      return true;
    }
  }

  return false;
}

// ----------------------------------------------------------------------------
// ESLATMA SOZLAMALARI (REMINDER SETTINGS STORAGE)
// ----------------------------------------------------------------------------

const REMINDER_SETTINGS_KEY = 'it_portal_lesson_reminders';

export function getStoredReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading reminder settings:', e);
  }
  return {
    soundEnabled: true,
    browserNotificationsEnabled: true,
    alertBeforeMinutes: 15,
  };
}

export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('schedule_reminder_settings_changed'));
  } catch (e) {
    console.error('Error saving reminder settings:', e);
  }
}
