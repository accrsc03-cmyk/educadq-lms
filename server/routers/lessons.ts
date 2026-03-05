import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  getCourseById,
  createMaterial,
  getMaterialsByLesson,
} from "../db";
import { z } from "zod";

export const lessonsRouter = router({
  /**
   * Get lessons by course
   */
  getByCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return await getLessonsByCourse(input.courseId);
    }),

  /**
   * Get lesson by ID
   */
  getById: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const lesson = await getLessonById(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const materials = await getMaterialsByLesson(input.lessonId);
      return { ...lesson, materials };
    }),

  /**
   * Create lesson (professor owner or admin)
   */
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().min(1),
        type: z.enum(["video", "text", "live"]),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        order: z.number().min(1),
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
          message: "You don't have permission to create lessons for this course",
        });
      }

      return await createLesson(input);
    }),

  /**
   * Update lesson
   */
  update: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        title: z.string().optional(),
        type: z.enum(["video", "text", "live"]).optional(),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const lesson = await getLessonById(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const course = await getCourseById(lesson.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this lesson",
        });
      }

      const { lessonId, ...updateData } = input;
      return await updateLesson(lessonId, updateData);
    }),

  /**
   * Add material to lesson
   */
  addMaterial: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        title: z.string().min(1),
        driveLink: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const lesson = await getLessonById(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const course = await getCourseById(lesson.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to add materials to this lesson",
        });
      }

      return await createMaterial(input);
    }),

  /**
   * Get materials by lesson
   */
  getMaterials: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      return await getMaterialsByLesson(input.lessonId);
    }),
});
