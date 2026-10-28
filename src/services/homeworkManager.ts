import { addOrUpdateGrade, getStoredStudents } from './studentManager';
import { getGroupByStudent } from './scheduleManager';

export interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  targetGroup: string; // 'all' | 'group_1_mon_wed' | 'group_2_mon_wed' | 'group_3_tue_thu' | studentId
  dueDate?: string;
  maxScore: number;
  attachmentUrl?: string;
  attachmentName?: string;
  teacherName?: string;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentLogin?: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  comment?: string;
  fileDataUrl: string;
  fileName: string;
  fileType: string; // 'image' | 'file' or MIME type
  status: 'pending' | 'graded' | 'revision';
  score?: number | null;
  maxScore?: number;
  teacherFeedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

const STORAGE_ASSIGNMENTS_KEY = 'it_portal_homework_assignments_db';
const STORAGE_SUBMISSIONS_KEY = 'it_portal_homework_submissions_db';

export const getStoredAssignments = (): HomeworkAssignment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_ASSIGNMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read homework assignments:', e);
    return [];
  }
};

export const saveAssignments = (assignments: HomeworkAssignment[]): void => {
  try {
    localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, JSON.stringify(assignments));
    window.dispatchEvent(new CustomEvent('homeworks_updated'));
  } catch (e) {
    console.error('Failed to save homework assignments:', e);
  }
};

export const getStoredSubmissions = (): HomeworkSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read homework submissions:', e);
    return [];
  }
};

export const saveSubmissions = (submissions: HomeworkSubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(submissions));
    window.dispatchEvent(new CustomEvent('homeworks_updated'));
  } catch (e) {
    console.error('Failed to save homework submissions:', e);
  }
};

