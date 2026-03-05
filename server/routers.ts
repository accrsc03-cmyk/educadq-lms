import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { coursesRouter } from "./routers/courses";
import { lessonsRouter } from "./routers/lessons";
import { progressRouter } from "./routers/progress";
import { paymentsRouter } from "./routers/payments";
import { assessmentsRouter } from "./routers/assessments";
import { adminRouter } from "./routers/admin";
import { professorRouter } from "./routers/professor";
import { notificationsRouter } from "./routers/notifications";
import { advancedRouter } from "./routers/advanced";

export const appRouter = router({
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
  advanced: advancedRouter,
});

export type AppRouter = typeof appRouter;
