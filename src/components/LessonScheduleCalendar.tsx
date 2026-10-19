import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BookOpen,
  Filter,
  Search,
  ExternalLink,
  Info,
  Flame,
  Award
} from 'lucide-react';
import {
  SCHEDULE_GROUPS,
  UZBEK_DAYS,
  UZBEK_MONTHS,
  StudentScheduleGroup,
  NextLessonInfo,
  getGroupByStudent,
  getNextLessonForGroup,
  getNextLessonForStudent,
  getTeacherScheduleOverview,
  playLessonChime,
  sendBrowserNotification,
  getStoredReminderSettings,
  saveReminderSettings,
  ReminderSettings,
} from '../services/scheduleManager';
import { AppUser } from './LoginModal';

interface LessonScheduleCalendarProps {
  appUser?: AppUser | null;
  selectedStudentName?: string;
  onSelectStudent?: (studentName: string) => void;
  onSelectTrackLesson?: (track: 'literacy' | 'design', lessonId: number) => void;
  isCompact?: boolean;
}

export const LessonScheduleCalendar: React.FC<LessonScheduleCalendarProps> = ({
  appUser,
  selectedStudentName,
  onSelectStudent,
  onSelectTrackLesson,
  isCompact = false,
}) => {
  // Current real-time clock state (updates every second for precise countdown)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'agenda'>('week');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [activeDateOffset, setActiveDateOffset] = useState<number>(0); // week navigation offset

  // Reminder settings state
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(getStoredReminderSettings);
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<string | null>(null);
  const [lastChimedId, setLastChimedId] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine effective student identity
  const effectiveStudentIdentifier = useMemo(() => {
    if (selectedStudentName) return selectedStudentName;
    if (appUser && appUser.role === 'student') {
      return appUser.name || appUser.email;
    }
    return null;
  }, [selectedStudentName, appUser]);

  // Student's group if student is viewing
  const studentGroup = useMemo(() => {
    return getGroupByStudent(effectiveStudentIdentifier);
  }, [effectiveStudentIdentifier]);

  // Next lesson for student (live calculated)
  const studentNextLesson = useMemo(() => {
    if (!studentGroup) return null;
    return getNextLessonForGroup(studentGroup, currentTime);
  }, [studentGroup, currentTime]);

  // Teacher overview (live calculated)
  const teacherOverview = useMemo(() => {
    return getTeacherScheduleOverview(currentTime);
  }, [currentTime]);

  // Check if upcoming lesson requires notification alert
  useEffect(() => {
    if (!reminderSettings.soundEnabled && !reminderSettings.browserNotificationsEnabled) {
      return;
    }

    // Check for teacher or student upcoming lesson
    const relevantNext = appUser?.role === 'teacher'
      ? teacherOverview.nextLessons[0]
      : studentNextLesson;

    if (!relevantNext) return;

    const diffMinutes = Math.floor(relevantNext.diffMs / (60 * 1000));
    const lessonKey = `${relevantNext.group.id}_${relevantNext.lessonDate.toDateString()}_${diffMinutes}`;

    if (diffMinutes <= reminderSettings.alertBeforeMinutes && diffMinutes >= 0 && lastChimedId !== lessonKey) {
      setLastChimedId(lessonKey);

      // Play chime
      if (reminderSettings.soundEnabled) {
        playLessonChime();
      }

      // Send browser notification
      if (reminderSettings.browserNotificationsEnabled) {
        const title = `🔔 IT Savodxonlik: Dars eslatmasi!`;
        const body = `${relevantNext.group.name} darsi ${diffMinutes === 0 ? "hozir boshlandi!" : `${diffMinutes} daqiqadan so'ng boshlanadi (${relevantNext.group.timeSlot})`}. Qatnashuvchilar: ${relevantNext.group.studentNames.join(', ')}`;
        sendBrowserNotification(title, body);
      }

      setNotificationStatusMsg(
        `Eslatma: ${relevantNext.group.name} darsi boshlanishiga ${diffMinutes} daqiqa qoldi!`
      );
      setTimeout(() => setNotificationStatusMsg(null), 8000);
    }
  }, [currentTime, reminderSettings, appUser, teacherOverview, studentNextLesson, lastChimedId]);

  // Toggle sound
  const handleToggleSound = () => {
    const updated = { ...reminderSettings, soundEnabled: !reminderSettings.soundEnabled };
    setReminderSettings(updated);
    saveReminderSettings(updated);
    if (updated.soundEnabled) {
      playLessonChime();
    }
  };

  // Toggle browser notifications
  const handleToggleBrowserNotifications = async () => {
    if (!reminderSettings.browserNotificationsEnabled) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          const updated = { ...reminderSettings, browserNotificationsEnabled: true };
          setReminderSettings(updated);
          saveReminderSettings(updated);
          sendBrowserNotification("Dars Taqvimi", "Darslar boshlanishidan oldin bildirishnomalar yoqildi!");
          setNotificationStatusMsg("Brauzer bildirishnomalari muvaffaqiyatli yoqildi!");
          setTimeout(() => setNotificationStatusMsg(null), 4000);
        } else {
          alert("Brauzeringizda bildirishnomalarga ruxsat berilmagan. Brauzer sozlamalaridan ruxsat bering.");
        }
      }
    } else {
      const updated = { ...reminderSettings, browserNotificationsEnabled: false };
      setReminderSettings(updated);
      saveReminderSettings(updated);
      setNotificationStatusMsg("Brauzer bildirishnomalari o'chirildi.");
      setTimeout(() => setNotificationStatusMsg(null), 3000);
    }
  };

  // Test sound reminder manually
  const handleTestReminder = () => {
    playLessonChime();
    if (reminderSettings.browserNotificationsEnabled) {
      sendBrowserNotification(
        "🔔 Dars Qo'ng'irog'i (Sinov)",
        "IT Savodxonlik: Ovozli eslatma va bildirishnoma tizimi soz holatda ishlamoqda!"
      );
    }
    setNotificationStatusMsg("🔔 Dars qo'ng'irog'i sinovdan o'tkazildi!");
    setTimeout(() => setNotificationStatusMsg(null), 4000);
  };

  // Filter groups
  const filteredGroups = useMemo(() => {
    return SCHEDULE_GROUPS.filter(group => {
      if (selectedGroupFilter !== 'all' && group.id !== selectedGroupFilter) {
        return false;
      }
      if (studentSearchQuery.trim()) {
        const query = studentSearchQuery.toLowerCase().trim();
        const matchesName = group.studentNames.some(name => name.toLowerCase().includes(query));
        const matchesGroup = group.name.toLowerCase().includes(query);
        const matchesTime = group.timeSlot.includes(query);
        return matchesName || matchesGroup || matchesTime;
      }
      return true;
    });
  }, [selectedGroupFilter, studentSearchQuery]);

  // Current Week Days calculation for Weekly View
  const weekDays = useMemo(() => {
    const base = new Date(currentTime);
    base.setDate(base.getDate() + activeDateOffset * 7);

    // Find Monday of this week (1 = Monday, 0 = Sunday)
    const currentDay = base.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dayIdx = d.getDay();
      const isToday = d.toDateString() === currentTime.toDateString();
      days.push({
        date: d,
        dayIndex: dayIdx,
        dayName: UZBEK_DAYS[dayIdx].full,
        dayShort: UZBEK_DAYS[dayIdx].short,
        formattedDate: `${d.getDate()}-${UZBEK_MONTHS[d.getMonth()].slice(0, 3)}`,
        isToday,
      });
    }
    return days;
  }, [currentTime, activeDateOffset]);

  // Format countdown string
  const formatCountdown = (info: NextLessonInfo) => {
    if (info.isOngoing) {
      return (
        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold animate-pulse">
          <Radio className="w-4 h-4" /> Dars ayni damda davom etmoqda!
        </span>
      );
    }

    const parts = [];
    if (info.days > 0) parts.push(`${info.days} kun`);
    if (info.hours > 0 || info.days > 0) parts.push(`${info.hours} soat`);
    parts.push(`${info.minutes} daqiqa`);
    parts.push(`${info.seconds} soniya`);

    return (
      <span className="font-mono font-bold tracking-tight">
        {parts.join(' ')} qoldi
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & TEACHER / STUDENT LIVE REMINDER BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-8 border border-[#EBE7DF] dark:border-[#243326] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#8BA88E]/10 dark:bg-[#8BA88E]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] text-xs font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                Interaktiv Dars Jadvali & Kalendar
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E2D20] text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8BA88E]" />
                Hozirgi vaqt: {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {appUser?.role === 'teacher' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
                  👨‍🏫 Ustoz: Assadxoja Nazorati
                </span>
              ) : studentGroup ? (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${studentGroup.themeColor.badge}`}>
                  👨‍🎓 Siz: {studentGroup.name}
                </span>
              ) : null}
            </div>

            <h2 className="text-2xl md:text-3xl font-serif italic font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">
              Darslar Kunlari va Soatlari Taqvimi
            </h2>
            <p className="text-xs md:text-sm text-[#828282] dark:text-[#9FB1A2] mt-1.5 max-w-2xl leading-relaxed">
              O'quvchilar va o'qituvchi uchun 3 ta ixtisoslashtirilgan guruh dars vaqtlari, navbatdagi darsning jonli hisoblagichi hamda dars boshlanishi oldidan audio eslatmalar.
            </p>
          </div>

          {/* Quick Audio & Notification Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleToggleSound}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border shadow-sm ${
                reminderSettings.soundEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-[#1E2D20] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title={reminderSettings.soundEnabled ? "Ovozli qo'ng'iroqni o'chirish" : "Ovozli qo'ng'iroqni yoqish"}
            >
              {reminderSettings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Ovozli Eslatma: Yoqilgan</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Ovozli Eslatma: O'chiq</span>
                </>
              )}
            </button>

            <button
              onClick={handleToggleBrowserNotifications}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border shadow-sm ${
                reminderSettings.browserNotificationsEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-[#1E2D20] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title="Brauzer bildirishnomalari sozlamasi"
            >
              <Bell className="w-4 h-4" />
              <span>Bildirishnomalar</span>
            </button>

            <button
              onClick={handleTestReminder}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-[#FAF8F5] dark:bg-[#1E2D20] hover:bg-[#F5F5F0] dark:hover:bg-[#283A2C] text-[#2C3E2D] dark:text-[#E6EAE7] border border-[#8BA88E]/40 transition flex items-center gap-1.5 shadow-sm"
              title="Eslatma tovushi va xabarnomani sinab ko'rish"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Qo'ng'iroqni Sinash</span>
            </button>
          </div>
        </div>

        {/* Temporary Notification Banner */}
        <AnimatePresence>
          {notificationStatusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Bell className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
              <span>{notificationStatusMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. DYNAMIC SPOTLIGHT: O'QUVCHI UCHUN NAVBATDAGI DARS YOKI USTOZ UCHUN JONLI ESLATMA */}
      {/* --------------------------------------------------------------------- */}
      {appUser?.role === 'teacher' ? (
        /* TEACHER SPOTLIGHT: NEXT UPCOMING LESSON & ONGOING CLASS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active or next upcoming lesson */}
          {teacherOverview.ongoingLessons.length > 0 ? (
            <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white p-6 rounded-3xl shadow-lg border border-rose-400 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Jonli Dars Davom Etmoqda!
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                    {teacherOverview.ongoingLessons[0].group.timeSlot}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif italic mb-1">
                  {teacherOverview.ongoingLessons[0].group.name}
                </h3>
                <p className="text-xs text-white/90 flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-rose-200" />
                  {teacherOverview.ongoingLessons[0].group.room}
                </p>
                <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 mb-3">
                  <p className="text-[11px] text-white/80 font-bold uppercase mb-1">Guruhdagi O'quvchilar:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {teacherOverview.ongoingLessons[0].group.studentNames.map(name => (
                      <span key={name} className="px-2.5 py-1 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-xs">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Dars yakunlanishi bilan o'quvchilarga ball qo'yishni unutmang.
              </p>
            </div>
          ) : teacherOverview.nextLessons.length > 0 ? (
            <div className="bg-gradient-to-br from-[#2C3E2D] to-[#1E2D20] text-white p-6 rounded-3xl shadow-lg border border-[#8BA88E]/30 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#8BA88E]/25 text-[#A3C4A6] text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Ustoz uchun: Navbatdagi Dars
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                    {teacherOverview.nextLessons[0].group.timeSlot}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif italic mb-1">
                  {teacherOverview.nextLessons[0].group.name}
                </h3>
                <p className="text-xs text-[#A3C4A6] mb-3">
                  Sana: <strong className="text-white">{teacherOverview.nextLessons[0].formattedDayName}</strong> ({teacherOverview.nextLessons[0].formattedDate})
                </p>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 mb-3">
                  <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider mb-1.5">Boshlanishiga qoldi:</p>
                  <p className="text-lg md:text-xl font-serif italic text-amber-300 font-bold">
                    {formatCountdown(teacherOverview.nextLessons[0])}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-white/80">
                <span>O'quvchilar: {teacherOverview.nextLessons[0].group.studentNames.join(', ')}</span>
                <span className="font-bold text-[#A3C4A6] shrink-0">{teacherOverview.nextLessons[0].group.room.split(' ')[0]}</span>
              </div>
            </div>
          ) : null}

          {/* Today's schedule summary */}
          <div className="bg-[#FAF8F5] dark:bg-[#1A261D] p-6 rounded-3xl border border-[#EBE7DF] dark:border-[#283A2C] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#2C3E2D] dark:text-[#E6EAE7] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Bugungi Darslar Rejasi ({UZBEK_DAYS[currentTime.getDay()].full})
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-[#203023] font-bold text-slate-700 dark:text-slate-300">
                  {teacherOverview.todaysLessons.length} ta guruh
                </span>
              </div>

              {teacherOverview.todaysLessons.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#828282] dark:text-[#9FB1A2] bg-white dark:bg-[#141F16] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#283A2C]">
                  Bugun reja bo'yicha guruhlar darsi yo'q. Dam olish kuni yoki mustaqil topshiriqlar vaqti.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {teacherOverview.todaysLessons.map(({ group, timeSlot, status }) => (
                    <div
                      key={group.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        status === 'ongoing'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700'
                          : status === 'completed'
                          ? 'bg-slate-50 dark:bg-[#141F16] border-slate-200 dark:border-slate-800 opacity-75'
                          : 'bg-white dark:bg-[#152017] border-[#EBE7DF] dark:border-[#283A2C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          status === 'ongoing' ? 'bg-rose-500 animate-ping' : status === 'completed' ? 'bg-slate-400' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <p className="text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">{group.name}</p>
                          <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                            {group.studentNames.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{timeSlot}</span>
                        <p className={`text-[10px] font-bold uppercase ${
                          status === 'ongoing' ? 'text-rose-600' : status === 'completed' ? 'text-slate-400' : 'text-emerald-600'
                        }`}>
                          {status === 'ongoing' ? 'Davom etmoqda' : status === 'completed' ? "O'tdi" : 'Kutilmoqda'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EBE7DF] dark:border-[#283A2C] flex items-center justify-between text-xs text-[#828282] dark:text-[#9FB1A2]">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8BA88E]" />
                Dilmurod, Nafosat, Abdulaziz darsi: 16:30 - 18:00
              </span>
              <button
                onClick={() => setSelectedGroupFilter('group_3')}
                className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] hover:underline"
              >
                3-guruhni ko'rish
              </button>
            </div>
          </div>
        </div>
      ) : studentNextLesson ? (
        /* STUDENT SPOTLIGHT: STUDENT'S NEXT LESSON CARD */
        <div className="bg-gradient-to-br from-[#2C3E2D] via-[#243525] to-[#1C2C1D] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#8BA88E]/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8BA88E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                <span className="px-3 py-1 rounded-full bg-[#8BA88E]/30 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Sizning Navbatdagi Darsingiz
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${studentNextLesson.group.themeColor.badge}`}>
                  {studentNextLesson.group.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                  {studentNextLesson.formattedTime}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif italic font-bold mb-1">
                {studentNextLesson.formattedDayName}, {studentNextLesson.formattedDate}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#A3C4A6] mt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  Vaqti: <strong>{studentNextLesson.group.timeSlot}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Xona: <strong>{studentNextLesson.group.room}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-300" />
                  Fan: <strong>{studentNextLesson.group.subject}</strong>
                </span>
              </div>

              {/* Peers list */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/70 font-medium">Guruhdoshlaringiz:</span>
                {studentNextLesson.group.studentNames.map(name => (
                  <span
                    key={name}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      name.toLowerCase() === (appUser?.name || '').toLowerCase()
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-white/50'
                        : 'bg-white/15 text-white'
                    }`}
                  >
                    {name} {name.toLowerCase() === (appUser?.name || '').toLowerCase() ? "(Siz)" : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Countdown Box */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 lg:min-w-[320px] text-center shadow-inner flex flex-col justify-center">
              <p className="text-xs text-[#A3C4A6] font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" />
                Dars boshlanishiga qoldi
              </p>
              
              <div className="text-xl md:text-2xl font-serif italic text-amber-300 font-bold mb-3">
                {formatCountdown(studentNextLesson)}
              </div>

              {studentNextLesson.isOngoing ? (
                <div className="p-2.5 rounded-xl bg-rose-500/30 border border-rose-400 text-xs text-white font-bold animate-pulse">
                  Dars hozir bo'lib o'tmoqda! Laboratoriyaga ulaning.
                </div>
              ) : studentNextLesson.startsSoon ? (
                <div className="p-2.5 rounded-xl bg-amber-500/30 border border-amber-400 text-xs text-amber-200 font-bold animate-bounce">
                  Dars 30 daqiqadan kam vaqt ichida boshlanadi! Tayyorlaning.
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/10 text-xs text-white/80">
                  Daftaringizni va dars materiallarini tayyorlab qo'ying.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* GUEST / UNSELECTED STUDENT INFO */
        <div className="bg-[#FAF8F5] dark:bg-[#1A261D] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#283A2C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#2C3E2D] dark:text-[#E6EAE7] text-base">
                O'z guruhingiz dars vaqtini bilmoqchimisiz?
              </h4>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                Quyidagi o'quvchilar ro'yxatidan o'zingizni tanlang yoki login orqali shaxsiy dars jadvalingizni ko'ring.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {SCHEDULE_GROUPS.flatMap(g => g.studentNames).slice(0, 6).map(name => (
              <button
                key={name}
                onClick={() => onSelectStudent ? onSelectStudent(name) : setStudentSearchQuery(name)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#283A2C] hover:border-[#8BA88E] text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] transition shadow-xs"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. 3 TA GURUH DARS JADVALI MA'LUMOT KARTALARI (OVERVIEW TILES) */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCHEDULE_GROUPS.map(group => {
          const nextLesson = getNextLessonForGroup(group, currentTime);
          const isUserInThisGroup = studentGroup?.id === group.id;

          return (
            <div
              key={group.id}
              className={`rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isUserInThisGroup
                  ? 'bg-gradient-to-b from-white to-[#F5F8F5] dark:from-[#152017] dark:to-[#1A261D] border-[#8BA88E] dark:border-[#4B6B4E] ring-2 ring-[#8BA88E]/30 shadow-md'
                  : 'bg-white dark:bg-[#152017] border-[#EBE7DF] dark:border-[#243326] shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${group.themeColor.badge}`}>
                    {group.name}
                  </span>
                  {isUserInThisGroup && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold shadow-xs">
                      ⭐️ Sizning guruhingiz
                    </span>
                  )}
                </div>

                {/* Time & Days */}
                <div className="mb-4">
                  <p className="text-2xl font-serif italic font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">
                    {group.timeSlot}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {group.dayNames.map(dayName => (
                      <span
                        key={dayName}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#1E2D20] text-slate-700 dark:text-slate-300 text-xs font-bold"
                      >
                        {dayName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location & Subject */}
                <div className="text-xs text-[#828282] dark:text-[#9FB1A2] flex flex-col gap-1 mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {group.room}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#8BA88E]" />
                    {group.subject}
                  </span>
                </div>

                {/* Students list in this group */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#283A2C] mb-4">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Guruh O'quvchilari ({group.studentNames.length} nafar):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.studentNames.map(studentName => (
                      <button
                        key={studentName}
                        onClick={() => {
                          setStudentSearchQuery(studentName);
                          if (onSelectStudent) onSelectStudent(studentName);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                          studentSearchQuery.toLowerCase() === studentName.toLowerCase()
                            ? 'bg-[#2C3E2D] text-white'
                            : 'bg-white dark:bg-[#141F16] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#8BA88E]'
                        }`}
                        title="O'quvchi darslarini filtrlash"
                      >
                        {studentName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Lesson Status Footer */}
              <div className="pt-3 border-t border-[#EBE7DF] dark:border-[#283A2C] flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Keyingi Dars:</p>
                  <p className="font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">
                    {nextLesson.formattedDayName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Qolgan vaqt:</p>
                  <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {nextLesson.isOngoing ? 'Hozir davom etmoqda' : `${nextLesson.days}k ${nextLesson.hours}s ${nextLesson.minutes}d`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. KALENDAR VIEW CONTROLS (TABS & FILTERS) */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#152017] p-4 rounded-3xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F0] dark:bg-[#1A261D] p-1 rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C]">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'week'
                ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Haftalik Jadval</span>
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'agenda'
                ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Reja / Agenda</span>
          </button>
        </div>

        {/* Middle: Week Navigation */}
        {viewMode === 'week' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDateOffset(prev => prev - 1)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E2D20] text-slate-600 dark:text-slate-300 transition"
              title="O'tgan hafta"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] min-w-[140px] text-center">
              {activeDateOffset === 0
                ? "Joriy Hafta"
                : activeDateOffset > 0
                ? `Keyingi ${activeDateOffset}-hafta`
                : `${Math.abs(activeDateOffset)} hafta oldin`}
            </span>
            <button
              onClick={() => setActiveDateOffset(prev => prev + 1)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E2D20] text-slate-600 dark:text-slate-300 transition"
              title="Keyingi hafta"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {activeDateOffset !== 0 && (
              <button
                onClick={() => setActiveDateOffset(0)}
                className="text-[11px] font-bold text-[#8BA88E] hover:underline ml-1"
              >
                Bugunga qaytish
              </button>
            )}
          </div>
        )}

        {/* Right: Group Filter & Student Search */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Group Filter */}
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F5F0] dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#283A2C] rounded-xl text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] focus:outline-none focus:ring-2 focus:ring-[#8BA88E]"
          >
            <option value="all">Barcha Guruhlar (1, 2, 3)</option>
            <option value="group_1">1-Guruh: Shoxruz, Abdurahmon, Islomxoja, Muso (10:00)</option>
            <option value="group_2">2-Guruh: Sunnatilla, Baxodir, Dovud, Fozilaxmad (14:30)</option>
            <option value="group_3">3-Guruh: Dilmurod, Nafosat, Abdulaziz (16:30)</option>
          </select>

          {/* Student Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="O'quvchi ismi..."
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 bg-[#F5F5F0] dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#283A2C] rounded-xl text-xs text-[#2C3E2D] dark:text-[#E6EAE7] placeholder:text-slate-400 w-36 focus:w-48 transition-all focus:outline-none focus:ring-2 focus:ring-[#8BA88E]"
            />
            {studentSearchQuery && (
              <button
                onClick={() => setStudentSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 5. VIEW 1: WEEKLY TIMETABLE GRID (HAFTALIK KO'RINISh) */}
      {/* --------------------------------------------------------------------- */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-[#152017] rounded-3xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[#EBE7DF] dark:divide-[#243326]">
            {weekDays.map(({ date, dayIndex, dayName, dayShort, formattedDate, isToday }) => {
              // Find all groups that have lessons on this day
              const groupsOnThisDay = filteredGroups.filter(g => g.days.includes(dayIndex));

              return (
                <div
                  key={dayIndex}
                  className={`flex flex-col min-h-[360px] ${
                    isToday ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                  }`}
                >
                  {/* Day Column Header */}
                  <div
                    className={`p-3.5 text-center border-b border-[#EBE7DF] dark:border-[#243326] ${
                      isToday
                        ? 'bg-[#2C3E2D] text-white dark:bg-[#283B2A]'
                        : 'bg-[#FAF8F5] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#E6EAE7]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-bold text-xs uppercase tracking-wider">{dayShort}</span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[9px] font-bold">
                          Bugun
                        </span>
                      )}
                    </div>
                    <p className={`text-base font-serif italic font-bold mt-0.5 ${
                      isToday ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {formattedDate}
                    </p>
                    <p className={`text-[10px] ${isToday ? 'text-[#A3C4A6]' : 'text-slate-400'}`}>
                      {dayName}
                    </p>
                  </div>

                  {/* Day Schedule Slots */}
                  <div className="p-3 flex-1 flex flex-col gap-2.5">
                    {groupsOnThisDay.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                        <span className="text-xl mb-1">☕️</span>
                        <span>Dars yo'q</span>
                        <span className="text-[10px] text-slate-400">Mustaqil amaliyot</span>
                      </div>
                    ) : (
                      groupsOnThisDay.map(group => {
                        const isStudentGroup = studentGroup?.id === group.id;
                        const isOngoingNow = isToday && (() => {
                          const start = new Date(currentTime);
                          start.setHours(group.startHour, group.startMinute, 0, 0);
                          const end = new Date(currentTime);
                          end.setHours(group.endHour, group.endMinute, 0, 0);
                          return currentTime >= start && currentTime <= end;
                        })();

                        return (
                          <motion.div
                            key={group.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                              isOngoingNow
                                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 shadow-md ring-2 ring-rose-400/40'
                                : isStudentGroup
                                ? 'bg-[#F2F6F3] dark:bg-[#1E2D20] border-[#8BA88E] shadow-sm'
                                : 'bg-white dark:bg-[#152017] border-[#EBE7DF] dark:border-[#283A2C] shadow-xs'
                            }`}
                          >
                            <div>
                              {/* Time Pill */}
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                                  isOngoingNow
                                    ? 'bg-rose-500 text-white animate-pulse'
                                    : 'bg-slate-100 dark:bg-[#203023] text-slate-800 dark:text-slate-200'
                                }`}>
                                  {group.timeSlot}
                                </span>
                                {isStudentGroup && (
                                  <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-bold">
                                    Sizniki
                                  </span>
                                )}
                              </div>

                              {/* Group Name */}
                              <h5 className="font-bold text-xs text-[#2C3E2D] dark:text-[#E6EAE7] leading-tight mb-1">
                                {group.name}
                              </h5>

                              {/* Room */}
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3 text-[#8BA88E]" />
                                {group.room.split('(')[0]}
                              </p>

                              {/* Student roster tags */}
                              <div className="flex flex-wrap gap-1">
                                {group.studentNames.map(sName => {
                                  const isSelected = studentSearchQuery.toLowerCase() === sName.toLowerCase() ||
                                    (appUser?.name || '').toLowerCase() === sName.toLowerCase();
                                  return (
                                    <span
                                      key={sName}
                                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                                        isSelected
                                          ? 'bg-amber-400 text-slate-900 font-bold'
                                          : 'bg-slate-100 dark:bg-[#1C281F] text-slate-600 dark:text-slate-300'
                                      }`}
                                    >
                                      {sName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Status label at bottom */}
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] flex items-center justify-between">
                              <span className="text-slate-400 font-medium">{group.subject.split('&')[0]}</span>
                              {isOngoingNow ? (
                                <span className="text-rose-600 font-bold flex items-center gap-1">
                                  <Radio className="w-3 h-3" /> Jonli
                                </span>
                              ) : isToday ? (
                                <span className="text-emerald-600 font-bold">Bugun</span>
                              ) : (
                                <span className="text-slate-400">Rejali</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 6. VIEW 2: AGENDA / TIMELINE LIST (KUNLIK REJA RO'YXATI) */}
      {/* --------------------------------------------------------------------- */}
      {viewMode === 'agenda' && (
        <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#2C3E2D] dark:text-[#E6EAE7] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8BA88E]" />
              Barcha Darslar Xronologik Rejasi
            </h3>
            <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">
              Haftada jami 3 ta alohida guruh darslari
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {SCHEDULE_GROUPS.map(group => {
              const nextLesson = getNextLessonForGroup(group, currentTime);
              const isStudentGroup = studentGroup?.id === group.id;

              return (
                <div
                  key={group.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isStudentGroup
                      ? 'bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/30 dark:from-emerald-950/20 dark:via-[#152017] dark:to-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#FAF8F5] dark:bg-[#1A261D] border-[#EBE7DF] dark:border-[#283A2C]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-md shrink-0 ${group.themeColor.gradient}`}>
                      <span className="text-[10px] uppercase font-bold tracking-wider">Vaqt</span>
                      <span className="text-xs font-mono font-bold">{group.startHour}:00</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${group.themeColor.badge}`}>
                          {group.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {group.timeSlot}
                        </span>
                        {isStudentGroup && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
                            Sizning darsingiz
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#2C3E2D] dark:text-[#E6EAE7]">
                        {group.subject} — {group.room}
                      </h4>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kunlar:</span>
                        {group.dayNames.map(dName => (
                          <span key={dName} className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#141F16] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {dName}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">O'quvchilar:</span>
                        {group.studentNames.map(sName => (
                          <span key={sName} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#203023] text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {sName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Navbatdagi dars</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">
                      {nextLesson.formattedDayName}, {nextLesson.formattedDate}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {formatCountdown(nextLesson)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 7. TEACHER / STUDENT INSTRUCTIONS & FAQ ACCORDION */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#FAF8F5] dark:bg-[#1A261D] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#283A2C] shadow-sm">
        <h4 className="font-bold text-sm text-[#2C3E2D] dark:text-[#E6EAE7] flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#8BA88E]" />
          Dars Jadvali Haqida Muhim Ma'lumotlar
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#828282] dark:text-[#9FB1A2]">
          <div className="p-4 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C]">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">🌅 1-Guruh: Ertalabki dars</p>
            <p><strong>Shoxruz, Abdurahmon, Islomxoja, Muso</strong></p>
            <p className="mt-1">Kunlar: Dushanba, Payshanba, Yakshanba</p>
            <p>Vaqti: 10:00 dan 11:30 gacha</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C]">
            <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">☀️ 2-Guruh: Kunduzgi dars</p>
            <p><strong>Sunnatilla, Baxodir, Dovud, Fozilaxmad</strong></p>
            <p className="mt-1">Kunlar: Dushanba, Seshanba, Yakshanba</p>
            <p>Vaqti: 14:30 dan 16:00 gacha</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C]">
            <p className="font-bold text-purple-700 dark:text-purple-400 mb-1">🌆 3-Guruh: Kechki dars</p>
            <p><strong>Dilmurod, Nafosat, Abdulaziz</strong></p>
            <p className="mt-1">Kunlar: Dushanba, Seshanba, Yakshanba</p>
            <p>Vaqti: 16:30 dan 18:00 gacha</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LessonScheduleCalendar;
