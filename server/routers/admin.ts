import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
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
      // TODO: Implement user listing from database
      return [];
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
      // TODO: Implement role update
      return { success: true };
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
      // TODO: Implement course unlock logic
      return { success: true };
    }),

  // Send payment reminder
  sendPaymentReminder: adminProcedure
    .input(
      z.object({
        installmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implement email sending
      return { success: true };
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
      // TODO: Implement Excel generation
      return {
        success: true,
        url: "/reports/sample.xlsx",
      };
    }),
});
