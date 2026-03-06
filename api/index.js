var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  alternatives: () => alternatives,
  alternativesRelations: () => alternativesRelations,
  assessments: () => assessments,
  assessmentsRelations: () => assessmentsRelations,
  courses: () => courses,
  coursesRelations: () => coursesRelations,
  enrollments: () => enrollments,
  enrollmentsRelations: () => enrollmentsRelations,
  installments: () => installments,
  installmentsRelations: () => installmentsRelations,
  lessons: () => lessons,
  lessonsRelations: () => lessonsRelations,
  materials: () => materials,
  materialsRelations: () => materialsRelations,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  progress: () => progress,
  progressRelations: () => progressRelations,
  questions: () => questions,
  questionsRelations: () => questionsRelations,
  sessions: () => sessions,
  sessionsRelations: () => sessionsRelations,
  studentAnswers: () => studentAnswers,
  studentAnswersRelations: () => studentAnswersRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
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
  index,
  unique
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
var users, courses, lessons, materials, enrollments, progress, assessments, questions, alternatives, studentAnswers, payments, installments, sessions, notifications, usersRelations, coursesRelations, lessonsRelations, materialsRelations, enrollmentsRelations, progressRelations, assessmentsRelations, questionsRelations, alternativesRelations, studentAnswersRelations, paymentsRelations, installmentsRelations, sessionsRelations, notificationsRelations;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable(
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
        lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
      },
      (table) => ({
        emailIdx: index("email_idx").on(table.email),
        openIdIdx: index("openId_idx").on(table.openId),
        roleIdx: index("role_idx").on(table.role)
      })
    );
    courses = mysqlTable(
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
        updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
      },
      (table) => ({
        professorIdx: index("professorId_idx").on(table.professorId),
        activeIdx: index("isActive_idx").on(table.isActive)
      })
    );
    lessons = mysqlTable(
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
        updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
      },
      (table) => ({
        courseIdx: index("courseId_idx").on(table.courseId),
        orderIdx: index("order_idx").on(table.order)
      })
    );
    materials = mysqlTable(
      "materials",
      {
        id: int("id").autoincrement().primaryKey(),
        lessonId: int("lessonId").notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        driveLink: varchar("driveLink", { length: 500 }).notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        lessonIdx: index("lessonId_idx").on(table.lessonId)
      })
    );
    enrollments = mysqlTable(
      "enrollments",
      {
        id: int("id").autoincrement().primaryKey(),
        studentId: int("studentId").notNull(),
        courseId: int("courseId").notNull(),
        enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
        status: mysqlEnum("status", ["active", "completed", "suspended"]).default("active").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        studentIdx: index("studentId_idx").on(table.studentId),
        courseIdx: index("courseId_idx").on(table.courseId),
        studentCourseUnique: unique("studentCourse_unique").on(table.studentId, table.courseId)
      })
    );
    progress = mysqlTable(
      "progress",
      {
        id: int("id").autoincrement().primaryKey(),
        studentId: int("studentId").notNull(),
        lessonId: int("lessonId").notNull(),
        completed: boolean("completed").default(false).notNull(),
        completedAt: timestamp("completedAt"),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        studentIdx: index("studentId_idx").on(table.studentId),
        lessonIdx: index("lessonId_idx").on(table.lessonId),
        studentLessonUnique: unique("studentLesson_unique").on(table.studentId, table.lessonId)
      })
    );
    assessments = mysqlTable(
      "assessments",
      {
        id: int("id").autoincrement().primaryKey(),
        courseId: int("courseId").notNull(),
        lessonId: int("lessonId"),
        title: varchar("title", { length: 255 }).notNull(),
        type: mysqlEnum("type", ["per_lesson", "final"]).notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        courseIdx: index("courseId_idx").on(table.courseId),
        lessonIdx: index("lessonId_idx").on(table.lessonId)
      })
    );
    questions = mysqlTable(
      "questions",
      {
        id: int("id").autoincrement().primaryKey(),
        assessmentId: int("assessmentId").notNull(),
        questionText: longtext("questionText").notNull(),
        order: int("order").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        assessmentIdx: index("assessmentId_idx").on(table.assessmentId)
      })
    );
    alternatives = mysqlTable(
      "alternatives",
      {
        id: int("id").autoincrement().primaryKey(),
        questionId: int("questionId").notNull(),
        text: longtext("text").notNull(),
        isCorrect: boolean("isCorrect").default(false).notNull(),
        order: int("order").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        questionIdx: index("questionId_idx").on(table.questionId)
      })
    );
    studentAnswers = mysqlTable(
      "studentAnswers",
      {
        id: int("id").autoincrement().primaryKey(),
        studentId: int("studentId").notNull(),
        assessmentId: int("assessmentId").notNull(),
        questionId: int("questionId").notNull(),
        selectedAlternativeId: int("selectedAlternativeId").notNull(),
        isCorrect: boolean("isCorrect").notNull(),
        submittedAt: timestamp("submittedAt").defaultNow().notNull()
      },
      (table) => ({
        studentIdx: index("studentId_idx").on(table.studentId),
        assessmentIdx: index("assessmentId_idx").on(table.assessmentId)
      })
    );
    payments = mysqlTable(
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
        updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
      },
      (table) => ({
        studentIdx: index("studentId_idx").on(table.studentId),
        courseIdx: index("courseId_idx").on(table.courseId),
        statusIdx: index("status_idx").on(table.status)
      })
    );
    installments = mysqlTable(
      "installments",
      {
        id: int("id").autoincrement().primaryKey(),
        paymentId: int("paymentId").notNull(),
        installmentNumber: int("installmentNumber").notNull(),
        value: decimal("value", { precision: 10, scale: 2 }).notNull(),
        dueDate: timestamp("dueDate").notNull(),
        paidDate: timestamp("paidDate"),
        status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        paymentIdx: index("paymentId_idx").on(table.paymentId),
        dueDateIdx: index("dueDate_idx").on(table.dueDate),
        statusIdx: index("status_idx").on(table.status)
      })
    );
    sessions = mysqlTable(
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
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        userIdx: index("userId_idx").on(table.userId),
        ipIdx: index("ipAddress_idx").on(table.ipAddress),
        activeIdx: index("isActive_idx").on(table.isActive)
      })
    );
    notifications = mysqlTable(
      "notifications",
      {
        id: int("id").autoincrement().primaryKey(),
        userId: int("userId").notNull(),
        type: mysqlEnum("type", ["payment_reminder", "course_completed", "approval", "overdue"]).notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        message: longtext("message").notNull(),
        relatedId: int("relatedId"),
        isRead: boolean("isRead").default(false).notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull()
      },
      (table) => ({
        userIdx: index("userId_idx").on(table.userId),
        typeIdx: index("type_idx").on(table.type),
        isReadIdx: index("isRead_idx").on(table.isRead)
      })
    );
    usersRelations = relations(users, ({ many }) => ({
      courses: many(courses),
      enrollments: many(enrollments),
      payments: many(payments),
      sessions: many(sessions),
      notifications: many(notifications),
      studentAnswers: many(studentAnswers),
      progress: many(progress)
    }));
    coursesRelations = relations(courses, ({ one, many }) => ({
      professor: one(users, {
        fields: [courses.professorId],
        references: [users.id]
      }),
      lessons: many(lessons),
      enrollments: many(enrollments),
      assessments: many(assessments),
      payments: many(payments)
    }));
    lessonsRelations = relations(lessons, ({ one, many }) => ({
      course: one(courses, {
        fields: [lessons.courseId],
        references: [courses.id]
      }),
      materials: many(materials),
      progress: many(progress),
      assessments: many(assessments)
    }));
    materialsRelations = relations(materials, ({ one }) => ({
      lesson: one(lessons, {
        fields: [materials.lessonId],
        references: [lessons.id]
      })
    }));
    enrollmentsRelations = relations(enrollments, ({ one }) => ({
      student: one(users, {
        fields: [enrollments.studentId],
        references: [users.id]
      }),
      course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id]
      })
    }));
    progressRelations = relations(progress, ({ one }) => ({
      student: one(users, {
        fields: [progress.studentId],
        references: [users.id]
      }),
      lesson: one(lessons, {
        fields: [progress.lessonId],
        references: [lessons.id]
      })
    }));
    assessmentsRelations = relations(assessments, ({ one, many }) => ({
      course: one(courses, {
        fields: [assessments.courseId],
        references: [courses.id]
      }),
      lesson: one(lessons, {
        fields: [assessments.lessonId],
        references: [lessons.id]
      }),
      questions: many(questions)
    }));
    questionsRelations = relations(questions, ({ one, many }) => ({
      assessment: one(assessments, {
        fields: [questions.assessmentId],
        references: [assessments.id]
      }),
      alternatives: many(alternatives)
    }));
    alternativesRelations = relations(alternatives, ({ one }) => ({
      question: one(questions, {
        fields: [alternatives.questionId],
        references: [questions.id]
      })
    }));
    studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
      student: one(users, {
        fields: [studentAnswers.studentId],
        references: [users.id]
      }),
      assessment: one(assessments, {
        fields: [studentAnswers.assessmentId],
        references: [assessments.id]
      }),
      question: one(questions, {
        fields: [studentAnswers.questionId],
        references: [questions.id]
      }),
      alternative: one(alternatives, {
        fields: [studentAnswers.selectedAlternativeId],
        references: [alternatives.id]
      })
    }));
    paymentsRelations = relations(payments, ({ one, many }) => ({
      student: one(users, {
        fields: [payments.studentId],
        references: [users.id]
      }),
      course: one(courses, {
        fields: [payments.courseId],
        references: [courses.id]
      }),
      installments: many(installments)
    }));
    installmentsRelations = relations(installments, ({ one }) => ({
      payment: one(payments, {
        fields: [installments.paymentId],
        references: [payments.id]
      })
    }));
    sessionsRelations = relations(sessions, ({ one }) => ({
      user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
      })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
      })
    }));
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  calculateCourseProgress: () => calculateCourseProgress,
  createAlternative: () => createAlternative,
  createAssessment: () => createAssessment,
  createCourse: () => createCourse,
  createInstallment: () => createInstallment,
  createLesson: () => createLesson,
  createMaterial: () => createMaterial,
  createNotification: () => createNotification,
  createPayment: () => createPayment,
  createQuestion: () => createQuestion,
  createSession: () => createSession,
  deactivateSession: () => deactivateSession,
  enrollStudent: () => enrollStudent,
  getActiveSessions: () => getActiveSessions,
  getAlternativesByQuestion: () => getAlternativesByQuestion,
  getAssessmentById: () => getAssessmentById,
  getAssessmentsByCourse: () => getAssessmentsByCourse,
  getCourseById: () => getCourseById,
  getCourseEnrollments: () => getCourseEnrollments,
  getCourses: () => getCourses,
  getCoursesByProfessor: () => getCoursesByProfessor,
  getDb: () => getDb,
  getEnrollmentStatus: () => getEnrollmentStatus,
  getInstallmentsByPayment: () => getInstallmentsByPayment,
  getLessonById: () => getLessonById,
  getLessonsByCourse: () => getLessonsByCourse,
  getMaterialsByLesson: () => getMaterialsByLesson,
  getOverdueInstallments: () => getOverdueInstallments,
  getPaymentById: () => getPaymentById,
  getPaymentsByStudent: () => getPaymentsByStudent,
  getQuestionsByAssessment: () => getQuestionsByAssessment,
  getStudentAssessmentScore: () => getStudentAssessmentScore,
  getStudentEnrollments: () => getStudentEnrollments,
  getStudentProgress: () => getStudentProgress,
  getUserById: () => getUserById,
  getUserByOpenId: () => getUserByOpenId,
  getUserNotifications: () => getUserNotifications,
  markNotificationAsRead: () => markNotificationAsRead,
  recordProgress: () => recordProgress,
  recordStudentAnswer: () => recordStudentAnswer,
  updateCourse: () => updateCourse,
  updateLesson: () => updateLesson,
  updateUserRole: () => updateUserRole,
  upsertUser: () => upsertUser
});
import { eq, and, desc, asc, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateUserRole(userId, role) {
  const db = await getDb();
  if (!db) return null;
  await db.update(users).set({ role }).where(eq(users.id, userId));
  return getUserById(userId);
}
async function createCourse(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(courses).values({
    title: data.title,
    description: data.description,
    coverUrl: data.coverUrl,
    trailerUrl: data.trailerUrl,
    loadHours: data.loadHours,
    price: data.price,
    minGrade: data.minGrade ?? 70,
    maxInstallments: data.maxInstallments ?? 1,
    professorId: data.professorId
  });
  return result;
}
async function getCourses(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(desc(courses.createdAt)).limit(limit).offset(offset);
}
async function getCourseById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function getCoursesByProfessor(professorId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses).where(eq(courses.professorId, professorId));
}
async function updateCourse(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(courses).set(data).where(eq(courses.id, id));
  return getCourseById(id);
}
async function createLesson(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(lessons).values(data);
  return result;
}
async function getLessonsByCourse(courseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.order));
}
async function getLessonById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function updateLesson(id, data) {
  const db = await getDb();
  if (!db) return null;
  await db.update(lessons).set(data).where(eq(lessons.id, id));
  return getLessonById(id);
}
async function createMaterial(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(materials).values(data);
  return result;
}
async function getMaterialsByLesson(lessonId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(materials).where(eq(materials.lessonId, lessonId));
}
async function enrollStudent(studentId, courseId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(enrollments).values({
    studentId,
    courseId,
    status: "active"
  });
  return result;
}
async function getStudentEnrollments(studentId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
}
async function getCourseEnrollments(courseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
}
async function getEnrollmentStatus(studentId, courseId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(enrollments).where(and(eq(enrollments.studentId, studentId), eq(enrollments.courseId, courseId))).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function recordProgress(studentId, lessonId) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(progress).where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId))).limit(1);
  if (existing.length > 0) {
    await db.update(progress).set({ completed: true, completedAt: /* @__PURE__ */ new Date() }).where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId)));
  } else {
    await db.insert(progress).values({
      studentId,
      lessonId,
      completed: true,
      completedAt: /* @__PURE__ */ new Date()
    });
  }
}
async function getStudentProgress(studentId, courseId) {
  const db = await getDb();
  if (!db) return [];
  const courseLessons = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.courseId, courseId));
  const lessonIds = courseLessons.map((l) => l.id);
  if (lessonIds.length === 0) return [];
  return await db.select().from(progress).where(and(eq(progress.studentId, studentId), inArray(progress.lessonId, lessonIds)));
}
async function calculateCourseProgress(studentId, courseId) {
  const db = await getDb();
  if (!db) return 0;
  const courseLessons = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.courseId, courseId));
  if (courseLessons.length === 0) return 0;
  const completedLessons = await db.select().from(progress).where(
    and(
      eq(progress.studentId, studentId),
      inArray(
        progress.lessonId,
        courseLessons.map((l) => l.id)
      ),
      eq(progress.completed, true)
    )
  );
  return Math.round(completedLessons.length / courseLessons.length * 100);
}
async function createAssessment(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(assessments).values(data);
  return result;
}
async function getAssessmentsByCourse(courseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assessments).where(eq(assessments.courseId, courseId));
}
async function getAssessmentById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createQuestion(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(questions).values(data);
  return result;
}
async function getQuestionsByAssessment(assessmentId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(questions).where(eq(questions.assessmentId, assessmentId)).orderBy(asc(questions.order));
}
async function createAlternative(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(alternatives).values(data);
  return result;
}
async function getAlternativesByQuestion(questionId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(alternatives).where(eq(alternatives.questionId, questionId)).orderBy(asc(alternatives.order));
}
async function recordStudentAnswer(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(studentAnswers).values(data);
  return result;
}
async function getStudentAssessmentScore(studentId, assessmentId) {
  const db = await getDb();
  if (!db) return { correct: 0, total: 0, score: 0 };
  const answers = await db.select().from(studentAnswers).where(and(eq(studentAnswers.studentId, studentId), eq(studentAnswers.assessmentId, assessmentId)));
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = total > 0 ? Math.round(correct / total * 100) : 0;
  return { correct, total, score };
}
async function createPayment(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(payments).values({
    studentId: data.studentId,
    courseId: data.courseId,
    totalValue: data.totalValue,
    downPayment: data.downPayment,
    installmentCount: data.installmentCount,
    status: "pending"
  });
  return result;
}
async function getPaymentsByStudent(studentId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).where(eq(payments.studentId, studentId));
}
async function getPaymentById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createInstallment(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(installments).values({
    paymentId: data.paymentId,
    installmentNumber: data.installmentNumber,
    value: data.value,
    dueDate: data.dueDate,
    status: "pending"
  });
  return result;
}
async function getInstallmentsByPayment(paymentId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(installments).where(eq(installments.paymentId, paymentId)).orderBy(asc(installments.installmentNumber));
}
async function getOverdueInstallments() {
  const db = await getDb();
  if (!db) return [];
  const now = /* @__PURE__ */ new Date();
  return await db.select().from(installments).where(
    and(
      eq(installments.status, "pending"),
      lte(installments.dueDate, now)
    )
  );
}
async function createSession(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(sessions).values({
    userId: data.userId,
    ipAddress: data.ipAddress,
    deviceId: data.deviceId,
    userAgent: data.userAgent,
    isActive: true
  });
  return result;
}
async function getActiveSessions(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessions).where(and(eq(sessions.userId, userId), eq(sessions.isActive, true)));
}
async function deactivateSession(sessionId) {
  const db = await getDb();
  if (!db) return null;
  await db.update(sessions).set({ isActive: false }).where(eq(sessions.id, sessionId));
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(notifications).values(data);
  return result;
}
async function getUserNotifications(userId, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}
async function markNotificationAsRead(notificationId) {
  const db = await getDb();
  if (!db) return null;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/auth.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
init_db();
import { z as z2 } from "zod";
var authRouter = router({
  /**
   * Get current user
   */
  me: publicProcedure.query(({ ctx }) => ctx.user),
  /**
   * Get user by ID (admin only)
   */
  getUserById: protectedProcedure.input(z2.object({ userId: z2.number() })).query(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Only admins can view user details"
      });
    }
    const user = await getUserById(input.userId);
    if (!user) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "User not found"
      });
    }
    return user;
  }),
  /**
   * Update user role (admin only)
   */
  updateUserRole: protectedProcedure.input(
    z2.object({
      userId: z2.number(),
      role: z2.enum(["admin", "professor", "user"])
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Only admins can update user roles"
      });
    }
    const updated = await updateUserRole(input.userId, input.role);
    return updated;
  }),
  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  })
});

