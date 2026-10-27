export interface StudentAccount {
  id: string;
  fullName: string;
  login: string;
  password: string;
  gradeClass: string; // e.g. "5-A sinf", "6-sinf"
  enrolledTrack: 'literacy' | 'design' | 'both';
  createdAt: string;
  phone?: string;
  googleEmail?: string;
  notes?: string;
}

export interface StudentGrade {
  id: string;
  studentId: string; // ID of the StudentAccount
  studentName: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  score: number; // e.g. 0 to 100
  maxScore: number; // default 100
  gradeBadge: string; // e.g. "A'lo (5)", "Yaxshi (4)", "Qoniqarli (3)"
  feedback: string; // O'qituvchi izohi va topshiriq tahlili
  gradedAt: string; // ISO date string
  teacherName: string;
}

export interface TeacherAccount {
  id: string;
  fullName: string;
  login: string;
  password: string;
  subject: string;
  phone?: string;
  adminScore?: number | null;
  adminFeedback?: string | null;
  createdAt: string;
}

export interface TeacherEvaluation {
  id: string;
  teacherId: string;
  teacherName: string;
  score: number;
  maxScore: number;
  studentAvgRating?: string;
  comment: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface SmsLogRecord {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  googleEmail?: string;
  channel?: 'sms' | 'gmail' | 'both';
  groupId: string;
  groupName: string;
  lessonDateKey: string;
  message: string;
  status: string;
  sentAt: string;
}

// Default Teacher Account
export const TEACHER_CREDENTIALS = {
  login: 'Assadxoja',
  password: '@xoja.1506',
  name: 'Assadxoja',
};

// Default Admin Account
export const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'Admin@2026#',
  name: 'Bosh Admin',
};

const STORAGE_TEACHERS_KEY = 'it_portal_teachers_db';
const STORAGE_TEACHER_EVALS_KEY = 'it_portal_teacher_evals_db';
const STORAGE_SMS_LOGS_KEY = 'it_portal_sms_logs_db';

export const INITIAL_TEACHERS: TeacherAccount[] = [
  {
    id: 'tch_assadxoja',
    fullName: 'Assadxoja',
    login: 'Assadxoja',
    password: '@xoja.1506',
    subject: 'IT Savodxonlik, Grafik Dizayn & Frontend',
    phone: '+998 90 123 45 67',
    adminScore: 98,
    adminFeedback: "Darslarni yuqori sifatda va zamonaviy metodika asosida olib bormoqda.",
    createdAt: '2026-10-19T00:00:00.000Z',
  },
];

export const getStoredTeachers = (): TeacherAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_TEACHERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    const parsed: TeacherAccount[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : INITIAL_TEACHERS;
  } catch {
    return INITIAL_TEACHERS;
  }
};

export const saveTeachers = (teachers: TeacherAccount[]): void => {
  localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(teachers));
  window.dispatchEvent(new CustomEvent('teachers_updated'));
};

export const addTeacher = (data: {
  fullName: string;
  login: string;
  password: string;
  subject?: string;
  phone?: string;
}): TeacherAccount => {
  const teachers = getStoredTeachers();
  const newTeacher: TeacherAccount = {
    id: `tch_${Date.now()}`,
    fullName: data.fullName.trim(),
    login: data.login.trim(),
    password: data.password.trim(),
    subject: data.subject?.trim() || 'IT Savodxonlik & Grafik Dizayn',
    phone: data.phone?.trim() || '',
    createdAt: new Date().toISOString(),
  };
  const updated = [newTeacher, ...teachers];
  saveTeachers(updated);
  fetch('/api/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTeacher),
  }).catch(() => {});
  return newTeacher;
};

