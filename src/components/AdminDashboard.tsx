import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Users,
  KeyRound,
  Star,
  Award,
  Edit2,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  Phone,
  MessageSquare,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Search,
  Lock,
  Layers,
  BellRing,
} from 'lucide-react';
import {
  TeacherAccount,
  TeacherEvaluation,
  LessonRatingFeedback,
  StudentAccount,
  SmsLogRecord,
  getStoredTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getStoredTeacherEvaluations,
  addTeacherEvaluation,
  deleteTeacherEvaluation,
  getStoredRatings,
  deleteRating,
  getStoredStudents,
  updateStudent,
  addOrUpdateGrade,
  getStoredSmsLogs,
  sendStudentSms,
} from '../services/studentManager';
import { SCHEDULE_GROUPS } from '../services/scheduleManager';
import { UNIFIED_CURRICULUM } from '../data/curriculum';
import { DESIGN_CURRICULUM } from '../data/designCurriculum';

interface AdminDashboardProps {
  adminName?: string;
  onSelectTrackLesson?: (track: 'literacy' | 'design', lessonId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminName = 'Bosh Admin',
  onSelectTrackLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'ratings_grading' | 'sms_schedule'>('teachers');

  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);
  const [evaluations, setEvaluations] = useState<TeacherEvaluation[]>([]);
  const [ratings, setRatings] = useState<LessonRatingFeedback[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLogRecord[]>([]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Teacher Modal / Form state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [tchFullName, setTchFullName] = useState('');
  const [tchLogin, setTchLogin] = useState('');
  const [tchPassword, setTchPassword] = useState('');
  const [tchSubject, setTchSubject] = useState('IT Savodxonlik, Grafik Dizayn & Frontend');
  const [tchPhone, setTchPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Teacher Evaluation / Grading state
  const [gradingMode, setGradingMode] = useState<'teacher' | 'student'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [evalScore, setEvalScore] = useState<number>(95);
  const [evalComment, setEvalComment] = useState<string>('');

  // Student Direct Grading from Admin
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentTrack, setStudentTrack] = useState<'literacy' | 'design'>('literacy');
  const [studentLessonId, setStudentLessonId] = useState<number>(1);
  const [studentScore, setStudentScore] = useState<number>(95);
  const [studentFeedback, setStudentFeedback] = useState<string>('');

  // Anonymous Ratings Filters
  const [ratingTrackFilter, setRatingTrackFilter] = useState<'all' | 'literacy' | 'design'>('all');
  const [ratingStarFilter, setRatingStarFilter] = useState<string>('all');
  const [ratingSearch, setRatingSearch] = useState<string>('');

  // SMS & Phone management state
  const [editingPhoneStudentId, setEditingPhoneStudentId] = useState<string | null>(null);
  const [phoneInputVal, setPhoneInputVal] = useState<string>('');
  const [sendingSmsId, setSendingSmsId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const refreshAll = () => {
    const tList = getStoredTeachers();
    const eList = getStoredTeacherEvaluations();
    const rList = getStoredRatings();
    const sList = getStoredStudents();
    const lList = getStoredSmsLogs();
    setTeachers(tList);
    setEvaluations(eList);
    setRatings(rList);
    setStudents(sList);
    setSmsLogs(lList);

    if (tList.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(tList[0].id);
    }
    if (sList.length > 0 && !selectedStudentId) {
      setSelectedStudentId(sList[0].id);
    }
  };

  useEffect(() => {
    refreshAll();
    window.addEventListener('teachers_updated', refreshAll);
    window.addEventListener('teacher_evals_updated', refreshAll);
    window.addEventListener('lesson_ratings_updated', refreshAll);
    window.addEventListener('sms_logs_updated', refreshAll);
    return () => {
      window.removeEventListener('teachers_updated', refreshAll);
      window.removeEventListener('teacher_evals_updated', refreshAll);
      window.removeEventListener('lesson_ratings_updated', refreshAll);
      window.removeEventListener('sms_logs_updated', refreshAll);
    };
  }, []);

  const averageStudentRating = useMemo(() => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  }, [ratings]);

  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      if (ratingTrackFilter !== 'all' && r.track !== ratingTrackFilter) return false;
      if (ratingStarFilter !== 'all' && r.rating !== Number(ratingStarFilter)) return false;
      if (ratingSearch.trim()) {
        const q = ratingSearch.toLowerCase().trim();
        return (
          r.comment.toLowerCase().includes(q) ||
          r.lessonTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ratings, ratingTrackFilter, ratingStarFilter, ratingSearch]);

  const literacyLessons = useMemo(
    () => UNIFIED_CURRICULUM.flatMap((m) => m.weeks.flatMap((w) => w.lessons)),
    []
  );
  const designLessons = useMemo(
    () => DESIGN_CURRICULUM.flatMap((m) => m.lessons),
    []
  );

  // Teacher Form Handlers
  const openCreateTeacher = () => {
    setEditingTeacherId(null);
    setTchFullName('');
    setTchLogin('');
    setTchPassword(`Ustoz@${Math.floor(100 + Math.random() * 900)}#`);
    setTchSubject('IT Savodxonlik, Grafik Dizayn & Frontend');
    setTchPhone('+998 90 ');
    setFormError('');
    setIsTeacherModalOpen(true);
  };

  const openEditTeacher = (teacher: TeacherAccount) => {
    setEditingTeacherId(teacher.id);
    setTchFullName(teacher.fullName);
    setTchLogin(teacher.login);
    setTchPassword(teacher.password);
    setTchSubject(teacher.subject);
    setTchPhone(teacher.phone || '');
    setFormError('');
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!tchFullName.trim() || !tchLogin.trim() || !tchPassword.trim()) {
      setFormError("Iltimos, o'qituvchi ismi, logini va parolini to'liq kiriting!");
      return;
    }

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, {
        fullName: tchFullName.trim(),
        login: tchLogin.trim(),
        password: tchPassword.trim(),
        subject: tchSubject.trim(),
        phone: tchPhone.trim(),
      });
      showToast(`${tchFullName} login va paroli yangilandi!`);
    } else {
      const exists = teachers.some(
        (t) => t.login.toLowerCase() === tchLogin.trim().toLowerCase()
      );
      if (exists) {
        setFormError("Ushbu login band! Boshqa login kiriting.");
        return;
      }
      addTeacher({
        fullName: tchFullName,
        login: tchLogin,
        password: tchPassword,
        subject: tchSubject,
        phone: tchPhone,
      });
      showToast(`Yangi o'qituvchi (${tchFullName}) muvaffaqiyatli yaratildi!`);
    }