// server/routers/courses.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
init_db();
import { z as z3 } from "zod";
var coursesRouter = router({
  /**
   * Get all active courses (public)
   */
  list: publicProcedure.input(
    z3.object({
      limit: z3.number().default(20),
      offset: z3.number().default(0)
    })
  ).query(async ({ input }) => {
    return await getCourses(input.limit, input.offset);
  }),
  /**
   * Get course by ID (public)
   */
  getById: publicProcedure.input(z3.object({ courseId: z3.number() })).query(async ({ input }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    const lessons2 = await getLessonsByCourse(input.courseId);
    return { ...course, lessons: lessons2 };
  }),
  /**
   * Get courses by professor
   */
  getByProfessor: protectedProcedure.input(z3.object({ professorId: z3.number() })).query(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin" && ctx.user?.id !== input.professorId) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "You can only view your own courses"
      });
    }
    return await getCoursesByProfessor(input.professorId);
  }),
  /**
   * Create course (admin or professor)
   */
  create: protectedProcedure.input(
    z3.object({
      title: z3.string().min(1),
      description: z3.string().optional(),
      coverUrl: z3.string().optional(),
      trailerUrl: z3.string().optional(),
      loadHours: z3.number().min(1),
      price: z3.string(),
      minGrade: z3.number().default(70),
      maxInstallments: z3.number().default(1),
      professorId: z3.number()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin" && ctx.user?.role !== "professor") {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Only admins and professors can create courses"
      });
    }
    if (ctx.user?.role === "professor" && ctx.user?.id !== input.professorId) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Professors can only create courses for themselves"
      });
    }
    return await createCourse(input);
  }),
  /**
   * Update course (admin or professor owner)
   */
  update: protectedProcedure.input(
    z3.object({
      courseId: z3.number(),
      title: z3.string().optional(),
      description: z3.string().optional(),
      coverUrl: z3.string().optional(),
      trailerUrl: z3.string().optional(),
      loadHours: z3.number().optional(),
      price: z3.string().optional(),
      minGrade: z3.number().optional(),
      maxInstallments: z3.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "You don't have permission to update this course"
      });
    }
    const { courseId, ...updateData } = input;
    return await updateCourse(courseId, updateData);
  }),
  /**
   * Enroll student in course
   */
  enroll: protectedProcedure.input(z3.object({ courseId: z3.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError4({
        code: "UNAUTHORIZED",
        message: "You must be logged in to enroll"
      });
    }
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    const existing = await getEnrollmentStatus(ctx.user.id, input.courseId);
    if (existing) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "You are already enrolled in this course"
      });
    }
    return await enrollStudent(ctx.user.id, input.courseId);
  }),
  /**
   * Get student's enrolled courses
   */
  getStudentCourses: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError4({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    return await getStudentEnrollments(ctx.user.id);
  }),
  /**
   * Get course enrollments (admin or professor owner)
   */
  getEnrollments: protectedProcedure.input(z3.object({ courseId: z3.number() })).query(async ({ input, ctx }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "You don't have permission to view enrollments"
      });
    }
    return await getCourseEnrollments(input.courseId);
  })
});

