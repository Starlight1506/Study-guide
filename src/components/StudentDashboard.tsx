import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Star, 
  Sparkles, 
  FileText, 
  Calendar,
  Award,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Layers,
  ChevronRight,
  TrendingUp,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Coins,
  Phone,
  BellRing,
  Palette,
  Code2,
  Check
} from 'lucide-react';
import { UNIFIED_CURRICULUM, Lesson } from '../data/curriculum';
import { DESIGN_CURRICULUM } from '../data/designCurriculum';
import { AppUser } from './LoginModal';
import { 
  StudentAccount, 
  StudentGrade, 
  getGradesForStudent, 
  getStudentByLoginOrId, 
  calculateStudentProfile,
  getStudentRank,
  updateStudent
} from '../services/studentManager';
import StudentProfileView from './StudentProfileView';
import StudentLeaderboard from './StudentLeaderboard';
import LessonScheduleCalendar from './LessonScheduleCalendar';
import HomeworkCenter from './HomeworkCenter';
import SmartCoinCenter from './SmartCoinCenter';
import { getAssignmentsForStudent } from '../services/homeworkManager';
import { getStudentCoinSummary } from '../services/smartCoinManager';
import { 
  getNextLessonForStudent, 
  getGroupByStudent,
  NextLessonInfo 
} from '../services/scheduleManager';

interface ProgressItem {
  id: number;
  section: string;
  lessonId: number;
  completedAt: string;
  notes: string | null;
}

interface ScoreItem {
  id: number;
  section: string;
  lessonId: number;
  score: number;
  maxScore: number;
  playedAt: string;
}

interface DashboardProps {
  userToken: string | null;
  appUser?: AppUser | null;
  onSelectLesson: (id: number) => void;
  onSelectTrackLesson?: (track: 'literacy' | 'design', id: number) => void;
}

// Flatten all unified lessons
const ALL_LITERACY_LESSONS: Lesson[] = UNIFIED_CURRICULUM.flatMap(month => 
  month.weeks.flatMap(week => week.lessons)
);

const ALL_DESIGN_LESSONS = DESIGN_CURRICULUM.flatMap(month => month.lessons);