    setIsTeacherModalOpen(false);
    refreshAll();
  };

  const handleCopyTeacher = (t: TeacherAccount) => {
    const text = `👨‍🏫 SMART HIGH SCHOOL — O'qituvchi Kirish Ma'lumotlari:\nIsm: ${t.fullName}\nLogin: ${t.login}\nParol: ${t.password}\nYo'nalish: ${t.subject}`;
    navigator.clipboard.writeText(text);
    setCopiedId(t.id);
    showToast(`${t.fullName} login va paroli nusxalandi!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Submit Teacher Evaluation (Admin grading Teacher based on anonymous student ratings)
  const handleEvaluateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    addTeacherEvaluation({
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      score: evalScore,
      maxScore: 100,
      studentAvgRating: averageStudentRating > 0 ? `${averageStudentRating} / 5` : '5.0 / 5',
      comment:
        evalComment.trim() ||
        `O'quvchilarning anonim baholari asosida dars o'tish sifati ${evalScore} ball bilan baholandi.`,
      evaluatedBy: adminName,
    });

    setEvalComment('');
    refreshAll();
    showToast(`O'qituvchi ${teacher.fullName}ga ${evalScore} ball baho qo'yildi!`);
  };

  // Submit Student Grade from Admin
  const handleAdminGradeStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const lessonList = studentTrack === 'literacy' ? literacyLessons : designLessons;
    const foundLesson = lessonList.find((l) => l.id === studentLessonId);
    const lessonTitle = foundLesson ? foundLesson.title : `Dars #${studentLessonId}`;

    addOrUpdateGrade({
      studentId: st.id,
      studentName: st.fullName,
      track: studentTrack,
      lessonId: studentLessonId,
      lessonTitle,
      score: studentScore,
      maxScore: 100,
      feedback: studentFeedback.trim() || "Admin tomonidan dars o'zlashtirish ko'rsatkichi baholandi.",
      teacherName: `${adminName} (Admin)`,
    });

    setStudentFeedback('');
    showToast(`${st.fullName}ga ${studentScore} ball muvaffaqiyatli qo'yildi!`);
  };

  // Save Student Phone Number
  const handleSaveStudentPhone = (student: StudentAccount) => {
    updateStudent(student.id, { phone: phoneInputVal.trim() });
    setEditingPhoneStudentId(null);
    refreshAll();
    showToast(`${student.fullName} telefon raqami saqlandi!`);
  };

  // Send 30-min Reminder SMS to single student or entire group
  const handleSend30MinSmsToStudent = async (student: StudentAccount, groupName: string, timeSlot: string, room: string) => {
    if (!student.phone || student.phone.trim().length < 7) {
      showToast(`Avval ${student.fullName} uchun telefon raqam kiriting!`);
      setEditingPhoneStudentId(student.id);
      setPhoneInputVal('+998 90 ');
      return;
    }
    setSendingSmsId(student.id);
    const msg = `SMART HIGH SCHOOL: Hurmatli ${student.fullName}, sizning ${groupName} darsingiz 30 daqiqadan so'ng (${timeSlot}) ${room}da boshlanadi. Kechikmasdan kelishingizni so'raymiz!`;
    await sendStudentSms({
      studentId: student.id,
      studentName: student.fullName,
      phone: student.phone,
      groupId: groupName,
      groupName,
      message: msg,
    });
    setSendingSmsId(null);
    refreshAll();
    showToast(`${student.fullName} (${student.phone}) raqamiga SMS yuborildi!`);
  };

  const handleSendGroupSms = async (groupId: string) => {
    const grp = SCHEDULE_GROUPS.find((g) => g.id === groupId);
    if (!grp) return;
    const grpStudents = students.filter(
      (s) =>
        grp.studentLogins.includes(s.login.toLowerCase()) ||
        grp.studentNames.some((n) => n.toLowerCase() === s.fullName.toLowerCase())
    );
    const withPhone = grpStudents.filter((s) => s.phone && s.phone.trim().length >= 7);
    if (withPhone.length === 0) {
      showToast(`${grp.name} o'quvchilariga avval telefon raqam biriktiring!`);
      return;
    }
    setSendingSmsId(groupId);
    for (const st of withPhone) {
      const msg = `SMART HIGH SCHOOL: Hurmatli ${st.fullName}, sizning ${grp.name} darsingiz 30 daqiqadan so'ng (${grp.timeSlot}) ${grp.room}da boshlanadi!`;
      await sendStudentSms({
        studentId: st.id,
        studentName: st.fullName,
        phone: st.phone!,
        groupId: grp.id,
        groupName: grp.name,
        message: msg,
      });
    }
    setSendingSmsId(null);
    refreshAll();
    showToast(`${grp.name}dagi ${withPhone.length} nafar o'quvchiga 30 daqiqalik SMS yuborildi!`);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C3E2D] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#8BA88E]/40 flex items-center gap-2.5 text-xs font-bold">
          <Check className="w-4 h-4 text-[#8BA88E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Compact Admin Header */}
      <div className="bg-gradient-to-r from-[#1A261B] via-[#2C3E2D] to-[#1F3122] text-white rounded-3xl p-5 md:p-6 shadow-lg border border-[#8BA88E]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 rounded-full text-[11px] font-bold border border-amber-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bosh Admin Boshqaruv Paneli</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif italic font-bold">
            SMART HIGH SCHOOL — Admin Markazi
          </h2>
          <p className="text-xs text-[#A7C2AA] mt-1">
            O'qituvchilarga login/parol yaratish va tahrirlash, o'quvchilarning anonim 1–5 yulduzli baholarini ko'rib baho qo'yish hamda 30 daqiqalik SMS tizimi.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-white/70 uppercase font-bold block">O'qituvchilar</span>
            <span className="text-lg font-serif italic font-bold text-white">{teachers.length} ta</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-amber-400/30 text-center">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Anonim Reyting</span>
            <span className="text-lg font-serif italic font-bold text-amber-300">
              {averageStudentRating > 0 ? `${averageStudentRating}/5` : '5.0/5'}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-2xl border border-emerald-400/30 text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Avto-SMS (30m)</span>
            <span className="text-lg font-serif italic font-bold text-emerald-300">Faol ✓</span>
          </div>
        </div>
      </div>

      {/* Compact 3-Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-[#F5F5F0] dark:bg-[#111912] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>1. O'qituvchi Login & Parollar</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">{teachers.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('ratings_grading')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'ratings_grading'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>2. Anonim Baholar & Baho Qo'yish</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/25 text-amber-300">
            {ratings.length} fikr
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sms_schedule')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'sms_schedule'
              ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-sm'
              : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
          }`}
        >
          <BellRing className="w-4 h-4 text-emerald-400" />
          <span>3. Reja & 30-Daqiqalik SMS Tizimi</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400/25 text-emerald-300">
            {smsLogs.length} SMS
          </span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: O'QITUVCHILARGA LOGIN VA PAROL YARATISH / TAHRIRLASH            */}
      {/* ===================================================================== */}
      {activeTab === 'teachers' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
            <div>
              <h3 className="text-base font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8BA88E]" />
                O'qituvchilar Ro'yxati va Kirish Ma'lumotlari
              </h3>
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                Yangi o'qituvchi hisobi yarating yoki mavjud o'qituvchining login/parolini tahrirlang.
              </p>
            </div>
            <button
              onClick={openCreateTeacher}
              className="px-4 py-2.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0"
            >
              <UserPlus className="w-4 h-4 text-[#8BA88E]" />
              <span>+ Yangi O'qituvchi Yaratish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map((teacher) => {
              const showPass = visiblePasswords[teacher.id];
              const isCopied = copiedId === teacher.id;

              return (
                <div
                  key={teacher.id}
                  className="bg-white dark:bg-[#152017] rounded-2xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-xs flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#2C3E2D] text-white flex items-center justify-center font-serif italic font-bold text-base">
                          {teacher.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                            {teacher.fullName}
                          </h4>
                          <span className="text-[11px] text-[#8BA88E] font-semibold">
                            {teacher.subject}
                          </span>
                        </div>
                      </div>

                      {typeof teacher.adminScore === 'number' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          Admin Bahosi: {teacher.adminScore}/100
                        </span>
                      )}
                    </div>

                    {/* Credentials Box */}
                    <div className="mt-4 p-3.5 bg-[#FAF8F5] dark:bg-[#111A13] rounded-xl border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#828282] dark:text-[#9FB1A2] font-semibold">Login:</span>
                        <code className="font-mono font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-white dark:bg-[#18241B] px-2.5 py-0.5 rounded border border-[#EBE7DF] dark:border-[#293B2D]">
                          {teacher.login}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#828282] dark:text-[#9FB1A2] font-semibold">Parol:</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-[#2D2D2D] dark:text-[#E6EAE7] bg-white dark:bg-[#18241B] px-2.5 py-0.5 rounded border border-[#EBE7DF] dark:border-[#293B2D]">
                            {showPass ? teacher.password : '••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              setVisiblePasswords((p) => ({ ...p, [teacher.id]: !p[teacher.id] }))
                            }
                            className="text-[#828282] hover:text-[#2D2D2D] dark:hover:text-white"
                          >
                            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#EBE7DF] dark:border-[#223024]">
                          <span className="text-[#828282] dark:text-[#9FB1A2] font-semibold">Telefon:</span>
                          <span className="font-mono text-[11px] text-[#2D2D2D] dark:text-[#D4DFD6]">
                            {teacher.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    {teacher.adminFeedback && (
                      <p className="mt-2.5 text-[11px] italic text-[#828282] dark:text-[#9FB1A2] bg-[#FAF8F5] dark:bg-[#111A13] px-3 py-2 rounded-xl border border-[#EBE7DF] dark:border-[#223024]">
                        Admin xulosasi: "{teacher.adminFeedback}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeacherId(teacher.id);
                        setGradingMode('teacher');
                        setActiveTab('ratings_grading');
                      }}
                      className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Baho Berish</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyTeacher(teacher)}
                        className="px-3 py-1.5 bg-[#FAF8F5] dark:bg-[#1A261D] hover:bg-[#EBE7DF] text-[#2C3E2D] dark:text-[#D4DFD6] rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Nusxalandi' : 'Nusxa'}</span>
                      </button>
                      <button
                        onClick={() => openEditTeacher(teacher)}
                        className="px-3 py-1.5 bg-[#2C3E2D] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Tahrirlash</span>
                      </button>
                      {teachers.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`${teacher.fullName} o'qituvchi hisobini o'chirasizmi?`)) {
                              deleteTeacher(teacher.id);
                              refreshAll();
                              showToast(`${teacher.fullName} o'chirildi.`);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: O'QUVCHILAR BERGAN ANONIM BAHOLAR VA BAHO BERISH               */}
      {/* ===================================================================== */}
      {activeTab === 'ratings_grading' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 5 COLS: ADMIN GRADING PANEL (O'qituvchiga yoki O'quvchiga baho berish) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif italic text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Admin Baholash Markazi
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  100 Ballik Tizim
                </span>
              </div>

              {/* Switch between evaluating Teacher or Student */}
              <div className="grid grid-cols-2 gap-1.5 bg-[#FAF8F5] dark:bg-[#111912] p-1 rounded-xl border border-[#EBE7DF] dark:border-[#243326] mb-4">
                <button
                  type="button"
                  onClick={() => setGradingMode('teacher')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                    gradingMode === 'teacher'
                      ? 'bg-[#2C3E2D] text-white shadow-xs'
                      : 'text-[#828282] dark:text-[#9FB1A2]'
                  }`}
                >
                  👨‍🏫 O'qituvchiga Baho
                </button>
                <button
                  type="button"
                  onClick={() => setGradingMode('student')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                    gradingMode === 'student'
                      ? 'bg-[#2C3E2D] text-white shadow-xs'
                      : 'text-[#828282] dark:text-[#9FB1A2]'
                  }`}
                >
                  👨‍🎓 O'quvchiga Baho
                </button>
              </div>

              {gradingMode === 'teacher' ? (
                <form onSubmit={handleEvaluateTeacher} className="flex flex-col gap-3.5">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-[#2C3E2D] dark:text-amber-200 flex items-center justify-between">
                    <span>O'quvchilarning o'rtacha anonim bahosi:</span>
                    <strong className="text-sm font-serif italic flex items-center gap-1 text-amber-600 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {averageStudentRating > 0 ? `${averageStudentRating} / 5.0` : '5.0 / 5.0'} ({ratings.length} ta)
                    </strong>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      1. O'qituvchini tanlang:
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-bold"
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullName} ({t.subject})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                        2. O'qituvchi KPI Bahosi:
                      </label>
                      <span className="text-sm font-serif italic font-bold text-emerald-600 dark:text-emerald-400">
                        {evalScore} / 100 ball
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={evalScore}
                      onChange={(e) => setEvalScore(Number(e.target.value))}
                      className="w-full accent-[#2C3E2D] cursor-pointer"
                    />
                    <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                      {[100, 95, 90, 85].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setEvalScore(v)}
                          className={`py-1 rounded-lg text-[10px] font-bold border ${
                            evalScore === v
                              ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                              : 'bg-[#FAF8F5] dark:bg-[#111A13] border-[#EBE7DF] dark:border-[#243326]'
                          }`}
                        >
                          {v} ball
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      3. Admin xulosasi va tavsiyasi:
                    </label>
                    <textarea
                      rows={3}
                      value={evalComment}
                      onChange={(e) => setEvalComment(e.target.value)}
                      placeholder="O'quvchilarning anonim fikrlari ijobiy, dars sifati a'lo darajada..."
                      className="w-full p-3 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>O'qituvchiga Bahoni Saqlash</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminGradeStudent} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      1. O'quvchini tanlang:
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-bold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.gradeClass})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentTrack('literacy');
                        setStudentLessonId(1);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border ${
                        studentTrack === 'literacy'
                          ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                          : 'bg-[#FAF8F5] dark:bg-[#111A13] border-[#EBE7DF] dark:border-[#243326]'
                      }`}
                    >
                      💻 Savodxonlik
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentTrack('design');
                        setStudentLessonId(101);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border ${
                        studentTrack === 'design'
                          ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                          : 'bg-[#FAF8F5] dark:bg-[#111A13] border-[#EBE7DF] dark:border-[#243326]'
                      }`}
                    >
                      🎨 Dizayn & Frontend
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      2. Darsni tanlang:
                    </label>
                    <select
                      value={studentLessonId}
                      onChange={(e) => setStudentLessonId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                    >
                      {(studentTrack === 'literacy' ? literacyLessons : designLessons).map((l) => (
                        <option key={l.id} value={l.id}>
                          #{l.id} — {l.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6]">
                        3. Ball:
                      </label>
                      <span className="text-sm font-serif italic font-bold text-emerald-600">
                        {studentScore} / 100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={studentScore}
                      onChange={(e) => setStudentScore(Number(e.target.value))}
                      className="w-full accent-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      4. Izoh:
                    </label>
                    <textarea
                      rows={2}
                      value={studentFeedback}
                      onChange={(e) => setStudentFeedback(e.target.value)}
                      placeholder="Admin tekshiruvi: a'lo natija!"
                      className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>O'quvchiga Ball Qo'yish</span>
                  </button>
                </form>
              )}
            </div>

            {/* Recent Teacher Evaluations History */}
            {evaluations.length > 0 && (
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#828282] dark:text-[#9FB1A2]">
                  O'qituvchilarga Berilgan Admin Baholari ({evaluations.length})
                </h4>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {evaluations.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#1A2E1C] dark:text-[#E6EAE7]">{ev.teacherName}</strong>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            {ev.score} / {ev.maxScore} ball
                          </span>
                          <button
                            onClick={() => {
                              deleteTeacherEvaluation(ev.id);
                              refreshAll();
                            }}
                            className="text-rose-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] italic text-[#828282] dark:text-[#9FB1A2]">"{ev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 7 COLS: ANONYMOUS 1-5 STAR RATINGS FROM STUDENTS */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 mb-1">
                    <Lock className="w-3 h-3" />
                    100% Anonim O'quvchi Baholari
                  </span>
                  <h3 className="font-serif italic text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    O'quvchilarning Dars O'tish Sifatiga Bergan 1–5 Yulduzli Baholari
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#8BA88E] bg-[#FAF8F5] dark:bg-[#111A13] px-3 py-1.5 rounded-xl border border-[#EBE7DF] dark:border-[#243326]">
                  Jami: {filteredRatings.length} ta anonim baho
                </span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#828282] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ratingSearch}
                    onChange={(e) => setRatingSearch(e.target.value)}
                    placeholder="Dars yoki izoh qidirish..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                  />
                </div>
                <select
                  value={ratingTrackFilter}
                  onChange={(e) => setRatingTrackFilter(e.target.value as any)}
                  className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                >
                  <option value="all">Barcha Kurslar</option>
                  <option value="literacy">💻 Savodxonlik</option>
                  <option value="design">🎨 Dizayn & Frontend</option>
                </select>
                <select
                  value={ratingStarFilter}
                  onChange={(e) => setRatingStarFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                >
                  <option value="all">Barcha Yulduzlar (1-5)</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 yulduz)</option>
                  <option value="4">⭐⭐⭐⭐ (4 yulduz)</option>
                  <option value="3">⭐⭐⭐ (3 yulduz)</option>
                  <option value="2">⭐⭐ (2 yulduz)</option>
                  <option value="1">⭐ (1 yulduz)</option>
                </select>
              </div>

              {/* Anonymous Reviews List */}
              <div className="flex flex-col gap-3 max-h-[540px] overflow-y-auto pr-1">
                {filteredRatings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#2C3E2D]/10 dark:bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center text-xs font-bold">
                          🔒
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1A2E1C] dark:text-[#E6EAE7] block">
                            Anonim O'quvchi
                          </span>
                          <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString('uz-UZ', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            deleteRating(item.id);
                            refreshAll();
                          }}
                          className="text-rose-400 hover:text-rose-600 p-1"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#A7C2AA]">
                        {item.track === 'design' ? '🎨 Dizayn & Frontend' : '💻 Savodxonlik'}
                      </span>
                      <span className="font-bold text-[#2C3E2D] dark:text-[#D4DFD6] truncate">
                        Dars #{item.lessonId}: {item.lessonTitle}
                      </span>
                    </div>

                    <p className="text-xs italic text-[#2D2D2D] dark:text-[#E6EAE7] bg-white dark:bg-[#162118] p-3 rounded-xl border border-[#EBE7DF] dark:border-[#243326]">
                      "{item.comment}"
                    </p>
                  </div>
                ))}

                {filteredRatings.length === 0 && (
                  <div className="py-12 text-center text-xs text-[#828282] dark:text-[#9FB1A2]">
                    Hozircha anonim dars baholari mavjud emas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: REJA & 30-DAQIQALIK AVTO-SMS XABARNOMA TIZIMI                  */}
      {/* ===================================================================== */}
      {activeTab === 'sms_schedule' && (
        <div className="flex flex-col gap-6">
          {/* 30-Min Auto SMS Explanation & Group Cards */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 md:p-6 border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EBE7DF] dark:border-[#243326]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 mb-1">
                  <BellRing className="w-3 h-3" />
                  Avtomatik SMS Xabarnoma Tizimi (Darsdan 30 daqiqa oldin)
                </span>
                <h3 className="text-lg font-serif italic font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Guruhlar Dars Rejasi va O'quvchilar Telefon Raqamlari
                </h3>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                  Har bir guruh darsi boshlanishiga роппа-rosa 30 daqiqa qolganda tizim o'quvchilarning telefon raqamlariga avtomatik SMS eslatma yuboradi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SCHEDULE_GROUPS.map((grp) => {
                const grpStudents = students.filter(
                  (s) =>
                    grp.studentLogins.includes(s.login.toLowerCase()) ||
                    grp.studentNames.some((n) => n.toLowerCase() === s.fullName.toLowerCase())
                );

                return (
                  <div
                    key={grp.id}
                    className="rounded-2xl p-4 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${grp.themeColor.badge}`}>
                          {grp.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#2C3E2D] dark:text-[#8BA88E]">
                          ⏰ {grp.timeSlot}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mb-3">
                        Kunlar: <strong>{grp.dayNames.join(', ')}</strong> · SMS vaqti:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {grp.startMinute === 30
                            ? `${String(grp.startHour).padStart(2, '0')}:00`
                            : `${String(grp.startHour - 1).padStart(2, '0')}:30`}{' '}
                          (30 daq. oldin)
                        </strong>
                      </p>

                      {/* Students in this group with phone inputs */}
                      <div className="flex flex-col gap-2">
                        {grpStudents.map((st) => (
                          <div
                            key={st.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-[#162118] border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                                {st.fullName}
                              </span>
                              <button
                                type="button"
                                disabled={sendingSmsId === st.id}
                                onClick={() =>
                                  handleSend30MinSmsToStudent(st, grp.name, grp.timeSlot, grp.room)
                                }
                                className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>{sendingSmsId === st.id ? 'Yuborilmoqda...' : 'SMS'}</span>
                              </button>
                            </div>

                            {editingPhoneStudentId === st.id ? (
                              <div className="flex items-center gap-1.5 mt-1">
                                <input
                                  type="text"
                                  value={phoneInputVal}
                                  onChange={(e) => setPhoneInputVal(e.target.value)}
                                  placeholder="+998 90 123 45 67"
                                  className="flex-1 px-2 py-1 rounded border border-[#8BA88E] bg-[#FAF8F5] dark:bg-[#111A13] text-[11px] font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveStudentPhone(st)}
                                  className="px-2 py-1 bg-[#2C3E2D] text-white rounded text-[10px] font-bold"
                                >
                                  Saqlash
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                                <span className="font-mono flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#8BA88E]" />
                                  {st.phone || 'Raqam kiritilmagan'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPhoneStudentId(st.id);
                                    setPhoneInputVal(st.phone || '+998 ');
                                  }}
                                  className="text-[10px] text-[#8BA88E] font-bold hover:underline"
                                >
                                  {st.phone ? "O'zgartirish" : '+ Raqam'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={sendingSmsId === grp.id}
                      onClick={() => handleSendGroupSms(grp.id)}
                      className="w-full py-2.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        {sendingSmsId === grp.id
                          ? 'Yuborilmoqda...'
                          : `${grp.shortName}ga 30-daq. SMS Yuborish`}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sent SMS Logs */}
          <div className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-3">
            <h4 className="font-serif italic text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              Yuborilgan SMS Xabarnomalar Jurnali ({smsLogs.length})
            </h4>
            {smsLogs.length === 0 ? (
              <p className="text-xs text-[#828282] dark:text-[#9FB1A2] py-6 text-center">
                Hozircha SMS xabarlar yuborilmagan. Darsga 30 daqiqa qolganda avtomatik yuboriladi yoki yuqoridagi tugma orqali sinab ko'rishingiz mumkin.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {smsLogs.slice(0, 20).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col gap-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                        {log.studentName} ({log.phone})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        ✓ Yuborildi
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2D2D2D] dark:text-[#D4DFD6] leading-relaxed">
                      {log.message}
                    </p>
                    <span className="text-[10px] text-[#828282] dark:text-[#9FB1A2]">
                      {log.groupName} · {new Date(log.sentAt).toLocaleString('uz-UZ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Teacher */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#172219] rounded-3xl w-full max-w-md shadow-2xl border border-[#EBE7DF] dark:border-[#243326] overflow-hidden">
            <div className="bg-[#2C3E2D] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif italic font-bold">
                  {editingTeacherId ? "O'qituvchi Login/Parolini Tahrirlash" : "Yangi O'qituvchi Hisobi Yaratish"}
                </h3>
                <p className="text-[11px] text-[#8BA88E]">
                  O'qituvchi ushbu login va parol orqali tizimga kiradi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-5 flex flex-col gap-3.5">
              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold block mb-1">O'qituvchi Ism-Familiyasi *</label>
                <input
                  type="text"
                  required
                  value={tchFullName}
                  onChange={(e) => setTchFullName(e.target.value)}
                  placeholder="Masalan: Assadxoja"
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Login *</label>
                <input
                  type="text"
                  required
                  value={tchLogin}
                  onChange={(e) => setTchLogin(e.target.value)}
                  placeholder="Masalan: assadxoja"
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Parol *</label>
                <input
                  type="text"
                  required
                  value={tchPassword}
                  onChange={(e) => setTchPassword(e.target.value)}
                  placeholder="Maxfiy parol"
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Mutaxassisligi / Kurslari</label>
                <input
                  type="text"
                  value={tchSubject}
                  onChange={(e) => setTchSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold block mb-1">Telefon raqami</label>
                <input
                  type="text"
                  value={tchPhone}
                  onChange={(e) => setTchPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EBE7DF] dark:border-[#243326]">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#828282]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C3E2D] text-white rounded-xl text-xs font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