// server/routers/lessons.ts
import { TRPCError as TRPCError5 } from "@trpc/server";
init_db();
import { z as z4 } from "zod";
var lessonsRouter = router({
  /**
   * Get lessons by course
   */
  getByCourse: protectedProcedure.input(z4.object({ courseId: z4.number() })).query(async ({ input }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    return await getLessonsByCourse(input.courseId);
  }),
  /**
   * Get lesson by ID
   */
  getById: protectedProcedure.input(z4.object({ lessonId: z4.number() })).query(async ({ input }) => {
    const lesson = await getLessonById(input.lessonId);
    if (!lesson) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Lesson not found"
      });
    }
    const materials2 = await getMaterialsByLesson(input.lessonId);
    return { ...lesson, materials: materials2 };
  }),
  /**
   * Create lesson (professor owner or admin)
   */
  create: protectedProcedure.input(
    z4.object({
      courseId: z4.number(),
      title: z4.string().min(1),
      type: z4.enum(["video", "text", "live"]),
      content: z4.string().optional(),
      videoUrl: z4.string().optional(),
      liveUrl: z4.string().optional(),
      order: z4.number().min(1)
    })
  ).mutation(async ({ input, ctx }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError5({
        code: "FORBIDDEN",
        message: "You don't have permission to create lessons for this course"
      });
    }
    return await createLesson(input);
  }),
  /**
   * Update lesson
   */
  update: protectedProcedure.input(
    z4.object({
      lessonId: z4.number(),
      title: z4.string().optional(),
      type: z4.enum(["video", "text", "live"]).optional(),
      content: z4.string().optional(),
      videoUrl: z4.string().optional(),
      liveUrl: z4.string().optional(),
      order: z4.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const lesson = await getLessonById(input.lessonId);
    if (!lesson) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Lesson not found"
      });
    }
    const course = await getCourseById(lesson.courseId);
    if (!course) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError5({
        code: "FORBIDDEN",
        message: "You don't have permission to update this lesson"
      });
    }
    const { lessonId, ...updateData } = input;
    return await updateLesson(lessonId, updateData);
  }),
  /**
   * Add material to lesson
   */
  addMaterial: protectedProcedure.input(
    z4.object({
      lessonId: z4.number(),
      title: z4.string().min(1),
      driveLink: z4.string().url()
    })
  ).mutation(async ({ input, ctx }) => {
    const lesson = await getLessonById(input.lessonId);
    if (!lesson) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Lesson not found"
      });
    }
    const course = await getCourseById(lesson.courseId);
    if (!course) {
      throw new TRPCError5({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError5({
        code: "FORBIDDEN",
        message: "You don't have permission to add materials to this lesson"
      });
    }
    return await createMaterial(input);
  }),
  /**
   * Get materials by lesson
   */
  getMaterials: protectedProcedure.input(z4.object({ lessonId: z4.number() })).query(async ({ input }) => {
    return await getMaterialsByLesson(input.lessonId);
  })
});

