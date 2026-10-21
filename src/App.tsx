import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleAuthProvider } from './lib/firebase.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UNIFIED_CURRICULUM, 
  Month, 
  Week, 
  Lesson 
} from './data/curriculum.ts';
import StudentDashboard from './components/StudentDashboard.tsx';
import InteractiveGame from './components/InteractiveGame.tsx';
import { 
  Trophy, 
  Sparkles, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  LogOut, 
  LogIn, 
  Award, 
  Smile, 
  Compass, 
  FileText, 
  Save, 
  BookMarked, 
  Menu, 
  X,
  User as UserIcon,
  HelpCircle,
  Video,
  Play,
  Trash2,
  Edit2,
  Plus,
  ExternalLink,
  Zap,
  Users,
  Download,
  Search,
  Bot,
  Palette,
  GraduationCap,
  UserCheck,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Calendar
} from 'lucide-react';
import { exportLessonToPdf } from './utils/pdfExport.ts';
import { AiAssistant } from './components/AiAssistant.tsx';
import { LoginModal, AppUser } from './components/LoginModal.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { TrackSelectionModal, CourseTrack } from './components/TrackSelectionModal.tsx';
import { DesignCourseView } from './components/DesignCourseView.tsx';
import { TeacherDashboard } from './components/TeacherDashboard.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';
import LessonRatingFeedbackView from './components/LessonRatingFeedback.tsx';
import LessonScheduleCalendar from './components/LessonScheduleCalendar.tsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login & Track Selection Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isTrackSelectionOpen, setIsTrackSelectionOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<CourseTrack>('literacy'); // 'literacy' (Kompyuter savodxonligi) | 'design' (Grafik dizayn)
  const [designCompletedLessons, setDesignCompletedLessons] = useState<number[]>([]);

  // Layout states
  const [activeTab, setActiveTab] = useState<'curriculum' | 'dashboard' | 'teacher_overview'>('curriculum');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(1); // Default to Lesson 1
  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & AI Assistant States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Age Group Explanation Mode: 'kichik' (1-4 sinf) | 'katta' (5-9 sinf) | 'both' (Yonma-yon solishtirish)
  const [explanationMode, setExplanationMode] = useState<'kichik' | 'katta' | 'both'>('kichik');

  // User database states
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaveStatus, setNotesSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Video Lesson States
  const [customVideos, setCustomVideos] = useState<Record<string, string>>({});
  const [videoInputUrl, setVideoInputUrl] = useState<string>('');
  const [editingVideo, setEditingVideo] = useState<boolean>(false);

  // PDF Export State
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    const lesson = getSelectedLesson();
    if (!lesson) return;
    setExportingPdf(true);
    try {
      await exportLessonToPdf({
        lesson,
        studentNotes,
        studentName: currentUser?.displayName || undefined,
        explanationMode,
      });
    } catch (e) {
      console.error('PDF export error:', e);
      alert("PDF konspektini yuklashda xatolik yuz berdi.");
    } finally {
      setExportingPdf(false);
    }
  };

  // Trigger login listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        const token = await user.getIdToken();
        setUserToken(token);
        // Sync user progress & completed lessons list
        fetchProgress(token);

        // If no appUser set, sync from Google Auth as student
        setAppUser((prev) => {
          if (prev) return prev;
          const newAppUser: AppUser = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'O\'quvchi',
            email: user.email || '',
            role: 'student',
            selectedTrack: null,
            photoURL: user.photoURL || undefined,
          };
          localStorage.setItem('it_portal_user', JSON.stringify(newAppUser));
          setIsTrackSelectionOpen(true);
          return newAppUser;
        });
      } else {
        setCurrentUser(null);
        setUserToken(null);
        setCompletedLessonIds([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load custom video URLs and stored appUser from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('it_portal_user');
    if (savedUser) {
      try {
        const parsed: AppUser = JSON.parse(savedUser);
        if (parsed.role === 'teacher') {
          parsed.name = 'Assadxoja';
          parsed.email = 'Assadxoja';
          parsed.uid = 'teacher_assadxoja';
          localStorage.setItem('it_portal_user', JSON.stringify(parsed));
          setAppUser(parsed);
          setActiveTab('teacher_overview');
        } else if (parsed.role === 'student' && (parsed.uid === 'std_01' || parsed.email === 'azizbek2026' || parsed.uid === 'demo_student_1')) {
          localStorage.removeItem('it_portal_user');
          setAppUser(null);
        } else {
          setAppUser(parsed);
          if (parsed.selectedTrack) {
            setCurrentTrack(parsed.selectedTrack);
          }
        }
      } catch (e) {
        console.error('Error parsing stored app user:', e);
      }
    }

    const savedDesignProgress = localStorage.getItem('design_completed_lessons');
    if (savedDesignProgress) {
      try {
        setDesignCompletedLessons(JSON.parse(savedDesignProgress));
      } catch (e) {
        console.error('Error parsing design progress:', e);
      }
    }

    const stored = localStorage.getItem('teacher_videos');
    if (stored) {
      try {
        setCustomVideos(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored teacher videos:', e);
      }
    }
  }, []);

  const handleLoginSuccess = (user: AppUser) => {
    setAppUser(user);
    if (user.role === 'teacher') {
      setActiveTab('teacher_overview');
    } else {
      setActiveTab('curriculum');
      if (!user.selectedTrack) {
        setIsTrackSelectionOpen(true);
      } else {
        setCurrentTrack(user.selectedTrack);
      }
    }
  };

  const handleTrackSelect = (track: CourseTrack) => {
    setCurrentTrack(track);
    setIsTrackSelectionOpen(false);
    setActiveTab('curriculum');

    if (appUser) {
      const updated: AppUser = { ...appUser, selectedTrack: track };
      setAppUser(updated);
      localStorage.setItem('it_portal_user', JSON.stringify(updated));
    }
  };

  const handleToggleDesignLesson = (id: number) => {
    setDesignCompletedLessons((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('design_completed_lessons', JSON.stringify(updated));
      return updated;
    });
  };

  const getFilteredLessons = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const results: Array<{
      lesson: Lesson;
      monthNum: number;
      weekNum: number;
      weekTitle: string;
    }> = [];

    UNIFIED_CURRICULUM.forEach((month) => {
      month.weeks.forEach((week) => {
        week.lessons.forEach((lesson) => {
          const matches =
            lesson.id.toString().includes(query) ||
            lesson.title.toLowerCase().includes(query) ||
            lesson.commonTopic.toLowerCase().includes(query) ||
            lesson.kichik.topic.toLowerCase().includes(query) ||
            lesson.kichik.concept.toLowerCase().includes(query) ||
            lesson.katta.topic.toLowerCase().includes(query) ||
            lesson.katta.concept.toLowerCase().includes(query);

          if (matches) {
            results.push({
              lesson,
              monthNum: month.number,
              weekNum: week.number,
              weekTitle: week.title,
            });
          }
        });
      });
    });

    return results;
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    let videoId = '';
    try {
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        videoId = parts[1]?.split(/[?#]/)[0] || '';
      } else if (url.includes('youtube.com/watch')) {
        const parts = url.split('?')[1];
        const urlParams = new URLSearchParams(parts);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/v/')) {
        const parts = url.split('youtube.com/v/');
        videoId = parts[1]?.split(/[?#]/)[0] || '';
      }
    } catch (e) {
      console.error('Error parsing YouTube URL:', e);
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getVideoUrlForLesson = (lessonId: number): string => {
    const key = `lesson-${lessonId}`;
    if (customVideos[key]) return customVideos[key];
    
    // Default fallback videos
    if (lessonId === 1) return "https://www.youtube.com/embed/g_0F-fT9SgU"; // Kompyuter va arxitektura
    if (lessonId === 2) return "https://www.youtube.com/embed/R_O-H_zH4Dk"; // Hardware va qurilmalar
    if (lessonId === 3) return "https://www.youtube.com/embed/5TIn68S1pmo"; // Klaviatura va tezkor klavishlar
    if (lessonId === 5) return "https://www.youtube.com/embed/bSg1vKWhuW4"; // Grafik muhit va interfeys
    if (lessonId === 13) return "https://www.youtube.com/embed/MvYpZ4_D9oY"; // Word / Matn muharriri
    return "https://www.youtube.com/embed/g_0F-fT9SgU"; // Default educational video
  };

  const saveVideoUrl = (lessonId: number, url: string) => {
    const key = `lesson-${lessonId}`;
    const updated = { ...customVideos, [key]: url };
    setCustomVideos(updated);
    localStorage.setItem('teacher_videos', JSON.stringify(updated));
    setEditingVideo(false);
  };

  const deleteVideoUrl = (lessonId: number) => {
    const key = `lesson-${lessonId}`;
    const updated = { ...customVideos };
    delete updated[key];
    setCustomVideos(updated);
    localStorage.setItem('teacher_videos', JSON.stringify(updated));
    setVideoInputUrl('');
    setEditingVideo(false);
  };

  const fetchProgress = async (token: string) => {
    try {
      const res = await fetch('/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.progress) {
        const completes = data.progress.map((p: any) => p.lessonId);
        setCompletedLessonIds(completes);
      }
    } catch (e) {
      console.error('Error loading student progress:', e);
    }
  };

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (e) {
      console.error('Google Sign In failed:', e);
      alert('Tizimga kirishda xatolik yuz berdi. Iltimos, qayta urunib ko\'ring.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign Out failed:', e);
    }
    setAppUser(null);
    setCurrentUser(null);
    setUserToken(null);
    setCompletedLessonIds([]);
    localStorage.removeItem('it_portal_user');
    setActiveTab('curriculum');
  };

  // Toggle completion in DB
  const toggleLessonCompletion = async (lessonId: number) => {
    if (!userToken) return;
    try {
      const res = await fetch('/api/progress/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ section: 'unified', lessonId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh locally
        fetchProgress(userToken);
      }
    } catch (e) {
      console.error('Error toggling completion:', e);
    }
  };

  // Save notes in DB
  const saveNotes = async () => {
    if (!userToken || selectedLessonId === null) return;
    try {
      setNotesSaveStatus('saving');
      const res = await fetch('/api/progress/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          section: 'unified',
          lessonId: selectedLessonId,
          notes: studentNotes,
        }),
      });
      if (res.ok) {
        setNotesSaveStatus('saved');
        fetchProgress(userToken);
        setTimeout(() => setNotesSaveStatus('idle'), 2500);
      } else {
        setNotesSaveStatus('error');
      }
    } catch (e) {
      console.error('Failed to save lesson notes:', e);
      setNotesSaveStatus('error');
    }
  };

  // Select lesson and load notes
  const selectLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    if (activeTab !== 'curriculum') {
      setActiveTab('curriculum');
    }
    
    // Find if notes exist for this lesson
    setStudentNotes('');
    setNotesSaveStatus('idle');
    
    if (userToken) {
      fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${userToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.progress) {
            const found = data.progress.find(
              (p: any) => p.lessonId === lessonId
            );
            if (found && found.notes) {
              setStudentNotes(found.notes);
            }
          }
        })
        .catch(e => console.error('Error fetching lesson notes on select:', e));
    }
  };

  const getSelectedLesson = (): Lesson | null => {
    if (selectedLessonId === null) return null;
    for (const month of UNIFIED_CURRICULUM) {
      for (const week of month.weeks) {
        for (const lesson of week.lessons) {
          if (lesson.id === selectedLessonId) return lesson;
        }
      }
    }
    return null;
  };

  const isCompleted = (lessonId: number) => {
    return completedLessonIds.includes(lessonId);
  };

  // AGENT DIRECTIVE: Show LoginPage on entry if user is not logged in
  if (!appUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoogleLogin={handleLogin}
      />
    );
  }

  return (
    <div id="app" className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#0F1611] text-[#2D2D2D] dark:text-[#E6EAE7] transition-colors duration-200">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#141F16]/95 backdrop-blur-sm border-b border-[#EBE7DF] dark:border-[#243326] px-4 md:px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={() => {
            if (appUser?.role === 'teacher') {
              setActiveTab('teacher_overview');
            } else {
              setSelectedLessonId(1);
              setActiveTab('curriculum');
            }
          }}
        >
          <img
            src="/pwa-192x192.png"
            alt="SMART HIGH SCHOOL Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-[#8BA88E]/40"
          />
          <div>
            <h1 className="text-lg md:text-xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] tracking-tight">SMART HIGH SCHOOL</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8BA88E] font-bold tracking-wider uppercase">
                {appUser?.role === 'teacher' 
                  ? "O'qituvchi Markazi" 
                  : currentTrack === 'design' 
                    ? "🎨 Grafik Dizayn Bo'limi" 
                    : "💻 Kompyuter Savodxonligi (36 dars)"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Navigation / Track Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          {appUser?.role === 'teacher' ? (
            /* TEACHER NAVIGATION */
            <div className="flex items-center gap-1.5 bg-[#F5F5F0] dark:bg-[#1A261D] p-1 rounded-xl border border-[#EBE7DF] dark:border-[#283A2C]">
              <button
                onClick={() => setActiveTab('teacher_overview')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'teacher_overview'
                    ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                🏢 O'qituvchi Kabineti
              </button>
              <button
                onClick={() => { setCurrentTrack('literacy'); setActiveTab('curriculum'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'curriculum' && currentTrack === 'literacy'
                    ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                💻 Savodxonlik (36 dars)
              </button>
              <button
                onClick={() => { setCurrentTrack('design'); setActiveTab('curriculum'); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'curriculum' && currentTrack === 'design'
                    ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                🎨 Dizayn Kursi
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-[#203023] text-[#2D2D2D] dark:text-[#E6EAE7] border border-[#EBE7DF] dark:border-[#2F4433] shadow-sm'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-[#8BA88E]" />
                📊 Baholar Jurnali
              </button>
            </div>
          ) : (
            /* STUDENT NAVIGATION WITH TRACK SWITCHER */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F5F5F0] dark:bg-[#1A261D] p-1 rounded-xl border border-[#EBE7DF] dark:border-[#283A2C]">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'curriculum'
                      ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                      : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentTrack === 'design' ? '🎨 Dizayn Darslari' : '📚 36 ta Darslik'}
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-white dark:bg-[#203023] text-[#2D2D2D] dark:text-[#E6EAE7] border border-[#EBE7DF] dark:border-[#2F4433] shadow-sm'
                      : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-[#8BA88E]" />
                  📊 Kabinet & Natijalar
                </button>
              </div>

              {/* Student Track Switcher Button */}
              <button
                onClick={() => setIsTrackSelectionOpen(true)}
                className="px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#19241C] hover:bg-[#F5F5F0] dark:hover:bg-[#223326] border border-[#8BA88E]/40 dark:border-[#8BA88E]/30 text-[#2C3E2D] dark:text-[#CBE0CE] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="Boshqa kurs yoki bo'limga o'tish"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#8BA88E]" />
                <span>Bo'limni Almashtirish</span>
              </button>
            </div>
          )}
        </div>

        {/* User Auth controls & Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Schedule Calendar Modal Trigger */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1C281F] border border-[#8BA88E]/40 dark:border-[#8BA88E]/30 hover:bg-[#F5F5F0] dark:hover:bg-[#253528] text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] transition flex items-center gap-1.5 shadow-xs"
            title="Dars kunlari va soatlari kalendari"
          >
            <Calendar className="w-3.5 h-3.5 text-[#8BA88E]" />
            <span className="hidden sm:inline">Dars Jadvali</span>
          </button>

          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Global Dark Mode Switcher */}
          <ThemeToggle />

          {authLoading && !appUser ? (
            <div className="w-6 h-6 border-2 border-[#8BA88E] border-t-transparent rounded-full animate-spin" />
          ) : appUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{appUser.name}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full w-max ml-auto ${
                  appUser.role === 'teacher' ? 'bg-[#2C3E2D] text-white' : 'bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E]'
                }`}>
                  {appUser.role === 'teacher' ? "👨‍🏫 O'qituvchi" : "👨‍🎓 O'quvchi"}
                </span>
              </div>
              {appUser.photoURL ? (
                <img referrerPolicy="no-referrer" src={appUser.photoURL} alt="Avatar" className="w-8.5 h-8.5 rounded-full border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-8.5 h-8.5 rounded-full bg-[#2C3E2D] dark:bg-[#38513B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {appUser.role === 'teacher' ? 'U' : 'O'}
                </div>
              )}
              <button
                onClick={handleLogout}
                title="Tizimdan chiqish"
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E2D20] rounded-lg transition"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Kirish (O'quvchi / O'qituvchi)
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F2C21] rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation links */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white dark:bg-[#141F16] border-b border-[#EBE7DF] dark:border-[#243326] px-6 py-4 flex flex-col gap-2 shadow-sm"
          >
            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between py-2 px-1 mb-2 border-b border-[#EBE7DF] dark:border-[#243326]">
              <span className="text-xs font-bold text-[#828282] dark:text-[#9FB1A2]">Mavzu tanlash:</span>
              <ThemeToggle showLabel={true} />
            </div>

            {appUser?.role === 'teacher' ? (
              <>
                <button
                  onClick={() => { setActiveTab('teacher_overview'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'teacher_overview' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  🏢 Barcha Kurslar Boshqaruvi
                </button>
                <button
                  onClick={() => { setCurrentTrack('literacy'); setActiveTab('curriculum'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'curriculum' && currentTrack === 'literacy' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  💻 Kompyuter Savodxonligi (36 dars)
                </button>
                <button
                  onClick={() => { setCurrentTrack('design'); setActiveTab('curriculum'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'curriculum' && currentTrack === 'design' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  🎨 Grafik Dizayn Kursi
                </button>
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'dashboard' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  📊 O'quvchilar Monitoringi
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setActiveTab('curriculum'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'curriculum' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  {currentTrack === 'design' ? '🎨 Dizayn Darslari' : '📚 36 ta Darslik IT Dasturi'}
                </button>
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'dashboard' ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#1E2D20]'
                  }`}
                >
                  📊 O'quvchi Kabineti & Natijalar
                </button>
                <button
                  onClick={() => { setIsTrackSelectionOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg bg-[#FAF8F5] dark:bg-[#1C281F] text-[#2C3E2D] dark:text-[#D4DFD6] border border-[#8BA88E]/40 dark:border-[#8BA88E]/30 hover:bg-[#F5F5F0] dark:hover:bg-[#253528] flex items-center justify-between"
                >
                  <span>🔄 Bo'limni Almashtirish</span>
                  <span className="text-[10px] bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] px-2 py-0.5 rounded-full font-bold">
                    {currentTrack === 'design' ? 'Dizayn' : 'Savodxonlik'}
                  </span>
                </button>
                <button
                  onClick={() => { setIsScheduleModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold rounded-lg transition-all text-[#2C3E2D] dark:text-[#E6EAE7] bg-[#FAF8F5] dark:bg-[#1C281F] border border-[#8BA88E]/30 hover:bg-[#F5F5F0] dark:hover:bg-[#253528] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#8BA88E]" />
                    <span>📅 Dars Jadvali & Kalendar</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    3 Guruh
                  </span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

        {/* GUEST BANNER */}
        {!appUser && (
          <div className="mb-6 bg-[#F5F5F0] dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-[#8BA88E] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#2C3E2D] dark:text-[#E6EAE7] font-serif italic text-base">Tizimga kirmasdan foydalanmoqdasiz</h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5 leading-relaxed">
                  O'quvchi yoki O'qituvchi akkauntingizga kirib, kurslarni tanlashingiz, darslarni o'zlashtirishingiz va natijalarni saqlab borishingiz mumkin!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white font-bold text-xs rounded-full shadow-sm transition-all shrink-0 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Akkauntga Kirish</span>
            </button>
          </div>
        )}

        {/* 2.1 TAB: TEACHER OVERVIEW (Barcha Kurslar) */}
        {activeTab === 'teacher_overview' ? (
          <TeacherDashboard
            onNavigateToTrack={(track) => {
              setCurrentTrack(track);
              setActiveTab('curriculum');
            }}
            teacherName={appUser?.name || 'Assadxoja'}
            onSelectStudentLesson={(track, lessonId) => {
              setCurrentTrack(track);
              setActiveTab('curriculum');
              if (track === 'literacy') {
                setSelectedLessonId(lessonId);
              }
            }}
          />
        ) : activeTab === 'dashboard' ? (
          /* 2.2 TAB: STUDENT DASHBOARD */
          <StudentDashboard
            userToken={userToken}
            appUser={appUser}
            onSelectLesson={selectLesson}
            onSelectTrackLesson={(track, id) => {
              setCurrentTrack(track);
              if (track === 'literacy') {
                selectLesson(id);
              }
              setActiveTab('curriculum');
            }}
          />
        ) : currentTrack === 'design' ? (
          /* 2.3 TAB: DESIGN COURSE VIEW (Grafik Dizayn) */
          <DesignCourseView
            onOpenAi={(title, ctx) => setIsAiOpen(true)}
            completedLessons={designCompletedLessons}
            onToggleComplete={handleToggleDesignLesson}
            appUser={appUser}
          />
        ) : (
          /* 2.4 MAIN LITERACY CURRICULUM BROWSER (Kompyuter Savodxonligi - 36 ta dars) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 5 COLS: LESSON LIST / TOPIC INDEX */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Banner / Category Intro */}
              <div className="p-6 rounded-3xl text-white shadow-md relative overflow-hidden bg-[#2C3E2D] border border-[#2C3E2D]">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mb-10" />
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/15 rounded-full">
                  Yagona IT O'quv Dasturi
                </span>
                <h3 className="text-2xl font-serif italic font-normal tracking-tight mt-3">
                  3 Oylik Birlashgan IT Dasturi
                </h3>
                <p className="text-xs text-white/90 mt-2 leading-relaxed">
                  Barcha 36 ta IT mavzulari yagona izchillikda jamlangan. Yosh toifasiga qarab tushuntirish uslubini o'zgartirishingiz mumkin!
                </p>

                {/* Quick month filters */}
                <div className="flex gap-2 mt-5 pt-4 border-t border-white/10">
                  {[1, 2, 3].map((mNum) => (
                    <button
                      key={mNum}
                      onClick={() => setActiveMonth(mNum)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeMonth === mNum
                          ? 'bg-[#FDFBF7] text-[#2C3E2D] shadow'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {mNum}-Oy darslari
                    </button>
                  ))}
                </div>
              </div>

              {/* Weeks and Lessons list container */}
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF] dark:border-[#243326]">
                  <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2 text-base font-normal">
                    <BookMarked className="w-5 h-5 text-[#8BA88E]" />
                    Mavzular Rejasi
                  </h4>
                  <span className="text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold bg-[#F5F5F0] dark:bg-[#1A261D] px-2.5 py-1 rounded-full border border-[#EBE7DF] dark:border-[#283A2C]">
                    oy #{activeMonth}
                  </span>
                </div>

                {/* SEARCH BAR INPUT */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Darslarni qidirish (kalit so'z, mavzu, klaviatura)..."
                    className="w-full pl-10 pr-9 py-2.5 bg-[#FDFBF7] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] rounded-2xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 transition-all placeholder:text-[#828282]/60 dark:placeholder:text-[#7A8E7E]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white rounded-full"
                      title="Qidiruvni tozalash"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {searchQuery.trim().length > 0 ? (
                  /* SEARCH RESULTS VIEW */
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold border-b border-[#EBE7DF] dark:border-[#243326] pb-2">
                      <span>Qidiruv natijalari:</span>
                      <span className="text-[#2C3E2D] dark:text-[#9FB1A2] font-bold bg-[#8BA88E]/20 px-2.5 py-0.5 rounded-full">
                        {getFilteredLessons().length} ta dars topildi
                      </span>
                    </div>

                    {getFilteredLessons().length === 0 ? (
                      <div className="text-center py-8 text-xs text-[#828282] dark:text-[#9FB1A2] bg-[#FDFBF7] dark:bg-[#101712] rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C] p-4">
                        <p className="font-bold text-[#2D2D2D] dark:text-[#E6EAE7] mb-1">Darslar topilmadi 🔍</p>
                        <p>"{searchQuery}" bo'yicha hechnarsa topilmadi. Boshqa so'z bilan izlab ko'ring.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                        {getFilteredLessons().map(({ lesson, monthNum, weekNum }) => {
                          const selected = selectedLessonId === lesson.id;
                          const completed = isCompleted(lesson.id);
                          const prefix = lesson.id < 10 ? `0${lesson.id}` : `${lesson.id}`;

                          return (
                            <button
                              key={`search-res-${lesson.id}`}
                              onClick={() => selectLesson(lesson.id)}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                selected
                                  ? 'bg-[#2C3E2D] dark:bg-[#2A3E2D] text-white border-[#2C3E2D] dark:border-[#3E5C42] shadow-lg'
                                  : 'bg-[#FDFBF7] dark:bg-[#121B14] border-[#EBE7DF] dark:border-[#243326] hover:bg-[#F5F5F0]/50 dark:hover:bg-[#1C281F] text-[#2D2D2D] dark:text-[#D4DFD6]'
                              }`}
                            >
                              <div className="flex flex-col gap-1 max-w-[82%]">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full w-max ${
                                  selected ? 'bg-white/20 text-white' : 'bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E]'
                                }`}>
                                  {monthNum}-Oy · {weekNum}-Hafta
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-serif italic text-xs shrink-0 ${
                                    selected ? 'text-[#8BA88E]' : 'text-[#828282]/60 dark:text-[#7A8E7E]'
                                  }`}>
                                    #{prefix}
                                  </span>
                                  <p className={`text-xs font-bold truncate ${
                                    selected ? 'text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'
                                  }`}>
                                    {lesson.title}
                                  </p>
                                </div>
                              </div>

                              {completed ? (
                                <CheckCircle className="w-4.5 h-4.5 text-[#8BA88E] shrink-0" />
                              ) : (
                                <Circle className={`w-4.5 h-4.5 shrink-0 ${
                                  selected ? 'text-white/30' : 'text-[#EBE7DF] dark:text-[#384C3B]'
                                }`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* MONTH & WEEK LIST (DEFAULT) */
                  <div className="flex flex-col gap-5">
                    {UNIFIED_CURRICULUM
                      .filter((m) => m.number === activeMonth)
                      .map((month) => (
                        <div key={month.number} className="flex flex-col gap-4">
                          {month.weeks.map((week) => (
                            <div key={week.number} className="flex flex-col gap-2">
                              <h5 className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">
                                {week.number}-Hafta: {week.title}
                              </h5>

                              <div className="flex flex-col gap-1.5">
                                {week.lessons.map((lesson) => {
                                  const selected = selectedLessonId === lesson.id;
                                  const completed = isCompleted(lesson.id);
                                  const prefix = lesson.id < 10 ? `0${lesson.id}` : `${lesson.id}`;

                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => selectLesson(lesson.id)}
                                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                        selected
                                          ? 'bg-[#2C3E2D] dark:bg-[#2A3E2D] text-white border-[#2C3E2D] dark:border-[#3E5C42] shadow-lg'
                                          : 'bg-[#FDFBF7] dark:bg-[#121B14] border-[#EBE7DF] dark:border-[#243326] hover:bg-[#F5F5F0]/50 dark:hover:bg-[#1C281F] text-[#2D2D2D] dark:text-[#D4DFD6]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3.5 max-w-[85%]">
                                        <span className={`font-serif italic text-sm shrink-0 transition-colors ${
                                          selected ? 'text-[#8BA88E]' : 'text-[#828282]/60 dark:text-[#7A8E7E]'
                                        }`}>
                                          {prefix}
                                        </span>
                                        <p className={`text-xs font-bold leading-tight truncate ${
                                          selected ? 'text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'
                                        }`}>
                                          {lesson.title}
                                        </p>
                                      </div>
                                      
                                      {completed ? (
                                        <CheckCircle className="w-4.5 h-4.5 text-[#8BA88E] shrink-0" />
                                      ) : (
                                        <Circle className={`w-4.5 h-4.5 shrink-0 ${
                                          selected ? 'text-white/30' : 'text-[#EBE7DF] dark:text-[#384C3B]'
                                        }`} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT 7 COLS: CURRENT ACTIVE LESSON DETAILS */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {selectedLessonId === null ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-[#152017] p-12 rounded-3xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <Compass className="w-16 h-16 text-[#8BA88E]/60 mb-4 animate-spin-slow" />
                    <h4 className="text-xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7]">Mavzuni Tanlang</h4>
                    <p className="text-xs text-[#828282] dark:text-[#9FB1A2] max-w-sm mt-2 leading-relaxed">
                      Chap tarafdagi dars rejalaridan birontasini bosing. Dars materiallari va tushuntirish uslublari shu yerda ochiladi!
                    </p>
                  </motion.div>
                ) : (
                  (() => {
                    const lesson = getSelectedLesson();
                    if (!lesson) return null;
                    const completed = isCompleted(lesson.id);

                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-6"
                      >
                        {/* Lesson Card Container */}
                        <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-8 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-6">
                          
                          {/* Title Area & Completion Toggle */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#EBE7DF] dark:border-[#243326]">
                            <div>
                              <p className="text-[10px] text-[#8BA88E] font-bold uppercase tracking-widest">
                                Dars #{lesson.id}
                              </p>
                              <h2 className="text-2xl md:text-3xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] leading-tight mt-1 font-normal">
                                {lesson.title}
                              </h2>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                              <button
                                onClick={() => setIsAiOpen(true)}
                                className="px-4 py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                                title="AI Ustozdan ushbu dars bo'yicha savol so'rash"
                              >
                                <Bot className="w-4 h-4 text-[#8BA88E] shrink-0" />
                                AI Ustoz
                              </button>

                              <button
                                onClick={handleDownloadPdf}
                                disabled={exportingPdf}
                                className="px-4 py-2.5 bg-[#8BA88E] hover:bg-[#739076] text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                                title="Nazariy qism va eslatmalarni PDF sifatida yuklab olish"
                              >
                                <Download className="w-4 h-4 shrink-0" />
                                {exportingPdf ? "Tayyorlanmoqda..." : "PDF Konspekt"}
                              </button>

                              <button
                                onClick={() => toggleLessonCompletion(lesson.id)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${
                                  completed
                                    ? 'bg-[#F5F5F0] dark:bg-[#1E2D20] text-[#2C3E2D] dark:text-[#D4DFD6] border border-[#EBE7DF] dark:border-[#2D3E30] hover:bg-[#EBE7DF]'
                                    : 'bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                {completed ? "O'rganildi (✓)" : "O'rgandim deb belgilash"}
                              </button>
                            </div>
                          </div>

                          {/* AGE METHODOLOGY TOGGLE SELECTOR */}
                          <div className="bg-[#F5F5F0] dark:bg-[#111A13] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col sm:flex-row items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-[#8BA88E]" />
                              Tushuntirish Metodologiyasi:
                            </span>
                            <div className="flex items-center gap-1 w-full sm:w-auto">
                              <button
                                onClick={() => setExplanationMode('kichik')}
                                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  explanationMode === 'kichik'
                                    ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                                }`}
                              >
                                👦 1-4 sinflar
                              </button>
                              <button
                                onClick={() => setExplanationMode('katta')}
                                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  explanationMode === 'katta'
                                    ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                                }`}
                              >
                                🧑 5-9 sinflar
                              </button>
                              <button
                                onClick={() => setExplanationMode('both')}
                                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  explanationMode === 'both'
                                    ? 'bg-[#8BA88E] text-white shadow-sm'
                                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                                }`}
                              >
                                ⚡ Yonma-yon Solishtirish
                              </button>
                            </div>
                          </div>

                          {/* DYNAMIC LESSON CONTENT BASED ON EXPLANATION MODE */}
                          {explanationMode === 'both' ? (
                            /* COMPARATIVE VIEW (SIDE-BY-SIDE) */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* KICHIK SIDE */}
                              <div className="bg-[#FDFBF7] dark:bg-[#111912] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#EBE7DF] dark:border-[#243326]">
                                  <span className="text-base">👦</span>
                                  <h4 className="font-serif italic font-bold text-[#2C3E2D] dark:text-[#D4DFD6] text-sm">
                                    1-4 Sinflar Uslubi (Visual & Ertakli)
                                  </h4>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">Mavzu Yondashuvi:</p>
                                  <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]">{lesson.kichik.topic}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">Tushuncha:</p>
                                  <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">{lesson.kichik.concept}</p>
                                </div>
                                <div className="bg-[#F5F5F0] dark:bg-[#172319] p-3 rounded-xl border border-[#EBE7DF] dark:border-[#243326] italic text-xs text-[#2C3E2D] dark:text-[#D4DFD6]">
                                  <p className="text-[10px] font-bold text-[#8BA88E] not-italic uppercase tracking-wider mb-1">Sehrli Ertak:</p>
                                  "{lesson.kichik.analogyOrTechDetails}"
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-2">Amaliy Topshiriqlar:</p>
                                  <ul className="flex flex-col gap-1.5">
                                    {lesson.kichik.practicalSteps.map((step, i) => (
                                      <li key={i} className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] flex items-start gap-2">
                                        <span className="text-[#8BA88E] font-bold">•</span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* KATTA SIDE */}
                              <div className="bg-[#F5F5F0] dark:bg-[#141F16] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#EBE7DF] dark:border-[#243326]">
                                  <span className="text-base">🧑</span>
                                  <h4 className="font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] text-sm">
                                    5-9 Sinflar Uslubi (Pro & Texnik)
                                  </h4>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">Mavzu Yondashuvi:</p>
                                  <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]">{lesson.katta.topic}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">Tushuncha:</p>
                                  <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">{lesson.katta.concept}</p>
                                </div>
                                <div className="bg-white dark:bg-[#1A281C] p-3 rounded-xl border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#D4DFD6]">
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-1">Texnik Tafsilotlar & Shortcuts:</p>
                                  {lesson.katta.analogyOrTechDetails}
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-2">Amaliy Topshiriqlar:</p>
                                  <ul className="flex flex-col gap-1.5">
                                    {lesson.katta.practicalSteps.map((step, i) => (
                                      <li key={i} className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] flex items-start gap-2">
                                        <span className="text-[#8BA88E] font-bold">•</span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* SINGLE AGE MODE VIEW (KICHIK OR KATTA) */
                            (() => {
                              const details = explanationMode === 'kichik' ? lesson.kichik : lesson.katta;
                              return (
                                <div className="flex flex-col gap-6">
                                  
                                  {/* Section structure recommendation */}
                                  <div className="bg-[#F5F5F0] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-2xl p-5 flex flex-col gap-2 shadow-inner">
                                    <h5 className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      {explanationMode === 'kichik' ? "1-4 Sinflar Metodologiyasi (90 daqiqa):" : "5-9 Sinflar Metodologiyasi (90 daqiqa):"}
                                    </h5>
                                    <p className="text-xs text-[#2D2D2D]/85 dark:text-[#C5D0C7] leading-relaxed">
                                      {explanationMode === 'kichik'
                                        ? "0-15m (Muz eritish) · 15-35m (Ertak & Tushuncha) · 35-40m (Fizminutka) · 40-65m (1-Amaliyot) · 65-75m (O'yin daqiqasi) · 75-85m (2-Amaliyot) · 85-90m (Rag'bat)"
                                        : "0-15m (Pro Takrorlash) · 15-35m (Nazariya & Arxitektura) · 35-40m (Tanaffus) · 40-65m (Mustaqil Lab ishi) · 65-75m (Mantiqiy Kviz) · 75-85m (Mini-Loyiha) · 85-90m (Xulosa)"}
                                    </p>
                                  </div>

                                  {/* Specific Topic Focus */}
                                  <div className="flex flex-col gap-2">
                                    <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                      <Smile className="w-4 h-4 text-[#8BA88E]" />
                                      Mavzu Diqqat Markazi ({explanationMode === 'kichik' ? '1-4 Sinflar' : '5-9 Sinflar'}):
                                    </h4>
                                    <p className="text-sm font-bold text-[#2C3E2D] dark:text-[#D4DFD6] bg-[#FDFBF7] dark:bg-[#111912] p-4 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
                                      {details.topic}
                                    </p>
                                  </div>

                                  {/* Concept Explanation */}
                                  <div className="flex flex-col gap-2">
                                    <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                      <BookOpen className="w-4 h-4 text-[#8BA88E]" />
                                      Dars Tushunchasi:
                                    </h4>
                                    <p className="text-sm text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed bg-[#FDFBF7] dark:bg-[#111912] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-inner">
                                      {details.concept}
                                    </p>
                                  </div>

                                  {/* Creative Analogy or Technical Details */}
                                  <div className="flex flex-col gap-2">
                                    <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 text-[#8BA88E]" />
                                      {explanationMode === 'kichik' ? "Sehrli Ertak va O'xshatish:" : "Texnik Izoh va Pro Klaviaturasi:"}
                                    </h4>
                                    <p className="text-sm text-[#2C3E2D]/90 dark:text-[#D4DFD6] leading-relaxed bg-[#F5F5F0] dark:bg-[#162217] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] italic shadow-inner">
                                      {details.analogyOrTechDetails}
                                    </p>
                                  </div>

                                  {/* Practical exercises checklist */}
                                  <div className="flex flex-col gap-3">
                                    <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                      <Compass className="w-4 h-4 text-[#8BA88E]" />
                                      Kompyuterda Mustaqil Bajariladigan Laboratoriya Ishi:
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                      {details.practicalSteps.map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#243326] hover:bg-[#F5F5F0]/30 dark:hover:bg-[#1B291D] transition-all shadow-sm">
                                          <span className="w-6 h-6 rounded-full bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] font-serif italic text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                          </span>
                                          <p className="text-xs font-medium text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">{step}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              );
                            })()
                          )}

                          {/* VIDEO DARSLIK BO'LIMI */}
                          <div className="pt-6 border-t border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-4">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                <Video className="w-4 h-4 text-[#8BA88E]" />
                                Mavzuga Oid Video Darslik:
                              </h4>
                              
                              <button
                                onClick={() => {
                                  const currentUrl = customVideos[`lesson-${lesson.id}`] || '';
                                  setVideoInputUrl(currentUrl);
                                  setEditingVideo(!editingVideo);
                                }}
                                className="text-[10px] text-[#2C3E2D] dark:text-[#D4DFD6] font-bold hover:bg-[#EBE7DF]/40 dark:hover:bg-[#253528] flex items-center gap-1 bg-[#F5F5F0] dark:bg-[#172319] px-3 py-1 rounded-full border border-[#EBE7DF] dark:border-[#283A2C] transition-all"
                              >
                                <Edit2 className="w-3 h-3 text-[#8BA88E]" />
                                {customVideos[`lesson-${lesson.id}`] ? "Videoni O'zgartirish" : "Video Biriktirish (YouTube)"}
                              </button>
                            </div>

                            {/* Custom Video Editor Form */}
                            {editingVideo && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-[#FDFBF7] dark:bg-[#111912] border border-[#EBE7DF] dark:border-[#243326] rounded-2xl p-4 flex flex-col gap-3 shadow-inner"
                              >
                                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase tracking-wider">
                                  Ushbu dars uchun YouTube video havolasini kiriting:
                                </p>
                                <div className="flex flex-col md:flex-row gap-2">
                                  <input
                                    type="text"
                                    placeholder="Masalan: https://www.youtube.com/watch?v=g_0F-fT9SgU"
                                    value={videoInputUrl}
                                    onChange={(e) => setVideoInputUrl(e.target.value)}
                                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-[#EBE7DF] dark:border-[#283A2C] bg-white dark:bg-[#18241B] text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] focus:ring-1 focus:ring-[#8BA88E]"
                                  />
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => saveVideoUrl(lesson.id, videoInputUrl)}
                                      className="px-4 py-2 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-full text-xs font-bold transition-all"
                                    >
                                      Saqlash
                                    </button>
                                    {customVideos[`lesson-${lesson.id}`] && (
                                      <button
                                        onClick={() => deleteVideoUrl(lesson.id)}
                                        className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold transition-all border border-rose-200 dark:border-rose-800"
                                        title="Videoni o'chirish"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setEditingVideo(false)}
                                      className="px-3 py-2 bg-[#F5F5F0] dark:bg-[#172319] hover:bg-[#EBE7DF] dark:hover:bg-[#202E22] text-[#2D2D2D] dark:text-[#D4DFD6] rounded-full text-xs font-bold transition-all border border-[#EBE7DF] dark:border-[#283A2C]"
                                    >
                                      Bekor qilish
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Video Display Area */}
                            {(() => {
                              const rawUrl = getVideoUrlForLesson(lesson.id);
                              const embedUrl = getYouTubeEmbedUrl(rawUrl);

                              if (embedUrl) {
                                return (
                                  <div className="overflow-hidden rounded-2xl border border-[#EBE7DF] dark:border-[#243326] bg-black shadow-md aspect-video relative group">
                                    <iframe
                                      src={embedUrl}
                                      title={`Video Lesson - ${lesson.title}`}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="bg-[#FDFBF7] dark:bg-[#111912] border border-dashed border-[#EBE7DF] dark:border-[#283A2C] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                                    <Play className="w-10 h-10 text-[#8BA88E]/40 mb-2" />
                                    <p className="text-xs text-[#2D2D2D] dark:text-[#E6EAE7] font-bold">Ushbu dars uchun hozircha video darslik qo'shilmagan</p>
                                    <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] mt-1">O'ng tomondagi "Video biriktirish" tugmasini bosib darslik qo'shishingiz mumkin.</p>
                                  </div>
                                );
                              }
                            })()}
                          </div>

                          {/* STUDENT NOTES TEXTBOX (Saves to Postgres) */}
                          <div className="pt-6 border-t border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[#8BA88E]" />
                                Mening Dars Eslatmalarim:
                              </h4>
                              {notesSaveStatus === 'saving' && <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-medium animate-pulse">Saqlanmoqda...</span>}
                              {notesSaveStatus === 'saved' && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Muvaffaqiyatli saqlandi! ✓</span>}
                              {notesSaveStatus === 'error' && <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">Xatolik yuz berdi.</span>}
                            </div>
                            <textarea
                              rows={3}
                              placeholder="Dars yuzasidan o'zingizga kerakli bo'lgan yoki darsda tushunmagan narsalaringizni yozib qo'ying..."
                              value={studentNotes}
                              onChange={(e) => setStudentNotes(e.target.value)}
                              disabled={!currentUser}
                              className="w-full px-4 py-3 rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C] bg-[#FDFBF7] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#E6EAE7] text-xs focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 disabled:bg-[#F5F5F0]/50 dark:disabled:bg-[#18241B] disabled:text-[#828282] dark:disabled:text-[#7A8E7E] placeholder:text-[#828282]/50 dark:placeholder:text-[#7A8E7E]/50 leading-relaxed shadow-inner"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <button
                                onClick={handleDownloadPdf}
                                disabled={exportingPdf}
                                className="px-5 py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5" />
                                {exportingPdf ? "PDF Yasalmoqda..." : "Konspektni PDF Sifatida Yuklab Olish"}
                              </button>

                              {currentUser ? (
                                <button
                                  onClick={saveNotes}
                                  disabled={notesSaveStatus === 'saving'}
                                  className="px-5 py-2.5 bg-[#8BA88E] hover:bg-[#739076] text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  Eslatmalarni Saqlash (PostgreSQL)
                                </button>
                              ) : (
                                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] italic">Eslatmalar yozish va saqlash uchun tizimga kiring.</p>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Interactive Game Block */}
                        <InteractiveGame
                          key={`game-${lesson.id}`}
                          gameConfig={lesson.game}
                          section="unified"
                          lessonId={lesson.id}
                          userToken={userToken}
                          onGameComplete={(s, m) => {
                            if (!completedLessonIds.includes(lesson.id)) {
                              toggleLessonCompletion(lesson.id);
                            }
                          }}
                        />

                        {/* Lesson Rating & Feedback Block (1-5 yulduzcha va qisqa fikr bildirish) */}
                        <LessonRatingFeedbackView
                          track="literacy"
                          lessonId={lesson.id}
                          lessonTitle={lesson.title}
                          appUser={appUser}
                        />

                      </motion.div>
                    );
                  })()
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

      </main>

      {/* 3. FOOTER */}
      <footer className="bg-white dark:bg-[#141F16] border-t border-[#EBE7DF] dark:border-[#243326] mt-16 py-10 px-6 text-center text-[#828282] dark:text-[#9FB1A2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] font-serif italic">IT Savodxonlik Portali © 2026</p>
            <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] mt-1 leading-relaxed max-w-xl">
              1-4 va 5-9 sinflar uchun yagona IT darslik tizimi, yosh toifasi bo'yicha tushuntirish metodikasi, mustaqil amaliyot va interaktiv o'yinlar.
            </p>
          </div>
          <div className="text-xs font-semibold text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-[#8BA88E]">Cloud SQL & Firebase</span>
          </div>
        </div>
      </footer>

      {/* AI ASSISTANT FLOATING WIDGET */}
      <AiAssistant
        currentLesson={getSelectedLesson()}
        studentNotes={studentNotes}
        isOpenExternal={isAiOpen}
        onCloseExternal={() => setIsAiOpen(false)}
      />

      {/* LOGIN MODAL (O'QUVCHI & O'QITUVCHI) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onGoogleLogin={handleLogin}
      />

      {/* TRACK SELECTION MODAL (KOMPYUTER SAVODXONLIGI vs DIZAYN) */}
      <TrackSelectionModal
        isOpen={isTrackSelectionOpen}
        onClose={() => setIsTrackSelectionOpen(false)}
        canClose={!!currentTrack}
        studentName={appUser?.name}
        onSelectTrack={handleTrackSelect}
      />

      {/* LESSON SCHEDULE CALENDAR MODAL (DARS JADVALI VA SOATLARI KALENDARI) */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#141F16] rounded-3xl w-full max-w-5xl shadow-2xl border border-[#EBE7DF] dark:border-[#243326] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#2C3E2D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif italic font-bold text-base sm:text-lg">
                  Dars Jadvali & Kalendar (Barcha Guruhlar)
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              <LessonScheduleCalendar
                appUser={appUser}
                onSelectTrackLesson={(track, id) => {
                  setCurrentTrack(track);
                  if (track === 'literacy') selectLesson(id);
                  setActiveTab('curriculum');
                  setIsScheduleModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
