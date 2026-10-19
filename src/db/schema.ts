import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User progress to track completed lessons
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  section: text('section').notNull(), // 'kichik' or 'katta'
  lessonId: integer('lesson_id').notNull(), // 1 to 36
  completedAt: timestamp('completed_at').defaultNow(),
  notes: text('notes'), // Student's personal notes on this lesson
});

// Game scores for the interactive games
export const gameScores = pgTable('game_scores', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  section: text('section').notNull(), // 'kichik' or 'katta'
  lessonId: integer('lesson_id').notNull(), // 1 to 36
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  playedAt: timestamp('played_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  scores: many(gameScores),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

export const gameScoresRelations = relations(gameScores, ({ one }) => ({
  user: one(users, {
    fields: [gameScores.userId],
    references: [users.id],
  }),
}));

// Shared persistent tables across all student and teacher devices
export const studentsTable = pgTable('students', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  login: text('login').notNull().unique(),
  password: text('password').notNull(),
  gradeClass: text('grade_class').notNull().default('5-sinf'),
  enrolledTrack: text('enrolled_track').notNull().default('both'),
  phone: text('phone'),
  notes: text('notes'),
  createdAt: text('created_at'),
});

export const studentGradesTable = pgTable('student_grades', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  track: text('track').notNull(),
  lessonId: integer('lesson_id').notNull(),
  lessonTitle: text('lesson_title').notNull(),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull().default(100),
  gradeBadge: text('grade_badge').notNull(),
  feedback: text('feedback'),
  teacherName: text('teacher_name'),
  gradedAt: text('graded_at').notNull(),
});

export const lessonRatingsTable = pgTable('lesson_ratings', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  studentLogin: text('student_login'),
  studentGradeClass: text('student_grade_class'),
  track: text('track').notNull(),
  lessonId: integer('lesson_id').notNull(),
  lessonTitle: text('lesson_title').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});
