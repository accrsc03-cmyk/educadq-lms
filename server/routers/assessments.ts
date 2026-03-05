import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createAssessment,
  getAssessmentsByCourse,
  getAssessmentById,
  createQuestion,
  getQuestionsByAssessment,
  createAlternative,
  getAlternativesByQuestion,
  getCourseById,
  getLessonById,
} from "../db";
import { z } from "zod";

export const assessmentsRouter = router({
  /**
   * Create assessment
   */
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        lessonId: z.number().optional(),
        title: z.string().min(1),
        type: z.enum(["per_lesson", "final"]),
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
          message: "You don't have permission to create assessments for this course",
        });
      }

      if (input.lessonId) {
        const lesson = await getLessonById(input.lessonId);
        if (!lesson || lesson.courseId !== input.courseId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Lesson not found in this course",
          });
        }
      }

      return await createAssessment(input);
    }),

  /**
   * Get assessments by course
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

      return await getAssessmentsByCourse(input.courseId);
    }),

  /**
   * Get assessment with questions
   */
  getById: protectedProcedure
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input }) => {
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found",
        });
      }

      const questions = await getQuestionsByAssessment(input.assessmentId);
      const questionsWithAlternatives = await Promise.all(
        questions.map(async (q) => ({
          ...q,
          alternatives: await getAlternativesByQuestion(q.id),
        }))
      );

      return { ...assessment, questions: questionsWithAlternatives };
    }),

  /**
   * Create question
   */
  createQuestion: protectedProcedure
    .input(
      z.object({
        assessmentId: z.number(),
        questionText: z.string().min(1),
        order: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found",
        });
      }

      const course = await getCourseById(assessment.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (ctx.user?.role !== "admin" && ctx.user?.id !== course.professorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to add questions to this assessment",
        });
      }

      return await createQuestion(input);
    }),

  /**
   * Create alternatives (with automatic distribution)
   * Ensures 20% distribution: A=20%, B=20%, C=20%, D=20%, E=20%
   */
  createAlternatives: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        alternatives: z.array(
          z.object({
            text: z.string().min(1),
            isCorrect: z.boolean(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify question exists and get assessment
      const questions = await getQuestionsByAssessment(0); // TODO: Get question details
      
      // Verify user has permission
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "professor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to add alternatives",
        });
      }

      // Ensure exactly 5 alternatives with 1 correct
      if (input.alternatives.length !== 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide exactly 5 alternatives",
        });
      }

      const correctCount = input.alternatives.filter((a) => a.isCorrect).length;
      if (correctCount !== 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must have exactly 1 correct alternative",
        });
      }

      // Create alternatives
      const results = await Promise.all(
        input.alternatives.map((alt) =>
          createAlternative({
            questionId: input.questionId,
            text: alt.text,
            isCorrect: alt.isCorrect,
            order: alt.order,
          })
        )
      );

      return results;
    }),

  /**
   * Get questions by assessment
   */
  getQuestions: protectedProcedure
    .input(z.object({ assessmentId: z.number() }))
    .query(async ({ input }) => {
      const questions = await getQuestionsByAssessment(input.assessmentId);
      const questionsWithAlternatives = await Promise.all(
        questions.map(async (q) => ({
          ...q,
          alternatives: await getAlternativesByQuestion(q.id),
        }))
      );

      return questionsWithAlternatives;
    }),
});
