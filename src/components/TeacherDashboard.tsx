import React, { useState, useEffect, useMemo } from 'react';
import { 
  Laptop, 
  Palette, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Layers, 
  ArrowRight, 
  Award, 
  Sparkles, 
  ShieldCheck,
  Plus,
  KeyRound,
  UserPlus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Star,
  Search,
  Filter,
  GraduationCap,
  MessageSquare,
  Calendar,
  ChevronDown,
  BarChart3,
  Sliders,
  Send,
  Clock,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import { UNIFIED_CURRICULUM } from '../data/curriculum';
import { DESIGN_CURRICULUM } from '../data/designCurriculum';
import { 
  StudentAccount, 
  StudentGrade, 
  LessonRatingFeedback,
  getStoredStudents, 
  saveStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  getStoredGrades, 
  addOrUpdateGrade, 
  deleteGrade,
  clearAllStudents,
  clearAllGrades,
  getStoredRatings,
  deleteRating,
  clearAllRatings
} from '../services/studentManager';
import StudentProfileView from './StudentProfileView';
import LessonScheduleCalendar from './LessonScheduleCalendar';
import StudentLeaderboard from './StudentLeaderboard';

interface TeacherDashboardProps {
  onNavigateToTrack: (track: 'literacy' | 'design') => void;
  teacherName?: string;
  onSelectStudentLesson?: (track: 'literacy' | 'design', lessonId: number) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateToTrack,
  teacherName = 'Assadxoja',
  onSelectStudentLesson,
}) => {
  // Main Tab State
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'grading' | 'reviews' | 'leaderboard' | 'schedule' | 'courses'>('students');

  // Students, Grades & Ratings state
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [ratings, setRatings] = useState<LessonRatingFeedback[]>([]);

  // Individual Student Profile View state
  const [profileViewingStudent, setProfileViewingStudent] = useState<StudentAccount | null>(null);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState<'all' | 'literacy' | 'design'>('all');
  const [gradeFilterStudent, setGradeFilterStudent] = useState<string>('all');

  // Reviews Filters (O'quvchilar fikrlari filtrlari)
  const [reviewSearch, setReviewSearch] = useState<string>('');
  const [reviewFilterTrack, setReviewFilterTrack] = useState<'all' | 'literacy' | 'design'>('all');
  const [reviewFilterRating, setReviewFilterRating] = useState<string>('all');
  const [reviewFilterStudent, setReviewFilterStudent] = useState<string>('all');

  // Modals / Forms
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Student Form State
  const [newFullName, setNewFullName] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newGradeClass, setNewGradeClass] = useState('5-A sinf');
  const [newEnrolledTrack, setNewEnrolledTrack] = useState<'literacy' | 'design' | 'both'>('both');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Grading Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [gradingTrack, setGradingTrack] = useState<'literacy' | 'design'>('literacy');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [scoreValue, setScoreValue] = useState<number>(95);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Load initial data
  const refreshData = () => {
    const loadedStudents = getStoredStudents();
    const loadedGrades = getStoredGrades();
    const loadedRatings = getStoredRatings();
    setStudents(loadedStudents);
    setGrades(loadedGrades);
    setRatings(loadedRatings);
    if (loadedStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(loadedStudents[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const handleRatingsUpdate = () => {
      setRatings(getStoredRatings());
    };
    const handleGradesUpdate = () => {
      setGrades(getStoredGrades());
    };
    window.addEventListener('lesson_ratings_updated', handleRatingsUpdate);
    window.addEventListener('grades_updated', handleGradesUpdate);
    return () => {
      window.removeEventListener('lesson_ratings_updated', handleRatingsUpdate);
      window.removeEventListener('grades_updated', handleGradesUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-generate login from name
  const handleAutoGenerateLogin = () => {
    if (!newFullName.trim()) {
      setNewLogin(`oquvchi_${Math.floor(100 + Math.random() * 900)}`);
      return;
    }
    const clean = newFullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 10);
    const suffix = new Date().getFullYear();
    setNewLogin(`${clean || 'oquvchi'}_${suffix}`);
  };

  // Auto-generate easy memorable password
  const handleAutoGeneratePassword = () => {
    const words = ['savod', 'talim', 'dizayn', 'kod', 'dars', 'kelajak'];
    const chosen = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setNewPassword(`${chosen}${num}`);
  };

  // Handle Create / Edit Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newFullName.trim() || !newLogin.trim() || !newPassword.trim()) {
      setFormError('Iltimos, o\'quvchi ismi, logini va parolini to\'ldiring!');
      return;
    }

    if (editingStudentId) {
      updateStudent(editingStudentId, {
        fullName: newFullName.trim(),
        login: newLogin.trim().toLowerCase(),
        password: newPassword.trim(),
        gradeClass: newGradeClass.trim(),
        enrolledTrack: newEnrolledTrack,
        phone: newPhone.trim(),
        notes: newNotes.trim(),
      });
      showToast("O'quvchi ma'lumotlari yangilandi!");
    } else {
      // Check login uniqueness
      const existing = students.find(s => s.login.toLowerCase() === newLogin.trim().toLowerCase());
      if (existing) {
        setFormError('Ushbu login band! Iltimos, boshqa login tanlang yoki generatsiya qiling.');
        return;
      }

      addStudent({
        fullName: newFullName,
        login: newLogin,
        password: newPassword,
        gradeClass: newGradeClass,
        enrolledTrack: newEnrolledTrack,
        phone: newPhone,
        notes: newNotes,
      });
      showToast("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
    }

    refreshData();
    setIsAddStudentOpen(false);
    resetStudentForm();
  };

  const resetStudentForm = () => {
    setEditingStudentId(null);
    setNewFullName('');
    setNewLogin('');
    setNewPassword('');
    setNewGradeClass('5-A sinf');
    setNewEnrolledTrack('both');
    setNewPhone('');
    setNewNotes('');
    setFormError('');
  };

  const startEditStudent = (student: StudentAccount) => {
    setEditingStudentId(student.id);
    setNewFullName(student.fullName);
    setNewLogin(student.login);
    setNewPassword(student.password);
    setNewGradeClass(student.gradeClass);
    setNewEnrolledTrack(student.enrolledTrack);
    setNewPhone(student.phone || '');
    setNewNotes(student.notes || '');
    setFormError('');
    setIsAddStudentOpen(true);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Rostdan ham ${name} o'quvchisini va uning barcha baholarini o'chirmoqchimisiz?`)) {
      deleteStudent(id);
      refreshData();
      showToast(`${name} o'chirildi.`);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyStudentCredentials = (student: StudentAccount) => {
    const text = `Salom ${student.fullName}!\nSizning IT Ta'lim Portaliga kirish ma'lumotlaringiz:\nLogin: ${student.login}\nParol: ${student.password}\nSinf: ${student.gradeClass}`;
    navigator.clipboard.writeText(text);
    setCopiedId(student.id);
    showToast(`${student.fullName} uchun login & parol nusxalandi!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const copyAllStudentsCredentials = () => {
    if (students.length === 0) return;
    const header = `🎓 IT SAVODXONLIK VA GRAFIK DIZAYN MAKTABI\nO'quvchilar ro'yxati va kirish ma'lumotlari:\n----------------------------------------\n`;
    const list = students.map((s, idx) => `${idx + 1}. ${s.fullName}\n   Login: ${s.login}\n   Parol: ${s.password}\n   Sinf: ${s.gradeClass}\n`).join('\n');
    navigator.clipboard.writeText(header + list);
    showToast("Barcha o'quvchilar login va parollari nusxalandi!");
  };

  // Lesson list for grading
  const literacyLessons = UNIFIED_CURRICULUM.flatMap(m => m.weeks.flatMap(w => w.lessons));
  const designLessons = DESIGN_CURRICULUM.flatMap(m => m.lessons);

  // Submit Grade
  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      alert("Iltimos, o'quvchini tanlang!");
      return;
    }

    let lessonTitle = `Dars #${selectedLessonId}`;
    if (gradingTrack === 'literacy') {
      const found = literacyLessons.find(l => l.id === selectedLessonId);
      if (found) lessonTitle = found.title;
    } else {
      const found = designLessons.find(l => l.id === selectedLessonId);
      if (found) lessonTitle = found.title;
    }

    addOrUpdateGrade({
      studentId: student.id,
      studentName: student.fullName,
      track: gradingTrack,
      lessonId: selectedLessonId,
      lessonTitle,
      score: scoreValue,
      maxScore: 100,
      feedback: feedbackText || "Dars muvaffaqiyatli topshirildi va baholandi.",
      teacherName,
    });

    refreshData();
    setGradeSuccess(true);
    showToast(`${student.fullName}ga ${scoreValue} ball muvaffaqiyatli qo'yildi!`);
    setTimeout(() => setGradeSuccess(false), 3000);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.login.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.gradeClass.toLowerCase().includes(studentSearch.toLowerCase());
    
    const matchesTrack = 
      filterTrack === 'all' || 
      s.enrolledTrack === 'both' || 
      s.enrolledTrack === filterTrack;

    return matchesSearch && matchesTrack;
  });

  // Filter grades
  const filteredGrades = grades.filter(g => {
    if (gradeFilterStudent !== 'all' && g.studentId !== gradeFilterStudent) return false;
    return true;
  });

  // Calculate student specific stats
  const getStudentStats = (studentId: string) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return { count: 0, avg: 0 };
    const total = studentGrades.reduce((sum, g) => sum + g.score, 0);
    return {
      count: studentGrades.length,
      avg: Math.round(total / studentGrades.length),
    };
  };

  // Reviews analytics & filtering
  const averageLessonRating = useMemo(() => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  }, [ratings]);

  const fiveStarRatingsCount = useMemo(() => {
    return ratings.filter((r) => r.rating === 5).length;
  }, [ratings]);

  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      if (reviewFilterTrack !== 'all' && r.track !== reviewFilterTrack) return false;
      if (reviewFilterRating !== 'all') {
        const starNum = parseInt(reviewFilterRating, 10);
        if (starNum === 1 && r.rating > 2) return false;
        else if (starNum > 1 && r.rating !== starNum) return false;
      }
      if (reviewFilterStudent !== 'all') {
        if (r.studentId !== reviewFilterStudent && r.studentLogin !== reviewFilterStudent) return false;
      }
      if (reviewSearch.trim()) {
        const q = reviewSearch.toLowerCase().trim();
        const matchesComment = r.comment.toLowerCase().includes(q);
        const matchesStudent = r.studentName.toLowerCase().includes(q);
        const matchesLesson = r.lessonTitle.toLowerCase().includes(q);
        if (!matchesComment && !matchesStudent && !matchesLesson) return false;
      }
      return true;
    });
  }, [ratings, reviewFilterTrack, reviewFilterRating, reviewFilterStudent, reviewSearch]);

  const totalLiteracyLessons = literacyLessons.length;
  const totalDesignLessons = designLessons.length;

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C3E2D] dark:bg-[#1C2C1D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#8BA88E]/40 flex items-center gap-3 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#8BA88E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Teacher Welcome Header */}
      <div className="bg-[#2C3E2D] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg border border-[#8BA88E]/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#8BA88E] text-xs font-bold mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>O'qituvchi Boshqaruv Markazi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight">
            {teacherName ? `Salom, ${teacherName}!` : 'O\'qituvchi Kabineti'}
          </h2>
          <p className="text-xs md:text-sm text-[#8BA88E] mt-2 leading-relaxed">
            O'quvchilarga login va parol bering, darslar yakunida o'quvchilar qoldirgan baho va fikrlarni kuzating hamda ularni baholab boring.
          </p>

          {/* Teacher Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/70 uppercase font-bold block">O'quvchilar</span>
              <span className="text-xl md:text-2xl font-serif italic text-white font-bold mt-0.5 block">
                {students.length} nafar
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/70 uppercase font-bold block">Qo'yilgan Ballar</span>
              <span className="text-xl md:text-2xl font-serif italic text-[#8BA88E] font-bold mt-0.5 block">
                {grades.length} ta
              </span>
            </div>
            <div 
              onClick={() => setActiveSubTab('reviews')}
              className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-400/30 cursor-pointer hover:bg-white/15 transition group"
              title="O'quvchilar darslarga bergan baholari va fikrlari"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-200 uppercase font-bold block">O'quvchilar Bahosi</span>
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </div>
              <span className="text-xl md:text-2xl font-serif italic text-amber-300 font-bold mt-0.5 block">
                {averageLessonRating > 0 ? `${averageLessonRating} / 5` : "0.0"}
                <span className="text-xs font-normal text-white/80 ml-1.5 font-sans">({ratings.length} fikr)</span>
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/70 uppercase font-bold block">Jami Darslar</span>
              <span className="text-xl md:text-2xl font-serif italic text-[#8BA88E] font-bold mt-0.5 block">
                {totalLiteracyLessons + totalDesignLessons} ta
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <BarChart3 className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* NAVIGATION TABS FOR TEACHER CABINET */}
      <div className="flex flex-wrap items-center gap-2 bg-[#F5F5F0] dark:bg-[#111912] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>O'quvchilar & Login/Parol</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('grading')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'grading'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Ustoz Baholash Jurnali</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
            {grades.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'reviews'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>O'quvchilar Baholari & Fikrlari</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
            {ratings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Reyting Jadvali</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/25 text-amber-300 dark:text-amber-200 font-bold">
            Leaderboard
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'schedule'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Dars Jadvali & Kalendar</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400/20 text-emerald-300 dark:text-emerald-200 font-bold">
            3 guruh
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('courses')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'courses'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Barcha Kurslar va Silabus</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: STUDENTS MANAGEMENT & CREDENTIALS (LOGIN / PAROL BERISH) */}
      {/* ========================================================================= */}
      {activeSubTab === 'students' && (
        <div className="flex flex-col gap-6">
          {/* Top Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#8BA88E]" />
                O'quvchilar va Kirish Ma'lumotlari (Login & Parol)
              </h3>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                Har bir o'quvchiga login va maxfiy parol yarating, ularga topshiring yoki nusxalab Telegram orqali yuboring.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {students.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Barcha o'quvchilar va ularning ballarini tozalashni tasdiqlaysizmi?")) {
                      clearAllStudents();
                      refreshData();
                      showToast("Barcha o'quvchilar ro'yxati tozalandi.");
                    }
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/50 shrink-0"
                  title="Barcha o'quvchilarni tozalash"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Barchasini tozalash</span>
                </button>
              )}

              {students.length > 0 && (
                <button
                  onClick={copyAllStudentsCredentials}
                  className="px-3.5 py-2.5 bg-[#8BA88E]/20 dark:bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#A7C2AA] hover:bg-[#8BA88E]/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#8BA88E]/40 shrink-0"
                  title="Barcha o'quvchilar ro'yxati va parollarini nusxalash"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Ro'yxatni nusxalash</span>
                </button>
              )}

              <button
                onClick={() => {
                  resetStudentForm();
                  handleAutoGenerateLogin();
                  handleAutoGeneratePassword();
                  setIsAddStudentOpen(true);
                }}
                className="px-5 py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Yangi O'quvchi Qo'shish</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="O'quvchi ismi, logini yoki sinfi bo'yicha qidirish..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] shrink-0" />
              <select
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
              >
                <option value="all">Barcha yo'nalishlar</option>
                <option value="literacy">Faqat Kompyuter Savodxonligi</option>
                <option value="design">Faqat Grafik Dizayn</option>
              </select>
            </div>
          </div>

          {/* Students List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => {
              const stats = getStudentStats(student.id);
              const isPasswordVisible = visiblePasswords[student.id];
              const isCopied = copiedId === student.id;

              return (
                <div
                  key={student.id}
                  className="bg-white dark:bg-[#152017] rounded-2xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  {/* Student Top info */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        onClick={() => setProfileViewingStudent(student)}
                        className="flex items-center gap-3 cursor-pointer group/st hover:opacity-90"
                        title="O'quvchining individual profilini ochish"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center font-bold text-sm group-hover/st:scale-105 transition-transform">
                          {student.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7] group-hover/st:text-[#2C3E2D] dark:group-hover/st:text-[#8BA88E] flex items-center gap-1.5">
                            {student.fullName}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/st:opacity-100 transition-opacity" />
                          </h4>
                          <span className="inline-block text-[10px] font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#8BA88E]/15 px-2 py-0.5 rounded-md mt-0.5">
                            {student.gradeClass}
                          </span>
                        </div>
                      </div>

                      {/* Course badge */}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#EBE7DF] dark:border-[#283A2C] bg-[#FAF8F5] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#D4DFD6]">
                        {student.enrolledTrack === 'both' ? 'IT & Dizayn' : student.enrolledTrack === 'design' ? 'Grafik Dizayn' : 'Savodxonlik'}
                      </span>
                    </div>

                    {/* Login & Password Credentials Box */}
                    <div className="mt-4 p-3.5 bg-[#FAF8F5] dark:bg-[#111A13] rounded-xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#828282] dark:text-[#9FB1A2] font-semibold text-[11px] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#8BA88E]" />
                          Login:
                        </span>
                        <code className="font-mono font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-white dark:bg-[#18241B] px-2 py-0.5 rounded border border-[#EBE7DF] dark:border-[#293B2D]">
                          {student.login}
                        </code>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#828282] dark:text-[#9FB1A2] font-semibold text-[11px] flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                          Parol:
                        </span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-[#2D2D2D] dark:text-[#E6EAE7] bg-white dark:bg-[#18241B] px-2 py-0.5 rounded border border-[#EBE7DF] dark:border-[#293B2D]">
                            {isPasswordVisible ? student.password : '••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(student.id)}
                            className="text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white p-1"
                            title={isPasswordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Student notes or phone if any */}
                    {student.notes && (
                      <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] italic mt-2.5 px-1 truncate">
                        "{student.notes}"
                      </p>
                    )}
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="pt-3 border-t border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-[#828282] dark:text-[#9FB1A2]">
                        Baholar: <strong className="text-[#2C3E2D] dark:text-[#E6EAE7]">{stats.count} ta</strong>
                      </span>
                      {stats.count > 0 && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          O'rtacha: {stats.avg} ball
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <button
                        onClick={() => setProfileViewingStudent(student)}
                        className="px-2.5 py-2 bg-[#8BA88E]/20 hover:bg-[#8BA88E]/30 text-[#2C3E2D] dark:text-[#E6EAE7] rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        title="O'quvchi individual profilini ochish"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-[#2C3E2D] dark:text-[#8BA88E]" />
                        <span>Profil</span>
                      </button>

                      <button
                        onClick={() => copyStudentCredentials(student)}
                        className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F5F5F0] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#D4DFD6] hover:bg-[#EBE7DF] dark:hover:bg-[#253629]'
                        }`}
                        title="Login va parolni nusxalash"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isCopied ? 'Nusxalandi' : 'Nusxalash'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setActiveSubTab('grading');
                        }}
                        className="px-2.5 py-2 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Ball qo'yish"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Ball</span>
                      </button>

                      <button
                        onClick={() => startEditStudent(student)}
                        className="p-2 text-[#828282] hover:text-[#2C3E2D] dark:hover:text-white transition"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(student.id, student.fullName)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="md:col-span-2 py-16 text-center bg-white dark:bg-[#152017] rounded-3xl border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                <Users className="w-10 h-10 text-[#8BA88E]/50 mx-auto mb-3" />
                <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                  {students.length === 0 ? "Hozircha birorta o'quvchi mavjud emas" : "Qidiruv bo'yicha o'quvchi topilmadi"}
                </h5>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-sm mx-auto">
                  {students.length === 0 
                    ? "Barcha demo akkauntlar olib tashlandi. '+ Yangi O'quvchi Qo'shish' tugmasi orqali o'quvchilarga login va parol berishingiz mumkin."
                    : "Qidiruv so'zini o'zgartirib ko'ring."}
                </p>
                {students.length === 0 && (
                  <button
                    onClick={() => {
                      resetStudentForm();
                      handleAutoGenerateLogin();
                      handleAutoGeneratePassword();
                      setIsAddStudentOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-[#2C3E2D] dark:bg-[#344E37] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Yangi O'quvchi Qo'shish</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: GRADING & SCORES JOURNAL (HAR BIR DARSGA BALL BERISH) */}
      {/* ========================================================================= */}
      {activeSubTab === 'grading' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: GRADING FORM (Ball berish shakli) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif italic text-lg font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Dars Bo'yicha Ball Qo'yish
                </h3>
                <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">
                  100 Ballik Shkala
                </span>
              </div>

              <form onSubmit={handleSubmitGrade} className="flex flex-col gap-4">
                {/* Step 1: Select Student */}
                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    1. O'quvchini tanlang:
                  </label>
                  {students.length === 0 ? (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                      O'quvchilar ro'yxati bo'sh. Ball qo'yishdan oldin o'quvchi qo'shishingiz lozim.
                    </div>
                  ) : (
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.gradeClass}) - Login: {s.login}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Step 2: Select Course Track */}
                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    2. Ta'lim yo'nalishi:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGradingTrack('literacy');
                        setSelectedLessonId(1);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        gradingTrack === 'literacy'
                          ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                          : 'bg-[#FAF8F5] dark:bg-[#111A13] text-[#828282] dark:text-[#9FB1A2] border border-[#EBE7DF] dark:border-[#243326]'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Kompyuter Savodxonligi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGradingTrack('design');
                        setSelectedLessonId(101);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        gradingTrack === 'design'
                          ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
                          : 'bg-[#FAF8F5] dark:bg-[#111A13] text-[#828282] dark:text-[#9FB1A2] border border-[#EBE7DF] dark:border-[#243326]'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      Grafik Dizayn
                    </button>
                  </div>
                </div>

                {/* Step 3: Select Lesson */}
                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    3. Qaysi dars baholanmoqda?
                  </label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  >
                    {gradingTrack === 'literacy'
                      ? literacyLessons.map((l) => (
                          <option key={l.id} value={l.id}>
                            Dars #{l.id}: {l.title}
                          </option>
                        ))
                      : designLessons.map((l) => (
                          <option key={l.id} value={l.id}>
                            Dars #{l.id}: {l.title}
                          </option>
                        ))}
                  </select>
                </div>

                {/* Step 4: Score Input & Preset Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                      4. Baho / Ball:
                    </label>
                    <span className="text-sm font-serif italic font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                      {scoreValue} / 100 ball
                    </span>
                  </div>

                  {/* Range slider */}
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="1"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(Number(e.target.value))}
                    className="w-full accent-[#2C3E2D] dark:accent-[#8BA88E] cursor-pointer mb-2"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { val: 100, label: "100 (A'lo)" },
                      { val: 90, label: "90 (A'lo)" },
                      { val: 80, label: "80 (Yaxshi)" },
                      { val: 70, label: "70 (Qoniq.)" },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setScoreValue(p.val)}
                        className={`py-1.5 text-[10px] font-bold rounded-lg border transition ${
                          scoreValue === p.val
                            ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white border-[#2C3E2D]'
                            : 'bg-[#FAF8F5] dark:bg-[#111A13] text-[#828282] dark:text-[#9FB1A2] border-[#EBE7DF] dark:border-[#243326]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 5: Teacher Feedback / Comment */}
                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    5. O'qituvchi izohi va tavsiyalari:
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Masalan: Uyga vazifa to'liq va vaqtida bajarildi. Klaviaturada mashq qilish testi a'lo topshirildi."
                    className="w-full p-3 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E]"
                  />
                  {/* Quick comment suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "A'lo natija, mashq to'liq bajarildi!",
                      "Yaxshi o'zlashtirgan, faol qatnashdi.",
                      "Amaliy vazifani takrorlash tavsiya etiladi.",
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFeedbackText(sug)}
                        className="text-[10px] text-[#828282] dark:text-[#9FB1A2] hover:text-[#2C3E2D] dark:hover:text-[#E6EAE7] bg-[#F5F5F0] dark:bg-[#111A13] px-2 py-0.5 rounded border border-[#EBE7DF] dark:border-[#243326]"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={students.length === 0}
                  className="w-full py-3 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <Send className="w-4 h-4 text-[#8BA88E]" />
                  <span>Ballni Tasdiqlash va Saqlash</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: JOURNAL OF GIVEN GRADES (Qo'yilgan baholar ro'yxati) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif italic text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Baholash Jurnali (Barcha qo'yilgan ballar)
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                  O'quvchilar ushbu ballarni o'z kabinetida real vaqtda ko'rib boradi
                </p>
              </div>

              <div className="flex items-center gap-2">
                {grades.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Haqiqatan ham barcha o'quvchilarning baholarini butunlay tozalamoqchimisiz?")) {
                        clearAllGrades();
                        refreshData();
                        showToast("Barcha o'quvchilarning baholari muvaffaqiyatli tozalandi.");
                      }
                    }}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-900/50 shrink-0"
                    title="Jurnaldagi barcha baholarni tozalash"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Baholarni tozalash</span>
                  </button>
                )}

                {/* Filter by student */}
                <select
                  value={gradeFilterStudent}
                  onChange={(e) => setGradeFilterStudent(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                >
                  <option value="all">Barcha o'quvchilar</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grades Cards list */}
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="bg-white dark:bg-[#152017] rounded-2xl p-4 border border-[#EBE7DF] dark:border-[#243326] shadow-sm hover:border-[#8BA88E] transition flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#1A2E1C] dark:text-[#E6EAE7]">
                          {grade.studentName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#EBE7DF] dark:border-[#283A2C] bg-[#FAF8F5] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#D4DFD6]">
                          {grade.track === 'literacy' ? 'Kompyuter Savodxonligi' : 'Grafik Dizayn'}
                        </span>
                        <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8BA88E]" />
                          {new Date(grade.gradedAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>

                      <h5 className="font-semibold text-xs text-[#2D2D2D] dark:text-[#E6EAE7] mt-1">
                        Dars #{grade.lessonId}: {grade.lessonTitle}
                      </h5>
                    </div>

                    {/* Score badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-serif italic font-bold ${
                        grade.score >= 86 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : grade.score >= 70
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                      }`}>
                        {grade.score} ball ({grade.gradeBadge})
                      </span>

                      <button
                        onClick={() => {
                          if (confirm("Ushbu bahoni jurnaldan o'chirmoqchimisiz?")) {
                            deleteGrade(grade.id);
                            refreshData();
                            showToast("Baho o'chirildi.");
                          }
                        }}
                        className="text-[#828282] hover:text-red-600 p-1"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Feedback text */}
                  {grade.feedback && (
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#C5D0C7] flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8BA88E] shrink-0 mt-0.5" />
                      <p className="italic text-[11px] leading-relaxed">
                        <strong>Ustoz izohi:</strong> "{grade.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {filteredGrades.length === 0 && (
                <div className="py-16 text-center bg-white dark:bg-[#152017] rounded-2xl border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                  <Award className="w-8 h-8 text-[#8BA88E]/40 mx-auto mb-2" />
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold">
                    Hozircha baholar qo'yilmagan.
                  </p>
                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                    Chap tarafdagi shakl orqali o'quvchini tanlab ilk ballni bering.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: STUDENT REVIEWS & LESSON RATINGS (O'QUVCHILARNING DARSLARGA BERGAN BAHOLARI) */}
      {/* ========================================================================= */}
      {activeSubTab === 'reviews' && (
        <div className="flex flex-col gap-6">
          {/* Top Title & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-400/25 mb-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>O'quvchilar Fikr-Mulohazalari va Dars Baholari</span>
              </div>
              <h3 className="text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                Darslar Yakunida O'quvchilar Bergan 1-5 Yulduzli Baholar
              </h3>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                O'quvchilar har bir darsni qanday o'zlashtirgani, qaysi mavzular eng ko'p yoqqani va ularning qisqa taassurotlarini kuzatib boring.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {ratings.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Haqiqatan ham barcha o'quvchilar qoldirgan dars baholari va sharhlarini butunlay tozalamoqchimisiz?")) {
                      clearAllRatings();
                      setRatings([]);
                      showToast("Barcha dars baholari va sharhlari muvaffaqiyatli tozalandi.");
                    }
                  }}
                  className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-900/50 shrink-0"
                  title="Barcha dars baholari va sharhlarini tozalash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Baholarni tozalash</span>
                </button>
              )}

              <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA] bg-[#FAF8F5] dark:bg-[#162217] px-3.5 py-2 rounded-xl border border-[#EBE7DF] dark:border-[#273729]">
                Jami: <strong>{ratings.length} ta</strong> fikr
              </span>
            </div>
          </div>

          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Average Rating */}
            <div className="bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">
                  O'rtacha Dars Bahosi
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    {averageLessonRating > 0 ? averageLessonRating : "0.0"}
                  </span>
                  <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">/ 5.0</span>
                </div>
                <div className="flex items-center text-amber-400 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(averageLessonRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Card 2: 5-Star Ratio */}
            <div className="bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">
                  A'lo (5 Yulduz) Baholar
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif italic font-bold text-emerald-600 dark:text-emerald-400">
                    {fiveStarRatingsCount} ta
                  </span>
                  <span className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                    ({ratings.length > 0 ? Math.round((fiveStarRatingsCount / ratings.length) * 100) : 0}%)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                  Darslar yuqori qiziqishda
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Total reviews count */}
            <div className="bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">
                  Jami O'quvchi Fikrlari
                </span>
                <span className="text-2xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mt-1 block">
                  {ratings.length} ta sharh
                </span>
                <span className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-1 block">
                  2 ta ta'lim kursi bo'yicha
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Active students involved */}
            <div className="bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">
                  Fikr Bildirgan O'quvchilar
                </span>
                <span className="text-2xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mt-1 block">
                  {new Set(ratings.map(r => r.studentId || r.studentName)).size} nafar
                </span>
                <span className="text-[11px] text-[#8BA88E] font-semibold mt-1 block">
                  Faol o'quvchilar qatlami
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-[#152017] p-4 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                placeholder="Fikr matni, o'quvchi ismi yoki dars bo'yicha..."
                className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#253528] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] focus:outline-none focus:border-[#8BA88E]"
              />
            </div>

            {/* Track filter */}
            <div className="md:col-span-3">
              <select
                value={reviewFilterTrack}
                onChange={(e) => setReviewFilterTrack(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#253528] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
              >
                <option value="all">Barcha Kurslar</option>
                <option value="literacy">💻 Kompyuter Savodxonligi</option>
                <option value="design">🎨 Grafik Dizayn</option>
              </select>
            </div>

            {/* Rating Stars filter */}
            <div className="md:col-span-2">
              <select
                value={reviewFilterRating}
                onChange={(e) => setReviewFilterRating(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#253528] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
              >
                <option value="all">Barcha Yulduzlar</option>
                <option value="5">⭐⭐⭐⭐⭐ A'lo (5)</option>
                <option value="4">⭐⭐⭐⭐ Yaxshi (4)</option>
                <option value="3">⭐⭐⭐ O'rtacha (3)</option>
                <option value="1">⭐ Qoniqarsiz (1-2)</option>
              </select>
            </div>

            {/* Student filter */}
            <div className="md:col-span-3">
              <select
                value={reviewFilterStudent}
                onChange={(e) => setReviewFilterStudent(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#253528] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
              >
                <option value="all">Barcha O'quvchilar</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.gradeClass})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#828282] dark:text-[#9FB1A2] px-1">
              <span>Saralangan natijalar: {filteredRatings.length} ta fikr</span>
              {(reviewSearch || reviewFilterTrack !== 'all' || reviewFilterRating !== 'all' || reviewFilterStudent !== 'all') && (
                <button
                  onClick={() => {
                    setReviewSearch('');
                    setReviewFilterTrack('all');
                    setReviewFilterRating('all');
                    setReviewFilterStudent('all');
                  }}
                  className="text-[#8BA88E] hover:underline"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRatings.map((item) => {
                const matchedStudent = students.find(
                  (s) => s.id === item.studentId || (item.studentLogin && s.login === item.studentLogin)
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#152017] rounded-3xl p-5 sm:p-6 border border-[#EBE7DF] dark:border-[#243326] hover:border-[#8BA88E]/40 shadow-sm transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      {/* Top Row: Student info & Stars */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EBE7DF] dark:border-[#223024]">
                        <div 
                          onClick={() => {
                            if (matchedStudent) {
                              setProfileViewingStudent(matchedStudent);
                            }
                          }}
                          className={`flex items-center gap-3 ${matchedStudent ? 'cursor-pointer group-hover:opacity-90' : ''}`}
                        >
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2C3E2D] to-[#446046] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {item.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-[#1A2E1C] dark:text-[#E6EAE7] hover:text-[#8BA88E] transition">
                                {item.studentName}
                              </h4>
                              {item.studentGradeClass && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#1C2B1F] text-[#828282] dark:text-[#9FB1A2] border border-[#EBE7DF] dark:border-[#283C2C]">
                                  {item.studentGradeClass}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-[#8BA88E]" />
                              {new Date(item.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= item.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200 dark:text-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {item.rating === 5 ? "A'lo (5 yulduz)" : item.rating === 4 ? "Yaxshi (4 yulduz)" : item.rating === 3 ? "O'rtacha (3 yulduz)" : `${item.rating} yulduz`}
                          </span>
                        </div>
                      </div>

                      {/* Lesson Details Tag */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            item.track === 'design'
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {item.track === 'design' ? '🎨 Dizayn' : '💻 Savodxonlik'}
                          </span>
                          <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#D4DFD6] truncate" title={item.lessonTitle}>
                            #{item.lessonId} — {item.lessonTitle}
                          </span>
                        </div>
                      </div>

                      {/* Comment body */}
                      <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121B14] border border-[#EBE7DF] dark:border-[#223125] text-xs text-[#2D2D2D] dark:text-[#E6EAE7] leading-relaxed italic shadow-inner">
                        "{item.comment}"
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#EBE7DF] dark:border-[#223024] text-[11px]">
                      {matchedStudent ? (
                        <button
                          onClick={() => setProfileViewingStudent(matchedStudent)}
                          className="px-3 py-1.5 rounded-xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#A7C2AA] hover:bg-[#2C3E2D] hover:text-white dark:hover:bg-[#344E37] font-bold transition flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>O'quvchi Profilini Ochish</span>
                        </button>
                      ) : (
                        <span className="text-[#828282] dark:text-[#9FB1A2] italic text-[10px]">Mehmon o'quvchi</span>
                      )}

                      <div className="flex items-center gap-2">
                        {onSelectStudentLesson && (
                          <button
                            onClick={() => onSelectStudentLesson(item.track, item.lessonId)}
                            className="p-1.5 rounded-lg text-[#828282] hover:text-[#2C3E2D] dark:hover:text-[#A7C2AA] transition"
                            title="Darsga o'tish"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Ushbu fikrni o'chirishni tasdiqlaysizmi?`)) {
                              deleteRating(item.id);
                              refreshData();
                              showToast("O'quvchi fikri o'chirildi.");
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition"
                          title="Fikrni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRatings.length === 0 && (
              <div className="py-16 text-center bg-white dark:bg-[#152017] rounded-3xl border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                <Star className="w-10 h-10 text-amber-400/40 mx-auto mb-2" />
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold">
                  Tanlangan parametrlar bo'yicha o'quvchi fikrlari topilmadi.
                </p>
                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-1">
                  O'quvchilar darslarni yakunlaganda yulduzcha va sharh qoldirishadi va ular shu yerda aks etadi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: STUDENT LEADERBOARD & REYTING JADVALI */}
      {/* ========================================================================= */}
      {activeSubTab === 'leaderboard' && (
        <div className="flex flex-col gap-6">
          <StudentLeaderboard
            onSelectStudent={(student) => setProfileViewingStudent(student)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: LESSON SCHEDULE & CALENDAR (DARS JADVALI VA KALENDAR) */}
      {/* ========================================================================= */}
      {activeSubTab === 'schedule' && (
        <div className="flex flex-col gap-6">
          <LessonScheduleCalendar
            appUser={{
              role: 'teacher',
              name: teacherName || 'Assadxoja',
              email: 'assadxoja@school.uz',
              uid: 'teacher_assadxoja',
              selectedTrack: null
            }}
            onSelectStudent={(studentName) => {
              const found = students.find(
                s => s.fullName.toLowerCase().includes(studentName.toLowerCase()) ||
                     studentName.toLowerCase().includes(s.fullName.toLowerCase()) ||
                     s.login.toLowerCase() === studentName.toLowerCase()
              );
              if (found) {
                setProfileViewingStudent(found);
              }
            }}
            onSelectTrackLesson={onSelectStudentLesson}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: ALL COURSES (HAMMA KURSLAR SILABUSI) */}
      {/* ========================================================================= */}
      {activeSubTab === 'courses' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                Barcha Mavjud Kurslar Ro'yxati
              </h3>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                Platformada o'qitilayotgan barcha ta'lim yo'nalishlari
              </p>
            </div>
            <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#8BA88E]/20 px-3 py-1 rounded-full">
              2 ta Faol Kurs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COURSE 1: KOMPYUTER SAVODXONLIGI */}
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-7 border-2 border-[#EBE7DF] dark:border-[#243326] hover:border-[#8BA88E] dark:hover:border-[#8BA88E] hover:shadow-xl transition-all flex flex-col justify-between group relative">
              <div className="absolute top-6 right-6">
                <span className="bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  1-4 & 5-9 Sinflar
                </span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F5F5F0] dark:bg-[#111912] text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center mb-5 group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors shadow-sm">
                  <Laptop className="w-7 h-7" />
                </div>

                <h4 className="text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mb-2 group-hover:text-[#2C3E2D] dark:group-hover:text-[#8BA88E]">
                  Kompyuter Savodxonligi Kursi
                </h4>

                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] leading-relaxed mb-5">
                  Yagona IT silabusi: kompyuter qurilmalari, Windows muhiti, klaviatura trenajyori, Word, Excel, PowerPoint, xavfsiz internet va dasturlashga ilk qadamlar.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 bg-[#FAF8F5] dark:bg-[#101712] rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Jami Darslar</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">{totalLiteracyLessons} ta dars</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">O'quv Davri</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">3 Oy (12 Hafta)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Metodika</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">Kichik & Katta</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Materiallar</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">PDF & O'yinlar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#EBE7DF] dark:border-[#243326]">
                <button
                  onClick={() => onNavigateToTrack('literacy')}
                  className="w-full py-3 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Kurs Darslarini Ko'rish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* COURSE 2: GRAFIK DIZAYN */}
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-7 border-2 border-[#EBE7DF] dark:border-[#243326] hover:border-[#8BA88E] dark:hover:border-[#8BA88E] hover:shadow-xl transition-all flex flex-col justify-between group relative">
              <div className="absolute top-6 right-6">
                <span className="bg-[#2C3E2D] dark:bg-[#344E37] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Zamonaviy Soha
                </span>
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F5F5F0] dark:bg-[#111912] text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center mb-5 group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors shadow-sm">
                  <Palette className="w-7 h-7" />
                </div>

                <h4 className="text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mb-2 group-hover:text-[#2C3E2D] dark:group-hover:text-[#8BA88E]">
                  Grafik Dizayn va Vizual San'at
                </h4>

                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] leading-relaxed mb-5">
                  Vizual kompozitsiya, ranglar nazariyasi, Canva, Adobe Photoshop, Figma, logotip yaratish va Behance platformasida shaxsiy portfolio to'plash kursi.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 bg-[#FAF8F5] dark:bg-[#101712] rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Darslar Soni</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">{totalDesignLessons} ta amaliy dars</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Asosiy Dasturlar</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">Canva, PS, Figma</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Yo'nalish</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">Vizual & UI/UX</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block">Yakuniy Mahsulot</span>
                    <span className="text-sm font-bold text-[#2C3E2D] dark:text-[#E6EAE7]">Portfolio Keysi</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#EBE7DF] dark:border-[#243326]">
                <button
                  onClick={() => onNavigateToTrack('design')}
                  className="w-full py-3 bg-[#8BA88E] hover:bg-[#739076] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Dizayn Kursini Ko'rish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STUDENT ACCOUNT */}
      {/* ========================================================================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#172219] rounded-3xl w-full max-w-lg shadow-2xl border border-[#EBE7DF] dark:border-[#243326] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#2C3E2D] dark:bg-[#131C14] text-white p-6 flex items-center justify-between border-b dark:border-[#243326]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8BA88E]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif italic font-bold">
                    {editingStudentId ? "O'quvchi Ma'lumotlarini Tahrirlash" : "Yangi O'quvchiga Login/Parol Berish"}
                  </h3>
                  <p className="text-xs text-[#8BA88E]">
                    O'quvchi ushbu login va parol bilan platformaga kiradi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddStudentOpen(false);
                  resetStudentForm();
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStudent} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                  O'quvchining To'liq Ism-Familiyasi *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Masalan: Azizbek Rahimov"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                />
              </div>

              {/* Login & Auto Gen */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                    Login (Foydalanuvchi nomi) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateLogin}
                    className="text-[10px] text-[#8BA88E] font-bold hover:underline"
                  >
                    ⚡ Avto Generatsiya
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newLogin}
                    onChange={(e) => setNewLogin(e.target.value)}
                    placeholder="Masalan: azizbek2026"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-mono text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  />
                </div>
              </div>

              {/* Password & Auto Gen */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                    Parol (Maxfiy kod) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePassword}
                    className="text-[10px] text-[#8BA88E] font-bold hover:underline"
                  >
                    ⚡ Oson Parol Yaratish
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masalan: savod123"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-mono text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                />
              </div>

              {/* Class and Enrolled Track */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    Sinfi / Guruhi
                  </label>
                  <input
                    type="text"
                    value={newGradeClass}
                    onChange={(e) => setNewGradeClass(e.target.value)}
                    placeholder="5-A sinf"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                    Biriktirilgan Kurs
                  </label>
                  <select
                    value={newEnrolledTrack}
                    onChange={(e) => setNewEnrolledTrack(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  >
                    <option value="both">Ikkala Kurs (IT & Dizayn)</option>
                    <option value="literacy">Kompyuter Savodxonligi</option>
                    <option value="design">Grafik Dizayn</option>
                  </select>
                </div>
              </div>

              {/* Phone or Parent Contact */}
              <div>
                <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                  Telefon raqam (O'quvchi yoki ota-onasi)
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                  Ustoz eslatmasi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Iqtidorli, klaviaturada mashq qilmoqda..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE7DF] dark:border-[#243326] mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddStudentOpen(false);
                    resetStudentForm();
                  }}
                  className="px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] hover:bg-[#F5F5F0] text-[#828282] dark:text-[#9FB1A2] rounded-xl text-xs font-bold transition"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {editingStudentId ? "Saqlash" : "O'quvchini Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Student Profile Modal View for Teacher */}
      {profileViewingStudent && (
        <StudentProfileView
          student={profileViewingStudent}
          isTeacherView={true}
          onClose={() => setProfileViewingStudent(null)}
          onOpenGrading={(studentId) => {
            setSelectedStudentId(studentId);
            setActiveSubTab('grading');
            setProfileViewingStudent(null);
          }}
          onSelectLesson={onSelectStudentLesson}
        />
      )}

    </div>
  );
};

