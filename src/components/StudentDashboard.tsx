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
  UserCheck
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
  getStudentRank
} from '../services/studentManager';
import StudentProfileView from './StudentProfileView';
import StudentLeaderboard from './StudentLeaderboard';
import LessonScheduleCalendar from './LessonScheduleCalendar';
import HomeworkCenter from './HomeworkCenter';
import { getAssignmentsForStudent } from '../services/homeworkManager';
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
  const [activeSubTab, setActiveSubTab] = useState<'teacher_grades' | 'homework' | 'leaderboard' | 'lessons' | 'games' | 'schedule'>('teacher_grades');
  const [myHomeworksCount, setMyHomeworksCount] = useState<number>(0);

  useEffect(() => {
    const updateHw = () => {
      const idOrLogin = appUser?.uid || appUser?.email || '';
      const list = getAssignmentsForStudent(idOrLogin, appUser?.name);
      setMyHomeworksCount(list.length);
    };
    updateHw();
    window.addEventListener('homeworks_updated', updateHw);
    return () => window.removeEventListener('homeworks_updated', updateHw);
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
    <div className="flex flex-col gap-6">
      
      {/* Top Banner / Student Identity Profile */}
      <div className="bg-[#2C3E2D] text-white rounded-3xl p-6 md:p-8 shadow-lg border border-[#8BA88E]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#8BA88E] text-white flex items-center justify-center font-serif italic text-2xl font-bold shadow-md shrink-0">
              {appUser?.name ? appUser.name.charAt(0) : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#8BA88E] text-[10px] font-bold uppercase tracking-wider">
                  👨‍🎓 O'quvchi Kabineti
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold">
                  {appUser?.email ? `Login: ${appUser.email}` : "Ro'yxatdan o'tgan"}
                </span>
                {studentNextLesson && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                    {studentNextLesson.group.name}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif italic font-bold">
                {appUser?.name || "O'quvchi"}
              </h3>
              <p className="text-xs text-[#8BA88E] mt-0.5">
                Ta'lim yo'nalishi: {appUser?.selectedTrack === 'design' ? 'Grafik Dizayn' : 'Kompyuter Savodxonligi'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                onClick={() => setActiveSubTab('leaderboard')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px] cursor-pointer transition group"
                title="Reyting jadvaliga o'tish"
              >
                <p className="text-[10px] text-amber-300 uppercase font-bold flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Reyting</span>
                </p>
                <p className="text-2xl font-serif italic text-amber-300 font-bold mt-0.5 group-hover:scale-105 transition-transform">
                  {studentRank.rank > 0 ? `#${studentRank.rank}` : "—"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <p className="text-[10px] text-white/70 uppercase font-bold">O'rtacha Baho</p>
                <p className="text-2xl font-serif italic text-[#8BA88E] font-bold mt-0.5">
                  {teacherAverage > 0 ? `${teacherAverage}%` : "—"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <p className="text-[10px] text-white/70 uppercase font-bold">Baholar Soni</p>
                <p className="text-2xl font-serif italic text-white font-bold mt-0.5">
                  {grades.length} ta
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <p className="text-[10px] text-white/70 uppercase font-bold">Eng Yuqori</p>
                <p className="text-2xl font-serif italic text-amber-300 font-bold mt-0.5">
                  {highestGrade > 0 ? `${highestGrade}` : "—"}
                </p>
              </div>
            </div>

            {/* Profile launcher button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-[#1C2C1D] rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-black/10 shrink-0 group"
            >
              <UserCheck className="w-4 h-4 text-[#1C2C1D] group-hover:scale-110 transition-transform" />
              <span>Mening IT Profilim & Sertifikat</span>
            </button>
          </div>
        </div>

        {/* Live Next Lesson Notification Strip */}
        {studentNextLesson && (
          <div className="mt-5 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-white/80">
                Keyingi darsingiz: <strong className="text-amber-300">{studentNextLesson.formattedDayName}</strong> ({studentNextLesson.formattedTime})
              </span>
              <span className="hidden md:inline text-white/50">•</span>
              <span className="hidden md:inline text-[#A3C4A6]">
                {studentNextLesson.group.room}
              </span>
            </div>

            <button
              onClick={() => setActiveSubTab('schedule')}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto border border-white/20"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Dars Jadvalini Ko'rish (Kalendar)</span>
            </button>
          </div>
        )}
      </div>

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-2 bg-[#F5F5F0] dark:bg-[#111912] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex-wrap sm:flex-nowrap">
        <button
          onClick={() => setActiveSubTab('teacher_grades')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'teacher_grades'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ustoz Baholari</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
            {grades.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('homework')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'homework'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Uyga Vazifalar</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
            {myHomeworksCount}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Reyting Jadvali</span>
          {studentRank.rank > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
              #{studentRank.rank}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('lessons')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'lessons'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bajarilgan Darslar & Daftarlar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('games')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'games'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>O'yinlar Natijalari</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'schedule'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Dars Jadvali & Kalendar</span>
          {studentNextLesson && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400/20 text-emerald-300 dark:text-emerald-200 font-bold">
              {studentNextLesson.group.shortName.split(' ')[0]}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 bg-[#FAF8F5] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#8BA88E] hover:bg-[#EBE7DF] dark:hover:bg-[#253629] border border-[#EBE7DF] dark:border-[#243326] shrink-0"
        >
          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profilni Ochish</span>
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
                O'qituvchingiz har bir dars, vazifa va amaliy ish uchun qo'ygan ballari hamda izohlari
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
      {/* 2. COMPLETED LESSONS & NOTES */}
      {/* ========================================================================= */}
      {activeSubTab === 'lessons' && (
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
              <div className="text-center py-20 border-2 border-dashed border-[#EBE7DF] dark:border-[#243326] rounded-3xl bg-[#FDFBF7] dark:bg-[#101712]">
                <BookOpen className="w-10 h-10 text-[#8BA88E]/40 mx-auto mb-3" />
                <p className="text-[#2D2D2D] dark:text-[#E6EAE7] font-bold text-sm">Hali birorta dars o'rganilmagan</p>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">Mavzulardan birini tanlab o'rganishni boshlang!</p>
              </div>
            )}
          </div>
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
      {/* 4. LESSON SCHEDULE & CALENDAR VIEW (DARS JADVALI VA KALENDAR) */}
      {/* ========================================================================= */}
      {activeSubTab === 'schedule' && (
        <div className="flex flex-col gap-6">
          <LessonScheduleCalendar
            appUser={appUser}
            selectedStudentName={currentStudent.fullName}
            onSelectTrackLesson={onSelectTrackLesson}
          />
        </div>
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

