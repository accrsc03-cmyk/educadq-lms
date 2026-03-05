import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  recordProgress,
  getStudentProgress,
  calculateCourseProgress,
  getEnrollmentStatus,
  getLessonById,
  getCourseById,
  getStudentAssessmentScore,
  getAssessmentById,
  recordStudentAnswer,
  getQuestionsByAssessment,
  getAlternativesByQuestion,
} from "../db";
import { z } from "zod";

export const progressRouter = router({
  /**
   * Record lesson completion
   */
  recordCompletion: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const lesson = await getLessonById(input.lessonId);
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const enrollment = await getEnrollmentStatus(ctx.user.id, lesson.courseId);
      if (!enrollment) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in this course",
        });
      }

      await recordProgress(ctx.user.id, input.lessonId);
      return { success: true };
    }),

  /**
   * Get student progress in course
   */
  getCourseProgress: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const enrollment = await getEnrollmentStatus(ctx.user.id, input.courseId);
      if (!enrollment) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in this course",
        });
      }

      const progress = await getStudentProgress(ctx.user.id, input.courseId);
      const percentage = await calculateCourseProgress(ctx.user.id, input.courseId);

      return {
        progress,
        percentage,
      };
    }),

  /**
   * Get all course progress (professor or admin)
   */
  getCourseProgressReport: protectedProcedure
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
          message: "You don't have permission to view this report",
        });
      }

      // TODO: Implement full report with all students
      return { courseId: input.courseId };
    }),

  /**
   * Submit assessment answer
   */
  submitAnswer: protectedProcedure
    .input(
      z.object({
        assessmentId: z.number(),
        questionId: z.number(),
        alternativeId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found",
        });
      }

      const enrollment = await getEnrollmentStatus(ctx.user.id, assessment.courseId);
      if (!enrollment) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in this course",
        });
      }

      const alternatives = await getAlternativesByQuestion(input.questionId);
      const selected = alternatives.find((a) => a.id === input.alternativeId);

      if (!selected) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Alternative not found",
        });
      }

      await recordStudentAnswer({
        studentId: ctx.user.id,
        assessmentId: input.assessmentId,
        questionId: input.questionId,
        selectedAlternativeId: input.alternativeId,
        isCorrect: selected.isCorrect,
      });

      return { isCorrect: selected.isCorrect };
    }),

  /**
   * Get assessment score
   */
  getAssessmentScore: protectedProcedure
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found",
        });
      }

      const enrollment = await getEnrollmentStatus(ctx.user.id, assessment.courseId);
      if (!enrollment) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in this course",
        });
      }

      return await getStudentAssessmentScore(ctx.user.id, input.assessmentId);
    }),
});