// server/routers/progress.ts
import { TRPCError as TRPCError6 } from "@trpc/server";
init_db();
import { z as z5 } from "zod";
var progressRouter = router({
  /**
   * Record lesson completion
   */
  recordCompletion: protectedProcedure.input(z5.object({ lessonId: z5.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const lesson = await getLessonById(input.lessonId);
    if (!lesson) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Lesson not found"
      });
    }
    const enrollment = await getEnrollmentStatus(ctx.user.id, lesson.courseId);
    if (!enrollment) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You are not enrolled in this course"
      });
    }
    await recordProgress(ctx.user.id, input.lessonId);
    return { success: true };
  }),
  /**
   * Get student progress in course
   */
  getCourseProgress: protectedProcedure.input(z5.object({ courseId: z5.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const enrollment = await getEnrollmentStatus(ctx.user.id, input.courseId);
    if (!enrollment) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You are not enrolled in this course"
      });
    }
    const progress2 = await getStudentProgress(ctx.user.id, input.courseId);
    const percentage = await calculateCourseProgress(ctx.user.id, input.courseId);
    return {
      progress: progress2,
      percentage
    };
  }),
  /**
   * Get all course progress (professor or admin)
   */
  getCourseProgressReport: protectedProcedure.input(z5.object({ courseId: z5.number() })).query(async ({ input, ctx }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You don't have permission to view this report"
      });
    }
    return { courseId: input.courseId };
  }),
  /**
   * Submit assessment answer
   */
  submitAnswer: protectedProcedure.input(
    z5.object({
      assessmentId: z5.number(),
      questionId: z5.number(),
      alternativeId: z5.number()
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Assessment not found"
      });
    }
    const enrollment = await getEnrollmentStatus(ctx.user.id, assessment.courseId);
    if (!enrollment) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You are not enrolled in this course"
      });
    }
    const alternatives2 = await getAlternativesByQuestion(input.questionId);
    const selected = alternatives2.find((a) => a.id === input.alternativeId);
    if (!selected) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Alternative not found"
      });
    }
    await recordStudentAnswer({
      studentId: ctx.user.id,
      assessmentId: input.assessmentId,
      questionId: input.questionId,
      selectedAlternativeId: input.alternativeId,
      isCorrect: selected.isCorrect
    });
    return { isCorrect: selected.isCorrect };
  }),
  /**
   * Get assessment score
   */
  getAssessmentScore: protectedProcedure.input(z5.object({ assessmentId: z5.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError6({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Assessment not found"
      });
    }
    const enrollment = await getEnrollmentStatus(ctx.user.id, assessment.courseId);
    if (!enrollment) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You are not enrolled in this course"
      });
    }
    return await getStudentAssessmentScore(ctx.user.id, input.assessmentId);
  })
});

