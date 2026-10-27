import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db/index.ts';
import { 
  userProgress, 
  gameScores, 
  users, 
  studentsTable, 
  studentGradesTable, 
  lessonRatingsTable,
  homeworkAssignmentsTable,
  homeworkSubmissionsTable,
  smartCoinsTable,
  teachersTable,
  teacherEvaluationsTable,
  smsLogsTable
} from './src/db/schema.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { eq, and, desc } from 'drizzle-orm';

let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser (25MB limit for homework image and file uploads)
  app.use(express.json({ limit: '25mb' }));

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // POST AI Assistant Chat (Socratic IT & Design Mentor with Strict Guardrails)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, courseName, lessonTitle, lessonContext, systemPromptConstraint } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Savol matni kiritilishi shart.' });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.status(500).json({
          error: 'AI xizmati sozlanmagan (GEMINI_API_KEY topilmadi).',
        });
      }

      const activeCourseLabel = courseName || "SMART HIGH SCHOOL IT, Grafik Dizayn (Canva/Figma) va Frontend (HTML5/CSS3) kurslari";
      const activeTopicLabel = lessonTitle || activeCourseLabel;

      const systemInstruction = `Sen SMART HIGH SCHOOL o'quv markazining "AI Ustoz" nomli intellektual, mehribon va talabchan Sokratik ustozisan.
O'quvchi hozir o'rganayotgan kurs: ${activeCourseLabel}.
Hozirgi tanlangan dars mavzusi: ${activeTopicLabel}.
${lessonContext ? `Joriy dars mazmuni va qoidalari: ${lessonContext}` : ''}

${systemPromptConstraint || ''}

SENING QAT'IY CHEKLOVLARING VA OLTIN QOIDALARING (BULARNI BUZISH QAT'IYAN MAN ETILADI):

1. FAQAT TANLANGAN DARS MAVZUSI BO'YICHA YORDAM BERISH (STRICT LESSON TOPIC CONSTRAINT):
   - Sen FAQAT hozirgi tanlangan dars mavzusi («${activeTopicLabel}») doirasida yordam berasan.
   - Agar o'quvchi tanlangan dars mavzusidan tashqari narsalar (o'yinlar, futbol, kino, siyosat, boshqa fanlar yoki hozirgi darsga aloqasi bo'lmagan mavzular) haqida so'rasa, muloyimlik bilan rad et:
     "Kechirasan, aziz o'quvchim! Men hozir faqat tanlangan dars mavzusi («${activeTopicLabel}») bo'yicha yordam bera olaman. Keling, shu darsimizga qaytamiz!" deb, uni joriy dars mavzusiga qaytar.

2. TAYYOR JAVOBNI BIRDANIGA AYTMASLIK (NO DIRECT ANSWERS):
   - O'quvchi savol bersa yoki amaliy topshiriq / uyga vazifa so'rasa, HECH QACHON tayyor javobni yoki to'liq tayyor kodni birdaniga yozib berma!
   - Maqsading — o'quvchining o'zi fikrlashi, harakat qilishi va javobni qadamma-qadam o'zi kashf qilishiga erishish.

3. HAYOTIY MISOLLAR ORQALI TUSHUNTIRISH (REAL-WORLD ANALOGIES):
   - Har bir tushunchani o'quvchi kundalik hayotda ko'radigan sodda va qiziqarli hayotiy o'xshatish (analogiya) bilan tushuntir.

4. QADAMMA-QADAM KASHF QILISH TUZILISHI (STEP-BY-STEP DISCOVERY):
   - 🌍 **Hayotiy misol:** Mavzuni 1-2 jumlada hayotiy o'xshatish bilan tushuntir.
   - 💡 **Yo'naltiruvchi ip uchi (Hint):** To'liq javobni aytmasdan, yechim topish uchun kichik yo'nalish ber.
   - 🤔 **Senga savol (O'ylab ko'r-chi):** Xabar oxirida o'quvchining o'zi o'ylab javob berishi uchun BITTA aniq yo'naltiruvchi savol ber.
   - Agar o'quvchi avvalgi savolingga o'zi harakat qilib javob yozsa, avval uning harakatini samimiy maqta ("Barakalla, to'g'ri fikrlayapsan!"), xatosi bo'lsa yumshoq tushuntir va keyingi qadamga olib o't.

5. USLUB VA HAJM:
   - O'zbek tilida, sodda, ravon, ruhlantiruvchi ohangda yoz (maksimum 120-160 so'z).`;

      // Build multi-turn contents from conversation history
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-10)) {
          if (item && typeof item.text === 'string' && item.text.trim()) {
            formattedContents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      let replyText = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        replyText = response.text || '';
      } catch (primaryErr: any) {
        console.warn('gemini-3.8-flash fallback to gemini-flash-latest:', primaryErr?.message);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        replyText = fallbackResponse.text || '';
      }

      if (!replyText) {
        replyText = "Kechirasiz, javob shakllantirishda xatolik yuz berdi. Savolingizni boshqacharoq yozib ko'ring.";
      }

      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error in AI chat endpoint:', error);
      res.status(500).json({
        error: "AI Ustoz bilan bog'lanishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        details: error.message,
      });
    }
  });

  // GET Current User Profile
  app.get('/api/user/profile', requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // GET user progress
  app.get('/api/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const progress = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, req.user.id));

      res.json({ progress });
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: 'Progress fetch failed', details: error.message });
    }
  });

  // POST toggle lesson completion
  app.post('/api/progress/toggle', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { section, lessonId, notes } = req.body;

      if (!section || typeof lessonId !== 'number') {
        return res.status(400).json({ error: 'Section and lessonId are required' });
      }

      // Check if already completed
      const existing = await db.select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, req.user.id),
            eq(userProgress.section, section),
            eq(userProgress.lessonId, lessonId)
          )
        );

      let action: 'completed' | 'uncompleted' = 'completed';

      if (existing.length > 0) {
        // Toggle: Delete existing progress
        await db.delete(userProgress)
          .where(
            and(
              eq(userProgress.userId, req.user.id),
              eq(userProgress.section, section),
              eq(userProgress.lessonId, lessonId)
            )
          );
        action = 'uncompleted';
      } else {
        // Mark as completed
        await db.insert(userProgress)
          .values({
            userId: req.user.id,
            section,
            lessonId,
            notes: notes || null,
          });
      }

      res.json({ success: true, action });
    } catch (error: any) {
      console.error('Error toggling progress:', error);
      res.status(500).json({ error: 'Toggle progress failed', details: error.message });
    }
  });

  // POST save student notes on lesson
  app.post('/api/progress/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { section, lessonId, notes } = req.body;

      if (!section || typeof lessonId !== 'number') {
        return res.status(400).json({ error: 'Section and lessonId are required' });
      }

      // First check if a progress record exists, if not create one
      const existing = await db.select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, req.user.id),
            eq(userProgress.section, section),
            eq(userProgress.lessonId, lessonId)
          )
        );

      if (existing.length > 0) {
        // Update notes
        await db.update(userProgress)
          .set({ notes })
          .where(
            and(
              eq(userProgress.userId, req.user.id),
              eq(userProgress.section, section),
              eq(userProgress.lessonId, lessonId)
            )
          );
      } else {
        // Create completed progress with notes
        await db.insert(userProgress)
          .values({
            userId: req.user.id,
            section,
            lessonId,
            notes,
          });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving notes:', error);
      res.status(500).json({ error: 'Notes save failed', details: error.message });
    }
  });

  // GET game scores
  app.get('/api/scores', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const scores = await db.select()
        .from(gameScores)
        .where(eq(gameScores.userId, req.user.id))
        .orderBy(desc(gameScores.playedAt));

      res.json({ scores });
    } catch (error: any) {
      console.error('Error fetching scores:', error);
      res.status(500).json({ error: 'Scores fetch failed', details: error.message });
    }
  });

  // POST submit game score
  app.post('/api/scores', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { section, lessonId, score, maxScore } = req.body;

      if (!section || typeof lessonId !== 'number' || typeof score !== 'number' || typeof maxScore !== 'number') {
        return res.status(400).json({ error: 'Missing required score fields' });
      }

      // Save score
      const newScore = await db.insert(gameScores)
        .values({
          userId: req.user.id,
          section,
          lessonId,
          score,
          maxScore,
        })
        .returning();

      res.json({ success: true, score: newScore[0] });
    } catch (error: any) {
      console.error('Error saving score:', error);
      res.status(500).json({ error: 'Score saving failed', details: error.message });
    }
  });

  // GET dashboard stats
  app.get('/api/dashboard/stats', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      // Fetch completed lessons count
      const progress = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, req.user.id));

      // Fetch total game scores
      const scores = await db.select()
        .from(gameScores)
        .where(eq(gameScores.userId, req.user.id));

      res.json({
        completedCount: progress.length,
        gamesPlayed: scores.length,
        averageScore: scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / scores.length)
          : 0,
        progressList: progress,
        recentScores: scores.slice(0, 5),
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Stats fetch failed', details: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // SHARED STUDENTS, GRADES & RATINGS API (Cross-device persistence)
  // ---------------------------------------------------------------------------
  function unpackStudentRow(row: any) {
    const rawNotes = typeof row.notes === 'string' ? row.notes : '';
    const gmailMatch = rawNotes.match(/\[gmail:([^\]]+)\]/i);
    const googleEmail = gmailMatch ? gmailMatch[1].trim() : row.googleEmail || '';
    const cleanNotes = rawNotes.replace(/\s*\[gmail:[^\]]+\]/gi, '').trim();
    return {
      ...row,
      googleEmail,
      notes: cleanNotes,
    };
  }

  function packStudentForDb(student: any) {
    const baseNotes = typeof student.notes === 'string'
      ? student.notes.replace(/\s*\[gmail:[^\]]+\]/gi, '').trim()
      : '';
    const cleanEmail = typeof student.googleEmail === 'string' ? student.googleEmail.trim() : '';
    const packedNotes = cleanEmail ? `${baseNotes} [gmail:${cleanEmail}]`.trim() : baseNotes;
    return {
      id: student.id,
      fullName: student.fullName,
      login: student.login,
      password: student.password || 'Student@123#',
      gradeClass: student.gradeClass || '5-sinf',
      enrolledTrack: student.enrolledTrack || 'both',
      phone: student.phone || '',
      notes: packedNotes,
      createdAt: student.createdAt || new Date().toISOString(),
    };
  }

  // GET all students
  app.get('/api/students', async (_req, res) => {
    try {
      const records = await db.select().from(studentsTable);
      res.json({ students: records.map(unpackStudentRow) });
    } catch (error: any) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST add or update student
  app.post('/api/students', async (req, res) => {
    try {
      const student = req.body;
      if (!student.id || !student.login || !student.fullName) {
        return res.status(400).json({ error: 'Missing student fields' });
      }
      const dbPayload = packStudentForDb(student);
      const existing = await db.select().from(studentsTable).where(eq(studentsTable.id, student.id));
      if (existing.length > 0) {
        await db.update(studentsTable).set(dbPayload).where(eq(studentsTable.id, student.id));
      } else {
        await db.insert(studentsTable).values(dbPayload);
      }
      res.json({ success: true, student: unpackStudentRow(dbPayload) });
    } catch (error: any) {
      console.error('Error saving student:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE single student
  app.delete('/api/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(studentsTable).where(eq(studentsTable.id, id));
      await db.delete(studentGradesTable).where(eq(studentGradesTable.studentId, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET all grades
  app.get('/api/grades', async (_req, res) => {
    try {
      const records = await db.select().from(studentGradesTable).orderBy(desc(studentGradesTable.gradedAt));
      res.json({ grades: records });
    } catch (error: any) {
      console.error('Error fetching grades:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST add / update grade
  app.post('/api/grades', async (req, res) => {
    try {
      const grade = req.body;
      if (!grade.id || !grade.studentId || typeof grade.score !== 'number') {
        return res.status(400).json({ error: 'Missing grade fields' });
      }
      const existing = await db.select().from(studentGradesTable).where(eq(studentGradesTable.id, grade.id));
      if (existing.length > 0) {
        await db.update(studentGradesTable).set(grade).where(eq(studentGradesTable.id, grade.id));
      } else {
        await db.insert(studentGradesTable).values(grade);
      }
      res.json({ success: true, grade });
    } catch (error: any) {
      console.error('Error saving grade:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE single grade
  app.delete('/api/grades/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(studentGradesTable).where(eq(studentGradesTable.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting grade:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE clear all grades
  app.delete('/api/grades', async (_req, res) => {
    try {
      await db.delete(studentGradesTable);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error clearing grades:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET all ratings
  app.get('/api/ratings', async (_req, res) => {
    try {
      const records = await db.select().from(lessonRatingsTable).orderBy(desc(lessonRatingsTable.createdAt));
      res.json({ ratings: records });
    } catch (error: any) {
      console.error('Error fetching ratings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST add / update rating
  app.post('/api/ratings', async (req, res) => {
    try {
      const rating = req.body;
      if (!rating.id || !rating.studentId || typeof rating.rating !== 'number') {
        return res.status(400).json({ error: 'Missing rating fields' });
      }
      const existing = await db.select().from(lessonRatingsTable).where(eq(lessonRatingsTable.id, rating.id));
      if (existing.length > 0) {
        await db.update(lessonRatingsTable).set(rating).where(eq(lessonRatingsTable.id, rating.id));
      } else {
        await db.insert(lessonRatingsTable).values(rating);
      }
      res.json({ success: true, rating });
    } catch (error: any) {
      console.error('Error saving rating:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE single rating
  app.delete('/api/ratings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(lessonRatingsTable).where(eq(lessonRatingsTable.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting rating:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE clear all ratings
  app.delete('/api/ratings', async (_req, res) => {
    try {
      await db.delete(lessonRatingsTable);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error clearing ratings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // HOMEWORK ASSIGNMENTS & SUBMISSIONS API (Cross-device persistence)
  // ---------------------------------------------------------------------------
  // GET all homework assignments
  app.get('/api/homeworks', async (_req, res) => {
    try {
      const records = await db
        .select()
        .from(homeworkAssignmentsTable)
        .orderBy(desc(homeworkAssignmentsTable.createdAt));
      res.json({ assignments: records });
    } catch (error: any) {
      console.error('Error fetching homeworks:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create or update homework assignment
  app.post('/api/homeworks', async (req, res) => {
    try {
      const assignment = req.body;
      if (!assignment.id || !assignment.title || !assignment.track) {
        return res.status(400).json({ error: 'Missing homework fields' });
      }
      const existing = await db
        .select()
        .from(homeworkAssignmentsTable)
        .where(eq(homeworkAssignmentsTable.id, assignment.id));
      if (existing.length > 0) {
        await db
          .update(homeworkAssignmentsTable)
          .set(assignment)
          .where(eq(homeworkAssignmentsTable.id, assignment.id));
      } else {
        await db.insert(homeworkAssignmentsTable).values(assignment);
      }
      res.json({ success: true, assignment });
    } catch (error: any) {
      console.error('Error saving homework:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE homework assignment and its submissions
  app.delete('/api/homeworks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(homeworkAssignmentsTable).where(eq(homeworkAssignmentsTable.id, id));
      await db.delete(homeworkSubmissionsTable).where(eq(homeworkSubmissionsTable.assignmentId, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting homework:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET all homework submissions
  app.get('/api/homework-submissions', async (_req, res) => {
    try {
      const records = await db
        .select()
        .from(homeworkSubmissionsTable)
        .orderBy(desc(homeworkSubmissionsTable.submittedAt));
      res.json({ submissions: records });
    } catch (error: any) {
      console.error('Error fetching homework submissions:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create or update homework submission (student upload or teacher grading)
  app.post('/api/homework-submissions', async (req, res) => {
    try {
      const submission = req.body;
      if (!submission.id || !submission.assignmentId || !submission.studentId) {
        return res.status(400).json({ error: 'Missing submission fields' });
      }
      const existing = await db
        .select()
        .from(homeworkSubmissionsTable)
        .where(eq(homeworkSubmissionsTable.id, submission.id));
      if (existing.length > 0) {
        await db
          .update(homeworkSubmissionsTable)
          .set(submission)
          .where(eq(homeworkSubmissionsTable.id, submission.id));
      } else {
        await db.insert(homeworkSubmissionsTable).values(submission);
      }
      res.json({ success: true, submission });
    } catch (error: any) {
      console.error('Error saving homework submission:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE single homework submission
  app.delete('/api/homework-submissions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(homeworkSubmissionsTable).where(eq(homeworkSubmissionsTable.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting homework submission:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // SMART COIN SYSTEM API (Cross-device persistence)
  // Rule: "Koinlarni jazo sifatida qaytarib olmang" -> only positive coin awards
  // ---------------------------------------------------------------------------
  app.get('/api/smart-coins', async (_req, res) => {
    try {
      const records = await db
        .select()
        .from(smartCoinsTable)
        .orderBy(desc(smartCoinsTable.awardedAt));
      res.json({ coins: records });
    } catch (error: any) {
      console.error('Error fetching smart coins:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/smart-coins', async (req, res) => {
    try {
      const coin = req.body;
      if (
        !coin.id ||
        !coin.studentId ||
        !coin.studentName ||
        typeof coin.amount !== 'number' ||
        coin.amount <= 0 ||
        !coin.reason ||
        !coin.reason.trim()
      ) {
        return res.status(400).json({
          error: "Har bir koinning aniq sababi bo'lishi va miqdori musbat bo'lishi shart! Koinlarni jazo sifatida qaytarib olish mumkin emas.",
        });
      }

      const existing = await db
        .select()
        .from(smartCoinsTable)
        .where(eq(smartCoinsTable.id, coin.id));
      if (existing.length > 0) {
        await db
          .update(smartCoinsTable)
          .set(coin)
          .where(eq(smartCoinsTable.id, coin.id));
      } else {
        await db.insert(smartCoinsTable).values(coin);
      }
      res.json({ success: true, coin });
    } catch (error: any) {
      console.error('Error awarding smart coin:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // TEACHERS & ADMIN EVALUATIONS API
  // ---------------------------------------------------------------------------
  app.get('/api/teachers', async (_req, res) => {
    try {
      const records = await db.select().from(teachersTable);
      res.json({ teachers: records });
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/teachers', async (req, res) => {
    try {
      const teacher = req.body;
      if (!teacher.id || !teacher.login || !teacher.fullName || !teacher.password) {
        return res.status(400).json({ error: "O'qituvchi ma'lumotlari to'liq emas" });
      }
      const existing = await db
        .select()
        .from(teachersTable)
        .where(eq(teachersTable.id, teacher.id));
      if (existing.length > 0) {
        await db
          .update(teachersTable)
          .set(teacher)
          .where(eq(teachersTable.id, teacher.id));
      } else {
        await db.insert(teachersTable).values(teacher);
      }
      res.json({ success: true, teacher });
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/teachers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(teachersTable).where(eq(teachersTable.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/teacher-evaluations', async (_req, res) => {
    try {
      const records = await db
        .select()
        .from(teacherEvaluationsTable)
        .orderBy(desc(teacherEvaluationsTable.evaluatedAt));
      res.json({ evaluations: records });
    } catch (error: any) {
      console.error('Error fetching teacher evaluations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/teacher-evaluations', async (req, res) => {
    try {
      const evaluation = req.body;
      if (!evaluation.id || !evaluation.teacherId || typeof evaluation.score !== 'number') {
        return res.status(400).json({ error: "Baholash ma'lumotlari to'liq emas" });
      }
      const existing = await db
        .select()
        .from(teacherEvaluationsTable)
        .where(eq(teacherEvaluationsTable.id, evaluation.id));
      if (existing.length > 0) {
        await db
          .update(teacherEvaluationsTable)
          .set(evaluation)
          .where(eq(teacherEvaluationsTable.id, evaluation.id));
      } else {
        await db.insert(teacherEvaluationsTable).values(evaluation);
      }
      res.json({ success: true, evaluation });
    } catch (error: any) {
      console.error('Error saving teacher evaluation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/teacher-evaluations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(teacherEvaluationsTable).where(eq(teacherEvaluationsTable.id, id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting teacher evaluation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ---------------------------------------------------------------------------
  // SMS & GOOGLE GMAIL / SMTP REMINDER SYSTEM (30 minutes before lesson start)
  // ---------------------------------------------------------------------------
  // In-memory server-side OAuth access token cache synced from Admin Google Sign-In
  const serverGmailAuthState: {
    accessToken: string | null;
    senderEmail: string | null;
    updatedAt: string | null;
  } = {
    accessToken: null,
    senderEmail: process.env.GMAIL_SENDER_EMAIL || process.env.SMTP_USER || null,
    updatedAt: null,
  };

  function encodeMimeHeaderUtf8(text: string): string {
    return `=?utf-8?B?${Buffer.from(text, 'utf-8').toString('base64')}?=`;
  }

  function buildRfc2822Base64UrlEmail(params: {
    to: string;
    from?: string | null;
    subject: string;
    bodyText: string;
    htmlBody?: string;
  }): string {
    const cleanTo = params.to.trim();
    const boundary = ` smart_school_${Date.now().toString(16)}`;
    const headers = [
      ...(params.from ? [`From: "SMART HIGH SCHOOL" <${params.from}>`] : []),
      `To: ${cleanTo}`,
      'MIME-Version: 1.0',
      `Subject: ${encodeMimeHeaderUtf8(params.subject)}`,
    ];

    let rawEmail = '';
    if (params.htmlBody) {
      headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      rawEmail = [
        ...headers,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(params.bodyText, 'utf-8').toString('base64'),
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(params.htmlBody, 'utf-8').toString('base64'),
        `--${boundary}--`,
      ].join('\r\n');
    } else {
      headers.push('Content-Type: text/plain; charset="UTF-8"');
      headers.push('Content-Transfer-Encoding: base64');
      rawEmail = [
        ...headers,
        '',
        Buffer.from(params.bodyText, 'utf-8').toString('base64'),
      ].join('\r\n');
    }

    return Buffer.from(rawEmail, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function buildLessonReminderHtml(params: {
    studentName: string;
    groupName: string;
    timeSlot: string;
    room: string;
    bodyText: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #FAF8F5; border: 1px solid #EBE7DF; border-radius: 16px; color: #1A2E1C;">
        <div style="background-color: #2C3E2D; color: #ffffff; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #A7C2AA; font-weight: bold;">SMART HIGH SCHOOL · IT Ta'lim Portali</div>
          <h2 style="margin: 6px 0 0 0; font-size: 18px;">⏰ Dars boshlanishiga 30 daqiqa qoldi!</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 14px 0;">
          Hurmatli <strong>${params.studentName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
          Sizning <strong>${params.groupName}</strong> guruhidagi IT va Dizayn darsingiz <strong>30 daqiqadan so'ng</strong> boshlanadi.
        </p>
        <div style="background-color: #ffffff; border: 1px solid #EBE7DF; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; font-size: 13px;">
          <div style="margin-bottom: 6px;">📌 <strong>Guruh:</strong> ${params.groupName}</div>
          <div style="margin-bottom: 6px;">🕒 <strong>Dars vaqti:</strong> ${params.timeSlot}</div>
          <div>🏫 <strong>Xona:</strong> ${params.room}</div>
        </div>
        <p style="font-size: 13px; color: #4F5D50; margin: 0;">
          Iltimos, darsga kechikmasdan va o'z vaqtida tayyor bo'lib kelishingizni so'raymiz!
        </p>
      </div>
    `.trim();
  }

  async function dispatchEmailViaBackend(params: {
    to: string;
    subject: string;
    bodyText: string;
    htmlBody?: string;
    bearerToken?: string | null;
  }): Promise<{ delivered: boolean; provider: 'gmail_api' | 'smtp' | 'none'; messageId?: string; error?: string }> {
    const cleanTo = params.to.trim();
    const activeToken = params.bearerToken || serverGmailAuthState.accessToken;

    // 1. Primary: Google Gmail REST API (https://gmail.googleapis.com/gmail/v1/users/me/messages/send)
    if (activeToken) {
      try {
        const rawEncoded = buildRfc2822Base64UrlEmail({
          to: cleanTo,
          from: serverGmailAuthState.senderEmail,
          subject: params.subject,
          bodyText: params.bodyText,
          htmlBody: params.htmlBody,
        });

        const gmailResp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: rawEncoded }),
        });

        if (gmailResp.ok) {
          const data = (await gmailResp.json().catch(() => ({}))) as { id?: string };
          return { delivered: true, provider: 'gmail_api', messageId: data.id };
        }

        if (gmailResp.status === 401 || gmailResp.status === 403) {
          if (activeToken === serverGmailAuthState.accessToken) {
            serverGmailAuthState.accessToken = null;
          }
          // Fall through to SMTP if configured, otherwise report NEEDS_AUTH
          if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return { delivered: false, provider: 'none', error: 'NEEDS_AUTH' };
          }
        } else {
          const errJson = (await gmailResp.json().catch(() => ({}))) as any;
          const apiErrMessage = errJson?.error?.message || `Gmail API status ${gmailResp.status}`;
          if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return { delivered: false, provider: 'none', error: apiErrMessage };
          }
        }
      } catch (err: any) {
        console.warn('Server Gmail API dispatch error:', err);
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
          return { delivered: false, provider: 'none', error: err?.message || 'Gmail API tarmoq xatosi' };
        }
      }
    }

    // 2. Secondary / Fallback: Server-side SMTP via Nodemailer (smtp.gmail.com)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const smtpPort = Number(process.env.SMTP_PORT || 465);
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const senderAddress = process.env.GMAIL_SENDER_EMAIL || process.env.SMTP_USER;
        const info = await transporter.sendMail({
          from: `"SMART HIGH SCHOOL" <${senderAddress}>`,
          to: cleanTo,
          subject: params.subject,
          text: params.bodyText,
          ...(params.htmlBody ? { html: params.htmlBody } : {}),
        });

        return { delivered: true, provider: 'smtp', messageId: info.messageId };
      } catch (smtpErr: any) {
        console.error('Server SMTP dispatch error:', smtpErr);
        return { delivered: false, provider: 'none', error: smtpErr?.message || 'SMTP xatosi' };
      }
    }

    return { delivered: false, provider: 'none', error: 'NEEDS_AUTH' };
  }

  async function dispatchSmsViaGateway(phone: string, message: string): Promise<string> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (process.env.SMS_GATEWAY_URL) {
      try {
        const resp = await fetch(process.env.SMS_GATEWAY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.SMS_API_KEY ? { Authorization: `Bearer ${process.env.SMS_API_KEY}` } : {}),
          },
          body: JSON.stringify({ mobile_phone: cleanPhone, message, from: '4546' }),
        });
        if (resp.ok) return 'delivered';
      } catch (e) {
        console.warn('External SMS gateway error:', e);
      }
    }
    return 'sent';
  }

  // Sync Google OAuth Bearer token from client to server memory so the 30-min background scheduler can send Gmail reminders
  app.post('/api/gmail/sync-token', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const { email, clear } = req.body || {};

    if (clear) {
      serverGmailAuthState.accessToken = null;
      serverGmailAuthState.updatedAt = new Date().toISOString();
      return res.json({ success: true, gmailApiReady: false });
    }

    if (bearerToken) {
      serverGmailAuthState.accessToken = bearerToken;
      if (email) {
        serverGmailAuthState.senderEmail = String(email).trim();
      }
      serverGmailAuthState.updatedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      gmailApiReady: Boolean(serverGmailAuthState.accessToken),
      senderEmail: serverGmailAuthState.senderEmail,
      smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    });
  });

  // Check backend Gmail API / SMTP & 30-minute scheduler status
  app.get('/api/gmail/status', (_req, res) => {
    const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    const gmailApiReady = Boolean(serverGmailAuthState.accessToken);
    res.json({
      gmailApiReady,
      smtpConfigured,
      ready: gmailApiReady || smtpConfigured,
      activeProvider: gmailApiReady ? 'gmail_api' : smtpConfigured ? 'smtp' : 'client_oauth_required',
      senderEmail:
        serverGmailAuthState.senderEmail ||
        process.env.GMAIL_SENDER_EMAIL ||
        process.env.SMTP_USER ||
        null,
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      schedulerActive: true,
      preLessonMinutes: 30,
      updatedAt: serverGmailAuthState.updatedAt,
    });
  });

  // Backend endpoint to dispatch 30-minute pre-lesson email via Gmail API or SMTP
  app.post('/api/gmail/send', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
      const {
        to,
        subject,
        bodyText,
        studentName,
        groupName,
        timeSlot,
        room,
        senderEmail,
      } = req.body || {};

      if (!to || !subject || !bodyText) {
        return res.status(400).json({ error: "Qabul qiluvchi email ('to'), 'subject' va 'bodyText' kiritilishi shart" });
      }

      if (bearerToken) {
        serverGmailAuthState.accessToken = bearerToken;
        if (senderEmail) {
          serverGmailAuthState.senderEmail = String(senderEmail).trim();
        }
        serverGmailAuthState.updatedAt = new Date().toISOString();
      }

      const htmlBody =
        studentName && groupName
          ? buildLessonReminderHtml({
              studentName,
              groupName,
              timeSlot: timeSlot || 'Reja asosida',
              room: room || 'Asosiy xona',
              bodyText,
            })
          : undefined;

      const result = await dispatchEmailViaBackend({
        to,
        subject,
        bodyText,
        htmlBody,
        bearerToken,
      });

      if (!result.delivered) {
        const statusCode = result.error === 'NEEDS_AUTH' ? 401 : 500;
        return res.status(statusCode).json({
          error: result.error || 'Gmail yuborishda xatolik',
          code: result.error === 'NEEDS_AUTH' ? 'NEEDS_AUTH' : 'SEND_FAILED',
        });
      }

      res.json({
        success: true,
        id: result.messageId || `gmail_${Date.now()}`,
        provider: result.provider,
      });
    } catch (error: any) {
      console.error('Error in /api/gmail/send:', error);
      res.status(500).json({ error: error.message || 'Server Gmail xatosi' });
    }
  });

  app.get('/api/sms-logs', async (_req, res) => {
    try {
      const logs = await db.select().from(smsLogsTable).orderBy(desc(smsLogsTable.sentAt));
      res.json({ logs });
    } catch (error: any) {
      console.error('Error fetching SMS logs:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sms/send', async (req, res) => {
    try {
      const { studentId, studentName, phone, googleEmail, channel, groupId, groupName, message, lessonDateKey } = req.body;
      const contactTarget = phone || googleEmail;
      if (!contactTarget || !message) {
        return res.status(400).json({ error: 'Telefon raqami yoki Google email hamda xabar matni kiritilishi shart' });
      }
      const status = phone && channel !== 'gmail' ? await dispatchSmsViaGateway(phone, message) : 'sent';
      const displayContact =
        channel === 'both' && phone && googleEmail
          ? `${phone} | ${googleEmail}`
          : channel === 'gmail' && googleEmail
          ? googleEmail
          : contactTarget;
      const record = {
        id: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        studentId: studentId || 'manual',
        studentName: studentName || "O'quvchi",
        phone: displayContact,
        groupId: groupId || 'manual',
        groupName: groupName || 'Dars eslatmasi',
        lessonDateKey: lessonDateKey || new Date().toISOString().slice(0, 10),
        message,
        status,
        sentAt: new Date().toISOString(),
      };
      await db.insert(smsLogsTable).values(record);
      res.json({ success: true, log: { ...record, googleEmail, channel: channel || 'sms' } });
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Server-side 30-minute Pre-Lesson Automatic SMS & Gmail/SMTP Scheduler
  const SERVER_SCHEDULE_GROUPS = [
    {
      id: 'group_1',
      name: '1-Guruh (10:00)',
      timeSlot: '10:00 - 11:30',
      startHour: 10,
      startMinute: 0,
      days: [1, 4, 0],
      logins: ['shoxruz', 'abdurahmon', 'islomxoja', 'muso'],
      room: '1-Xona',
    },
    {
      id: 'group_2',
      name: '2-Guruh (14:30)',
      timeSlot: '14:30 - 16:00',
      startHour: 14,
      startMinute: 30,
      days: [1, 2, 0],
      logins: ['sultonxon', 'baxodir', 'dovud', 'fozilaxmad'],
      room: '2-Xona',
    },
    {
      id: 'group_3',
      name: '3-Guruh (16:30)',
      timeSlot: '16:30 - 18:00',
      startHour: 16,
      startMinute: 30,
      days: [1, 2, 0],
      logins: ['dilmurod', 'nafosat', 'abdulaziz', 'sunnatilla'],
      room: '3-Xona',
    },
  ];

  async function checkAndSendUpcomingLessonSms() {
    try {
      // Calculate current Tashkent time (UTC+5)
      const now = new Date();
      const tashkentTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
      const dayOfWeek = tashkentTime.getDay();
      const currentMinutes = tashkentTime.getHours() * 60 + tashkentTime.getMinutes();
      const dateKey = `${tashkentTime.getFullYear()}-${String(tashkentTime.getMonth() + 1).padStart(2, '0')}-${String(tashkentTime.getDate()).padStart(2, '0')}`;

      const rawStudents = await db.select().from(studentsTable);
      const allStudents = rawStudents.map(unpackStudentRow);
      const existingLogs = await db.select().from(smsLogsTable);

      for (const grp of SERVER_SCHEDULE_GROUPS) {
        if (!grp.days.includes(dayOfWeek)) continue;
        const lessonStartMinutes = grp.startHour * 60 + grp.startMinute;
        const diffMinutes = lessonStartMinutes - currentMinutes;

        // Trigger if lesson starts in 25 to 32 minutes (30-minute reminder window)
        if (diffMinutes >= 25 && diffMinutes <= 32) {
          const groupStudents = allStudents.filter(
            (s) =>
              grp.logins.includes(s.login.toLowerCase()) &&
              ((s.phone && s.phone.trim().length >= 7) || (s.googleEmail && s.googleEmail.includes('@')))
          );

          for (const st of groupStudents) {
            const lessonKey = `${grp.id}_${dateKey}_${st.id}`;
            const alreadySent = existingLogs.some((l) => l.lessonDateKey === lessonKey);
            if (alreadySent) continue;

            const hasValidPhone = Boolean(st.phone && st.phone.trim().length >= 7);
            const hasValidEmail = Boolean(st.googleEmail && st.googleEmail.includes('@'));

            const smsMsg = `SMART HIGH SCHOOL: Hurmatli ${st.fullName}, sizning ${grp.name} darsingiz 30 daqiqadan so'ng (${grp.timeSlot}) ${grp.room}da boshlanadi. Darsga o'z vaqtida kelishingizni so'raymiz!`;
            const emailSubject = `SMART HIGH SCHOOL: ${grp.name} darsi 30 daqiqadan so'ng boshlanadi!`;
            const emailBody = `SMART HIGH SCHOOL — Dars Eslatmasi (30 daqiqa oldin)\n\nHurmatli ${st.fullName}!\nSizning "${grp.name}" guruhidagi IT va Dizayn darsingiz 30 daqiqadan so'ng (${grp.timeSlot}) ${grp.room}da boshlanadi.\n\nIltimos, darsga o'z vaqtida tayyor bo'lib kelishingizni so'raymiz!`;

            let smsSent = false;
            let emailSent = false;
            let status = 'sent';

            if (hasValidPhone && st.phone) {
              status = await dispatchSmsViaGateway(st.phone, smsMsg);
              smsSent = true;
            }

            if (hasValidEmail && st.googleEmail) {
              const emailRes = await dispatchEmailViaBackend({
                to: st.googleEmail,
                subject: emailSubject,
                bodyText: emailBody,
                htmlBody: buildLessonReminderHtml({
                  studentName: st.fullName,
                  groupName: grp.name,
                  timeSlot: grp.timeSlot,
                  room: grp.room,
                  bodyText: emailBody,
                }),
              });
              if (emailRes.delivered) {
                emailSent = true;
                status = 'delivered';
              }
            }

            if (smsSent || emailSent) {
              const contactDisplay =
                smsSent && emailSent
                  ? `${st.phone} | ${st.googleEmail}`
                  : emailSent
                  ? st.googleEmail!
                  : st.phone!;

              await db.insert(smsLogsTable).values({
                id: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                studentId: st.id,
                studentName: st.fullName,
                phone: contactDisplay,
                groupId: grp.id,
                groupName: grp.name,
                lessonDateKey: lessonKey,
                message: smsMsg,
                status,
                sentAt: new Date().toISOString(),
              });
            }
          }
        }
      }
    } catch (err) {
      // Non-fatal background check
    }
  }

  // Run automatic 30-min SMS + Gmail/SMTP check every 60 seconds
  setInterval(checkAndSendUpcomingLessonSms, 60 * 1000);

  // Public static assets (manifest.json, icon.svg, sw.js)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite and static asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});

