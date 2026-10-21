import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Award,
  Download,
  Eye,
  X,
  Send,
  Image as ImageIcon,
  File as FileIcon,
  Sparkles,
  BookOpen,
  Palette,
  Users,
  Calendar,
  MessageSquare,
  Check,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import {
  HomeworkAssignment,
  HomeworkSubmission,
  getStoredAssignments,
  getStoredSubmissions,
  createOrUpdateAssignment,
  deleteAssignment,
  getAssignmentsForStudent,
  submitHomework,
  gradeHomeworkSubmission,
  deleteSubmission,
  processHomeworkFile,
  syncHomeworksWithServer
} from '../services/homeworkManager';
import { getStoredStudents, StudentAccount } from '../services/studentManager';
import { SCHEDULE_GROUPS } from '../services/scheduleManager';
import { UNIFIED_CURRICULUM } from '../data/curriculum';
import { DESIGN_CURRICULUM } from '../data/designCurriculum';

interface HomeworkCenterProps {
  role: 'teacher' | 'student';
  studentId?: string;
  studentName?: string;
  studentLogin?: string;
  teacherName?: string;
  initialTrack?: 'literacy' | 'design';
  initialLessonId?: number;
}

export const HomeworkCenter: React.FC<HomeworkCenterProps> = ({
  role,
  studentId = '',
  studentName = "O'quvchi",
  studentLogin = '',
  teacherName = 'Assadxoja',
  initialTrack,
  initialLessonId,
}) => {
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lightbox image preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Teacher sub-navigation & filters
  const [teacherTab, setTeacherTab] = useState<'submissions' | 'assignments'>('submissions');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded' | 'revision'>('all');
  const [selectedAssignmentFilter, setSelectedAssignmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Teacher New Assignment Modal State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [hwTrack, setHwTrack] = useState<'literacy' | 'design'>(initialTrack || 'literacy');
  const [hwLessonId, setHwLessonId] = useState<number>(initialLessonId || 1);
  const [hwTitle, setHwTitle] = useState<string>('');
  const [hwDescription, setHwDescription] = useState<string>('');
  const [hwTargetGroup, setHwTargetGroup] = useState<string>('all');
  const [hwDueDate, setHwDueDate] = useState<string>('');
  const [hwMaxScore, setHwMaxScore] = useState<number>(100);
  const [hwAttachment, setHwAttachment] = useState<{ dataUrl: string; fileName: string } | null>(null);
  const [uploadingTeacherFile, setUploadingTeacherFile] = useState<boolean>(false);

  // Teacher Grading Form State per submission ID
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<string, string>>({});

  // Student Upload Form State
  const [activeUploadAssignmentId, setActiveUploadAssignmentId] = useState<string | null>(null);
  const [studentComment, setStudentComment] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    dataUrl: string;
    fileName: string;
    fileType: 'image' | 'file';
  } | null>(null);
  const [uploadingStudentFile, setUploadingStudentFile] = useState<boolean>(false);
  const [submittingHw, setSubmittingHw] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = () => {
    setAssignments(getStoredAssignments());
    setSubmissions(getStoredSubmissions());
    setStudents(getStoredStudents());
  };

  useEffect(() => {
    loadData();
    syncHomeworksWithServer();

    const handleUpdate = () => loadData();
    window.addEventListener('homeworks_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('homeworks_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Lessons list for teacher dropdown
  const literacyLessons = useMemo(
    () => UNIFIED_CURRICULUM.flatMap((m) => m.weeks.flatMap((w) => w.lessons)),
    []
  );
  const designLessons = useMemo(
    () => DESIGN_CURRICULUM.flatMap((m) => m.lessons),
    []
  );

  const activeCurriculumLessons = hwTrack === 'literacy' ? literacyLessons : designLessons;

  // Handle teacher file attachment
  const handleTeacherFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTeacherFile(true);
    try {
      const processed = await processHomeworkFile(file);
      setHwAttachment({ dataUrl: processed.dataUrl, fileName: processed.fileName });
    } catch (err: any) {
      showToast(err.message || 'Faylni yuklashda xatolik');
    } finally {
      setUploadingTeacherFile(false);
    }
  };

  // Handle teacher creating homework assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwDescription.trim()) {
      showToast("Iltimos, vazifa sarlavhasi va shartini kiriting!");
      return;
    }

    const lessonObj = activeCurriculumLessons.find((l) => l.id === hwLessonId);
    const lessonTitle = lessonObj ? lessonObj.title : `${hwLessonId}-dars`;

    createOrUpdateAssignment({
      title: hwTitle,
      description: hwDescription,
      track: hwTrack,
      lessonId: hwLessonId,
      lessonTitle,
      targetGroup: hwTargetGroup,
      dueDate: hwDueDate,
      maxScore: hwMaxScore || 100,
      attachmentUrl: hwAttachment?.dataUrl,
      attachmentName: hwAttachment?.fileName,
      teacherName,
    });

    setHwTitle('');
    setHwDescription('');
    setHwAttachment(null);
    setIsCreateOpen(false);
    loadData();
    showToast("Yangi uyga vazifa muvaffaqiyatli e'lon qilindi!");
  };

  // Handle student selecting image or file
  const handleStudentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingStudentFile(true);
    try {
      const processed = await processHomeworkFile(file);
      setSelectedFile(processed);
    } catch (err: any) {
      showToast(err.message || "Faylni o'qishda xatolik yuz berdi");
    } finally {
      setUploadingStudentFile(false);
    }
  };

  // Handle student submitting homework
  const handleStudentSubmit = (assignment: HomeworkAssignment) => {
    if (!selectedFile) {
      showToast('Iltimos, bajargan vazifangizni surat (skrinshot) yoki fayl shaklida yuklang!');
      return;
    }
    setSubmittingHw(true);
    try {
      submitHomework({
        assignmentId: assignment.id,
        studentId: studentId || studentLogin || studentName,
        studentName,
        studentLogin,
        track: assignment.track,
        lessonId: assignment.lessonId,
        lessonTitle: assignment.lessonTitle,
        comment: studentComment,
        fileDataUrl: selectedFile.dataUrl,
        fileName: selectedFile.fileName,
        fileType: selectedFile.fileType,
        maxScore: assignment.maxScore,
      });

      setSelectedFile(null);
      setStudentComment('');
      setActiveUploadAssignmentId(null);
      loadData();
      showToast("Uyga vazifangiz ustozga muvaffaqiyatli yuborildi!");
    } finally {
      setSubmittingHw(false);
    }
  };

  // Handle teacher grading submission
  const handleGradeSubmission = (
    sub: HomeworkSubmission,
    status: 'graded' | 'revision' = 'graded'
  ) => {
    const rawScore = gradingScores[sub.id] ?? sub.score ?? 90;
    const feedback = gradingFeedbacks[sub.id] ?? sub.teacherFeedback ?? '';

    gradeHomeworkSubmission({
      submissionId: sub.id,
      score: status === 'graded' ? Number(rawScore) : 0,
      maxScore: sub.maxScore || 100,
      teacherFeedback:
        feedback ||
        (status === 'graded'
          ? "Vazifa a'lo darajada bajarilgan, barakalla!"
          : "Vazifada kamchiliklar bor, qayta ko'rib chiqing."),
      status,
      teacherName,
    });

    loadData();
    if (status === 'graded') {
      showToast(
        `${sub.studentName}ning uyga vazifasiga ${rawScore} ball qo'yildi va Reyting jadvaliga qo'shildi!`
      );
    } else {
      showToast(`${sub.studentName}ga vazifani qayta ishlash xabari yuborildi.`);
    }
  };

  const getTargetLabel = (targetGroup: string) => {
    if (!targetGroup || targetGroup === 'all') return "Barcha o'quvchilar";
    const grp = SCHEDULE_GROUPS.find((g) => g.id === targetGroup);
    if (grp) return `${grp.name} (${grp.timeSlot})`;
    const st = students.find((s) => s.id === targetGroup || s.login === targetGroup);
    if (st) return `Shaxsiy: ${st.fullName}`;
    return targetGroup;
  };

  // ============================================================================
  // STUDENT VIEW DATA
  // ============================================================================
  const studentAssignments = useMemo(() => {
    if (role !== 'student') return [];
    const list = getAssignmentsForStudent(studentId || studentLogin || studentName, studentName);
    if (initialLessonId && initialTrack) {
      return list.filter((a) => a.track === initialTrack && a.lessonId === initialLessonId);
    }
    return list;
  }, [role, assignments, studentId, studentLogin, studentName, initialLessonId, initialTrack]);

  const getStudentSubmissionForAssignment = (assignmentId: string): HomeworkSubmission | undefined => {
    const cleanId = (studentId || '').toLowerCase();
    const cleanLogin = (studentLogin || '').toLowerCase();
    const cleanName = (studentName || '').toLowerCase();

    return submissions.find(
      (s) =>
        s.assignmentId === assignmentId &&
        (s.studentId.toLowerCase() === cleanId ||
          (cleanLogin && s.studentLogin?.toLowerCase() === cleanLogin) ||
          s.studentName.toLowerCase() === cleanName)
    );
  };

  // ============================================================================
  // TEACHER VIEW DATA
  // ============================================================================
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (selectedAssignmentFilter !== 'all' && s.assignmentId !== selectedAssignmentFilter)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchStudent = s.studentName.toLowerCase().includes(q);
        const matchLesson = s.lessonTitle.toLowerCase().includes(q);
        const matchComment = (s.comment || '').toLowerCase().includes(q);
        if (!matchStudent && !matchLesson && !matchComment) return false;
      }
      return true;
    });
  }, [submissions, statusFilter, selectedAssignmentFilter, searchQuery]);

  const pendingSubmissionsCount = useMemo(
    () => submissions.filter((s) => s.status === 'pending').length,
    [submissions]
  );
  const gradedSubmissionsCount = useMemo(
    () => submissions.filter((s) => s.status === 'graded').length,
    [submissions]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2C3E2D] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#8BA88E]/40 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#141F16] rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8BA88E]" />
                <span className="text-xs font-bold truncate max-w-md">{previewImage.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage.url}
                  download={previewImage.title || 'vazifa.jpg'}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Yuklab olish</span>
                </a>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[80vh] overflow-auto bg-black/50">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[74vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TEACHER VIEW: CREATE HOMEWORK & REVIEW/GRADE STUDENT SUBMISSIONS      */}
      {/* ===================================================================== */}
      {role === 'teacher' && (
        <>
          {/* Hero Header & Stats */}
          <div className="bg-gradient-to-r from-[#2C3E2D] to-[#1E2E20] rounded-3xl p-6 text-white shadow-lg border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A7C2AA] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Uyga Vazifalar va Tekshirish Markazi</span>
                </div>
                <h2 className="text-2xl font-serif italic font-bold">
                  O'quvchilarga Vazifa Berish va Yuborilgan Ishlarni Baholash
                </h2>
                <p className="text-xs text-white/75 mt-1 max-w-2xl">
                  O'quvchilar uyga vazifani bajarib, surat (skrinshot) yoki fayl ko'rinishida yuklaydilar. Siz ularni ko'rib chiqib ball qo'ysangiz, ballar avtomatik ravishda Baholash jurnali va Reyting jadvaliga qo'shiladi.
                </p>
              </div>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#1C2C1D] rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Yangi Uyga Vazifa Berish</span>
              </button>
            </div>

            {/* Quick Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
                <p className="text-[11px] text-white/70 font-medium">Berilgan Vazifalar</p>
                <p className="text-2xl font-black text-white mt-0.5">{assignments.length} ta</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
                <p className="text-[11px] text-white/70 font-medium">Kelib Tushgan Javoblar</p>
                <p className="text-2xl font-black text-white mt-0.5">{submissions.length} ta</p>
              </div>
              <div className="bg-amber-400/20 backdrop-blur-xs rounded-2xl p-3.5 border border-amber-400/30">
                <p className="text-[11px] text-amber-200 font-bold">Tekshirishni Kutmoqda</p>
                <p className="text-2xl font-black text-amber-300 mt-0.5">
                  {pendingSubmissionsCount} ta
                </p>
              </div>
              <div className="bg-emerald-400/20 backdrop-blur-xs rounded-2xl p-3.5 border border-emerald-400/30">
                <p className="text-[11px] text-emerald-200 font-bold">Tekshirilgan va Baholangan</p>
                <p className="text-2xl font-black text-emerald-300 mt-0.5">
                  {gradedSubmissionsCount} ta
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Sub-Tab Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-[#152017] p-1.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
              <button
                onClick={() => setTeacherTab('submissions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  teacherTab === 'submissions'
                    ? 'bg-[#2C3E2D] text-white shadow-xs'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>O'quvchilar Yuborgan Vazifalar ({submissions.length})</span>
                {pendingSubmissionsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-[#1C2C1D] font-black">
                    +{pendingSubmissionsCount} yangi
                  </span>
                )}
              </button>

              <button
                onClick={() => setTeacherTab('assignments')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  teacherTab === 'assignments'
                    ? 'bg-[#2C3E2D] text-white shadow-xs'
                    : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Berilgan Uyga Vazifalar Ro'yxati ({assignments.length})</span>
              </button>
            </div>

            {teacherTab === 'submissions' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#828282] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="O'quvchi yoki mavzu..."
                    className="pl-8 pr-3 py-2 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
                >
                  <option value="all">Barcha holatlar ({submissions.length})</option>
                  <option value="pending">Tekshirilmagan ({pendingSubmissionsCount})</option>
                  <option value="graded">Baholangan ({gradedSubmissionsCount})</option>
                  <option value="revision">Qayta ishlashda</option>
                </select>

                <select
                  value={selectedAssignmentFilter}
                  onChange={(e) => setSelectedAssignmentFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] rounded-xl text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] max-w-[220px]"
                >
                  <option value="all">Barcha vazifalar</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.lessonId}-dars: {a.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* SUB-VIEW 1: STUDENT SUBMISSIONS FOR REVIEW & GRADING */}
          {teacherTab === 'submissions' && (
            <div className="flex flex-col gap-4">
              {filteredSubmissions.map((sub) => {
                const isImage =
                  sub.fileType === 'image' || sub.fileDataUrl?.startsWith('data:image');
                const currentScoreInput =
                  gradingScores[sub.id] !== undefined
                    ? gradingScores[sub.id]
                    : sub.score !== null && sub.score !== undefined
                    ? sub.score
                    : 90;
                const currentFeedbackInput =
                  gradingFeedbacks[sub.id] !== undefined
                    ? gradingFeedbacks[sub.id]
                    : sub.teacherFeedback || '';

                return (
                  <div
                    key={sub.id}
                    className={`bg-white dark:bg-[#152017] rounded-3xl p-5 sm:p-6 border shadow-xs transition ${
                      sub.status === 'pending'
                        ? 'border-amber-400/60 dark:border-amber-500/40'
                        : sub.status === 'graded'
                        ? 'border-emerald-500/40 dark:border-emerald-500/30'
                        : 'border-rose-400/50'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Column: Student Info & Uploaded File/Photo */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-[#2C3E2D] text-white flex items-center justify-center font-serif italic font-bold text-base">
                                {sub.studentName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                                  {sub.studentName}
                                </h4>
                                <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                                  Topshirildi:{' '}
                                  {new Date(sub.submittedAt).toLocaleString('uz-UZ', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                                  sub.track === 'design'
                                    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                                }`}
                              >
                                {sub.track === 'design' ? '🎨 Dizayn' : '💻 Savodxonlik'} ·{' '}
                                {sub.lessonId}-dars
                              </span>

                              {sub.status === 'pending' && (
                                <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[11px] font-black flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  Tekshirilmagan
                                </span>
                              )}
                              {sub.status === 'graded' && (
                                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-black flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Baholandi: {sub.score}/{sub.maxScore || 100}
                                </span>
                              )}
                              {sub.status === 'revision' && (
                                <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] font-black flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Qayta ishlashda
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA] mb-2">
                            Mavzu: {sub.lessonTitle}
                          </p>

                          {sub.comment && (
                            <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#D4DFD6] mb-3">
                              <span className="font-bold text-[#8BA88E] block text-[10px] uppercase mb-0.5">
                                O'quvchi izohi:
                              </span>
                              "{sub.comment}"
                            </div>
                          )}
                        </div>

                        {/* Uploaded Image or File Preview Box */}
                        <div className="rounded-2xl border border-[#EBE7DF] dark:border-[#243326] bg-[#FAF8F5] dark:bg-[#111A13] p-3.5">
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              {isImage ? (
                                <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <FileIcon className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                              <span className="text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7] truncate">
                                {sub.fileName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isImage && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewImage({
                                      url: sub.fileDataUrl,
                                      title: `${sub.studentName} — ${sub.fileName}`,
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-[#2C3E2D] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#1E2E20] transition"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Kattalashtirish</span>
                                </button>
                              )}
                              <a
                                href={sub.fileDataUrl}
                                download={sub.fileName || 'vazifa'}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1C281F] border border-[#EBE7DF] dark:border-[#2C3E2D] text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] flex items-center gap-1 hover:bg-gray-50 transition"
                              >
                                <Download className="w-3 h-3" />
                                <span>Yuklab olish</span>
                              </a>
                            </div>
                          </div>

                          {isImage ? (
                            <div
                              onClick={() =>
                                setPreviewImage({
                                  url: sub.fileDataUrl,
                                  title: `${sub.studentName} — ${sub.fileName}`,
                                })
                              }
                              className="cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-black/5 max-h-64 flex items-center justify-center"
                            >
                              <img
                                src={sub.fileDataUrl}
                                alt={sub.fileName}
                                className="max-h-60 w-auto object-contain hover:scale-102 transition-transform"
                              />
                            </div>
                          ) : (
                            <div className="py-4 px-4 rounded-xl bg-white dark:bg-[#162118] border border-dashed border-[#8BA88E]/40 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileIcon className="w-8 h-8 text-[#8BA88E]" />
                                <div>
                                  <p className="text-xs font-bold text-[#1A2E1C] dark:text-white">
                                    Yuklangan Hujjat / Fayl
                                  </p>
                                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                                    Tekshirish uchun "Yuklab olish" tugmasini bosing
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Teacher Grading Controls */}
                      <div className="lg:col-span-5 bg-[#FAF8F5] dark:bg-[#111A13] rounded-2xl p-4 sm:p-5 border border-[#EBE7DF] dark:border-[#243326] flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-[#2C3E2D] dark:text-[#8BA88E] flex items-center gap-1.5">
                              <Award className="w-4 h-4" />
                              Vazifani Baholash (0 - {sub.maxScore || 100} ball)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Ushbu yuborilgan javobni o'chirmoqchimisiz?")) {
                                  deleteSubmission(sub.id);
                                  loadData();
                                }
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                              title="Javobni o'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Score Presets */}
                          <div className="grid grid-cols-5 gap-1.5 mb-3">
                            {[100, 90, 85, 75, 60].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() =>
                                  setGradingScores((prev) => ({ ...prev, [sub.id]: preset }))
                                }
                                className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                                  Number(currentScoreInput) === preset
                                    ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                                    : 'bg-white dark:bg-[#172219] text-[#2D2D2D] dark:text-[#D4DFD6] border-[#EBE7DF] dark:border-[#283A2A] hover:border-[#8BA88E]'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>

                          {/* Score Slider & Number Input */}
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="range"
                              min={0}
                              max={sub.maxScore || 100}
                              value={currentScoreInput}
                              onChange={(e) =>
                                setGradingScores((prev) => ({
                                  ...prev,
                                  [sub.id]: Number(e.target.value),
                                }))
                              }
                              className="flex-1 accent-[#2C3E2D]"
                            />
                            <div className="flex items-center gap-1 bg-white dark:bg-[#172219] border border-[#EBE7DF] dark:border-[#283A2A] rounded-xl px-3 py-1.5">
                              <input
                                type="number"
                                min={0}
                                max={sub.maxScore || 100}
                                value={currentScoreInput}
                                onChange={(e) =>
                                  setGradingScores((prev) => ({
                                    ...prev,
                                    [sub.id]: Number(e.target.value),
                                  }))
                                }
                                className="w-12 text-center font-black text-sm text-[#1A2E1C] dark:text-white bg-transparent focus:outline-none"
                              />
                              <span className="text-[11px] text-[#828282]">ball</span>
                            </div>
                          </div>

                          {/* Teacher Feedback Input */}
                          <div>
                            <label className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] block mb-1">
                              O'quvchiga ustoz izohi:
                            </label>
                            <textarea
                              rows={2}
                              value={currentFeedbackInput}
                              onChange={(e) =>
                                setGradingFeedbacks((prev) => ({
                                  ...prev,
                                  [sub.id]: e.target.value,
                                }))
                              }
                              placeholder="Masalan: Barakalla, barcha qadamlar to'g'ri bajarilgan!"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#172219] border border-[#EBE7DF] dark:border-[#283A2A] text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E]"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub, 'graded')}
                            className="w-full sm:flex-1 py-2.5 px-4 bg-[#2C3E2D] hover:bg-[#1E2E20] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>
                              {sub.status === 'graded'
                                ? 'Bahoni Yangilash'
                                : `${currentScoreInput} Ball Qo'yish va Tasdiqlash`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub, 'revision')}
                            className="w-full sm:w-auto py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-bold transition"
                            title="Qayta bajarish uchun qaytarish"
                          >
                            Qayta ishlashga
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSubmissions.length === 0 && (
                <div className="bg-white dark:bg-[#152017] rounded-3xl p-12 text-center border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                  <Upload className="w-10 h-10 text-[#8BA88E]/50 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    Hozircha kelib tushgan uyga vazifalar yo'q
                  </h4>
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-md mx-auto">
                    Yuqoridagi "Yangi Uyga Vazifa Berish" tugmasi orqali o'quvchilarga topshiriq e'lon qiling. O'quvchilar surat yoki fayl yuklaganda shu yerda ko'rinadi.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: LIST OF CREATED HOMEWORK ASSIGNMENTS */}
          {teacherTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((hw) => {
                const subCount = submissions.filter((s) => s.assignmentId === hw.id).length;
                return (
                  <div
                    key={hw.id}
                    className="bg-white dark:bg-[#152017] rounded-3xl p-5 border border-[#EBE7DF] dark:border-[#243326] shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                            hw.track === 'design'
                              ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                              : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {hw.track === 'design' ? '🎨 Grafik Dizayn' : '💻 Savodxonlik'} ·{' '}
                          {hw.lessonId}-dars
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#8BA88E]">
                            Max: {hw.maxScore} ball
                          </span>
                          <button
                            onClick={() => {
                              if (confirm("Ushbu uyga vazifani o'chirmoqchimisiz?")) {
                                deleteAssignment(hw.id);
                                loadData();
                                showToast("Uyga vazifa o'chirildi.");
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                        {hw.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#8BA88E] mb-2">
                        Dars: {hw.lessonTitle}
                      </p>
                      <p className="text-xs text-[#2D2D2D] dark:text-[#D4DFD6] whitespace-pre-line leading-relaxed bg-[#FAF8F5] dark:bg-[#111A13] p-3.5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
                        {hw.description}
                      </p>

                      {hw.attachmentUrl && (
                        <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326]">
                          <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA] truncate">
                            📎 Namuna fayl: {hw.attachmentName || 'Ilova'}
                          </span>
                          <a
                            href={hw.attachmentUrl}
                            download={hw.attachmentName || 'namuna'}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Yuklab olish
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#EBE7DF] dark:border-[#243326] text-[11px] text-[#828282] dark:text-[#9FB1A2]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <Users className="w-3.5 h-3.5 text-[#8BA88E]" />
                          {getTargetLabel(hw.targetGroup)}
                        </span>
                        {hw.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            Muddat: {hw.dueDate}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAssignmentFilter(hw.id);
                          setTeacherTab('submissions');
                        }}
                        className="px-3 py-1 rounded-xl bg-[#2C3E2D]/10 dark:bg-white/10 text-[#2C3E2D] dark:text-white font-bold hover:bg-[#2C3E2D] hover:text-white transition"
                      >
                        Topshiriqlar: {subCount} ta →
                      </button>
                    </div>
                  </div>
                );
              })}

              {assignments.length === 0 && (
                <div className="col-span-full bg-white dark:bg-[#152017] rounded-3xl p-12 text-center border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                  <FileText className="w-10 h-10 text-[#8BA88E]/50 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    Hali uyga vazifa berilmagan
                  </h4>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-3 px-4 py-2 bg-[#2C3E2D] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Ilk uyga vazifani yaratish
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CREATE HOMEWORK MODAL (TEACHER) */}
          {isCreateOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#152017] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBE7DF] dark:border-[#243326] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#EBE7DF] dark:border-[#243326]">
                  <div>
                    <h3 className="text-lg font-serif italic font-bold text-[#1A2E1C] dark:text-white">
                      Yangi Uyga Vazifa Berish
                    </h3>
                    <p className="text-xs text-[#828282] dark:text-[#9FB1A2]">
                      O'quvchilar kabinetida darhol ko'rinadi
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-[#828282]" />
                  </button>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                        Kurs Yo'nalishi
                      </label>
                      <select
                        value={hwTrack}
                        onChange={(e) => {
                          setHwTrack(e.target.value as 'literacy' | 'design');
                          setHwLessonId(1);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
                      >
                        <option value="literacy">💻 Kompyuter Savodxonligi</option>
                        <option value="design">🎨 Grafik Dizayn</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                        Qaysi dars uchun?
                      </label>
                      <select
                        value={hwLessonId}
                        onChange={(e) => setHwLessonId(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
                      >
                        {activeCurriculumLessons.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.id}-dars: {l.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                        Kimga mo'ljallangan?
                      </label>
                      <select
                        value={hwTargetGroup}
                        onChange={(e) => setHwTargetGroup(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs font-bold text-[#2D2D2D] dark:text-[#E6EAE7]"
                      >
                        <option value="all">🌍 Barcha o'quvchilarga</option>
                        <optgroup label="Guruhlar bo'yicha">
                          {SCHEDULE_GROUPS.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} ({g.timeSlot})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Alohida o'quvchi">
                          {students.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.fullName} (@{st.login})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                        Topshirish muddati (ixtiyoriy)
                      </label>
                      <input
                        type="date"
                        value={hwDueDate}
                        onChange={(e) => setHwDueDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#E6EAE7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      Vazifa sarlavhasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={hwTitle}
                      onChange={(e) => setHwTitle(e.target.value)}
                      placeholder="Masalan: Kompyuter qurilmalari sxemasini chizish yoki skrinshot yuborish"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#E6EAE7]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      Vazifa sharti va ko'rsatmalar *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={hwDescription}
                      onChange={(e) => setHwDescription(e.target.value)}
                      placeholder="O'quvchi nima qilishi kerak va qanday rasm yoki fayl yuklashi kerakligini yozing..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#E6EAE7]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                      Namuna rasm yoki fayl biriktirish (ixtiyoriy)
                    </label>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#8BA88E] bg-[#FAF8F5] dark:bg-[#111A13] cursor-pointer hover:bg-[#F5F5F0] text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA]">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingTeacherFile
                          ? 'Yuklanmoqda...'
                          : hwAttachment
                          ? `Tanlandi: ${hwAttachment.fileName}`
                          : 'Namuna rasm yoki hujjat tanlash'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt"
                        onChange={handleTeacherFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EBE7DF] dark:border-[#243326]">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#828282] hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#2C3E2D] hover:bg-[#1E2E20] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Vazifani E'lon Qilish</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* STUDENT VIEW: VIEW HOMEWORKS, UPLOAD PHOTO/FILE & SEE TEACHER GRADES  */}
      {/* ===================================================================== */}
      {role === 'student' && (
        <div className="flex flex-col gap-5">
          {/* Student Homework Banner */}
          <div className="bg-gradient-to-r from-[#2C3E2D] to-[#1E2E20] rounded-3xl p-6 text-white shadow-md border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mening Uyga Vazifalarim</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif italic font-bold">
                  Ustoz Bergan Topshiriqlar va Javob Yuklash
                </h3>
                <p className="text-xs text-white/75 mt-1 max-w-xl">
                  Vazifani bajarib bo'lgach, natijani rasmga (skrinshotga) olib yoki fayl shaklida yuklang. Ustoz tekshirib qo'ygan ballar darhol sizning Reyting hisobingizga qo'shiladi!
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                    Vazifalar
                  </span>
                  <span className="text-lg font-black text-white">
                    {studentAssignments.length} ta
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Assignments List */}
          <div className="flex flex-col gap-4">
            {studentAssignments.map((hw) => {
              const mySub = getStudentSubmissionForAssignment(hw.id);
              const isUploadingThis = activeUploadAssignmentId === hw.id;
              const isSubImage =
                mySub?.fileType === 'image' || mySub?.fileDataUrl?.startsWith('data:image');

              return (
                <div
                  key={hw.id}
                  className={`bg-white dark:bg-[#152017] rounded-3xl p-5 sm:p-6 border shadow-xs transition ${
                    mySub?.status === 'graded'
                      ? 'border-emerald-500/40 dark:border-emerald-500/30'
                      : mySub?.status === 'pending'
                      ? 'border-blue-400/40'
                      : mySub?.status === 'revision'
                      ? 'border-rose-400/60'
                      : 'border-[#EBE7DF] dark:border-[#243326]'
                  }`}
                >
                  {/* Top Row: Track, Lesson & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          hw.track === 'design'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {hw.track === 'design' ? '🎨 Grafik Dizayn' : '💻 Savodxonlik'} ·{' '}
                        {hw.lessonId}-dars
                      </span>
                      {hw.dueDate && (
                        <span className="text-xs text-[#828282] dark:text-[#9FB1A2] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          Muddat: {hw.dueDate}
                        </span>
                      )}
                    </div>

                    {/* Submission Status Pill */}
                    <div>
                      {!mySub && (
                        <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Topshirilmagan (Max: {hw.maxScore} ball)
                        </span>
                      )}
                      {mySub?.status === 'pending' && (
                        <span className="px-3 py-1 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Yuborilgan · Ustoz tekshirmoqda
                        </span>
                      )}
                      {mySub?.status === 'graded' && (
                        <span className="px-3.5 py-1 rounded-xl bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
                          <Award className="w-4 h-4" />
                          Baholandi: {mySub.score} / {hw.maxScore} ball
                        </span>
                      )}
                      {mySub?.status === 'revision' && (
                        <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" />
                          Qayta ishlash so'ralgan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Instructions */}
                  <h4 className="text-lg font-bold text-[#1A2E1C] dark:text-white">{hw.title}</h4>
                  <p className="text-xs font-semibold text-[#8BA88E] mb-3">
                    Dars: {hw.lessonTitle}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] text-xs sm:text-sm text-[#2D2D2D] dark:text-[#E6EAE7] whitespace-pre-line leading-relaxed mb-4">
                    {hw.description}
                  </div>

                  {/* Optional Teacher Attachment */}
                  {hw.attachmentUrl && (
                    <div className="mb-4 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#2C3E2D] dark:text-[#A7C2AA] truncate">
                        📎 Ustoz biriktirgan namuna: {hw.attachmentName || 'Fayl'}
                      </span>
                      <a
                        href={hw.attachmentUrl}
                        download={hw.attachmentName || 'namuna'}
                        className="px-3 py-1.5 rounded-xl bg-[#2C3E2D] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Yuklab olish
                      </a>
                    </div>
                  )}

                  {/* Teacher Grade & Feedback Card (When Graded or Revision) */}
                  {mySub && (mySub.status === 'graded' || mySub.status === 'revision') && (
                    <div
                      className={`mb-4 p-4 rounded-2xl border ${
                        mySub.status === 'graded'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          {mySub.status === 'graded'
                            ? `Ustoz Bahosi: ${mySub.score} / ${hw.maxScore} Ball`
                            : 'Ustoz Izohi (Qayta yuklang):'}
                        </span>
                        {mySub.gradedAt && (
                          <span className="text-[11px] opacity-75">
                            {new Date(mySub.gradedAt).toLocaleDateString('uz-UZ')}
                          </span>
                        )}
                      </div>
                      {mySub.teacherFeedback && (
                        <p className="text-xs font-medium mt-1">"{mySub.teacherFeedback}"</p>
                      )}
                    </div>
                  )}

                  {/* Existing Student Submission Preview */}
                  {mySub && !isUploadingThis && (
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#243326] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {isSubImage ? (
                          <img
                            src={mySub.fileDataUrl}
                            alt={mySub.fileName}
                            onClick={() =>
                              setPreviewImage({ url: mySub.fileDataUrl, title: mySub.fileName })
                            }
                            className="w-16 h-16 rounded-xl object-cover border border-black/10 cursor-pointer shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#2C3E2D]/10 flex items-center justify-center shrink-0">
                            <FileIcon className="w-6 h-6 text-[#2C3E2D] dark:text-[#8BA88E]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1A2E1C] dark:text-white truncate">
                            Siz yuklagan javob: {mySub.fileName}
                          </p>
                          {mySub.comment && (
                            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] truncate">
                              Izoh: "{mySub.comment}"
                            </p>
                          )}
                          <p className="text-[11px] text-[#8BA88E] mt-0.5">
                            Yuborilgan vaqt:{' '}
                            {new Date(mySub.submittedAt).toLocaleString('uz-UZ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSubImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewImage({ url: mySub.fileDataUrl, title: mySub.fileName })
                            }
                            className="px-3 py-2 rounded-xl bg-white dark:bg-[#1C281F] border border-[#EBE7DF] dark:border-[#2C3E2D] text-xs font-bold text-[#2C3E2D] dark:text-[#E6EAE7] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ko'rish</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadAssignmentId(hw.id);
                            setStudentComment(mySub.comment || '');
                            setSelectedFile({
                              dataUrl: mySub.fileDataUrl,
                              fileName: mySub.fileName,
                              fileType: (mySub.fileType as 'image' | 'file') || 'image',
                            });
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#2C3E2D] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1E2E20] transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Yangilash / Qayta yuklash</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Button to open Upload Box when not yet submitted */}
                  {!mySub && !isUploadingThis && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadAssignmentId(hw.id);
                        setSelectedFile(null);
                        setStudentComment('');
                      }}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#2C3E2D] hover:bg-[#1E2E20] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Vazifani Bajarish — Surat yoki Fayl Yuklash</span>
                    </button>
                  )}

                  {/* Interactive Student File/Photo Upload Panel */}
                  {isUploadingThis && (
                    <div className="mt-2 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#111A13] border-2 border-[#8BA88E] space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black uppercase tracking-wider text-[#2C3E2D] dark:text-[#A7C2AA] flex items-center gap-1.5">
                          <Upload className="w-4 h-4" />
                          Bajargan vazifangizni surat yoki fayl ko'rinishida yuklang
                        </h5>
                        <button
                          type="button"
                          onClick={() => setActiveUploadAssignmentId(null)}
                          className="p-1 text-[#828282] hover:text-[#2D2D2D]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-[#8BA88E]/60 bg-white dark:bg-[#152017] cursor-pointer hover:border-[#2C3E2D] transition text-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#8BA88E]/15 text-[#2C3E2D] dark:text-[#8BA88E] flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#1A2E1C] dark:text-white">
                            {uploadingStudentFile
                              ? 'Rasm / fayl tayyorlanmoqda...'
                              : selectedFile
                              ? `Tanlandi: ${selectedFile.fileName}`
                              : 'Surat (Skrinshot) yoki Fayl tanlash uchun bosing'}
                          </p>
                          <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                            Rasm (JPG, PNG, WEBP) yoki Hujjat (PDF, DOCX, PPTX, ZIP, XLSX)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
                          onChange={handleStudentFileChange}
                          className="hidden"
                        />
                      </label>

                      {selectedFile && (
                        <div className="p-3 rounded-xl bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {selectedFile.fileType === 'image' ? (
                              <img
                                src={selectedFile.dataUrl}
                                alt="Preview"
                                className="w-14 h-14 rounded-lg object-cover border"
                              />
                            ) : (
                              <FileIcon className="w-8 h-8 text-blue-600 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1A2E1C] dark:text-white truncate">
                                {selectedFile.fileName}
                              </p>
                              <p className="text-[11px] text-emerald-600 font-semibold">
                                ✓ Yuklashga tayyor
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                          Ustozga izohingiz (ixtiyoriy):
                        </label>
                        <input
                          type="text"
                          value={studentComment}
                          onChange={(e) => setStudentComment(e.target.value)}
                          placeholder="Masalan: Ustoz, barcha topshiriqlarni bajardim!"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] text-xs text-[#2D2D2D] dark:text-[#E6EAE7]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveUploadAssignmentId(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-[#828282]"
                        >
                          Bekor qilish
                        </button>
                        <button
                          type="button"
                          disabled={!selectedFile || submittingHw}
                          onClick={() => handleStudentSubmit(hw)}
                          className="px-5 py-2.5 rounded-xl bg-[#2C3E2D] hover:bg-[#1E2E20] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingHw ? 'Yuborilmoqda...' : 'Ustozga Yuborish'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {studentAssignments.length === 0 && (
              <div className="bg-white dark:bg-[#152017] rounded-3xl p-12 text-center border border-dashed border-[#EBE7DF] dark:border-[#243326]">
                <FileText className="w-10 h-10 text-[#8BA88E]/50 mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Hozircha yangi uyga vazifalar yo'q
                </h4>
                <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 max-w-md mx-auto">
                  Ustoz yangi uyga vazifa e'lon qilishi bilan shu yerda paydo bo'ladi va siz uni bajarib rasm yoki fayl shaklida yuklashingiz mumkin bo'ladi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkCenter;