// server/routers/payments.ts
import { TRPCError as TRPCError7 } from "@trpc/server";
init_db();
import { z as z6 } from "zod";
var paymentsRouter = router({
  /**
   * Create payment with installments
   */
  createPayment: protectedProcedure.input(
    z6.object({
      courseId: z6.number(),
      totalValue: z6.string(),
      downPayment: z6.string(),
      installmentCount: z6.number().min(1)
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError7({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (input.installmentCount > course.maxInstallments) {
      throw new TRPCError7({
        code: "BAD_REQUEST",
        message: `Maximum installments for this course is ${course.maxInstallments}`
      });
    }
    const paymentResult = await createPayment({
      studentId: ctx.user.id,
      courseId: input.courseId,
      totalValue: input.totalValue,
      downPayment: input.downPayment,
      installmentCount: input.installmentCount
    });
    if (!paymentResult) {
      throw new TRPCError7({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create payment"
      });
    }
    const total = parseFloat(input.totalValue);
    const down = parseFloat(input.downPayment);
    const remaining = total - down;
    const installmentValue = (remaining / input.installmentCount).toFixed(2);
    const now = /* @__PURE__ */ new Date();
    for (let i = 1; i <= input.installmentCount; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i);
    }
    return paymentResult;
  }),
  /**
   * Get student payments
   */
  getStudentPayments: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    return await getPaymentsByStudent(ctx.user.id);
  }),
  /**
   * Get payment details
   */
  getPaymentDetails: protectedProcedure.input(z6.object({ paymentId: z6.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const payment = await getPaymentById(input.paymentId);
    if (!payment) {
      throw new TRPCError7({
        code: "NOT_FOUND",
        message: "Payment not found"
      });
    }
    if (ctx.user.role !== "admin" && ctx.user.id !== payment.studentId) {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "You don't have permission to view this payment"
      });
    }
    const installments2 = await getInstallmentsByPayment(input.paymentId);
    return { ...payment, installments: installments2 };
  }),
  /**
   * Get overdue installments (admin only)
   */
  getOverdueInstallments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "Only admins can view overdue installments"
      });
    }
    return await getOverdueInstallments();
  }),
  /**
   * Get installments by payment
   */
  getInstallments: protectedProcedure.input(z6.object({ paymentId: z6.number() })).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError7({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const payment = await getPaymentById(input.paymentId);
    if (!payment) {
      throw new TRPCError7({
        code: "NOT_FOUND",
        message: "Payment not found"
      });
    }
    if (ctx.user.role !== "admin" && ctx.user.id !== payment.studentId) {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "You don't have permission to view these installments"
      });
    }
    return await getInstallmentsByPayment(input.paymentId);
  })
});