// Create or update a Homework Assignment (Teacher)
export const createOrUpdateAssignment = (data: {
  id?: string;
  title: string;
  description: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  targetGroup?: string;
  dueDate?: string;
  maxScore?: number;
  attachmentUrl?: string;
  attachmentName?: string;
  teacherName?: string;
}): HomeworkAssignment => {
  const assignments = getStoredAssignments();
  const existingIdx = data.id ? assignments.findIndex((a) => a.id === data.id) : -1;

  const item: HomeworkAssignment = {
    id: existingIdx >= 0 ? assignments[existingIdx].id : `hw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: data.title.trim(),
    description: data.description.trim(),
    track: data.track,
    lessonId: data.lessonId,
    lessonTitle: data.lessonTitle,
    targetGroup: data.targetGroup || 'all',
    dueDate: data.dueDate || '',
    maxScore: data.maxScore || 100,
    attachmentUrl: data.attachmentUrl || '',
    attachmentName: data.attachmentName || '',
    teacherName: data.teacherName || 'Assadxoja',
    createdAt: existingIdx >= 0 ? assignments[existingIdx].createdAt : new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    assignments[existingIdx] = item;
  } else {
    assignments.unshift(item);
  }

  saveAssignments(assignments);

  fetch('/api/homeworks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  }).catch((err) => console.warn('Failed to sync homework assignment:', err));

  return item;
};

export const deleteAssignment = (id: string): boolean => {
  const assignments = getStoredAssignments();
  const filtered = assignments.filter((a) => a.id !== id);
  if (filtered.length === assignments.length) return false;
  saveAssignments(filtered);

  const submissions = getStoredSubmissions().filter((s) => s.assignmentId !== id);
  saveSubmissions(submissions);

  fetch(`/api/homeworks/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

// Get assignments applicable to a specific student
export const getAssignmentsForStudent = (
  studentIdOrLogin: string,
  studentName?: string
): HomeworkAssignment[] => {
  const assignments = getStoredAssignments();
  const students = getStoredStudents();
  const cleanKey = studentIdOrLogin.trim().toLowerCase();

  const student = students.find(
    (s) =>
      s.id.toLowerCase() === cleanKey ||
      s.login.toLowerCase() === cleanKey ||
      (studentName && s.fullName.toLowerCase() === studentName.trim().toLowerCase())
  );

  const group = getGroupByStudent(student?.fullName || studentName || studentIdOrLogin);

  return assignments.filter((a) => {
    if (!a.targetGroup || a.targetGroup === 'all') return true;
    if (student && a.targetGroup === student.id) return true;
    if (student && a.targetGroup.toLowerCase() === student.login.toLowerCase()) return true;
    if (group && a.targetGroup === group.id) return true;
    return false;
  });
};

// Student submits (or re-submits) homework with an image or file
export const submitHomework = (data: {
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentLogin?: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  comment?: string;
  fileDataUrl: string;
  fileName: string;
  fileType: string;
  maxScore?: number;
}): HomeworkSubmission => {
  const submissions = getStoredSubmissions();
  const existingIdx = submissions.findIndex(
    (s) =>
      s.assignmentId === data.assignmentId &&
      (s.studentId === data.studentId ||
        (data.studentLogin && s.studentLogin?.toLowerCase() === data.studentLogin.toLowerCase()))
  );

  const now = new Date().toISOString();
  const submissionItem: HomeworkSubmission = {
    id: existingIdx >= 0 ? submissions[existingIdx].id : `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    studentName: data.studentName,
    studentLogin: data.studentLogin || '',
    track: data.track,
    lessonId: data.lessonId,
    lessonTitle: data.lessonTitle,
    comment: data.comment?.trim() || '',
    fileDataUrl: data.fileDataUrl,
    fileName: data.fileName,
    fileType: data.fileType,
    status: 'pending',
    score: existingIdx >= 0 ? submissions[existingIdx].score : null,
    maxScore: data.maxScore || 100,
    teacherFeedback: existingIdx >= 0 ? submissions[existingIdx].teacherFeedback : '',
    submittedAt: now,
    gradedAt: existingIdx >= 0 ? submissions[existingIdx].gradedAt : undefined,
  };

  if (existingIdx >= 0) {
    submissions[existingIdx] = submissionItem;
  } else {
    submissions.unshift(submissionItem);
  }

  saveSubmissions(submissions);

  fetch('/api/homework-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionItem),
  }).catch((err) => console.warn('Failed to sync homework submission:', err));

  return submissionItem;
};

// Teacher grades a student's homework submission and automatically updates student gradebook & leaderboard
export const gradeHomeworkSubmission = (data: {
  submissionId: string;
  score: number;
  maxScore?: number;
  teacherFeedback?: string;
  status?: 'graded' | 'revision';
  teacherName?: string;
}): HomeworkSubmission | null => {
  const submissions = getStoredSubmissions();
  const idx = submissions.findIndex((s) => s.id === data.submissionId);
  if (idx === -1) return null;

  const target = submissions[idx];
  const finalStatus = data.status || 'graded';
  const maxScore = data.maxScore || target.maxScore || 100;
  const cleanScore = Math.max(0, Math.min(maxScore, Math.round(data.score)));

  const updated: HomeworkSubmission = {
    ...target,
    status: finalStatus,
    score: cleanScore,
    maxScore,
    teacherFeedback:
      data.teacherFeedback?.trim() ||
      (finalStatus === 'graded'
        ? "Uyga vazifa tekshirildi va baholandi!"
        : "Uyga vazifani ko'rib chiqib, qayta yuklang."),
    gradedAt: new Date().toISOString(),
  };

  submissions[idx] = updated;
  saveSubmissions(submissions);

  fetch('/api/homework-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  }).catch((err) => console.warn('Failed to sync graded submission:', err));

  // If graded, also record in the main student gradebook so Leaderboard & Student Profile update automatically!
  if (finalStatus === 'graded') {
    const students = getStoredStudents();
    const matchedStudent = students.find(
      (s) =>
        s.id === updated.studentId ||
        (updated.studentLogin && s.login.toLowerCase() === updated.studentLogin.toLowerCase()) ||
        s.fullName.toLowerCase() === updated.studentName.toLowerCase()
    );

    addOrUpdateGrade({
      studentId: matchedStudent ? matchedStudent.id : updated.studentId,
      studentName: matchedStudent ? matchedStudent.fullName : updated.studentName,
      track: updated.track,
      lessonId: updated.lessonId,
      lessonTitle: `${updated.lessonTitle} (Uyga vazifa)`,
      score: cleanScore,
      maxScore,
      feedback: updated.teacherFeedback,
      teacherName: data.teacherName || 'Assadxoja',
    });
  }

  return updated;
};

export const deleteSubmission = (id: string): boolean => {
  const submissions = getStoredSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  if (filtered.length === submissions.length) return false;
  saveSubmissions(filtered);
  fetch(`/api/homework-submissions/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

// Helper to compress images or read files into Base64 DataURL
export const processHomeworkFile = (
  file: File
): Promise<{ dataUrl: string; fileName: string; fileType: 'image' | 'file' }> => {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      if (file.size > 15 * 1024 * 1024) {
        reject(new Error('Fayl hajmi 15 MB dan oshmasligi kerak.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          fileName: file.name,
          fileType: 'file',
        });
      };
      reader.onerror = () => reject(new Error("Faylni o'qishda xatolik yuz berdi."));
      reader.readAsDataURL(file);
      return;
    }

    // Compress image to max 1600px width/height so phone photos upload fast across devices
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: event.target?.result as string,
            fileName: file.name,
            fileType: 'image',
          });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
        resolve({
          dataUrl: compressedDataUrl,
          fileName: file.name,
          fileType: 'image',
        });
      };
      img.onerror = () => {
        resolve({
          dataUrl: event.target?.result as string,
          fileName: file.name,
          fileType: 'image',
        });
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Rasmni o'qishda xatolik yuz berdi."));
    reader.readAsDataURL(file);
  });
};

