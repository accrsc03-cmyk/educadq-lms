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

export const appRouter = router({
  system: systemRouter,
  
  auth: authRouter,
  
  courses: coursesRouter,
  
  lessons: lessonsRouter,
  
  progress: progressRouter,
  
  payments: paymentsRouter,
  
  assessments: assessmentsRouter,
});

export type AppRouter = typeof appRouter;