export const updateTeacher = (id: string, updates: Partial<TeacherAccount>): TeacherAccount | null => {
  const teachers = getStoredTeachers();
  const idx = teachers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updatedItem = { ...teachers[idx], ...updates };
  teachers[idx] = updatedItem;
  saveTeachers(teachers);
  fetch('/api/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  }).catch(() => {});
  return updatedItem;
};

export const deleteTeacher = (id: string): boolean => {
  const teachers = getStoredTeachers();
  const filtered = teachers.filter((t) => t.id !== id);
  if (filtered.length === teachers.length) return false;
  saveTeachers(filtered);
  fetch(`/api/teachers/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

export const getStoredTeacherEvaluations = (): TeacherEvaluation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_TEACHER_EVALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addTeacherEvaluation = (data: {
  teacherId: string;
  teacherName: string;
  score: number;
  maxScore?: number;
  studentAvgRating?: string;
  comment: string;
  evaluatedBy?: string;
}): TeacherEvaluation => {
  const list = getStoredTeacherEvaluations();
  const item: TeacherEvaluation = {
    id: `teval_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    score: data.score,
    maxScore: data.maxScore || 100,
    studentAvgRating: data.studentAvgRating || '5.0',
    comment: data.comment.trim(),
    evaluatedBy: data.evaluatedBy || 'Bosh Admin',
    evaluatedAt: new Date().toISOString(),
  };
  const updated = [item, ...list];
  localStorage.setItem(STORAGE_TEACHER_EVALS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('teacher_evals_updated'));
  fetch('/api/teacher-evaluations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  }).catch(() => {});
  // Also update teacher's latest adminScore & adminFeedback
  updateTeacher(data.teacherId, {
    adminScore: data.score,
    adminFeedback: data.comment.trim(),
  });
  return item;
};

export const deleteTeacherEvaluation = (id: string): void => {
  const list = getStoredTeacherEvaluations().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_TEACHER_EVALS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('teacher_evals_updated'));
  fetch(`/api/teacher-evaluations/${id}`, { method: 'DELETE' }).catch(() => {});
};

export const getStoredSmsLogs = (): SmsLogRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_SMS_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const sendStudentSms = async (payload: {
  studentId: string;
  studentName: string;
  phone: string;
  googleEmail?: string;
  channel?: 'sms' | 'gmail' | 'both';
  groupId: string;
  groupName: string;
  message: string;
}): Promise<SmsLogRecord> => {
  try {
    const res = await fetch('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.log) {
        const enrichedLog: SmsLogRecord = {
          ...data.log,
          googleEmail: payload.googleEmail || data.log.googleEmail,
          channel: payload.channel || data.log.channel || 'sms',
        };
        const logs = [enrichedLog, ...getStoredSmsLogs()];
        localStorage.setItem(STORAGE_SMS_LOGS_KEY, JSON.stringify(logs));
        window.dispatchEvent(new CustomEvent('sms_logs_updated'));
        return enrichedLog;
      }
    }
  } catch {
    // fallback local log
  }
  const fallback: SmsLogRecord = {
    id: `sms_${Date.now()}`,
    studentId: payload.studentId,
    studentName: payload.studentName,
    phone: payload.phone,
    googleEmail: payload.googleEmail,
    channel: payload.channel || 'sms',
    groupId: payload.groupId,
    groupName: payload.groupName,
    lessonDateKey: new Date().toISOString().slice(0, 10),
    message: payload.message,
    status: 'sent',
    sentAt: new Date().toISOString(),
  };
  const logs = [fallback, ...getStoredSmsLogs()];
  localStorage.setItem(STORAGE_SMS_LOGS_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent('sms_logs_updated'));
  return fallback;
};

export const authenticateTeacher = (login: string, pass: string): TeacherAccount | null => {
  const cleanLogin = login.trim().toLowerCase();
  const cleanPass = pass.trim();
  const teachers = getStoredTeachers();
  const found = teachers.find(
    (t) => t.login.trim().toLowerCase() === cleanLogin && t.password === cleanPass
  );
  if (found) return found;
  if (
    cleanLogin === TEACHER_CREDENTIALS.login.toLowerCase() &&
    cleanPass === TEACHER_CREDENTIALS.password
  ) {
    return INITIAL_TEACHERS[0];
  }
  return null;
};

export const authenticateAdmin = (login: string, pass: string): boolean => {
  const cleanLogin = login.trim().toLowerCase();
  const cleanPass = pass.trim();
  return (
    (cleanLogin === ADMIN_CREDENTIALS.login.toLowerCase() && cleanPass === ADMIN_CREDENTIALS.password) ||
    (cleanLogin === 'assadxoja' && cleanPass === '@xoja.1506')
  );
};

const STORAGE_STUDENTS_KEY = 'it_portal_students_db';
const STORAGE_GRADES_KEY = 'it_portal_grades_db';

// Old demo student IDs to purge
const DEMO_STUDENT_IDS = ['std_01', 'std_02', 'std_03', 'std_04'];
const DEMO_LOGINS = ['azizbek2026', 'madina_k', 'shahzod_it', 'zarnigor_u'];
const DEMO_GRADE_IDS = ['grd_01', 'grd_02', 'grd_03', 'grd_04', 'grd_05'];

