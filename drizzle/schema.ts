import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  longtext,
  json,
  index,
  unique,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * EducaDQ EAD Platform - Complete Schema
 * 
 * Tabelas principais:
 * - users: usuários com 3 roles (admin, professor, user/aluno)
 * - courses: cursos com informações de preço e configuração
 * - lessons: aulas com tipos (video, text, live)
 * - materials: materiais complementares (Google Drive)
 * - enrollments: matrículas de alunos em cursos
 * - progress: progresso do aluno por aula
 * - assessments: avaliações (por aula ou final)
 * - questions: perguntas das avaliações
 * - alternatives: alternativas das perguntas (5 por pergunta)
 * - studentAnswers: respostas dos alunos
 * - payments: pagamentos de cursos
 * - installments: parcelas dos pagamentos
 * - sessions: sessões para controle anti-compartilhamento
 * - notifications: notificações de pagamento
 */

// ============================================================================
// USERS TABLE
// ============================================================================

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }).unique(),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin", "professor"]).default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    openIdIdx: index("openId_idx").on(table.openId),
    roleIdx: index("role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// COURSES TABLE
// ============================================================================

export const courses = mysqlTable(
  "courses",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: longtext("description"),
    coverUrl: varchar("coverUrl", { length: 500 }),
    trailerUrl: varchar("trailerUrl", { length: 500 }),
    loadHours: int("loadHours").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    minGrade: int("minGrade").default(70).notNull(),
    maxInstallments: int("maxInstallments").default(1).notNull(),
    professorId: int("professorId").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    professorIdx: index("professorId_idx").on(table.professorId),
    activeIdx: index("isActive_idx").on(table.isActive),
  })
);

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// ============================================================================
// LESSONS TABLE
// ============================================================================

export const lessons = mysqlTable(
  "lessons",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["video", "text", "live"]).notNull(),
    content: longtext("content"),
    videoUrl: varchar("videoUrl", { length: 500 }),
    liveUrl: varchar("liveUrl", { length: 500 }),
    order: int("order").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    courseIdx: index("courseId_idx").on(table.courseId),
    orderIdx: index("order_idx").on(table.order),
  })
);

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// ============================================================================
// MATERIALS TABLE
// ============================================================================

export const materials = mysqlTable(
  "materials",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    driveLink: varchar("driveLink", { length: 500 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    lessonIdx: index("lessonId_idx").on(table.lessonId),
  })
);

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = typeof materials.$inferInsert;

// ============================================================================
// ENROLLMENTS TABLE
// ============================================================================

export const enrollments = mysqlTable(
  "enrollments",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    courseId: int("courseId").notNull(),
    enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
    status: mysqlEnum("status", ["active", "completed", "suspended"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("studentId_idx").on(table.studentId),
    courseIdx: index("courseId_idx").on(table.courseId),
    studentCourseUnique: unique("studentCourse_unique").on(table.studentId, table.courseId),
  })
);

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

// ============================================================================
// PROGRESS TABLE
// ============================================================================

export const progress = mysqlTable(
  "progress",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    lessonId: int("lessonId").notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("studentId_idx").on(table.studentId),
    lessonIdx: index("lessonId_idx").on(table.lessonId),
    studentLessonUnique: unique("studentLesson_unique").on(table.studentId, table.lessonId),
  })
);

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

// ============================================================================
// ASSESSMENTS TABLE
// ============================================================================

export const assessments = mysqlTable(
  "assessments",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull(),
    lessonId: int("lessonId"),
    title: varchar("title", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["per_lesson", "final"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    courseIdx: index("courseId_idx").on(table.courseId),
    lessonIdx: index("lessonId_idx").on(table.lessonId),
  })
);

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

// ============================================================================
// QUESTIONS TABLE
// ============================================================================

export const questions = mysqlTable(
  "questions",
  {
    id: int("id").autoincrement().primaryKey(),
    assessmentId: int("assessmentId").notNull(),
    questionText: longtext("questionText").notNull(),
    order: int("order").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    assessmentIdx: index("assessmentId_idx").on(table.assessmentId),
  })
);

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

// ============================================================================
// ALTERNATIVES TABLE
// ============================================================================

export const alternatives = mysqlTable(
  "alternatives",
  {
    id: int("id").autoincrement().primaryKey(),
    questionId: int("questionId").notNull(),
    text: longtext("text").notNull(),
    isCorrect: boolean("isCorrect").default(false).notNull(),
    order: int("order").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    questionIdx: index("questionId_idx").on(table.questionId),
  })
);

