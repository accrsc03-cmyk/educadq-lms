import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createPayment,
  getPaymentsByStudent,
  getPaymentById,
  createInstallment,
  getInstallmentsByPayment,
  getOverdueInstallments,
  getCourseById,
  getEnrollmentStatus,
} from "../db";
import { z } from "zod";

export const paymentsRouter = router({
  /**
   * Create payment with installments
   */
  createPayment: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        totalValue: z.string(),
        downPayment: z.string(),
        installmentCount: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const course = await getCourseById(input.courseId);
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (input.installmentCount > course.maxInstallments) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Maximum installments for this course is ${course.maxInstallments}`,
        });
      }

      // Create payment
      const paymentResult = await createPayment({
        studentId: ctx.user.id,
        courseId: input.courseId,
        totalValue: input.totalValue,
        downPayment: input.downPayment,
        installmentCount: input.installmentCount,
      });

      if (!paymentResult) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment",
        });
      }

      // Calculate installment value
      const total = parseFloat(input.totalValue);
      const down = parseFloat(input.downPayment);
      const remaining = total - down;
      const installmentValue = (remaining / input.installmentCount).toFixed(2);

      // Create installments
      // Note: In a real implementation, you would get the payment ID from the database
      // For now, we'll assume the payment was created successfully
      const now = new Date();
      for (let i = 1; i <= input.installmentCount; i++) {
        const dueDate = new Date(now);
        dueDate.setMonth(dueDate.getMonth() + i);

        // TODO: Get actual payment ID from database
        // await createInstallment({
        //   paymentId: paymentId,
        //   installmentNumber: i,
        //   value: installmentValue,
        //   dueDate,
        // });
      }

      return paymentResult;
    }),

  /**
   * Get student payments
   */
  getStudentPayments: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    }

    return await getPaymentsByStudent(ctx.user.id);
  }),

  /**
   * Get payment details
   */
  getPaymentDetails: protectedProcedure
    .input(z.object({ paymentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const payment = await getPaymentById(input.paymentId);
      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      }

      if (ctx.user.role !== "admin" && ctx.user.id !== payment.studentId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this payment",
        });
      }

      const installments = await getInstallmentsByPayment(input.paymentId);
      return { ...payment, installments };
    }),

  /**
   * Get overdue installments (admin only)
   */
  getOverdueInstallments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view overdue installments",
      });
    }

    return await getOverdueInstallments();
  }),

  /**
   * Get installments by payment
   */
  getInstallments: protectedProcedure
    .input(z.object({ paymentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

      const payment = await getPaymentById(input.paymentId);
      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      }

      if (ctx.user.role !== "admin" && ctx.user.id !== payment.studentId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view these installments",
        });
      }

      return await getInstallmentsByPayment(input.paymentId);
    }),
});