// Synchronize homework assignments and submissions with the shared server database
const HW_CLOUD_MIGRATED_FLAG = 'it_portal_hw_cloud_migrated_v2';

export const syncHomeworksWithServer = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    const isMigrated = localStorage.getItem(HW_CLOUD_MIGRATED_FLAG) === 'true';
    const localAssignments = getStoredAssignments();
    const localSubmissions = getStoredSubmissions();

    const [hwRes, subRes] = await Promise.all([
      fetch('/api/homeworks'),
      fetch('/api/homework-submissions'),
    ]);

    let changed = false;

    if (hwRes.ok) {
      const data = await hwRes.json();
      if (Array.isArray(data.assignments)) {
        const hwMap = new Map<string, HomeworkAssignment>();
        data.assignments.forEach((a: HomeworkAssignment) => hwMap.set(a.id, a));

        if (!isMigrated) {
          for (const locA of localAssignments) {
            if (!hwMap.has(locA.id)) {
              hwMap.set(locA.id, locA);
              fetch('/api/homeworks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(locA),
              }).catch(() => {});
            }
          }
        }

        const merged = Array.from(hwMap.values());
        const currentRaw = localStorage.getItem(STORAGE_ASSIGNMENTS_KEY);
        const nextRaw = JSON.stringify(merged);
        if (currentRaw !== nextRaw) {
          localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, nextRaw);
          changed = true;
        }
      }
    }

    if (subRes.ok) {
      const data = await subRes.json();
      if (Array.isArray(data.submissions)) {
        const subMap = new Map<string, HomeworkSubmission>();
        data.submissions.forEach((s: HomeworkSubmission) => subMap.set(s.id, s));

        if (!isMigrated) {
          for (const locS of localSubmissions) {
            if (!subMap.has(locS.id)) {
              subMap.set(locS.id, locS);
              fetch('/api/homework-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(locS),
              }).catch(() => {});
            }
          }
        }

        const merged = Array.from(subMap.values());
        const currentRaw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
        const nextRaw = JSON.stringify(merged);
        if (currentRaw !== nextRaw) {
          localStorage.setItem(STORAGE_SUBMISSIONS_KEY, nextRaw);
          changed = true;
        }
      }
    }

    if (!isMigrated && hwRes.ok) {
      localStorage.setItem(HW_CLOUD_MIGRATED_FLAG, 'true');
    }

    if (changed) {
      window.dispatchEvent(new CustomEvent('homeworks_updated'));
    }
  } catch (err) {
    // Graceful fallback to local storage
  }
};

if (typeof window !== 'undefined') {
  syncHomeworksWithServer();
  setInterval(syncHomeworksWithServer, 8000);
  window.addEventListener('focus', syncHomeworksWithServer);
  window.addEventListener('students_updated', syncHomeworksWithServer);
}
