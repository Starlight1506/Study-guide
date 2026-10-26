import express from 'express';
import path from 'path';
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
  // GET all students
  app.get('/api/students', async (_req, res) => {
    try {
      const records = await db.select().from(studentsTable);
      res.json({ students: records });
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
      const existing = await db.select().from(studentsTable).where(eq(studentsTable.id, student.id));
      if (existing.length > 0) {
        await db.update(studentsTable).set(student).where(eq(studentsTable.id, student.id));
      } else {
        await db.insert(studentsTable).values(student);
      }
      res.json({ success: true, student });
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
  // SMS REMINDER SYSTEM (30 minutes before lesson start)
  // ---------------------------------------------------------------------------
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
      const { studentId, studentName, phone, groupId, groupName, message, lessonDateKey } = req.body;
      if (!phone || !message) {
        return res.status(400).json({ error: 'Telefon raqami va xabar matni kiritilishi shart' });
      }
      const status = await dispatchSmsViaGateway(phone, message);
      const record = {
        id: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        studentId: studentId || 'manual',
        studentName: studentName || "O'quvchi",
        phone,
        groupId: groupId || 'manual',
        groupName: groupName || 'Dars eslatmasi',
        lessonDateKey: lessonDateKey || new Date().toISOString().slice(0, 10),
        message,
        status,
        sentAt: new Date().toISOString(),
      };
      await db.insert(smsLogsTable).values(record);
      res.json({ success: true, log: record });
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Server-side 30-minute Pre-Lesson Automatic SMS Scheduler
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

      const allStudents = await db.select().from(studentsTable);
      const existingLogs = await db.select().from(smsLogsTable);

      for (const grp of SERVER_SCHEDULE_GROUPS) {
        if (!grp.days.includes(dayOfWeek)) continue;
        const lessonStartMinutes = grp.startHour * 60 + grp.startMinute;
        const diffMinutes = lessonStartMinutes - currentMinutes;

        // Trigger if lesson starts in 25 to 32 minutes (30-minute reminder window)
        if (diffMinutes >= 25 && diffMinutes <= 32) {
          const groupStudents = allStudents.filter(
            (s) => grp.logins.includes(s.login.toLowerCase()) && s.phone && s.phone.trim().length >= 7
          );

          for (const st of groupStudents) {
            const lessonKey = `${grp.id}_${dateKey}_${st.id}`;
            const alreadySent = existingLogs.some((l) => l.lessonDateKey === lessonKey);
            if (!alreadySent && st.phone) {
              const msg = `SMART HIGH SCHOOL: Hurmatli ${st.fullName}, sizning ${grp.name} darsingiz 30 daqiqadan so'ng (${grp.timeSlot}) ${grp.room}da boshlanadi. Darsga o'z vaqtida kelishingizni so'raymiz!`;
              const status = await dispatchSmsViaGateway(st.phone, msg);
              await db.insert(smsLogsTable).values({
                id: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                studentId: st.id,
                studentName: st.fullName,
                phone: st.phone,
                groupId: grp.id,
                groupName: grp.name,
                lessonDateKey: lessonKey,
                message: msg,
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

  // Run automatic 30-min SMS check every 60 seconds
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