export default function StudentDashboard({ 
  userToken, 
  appUser, 
  onSelectLesson, 
  onSelectTrackLesson 
}: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'teacher_grades' | 'smart_coins' | 'homework' | 'leaderboard' | 'reja' | 'games'>('teacher_grades');
  const [rejaSubView, setRejaSubView] = useState<'schedule' | 'completed' | 'all_plans'>('schedule');
  const [myHomeworksCount, setMyHomeworksCount] = useState<number>(0);
  const [myCoinBalance, setMyCoinBalance] = useState<number>(0);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [phoneSavedMsg, setPhoneSavedMsg] = useState<boolean>(false);

  useEffect(() => {
    const updateHw = () => {
      const idOrLogin = appUser?.uid || appUser?.email || '';
      const list = getAssignmentsForStudent(idOrLogin, appUser?.name);
      setMyHomeworksCount(list.length);
    };
    const updateCoins = () => {
      const idOrLogin = appUser?.uid || appUser?.email || '';
      const summary = getStudentCoinSummary(idOrLogin, appUser?.name);
      setMyCoinBalance(summary.totalCoins);
    };
    updateHw();
    updateCoins();
    window.addEventListener('homeworks_updated', updateHw);
    window.addEventListener('smart_coins_updated', updateCoins);
    return () => {
      window.removeEventListener('homeworks_updated', updateHw);
      window.removeEventListener('smart_coins_updated', updateCoins);
    };
  }, [appUser]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentAccount | null>(null);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [stats, setStats] = useState({
    completedCount: 0,
    gamesPlayed: 0,
    averageScore: 0,
    progressList: [] as ProgressItem[],
    recentScores: [] as ScoreItem[],
  });
  const [loading, setLoading] = useState(false);

  // Resolve current student account
  const currentStudent: StudentAccount = useMemo(() => {
    if (appUser) {
      const found = getStudentByLoginOrId(appUser.email || appUser.name);
      if (found) return found;
      return {
        id: appUser.uid || `std_${(appUser.name || 'oquvchi').toLowerCase().replace(/\s+/g, '')}`,
        fullName: appUser.name || "O'quvchi",
        login: appUser.email || (appUser.name || 'oquvchi').toLowerCase().replace(/\s+/g, ''),
        password: '',
        gradeClass: '5-sinf',
        enrolledTrack: (appUser.selectedTrack || 'both') as 'literacy' | 'design' | 'both',
        createdAt: new Date().toISOString(),
        notes: "IT Savodxonlik o'quvchisi",
      };
    }
    return {
      id: 'std_guest',
      fullName: "O'quvchi",
      login: 'oquvchi',
      password: '',
      gradeClass: '5-sinf',
      enrolledTrack: 'both',
      createdAt: new Date().toISOString(),
    };
  }, [appUser]);

  useEffect(() => {
    setPhoneInput(currentStudent.phone || '');
  }, [currentStudent]);

  const handleSaveStudentPhone = () => {
    if (!currentStudent.id || currentStudent.id === 'std_guest') return;
    updateStudent(currentStudent.id, { phone: phoneInput.trim() });
    setPhoneSavedMsg(true);
    setTimeout(() => setPhoneSavedMsg(false), 3000);
  };

  // Load teacher grades for this student
  const loadGrades = () => {
    if (!appUser) {
      setGrades([]);
      return;
    }
    const studentIdentifier = appUser.uid || appUser.email;
    const studentName = appUser.name;
    const studentGrades = getGradesForStudent(studentIdentifier, studentName);
    setGrades(studentGrades);
  };

  const fetchBackendStats = async () => {
    if (!userToken) {
      // Local fallback for completed lessons from localStorage
      const localDesign = localStorage.getItem('design_completed_lessons');
      const designCount = localDesign ? JSON.parse(localDesign).length : 0;
      setStats(prev => ({
        ...prev,
        completedCount: designCount > 0 ? designCount : 0,
      }));
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStats({
          completedCount: data.completedCount || 0,
          gamesPlayed: data.gamesPlayed || 0,
          averageScore: data.averageScore || 0,
          progressList: data.progressList || [],
          recentScores: data.recentScores || [],
        });
      }
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
    fetchBackendStats();

    const handleGradesUpdate = () => {
      loadGrades();
    };
    window.addEventListener('grades_updated', handleGradesUpdate);
    return () => {
      window.removeEventListener('grades_updated', handleGradesUpdate);
    };
  }, [userToken, appUser]);

  // Lesson name helper
  const getLessonName = (id: number, track: 'literacy' | 'design' = 'literacy') => {
    if (track === 'design') {
      const found = ALL_DESIGN_LESSONS.find(l => l.id === id);
      return found ? found.title : `Dizayn Darsi #${id}`;
    }
    const item = ALL_LITERACY_LESSONS.find((l) => l.id === id);
    return item ? item.title : `Dars #${id}`;
  };

  // Compute teacher grade averages
  const teacherAverage = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length)
    : 0;

  const highestGrade = grades.length > 0
    ? Math.max(...grades.map(g => g.score))
    : 0;

  // Next lesson calculation for student
  const studentNextLesson: NextLessonInfo | null = useMemo(() => {
    return getNextLessonForStudent(currentStudent.fullName || currentStudent.login);
  }, [currentStudent]);

  // Leaderboard rank calculation
  const studentRank = useMemo(() => {
    return getStudentRank(currentStudent.id || currentStudent.login || currentStudent.fullName);
  }, [currentStudent, grades]);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Compact Top Banner / Student Identity Profile */}
      <div className="bg-[#2C3E2D] text-white rounded-3xl p-5 md:p-6 shadow-md border border-[#8BA88E]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#8BA88E] text-white flex items-center justify-center font-serif italic text-xl font-bold shadow-md shrink-0">
              {appUser?.name ? appUser.name.charAt(0) : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#8BA88E] text-[9px] font-bold uppercase tracking-wider">
                  👨‍🎓 O'quvchi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[9px] font-bold">
                  {appUser?.email ? `Login: ${appUser.email}` : "Faol"}
                </span>
                {studentNextLesson && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[9px] font-bold border border-emerald-400/40">
                    {studentNextLesson.group.shortName}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-serif italic font-bold leading-tight">
                {appUser?.name || "O'quvchi"}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Compact Metrics Bar */}
            <div
              onClick={() => setActiveSubTab('smart_coins')}
              className="bg-amber-400/20 hover:bg-amber-400/30 px-3 py-2 rounded-xl border border-amber-400/40 text-center cursor-pointer transition"
              title="SMART COIN hamyonimga o'tish"
            >
              <p className="text-[9px] text-amber-300 uppercase font-bold flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-amber-300" />
                <span>COIN</span>
              </p>
              <p className="text-base font-serif italic text-amber-300 font-bold">
                {myCoinBalance} SC
              </p>
            </div>
            <div 
              onClick={() => setActiveSubTab('leaderboard')}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl border border-white/10 text-center cursor-pointer transition"
              title="Reyting jadvaliga o'tish"
            >
              <p className="text-[9px] text-amber-300 uppercase font-bold flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Reyting</span>
              </p>
              <p className="text-base font-serif italic text-amber-300 font-bold">
                {studentRank.rank > 0 ? `#${studentRank.rank}` : "—"}
              </p>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[9px] text-white/70 uppercase font-bold">O'rtacha</p>
              <p className="text-base font-serif italic text-[#8BA88E] font-bold">
                {teacherAverage > 0 ? `${teacherAverage}%` : "—"}
              </p>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[9px] text-white/70 uppercase font-bold">Baholar</p>
              <p className="text-base font-serif italic text-white font-bold">
                {grades.length} ta
              </p>
            </div>

            {/* Profile launcher button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-[#1C2C1D] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#1C2C1D]" />
              <span>Profil & Sertifikat</span>
            </button>
          </div>
        </div>

        {/* Live Next Lesson Notification Strip */}
        {studentNextLesson && (
          <div className="mt-3.5 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-white/85">
                Keyingi dars: <strong className="text-amber-300">{studentNextLesson.formattedDayName}</strong> ({studentNextLesson.formattedTime})
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 text-[11px] font-semibold">
                📱 Darsdan 30 daqiqa oldin SMS eslatma yuboriladi
              </span>
            </div>

            <button
              onClick={() => {
                setActiveSubTab('reja');
                setRejaSubView('schedule');
              }}
              className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition flex items-center gap-1.5 self-start sm:self-auto border border-white/20"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>📋 Reja va SMS sozlamasi</span>
            </button>
          </div>
        )}
      </div>

      {/* COMPACT TABS SWITCHER */}
      <div className="flex items-center gap-1.5 bg-[#F5F5F0] dark:bg-[#111912] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex-wrap">
        <button
          onClick={() => setActiveSubTab('teacher_grades')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'teacher_grades'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Baholar</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">
            {grades.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('smart_coins')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'smart_coins'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>🪙 COIN</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/25 text-amber-700 dark:text-amber-200 font-bold">
            {myCoinBalance}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('homework')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'homework'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Vazifalar</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
            {myHomeworksCount}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reja')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'reja'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>📋 Reja</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/25 text-emerald-300 font-bold">
            Dars + SMS
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Reyting</span>
          {studentRank.rank > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
              #{studentRank.rank}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('games')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'games'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>O'yinlar</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TEACHER GRADES & COMMENTS JOURNAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'teacher_grades' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Mening Baholarim Daftari (O'qituvchidan)
              </h4>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                O'qituvchingiz va Admin har bir dars, vazifa va amaliy ish uchun qo'ygan ballari hamda izohlari
              </p>
            </div>
            {grades.length > 0 && (
              <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#8BA88E]/20 px-3 py-1 rounded-full">
                Jami: {grades.length} ta dars baholangan
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="bg-white dark:bg-[#152017] rounded-3xl p-5 md:p-6 border-2 border-[#EBE7DF] dark:border-[#243326] hover:border-[#8BA88E] transition shadow-sm flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#EBE7DF] dark:border-[#283A2C] bg-[#FAF8F5] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#D4DFD6]">
                        {grade.track === 'literacy' ? '💻 Kompyuter Savodxonligi' : '🎨 Grafik Dizayn'}
                      </span>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3 text-[#8BA88E]" />
                        {new Date(grade.gradedAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    {/* Score badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-serif italic font-bold shrink-0 ${
                      grade.score >= 86 
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : grade.score >= 70
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                    }`}>
                      {grade.score} / {grade.maxScore} ball ({grade.gradeBadge})
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7] leading-snug">
                    Dars #{grade.lessonId}: {grade.lessonTitle}
                  </h5>

                  {/* Teacher Feedback / Comments Box */}
                  {grade.feedback && (
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#C5D0C7] flex items-start gap-2.5 shadow-inner">
                      <MessageSquare className="w-4 h-4 text-[#8BA88E] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8BA88E] block mb-0.5">
                          Ustoz ({grade.teacherName || "O'qituvchi"}) tavsiyasi:
                        </span>
                        <p className="italic leading-relaxed text-xs">
                          "{grade.feedback}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between">
                  <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                    Baho: <strong className="text-[#2C3E2D] dark:text-[#E6EAE7]">{grade.gradeBadge}</strong>
                  </span>

                  <button
                    onClick={() => {
                      if (onSelectTrackLesson) {
                        onSelectTrackLesson(grade.track, grade.lessonId);
                      } else {
                        onSelectLesson(grade.lessonId);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#FAF8F5] dark:bg-[#1A261D] hover:bg-[#2C3E2D] hover:text-white dark:hover:bg-[#2F4632] border border-[#EBE7DF] dark:border-[#283A2C] rounded-xl text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] transition flex items-center gap-1.5"
                  >
                    <span>Darsni Ko'rish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {grades.length === 0 && (
              <div className="md:col-span-2 py-20 text-center bg-white dark:bg-[#152017] rounded-3xl border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                <Award className="w-12 h-12 text-[#8BA88E]/40 mx-auto mb-3" />
                <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Hozircha baholar qo'yilmagan
                </h5>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-sm mx-auto">
                  Darslarni o'rganing va vazifalarni topshiring. O'qituvchingiz tekshirib, ushbu jurnalingizga ball qo'yadi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UNIFIED "📋 REJA" SECTION (SCHEDULE + ALL COURSE PLANS + 30-MIN SMS)   */}
      {/* ========================================================================= */}
      {activeSubTab === 'reja' && (
        <div className="flex flex-col gap-5">
          {/* 30-Minute SMS Reminder Phone Card */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                  <span>📱 Darsdan 30 daqiqa oldin SMS Eslatma</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Avtomatik
                  </span>
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                  Dars vaqtingiz boshlanishiga 30 daqiqa qolganda telefon raqamingizga avtomatik SMS xabarnoma yuboriladi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#828282] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="pl-8 pr-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#1A2E1C] dark:text-white focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>
              <button
                onClick={handleSaveStudentPhone}
                className="px-4 py-2 rounded-xl bg-[#2C3E2D] hover:bg-[#1E2B1F] text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                {phoneSavedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5" />}
                <span>{phoneSavedMsg ? 'Saqlandi!' : 'Saqlash'}</span>
              </button>
            </div>
          </div>

          {/* Sub-navigation inside Reja */}
          <div className="bg-white dark:bg-[#152017] rounded-2xl p-3 border border-[#EBE7DF] dark:border-[#243326] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setRejaSubView('schedule')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  rejaSubView === 'schedule'
                    ? 'bg-[#2C3E2D] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#1A261D] text-[#828282] dark:text-[#9FB1A2] hover:text-[#1A2E1C]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>📅 Dars Jadvali & Kalendar</span>
              </button>
              <button
                onClick={() => setRejaSubView('all_plans')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  rejaSubView === 'all_plans'
                    ? 'bg-[#2C3E2D] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#1A261D] text-[#828282] dark:text-[#9FB1A2] hover:text-[#1A2E1C]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>📚 Barcha Dars Rejalari (84 ta dars)</span>
              </button>
              <button
                onClick={() => setRejaSubView('completed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  rejaSubView === 'completed'
                    ? 'bg-[#2C3E2D] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#1A261D] text-[#828282] dark:text-[#9FB1A2] hover:text-[#1A2E1C]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8BA88E]" />
                <span>📓 Bajarilgan Darslar ({stats.progressList.length})</span>
              </button>
            </div>
          </div>

          {rejaSubView === 'schedule' && (
            <LessonScheduleCalendar
              appUser={appUser}
              selectedStudentName={currentStudent.fullName}
              onSelectTrackLesson={onSelectTrackLesson}
            />
          )}

          {rejaSubView === 'all_plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plan 1: Savodxonlik */}
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2C3E2D]/10 dark:bg-white/10 text-[#2C3E2D] dark:text-[#8BA88E]">
                    3 Oy • 36 ta Dars
                  </span>
                  <h5 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-white mt-2">
                    💻 Kompyuter Savodxonligi
                  </h5>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                    1-oy: Kompyuter & Windows, 2-oy: Word & Excel, 3-oy: PowerPoint, Internet & Xavfsizlik.
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {ALL_LITERACY_LESSONS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => onSelectTrackLesson ? onSelectTrackLesson('literacy', l.id) : onSelectLesson(l.id)}
                        className="text-left px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] hover:bg-[#2C3E2D] hover:text-white text-xs font-semibold transition truncate"
                      >
                        #{l.id}. {l.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan 2: Grafik Dizayn (Canva & Figma) */}
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    2 Modul • 24 ta Dars
                  </span>
                  <h5 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-white mt-2">
                    🎨 Grafik Dizayn (Canva & Figma)
                  </h5>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                    1-Modul: Canva va Brending (12 dars). 2-Modul: Figma UI/UX Veb-Dizayn (12 dars).
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {ALL_DESIGN_LESSONS.filter((l) => l.id <= 24).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => onSelectTrackLesson && onSelectTrackLesson('design', l.id)}
                        className="text-left px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] hover:bg-[#2C3E2D] hover:text-white text-xs font-semibold transition truncate"
                      >
                        #{l.id}. {l.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan 3: Frontend (HTML5 & CSS3) */}
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                    2 Modul • 24 ta Dars
                  </span>
                  <h5 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-white mt-2">
                    🌐 Frontend (HTML5 & CSS3)
                  </h5>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                    3-Modul: HTML5 Semantikasi (12 dars). 4-Modul: CSS3, Flexbox, Grid va Responsive (12 dars).
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {ALL_DESIGN_LESSONS.filter((l) => l.id > 24).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => onSelectTrackLesson && onSelectTrackLesson('design', l.id)}
                        className="text-left px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] hover:bg-[#2C3E2D] hover:text-white text-xs font-semibold transition truncate"
                      >
                        #{l.id - 24}. {l.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {rejaSubView === 'completed' && (
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-6">
              <div>
                <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-lg flex items-center gap-2 font-normal">
                  <BookOpen className="w-5 h-5 text-[#8BA88E]" />
                  Mening Darsliklarim Daftari
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                  Siz tamomlagan barcha darslar va yozgan shaxsiy dars eslatmalaringiz
                </p>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
                {stats.progressList.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] bg-[#FDFBF7] dark:bg-[#101712] hover:bg-[#F5F5F0]/40 dark:hover:bg-[#18241B] transition flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-[#2C3E2D] dark:bg-[#2F4632] text-white border-[#2C3E2D] dark:border-[#3A563E]">
                          {`Dars #${prog.lessonId}`}
                        </span>
                        <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-[#8BA88E]" />
                          {new Date(prog.completedAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                      <h5 className="font-bold text-[#2D2D2D] dark:text-[#E6EAE7] text-sm">
                        {getLessonName(prog.lessonId)}
                      </h5>

                      {prog.notes && (
                        <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#C5D0C7] flex items-start gap-2 shadow-inner">
                          <FileText className="w-3.5 h-3.5 text-[#8BA88E] shrink-0 mt-0.5" />
                          <p className="italic leading-relaxed">{prog.notes}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectLesson(prog.lessonId)}
                      className="px-4 py-2 bg-white dark:bg-[#1A261D] hover:bg-[#F5F5F0] dark:hover:bg-[#223326] border border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7] rounded-full text-xs font-bold self-end md:self-start shrink-0 transition-all"
                    >
                      Darsga Kirish
                    </button>
                  </div>
                ))}

                {stats.progressList.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-[#EBE7DF] dark:border-[#243326] rounded-3xl bg-[#FDFBF7] dark:bg-[#101712]">
                    <BookOpen className="w-10 h-10 text-[#8BA88E]/40 mx-auto mb-3" />
                    <p className="text-[#2D2D2D] dark:text-[#E6EAE7] font-bold text-sm">Hali birorta dars o'rganilmagan</p>
                    <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">Mavzulardan birini tanlab o'rganishni boshlang!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME SCORES */}
      {/* ========================================================================= */}
      {activeSubTab === 'games' && (
        <div className="bg-white dark:bg-[#152017] p-6 rounded-3xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
          <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] mb-4 flex items-center gap-2 text-base font-normal">
            <Trophy className="w-5 h-5 text-amber-500" />
            Interaktiv O'yinlar Natijalari
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.recentScores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#243326]">
                <div className="max-w-[70%]">
                  <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] truncate">
                    {getLessonName(score.lessonId)}
                  </p>
                  <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase tracking-wider">
                    Dars #{score.lessonId}
                  </p>
                </div>
                <span className="font-serif italic text-xs font-bold px-3 py-1 rounded-full bg-[#F5F5F0] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#8BA88E] border border-[#EBE7DF] dark:border-[#2D3E30]">
                  {score.score}/{score.maxScore} ball
                </span>
              </div>
            ))}
            {stats.recentScores.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Trophy className="w-8 h-8 text-[#8BA88E]/40 mx-auto mb-2" />
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] italic">Hali birorta o'yin o'ynalmagan</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SMART COIN WALLET, LEADERBOARD & JOURNAL                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'smart_coins' && (
        <SmartCoinCenter
          mode="student"
          studentIdOrLogin={currentStudent.id}
          studentName={currentStudent.fullName}
        />
      )}

      {/* ========================================================================= */}
      {/* HOMEWORK ASSIGNMENTS & SUBMISSIONS (UYGA VAZIFALAR)                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'homework' && (
        <HomeworkCenter
          role="student"
          studentId={currentStudent.id}
          studentName={currentStudent.fullName}
          studentLogin={currentStudent.login}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. LEADERBOARD & REYTING JADVALI (UMUMIY REYTING JADVALI) */}
      {/* ========================================================================= */}
      {activeSubTab === 'leaderboard' && (
        <StudentLeaderboard
          currentStudentId={currentStudent.id}
          currentStudentLogin={currentStudent.login}
          onSelectStudent={(student) => {
            setViewingStudent(student);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. INDIVIDUAL STUDENT PROFILE MODAL VIEW */}
      {/* ========================================================================= */}
      {(isProfileOpen || viewingStudent) && (
        <StudentProfileView
          student={viewingStudent || currentStudent}
          onClose={() => {
            setIsProfileOpen(false);
            setViewingStudent(null);
          }}
          onSelectLesson={onSelectTrackLesson || ((track, id) => onSelectLesson(id))}
        />
      )}

    </div>
  );
}