// Default registered Student Accounts requested by teacher
export const INITIAL_STUDENTS: StudentAccount[] = [
  {
    id: 'std_nafosat',
    fullName: 'Nafosat',
    login: 'nafosat',
    password: 'Nafosat@729#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_dilmurod',
    fullName: 'Dilmurod',
    login: 'dilmurod',
    password: 'Dilmurod@541#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_fozilaxmad',
    fullName: 'Fozilaxmad',
    login: 'fozilaxmad',
    password: 'Fozilaxmad@318#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_abdulaziz',
    fullName: 'Abdulaziz',
    login: 'abdulaziz',
    password: 'Abdulaziz@824#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_sunnatilla',
    fullName: 'Sunnatilla',
    login: 'sunnatilla',
    password: 'Sunnatilla@635#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_baxodir',
    fullName: 'Baxodir',
    login: 'baxodir',
    password: 'Baxodir@492#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_dovud',
    fullName: 'Dovud',
    login: 'dovud',
    password: 'Dovud@807#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_muso',
    fullName: 'Muso',
    login: 'muso',
    password: 'Muso@951#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_shoxruz',
    fullName: 'Shoxruz',
    login: 'shoxruz',
    password: 'Shoxruz@638#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_islomxoja',
    fullName: 'Islomxoja',
    login: 'islomxoja',
    password: 'Islomxoja@714#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_abdurahmon',
    fullName: 'Abdurahmon',
    login: 'abdurahmon',
    password: 'Abdurahmon@852#',
    gradeClass: '5-sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-19T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
  {
    id: 'std_1792492596610',
    fullName: 'Sultonxon',
    login: 'sultonxon',
    password: 'Sultonxon@584#',
    gradeClass: '5-A sinf',
    enrolledTrack: 'both',
    createdAt: '2026-10-26T00:00:00.000Z',
    notes: "IT Savodxonlik va Grafik dizayn o'quvchisi",
  },
];

// Initial grades - cleared as requested (barcha o'quvchilar baholari tozalandi)
export const INITIAL_GRADES: StudentGrade[] = [];


const STUDENTS_SEEDED_FLAG = 'it_portal_students_v4_seeded';

export const getStoredStudents = (): StudentAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENTS_KEY);
    const isSeeded = localStorage.getItem(STUDENTS_SEEDED_FLAG);

    if (!raw) {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STUDENTS_SEEDED_FLAG, 'true');
      return INITIAL_STUDENTS;
    }

    const parsed: StudentAccount[] = JSON.parse(raw);
    // Purge old demo accounts if any exist in the browser's localStorage
    let filtered = parsed.filter(
      (s) => !DEMO_STUDENT_IDS.includes(s.id) && !DEMO_LOGINS.includes(s.login.toLowerCase())
    );

    // If never seeded with the new student list or list is empty, seed with the 11 student accounts
    if (!isSeeded || filtered.length === 0) {
      let addedAny = false;
      INITIAL_STUDENTS.forEach((st) => {
        if (!filtered.some((existing) => existing.login.toLowerCase() === st.login.toLowerCase())) {
          filtered.push(st);
          addedAny = true;
        }
      });
      localStorage.setItem(STUDENTS_SEEDED_FLAG, 'true');
      if (addedAny || filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(filtered));
      }
    } else if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(filtered));
    }

    return filtered;
  } catch (e) {
    console.error('Failed to load students:', e);
    return INITIAL_STUDENTS;
  }
};

export const saveStudents = (students: StudentAccount[]): void => {
  try {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students:', e);
  }
};

export const clearAllStudents = (): void => {
  saveStudents([]);
  saveGrades([]);
};

export const addStudent = (data: {
  fullName: string;
  login: string;
  password: string;
  gradeClass: string;
  enrolledTrack: 'literacy' | 'design' | 'both';
  phone?: string;
  googleEmail?: string;
  notes?: string;
}): StudentAccount => {
  const students = getStoredStudents();
  const newStudent: StudentAccount = {
    id: `std_${Date.now()}`,
    fullName: data.fullName.trim(),
    login: data.login.trim().toLowerCase(),
    password: data.password.trim(),
    gradeClass: data.gradeClass.trim() || 'Umumiy',
    enrolledTrack: data.enrolledTrack,
    phone: data.phone?.trim() || '',
    googleEmail: data.googleEmail?.trim() || '',
    notes: data.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  const updated = [newStudent, ...students];
  saveStudents(updated);
  fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStudent),
  }).catch(() => {});
  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<StudentAccount>): boolean => {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;

  students[index] = { ...students[index], ...updates };
  saveStudents(students);
  fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(students[index]),
  }).catch(() => {});
  return true;
};

