import React, { useState } from 'react';
import { 
  Palette, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Sparkles, 
  Lightbulb, 
  Wrench, 
  Clock, 
  Play, 
  ExternalLink,
  ChevronRight,
  Search,
  X,
  FileCheck,
  Bot
} from 'lucide-react';
import { DESIGN_CURRICULUM, DesignLesson, DesignModule } from '../data/designCurriculum';
import LessonRatingFeedbackView from './LessonRatingFeedback';
import { AppUser } from './LoginModal';

interface DesignCourseViewProps {
  onOpenAi: (lessonTitle?: string, context?: string) => void;
  completedLessons: number[];
  onToggleComplete: (id: number) => void;
  appUser?: AppUser | null;
}

export const DesignCourseView: React.FC<DesignCourseViewProps> = ({
  onOpenAi,
  completedLessons,
  onToggleComplete,
  appUser,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(101);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [personalNotes, setPersonalNotes] = useState<Record<number, string>>({});
  const [currentNote, setCurrentNote] = useState<string>('');

  // Find currently selected lesson
  const allLessons: DesignLesson[] = DESIGN_CURRICULUM.flatMap((m) => m.lessons);
  const selectedLesson = allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  // Filter lessons
  const filteredLessons = searchQuery.trim()
    ? allLessons.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectLesson = (id: number) => {
    setSelectedLessonId(id);
    const mod = DESIGN_CURRICULUM.find((m) => m.lessons.some((l) => l.id === id));
    if (mod) setActiveModuleId(mod.id);
  };

  const isCompleted = completedLessons.includes(selectedLesson.id);

  return (
    <div className="flex flex-col gap-8">
      {/* Banner / Header */}
      <div className="bg-[#2C3E2D] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg border border-[#8BA88E]/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#8BA88E] text-xs font-bold mb-3 border border-white/10">
            <Palette className="w-3.5 h-3.5" />
            <span>Grafik Dizayn va Vizual San'at Kursi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight">
            Zamonaviy Grafik Dizayner Kursi
          </h2>
          <p className="text-xs md:text-sm text-[#8BA88E] mt-2 leading-relaxed">
            Ranglar psixologiyasidan boshlab, Canva, Adobe Photoshop va Figma-da professional dizaynlar va shaxsiy portfolio yaratishgacha bo'lgan to'liq amaliy bosqichlar.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-white/80">
            <span className="bg-white/15 px-3 py-1 rounded-full font-bold">
              📚 3 ta asosiy modul
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full font-bold">
              🎨 Amaliy topshiriqlar & Keyslar
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full font-bold">
              💼 Behance portfolio
            </span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Palette className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MODULES & LESSONS LIST */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Module Selector Chips */}
          <div className="flex flex-col gap-2 bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
            <h4 className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider mb-1">
              O'quv Modullari
            </h4>
            <div className="flex flex-col gap-1.5">
              {DESIGN_CURRICULUM.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => { setActiveModuleId(mod.id); setSearchQuery(''); }}
                  className={`text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeModuleId === mod.id && !searchQuery
                      ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white shadow-sm'
                      : 'bg-[#FDFBF7] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#E6EAE7] hover:bg-[#F5F5F0] dark:hover:bg-[#18241B] border border-[#EBE7DF] dark:border-[#283A2C]'
                  }`}
                >
                  <span className="truncate pr-2">{mod.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    activeModuleId === mod.id && !searchQuery ? 'bg-white/20 text-white' : 'bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E]'
                  }`}>
                    {mod.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lessons List Container */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dizayn darslarini qidirish..."
                className="w-full pl-10 pr-9 py-2 bg-[#FDFBF7] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] rounded-2xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] placeholder:text-[#828282]/60 dark:placeholder:text-[#7A8E7E]"
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

            {/* List */}
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {(searchQuery.trim()
                ? filteredLessons
                : DESIGN_CURRICULUM.find((m) => m.id === activeModuleId)?.lessons || []
              ).map((lesson) => {
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
                          Dars #{lesson.id}
                        </span>
                        <span className={`text-[10px] ${isSel ? 'text-white/70' : 'text-[#828282] dark:text-[#9FB1A2]'}`}>
                          {lesson.duration}
                        </span>
                      </div>
                      <p className={`text-xs font-bold truncate ${isSel ? 'text-white' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'}`}>
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

        </div>

        {/* RIGHT COLUMN: ACTIVE LESSON CONTENT */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 md:p-8 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-6">
            
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-[#EBE7DF] dark:border-[#243326]">
              <div>
                <span className="text-[10px] text-[#8BA88E] font-bold uppercase tracking-widest">
                  {selectedLesson.module} · Dars #{selectedLesson.id}
                </span>
                <h2 className="text-xl md:text-2xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] font-bold mt-1">
                  {selectedLesson.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() =>
                    onOpenAi(
                      `Dizayn Darsi: ${selectedLesson.title}`,
                      `Mavzu: ${selectedLesson.title}. Tushuncha: ${selectedLesson.theory.mainConcept}. Qoidalar: ${selectedLesson.theory.rules.join(', ')}. Amaliy vazifa: ${selectedLesson.practice.taskTitle}.`
                    )
                  }
                  className="px-4 py-2 bg-[#2C3E2D] dark:bg-[#344E37] hover:bg-[#1C2C1D] text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5 text-[#8BA88E]" />
                  AI Ustozdan So'rash
                </button>

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
                Asboblar: {selectedLesson.tools.join(', ')}
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
                  Dizaynerning Oltin Qoidalari:
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

            {/* PRACTICAL TASK CARD */}
            <div className="bg-white dark:bg-[#152017] rounded-2xl p-6 border-2 border-[#8BA88E]/40 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                  <FileCheck className="w-4 h-4 text-[#8BA88E]" />
                  <span>Amaliy Topshiriq (Mustaqil Ish)</span>
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
                <span>Tajribali Dizayner Maslahati (Pro Tips)</span>
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
