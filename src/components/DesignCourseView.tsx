import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Code2,
  BookOpen, 
  CheckCircle, 
  Circle, 
  Sparkles, 
  Lightbulb, 
  Wrench, 
  Clock, 
  Search,
  X,
  FileCheck,
  Bot,
  Copy,
  Check,
  Layers,
  Target,
  Calendar
} from 'lucide-react';
import { DESIGN_CURRICULUM, DesignLesson } from '../data/designCurriculum';
import LessonRatingFeedbackView from './LessonRatingFeedback';
import { AppUser } from './LoginModal';

interface DesignCourseViewProps {
  completedLessons: number[];
  onToggleComplete: (id: number) => void;
  appUser?: AppUser | null;
  initialCategory?: 'all' | 'design' | 'frontend';
}

export const DesignCourseView: React.FC<DesignCourseViewProps> = ({
  completedLessons,
  onToggleComplete,
  appUser,
  initialCategory = 'all',
}) => {
  const [courseFilter, setCourseFilter] = useState<'all' | 'design' | 'frontend'>(initialCategory);
  const [selectedLessonId, setSelectedLessonId] = useState<number>(
    initialCategory === 'frontend' ? 301 : 101
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModuleId, setActiveModuleId] = useState<number>(
    initialCategory === 'frontend' ? 3 : 1
  );
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    setCourseFilter(initialCategory);
    if (initialCategory === 'frontend') {
      setActiveModuleId(3);
      setSelectedLessonId(301);
    } else if (initialCategory === 'design') {
      setActiveModuleId(1);
      setSelectedLessonId(101);
    }
  }, [initialCategory]);

  const visibleModules = DESIGN_CURRICULUM.filter((m) =>
    courseFilter === 'all' ? true : m.category === courseFilter
  );

  // Find currently selected lesson
  const allLessons: DesignLesson[] = DESIGN_CURRICULUM.flatMap((m) => m.lessons);
  const selectedLesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];
  const activeModule = DESIGN_CURRICULUM.find((m) => m.id === activeModuleId) || DESIGN_CURRICULUM[0];

  // Filter lessons by search query
  const filteredLessons = searchQuery.trim()
    ? allLessons.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.week.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectLesson = (id: number) => {
    setSelectedLessonId(id);
    const mod = DESIGN_CURRICULUM.find((m) => m.lessons.some((l) => l.id === id));
    if (mod) setActiveModuleId(mod.id);
  };

  const handleFilterChange = (mode: 'all' | 'design' | 'frontend') => {
    setCourseFilter(mode);
    setSearchQuery('');
    if (mode === 'design') {
      setActiveModuleId(1);
      setSelectedLessonId(101);
    } else if (mode === 'frontend') {
      setActiveModuleId(3);
      setSelectedLessonId(301);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Group active module lessons by week
  const groupedWeeks: Array<{ weekTitle: string; lessons: DesignLesson[] }> = [];
  activeModule.lessons.forEach((lesson) => {
    const existing = groupedWeeks.find((g) => g.weekTitle === lesson.week);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      groupedWeeks.push({ weekTitle: lesson.week, lessons: [lesson] });
    }
  });

  const isCompleted = completedLessons.includes(selectedLesson.id);
  const isFrontendLesson = selectedLesson.id >= 300;

  return (
    <div className="flex flex-col gap-8">
      {/* Banner / Header */}
      <div className="bg-[#2C3E2D] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg border border-[#8BA88E]/20">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#8BA88E] text-xs font-bold border border-white/10">
              {courseFilter === 'frontend' ? (
                <>
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Frontend Veb-Dasturlash Kursi (HTML5 & CSS3)</span>
                </>
              ) : courseFilter === 'design' ? (
                <>
                  <Palette className="w-3.5 h-3.5" />
                  <span>Grafik va UI/UX Dizayn Kursi (Canva & Figma)</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Grafik Dizayn (Canva/Figma) & Frontend (HTML5/CSS3)</span>
                </>
              )}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight">
            {courseFilter === 'frontend'
              ? 'Zamonaviy Frontend Dasturlash: HTML5 va CSS3'
              : courseFilter === 'design'
                ? 'Grafik Dizayn va UI/UX: Canva hamda Figma'
                : 'Dizayn va Frontend Dasturlash (4 Oylik To\'liq Kurs)'}
          </h2>

          <p className="text-xs md:text-sm text-[#8BA88E] mt-2 leading-relaxed">
            {courseFilter === 'frontend'
              ? "3-Modul (HTML5 semantikasi) va 4-Modul (CSS3, Flexbox, Animatsiya va Responsive dizayn) orqali Figma'da chizilgan maketlarni noldan haqiqiy kodga o'tkazishni o'rganing."
              : courseFilter === 'design'
                ? "1-Modul (Canva tezkor grafik dizayn va brending) hamda 2-Modul (Figma professional UI/UX veb-dizayn va prototiplash) bo'yicha mukammal amaliy dastur."
                : "Canva grafik dizayni va Figma UI/UX maketlaridan boshlab, HTML5 va CSS3 yordamida to'liq moslashuvchan (Responsive) veb-sayt yaratishgacha bo'lgan 48 darslik o'quv dasturi."}
          </p>

          {/* Course Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/15">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                courseFilter === 'all'
                  ? 'bg-[#FDFBF7] text-[#2C3E2D] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>📚 Barcha 4 Modul (48 dars)</span>
            </button>
            <button
              onClick={() => handleFilterChange('design')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                courseFilter === 'design'
                  ? 'bg-[#FDFBF7] text-[#2C3E2D] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>🎨 Dizayn: Canva & Figma (24 dars)</span>
            </button>
            <button
              onClick={() => handleFilterChange('frontend')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                courseFilter === 'frontend'
                  ? 'bg-[#FDFBF7] text-[#2C3E2D] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>💻 Frontend: HTML5 & CSS3 (24 dars)</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          {courseFilter === 'frontend' ? (
            <Code2 className="w-96 h-96 text-white" />
          ) : (
            <Palette className="w-96 h-96 text-white" />
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MODULES & LESSONS LIST */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Module Selector Chips */}
          <div className="flex flex-col gap-2.5 bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider">
                O'quv Modullari (1 Oy = 12 Dars)
              </h4>
              <span className="text-[10px] font-bold text-[#8BA88E]">
                {visibleModules.length} ta modul
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {visibleModules.map((mod) => {
                const isModActive = activeModuleId === mod.id && !searchQuery;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModuleId(mod.id);
                      setSearchQuery('');
                      if (mod.lessons.length > 0) {
                        setSelectedLessonId(mod.lessons[0].id);
                      }
                    }}
                    className={`text-left p-3.5 rounded-2xl text-xs font-bold transition-all flex flex-col gap-1.5 ${
                      isModActive
                        ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-md'
                        : 'bg-[#FDFBF7] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#18241B] border border-[#EBE7DF] dark:border-[#283A2C]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-[#8BA88E]/20 text-[#8BA88E]">
                        {mod.durationBadge}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        isModActive ? 'bg-white/20 text-white' : 'bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E]'
                      }`}>
                        {mod.badge}
                      </span>
                    </div>
                    <span className="leading-snug font-bold">{mod.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Module Goal Box */}
          {!searchQuery && activeModule && (
            <div className="bg-[#FAF8F5] dark:bg-[#141E16] rounded-3xl p-5 border border-[#8BA88E]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                <Target className="w-4 h-4 text-[#8BA88E] shrink-0" />
                <span>Modul Maqsadi:</span>
              </div>
              <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">
                {activeModule.goal}
              </p>
            </div>
          )}

          {/* Lessons List Container */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Canva, Figma, HTML5, CSS3 darslarini izlash..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FDFBF7] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] rounded-2xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] placeholder:text-[#828282]/60 dark:placeholder:text-[#7A8E7E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Grouped Weeks or Search Results */}
            <div className="flex flex-col gap-4 max-h-[580px] overflow-y-auto pr-1">
              {searchQuery.trim() ? (
                filteredLessons.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#828282] dark:text-[#9FB1A2]">
                    "{searchQuery}" bo'yicha dars topilmadi.
                  </div>
                ) : (
                  filteredLessons.map((lesson) => {
                    const isSel = selectedLessonId === lesson.id;
                    const isComp = completedLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSel
                            ? 'bg-[#2C3E2D] dark:bg-[#2A3E2D] text-white border-[#2C3E2D] dark:border-[#3E5C42] shadow-md'
                            : 'bg-[#FDFBF7] dark:bg-[#111912] border-[#EBE7DF] dark:border-[#243326] hover:bg-[#F5F5F0] dark:hover:bg-[#1A261D] text-[#2D2D2D] dark:text-[#D4DFD6]'
                        }`}
                      >
                        <div className="flex flex-col gap-1 max-w-[85%]">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isSel ? 'bg-white/20 text-white' : 'bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E]'
                            }`}>
                              {lesson.lessonNumber}-dars
                            </span>
                            <span className={`text-[10px] truncate ${isSel ? 'text-white/70' : 'text-[#828282] dark:text-[#9FB1A2]'}`}>
                              {lesson.module}
                            </span>
                          </div>
                          <p className={`text-xs font-bold leading-snug ${isSel ? 'text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'}`}>
                            {lesson.title}
                          </p>
                        </div>

                        {isComp ? (
                          <CheckCircle className="w-4 h-4 text-[#8BA88E] shrink-0" />
                        ) : (
                          <Circle className={`w-4 h-4 shrink-0 ${isSel ? 'text-white/30' : 'text-[#EBE7DF] dark:text-[#384C3B]'}`} />
                        )}
                      </button>
                    );
                  })
                )
              ) : (
                groupedWeeks.map((group) => (
                  <div key={group.weekTitle} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider px-1 pt-1">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{group.weekTitle}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {group.lessons.map((lesson) => {
                        const isSel = selectedLessonId === lesson.id;
                        const isComp = completedLessons.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              isSel
                                ? 'bg-[#2C3E2D] dark:bg-[#2A3E2D] text-white border-[#2C3E2D] dark:border-[#3E5C42] shadow-md'
                                : 'bg-[#FDFBF7] dark:bg-[#111912] border-[#EBE7DF] dark:border-[#243326] hover:bg-[#F5F5F0] dark:hover:bg-[#1A261D] text-[#2D2D2D] dark:text-[#D4DFD6]'
                            }`}
                          >
                            <div className="flex flex-col gap-1 max-w-[85%]">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  isSel ? 'bg-white/20 text-white' : 'bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E]'
                                }`}>
                                  {lesson.lessonNumber}-dars
                                </span>
                                <span className={`text-[10px] ${isSel ? 'text-white/70' : 'text-[#828282] dark:text-[#9FB1A2]'}`}>
                                  {lesson.duration}
                                </span>
                              </div>
                              <p className={`text-xs font-bold leading-snug ${isSel ? 'text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'}`}>
                                {lesson.title}
                              </p>
                            </div>

                            {isComp ? (
                              <CheckCircle className="w-4 h-4 text-[#8BA88E] shrink-0" />
                            ) : (
                              <Circle className={`w-4 h-4 shrink-0 ${isSel ? 'text-white/30' : 'text-[#EBE7DF] dark:text-[#384C3B]'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE LESSON CONTENT */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-8 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-6">
            
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#EBE7DF] dark:border-[#243326]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-[#8BA88E] font-bold uppercase tracking-widest">
                    {selectedLesson.module} · {selectedLesson.week}
                  </span>
                  <span className="text-[10px] bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] px-2 py-0.5 rounded-full font-bold">
                    {selectedLesson.lessonNumber}-dars (#{selectedLesson.id})
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] font-bold mt-1.5">
                  {selectedLesson.title}
                </h2>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                  {selectedLesson.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => onToggleComplete(selectedLesson.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-[#F5F5F0] dark:bg-[#1E2D20] text-[#2C3E2D] dark:text-[#D4DFD6] border border-[#EBE7DF] dark:border-[#2D3E30]'
                      : 'bg-[#8BA88E] hover:bg-[#739076] text-white shadow-sm'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isCompleted ? "O'rganildi (✓)" : "O'rgandim deb belgilash"}
                </button>
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FAF8F5] dark:bg-[#111912] text-[#2C3E2D] dark:text-[#D4DFD6] border border-[#EBE7DF] dark:border-[#283A2C] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8BA88E]" />
                {selectedLesson.duration}
              </span>
              <span className="bg-[#FAF8F5] dark:bg-[#111912] text-[#2C3E2D] dark:text-[#D4DFD6] border border-[#EBE7DF] dark:border-[#283A2C] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#8BA88E]" />
                Vositalar: {selectedLesson.tools.join(', ')}
              </span>
              <span className="bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E] px-3 py-1 rounded-xl text-xs font-bold">
                Daraja: {selectedLesson.level}
              </span>
            </div>

            {/* Video Player */}
            {selectedLesson.videoUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#EBE7DF] dark:border-[#243326] shadow-md bg-black aspect-video w-full">
                <iframe
                  src={selectedLesson.videoUrl}
                  title={selectedLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* THEORY CARD */}
            <div className="bg-[#FAF8F5] dark:bg-[#111912] rounded-2xl p-6 border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                <BookOpen className="w-4 h-4 text-[#8BA88E]" />
                <span>Nazariy Qism & Asosiy Qoidalar</span>
              </div>

              <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">
                {selectedLesson.theory.mainConcept}
              </p>

              {/* Analogy Box */}
              <div className="bg-white dark:bg-[#18241B] p-4 rounded-xl border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2C3E2D] dark:text-[#D4DFD6] italic flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#8BA88E] shrink-0 mt-0.5" />
                <div>
                  <strong className="not-italic font-bold block mb-0.5">Hayotiy O'xshatish:</strong>
                  "{selectedLesson.theory.analogy}"
                </div>
              </div>

              {/* Rules list */}
              <div>
                <strong className="text-[11px] font-bold text-[#8BA88E] uppercase tracking-wider block mb-2">
                  {isFrontendLesson ? "Dasturchining Oltin Qoidalari:" : "Dizaynerning Oltin Qoidalari:"}
                </strong>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedLesson.theory.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                      <span className="w-4 h-4 rounded-full bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CODE EXAMPLE BLOCK (FOR HTML5 & CSS3 LESSONS) */}
            {selectedLesson.codeExample && (
              <div className="bg-[#111913] text-[#E6EAE7] rounded-2xl overflow-hidden border border-[#2C3E2D] shadow-md">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1B281E] border-b border-[#2C3E2D]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8BA88E]">
                    <Code2 className="w-4 h-4" />
                    <span>Kod Namunasi ({selectedLesson.id >= 400 ? 'CSS3' : 'HTML5'})</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedLesson.codeExample!)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 transition"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Nusxalandi!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kodni Nusxalash</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-200">
                  <code>{selectedLesson.codeExample}</code>
                </pre>
              </div>
            )}

            {/* PRACTICAL TASK CARD */}
            <div className="bg-white dark:bg-[#152017] rounded-2xl p-6 border-2 border-[#8BA88E]/40 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                  <FileCheck className="w-4 h-4 text-[#8BA88E]" />
                  <span>Amaliy Topshiriq (Uyga Vazifa & Amaliyot)</span>
                </div>
                <span className="text-[10px] font-bold bg-[#8BA88E] text-white px-2.5 py-0.5 rounded-full">
                  Amaliyot
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                📌 {selectedLesson.practice.taskTitle}
              </h4>

              <div className="flex flex-col gap-2">
                <strong className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase">
                  Bajarish Qadamlari:
                </strong>
                <ol className="flex flex-col gap-1.5 pl-4 list-decimal text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed">
                  {selectedLesson.practice.taskSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-3 bg-[#FAF8F5] dark:bg-[#111912] rounded-xl border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2C3E2D] dark:text-[#D4DFD6]">
                <strong className="font-bold">Kutilayotgan Natija: </strong>
                {selectedLesson.practice.expectedOutput}
              </div>
            </div>

            {/* PRO TIPS */}
            <div className="bg-[#FAF8F5] dark:bg-[#111912] rounded-2xl p-5 border border-[#EBE7DF] dark:border-[#243326]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C3E2D] dark:text-[#D4DFD6] mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{isFrontendLesson ? "Professional Dasturchi Maslahati (Pro Tips)" : "Professional Dizayner Maslahati (Pro Tips)"}</span>
              </div>
              <ul className="flex flex-col gap-1.5 text-xs text-[#828282] dark:text-[#9FB1A2]">
                {selectedLesson.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#8BA88E]">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LESSON RATING & FEEDBACK */}
            <LessonRatingFeedbackView
              track="design"
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
              appUser={appUser}
            />

          </div>

        </div>

      </div>
    </div>
  );
};
