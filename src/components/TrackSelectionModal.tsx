import React from 'react';
import { 
  Laptop, 
  Palette, 
  Code2,
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X
} from 'lucide-react';

export type CourseTrack = 'literacy' | 'design';

interface TrackSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
  studentName?: string;
  onSelectTrack: (track: CourseTrack, subCategory?: 'all' | 'design' | 'frontend') => void;
}

export const TrackSelectionModal: React.FC<TrackSelectionModalProps> = ({
  isOpen,
  onClose,
  canClose = false,
  studentName,
  onSelectTrack,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] dark:bg-[#121B14] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-[#2C3E2D]/20 dark:border-[#2D3E30] relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#1C281F] rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="bg-[#2C3E2D] dark:bg-[#1C2C1E] text-white p-6 sm:p-8 text-center relative border-b border-[#243326]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#8BA88E] text-xs font-bold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O'quvchi Yo'nalishini Tanlash</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic font-bold">
            {studentName ? `Xush kelibsiz, ${studentName}!` : 'Xush kelibsiz!'}
          </h2>
          <p className="text-xs sm:text-sm text-[#8BA88E] mt-2 max-w-lg mx-auto">
            Qaysi kursni o'rganishni xohlaysiz? O'zingizga ma'qul bo'limni tanlang. 
            (Keyinchalik istalgan payt almashtirishingiz mumkin)
          </p>
        </div>

        {/* Options Grid (3 Courses) */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* OPTION 1: KOMPYUTER SAVODXONLIGI */}
          <div className="bg-white dark:bg-[#18241B] rounded-2xl p-6 border-2 border-[#EBE7DF] dark:border-[#283A2C] hover:border-[#8BA88E] dark:hover:border-[#8BA88E] hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
               onClick={() => onSelectTrack('literacy')}>
            <div className="absolute -top-3 right-5 bg-[#8BA88E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              3 Oylik Asosiy
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center mb-4 group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors">
                <Laptop className="w-6 h-6" />
              </div>

              <h3 className="font-serif italic text-lg font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mb-2 group-hover:text-[#2C3E2D] dark:group-hover:text-[#8BA88E]">
                Kompyuter Savodxonligi
              </h3>

              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] leading-relaxed mb-4">
                Kompyuter arxitekturasi, tezkor klaviatura, operatsion tizimlar, MS Office, xavfsiz internet va kiberxavfsizlik asoslari.
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#F5F5F0] dark:border-[#243326]">
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>36 ta to'liq darslik silabusi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>1-4 va 5-9 sinflar metodikasi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>Interaktiv o'yinlar & PDF Konspekt</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onSelectTrack('literacy'); }}
              className="mt-6 w-full py-2.5 bg-[#2C3E2D] dark:bg-[#2F4632] group-hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Savodxonlikni Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OPTION 2: GRAFIK DIZAYN (CANVA & FIGMA) */}
          <div className="bg-white dark:bg-[#18241B] rounded-2xl p-6 border-2 border-[#EBE7DF] dark:border-[#283A2C] hover:border-[#8BA88E] dark:hover:border-[#8BA88E] hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
               onClick={() => onSelectTrack('design', 'design')}>
            <div className="absolute -top-3 right-5 bg-[#2C3E2D] dark:bg-[#344E37] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              1-2 Modul · 24 Dars
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center mb-4 group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors">
                <Palette className="w-6 h-6" />
              </div>

              <h3 className="font-serif italic text-lg font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mb-2 group-hover:text-[#2C3E2D] dark:group-hover:text-[#8BA88E]">
                Grafik & UI/UX Dizayn
              </h3>

              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] leading-relaxed mb-4">
                1-Modul: Canva tezkor grafik dizayn va brending (12 dars). 2-Modul: Figma professional UI/UX veb-dizayn va prototiplash (12 dars).
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#F5F5F0] dark:border-[#243326]">
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>Canva SMM, Poligrafiya & AI</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>Figma Auto Layout & Components</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>Landing Page & Interaktiv Prototip</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onSelectTrack('design', 'design'); }}
              className="mt-6 w-full py-2.5 bg-[#8BA88E] group-hover:bg-[#739076] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Dizayn Kursini Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OPTION 3: FRONTEND DASTURLASH (HTML5 & CSS3) */}
          <div className="bg-white dark:bg-[#18241B] rounded-2xl p-6 border-2 border-[#EBE7DF] dark:border-[#283A2C] hover:border-[#8BA88E] dark:hover:border-[#8BA88E] hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
               onClick={() => onSelectTrack('design', 'frontend')}>
            <div className="absolute -top-3 right-5 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Yangi · 3-4 Modul
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center mb-4 group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors">
                <Code2 className="w-6 h-6" />
              </div>

              <h3 className="font-serif italic text-lg font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mb-2 group-hover:text-[#2C3E2D] dark:group-hover:text-[#8BA88E]">
                Frontend Dasturlash
              </h3>

              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] leading-relaxed mb-4">
                3-Modul: HTML5 veb-sahifa tuzilishi va semantikasi (12 dars). 4-Modul: CSS3 bezatish, Flexbox, Animatsiya va Responsive (12 dars).
              </p>

              <div className="flex flex-col gap-2 pt-2 border-t border-[#F5F5F0] dark:border-[#243326]">
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>VS Code va Semantik HTML5 teglar</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>CSS3 Box Model, Flexbox & Keyframes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span>Figma-to-Code Responsive Sayt</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onSelectTrack('design', 'frontend'); }}
              className="mt-6 w-full py-2.5 bg-[#2C3E2D] dark:bg-[#344E37] group-hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Frontend Kursini Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-[#F5F5F0] dark:bg-[#141F16] p-4 text-center border-t border-[#EBE7DF] dark:border-[#243326] text-[11px] text-[#828282] dark:text-[#9FB1A2]">
          💡 Barcha kurs darslari amaliy topshiriqlar, uyga vazifalar va ustoz nazoratiga asoslangan.
        </div>
      </div>
    </div>
  );
};
