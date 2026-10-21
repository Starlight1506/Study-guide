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
  homeworkSubmissionsTable
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

  // POST AI Assistant Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, lessonTitle, lessonContext } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API key is not configured.',
        });
      }

      const systemInstruction = `Siz IT Savodxonlik Portali uchun o'zbek tilida xizmat qiluvchi do'stona va bilimdon AI Yordamchisiz (IT Ustoz AI).
Siz 1-9 sinf o'quvchilariga va barcha IT o'rganuvchilarga kompyuter savodxonligi, kiberxavfsizlik, dasturlash, apparat va dasturiy ta'minot, internet hamda sun'iy intellekt bo'yicha yordam berasiz.

Javoblaringiz qoidalari:
1. Sodda, qiziqarli va tushunarli o'zbek tilida yozing.
2. Murakkab atamalarni hayotiy o'xshatishlar va amaliy misollar bilan tushuntiring.
3. Kerak bo'lsa, qisqa va aniq ro'yxatlar hamda formatlashdan foydalaning.
4. Agar o'quvchi ma'lum bir dars haqida so'rasa, shu dars doirasida va kontekstida javob bering va qisqa tavsiya bering.

${lessonTitle ? `Joriy dars sarlavhasi: ${lessonTitle}` : ''}
${lessonContext ? `Joriy dars mazmuni: ${lessonContext}` : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: message,
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text || 'Kechirasiz, javob shakllantirishda xatolik yuz berdi.';
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error in AI chat endpoint:', error);
      res.status(500).json({
        error: 'AI assistant chat failed',
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
