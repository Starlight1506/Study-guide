import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Award, 
  Info,
  Clock,
  Edit3
} from 'lucide-react';
import { 
  LessonRatingFeedback, 
  getStoredRatings, 
  addOrUpdateRating, 
  getStoredStudents, 
  StudentAccount,
  getLessonRatingStats
} from '../services/studentManager';
import { AppUser } from './LoginModal';

interface LessonRatingFeedbackProps {
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  appUser?: AppUser | null;
  onRatingSubmitted?: (rating: LessonRatingFeedback) => void;
}

const RATING_LABELS: Record<number, { text: string; color: string; desc: string }> = {
  1: { 
    text: "Juda qiyin / Tushunarsiz", 
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40",
    desc: "Mavzu ancha murakkab keldi, ustozdan qo'shimcha yordam kerak"
  },
  2: { 
    text: "Qoniqarsiz", 
    color: "text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/40",
    desc: "Ayrim tushunchalar yetarli ochilmagan yoki qiyinchilik tug'dirdi"
  },
  3: { 
    text: "O'rtacha / Tushunarli", 
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40",
    desc: "Umumiy tushundim, lekin mustaqil amaliyotda ko'proq mashq kerak"
  },
  4: { 
    text: "Yaxshi va Foydali", 
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40",
    desc: "Mavzu yaxshi o'zlashtirildi, amaliy topshiriqlar qiziqarli"
  },
  5: { 
    text: "A'lo darajada / Juda qiziqarli!", 
    color: "text-green-600 dark:text-[#8BA88E] bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/15 border-[#8BA88E]/30",
    desc: "Hammasi tushunarli, ertak/keys va laboratoriya ishi ajoyib chiqdi!"
  },
};

