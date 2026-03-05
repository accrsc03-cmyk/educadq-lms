import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createCourse,
  getCourses,
  getCourseById,
  getCoursesByProfessor,
  updateCourse,
  getLessonsByCourse,
  getCourseEnrollments,
  getStudentEnrollments,
  enrollStudent,
  getEnrollmentStatus,
} from "../db";
import { z } from "zod";

export const coursesRouter = router({
  /**
   * Get all active courses (public)
   */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await getCourses(input.limit, input.offset);
    }),

  /**
   * Get course by ID (public)
   */
  getById: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const lessons = await getLessonsByCourse(input.courseId);
      return { ...course, lessons };
    }),

  /**
   * Get courses by professor
   */
  getByProfessor: protectedProcedure
    .input(z.object({ professorId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.id !== input.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own courses",
        });
      }

      return await getCoursesByProfessor(input.professorId);
    }),

  /**
   * Create course (admin or professor)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        coverUrl: z.string().optional(),
        trailerUrl: z.string().optional(),
        loadHours: z.number().min(1),
        price: z.string(),
        minGrade: z.number().default(70),
        maxInstallments: z.number().default(1),
        professorId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "professor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and professors can create courses",
        });
      }

      if (ctx.user?.role === "professor" && ctx.user?.id !== input.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Professors can only create courses for themselves",
        });
      }

      return await createCourse(input);
    }),

  /**
   * Update course (admin or professor owner)
   */
  update: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        coverUrl: z.string().optional(),
        trailerUrl: z.string().optional(),
        loadHours: z.number().optional(),
        price: z.string().optional(),
        minGrade: z.number().optional(),
        maxInstallments: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this course",
        });
      }

      const { courseId, ...updateData } = input;
      return await updateCourse(courseId, updateData);
    }),

  /**
   * Enroll student in course
   */
  enroll: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to enroll",
        });
      }

      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const existing = await getEnrollmentStatus(ctx.user.id, input.courseId);
      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already enrolled in this course",
        });
      }

      return await enrollStudent(ctx.user.id, input.courseId);
    }),

  /**
   * Get student's enrolled courses
   */
  getStudentCourses: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    }

    return await getStudentEnrollments(ctx.user.id);
  }),

  /**
   * Get course enrollments (admin or professor owner)
   */
  getEnrollments: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input, ctx }) => {
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view enrollments",
        });
      }

      return await getCourseEnrollments(input.courseId);
    }),
});
