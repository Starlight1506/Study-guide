import { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  BookOpen, 
  Star, 
  Trophy, 
  CheckCircle2, 
  Printer, 
  Share2, 
  X, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  Target, 
  GraduationCap, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Palette, 
  Rocket, 
  Check, 
  Flame,
  MessageSquare,
  Clock
} from 'lucide-react';
import { 
  StudentAccount, 
  StudentGrade, 
  StudentBadge,
  calculateStudentProfile,
  getRatingsForStudent,
  getStudentRank,
  LessonRatingFeedback
} from '../services/studentManager';
import { UNIFIED_CURRICULUM } from '../data/curriculum';
import { DESIGN_CURRICULUM } from '../data/designCurriculum';
import LessonScheduleCalendar from './LessonScheduleCalendar';
import { 
  getGroupByStudent, 
  getNextLessonForStudent 
} from '../services/scheduleManager';

interface StudentProfileViewProps {
  student: StudentAccount;
  onClose?: () => void;
  isTeacherView?: boolean;
  onOpenGrading?: (studentId: string) => void;
  onSelectLesson?: (track: 'literacy' | 'design', lessonId: number) => void;
}

export default function StudentProfileView({
  student,
  onClose,
  isTeacherView = false,
  onOpenGrading,
  onSelectLesson,
}: StudentProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'recommendations' | 'ratings' | 'badges' | 'schedule'>('overview');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [updateTick, setUpdateTick] = useState(0);

  useEffect(() => {
    const handler = () => setUpdateTick(t => t + 1);
    window.addEventListener('grades_updated', handler);
    window.addEventListener('lesson_ratings_updated', handler);
    return () => {
      window.removeEventListener('grades_updated', handler);
      window.removeEventListener('lesson_ratings_updated', handler);
    };
  }, []);

  // Compute live profile data
  const profile = useMemo(() => calculateStudentProfile(student), [student, updateTick]);
  const studentRatings = useMemo(() => getRatingsForStudent(student.id || student.login), [student, updateTick]);
  const studentRank = useMemo(() => getStudentRank(student.id || student.login), [student, updateTick]);
  const studentScheduleGroup = getGroupByStudent(student.fullName || student.login);
  const studentNextLesson = getNextLessonForStudent(student.fullName || student.login);

  // Curriculum lesson count totals
  const totalLiteracyLessons = UNIFIED_CURRICULUM.flatMap(m => m.weeks.flatMap(w => w.lessons)).length;
  const totalDesignLessons = DESIGN_CURRICULUM.flatMap(m => m.lessons).length;
  const totalAvailableLessons = student.enrolledTrack === 'literacy' 
    ? totalLiteracyLessons 
    : student.enrolledTrack === 'design' 
    ? totalDesignLessons 
    : (totalLiteracyLessons + totalDesignLessons);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Copy shareable summary to clipboard
  const handleShareSummary = () => {
    const text = `🎓 IT SAVODXONLIK MAKTABI — O'QUVCHI PROFILI
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 O'quvchi: ${student.fullName}
🏫 Sinf: ${student.gradeClass}
🎯 Yo'nalish: ${student.enrolledTrack === 'both' ? "IT Savodxonlik & Grafik Dizayn" : student.enrolledTrack === 'design' ? "Grafik Dizayn" : "Kompyuter Savodxonligi"}
🏆 O'quvchi darajasi: ${profile.levelTitle}
⭐️ Jami to'plangan ballar: ${profile.totalPoints} ball
📈 O'rtacha o'zlashtirish: ${profile.averageScore}% (${profile.gradeCount} ta dars baholangan)
🏅 Qo'lga kiritilgan yutuqlar: ${profile.badges.filter(b => b.unlocked).length} / ${profile.badges.length} ta nishon
👨‍🏫 Ustoz: Assadxoja
━━━━━━━━━━━━━━━━━━━━━━━━━━
Tizimga kirish logini: ${student.login}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Render badge icon helper
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-indigo-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-500" />;
      case 'Star':
        return <Star className="w-5 h-5 text-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-cyan-500" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-[#0E1710] rounded-3xl shadow-2xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col overflow-hidden my-auto print:my-0 print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white">
        
        {/* ========================================================================= */}
        {/* HEADER & IDENTITY BANNER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#1C2C1D] via-[#2C3E2D] to-[#1E3022] text-white p-6 sm:p-8 relative overflow-hidden print:bg-none print:text-black print:p-4 print:border-b-2 print:border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none print:hidden" />
          
          {/* Top action row */}
          <div className="flex items-center justify-between gap-4 relative z-10 mb-6 print:hidden">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#8BA88E]">
              <GraduationCap className="w-4 h-4" />
              <span>IT Savodxonlik Akademiyasi · Shaxsiy Profil</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareSummary}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm border border-white/15"
                title="Xulosani Telegram yoki boshqa joyga ulashish"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedSummary ? 'Nusxalandi!' : 'Ulashish'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm border border-white/15"
                title="Rasmiy A4 shaklida chop etish yoki PDF qilib saqlash"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Chop etish / PDF</span>
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition ml-1"
                  title="Yopish"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Student Hero Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8BA88E] to-[#ADC6B0] text-[#1C2C1D] flex items-center justify-center font-serif italic text-3xl font-black shadow-lg shrink-0 print:border print:border-slate-400">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1 text-xs text-white/80 print:text-slate-600">
                  <span className="font-bold text-white print:text-black">{student.gradeClass}</span>
                  <span aria-hidden="true">·</span>
                  <span>{student.enrolledTrack === 'both' ? 'IT Savodxonlik & Dizayn' : student.enrolledTrack === 'design' ? 'Grafik Dizayn' : 'Kompyuter Savodxonligi'}</span>
                  <span aria-hidden="true">·</span>
                  <code className="text-[#ADC6B0] print:text-slate-700 font-mono text-[11px]">@{student.login}</code>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif italic font-bold tracking-tight text-white print:text-black">
                  {student.fullName}
                </h1>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/15 text-xs font-bold text-amber-300 print:text-slate-800 print:border-slate-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    {profile.levelTitle}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reyting: #{studentRank.rank}</span>
                  </span>
                  <span className="text-xs text-white/70 print:text-slate-500 hidden sm:inline">
                    Daraja #{profile.levelRank}
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Action Quick Button */}
            {isTeacherView && onOpenGrading && (
              <div className="flex flex-col gap-2 print:hidden">
                <button
                  onClick={() => onOpenGrading(student.id)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1C2C1D] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>Ushbu o'quvchiga ball qo'yish</span>
                </button>
                <p className="text-[11px] text-[#8BA88E] text-center">
                  O'qituvchi: Assadxoja
                </p>
              </div>
            )}
          </div>

          {/* Print only official header */}
          <div className="hidden print:block mt-4 pt-3 border-t border-slate-300 text-xs text-slate-600">
            <p><strong>IT Savodxonlik va Kompyuter Grafikasi Akademiyasi</strong> · O'quvchi monitoring daftari va rasmiy reyting varaqasi</p>
            <p className="text-[10px] mt-0.5">Berilgan sana: {new Date().toLocaleDateString('uz-UZ')} · O'qituvchi: Assadxoja</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATS STRIP (Clean unboxed metrics) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-white dark:bg-[#152017] border-b border-[#EBE7DF] dark:border-[#243326] print:bg-white print:border-b-2 print:border-slate-300">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between print:border-none">
            <span className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              To'plangan Ball
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                {profile.totalPoints}
              </span>
              <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">ball</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between print:border-none">
            <span className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              O'zlashtirilgan
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                {profile.masteredCount}
              </span>
              <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">/ {totalAvailableLessons} dars</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between print:border-none">
            <span className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              O'rtacha Ko'rsatkich
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                {profile.averageScore > 0 ? `${profile.averageScore}%` : '—'}
              </span>
              <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                {profile.gradeCount > 0 ? `(${profile.gradeCount} baho)` : ''}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between print:border-none">
            <span className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-500" />
              Yutuq Nishonlari
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                {profile.badges.filter(b => b.unlocked).length}
              </span>
              <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">/ {profile.badges.length} ta</span>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] dark:bg-[#111A13] border-b border-[#EBE7DF] dark:border-[#243326] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-bold text-[#2D2D2D] dark:text-[#E6EAE7]">Keyingi darajagacha:</span>
            <span className="text-[#828282] dark:text-[#9FB1A2]">
              {Math.max(0, profile.nextLevelPoints - profile.totalPoints)} ball qoldi ({profile.nextLevelPoints} ball chegarasi)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-60">
            <div className="flex-1 h-2.5 rounded-full bg-[#EBE7DF] dark:bg-[#243326] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2C3E2D] to-[#8BA88E] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, profile.levelProgressPercent)}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#2C3E2D] dark:text-[#8BA88E] text-[11px]">
              {profile.levelProgressPercent}%
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1.5 p-3 px-6 bg-white dark:bg-[#152017] border-b border-[#EBE7DF] dark:border-[#243326] overflow-x-auto print:hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Umumiy Ko'rinish</span>
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'lessons'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>O'zlashtirilgan Darslar & Baholar ({profile.recentGrades.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'recommendations'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Ustoz Tavsiyalari</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'badges'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Yutuq Nishonlari ({profile.badges.filter(b => b.unlocked).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'ratings'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Dars Baholari & Fikrlari ({studentRatings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dars Jadvali & Guruh</span>
            {studentScheduleGroup && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                {studentScheduleGroup.shortName.split(' ')[0]}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB CONTENTS */}
        {/* ========================================================================= */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[60vh] print:max-h-none print:overflow-visible print:p-4">
          
          {/* TAB 1: OVERVIEW */}
          {(activeTab === 'overview' || window.matchMedia?.('print').matches) && (
            <div className="flex flex-col gap-6">
              
              {/* Highlight Teacher Recommendation Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-[#FAF8F5] to-emerald-500/10 dark:from-amber-950/20 dark:via-[#152017] dark:to-emerald-950/20 p-5 rounded-2xl border border-amber-500/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <h3 className="font-serif italic font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                      Ustoz Assadxoja Maxsus Tavsiyasi
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                    O'qituvchi Xulosasi
                  </span>
                </div>

                {profile.recentGrades.length > 0 && profile.recentGrades[0].feedback ? (
                  <blockquote className="text-xs sm:text-sm text-[#2D2D2D] dark:text-[#E6EAE7] italic leading-relaxed pl-3 border-l-2 border-amber-500">
                    "{profile.recentGrades[0].feedback}"
                    <div className="text-[11px] text-[#828282] dark:text-[#9FB1A2] not-italic mt-2 flex items-center gap-2">
                      <span>Eng so'nggi dars: <strong>{profile.recentGrades[0].lessonTitle}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Baho: <strong className="text-emerald-600">{profile.recentGrades[0].score} ball</strong></span>
                    </div>
                  </blockquote>
                ) : (
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] italic pl-3 border-l-2 border-amber-500">
                    "{student.fullName} IT akademiyamizning 5-sinf dasturi bo'yicha tahsil olmoqda. Darslarni muntazam o'zlashtirish, kompyuterda amaliy mashqlarni bajarish va har bir modul yakunida berilgan testlarni topshirish tavsiya qilinadi."
                  </p>
                )}
              </div>

              {/* Badges preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Akademiya Yutuq Nishonlari
                  </h4>
                  <button 
                    onClick={() => setActiveTab('badges')} 
                    className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] hover:underline flex items-center gap-1 print:hidden"
                  >
                    Barchasini ko'rish <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                        badge.unlocked
                          ? 'bg-white dark:bg-[#152017] border-amber-300 dark:border-amber-900/40 shadow-sm'
                          : 'bg-[#FAF8F5]/60 dark:bg-[#111A13]/60 border-[#EBE7DF] dark:border-[#243326] opacity-60'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#1C2C1D] shrink-0">
                        {renderBadgeIcon(badge.icon)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs text-[#1A2E1C] dark:text-[#E6EAE7] truncate">
                            {badge.name}
                          </h5>
                          {badge.unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] mt-0.5 line-clamp-2">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mastered Lessons Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#2C3E2D] dark:text-[#8BA88E]" />
                    So'nggi Baholangan Darslar
                  </h4>
                  <button 
                    onClick={() => setActiveTab('lessons')} 
                    className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] hover:underline flex items-center gap-1 print:hidden"
                  >
                    Barcha darslar ({profile.recentGrades.length}) <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {profile.recentGrades.length === 0 ? (
                  <div className="p-6 bg-white dark:bg-[#152017] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#243326] text-center">
                    <BookOpen className="w-8 h-8 text-[#828282] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]">Hozircha baholangan darslar mavjud emas</p>
                    <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-1">
                      O'qituvchi o'quvchi topshiriqlarini tekshirgach, bu yerda baholar va tavsiyalar aks etadi.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {profile.recentGrades.slice(0, 4).map((grade) => (
                      <div
                        key={grade.id}
                        className="p-3.5 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#828282] uppercase">
                              {grade.track === 'design' ? 'Grafik Dizayn' : 'IT Savodxonlik'} #{grade.lessonId}
                            </span>
                            <span className="text-[10px] text-[#828282]">·</span>
                            <span className="text-[10px] text-[#828282]">
                              {new Date(grade.gradedAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs sm:text-sm text-[#1A2E1C] dark:text-[#E6EAE7] truncate mt-0.5">
                            {grade.lessonTitle}
                          </h5>
                          {grade.feedback && (
                            <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] italic truncate mt-1">
                              "{grade.feedback}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-base font-serif italic font-bold text-emerald-700 dark:text-emerald-400">
                              {grade.score}
                            </span>
                            <span className="text-[10px] text-[#828282]">/{grade.maxScore || 100}</span>
                            <div className="text-[9px] font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                              {grade.gradeBadge}
                            </div>
                          </div>

                          {onSelectLesson && (
                            <button
                              onClick={() => onSelectLesson(grade.track, grade.lessonId)}
                              className="p-2 hover:bg-[#FAF8F5] dark:hover:bg-[#1C2C1D] rounded-xl text-[#2C3E2D] dark:text-[#8BA88E] transition print:hidden"
                              title="Darsni ochish"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: DETAILED MASTERED LESSONS */}
          {activeTab === 'lessons' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7]">
                    Barcha O'zlashtirilgan Darslar va Baholar Jurnali
                  </h4>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                    O'quvchi tomonidan topshirilgan va ustoz tomonidan baholangan barcha darslar to'liq ro'yxati
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#8BA88E]/20 px-3 py-1 rounded-full">
                  Jami: {profile.recentGrades.length} ta dars
                </span>
              </div>

              {profile.recentGrades.length === 0 ? (
                <div className="p-10 bg-white dark:bg-[#152017] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#243326] text-center">
                  <BookOpen className="w-10 h-10 text-[#828282] mx-auto mb-3 opacity-40" />
                  <h5 className="font-bold text-sm text-[#2D2D2D] dark:text-[#E6EAE7]">Hech qanday dars baholanmagan</h5>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-md mx-auto">
                    O'qituvchi o'quvchiga dars baholarini qo'yishi bilan, ushbu ro'yxat to'liq yangilanadi.
                  </p>
                  {isTeacherView && onOpenGrading && (
                    <button
                      onClick={() => onOpenGrading(student.id)}
                      className="mt-4 px-4 py-2 bg-[#2C3E2D] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hozir baho qo'yish</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {profile.recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="p-4 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#8BA88E] transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                            {grade.track === 'design' ? 'Grafik Dizayn' : 'IT Savodxonlik'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#828282] dark:text-[#9FB1A2]">
                            Dars #{grade.lessonId}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#828282] dark:text-[#9FB1A2]">
                            {new Date(grade.gradedAt).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                          {grade.lessonTitle}
                        </h5>
                        {grade.feedback && (
                          <div className="mt-2 text-xs text-[#2D2D2D] dark:text-[#D4DFD6] bg-[#FAF8F5] dark:bg-[#111A13] p-2.5 rounded-xl border border-[#EBE7DF] dark:border-[#243326] flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="italic leading-relaxed">"{grade.feedback}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBE7DF] dark:border-[#243326]">
                        <div className="text-right">
                          <div className="text-xl font-serif italic font-bold text-emerald-700 dark:text-emerald-400">
                            {grade.score} <span className="text-xs font-sans text-[#828282]">/{grade.maxScore || 100}</span>
                          </div>
                          <span className="inline-block text-[10px] font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#8BA88E]/15 px-2 py-0.5 rounded-md mt-0.5">
                            {grade.gradeBadge}
                          </span>
                        </div>

                        {onSelectLesson && (
                          <button
                            onClick={() => onSelectLesson(grade.track, grade.lessonId)}
                            className="px-3 py-2 bg-[#2C3E2D] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 print:hidden"
                          >
                            <span>Darsga o'tish</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEACHER RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Ustoz Assadxoja Shaxsiy Mulohaza va Tavsiyalari
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                  Har bir amaliy mashg'ulot, dars va o'quvchining shaxsiy iqtidori bo'yicha yo'naltiruvchi maxsus maslahatlar
                </p>
              </div>

              {profile.recentGrades.filter(g => g.feedback).length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#152017] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#243326] text-center">
                  <MessageSquare className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-50" />
                  <h5 className="font-bold text-xs text-[#2D2D2D] dark:text-[#E6EAE7]">Hozircha maxsus tavsiyalar kiritilmagan</h5>
                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-sm mx-auto">
                    O'qituvchi o'quvchiga topshiriq tekshiruvi orqali shaxsiy tavsiya yozishi mumkin.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {profile.recentGrades.filter(g => g.feedback).map((grade) => (
                    <div
                      key={grade.id}
                      className="p-4 bg-white dark:bg-[#152017] rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                          Mavzu: {grade.lessonTitle}
                        </span>
                        <span className="text-[#828282] text-[11px]">
                          {new Date(grade.gradedAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                      <blockquote className="text-xs sm:text-sm text-[#2D2D2D] dark:text-[#E6EAE7] italic leading-relaxed pl-3 border-l-2 border-emerald-600 bg-[#FAF8F5] dark:bg-[#111A13] p-3 rounded-r-xl">
                        "{grade.feedback}"
                      </blockquote>
                      <div className="flex items-center justify-between text-[11px] text-[#828282] pt-1">
                        <span>O'qituvchi: <strong>{grade.teacherName || 'Assadxoja'}</strong></span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Qo'yilgan baho: {grade.score} ball ({grade.gradeBadge})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BADGES */}
          {activeTab === 'badges' && (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Akademiya Yutuq Nishonlari va Bosqichlari
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                  Darslarni o'zlashtirish, a'lo baholar olish va faollik uchun beriladigan rasmiy nishonlar
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition flex items-start gap-4 ${
                      badge.unlocked
                        ? 'bg-white dark:bg-[#152017] border-emerald-500/30 shadow-sm'
                        : 'bg-[#FAF8F5]/60 dark:bg-[#111A13]/60 border-[#EBE7DF] dark:border-[#243326] opacity-60'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl shrink-0 ${badge.unlocked ? 'bg-amber-500/10 dark:bg-amber-950/30' : 'bg-[#EBE7DF] dark:bg-[#1C2C1D]'}`}>
                      {renderBadgeIcon(badge.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                          {badge.name}
                        </h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          badge.unlocked 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {badge.unlocked ? "Qo'lga kiritildi" : "Qulflangan"}
                        </span>
                      </div>
                      <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TAB: STUDENT LESSON RATINGS & REVIEWS */}
          {activeTab === 'ratings' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF] dark:border-[#243326]">
                <div>
                  <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>Darslar Bo'yicha Fikrlar va 1-5 Yulduzli Baholar</span>
                  </h4>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                    O'quvchi tomonidan darslar yakunida qoldirilgan yulduzcha baholari va qisqa sharhlari
                  </p>
                </div>
                <span className="text-xs font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                  {studentRatings.length} ta dars baholangan
                </span>
              </div>

              {/* Quick student rating summary */}
              {studentRatings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">O'rtacha Qo'ygan Bahosi</span>
                      <span className="text-xl font-bold font-serif italic text-amber-500 mt-0.5 block">
                        {(studentRatings.reduce((sum, r) => sum + r.rating, 0) / studentRatings.length).toFixed(1)} / 5.0 ⭐
                      </span>
                    </div>
                    <Star className="w-8 h-8 text-amber-400 fill-amber-400/20" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">5 Yulduzli Darslar</span>
                      <span className="text-xl font-bold font-serif italic text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        {studentRatings.filter(r => r.rating === 5).length} ta
                      </span>
                    </div>
                    <Sparkles className="w-8 h-8 text-emerald-500/30" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">Oxirgi Fikr Bildirgan Vaqti</span>
                      <span className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mt-1 block truncate">
                        {new Date(studentRatings[0]?.createdAt || Date.now()).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <Clock className="w-8 h-8 text-[#8BA88E]/40" />
                  </div>
                </div>
              )}

              {/* Ratings List */}
              <div className="flex flex-col gap-3">
                {studentRatings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121B14] border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-2.5 hover:border-[#8BA88E]/40 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.track === 'design'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {item.track === 'design' ? 'Dizayn' : 'Savodxonlik'}
                          </span>
                          <h5 className="font-bold text-xs sm:text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                            #{item.lessonId} — {item.lessonTitle}
                          </h5>
                        </div>
                        <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] mt-1 block">
                          {new Date(item.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#27392B] text-xs text-[#2D2D2D] dark:text-[#D4DFD6] italic leading-relaxed">
                      "{item.comment}"
                    </div>
                  </div>
                ))}

                {studentRatings.length === 0 && (
                  <div className="py-12 text-center bg-[#FAF8F5] dark:bg-[#121B14] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                    <Star className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
                    <p className="text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold">
                      O'quvchi hozircha darslarga baho va sharh qoldirmagan.
                    </p>
                    <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                      Darslarni o'zlashtirib, har bir dars so'ngidagi 1-5 yulduzcha orqali baholash tizimidan foydalanishi mumkin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SCHEDULE & CALENDAR (DARS JADVALI VA KALENDAR) */}
          {/* ========================================================================= */}
          {activeTab === 'schedule' && (
            <div className="flex flex-col gap-6">
              <LessonScheduleCalendar
                selectedStudentName={student.fullName}
                onSelectTrackLesson={onSelectLesson}
              />
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#111A13] border-t border-[#EBE7DF] dark:border-[#243326] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#828282] dark:text-[#9FB1A2] print:bg-white print:border-t-2 print:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8BA88E]" />
            <span>ID: <code className="font-mono text-[#2C3E2D] dark:text-[#8BA88E] font-bold">{student.id}</code></span>
            <span aria-hidden="true">·</span>
            <span>A'zo bo'lgan: {new Date(student.createdAt).toLocaleDateString('uz-UZ')}</span>
          </div>

          {/* Official Sign for Print */}
          <div className="hidden print:flex items-center gap-8 text-black mt-6">
            <div>
              <p className="font-bold">O'qituvchi Imzosi:</p>
              <div className="w-36 border-b border-black mt-6"></div>
              <p className="text-[10px] mt-1">Assadxoja</p>
            </div>
            <div>
              <p className="font-bold">Tasdiq Muhri:</p>
              <div className="w-20 h-20 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-[9px] text-center p-1 text-slate-500 mt-1">
                IT SAVODXONLIK MAKTABI
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#1A261D] hover:bg-[#EBE7DF] dark:hover:bg-[#253629] text-[#2D2D2D] dark:text-[#E6EAE7] rounded-xl font-bold transition"
              >
                Yopish
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Sertifikat & Hisobotni Chop Etish</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