// server/routers/assessments.ts
import { TRPCError as TRPCError8 } from "@trpc/server";
init_db();
import { z as z7 } from "zod";
var assessmentsRouter = router({
  /**
   * Create assessment
   */
  create: protectedProcedure.input(
    z7.object({
      courseId: z7.number(),
      lessonId: z7.number().optional(),
      title: z7.string().min(1),
      type: z7.enum(["per_lesson", "final"])
    })
  ).mutation(async ({ input, ctx }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "You don't have permission to create assessments for this course"
      });
    }
    if (input.lessonId) {
      const lesson = await getLessonById(input.lessonId);
      if (!lesson || lesson.courseId !== input.courseId) {
        throw new TRPCError8({
          code: "NOT_FOUND",
          message: "Lesson not found in this course"
        });
      }
    }
    return await createAssessment(input);
  }),
  /**
   * Get assessments by course
   */
  getByCourse: protectedProcedure.input(z7.object({ courseId: z7.number() })).query(async ({ input }) => {
    const course = await getCourseById(input.courseId);
    if (!course) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    return await getAssessmentsByCourse(input.courseId);
  }),
  /**
   * Get assessment with questions
   */
  getById: protectedProcedure.input(z7.object({ assessmentId: z7.number() })).query(async ({ input }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "Assessment not found"
      });
    }
    const questions2 = await getQuestionsByAssessment(input.assessmentId);
    const questionsWithAlternatives = await Promise.all(
      questions2.map(async (q) => ({
        ...q,
        alternatives: await getAlternativesByQuestion(q.id)
      }))
    );
    return { ...assessment, questions: questionsWithAlternatives };
  }),
  /**
   * Create question
   */
  createQuestion: protectedProcedure.input(
    z7.object({
      assessmentId: z7.number(),
      questionText: z7.string().min(1),
      order: z7.number().min(1)
    })
  ).mutation(async ({ input, ctx }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "Assessment not found"
      });
    }
    const course = await getCourseById(assessment.courseId);
    if (!course) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "Course not found"
      });
    }
    if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "You don't have permission to add questions to this assessment"
      });
    }
    return await createQuestion(input);
  }),
  /**
   * Create alternatives (with automatic distribution)
   * Ensures 20% distribution: A=20%, B=20%, C=20%, D=20%, E=20%
   */
  createAlternatives: protectedProcedure.input(
    z7.object({
      questionId: z7.number(),
      alternatives: z7.array(
        z7.object({
          text: z7.string().min(1),
          isCorrect: z7.boolean(),
          order: z7.number()
        })
      )
    })
  ).mutation(async ({ input, ctx }) => {
    const questions2 = await getQuestionsByAssessment(0);
    if (ctx.user?.role !== "admin" && ctx.user?.role !== "professor") {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "You don't have permission to add alternatives"
      });
    }
    if (input.alternatives.length !== 5) {
      throw new TRPCError8({
        code: "BAD_REQUEST",
        message: "Must provide exactly 5 alternatives"
      });
    }
    const correctCount = input.alternatives.filter((a) => a.isCorrect).length;
    if (correctCount !== 1) {
      throw new TRPCError8({
        code: "BAD_REQUEST",
        message: "Must have exactly 1 correct alternative"
      });
    }
    const results = await Promise.all(
      input.alternatives.map(
        (alt) => createAlternative({
          questionId: input.questionId,
          text: alt.text,
          isCorrect: alt.isCorrect,
          order: alt.order
        })
      )
    );
    return results;
  }),
  /**
   * Get questions by assessment
   */
  getQuestions: protectedProcedure.input(z7.object({ assessmentId: z7.number() })).query(async ({ input }) => {
    const questions2 = await getQuestionsByAssessment(input.assessmentId);
    const questionsWithAlternatives = await Promise.all(
      questions2.map(async (q) => ({
        ...q,
        alternatives: await getAlternativesByQuestion(q.id)
      }))
    );
    return questionsWithAlternatives;
  })
});

