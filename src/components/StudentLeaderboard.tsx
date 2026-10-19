import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  ShieldCheck
} from 'lucide-react';
import {
  StudentAccount,
  LeaderboardEntry,
  getLeaderboardData,
  getStudentRank
} from '../services/studentManager';
import { getGroupByStudent } from '../services/scheduleManager';

interface StudentLeaderboardProps {
  currentStudentId?: string;
  currentStudentLogin?: string;
  onSelectStudent?: (student: StudentAccount) => void;
  className?: string;
}

export default function StudentLeaderboard({
  currentStudentId,
  currentStudentLogin,
  onSelectStudent,
  className = '',
}: StudentLeaderboardProps) {
  const [trackFilter, setTrackFilter] = useState<'all' | 'literacy' | 'design'>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'points' | 'average' | 'mastered'>('points');
  const [updateTick, setUpdateTick] = useState(0);

  // Synchronous reload when grades update
  useEffect(() => {
    const handleUpdate = () => setUpdateTick((t) => t + 1);
    window.addEventListener('grades_updated', handleUpdate);
    return () => window.removeEventListener('grades_updated', handleUpdate);
  }, []);

  // Fetch full leaderboard data
  const rawLeaderboard = useMemo(() => {
    return getLeaderboardData(trackFilter);
  }, [trackFilter, updateTick]);

  // Current logged in student rank
  const myRankInfo = useMemo(() => {
    const identifier = currentStudentId || currentStudentLogin || '';
    if (!identifier) return null;
    return getStudentRank(identifier);
  }, [currentStudentId, currentStudentLogin, updateTick]);

  // Filtered and sorted entries
  const filteredLeaderboard = useMemo(() => {
    let list = [...rawLeaderboard];

    // Filter by group
    if (groupFilter !== 'all') {
      list = list.filter((item) => {
        const group = getGroupByStudent(item.student.fullName || item.student.login);
        return group?.id === groupFilter;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.student.fullName.toLowerCase().includes(q) ||
          item.student.login.toLowerCase().includes(q) ||
          item.student.gradeClass.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'average') {
      list.sort((a, b) => b.averageScore - a.averageScore || b.totalPoints - a.totalPoints);
    } else if (sortBy === 'mastered') {
      list.sort((a, b) => b.masteredCount - a.masteredCount || b.totalPoints - a.totalPoints);
    } else {
      list.sort((a, b) => b.totalPoints - a.totalPoints || b.averageScore - a.averageScore);
    }

    // Assign dynamic ranks based on filtered list
    return list.map((item, idx) => ({
      ...item,
      filteredRank: idx + 1,
    }));
  }, [rawLeaderboard, groupFilter, searchQuery, sortBy]);

  // Top 3 Podium
  const topThree = useMemo(() => {
    return rawLeaderboard.slice(0, 3);
  }, [rawLeaderboard]);

  const hasAnyPoints = useMemo(() => {
    return rawLeaderboard.some((entry) => entry.totalPoints > 0);
  }, [rawLeaderboard]);

  const totalStudentsCount = rawLeaderboard.length;
  const highestTotalPoints = rawLeaderboard.length > 0 ? Math.max(...rawLeaderboard.map((e) => e.totalPoints)) : 0;
  const overallAverage = rawLeaderboard.length > 0
    ? Math.round(rawLeaderboard.reduce((sum, e) => sum + e.averageScore, 0) / rawLeaderboard.length)
    : 0;

  // Check if student is the current user
  const isMe = (entry: LeaderboardEntry) => {
    if (currentStudentId && entry.student.id === currentStudentId) return true;
    if (currentStudentLogin && entry.student.login.toLowerCase() === currentStudentLogin.toLowerCase()) return true;
    return false;
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. HERO BANNER & REYTING STATS */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2C1D] via-[#2A3E2C] to-[#1E3022] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
              <Trophy className="w-3.5 h-3.5 fill-amber-300" />
              <span>IT Savodxonlik Akademiyasi Reytingi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold tracking-tight text-white flex items-center gap-3">
              <span>Umumiy Reyting Jadvali</span>
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-1.5 leading-relaxed">
              O'quvchilarning darslardagi topshiriqlari, ustoz baholari va to'plagan umumiy ballari asosidagi rasmiy peshqadamlar jadvali.
            </p>
          </div>

          {/* User's Current Standing Card */}
          {myRankInfo && myRankInfo.entry && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex items-center gap-4 shrink-0 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#1C2C1D] flex flex-col items-center justify-center font-bold shadow-md">
                <span className="text-[10px] uppercase font-bold tracking-wider leading-none text-amber-900/80">O'rningiz</span>
                <span className="text-xl font-serif italic font-black leading-tight">#{myRankInfo.rank}</span>
              </div>
              <div>
                <span className="text-[11px] text-white/70 block font-semibold uppercase tracking-wider">
                  Sizning Ko'rsatkichingiz
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-serif italic font-bold text-amber-300">
                    {myRankInfo.entry.totalPoints}
                  </span>
                  <span className="text-xs text-white/80">ball</span>
                  <span className="text-[11px] text-emerald-300 font-bold ml-1">
                    ({myRankInfo.entry.gradeCount} ta baho)
                  </span>
                </div>
                <p className="text-[11px] text-[#A3C4A6] mt-0.5">
                  {myRankInfo.entry.levelTitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Global Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/70">Jami O'quvchilar</p>
              <p className="text-base font-serif italic font-bold text-white mt-0.5">
                {totalStudentsCount} nafar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/70">Eng Yuqori Natija</p>
              <p className="text-base font-serif italic font-bold text-amber-300 mt-0.5">
                {highestTotalPoints} ball
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/70">Sinf O'rtacha Ko'rsatkichi</p>
              <p className="text-base font-serif italic font-bold text-white mt-0.5">
                {overallAverage > 0 ? `${overallAverage}%` : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/70">O'quv Guruhlari</p>
              <p className="text-base font-serif italic font-bold text-white mt-0.5">
                3 ta guruh (11 o'quvchi)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP 3 PODIUM (PESHQADAMLAR SHOHSUPASI) */}
      {/* ========================================================================= */}
      {topThree.length >= 3 && (
        <div className="bg-white dark:bg-[#152017] rounded-3xl p-6 sm:p-8 border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              Peshqadamlar Shohsupasi
            </span>
            <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] mt-2">
              Top-3 O'quvchilar
            </h3>
            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
              Eng yuqori ball to'plagan va faollik ko'rsatgan o'quvchilar shohsupasi
            </p>
          </div>

          {/* Podium Grid (2nd place left, 1st center, 3rd right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end max-w-4xl mx-auto">
            {/* 2ND PLACE (SILVER) */}
            {topThree[1] && (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectStudent && onSelectStudent(topThree[1].student)}
                className={`relative cursor-pointer rounded-3xl p-5 border flex flex-col items-center text-center transition-all ${
                  isMe(topThree[1])
                    ? 'bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#18241B] dark:to-[#121A13] border-slate-400 dark:border-slate-600 ring-2 ring-slate-400 shadow-md'
                    : 'bg-[#FAF8F5] dark:bg-[#111A13] border-[#EBE7DF] dark:border-[#243326] hover:border-slate-400 shadow-sm'
                }`}
              >
                <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 border border-slate-300 dark:border-slate-600 shadow-sm">
                  <Medal className="w-3.5 h-3.5 text-slate-500" />
                  <span>2-O'RIN · KUMUSH</span>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center font-serif italic text-3xl font-black shadow-md mt-3 mb-3 border-2 border-slate-300 dark:border-slate-600">
                  {topThree[1].student.fullName.charAt(0)}
                </div>

                <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7]">
                  {topThree[1].student.fullName}
                </h4>
                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                  {topThree[1].student.gradeClass} · <code className="font-mono text-[10px]">@{topThree[1].student.login}</code>
                </p>

                <div className="mt-3 px-4 py-1.5 rounded-full bg-white dark:bg-[#1A261D] border border-slate-300 dark:border-slate-700">
                  <span className="text-xl font-serif italic font-bold text-slate-800 dark:text-slate-200">
                    {topThree[1].totalPoints}
                  </span>
                  <span className="text-[11px] text-[#828282] dark:text-[#9FB1A2] ml-1">ball</span>
                </div>

                <div className="mt-3 text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-3">
                  <span>{topThree[1].gradeCount} baho</span>
                  <span>·</span>
                  <span>{topThree[1].badgeCount} nishon</span>
                </div>

                <span className="mt-3 text-[11px] font-bold text-[#2C3E2D] dark:text-[#8BA88E] flex items-center gap-1">
                  <span>Profilni ko'rish</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            )}

            {/* 1ST PLACE (GOLD / CHAMPION - ELEVATED) */}
            {topThree[0] && (
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectStudent && onSelectStudent(topThree[0].student)}
                className={`relative cursor-pointer rounded-3xl p-6 border-2 flex flex-col items-center text-center transition-all md:-mt-4 shadow-xl ${
                  isMe(topThree[0])
                    ? 'bg-gradient-to-b from-amber-50 via-yellow-50 to-white dark:from-[#232F1A] dark:to-[#152017] border-amber-400 ring-4 ring-amber-400/30'
                    : 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 dark:from-[#1D2B17] dark:via-[#152017] dark:to-[#111A13] border-amber-400/80 dark:border-amber-500/60'
                }`}
              >
                <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-[#1C2C1D] text-xs font-black flex items-center gap-1.5 border border-amber-200 shadow-md">
                  <Crown className="w-4 h-4 text-[#1C2C1D] fill-current" />
                  <span>1-O'RIN · CHEMPION</span>
                </div>

                <div className="relative mt-2 mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-100 text-[#1C2C1D] flex items-center justify-center font-serif italic text-4xl font-black shadow-lg border-2 border-amber-400 ring-4 ring-amber-400/20">
                    {topThree[0].student.fullName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-400 text-[#1C2C1D] shadow-md border-2 border-white dark:border-[#152017]">
                    <Crown className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <h4 className="font-serif italic font-bold text-lg text-[#1A2E1C] dark:text-[#E6EAE7]">
                  {topThree[0].student.fullName}
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                  {topThree[0].student.gradeClass} · <code className="font-mono text-[10px]">@{topThree[0].student.login}</code>
                </p>

                <div className="mt-3 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400/20 to-amber-300/20 border border-amber-400/40">
                  <span className="text-2xl font-serif italic font-black text-amber-600 dark:text-amber-400">
                    {topThree[0].totalPoints}
                  </span>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 ml-1">ball</span>
                </div>

                <span className="mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                  {topThree[0].levelTitle}
                </span>

                <div className="mt-3 text-[11px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-3">
                  <span>{topThree[0].gradeCount} baho</span>
                  <span>·</span>
                  <span>{topThree[0].badgeCount} nishon</span>
                  <span>·</span>
                  <span>{topThree[0].averageScore > 0 ? `${topThree[0].averageScore}%` : '—'}</span>
                </div>

                <span className="mt-3 text-xs font-bold text-[#2C3E2D] dark:text-amber-400 flex items-center gap-1 group">
                  <span>Profilni ko'rish</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.div>
            )}

            {/* 3RD PLACE (BRONZE) */}
            {topThree[2] && (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectStudent && onSelectStudent(topThree[2].student)}
                className={`relative cursor-pointer rounded-3xl p-5 border flex flex-col items-center text-center transition-all ${
                  isMe(topThree[2])
                    ? 'bg-gradient-to-b from-amber-900/10 to-orange-950/10 dark:from-[#211A15] dark:to-[#17120F] border-amber-700 dark:border-amber-800 ring-2 ring-amber-700 shadow-md'
                    : 'bg-[#FAF8F5] dark:bg-[#111A13] border-[#EBE7DF] dark:border-[#243326] hover:border-amber-700/60 shadow-sm'
                }`}
              >
                <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-amber-800/20 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[11px] font-bold flex items-center gap-1 border border-amber-700/30 shadow-sm">
                  <Medal className="w-3.5 h-3.5 text-amber-700" />
                  <span>3-O'RIN · BRONZA</span>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white flex items-center justify-center font-serif italic text-3xl font-black shadow-md mt-3 mb-3 border-2 border-amber-600">
                  {topThree[2].student.fullName.charAt(0)}
                </div>

                <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7]">
                  {topThree[2].student.fullName}
                </h4>
                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                  {topThree[2].student.gradeClass} · <code className="font-mono text-[10px]">@{topThree[2].student.login}</code>
                </p>

                <div className="mt-3 px-4 py-1.5 rounded-full bg-white dark:bg-[#1A261D] border border-amber-700/30">
                  <span className="text-xl font-serif italic font-bold text-amber-800 dark:text-amber-300">
                    {topThree[2].totalPoints}
                  </span>
                  <span className="text-[11px] text-[#828282] dark:text-[#9FB1A2] ml-1">ball</span>
                </div>

                <div className="mt-3 text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-3">
                  <span>{topThree[2].gradeCount} baho</span>
                  <span>·</span>
                  <span>{topThree[2].badgeCount} nishon</span>
                </div>

                <span className="mt-3 text-[11px] font-bold text-[#2C3E2D] dark:text-[#8BA88E] flex items-center gap-1">
                  <span>Profilni ko'rish</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            )}
          </div>

          {!hasAnyPoints && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-center max-w-xl mx-auto">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Yangi o'quv davri boshlandi!
              </p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Barcha o'quvchilar start chizig'ida. Darslarni o'zlashtirib, birinchi bo'lib peshqadamlar shohsupasiga ko'tariling!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FILTER & SEARCH CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#152017] rounded-3xl p-4 sm:p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'quvchi ismi yoki logini bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E]"
          />
        </div>

        {/* Group Filter */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8BA88E]" />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-transparent text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none cursor-pointer"
            >
              <option value="all">Barcha guruhlar</option>
              <option value="group_1">1-Guruh (10:00)</option>
              <option value="group_2">2-Guruh (14:30)</option>
              <option value="group_3">3-Guruh (16:30)</option>
            </select>
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#8BA88E]" />
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value as any)}
              className="bg-transparent text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none cursor-pointer"
            >
              <option value="all">Barcha fanlar</option>
              <option value="literacy">Kompyuter Savodxonligi</option>
              <option value="design">Grafik Dizayn</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl px-2.5 py-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none cursor-pointer"
            >
              <option value="points">Jami ball bo'yicha</option>
              <option value="average">O'rtacha baho bo'yicha</option>
              <option value="mastered">O'zlashtirilgan darslar</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FULL LEADERBOARD TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#152017] rounded-3xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-3 bg-[#FAF8F5] dark:bg-[#111A13]">
          <div>
            <h4 className="font-serif italic font-bold text-base text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Barcha O'quvchilar Reyting Ro'yxati</span>
            </h4>
            <p className="text-xs text-[#828282] dark:text-[#9FB1A2]">
              Jami {filteredLeaderboard.length} nafar o'quvchi monitoringi
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#A7C2AA]">
            Real vaqt rejimi
          </span>
        </div>

        {/* List of Entries */}
        <div className="divide-y divide-[#EBE7DF] dark:divide-[#243326]">
          {filteredLeaderboard.map((entry) => {
            const isCurrentStudent = isMe(entry);
            const studentGroup = getGroupByStudent(entry.student.fullName || entry.student.login);

            return (
              <div
                key={entry.student.id}
                onClick={() => onSelectStudent && onSelectStudent(entry.student)}
                className={`p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  isCurrentStudent
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 border-l-4 border-l-emerald-600'
                    : 'hover:bg-[#FAF8F5] dark:hover:bg-[#111A13]'
                }`}
              >
                {/* Left: Rank & Avatar & Identity */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Rank Badge */}
                  <div className="shrink-0 flex items-center justify-center">
                    {entry.rank === 1 ? (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#1C2C1D] flex items-center justify-center font-serif italic font-black text-sm shadow-sm">
                        <Crown className="w-4 h-4 fill-current" />
                      </div>
                    ) : entry.rank === 2 ? (
                      <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center font-serif italic font-bold text-xs shadow-sm">
                        #2
                      </div>
                    ) : entry.rank === 3 ? (
                      <div className="w-9 h-9 rounded-xl bg-amber-800/20 text-amber-900 dark:text-amber-300 flex items-center justify-center font-serif italic font-bold text-xs shadow-sm border border-amber-800/30">
                        #3
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#283A2C] text-[#828282] dark:text-[#9FB1A2] flex items-center justify-center font-serif italic font-bold text-xs">
                        #{entry.rank}
                      </div>
                    )}
                  </div>

                  {/* Student Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2C3E2D] to-[#405C42] text-white flex items-center justify-center font-serif italic text-base font-bold shrink-0 shadow-sm">
                    {entry.student.fullName.charAt(0)}
                  </div>

                  {/* Name and Tags */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7] truncate">
                        {entry.student.fullName}
                      </h5>

                      {isCurrentStudent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                          Siz
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#EBE7DF] dark:border-[#283A2C] bg-[#FAF8F5] dark:bg-[#111A13] text-[#2C3E2D] dark:text-[#C5D0C7]">
                        {entry.student.gradeClass}
                      </span>

                      {studentGroup && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${studentGroup.themeColor.badge}`}>
                          {studentGroup.shortName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#828282] dark:text-[#9FB1A2] flex-wrap">
                      <code className="font-mono text-[10px] text-[#2C3E2D] dark:text-[#A7C2AA]">
                        @{entry.student.login}
                      </code>
                      <span>·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {entry.levelTitle}
                      </span>
                      <span>·</span>
                      <span>
                        {entry.student.enrolledTrack === 'both'
                          ? 'Savodxonlik & Dizayn'
                          : entry.student.enrolledTrack === 'design'
                          ? 'Grafik Dizayn'
                          : 'IT Savodxonlik'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Details */}
                <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBE7DF] dark:border-[#243326]">
                  {/* Detailed metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center sm:text-right">
                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block uppercase font-bold">
                        O'rtacha
                      </span>
                      <span className="text-xs font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                        {entry.averageScore > 0 ? `${entry.averageScore}%` : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block uppercase font-bold">
                        Baholar
                      </span>
                      <span className="text-xs font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                        {entry.gradeCount} ta
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] block uppercase font-bold">
                        Nishonlar
                      </span>
                      <span className="text-xs font-serif italic font-bold text-amber-500">
                        {entry.badgeCount} ta
                      </span>
                    </div>
                  </div>

                  {/* Total Points Pill */}
                  <div className="min-w-[110px] p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#283A2C] text-center">
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] uppercase font-bold tracking-wider block">
                      Jami Ball
                    </span>
                    <div className="flex items-baseline justify-center gap-1 mt-0.5">
                      <span className="text-lg font-serif italic font-bold text-amber-600 dark:text-amber-400">
                        {entry.totalPoints}
                      </span>
                      <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">ball</span>
                    </div>
                  </div>

                  {/* Profile arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectStudent) onSelectStudent(entry.student);
                    }}
                    className="p-2 hover:bg-[#FAF8F5] dark:hover:bg-[#1A261D] rounded-xl text-[#2C3E2D] dark:text-[#8BA88E] transition"
                    title="O'quvchi profilini ochish"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLeaderboard.length === 0 && (
            <div className="p-12 text-center">
              <Trophy className="w-10 h-10 text-[#8BA88E]/40 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                Qidiruv bo'yicha hech qanday o'quvchi topilmadi
              </p>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1">
                Filtr sozlamalarini o'zgartirib ko'ring yoki qidiruv so'zini tozalang.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
