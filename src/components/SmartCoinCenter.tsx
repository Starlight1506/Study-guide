import React, { useState, useEffect, useMemo } from 'react';
import {
  Coins,
  Trophy,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  Search,
  Copy,
  Check,
  TrendingUp,
  BookOpen,
  Calendar,
  Send,
  Flame,
  Crown,
  ChevronDown,
  ChevronUp,
  UserCheck,
  HeartHandshake
} from 'lucide-react';
import {
  SMART_COIN_CATEGORIES,
  SMART_COIN_CHARTER,
  SmartCoinCategory,
  SmartCoinRecord,
  getStoredSmartCoins,
  awardSmartCoin,
  getStudentCoinSummary,
  getSmartCoinLeaderboard,
  getCategoryInfo,
  generateAdminReportText,
} from '../services/smartCoinManager';
import { getStoredStudents, StudentAccount } from '../services/studentManager';

interface SmartCoinCenterProps {
  mode: 'teacher' | 'student';
  teacherName?: string;
  studentIdOrLogin?: string;
  studentName?: string;
  preselectedStudentId?: string;
}

export const SmartCoinCenter: React.FC<SmartCoinCenterProps> = ({
  mode,
  teacherName = 'Assadxoja',
  studentIdOrLogin = '',
  studentName = "O'quvchi",
  preselectedStudentId,
}) => {
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [coinRecords, setCoinRecords] = useState<SmartCoinRecord[]>([]);
  const [showCharter, setShowCharter] = useState<boolean>(mode === 'teacher');

  // Award Form State (Teacher only)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SmartCoinCategory>('faollik');
  const [coinAmount, setCoinAmount] = useState<number>(10);
  const [coinReason, setCoinReason] = useState<string>(
    SMART_COIN_CATEGORIES[0].sampleReasons[0]
  );
  const [formError, setFormError] = useState<string>('');
  const [awardSuccessToast, setAwardSuccessToast] = useState<string | null>(null);

  // Leaderboard & Journal Filters
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [journalSearch, setJournalSearch] = useState<string>('');
  const [journalCategoryFilter, setJournalCategoryFilter] = useState<string>('all');
  const [copiedReport, setCopiedReport] = useState<'weekly' | 'monthly' | null>(null);

  const loadAll = () => {
    const loadedStudents = getStoredStudents();
    const loadedCoins = getStoredSmartCoins();
    setStudents(loadedStudents);
    setCoinRecords(loadedCoins);
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
    } else if (loadedStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(loadedStudents[0].id);
    }
  };

  useEffect(() => {
    loadAll();
    const handleCoinsUpdated = () => {
      setCoinRecords(getStoredSmartCoins());
      setStudents(getStoredStudents());
    };
    window.addEventListener('smart_coins_updated', handleCoinsUpdated);
    window.addEventListener('students_updated', handleCoinsUpdated);
    return () => {
      window.removeEventListener('smart_coins_updated', handleCoinsUpdated);
      window.removeEventListener('students_updated', handleCoinsUpdated);
    };
  }, [preselectedStudentId]);

  const handleSelectCategory = (catId: SmartCoinCategory) => {
    setSelectedCategory(catId);
    const info = getCategoryInfo(catId);
    setCoinAmount(info.defaultCoins);
    if (info.sampleReasons.length > 0) {
      setCoinReason(info.sampleReasons[0]);
    }
  };

  const handleAwardCoin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (mode !== 'teacher') {
      setFormError("Faqat o'qituvchi akkauntiga ega ustozlar SMART COIN bera oladi!");
      return;
    }

    const targetStudent = students.find((s) => s.id === selectedStudentId);
    if (!targetStudent) {
      setFormError("Iltimos, avval o'quvchini tanlang!");
      return;
    }

    if (!coinAmount || coinAmount <= 0) {
      setFormError(
        "Qoida: Koinlarni jazo sifatida qaytarib olmang! Faqat musbat miqdorda (+1 va undan yuqori) SMART COIN bering."
      );
      return;
    }

    if (!coinReason.trim()) {
      setFormError("Qoida: Har bir koinning aniq sababi bo'lsin! Iltimos, sababni kiriting.");
      return;
    }

    try {
      const created = awardSmartCoin({
        studentId: targetStudent.id,
        studentName: targetStudent.fullName,
        studentLogin: targetStudent.login,
        studentGradeClass: targetStudent.gradeClass,
        amount: coinAmount,
        category: selectedCategory,
        reason: coinReason.trim(),
        teacherName,
      });

      setCoinRecords(getStoredSmartCoins());
      setAwardSuccessToast(
        `🎉 ${targetStudent.fullName} ga +${created.amount} SMART COIN berildi! (${getCategoryInfo(selectedCategory).label})`
      );
      setTimeout(() => setAwardSuccessToast(null), 4000);
    } catch (err: any) {
      setFormError(err.message || "Xatolik yuz berdi");
    }
  };

  const handleCopyAdminReport = (period: 'weekly' | 'monthly') => {
    const text = generateAdminReportText(period);
    navigator.clipboard.writeText(text);
    setCopiedReport(period);
    setTimeout(() => setCopiedReport(null), 2500);
  };

  // Student personal summary (when in student mode)
  const mySummary = useMemo(() => {
    return getStudentCoinSummary(studentIdOrLogin, studentName);
  }, [studentIdOrLogin, studentName, coinRecords]);

  // Leaderboard entries
  const leaderboard = useMemo(() => {
    return getSmartCoinLeaderboard(leaderboardPeriod);
  }, [leaderboardPeriod, coinRecords, students]);

  // Filtered journal records
  const filteredJournal = useMemo(() => {
    return coinRecords.filter((rec) => {
      const matchesCat =
        journalCategoryFilter === 'all' || rec.category === journalCategoryFilter;
      const q = journalSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        rec.studentName.toLowerCase().includes(q) ||
        rec.reason.toLowerCase().includes(q) ||
        (rec.studentGradeClass && rec.studentGradeClass.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [coinRecords, journalCategoryFilter, journalSearch]);

  const totalCoinsInSchool = useMemo(
    () => coinRecords.reduce((sum, r) => sum + r.amount, 0),
    [coinRecords]
  );

  const activeCategoryInfo = getCategoryInfo(selectedCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. HERO BANNER & OFFICIAL SMART HIGH SCHOOL CHARTER */}
      <div className="bg-gradient-to-br from-[#2C3E2D] via-[#1F3121] to-[#162418] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-amber-400/30 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Coins className="w-80 h-80 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>SMART HIGH SCHOOL — SMART COIN TIZIMI</span>
            </div>

            <button
              onClick={() => setShowCharter(!showCharter)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/15"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{showCharter ? 'Nizomni yopish' : "SMART COIN Nizomi va Qoidalari"}</span>
              {showCharter ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif italic font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>🪙 SMART COIN — Bilim, Intizom va Yutuqlar Ramzi!</span>
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-2 leading-relaxed">
              {SMART_COIN_CHARTER.intro}
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                Jami Berilgan Koinlar
              </span>
              <p className="text-xl font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span>{totalCoinsInSchool}</span>
                <span className="text-xs text-amber-300 font-bold">SC</span>
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                Jurnaldagi Qaydlar
              </span>
              <p className="text-xl font-bold text-white mt-0.5">
                {coinRecords.length} ta
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                Hafta Faoli
              </span>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {leaderboard[0]?.summary.weeklyCoins > 0
                  ? `🔥 ${leaderboard[0].student.fullName} (+${leaderboard[0].summary.weeklyCoins} SC)`
                  : "Aniqlanmoqda..."}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                Oy Chempioni
              </span>
              <p className="text-sm font-bold text-white mt-1 truncate">
                {leaderboard[0]?.summary.monthlyCoins > 0
                  ? `👑 ${leaderboard[0].student.fullName} (+${leaderboard[0].summary.monthlyCoins} SC)`
                  : "Aniqlanmoqda..."}
              </p>
            </div>
          </div>

          {/* Expandable Official Charter Card */}
          {showCharter && (
            <div className="mt-2 bg-black/25 rounded-2xl p-5 border border-amber-400/30 flex flex-col gap-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-sm md:text-base font-bold text-amber-300 tracking-wide">
                  📢 {SMART_COIN_CHARTER.title}
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  Rasmiy Nizom
                </span>
              </div>

              <p className="text-xs text-white/90 font-semibold">
                {SMART_COIN_CHARTER.subtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SMART_COIN_CHARTER.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs text-white/95"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-[#1A2E1C] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-xs text-amber-100 leading-relaxed">
                <p className="font-bold mb-1">💡 {SMART_COIN_CHARTER.note}</p>
                <p className="text-white/90">{SMART_COIN_CHARTER.symbolism}</p>
                <p className="font-bold text-amber-300 mt-1.5 tracking-wider">
                  🚀 {SMART_COIN_CHARTER.motto}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. STUDENT PERSONAL WALLET (WHEN IN STUDENT MODE) */}
      {mode === 'student' && (
        <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border-2 border-amber-400/40 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBE7DF] dark:border-[#243326]">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Coins className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Mening SMART COIN Hamyonim
                  </span>
                  <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                    {mySummary.levelBadge}
                  </span>
                </div>
                <h3 className="text-xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mt-1">
                  {studentName} — Shaxsiy Yutuqlar va Koinlar Balansi
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md text-center">
                <span className="text-[10px] uppercase font-bold block opacity-90">
                  Jami Balansim
                </span>
                <span className="text-2xl font-extrabold tracking-tight">
                  🪙 {mySummary.totalCoins} SC
                </span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-center">
                <span className="text-[10px] uppercase font-bold text-[#828282] dark:text-[#9FB1A2] block">
                  Shu Haftada
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  +{mySummary.weeklyCoins} SC
                </span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-center">
                <span className="text-[10px] uppercase font-bold text-[#828282] dark:text-[#9FB1A2] block">
                  Shu Oyda
                </span>
                <span className="text-lg font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                  +{mySummary.monthlyCoins} SC
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown for Student */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SMART_COIN_CATEGORIES.map((cat) => {
              const earned = mySummary.categoryBreakdown[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-1"
                >
                  <span className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] flex items-center gap-1.5">
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.shortLabel}</span>
                  </span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                    +{earned} SC
                  </span>
                </div>
              );
            })}
          </div>

          {/* Student's personal coin awards history */}
          {mySummary.recentAwards.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-xs font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider">
                Menga Berilgan SMART COIN Tarixi ({mySummary.recentAwards.length} ta):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {mySummary.recentAwards.map((rec) => {
                  const cat = getCategoryInfo(rec.category);
                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] flex items-start justify-between gap-3"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                            {cat.emoji} {cat.label}
                          </span>
                          <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                            • Ustoz {rec.teacherName}
                          </span>
                        </div>
                        <p className="text-xs text-[#2D2D2D] dark:text-[#D4DFD6] font-medium">
                          "{rec.reason}"
                        </p>
                        <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                          {new Date(rec.awardedAt).toLocaleString('uz-UZ')}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs shrink-0">
                        +{rec.amount} SC
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TEACHER AWARD FORM + LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (TEACHER ONLY): AWARD SMART COIN FORM */}
        {mode === 'teacher' && (
          <div className="lg:col-span-5 bg-white dark:bg-[#152017] rounded-3xl p-6 border-2 border-amber-400/40 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#EBE7DF] dark:border-[#243326] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    O'quvchiga SMART COIN Berish
                  </h3>
                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                    Ustoz: <strong>{teacherName}</strong> • Jurnalga avtomatik yoziladi
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                Faqat Ustoz Uchun
              </span>
            </div>

            {awardSuccessToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{awardSuccessToast}</span>
              </div>
            )}

            {formError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleAwardCoin} className="flex flex-col gap-4">
              {/* 1. Select Student */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4DFD6] block mb-1.5">
                  1. O'quvchini tanlang:
                </label>
                {students.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs text-[#828282]">
                    Hozircha ro'yxatda o'quvchilar yo'q. Avval "O'quvchilar & Loginlar" bo'limidan o'quvchi qo'shing.
                  </div>
                ) : (
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  >
                    {students.map((st) => {
                      const stCoins = getStudentCoinSummary(st.id, st.fullName).totalCoins;
                      return (
                        <option key={st.id} value={st.id}>
                          {st.fullName} ({st.gradeClass}) — 🪙 {stCoins} SC
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* 2. Select Category */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4DFD6] block mb-1.5">
                  2. Rag'batlantirish yo'nalishi (Mezon):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SMART_COIN_CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          active
                            ? 'bg-[#2C3E2D] dark:bg-[#344E37] text-white border-[#2C3E2D] shadow-sm'
                            : 'bg-[#FAF8F5] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#D4DFD6] border-[#EBE7DF] dark:border-[#283A2C] hover:border-[#8BA88E]'
                        }`}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate">{cat.shortLabel}</p>
                          <span className={`text-[10px] ${active ? 'text-amber-300' : 'text-[#828282]'}`}>
                            Tavsiya: +{cat.defaultCoins} SC
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-1.5 italic">
                  {activeCategoryInfo.description}
                </p>
              </div>

              {/* 3. Select Coin Amount (Strictly Positive) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4DFD6]">
                    3. SMART COIN miqdori:
                  </label>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    🛡️ Jazo sifatida koin ayirilmaydi
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {[1, 5, 10, 15, 20, 25, 50].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setCoinAmount(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        coinAmount === amt
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-[#FAF8F5] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#D4DFD6] border border-[#EBE7DF] dark:border-[#283A2C] hover:border-amber-400'
                      }`}
                    >
                      +{amt} SC
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min={1}
                  max={500}
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
                />
              </div>

              {/* 4. Exact Reason (Mandatory per Charter) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4DFD6]">
                    4. Koin berishning aniq sababi (Majburiy):
                  </label>
                  <span className="text-[10px] text-[#8BA88E] font-bold">
                    Jurnalda qayd etiladi
                  </span>
                </div>

                {/* Quick sample reason chips */}
                <div className="flex flex-col gap-1.5 mb-2">
                  {activeCategoryInfo.sampleReasons.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCoinReason(sample)}
                      className={`text-left px-3 py-1.5 rounded-xl text-[11px] transition border ${
                        coinReason === sample
                          ? 'bg-[#8BA88E]/20 border-[#8BA88E] text-[#1A2E1C] dark:text-white font-bold'
                          : 'bg-[#FAF8F5] dark:bg-[#101712] border-[#EBE7DF] dark:border-[#283A2C] text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D]'
                      }`}
                    >
                      ✨ "{sample}"
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={coinReason}
                  onChange={(e) => setCoinReason(e.target.value)}
                  placeholder="Har bir koinning aniq sababini yozing..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={students.length === 0}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>+{coinAmount} SMART COIN Taqdim Etish va Jurnalga Yozish</span>
              </button>
            </form>

            {/* Administration Report Copy Box */}
            <div className="pt-4 border-t border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-2.5">
              <span className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider">
                📋 Ma'muriyat Uchun Hisobot Nusxalash:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyAdminReport('weekly')}
                  className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] hover:bg-[#F5F5F0] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#2C3E2D] dark:text-[#D4DFD6] flex items-center justify-center gap-1.5 transition"
                >
                  {copiedReport === 'weekly' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Haftalik Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8BA88E]" />
                      <span>Haftalik Natijalar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyAdminReport('monthly')}
                  className="px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] hover:bg-[#F5F5F0] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#2C3E2D] dark:text-[#D4DFD6] flex items-center justify-center gap-1.5 transition"
                >
                  {copiedReport === 'monthly' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Oylik Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>Oylik Chempionlar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: WEEKLY ACTIVE & MONTHLY SMART COIN CHAMPIONS LEADERBOARD */}
        <div className={mode === 'teacher' ? 'lg:col-span-7 flex flex-col gap-6' : 'lg:col-span-12 flex flex-col gap-6'}>
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE7DF] dark:border-[#243326]">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    {leaderboardPeriod === 'weekly'
                      ? '🔥 Hafta Faol O\'quvchilari Reytingi'
                      : leaderboardPeriod === 'monthly'
                        ? '👑 Oyning SMART COIN Chempionlari'
                        : '🏆 Umumiy SMART COIN Reytingi'}
                  </h3>
                </div>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                  Har hafta faol o'quvchilar aniqlanadi, har oy esa SMART COIN chempionlari taqdirlanadi!
                </p>
              </div>

              {/* Period Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#101712] p-1 rounded-xl border border-[#EBE7DF] dark:border-[#283A2C] self-start">
                <button
                  onClick={() => setLeaderboardPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    leaderboardPeriod === 'weekly'
                      ? 'bg-[#2C3E2D] text-white shadow-xs'
                      : 'text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  🔥 Shu Hafta
                </button>
                <button
                  onClick={() => setLeaderboardPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    leaderboardPeriod === 'monthly'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  👑 Shu Oy
                </button>
                <button
                  onClick={() => setLeaderboardPeriod('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    leaderboardPeriod === 'all'
                      ? 'bg-[#2C3E2D] text-white shadow-xs'
                      : 'text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  📊 Barchasi
                </button>
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#828282] dark:text-[#9FB1A2]">
                Hozircha o'quvchilar ro'yxati bo'sh.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {leaderboard.map((item) => {
                  const isTop1 = item.rank === 1 && item.periodCoins > 0;
                  const isTop2 = item.rank === 2 && item.periodCoins > 0;
                  const isTop3 = item.rank === 3 && item.periodCoins > 0;

                  return (
                    <div
                      key={item.student.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isTop1
                          ? 'bg-amber-500/10 border-amber-400/50 shadow-xs'
                          : 'bg-[#FAF8F5] dark:bg-[#101712] border-[#EBE7DF] dark:border-[#283A2C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 ${
                            isTop1
                              ? 'bg-amber-500 text-white shadow-sm'
                              : isTop2
                                ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                                : isTop3
                                  ? 'bg-amber-700/80 text-white'
                                  : 'bg-white dark:bg-[#18241B] text-[#828282] border border-[#EBE7DF] dark:border-[#283A2C]'
                          }`}
                        >
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${item.rank}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                              {item.student.fullName}
                            </p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] font-bold">
                              {item.student.gradeClass}
                            </span>
                            {item.isWeeklyActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                                🔥 Hafta Faoli
                              </span>
                            )}
                            {item.isMonthlyChampion && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                                👑 Oy Chempioni
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                            <span>{item.summary.levelBadge}</span>
                            <span>•</span>
                            <span>{item.summary.awardsCount} marta rag'batlantirilgan</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 block">
                            🪙 {item.periodCoins} SC
                          </span>
                          <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                            Jami: {item.summary.totalCoins} SC
                          </span>
                        </div>

                        {mode === 'teacher' && (
                          <button
                            type="button"
                            onClick={() => setSelectedStudentId(item.student.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white text-[11px] font-bold transition shrink-0"
                          >
                            + Koin berish
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. SMART COIN JOURNAL (BERILGAN KOINLAR JURNALI) */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE7DF] dark:border-[#243326]">
              <div>
                <h3 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8BA88E]" />
                  <span>SMART COIN Jurnali (Berilgan Koinlar va Sabablari)</span>
                </h3>
                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                  Qoida: Berilgan barcha koinlar aniq sababi bilan jurnalda shaffof qayd etiladi
                </p>
              </div>

              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full self-start sm:self-center">
                Jami: {filteredJournal.length} ta qayd
              </span>
            </div>

            {/* Search & Category Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#828282] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder="O'quvchi ismi yoki sabab bo'yicha qidirish..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs text-[#2D2D2D] dark:text-[#E6EAE7]"
                />
              </div>

              <select
                value={journalCategoryFilter}
                onChange={(e) => setJournalCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
              >
                <option value="all">Barcha mezonlar ({coinRecords.length})</option>
                {SMART_COIN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {filteredJournal.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#828282] dark:text-[#9FB1A2] bg-[#FAF8F5] dark:bg-[#101712] rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C] p-4">
                Hozircha jurnalda SMART COIN qaydlari mavjud emas.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredJournal.map((rec) => {
                  const cat = getCategoryInfo(rec.category);
                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] flex items-start justify-between gap-3"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                            {rec.studentName}
                          </span>
                          {rec.studentGradeClass && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] font-bold">
                              {rec.studentGradeClass}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                            {cat.emoji} {cat.shortLabel}
                          </span>
                        </div>

                        <p className="text-xs text-[#2D2D2D] dark:text-[#D4DFD6]">
                          <strong className="text-[#828282] dark:text-[#9FB1A2]">Sabab:</strong> "{rec.reason}"
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                          <span>👨‍🏫 Ustoz: {rec.teacherName}</span>
                          <span>•</span>
                          <span>{new Date(rec.awardedAt).toLocaleString('uz-UZ')}</span>
                        </div>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-extrabold text-xs shrink-0 shadow-xs">
                        +{rec.amount} SC
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartCoinCenter;