export const deleteStudent = (id: string): boolean => {
  const students = getStoredStudents();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) return false;

  saveStudents(filtered);
  // Also remove their grades
  const grades = getStoredGrades();
  const filteredGrades = grades.filter((g) => g.studentId !== id);
  saveGrades(filteredGrades);
  fetch(`/api/students/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

const GRADES_CLEARED_FLAG = 'it_portal_grades_wiped_clean_v3';

export const clearAllGrades = (): void => {
  try {
    localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify([]));
    localStorage.setItem(GRADES_CLEARED_FLAG, 'true');
    window.dispatchEvent(new CustomEvent('grades_updated'));
    fetch('/api/grades', { method: 'DELETE' }).catch(() => {});
  } catch (e) {
    console.error('Failed to clear grades:', e);
  }
};

export const getStoredGrades = (): StudentGrade[] => {
  try {
    const isWiped = localStorage.getItem(GRADES_CLEARED_FLAG);
    // If not yet wiped to clean state as requested by the user, clear all old grades immediately
    if (!isWiped) {
      localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify([]));
      localStorage.setItem(GRADES_CLEARED_FLAG, 'true');
      return [];
    }

    const raw = localStorage.getItem(STORAGE_GRADES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: StudentGrade[] = JSON.parse(raw);
    const filtered = parsed.filter(
      (g) => !DEMO_GRADE_IDS.includes(g.id) && !DEMO_STUDENT_IDS.includes(g.studentId)
    );
    if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (e) {
    console.error('Failed to load grades:', e);
    return [];
  }
};

export const saveGrades = (grades: StudentGrade[]): void => {
  try {
    localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify(grades));
    window.dispatchEvent(new CustomEvent('grades_updated'));
  } catch (e) {
    console.error('Failed to save grades:', e);
  }
};

export const addOrUpdateGrade = (data: {
  studentId: string;
  studentName: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  score: number;
  maxScore?: number;
  feedback?: string;
  teacherName?: string;
}): StudentGrade => {
  const grades = getStoredGrades();
  const maxScore = data.maxScore || 100;
  const scorePercent = (data.score / maxScore) * 100;

  let gradeBadge = "Qoniqarli (3)";
  if (scorePercent >= 86) {
    gradeBadge = "A'lo (5)";
  } else if (scorePercent >= 70) {
    gradeBadge = "Yaxshi (4)";
  }

  // Check if grade for this student and this lesson already exists
  const existingIndex = grades.findIndex(
    (g) => g.studentId === data.studentId && g.track === data.track && g.lessonId === data.lessonId
  );

  const gradeItem: StudentGrade = {
    id: existingIndex >= 0 ? grades[existingIndex].id : `grd_${Date.now()}`,
    studentId: data.studentId,
    studentName: data.studentName,
    track: data.track,
    lessonId: data.lessonId,
    lessonTitle: data.lessonTitle,
    score: data.score,
    maxScore,
    gradeBadge,
    feedback: data.feedback?.trim() || "Dars muvaffaqiyatli baholandi.",
    gradedAt: new Date().toISOString(),
    teacherName: data.teacherName || "Ustoz (O'qituvchi)",
  };

  if (existingIndex >= 0) {
    grades[existingIndex] = gradeItem;
  } else {
    grades.unshift(gradeItem);
  }

  saveGrades(grades);
  fetch('/api/grades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gradeItem),
  }).catch(() => {});
  return gradeItem;
};

export const deleteGrade = (id: string): boolean => {
  const grades = getStoredGrades();
  const filtered = grades.filter((g) => g.id !== id);
  if (filtered.length === grades.length) return false;
  saveGrades(filtered);
  fetch(`/api/grades/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

export const getGradesForStudent = (studentIdOrLogin: string, studentName?: string): StudentGrade[] => {
  const grades = getStoredGrades();
  const students = getStoredStudents();

  // Match by id or login or name
  const student = students.find(
    (s) => s.id === studentIdOrLogin || s.login.toLowerCase() === studentIdOrLogin.toLowerCase()
  );

  return grades.filter((g) => {
    if (student && g.studentId === student.id) return true;
    if (g.studentId === studentIdOrLogin) return true;
    if (studentName && g.studentName.toLowerCase() === studentName.toLowerCase()) return true;
    return false;
  });
};

export const getStudentByLoginOrId = (idOrLogin: string): StudentAccount | null => {
  const clean = idOrLogin.trim().toLowerCase();
  const students = getStoredStudents();
  return (
    students.find(
      (s) =>
        s.id === idOrLogin ||
        s.login.toLowerCase() === clean ||
        (s.login.toLowerCase() === 'sunnatilla' && clean === 'sunnatillla') ||
        (s.login.toLowerCase() === 'sunnatillla' && clean === 'sunnatilla')
    ) || null
  );
};

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'foundation' | 'mastery' | 'creativity' | 'excellence';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StudentProfileData {
  student: StudentAccount;
  totalPoints: number;
  masteredCount: number;
  averageScore: number;
  highestScore: number;
  gradeCount: number;
  levelTitle: string;
  levelRank: number;
  nextLevelPoints: number;
  levelProgressPercent: number;
  badges: StudentBadge[];
  recentGrades: StudentGrade[];
}

export const calculateStudentProfile = (student: StudentAccount): StudentProfileData => {
  const studentGrades = getGradesForStudent(student.id, student.fullName);

  const gradeCount = studentGrades.length;
  const totalPoints = studentGrades.reduce((sum, g) => sum + g.score, 0);
  const averageScore = gradeCount > 0 ? Math.round(totalPoints / gradeCount) : 0;
  const highestScore = gradeCount > 0 ? Math.max(...studentGrades.map((g) => g.score)) : 0;

  // Distinct completed / mastered lessons (score >= 60)
  const masteredLessons = new Set(
    studentGrades.filter((g) => g.score >= 60).map((g) => `${g.track}_${g.lessonId}`)
  );
  const masteredCount = masteredLessons.size;

  // Level computation
  let levelTitle = "IT Boshlang'ich (Tech Explorer)";
  let levelRank = 1;
  let nextLevelPoints = 150;
  let levelProgressPercent = Math.min(100, Math.round((totalPoints / 150) * 100));

  if (totalPoints >= 600) {
    levelTitle = "IT Usta O'quvchi (Master Prodigy)";
    levelRank = 5;
    nextLevelPoints = 1000;
    levelProgressPercent = 100;
  } else if (totalPoints >= 400) {
    levelTitle = "Katta IT Amaliyotchi (Senior Apprentice)";
    levelRank = 4;
    nextLevelPoints = 600;
    levelProgressPercent = Math.round(((totalPoints - 400) / 200) * 100);
  } else if (totalPoints >= 250) {
    levelTitle = "IT Amaliyotchi (Tech Specialist)";
    levelRank = 3;
    nextLevelPoints = 400;
    levelProgressPercent = Math.round(((totalPoints - 250) / 150) * 100);
  } else if (totalPoints >= 100) {
    levelTitle = "IT Shogirdi (Junior Developer)";
    levelRank = 2;
    nextLevelPoints = 250;
    levelProgressPercent = Math.round(((totalPoints - 100) / 150) * 100);
  }

  // Badges computation
  const hasLiteracyGrade = studentGrades.some((g) => g.track === 'literacy');
  const hasDesignGrade = studentGrades.some((g) => g.track === 'design');
  const hasPerfectGrade = studentGrades.some((g) => g.score >= 95);
  const hasTenLessons = masteredCount >= 5;

  const badges: StudentBadge[] = [
    {
      id: 'bdg_first_step',
      name: 'Ilk Qadam',
      description: 'Birinchi darsni muvaffaqiyatli yakunlagan va baholangan',
      icon: 'Rocket',
      category: 'foundation',
      unlocked: gradeCount >= 1,
    },
    {
      id: 'bdg_hardware',
      name: 'Kompyuter Savodxoni',
      description: 'Kompyuter arxitekturasi va texnik vositalarini o\'zlashtirgan',
      icon: 'Cpu',
      category: 'foundation',
      unlocked: hasLiteracyGrade,
    },
    {
      id: 'bdg_design',
      name: 'Grafik Ijodkor',
      description: 'Grafik dizayn, Canva va ranglar palitrasini mukammal o\'rgangan',
      icon: 'Palette',
      category: 'creativity',
      unlocked: hasDesignGrade,
    },
    {
      id: 'bdg_perfect',
      name: 'A\'lochi Yulduz',
      description: 'Dars yoki topshiriqdan 95 va undan yuqori ball to\'plagan',
      icon: 'Star',
      category: 'excellence',
      unlocked: hasPerfectGrade,
    },
    {
      id: 'bdg_mentor_fav',
      name: 'Ustoz E\'tirofi',
      description: 'Ustozdan maxsus tavsiya va yuksak mulohaza olgan',
      icon: 'Award',
      category: 'mastery',
      unlocked: studentGrades.some((g) => g.feedback && g.feedback.length > 20),
    },
    {
      id: 'bdg_persistent',
      name: 'Qat\'iyatli Bilimdon',
      description: 'Kamida 5 ta darsni to\'liq o\'zlashtirgan va amalda qo\'llagan',
      icon: 'ShieldCheck',
      category: 'mastery',
      unlocked: hasTenLessons,
    },
  ];

  return {
    student,
    totalPoints,
    masteredCount,
    averageScore,
    highestScore,
    gradeCount,
    levelTitle,
    levelRank,
    nextLevelPoints,
    levelProgressPercent,
    badges,
    recentGrades: studentGrades,
  };
};

export const authenticateStudent = (login: string, password: string): StudentAccount | null => {
  const cleanLogin = login.trim().toLowerCase();
  const cleanPass = password.trim();

  const students = getStoredStudents();
  const found = students.find((s) => {
    const sLogin = s.login.toLowerCase();
    const loginMatches =
      sLogin === cleanLogin ||
      (sLogin === 'sunnatilla' && cleanLogin === 'sunnatillla') ||
      (sLogin === 'sunnatillla' && cleanLogin === 'sunnatilla');
    return loginMatches && s.password === cleanPass;
  });

  return found || null;
};

// ============================================================================
// LESSON RATING & FEEDBACK SYSTEM (O'QUVCHILARNING DARSNI BAHOLASHI VA FIKRLARI)
// ============================================================================

export interface LessonRatingFeedback {
  id: string;
  studentId: string;
  studentName: string;
  studentLogin?: string;
  studentGradeClass?: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  rating: number; // 1 to 5 stars
  comment: string; // short review
  createdAt: string; // ISO date
  updatedAt?: string;
}

const STORAGE_RATINGS_KEY = 'it_portal_lesson_ratings_db';
const RATINGS_SEEDED_FLAG = 'it_portal_ratings_v1_seeded';

// Initial ratings - cleared as requested (barcha dars fikr va baholari tozalandi)
export const INITIAL_RATINGS: LessonRatingFeedback[] = [];

const RATINGS_WIPED_CLEAN_KEY = 'it_portal_ratings_wiped_clean_v3';

export const getStoredRatings = (): LessonRatingFeedback[] => {
  try {
    const isWiped = localStorage.getItem(RATINGS_WIPED_CLEAN_KEY);
    // If not yet wiped to clean state as requested by the user, clear all old ratings immediately
    if (!isWiped) {
      localStorage.setItem(STORAGE_RATINGS_KEY, JSON.stringify([]));
      localStorage.setItem(RATINGS_WIPED_CLEAN_KEY, 'true');
      return [];
    }

    const raw = localStorage.getItem(STORAGE_RATINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_RATINGS_KEY, JSON.stringify([]));
      return [];
    }

    const parsed: LessonRatingFeedback[] = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to load lesson ratings:', e);
    return [];
  }
};