export type Alternative = typeof alternatives.$inferSelect;
export type InsertAlternative = typeof alternatives.$inferInsert;

// ============================================================================
// STUDENT ANSWERS TABLE
// ============================================================================

export const studentAnswers = mysqlTable(
  "studentAnswers",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    assessmentId: int("assessmentId").notNull(),
    questionId: int("questionId").notNull(),
    selectedAlternativeId: int("selectedAlternativeId").notNull(),
    isCorrect: boolean("isCorrect").notNull(),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("studentId_idx").on(table.studentId),
    assessmentIdx: index("assessmentId_idx").on(table.assessmentId),
  })
);

export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;

// ============================================================================
// PAYMENTS TABLE
// ============================================================================

export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    courseId: int("courseId").notNull(),
    totalValue: decimal("totalValue", { precision: 10, scale: 2 }).notNull(),
    downPayment: decimal("downPayment", { precision: 10, scale: 2 }).notNull(),
    installmentCount: int("installmentCount").notNull(),
    paidInstallments: int("paidInstallments").default(0).notNull(),
    status: mysqlEnum("status", ["pending", "partial", "paid", "overdue"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    studentIdx: index("studentId_idx").on(table.studentId),
    courseIdx: index("courseId_idx").on(table.courseId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ============================================================================
// INSTALLMENTS TABLE
// ============================================================================

export const installments = mysqlTable(
  "installments",
  {
    id: int("id").autoincrement().primaryKey(),
    paymentId: int("paymentId").notNull(),
    installmentNumber: int("installmentNumber").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).notNull(),
    dueDate: timestamp("dueDate").notNull(),
    paidDate: timestamp("paidDate"),
    status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    paymentIdx: index("paymentId_idx").on(table.paymentId),
    dueDateIdx: index("dueDate_idx").on(table.dueDate),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Installment = typeof installments.$inferSelect;
export type InsertInstallment = typeof installments.$inferInsert;

// ============================================================================
// SESSIONS TABLE (Anti-Sharing)
// ============================================================================

export const sessions = mysqlTable(
  "sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    ipAddress: varchar("ipAddress", { length: 45 }),
    deviceId: varchar("deviceId", { length: 255 }),
    userAgent: longtext("userAgent"),
    loginAt: timestamp("loginAt").defaultNow().notNull(),
    lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("userId_idx").on(table.userId),
    ipIdx: index("ipAddress_idx").on(table.ipAddress),
    activeIdx: index("isActive_idx").on(table.isActive),
  })
);

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["payment_reminder", "course_completed", "approval", "overdue"]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: longtext("message").notNull(),
    relatedId: int("relatedId"),
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("userId_idx").on(table.userId),
    typeIdx: index("type_idx").on(table.type),
    isReadIdx: index("isRead_idx").on(table.isRead),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  payments: many(payments),
  sessions: many(sessions),
  notifications: many(notifications),
  studentAnswers: many(studentAnswers),
  progress: many(progress),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  professor: one(users, {
    fields: [courses.professorId],
    references: [users.id],
  }),
  lessons: many(lessons),
  enrollments: many(enrollments),
  assessments: many(assessments),
  payments: many(payments),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  materials: many(materials),
  progress: many(progress),
  assessments: many(assessments),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  lesson: one(lessons, {
    fields: [materials.lessonId],
    references: [lessons.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  student: one(users, {
    fields: [progress.studentId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, {
    fields: [assessments.courseId],
    references: [courses.id],
  }),
  lesson: one(lessons, {
    fields: [assessments.lessonId],
    references: [lessons.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [questions.assessmentId],
    references: [assessments.id],
  }),
  alternatives: many(alternatives),
}));

export const alternativesRelations = relations(alternatives, ({ one }) => ({
  question: one(questions, {
    fields: [alternatives.questionId],
    references: [questions.id],
  }),
}));

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
  student: one(users, {
    fields: [studentAnswers.studentId],
    references: [users.id],
  }),
  assessment: one(assessments, {
    fields: [studentAnswers.assessmentId],
    references: [assessments.id],
  }),
  question: one(questions, {
    fields: [studentAnswers.questionId],
    references: [questions.id],
  }),
  alternative: one(alternatives, {
    fields: [studentAnswers.selectedAlternativeId],
    references: [alternatives.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  student: one(users, {
    fields: [payments.studentId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [payments.courseId],
    references: [courses.id],
  }),
  installments: many(installments),
}));

export const installmentsRelations = relations(installments, ({ one }) => ({
  payment: one(payments, {
    fields: [installments.paymentId],
    references: [payments.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
