import { eq, and, desc, asc, gte, lte, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courses,
  lessons,
  enrollments,
  progress,
  assessments,
  questions,
  alternatives,
  studentAnswers,
  payments,
  installments,
  sessions,
  notifications,
  materials,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Lazily create the drizzle instance so local tooling can run without a DB.
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * USERS
 */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(userId: number, role: "admin" | "professor" | "user") {
  const db = await getDb();
  if (!db) return null;

  await db.update(users).set({ role }).where(eq(users.id, userId));
  return getUserById(userId);
}

/**
 * COURSES
 */

export async function createCourse(data: {
  title: string;
  description?: string;
  coverUrl?: string;
  trailerUrl?: string;
  loadHours: number;
  price: string;
  minGrade?: number;
  maxInstallments?: number;
  professorId: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(courses).values({
    title: data.title,
    description: data.description,
    coverUrl: data.coverUrl,
    trailerUrl: data.trailerUrl,
    loadHours: data.loadHours,
    price: data.price as any,
    minGrade: data.minGrade ?? 70,
    maxInstallments: data.maxInstallments ?? 1,
    professorId: data.professorId,
  });

  return result;
}

export async function getCourses(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .where(eq(courses.isActive, true))
    .orderBy(desc(courses.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCoursesByProfessor(professorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(courses).where(eq(courses.professorId, professorId));
}

export async function updateCourse(id: number, data: Partial<typeof courses.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(courses).set(data).where(eq(courses.id, id));
  return getCourseById(id);
}

/**
 * LESSONS
 */

export async function createLesson(data: {
  courseId: number;
  title: string;
  type: "video" | "text" | "live";
  content?: string;
  videoUrl?: string;
  liveUrl?: string;
  order: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(lessons).values(data);
  return result;
}

export async function getLessonsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.order));
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateLesson(id: number, data: Partial<typeof lessons.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(lessons).set(data).where(eq(lessons.id, id));
  return getLessonById(id);
}

/**
 * MATERIALS
 */

export async function createMaterial(data: {
  lessonId: number;
  title: string;
  driveLink: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(materials).values(data);
  return result;
}

export async function getMaterialsByLesson(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(materials).where(eq(materials.lessonId, lessonId));
}

/**
 * ENROLLMENTS
 */

export async function enrollStudent(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(enrollments).values({
    studentId,
    courseId,
    status: "active",
  });

  return result;
}

export async function getStudentEnrollments(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
}

export async function getCourseEnrollments(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
}

export async function getEnrollmentStatus(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * PROGRESS
 */

export async function recordProgress(studentId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return null;

  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(progress)
      .set({ completed: true, completedAt: new Date() })
      .where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId)));
  } else {
    await db.insert(progress).values({
      studentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }
}

export async function getStudentProgress(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];

  const courseLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.courseId, courseId));

  const lessonIds = courseLessons.map((l) => l.id);
  if (lessonIds.length === 0) return [];

  return await db
    .select()
    .from(progress)
    .where(and(eq(progress.studentId, studentId), inArray(progress.lessonId, lessonIds)));
}

export async function calculateCourseProgress(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return 0;

  const courseLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.courseId, courseId));

  if (courseLessons.length === 0) return 0;

  const completedLessons = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.studentId, studentId),
        inArray(
          progress.lessonId,
          courseLessons.map((l) => l.id)
        ),
        eq(progress.completed, true)
      )
    );

  return Math.round((completedLessons.length / courseLessons.length) * 100);
}

/**
 * ASSESSMENTS
 */

export async function createAssessment(data: {
  courseId: number;
  lessonId?: number;
  title: string;
  type: "per_lesson" | "final";
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(assessments).values(data);
  return result;
}

export async function getAssessmentsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assessments).where(eq(assessments.courseId, courseId));
}

export async function getAssessmentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * QUESTIONS & ALTERNATIVES
 */

export async function createQuestion(data: {
  assessmentId: number;
  questionText: string;
  order: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(questions).values(data);
  return result;
}

export async function getQuestionsByAssessment(assessmentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(questions)
    .where(eq(questions.assessmentId, assessmentId))
    .orderBy(asc(questions.order));
}

export async function createAlternative(data: {
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(alternatives).values(data);
  return result;
}

export async function getAlternativesByQuestion(questionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.questionId, questionId))
    .orderBy(asc(alternatives.order));
}

/**
 * STUDENT ANSWERS
 */

export async function recordStudentAnswer(data: {
  studentId: number;
  assessmentId: number;
  questionId: number;
  selectedAlternativeId: number;
  isCorrect: boolean;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(studentAnswers).values(data);
  return result;
}

export async function getStudentAssessmentScore(studentId: number, assessmentId: number) {
  const db = await getDb();
  if (!db) return { correct: 0, total: 0, score: 0 };

  const answers = await db
    .select()
    .from(studentAnswers)
    .where(and(eq(studentAnswers.studentId, studentId), eq(studentAnswers.assessmentId, assessmentId)));

  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, score };
}

/**
 * PAYMENTS & INSTALLMENTS
 */

export async function createPayment(data: {
  studentId: number;
  courseId: number;
  totalValue: string;
  downPayment: string;
  installmentCount: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(payments).values({
    studentId: data.studentId,
    courseId: data.courseId,
    totalValue: data.totalValue as any,
    downPayment: data.downPayment as any,
    installmentCount: data.installmentCount,
    status: "pending",
  });

  return result;
}

export async function getPaymentsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(payments).where(eq(payments.studentId, studentId));
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createInstallment(data: {
  paymentId: number;
  installmentNumber: number;
  value: string;
  dueDate: Date;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(installments).values({
    paymentId: data.paymentId,
    installmentNumber: data.installmentNumber,
    value: data.value as any,
    dueDate: data.dueDate,
    status: "pending",
  });

  return result;
}

export async function getInstallmentsByPayment(paymentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(installments)
    .where(eq(installments.paymentId, paymentId))
    .orderBy(asc(installments.installmentNumber));
}

export async function getOverdueInstallments() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(installments)
    .where(
      and(
        eq(installments.status, "pending"),
        lte(installments.dueDate, now)
      )
    );
}

/**
 * SESSIONS (Anti-Sharing)
 */

export async function createSession(data: {
  userId: number;
  ipAddress?: string;
  deviceId?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(sessions).values({
    userId: data.userId,
    ipAddress: data.ipAddress,
    deviceId: data.deviceId,
    userAgent: data.userAgent,
    isActive: true,
  });

  return result;
}

export async function getActiveSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.isActive, true)));
}

export async function deactivateSession(sessionId: number) {
  const db = await getDb();
  if (!db) return null;

  await db.update(sessions).set({ isActive: false }).where(eq(sessions.id, sessionId));
}

/**
 * NOTIFICATIONS
 */

export async function createNotification(data: {
  userId: number;
  type: "payment_reminder" | "course_completed" | "approval" | "overdue";
  title: string;
  message: string;
  relatedId?: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notifications).values(data);
  return result;
}

export async function getUserNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return null;

  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}