export default function LessonRatingFeedbackView({
  track,
  lessonId,
  lessonTitle,
  appUser,
  onRatingSubmitted
}: LessonRatingFeedbackProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [customStudentName, setCustomStudentName] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<StudentAccount[]>([]);
  const [lessonStats, setLessonStats] = useState(() => getLessonRatingStats(track, lessonId));

  // Determine current active student
  const activeStudent = useMemo(() => {
    if (!studentsList.length) return null;
    if (appUser?.name) {
      const match = studentsList.find(
        (s) =>
          s.fullName.toLowerCase() === appUser.name.toLowerCase() ||
          s.login.toLowerCase() === appUser.name.toLowerCase() ||
          s.id === appUser.uid
      );
      if (match) return match;
    }
    if (selectedStudentId) {
      return studentsList.find((s) => s.id === selectedStudentId) || null;
    }
    return studentsList[0] || null;
  }, [studentsList, appUser, selectedStudentId]);

  // Load students & find existing rating
  const refreshState = () => {
    const list = getStoredStudents();
    setStudentsList(list);

    const stats = getLessonRatingStats(track, lessonId);
    setLessonStats(stats);

    // Check if current student already rated
    const allRatings = getStoredRatings();
    const candidateId = activeStudent?.id || appUser?.uid;
    const candidateLogin = activeStudent?.login || appUser?.name;

    const existing = allRatings.find(
      (r) =>
        r.track === track &&
        r.lessonId === lessonId &&
        ((candidateId && r.studentId === candidateId) ||
          (candidateLogin && r.studentLogin?.toLowerCase() === candidateLogin.toLowerCase()))
    );

    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
      setIsEditing(false);
    } else {
      setRating(5);
      setComment('');
      setIsEditing(true);
    }
  };

  useEffect(() => {
    refreshState();

    const handleRatingUpdate = () => {
      setLessonStats(getLessonRatingStats(track, lessonId));
    };
    window.addEventListener('lesson_ratings_updated', handleRatingUpdate);
    return () => window.removeEventListener('lesson_ratings_updated', handleRatingUpdate);
  }, [track, lessonId, activeStudent?.id]);

  // Existing rating by this student for this lesson
  const existingUserRating = useMemo(() => {
    if (!lessonStats.ratings.length) return null;
    const candidateId = activeStudent?.id || appUser?.uid;
    const candidateLogin = activeStudent?.login || appUser?.name;

    return (
      lessonStats.ratings.find(
        (r) =>
          (candidateId && r.studentId === candidateId) ||
          (candidateLogin && r.studentLogin?.toLowerCase() === candidateLogin.toLowerCase())
      ) || null
    );
  }, [lessonStats.ratings, activeStudent, appUser]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const studentName = activeStudent?.fullName || customStudentName.trim() || appUser?.name || "O'quvchi";
    const studentId = activeStudent?.id || `guest_${Date.now()}`;
    const studentLogin = activeStudent?.login || appUser?.name;
    const studentGradeClass = activeStudent?.gradeClass || "5-sinf";

    const saved = addOrUpdateRating({
      studentId,
      studentName,
      studentLogin,
      studentGradeClass,
      track,
      lessonId,
      lessonTitle,
      rating,
      comment: comment.trim() || "Dars mazmuni tushunarli va qiziqarli bo'ldi.",
    });

    setLessonStats(getLessonRatingStats(track, lessonId));
    setIsSuccess(true);
    setIsEditing(false);

    if (onRatingSubmitted) {
      onRatingSubmitted(saved);
    }

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  const activeRatingValue = hoverRating || rating;
  const activeLabelInfo = RATING_LABELS[activeRatingValue] || RATING_LABELS[5];

  return (
    <div className="bg-white dark:bg-[#121B14] rounded-3xl p-6 sm:p-8 border-2 border-[#8BA88E]/30 dark:border-[#8BA88E]/20 shadow-sm relative overflow-hidden transition-all">
      {/* Decorative background glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#8BA88E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE7DF] dark:border-[#223125]">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C3E2D] to-[#3C553E] text-white flex items-center justify-center shrink-0 shadow-md">
            <Star className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#A7C2AA] border border-[#8BA88E]/25 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Dars Yakuni Baholash Tizimi</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
              Darsni Baholash va Fikr Bildirish
            </h3>
            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
              Ushbu dars sizga qanchalik yoqdi? O'z bahongizni bering va qisqa fikr yozing — bahoyingiz ustoz kabinetida ko'rinadi!
            </p>
          </div>
        </div>

        {/* OVERALL LESSON RATING BADGE */}
        {lessonStats.totalCount > 0 && (
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#18231B] border border-[#EBE7DF] dark:border-[#27372A] shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7]">
                {lessonStats.averageRating}
              </span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(lessonStats.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold mt-0.5">
              {lessonStats.totalCount} ta o'quvchi bahosi
            </span>
          </div>
        )}
      </div>

      {/* SUCCESS TOAST BANNER */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold block">Katta rahmat! Bahoyingiz muvaffaqiyatli saqlandi ✓</strong>
              <span className="text-[11px] opacity-90">
                Sizning {rating} yulduzli bahoyingiz va fikringiz o'qituvchi boshqaruv panelida qayd etildi.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDENT IDENTITY SELECTION */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#162119] border border-[#EBE7DF] dark:border-[#253528]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center font-bold text-xs">
            {activeStudent ? activeStudent.fullName.charAt(0) : '👤'}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#828282] dark:text-[#9FB1A2] block">
              Fikr bildiruvchi o'quvchi:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                {activeStudent ? activeStudent.fullName : customStudentName || "Mehmon O'quvchi"}
              </span>
              {activeStudent && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#A7C2AA]">
                  {activeStudent.gradeClass}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Allow quick switch if teacher or demo or multiple students */}
        {(!appUser || appUser.role === 'teacher') && studentsList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">O'quvchini tanlash:</span>
            <select
              value={activeStudent?.id || ''}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#1D2B20] border border-[#EBE7DF] dark:border-[#2F4433] text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] font-medium"
            >
              {studentsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.gradeClass})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* EXISTING SUBMITTED REVIEW CARD (VIEW MODE) */}
      {existingUserRating && !isEditing ? (
        <div className="mt-6 p-5 rounded-2xl bg-[#F5F5F0]/70 dark:bg-[#162218] border border-[#EBE7DF] dark:border-[#27392B] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= existingUserRating.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${RATING_LABELS[existingUserRating.rating]?.color || ''}`}>
                {RATING_LABELS[existingUserRating.rating]?.text}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-[#1D2C20] hover:bg-[#EBE7DF] dark:hover:bg-[#283C2C] text-[#2C3E2D] dark:text-[#A7C2AA] border border-[#8BA88E]/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#8BA88E]" />
              <span>O'zgartirish</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#263729] text-xs text-[#2D2D2D] dark:text-[#D4DFD6] leading-relaxed italic">
            "{existingUserRating.comment}"
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#828282] dark:text-[#9FB1A2] pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Yuborilgan: {new Date(existingUserRating.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ustoz ko'rishi mumkin
            </span>
          </div>
        </div>
      ) : (
        /* INTERACTIVE RATING & FEEDBACK FORM (EDIT MODE) */
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          
          {/* STAR SELECTOR */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-1.5">
              <span>1. Darsni yulduzcha orqali baholang (1 dan 5 gacha):</span>
            </label>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#17231A] p-2 rounded-2xl border border-[#EBE7DF] dark:border-[#27372A]">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFilled = starIndex <= (hoverRating || rating);
                  return (
                    <button
                      type="button"
                      key={starIndex}
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-2 sm:p-2.5 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-transform active:scale-90 group"
                      title={`${starIndex} yulduzcha`}
                      aria-label={`${starIndex} yulduzcha`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm scale-105'
                            : 'text-gray-300 dark:text-gray-600 group-hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* RATING VERDICT BADGE */}
              <div className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col ${activeLabelInfo.color}`}>
                <span className="font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {activeRatingValue} / 5 — {activeLabelInfo.text}
                </span>
                <span className="text-[10px] font-normal opacity-90 mt-0.5">
                  {activeLabelInfo.desc}
                </span>
              </div>
            </div>
          </div>

          {/* COMMENT TEXTAREA */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#8BA88E]" />
                <span>2. Dars haqida qisqa fikringiz yoki taassurotingiz:</span>
              </label>
              <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                {comment.length}/350 ta belgi
              </span>
            </div>

            <textarea
              rows={3}
              maxLength={350}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Masalan: Darsdagi klaviatura mashqlari va protsessor haqidagi misollar juda tushunarli bo'ldi. Amaliy ishni muvaffaqiyatli bajardim..."
              className="w-full px-4 py-3 rounded-2xl border border-[#EBE7DF] dark:border-[#27382B] bg-[#FAF8F5] dark:bg-[#141E16] text-[#2D2D2D] dark:text-[#E6EAE7] text-xs focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 placeholder:text-[#828282]/60 dark:placeholder:text-[#7A8E7E]/60 leading-relaxed shadow-inner"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8BA88E]" />
              <span>Ushbu baho va fikr o'qituvchi panelida darhol saqlanadi</span>
            </div>

            <div className="flex items-center gap-2">
              {existingUserRating && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#FAF8F5] dark:bg-[#1B271D] hover:bg-[#EBE7DF] text-[#2D2D2D] dark:text-[#D4DFD6] transition"
                >
                  Bekor qilish
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#2C3E2D] to-[#3C553E] hover:from-[#1E2E1F] hover:to-[#2C3E2D] text-white rounded-full text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>{existingUserRating ? "Bahoni Yangilash" : "Bahoni Ustozga Yuborish"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* COMMUNITY LESSON REVIEWS COLLAPSIBLE */}
      {lessonStats.ratings.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#EBE7DF] dark:border-[#223125]">
          <button
            type="button"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA] hover:text-[#1A2E1C] transition py-1"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8BA88E]" />
              <span>Ushbu darsga o'quvchilar tomonidan bildirilgan fikrlar ({lessonStats.ratings.length})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#828282] dark:text-[#9FB1A2]">
              <span>{showAllReviews ? "Yashirish" : "Ko'rish"}</span>
              {showAllReviews ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAllReviews && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-col gap-3"
            >
              {lessonStats.ratings.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243427] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center font-bold text-xs">
                        {rev.studentName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                        {rev.studentName}
                      </span>
                      {rev.studentGradeClass && (
                        <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                          ({rev.studentGradeClass})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <span className="text-[10px] text-[#828282] dark:text-[#8B9D8F] text-right">
                    {new Date(rev.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
