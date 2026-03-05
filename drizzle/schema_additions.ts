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
} from "drizzle-orm/mysql-core";

// ============================================================================
// COURSE TYPES - Adicionar courseType ao courses (já existe na tabela)
// courseType: ENUM('free', 'mec')
// ============================================================================

// ============================================================================
// CONTENT ARTICLES TABLE - Portal de Conteúdo
// ============================================================================

export const contentArticles = mysqlTable(
  "content_articles",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: longtext("content").notNull(),
    excerpt: varchar("excerpt", { length: 500 }),
    coverUrl: varchar("coverUrl", { length: 500 }),
    authorId: int("authorId").notNull(),
    category: varchar("category", { length: 100 }),
    isPublished: boolean("isPublished").default(false).notNull(),
    views: int("views").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    slugIdx: index("slug_idx").on(table.slug),
    categoryIdx: index("category_idx").on(table.category),
    publishedIdx: index("isPublished_idx").on(table.isPublished),
    authorIdx: index("authorId_idx").on(table.authorId),
  })
);

export type ContentArticle = typeof contentArticles.$inferSelect;
export type InsertContentArticle = typeof contentArticles.$inferInsert;

// ============================================================================
// LESSON COMMENTS TABLE - Comentários em Aulas
// ============================================================================

export const lessonComments = mysqlTable(
  "lesson_comments",
  {
    id: int("id").autoincrement().primaryKey(),
    lessonId: int("lessonId").notNull(),
    studentId: int("studentId").notNull(),
    content: text("content").notNull(),
    parentCommentId: int("parentCommentId"),
    isApproved: boolean("isApproved").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    lessonIdx: index("lessonId_idx").on(table.lessonId),
    studentIdx: index("studentId_idx").on(table.studentId),
    createdAtIdx: index("createdAt_idx").on(table.createdAt),
  })
);

export type LessonComment = typeof lessonComments.$inferSelect;
export type InsertLessonComment = typeof lessonComments.$inferInsert;

// ============================================================================
// COURSE ANALYTICS TABLE - Dashboard de Analytics
// ============================================================================

export const courseAnalytics = mysqlTable(
  "course_analytics",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull().unique(),
    totalEnrollments: int("totalEnrollments").default(0).notNull(),
    completedEnrollments: int("completedEnrollments").default(0).notNull(),
    averageGrade: decimal("averageGrade", { precision: 5, scale: 2 }),
    totalRevenue: decimal("totalRevenue", { precision: 12, scale: 2 }).default("0").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    courseIdx: index("courseId_idx").on(table.courseId),
  })
);

export type CourseAnalytic = typeof courseAnalytics.$inferSelect;
export type InsertCourseAnalytic = typeof courseAnalytics.$inferInsert;

// ============================================================================
// MERCADOPAGO TRANSACTIONS TABLE - Integração MercadoPago
// ============================================================================

export const mercadopagoTransactions = mysqlTable(
  "mercadopago_transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    enrollmentId: int("enrollmentId").notNull(),
    mpPaymentId: varchar("mpPaymentId", { length: 255 }).unique(),
    status: varchar("status", { length: 50 }),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    mpPaymentIdIdx: index("mpPaymentId_idx").on(table.mpPaymentId),
    statusIdx: index("status_idx").on(table.status),
    enrollmentIdx: index("enrollmentId_idx").on(table.enrollmentId),
  })
);

export type MercadopagoTransaction = typeof mercadopagoTransactions.$inferSelect;
export type InsertMercadopagoTransaction = typeof mercadopagoTransactions.$inferInsert;
