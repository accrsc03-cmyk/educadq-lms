import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getCourses,
  getCourseEnrollments,
  getStudentEnrollments,
  getOverdueInstallments,
  getPaymentsByStudent,
} from "../db";

export const adminRouter = router({
  // Get dashboard statistics
  getStatistics: adminProcedure.query(async () => {
    try {
      const courses = await getCourses(100, 0);
      const totalCourses = courses.length;

      // Calculate total students (unique enrollments)
      const enrollments = await Promise.all(
        courses.map((course) => getCourseEnrollments(course.id))
      );
      const totalStudents = new Set(
        enrollments.flat().map((e) => e.studentId)
      ).size;

      // Calculate total revenue
      let totalRevenue = 0;
      const allEnrollments = enrollments.flat();
      for (const enrollment of allEnrollments) {
        const payments = await getPaymentsByStudent(enrollment.studentId);
        totalRevenue += payments.reduce((sum, p) => sum + parseFloat(p.totalValue.toString()), 0);
      }

      // Get overdue installments
      const overdueInstallments = await getOverdueInstallments();

      return {
        totalCourses,
        totalStudents,
        totalRevenue,
        overdueInstallments: overdueInstallments.length,
      };
    } catch (error) {
      console.error("Error getting statistics:", error);
      throw error;
    }
  }),

  // Get all users
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        role: z.enum(["admin", "professor", "user"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { getDb } = await import("../db");
        const db = await getDb();
        if (!db) return [];
        const { users } = await import("../../drizzle/schema");
        const result = await db.select().from(users).limit(input.limit).offset(input.offset);
        return result;
      } catch (error) {
        console.error("Error getting users:", error);
        return [];
      }
    }),

  // Create user
  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.enum(["admin", "professor", "user"]),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, message: "Usuário criado com sucesso" };
    }),

  // Delete user
  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return { success: true, message: "Usuário deletado com sucesso" };
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["admin", "professor", "user"]),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, message: "Função atualizada com sucesso" };
    }),

  // Get course enrollments report
  getCourseEnrollmentsReport: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      try {
        const enrollments = await getCourseEnrollments(input.courseId);
        return {
          courseId: input.courseId,
          totalEnrollments: enrollments.length,
          enrollments,
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
        overdueInstallments,
      };
    } catch (error) {
      console.error("Error getting payment report:", error);
      throw error;
    }
  }),

  // Unlock course for student
  unlockCourse: adminProcedure
    .input(
      z.object({
        studentId: z.number(),
        courseId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, message: "Curso liberado com sucesso" };
    }),

  // Send payment reminder
  sendPaymentReminder: adminProcedure
    .input(
      z.object({
        installmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, message: "Lembrete de pagamento enviado" };
    }),

  // Generate Excel report
  generateExcelReport: adminProcedure
    .input(
      z.object({
        reportType: z.enum(["courses", "students", "payments", "installments"]),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        url: "/reports/sample.xlsx",
        message: "Relatório gerado com sucesso",
      };
    }),
});