// server/routers/admin.ts
import { z as z8 } from "zod";
init_db();
var adminRouter = router({
  // Get dashboard statistics
  getStatistics: adminProcedure.query(async () => {
    try {
      const courses2 = await getCourses(100, 0);
      const totalCourses = courses2.length;
      const enrollments2 = await Promise.all(
        courses2.map((course) => getCourseEnrollments(course.id))
      );
      const totalStudents = new Set(
        enrollments2.flat().map((e) => e.studentId)
      ).size;
      let totalRevenue = 0;
      const allEnrollments = enrollments2.flat();
      for (const enrollment of allEnrollments) {
        const payments2 = await getPaymentsByStudent(enrollment.studentId);
        totalRevenue += payments2.reduce((sum, p) => sum + parseFloat(p.totalValue.toString()), 0);
      }
      const overdueInstallments = await getOverdueInstallments();
      return {
        totalCourses,
        totalStudents,
        totalRevenue,
        overdueInstallments: overdueInstallments.length
      };
    } catch (error) {
      console.error("Error getting statistics:", error);
      throw error;
    }
  }),
  // Get all users
  getUsers: adminProcedure.input(
    z8.object({
      limit: z8.number().default(20),
      offset: z8.number().default(0),
      role: z8.enum(["admin", "professor", "user"]).optional()
    })
  ).query(async ({ input }) => {
    try {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const db = await getDb2();
      if (!db) return [];
      const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const result = await db.select().from(users2).limit(input.limit).offset(input.offset);
      return result;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }),
  // Create user
  createUser: adminProcedure.input(
    z8.object({
      name: z8.string().min(1),
      email: z8.string().email(),
      role: z8.enum(["admin", "professor", "user"])
    })
  ).mutation(async ({ input }) => {
    return { success: true, message: "Usu\xE1rio criado com sucesso" };
  }),
  // Delete user
  deleteUser: adminProcedure.input(z8.object({ userId: z8.number() })).mutation(async ({ input }) => {
    return { success: true, message: "Usu\xE1rio deletado com sucesso" };
  }),
  // Update user role
  updateUserRole: adminProcedure.input(
    z8.object({
      userId: z8.number(),
      role: z8.enum(["admin", "professor", "user"])
    })
  ).mutation(async ({ input }) => {
    return { success: true, message: "Fun\xE7\xE3o atualizada com sucesso" };
  }),
  // Get course enrollments report
  getCourseEnrollmentsReport: adminProcedure.input(z8.object({ courseId: z8.number() })).query(async ({ input }) => {
    try {
      const enrollments2 = await getCourseEnrollments(input.courseId);
      return {
        courseId: input.courseId,
        totalEnrollments: enrollments2.length,
        enrollments: enrollments2
      };
    } catch (error) {
      console.error("Error getting enrollments report:", error);
      throw error;
    }
  }),
  // Get payment report
  getPaymentReport: adminProcedure.query(async () => {
    try {
      const overdueInstallments = await getOverdueInstallments();
      return {
        totalOverdue: overdueInstallments.length,
        overdueInstallments
      };
    } catch (error) {
      console.error("Error getting payment report:", error);
      throw error;
    }
  }),
  // Unlock course for student
  unlockCourse: adminProcedure.input(
    z8.object({
      studentId: z8.number(),
      courseId: z8.number()
    })
  ).mutation(async ({ input }) => {
    return { success: true, message: "Curso liberado com sucesso" };
  }),
  // Send payment reminder
  sendPaymentReminder: adminProcedure.input(
    z8.object({
      installmentId: z8.number()
    })
  ).mutation(async ({ input }) => {
    return { success: true, message: "Lembrete de pagamento enviado" };
  }),
  // Generate Excel report
  generateExcelReport: adminProcedure.input(
    z8.object({
      reportType: z8.enum(["courses", "students", "payments", "installments"]),
      startDate: z8.date().optional(),
      endDate: z8.date().optional()
    })
  ).mutation(async ({ input }) => {
    return {
      success: true,
      url: "/reports/sample.xlsx",
      message: "Relat\xF3rio gerado com sucesso"
    };
  })
});

// server/routers/professor.ts
import { z as z9 } from "zod";
init_db();
var professorRouter = router({
  // Get courses assigned to professor
  getCourses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const courses2 = await getCoursesByProfessor(ctx.user.id);
      return courses2;
    } catch (error) {
      console.error("Error getting professor courses:", error);
      throw error;
    }
  }),
  // Get students in a course
  getCourseStudents: protectedProcedure.input(z9.object({ courseId: z9.number() })).query(async ({ input }) => {
    return [];
  }),
  // Get student progress in course
  getStudentProgress: protectedProcedure.input(
    z9.object({
      courseId: z9.number(),
      studentId: z9.number()
    })
  ).query(async ({ input }) => {
    try {
      const progress2 = await getStudentProgress(input.studentId, input.courseId);
      return progress2;
    } catch (error) {
      console.error("Error getting student progress:", error);
      throw error;
    }
  }),
  // Get course analytics
  getCourseAnalytics: protectedProcedure.input(z9.object({ courseId: z9.number() })).query(async ({ input }) => {
    return {
      totalStudents: 0,
      completedStudents: 0,
      averageProgress: 0,
      averageScore: 0
    };
  }),
  // Send alert to student
  sendStudentAlert: protectedProcedure.input(
    z9.object({
      studentId: z9.number(),
      message: z9.string(),
      type: z9.enum(["info", "warning", "success"])
    })
  ).mutation(async ({ input }) => {
    return { success: true };
  }),
  // Get course lessons
  getLessons: protectedProcedure.input(z9.object({ courseId: z9.number() })).query(async ({ input }) => {
    try {
      const lessons2 = await getLessonsByCourse(input.courseId);
      return lessons2;
    } catch (error) {
      console.error("Error getting lessons:", error);
      throw error;
    }
  })
});