export const saveRatings = (ratings: LessonRatingFeedback[]): void => {
  try {
    localStorage.setItem(STORAGE_RATINGS_KEY, JSON.stringify(ratings));
    // Dispatch custom event so listening components update synchronously
    window.dispatchEvent(new CustomEvent('lesson_ratings_updated'));
  } catch (e) {
    console.error('Failed to save lesson ratings:', e);
  }
};

export const clearAllRatings = (): void => {
  try {
    localStorage.setItem(STORAGE_RATINGS_KEY, JSON.stringify([]));
    localStorage.setItem(RATINGS_WIPED_CLEAN_KEY, 'true');
    window.dispatchEvent(new CustomEvent('lesson_ratings_updated'));
    fetch('/api/ratings', { method: 'DELETE' }).catch(() => {});
  } catch (e) {
    console.error('Failed to clear lesson ratings:', e);
  }
};

export const addOrUpdateRating = (data: {
  studentId: string;
  studentName: string;
  studentLogin?: string;
  studentGradeClass?: string;
  track: 'literacy' | 'design';
  lessonId: number;
  lessonTitle: string;
  rating: number; // 1 to 5
  comment: string;
}): LessonRatingFeedback => {
  const ratings = getStoredRatings();
  const cleanRating = Math.max(1, Math.min(5, Math.round(data.rating)));

  // Check if this student already rated this lesson in this track
  const existingIdx = ratings.findIndex(
    (r) =>
      (r.studentId === data.studentId || (data.studentLogin && r.studentLogin === data.studentLogin)) &&
      r.track === data.track &&
      r.lessonId === data.lessonId
  );

  const now = new Date().toISOString();
  let resultItem: LessonRatingFeedback;

  if (existingIdx >= 0) {
    resultItem = {
      ...ratings[existingIdx],
      studentName: "Anonim O'quvchi",
      studentLogin: 'anonim',
      studentGradeClass: 'Anonim',
      lessonTitle: data.lessonTitle,
      rating: cleanRating,
      comment: data.comment.trim(),
      updatedAt: now,
    };
    ratings[existingIdx] = resultItem;
  } else {
    resultItem = {
      id: `rtg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      studentId: data.studentId,
      studentName: "Anonim O'quvchi",
      studentLogin: 'anonim',
      studentGradeClass: 'Anonim',
      track: data.track,
      lessonId: data.lessonId,
      lessonTitle: data.lessonTitle,
      rating: cleanRating,
      comment: data.comment.trim(),
      createdAt: now,
    };
    ratings.unshift(resultItem);
  }

  saveRatings(ratings);
  fetch('/api/ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultItem),
  }).catch(() => {});
  return resultItem;
};

export const deleteRating = (id: string): boolean => {
  const ratings = getStoredRatings();
  const filtered = ratings.filter((r) => r.id !== id);
  if (filtered.length === ratings.length) return false;
  saveRatings(filtered);
  fetch(`/api/ratings/${id}`, { method: 'DELETE' }).catch(() => {});
  return true;
};

export const getRatingForLesson = (
  studentIdOrLogin: string,
  track: 'literacy' | 'design',
  lessonId: number
): LessonRatingFeedback | null => {
  const ratings = getStoredRatings();
  const cleanKey = studentIdOrLogin.trim().toLowerCase();
  return (
    ratings.find(
      (r) =>
        (r.studentId.toLowerCase() === cleanKey || (r.studentLogin && r.studentLogin.toLowerCase() === cleanKey)) &&
        r.track === track &&
        r.lessonId === lessonId
    ) || null
  );
};

export const getLessonRatingStats = (
  track: 'literacy' | 'design',
  lessonId: number
): {
  averageRating: number;
  totalCount: number;
  distribution: Record<number, number>;
  ratings: LessonRatingFeedback[];
} => {
  const ratings = getStoredRatings().filter((r) => r.track === track && r.lessonId === lessonId);
  const totalCount = ratings.length;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  ratings.forEach((r) => {
    sum += r.rating;
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  const averageRating = totalCount > 0 ? Number((sum / totalCount).toFixed(1)) : 0;

  return {
    averageRating,
    totalCount,
    distribution,
    ratings,
  };
};

export const getAllLessonRatings = (trackFilter?: 'all' | 'literacy' | 'design'): LessonRatingFeedback[] => {
  const ratings = getStoredRatings();
  if (!trackFilter || trackFilter === 'all') return ratings;
  return ratings.filter((r) => r.track === trackFilter);
};

export const getRatingsForStudent = (studentIdOrLogin: string): LessonRatingFeedback[] => {
  const cleanKey = studentIdOrLogin.trim().toLowerCase();
  const ratings = getStoredRatings();
  return ratings.filter(
    (r) => r.studentId.toLowerCase() === cleanKey || (r.studentLogin && r.studentLogin.toLowerCase() === cleanKey)
  );
};

// ============================================================================
// O'QUVCHILAR REYTING JADVALI (LEADERBOARD SYSTEM)
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  student: StudentAccount;
  totalPoints: number;
  averageScore: number;
  gradeCount: number;
  masteredCount: number;
  highestScore: number;
  levelTitle: string;
  levelRank: number;
  badgeCount: number;
  recentGrades: StudentGrade[];
}

export const getLeaderboardData = (filterTrack?: 'all' | 'literacy' | 'design'): LeaderboardEntry[] => {
  const students = getStoredStudents();

  const entries = students
    .filter((s) => {
      if (!filterTrack || filterTrack === 'all') return true;
      if (s.enrolledTrack === 'both') return true;
      return s.enrolledTrack === filterTrack;
    })
    .map((student) => {
      const profile = calculateStudentProfile(student);
      return {
        student,
        totalPoints: profile.totalPoints,
        averageScore: profile.averageScore,
        gradeCount: profile.gradeCount,
        masteredCount: profile.masteredCount,
        highestScore: profile.highestScore,
        levelTitle: profile.levelTitle,
        levelRank: profile.levelRank,
        badgeCount: profile.badges.filter((b) => b.unlocked).length,
        recentGrades: profile.recentGrades,
      };
    });

  // Sort primarily by totalPoints (descending)
  // Tie-breakers: averageScore (descending), masteredCount (descending), gradeCount (descending), alphabetical fullName
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.averageScore !== a.averageScore) {
      return b.averageScore - a.averageScore;
    }
    if (b.masteredCount !== a.masteredCount) {
      return b.masteredCount - a.masteredCount;
    }
    if (b.gradeCount !== a.gradeCount) {
      return b.gradeCount - a.gradeCount;
    }
    return a.student.fullName.localeCompare(b.student.fullName);
  });

  return entries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
};

export const getStudentRank = (
  studentIdOrLogin: string
): { rank: number; totalStudents: number; entry: LeaderboardEntry | null } => {
  const leaderboard = getLeaderboardData('all');
  const clean = studentIdOrLogin.trim().toLowerCase();
  const index = leaderboard.findIndex(
    (e) =>
      e.student.id.toLowerCase() === clean ||
      e.student.login.toLowerCase() === clean ||
      e.student.fullName.toLowerCase() === clean
  );

  if (index === -1) {
    return { rank: 0, totalStudents: leaderboard.length, entry: null };
  }

  return {
    rank: index + 1,
    totalStudents: leaderboard.length,
    entry: leaderboard[index],
  };
};

// ============================================================================
// SERVER SYNCHRONIZATION (CROSS-DEVICE PERSISTENCE)
// ============================================================================
export const syncWithServer = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    const [stdRes, grdRes, rtgRes, tchRes, evalRes, smsRes] = await Promise.all([
      fetch('/api/students'),
      fetch('/api/grades'),
      fetch('/api/ratings'),
      fetch('/api/teachers').catch(() => null),
      fetch('/api/teacher-evaluations').catch(() => null),
      fetch('/api/sms-logs').catch(() => null),
    ]);

    if (stdRes.ok) {
      const data = await stdRes.json();
      if (Array.isArray(data.students) && data.students.length > 0) {
        const merged = [...data.students];
        for (const st of INITIAL_STUDENTS) {
          if (!merged.some((existing: StudentAccount) => existing.login.toLowerCase() === st.login.toLowerCase())) {
            merged.push(st);
            fetch('/api/students', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(st),
            }).catch(() => {});
          }
        }
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(merged));
      } else {
        // Seed initial students to shared DB once
        const students = getStoredStudents();
        for (const st of students) {
          await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(st),
          }).catch(() => {});
        }
      }
    }

    if (grdRes.ok) {
      const data = await grdRes.json();
      if (Array.isArray(data.grades)) {
        localStorage.setItem(STORAGE_GRADES_KEY, JSON.stringify(data.grades));
        window.dispatchEvent(new CustomEvent('grades_updated'));
      }
    }

    if (rtgRes.ok) {
      const data = await rtgRes.json();
      if (Array.isArray(data.ratings)) {
        localStorage.setItem(STORAGE_RATINGS_KEY, JSON.stringify(data.ratings));
        window.dispatchEvent(new CustomEvent('lesson_ratings_updated'));
      }
    }

    if (tchRes && tchRes.ok) {
      const data = await tchRes.json();
      if (Array.isArray(data.teachers) && data.teachers.length > 0) {
        localStorage.setItem(STORAGE_TEACHERS_KEY, JSON.stringify(data.teachers));
        window.dispatchEvent(new CustomEvent('teachers_updated'));
      }
    }

    if (evalRes && evalRes.ok) {
      const data = await evalRes.json();
      if (Array.isArray(data.evaluations)) {
        localStorage.setItem(STORAGE_TEACHER_EVALS_KEY, JSON.stringify(data.evaluations));
        window.dispatchEvent(new CustomEvent('teacher_evals_updated'));
      }
    }

    if (smsRes && smsRes.ok) {
      const data = await smsRes.json();
      if (Array.isArray(data.logs)) {
        localStorage.setItem(STORAGE_SMS_LOGS_KEY, JSON.stringify(data.logs));
        window.dispatchEvent(new CustomEvent('sms_logs_updated'));
      }
    }
  } catch (err) {
    console.warn('Cross-device sync fallback (offline/local):', err);
  }
};

// Auto start sync on load and periodically (every 15s) in browser
if (typeof window !== 'undefined') {
  syncWithServer();
  setInterval(syncWithServer, 15000);
  window.addEventListener('focus', syncWithServer);
}