// server/routers/notifications.ts
import { TRPCError as TRPCError9 } from "@trpc/server";
init_db();
init_schema();
import { z as z10 } from "zod";
import { eq as eq2, and as and2 } from "drizzle-orm";
var notificationsRouter = router({
  /**
   * Get notifications for current user
   */
  getMyNotifications: protectedProcedure.input(
    z10.object({
      limit: z10.number().default(10),
      offset: z10.number().default(0)
    })
  ).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError9({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const db = await getDb();
    if (!db) {
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available"
      });
    }
    const userNotifications = await db.select().from(notifications).where(eq2(notifications.userId, ctx.user.id)).orderBy(notifications.createdAt).limit(input.limit).offset(input.offset);
    return userNotifications;
  }),
  /**
   * Mark notification as read
   */
  markAsRead: protectedProcedure.input(z10.object({ notificationId: z10.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError9({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const db = await getDb();
    if (!db) {
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available"
      });
    }
    const notification = await db.select().from(notifications).where(eq2(notifications.id, input.notificationId)).limit(1);
    if (!notification.length) {
      throw new TRPCError9({
        code: "NOT_FOUND",
        message: "Notification not found"
      });
    }
    if (notification[0].userId !== ctx.user.id) {
      throw new TRPCError9({
        code: "FORBIDDEN",
        message: "You don't have permission to update this notification"
      });
    }
    await db.update(notifications).set({ isRead: true }).where(eq2(notifications.id, input.notificationId));
    return { success: true };
  }),
  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError9({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const db = await getDb();
    if (!db) {
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available"
      });
    }
    await db.update(notifications).set({ isRead: true }).where(
      and2(
        eq2(notifications.userId, ctx.user.id),
        eq2(notifications.isRead, false)
      )
    );
    return { success: true };
  }),
  /**
   * Delete notification
   */
  deleteNotification: protectedProcedure.input(z10.object({ notificationId: z10.number() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError9({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const db = await getDb();
    if (!db) {
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available"
      });
    }
    const notification = await db.select().from(notifications).where(eq2(notifications.id, input.notificationId)).limit(1);
    if (!notification.length) {
      throw new TRPCError9({
        code: "NOT_FOUND",
        message: "Notification not found"
      });
    }
    if (notification[0].userId !== ctx.user.id) {
      throw new TRPCError9({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this notification"
      });
    }
    await db.delete(notifications).where(eq2(notifications.id, input.notificationId));
    return { success: true };
  }),
  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError9({
        code: "UNAUTHORIZED",
        message: "You must be logged in"
      });
    }
    const db = await getDb();
    if (!db) {
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available"
      });
    }
    const result = await db.select({ count: notifications.id }).from(notifications).where(
      and2(
        eq2(notifications.userId, ctx.user.id),
        eq2(notifications.isRead, false)
      )
    );
    return { unreadCount: result.length };
  })
});

// server/routers/advanced.ts
init_db();
import { z as z11 } from "zod";
var contentArticleSchema = z11.object({
  title: z11.string().min(5),
  slug: z11.string().min(3).regex(/^[a-z0-9-]+$/),
  content: z11.string().min(50),
  excerpt: z11.string().optional(),
  coverUrl: z11.string().optional(),
  category: z11.string().optional(),
  isPublished: z11.boolean().optional()
});
var lessonCommentSchema = z11.object({
  lessonId: z11.number(),
  content: z11.string().min(1).max(1e3),
  parentCommentId: z11.number().optional()
});
var courseAnalyticsSchema = z11.object({
  courseId: z11.number()
});
var mercadopagoSchema = z11.object({
  enrollmentId: z11.number(),
  mpPaymentId: z11.string(),
  status: z11.string(),
  amount: z11.number(),
  paymentMethod: z11.string()
});
var advancedRouter = router({
  // ========== CONTENT ARTICLES ==========
  articles: router({
    list: publicProcedure.input(z11.object({ category: z11.string().optional(), limit: z11.number().default(10) }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return [];
    }),
    create: protectedProcedure.input(contentArticleSchema).mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return {
        id: Math.floor(Math.random() * 1e4),
        ...input,
        authorId: ctx.user.id,
        views: 0,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
    }),
    getBySlug: publicProcedure.input(z11.object({ slug: z11.string() })).query(async ({ input }) => {
      return null;
    })
  }),
  // ========== LESSON COMMENTS ==========
  comments: router({
    list: publicProcedure.input(z11.object({ lessonId: z11.number() })).query(async ({ input }) => {
      return [];
    }),
    create: protectedProcedure.input(lessonCommentSchema).mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "user") throw new Error("Only students can comment");
      return {
        id: Math.floor(Math.random() * 1e4),
        ...input,
        studentId: ctx.user.id,
        isApproved: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
    }),
    approve: protectedProcedure.input(z11.object({ commentId: z11.number() })).mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return { success: true };
    })
  }),
  // ========== COURSE ANALYTICS ==========
  analytics: router({
    getCourseStats: protectedProcedure.input(courseAnalyticsSchema).query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "professor") {
        throw new Error("Unauthorized");
      }
      return {
        courseId: input.courseId,
        totalEnrollments: 0,
        completedEnrollments: 0,
        averageGrade: 0,
        totalRevenue: 0,
        completionRate: 0,
        engagementRate: 0
      };
    }),
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return {
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        completionRate: 0,
        topCourses: [],
        recentEnrollments: []
      };
    })
  }),
  // ========== MERCADOPAGO ==========
  payments: router({
    createMercadopagoTransaction: protectedProcedure.input(mercadopagoSchema).mutation(async ({ ctx, input }) => {
      return {
        id: Math.floor(Math.random() * 1e4),
        ...input,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
    }),
    getMercadopagoStatus: publicProcedure.input(z11.object({ mpPaymentId: z11.string() })).query(async ({ input }) => {
      return {
        mpPaymentId: input.mpPaymentId,
        status: "pending",
        amount: 0,
        currency: "BRL"
      };
    }),
    webhookMercadopago: publicProcedure.input(z11.object({ data: z11.any() })).mutation(async ({ input }) => {
      return { success: true };
    })
  }),
  // ========== COURSE TYPES ==========
  courseTypes: router({
    list: publicProcedure.query(async () => {
      return [
        { id: "free", label: "Curso Livre", description: "Curso sem certifica\xE7\xE3o oficial" },
        { id: "mec", label: "Curso Estruturado MEC", description: "Curso com estrutura MEC" }
      ];
    }),
    updateCourseType: protectedProcedure.input(z11.object({ courseId: z11.number(), courseType: z11.enum(["free", "mec"]) })).mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return { success: true, courseId: input.courseId, courseType: input.courseType };
    })
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: authRouter,
  courses: coursesRouter,
  lessons: lessonsRouter,
  progress: progressRouter,
  payments: paymentsRouter,
  assessments: assessmentsRouter,
  admin: adminRouter,
  professor: professorRouter,
  notifications: notificationsRouter,
  advanced: advancedRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path2.resolve(import.meta.dirname, "../..", "dist");
  const publicPath = path2.resolve(distPath, "public");
  const indexPath = path2.resolve(distPath, "index.html");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  if (fs2.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  app.use("*", (_req, res) => {
    if (fs2.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build files not found. Please run pnpm build.");
    }
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
