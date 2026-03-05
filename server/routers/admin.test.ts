import { describe, it, expect, vi, beforeEach } from "vitest";
import { adminRouter } from "./admin";
import type { TrpcContext } from "../_core/context";

// Mock database functions
vi.mock("../db", () => ({
  getCourses: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Course",
      description: "Test Description",
      loadHours: 40,
      price: "99.99",
      minGrade: 70,
      professorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getCourseEnrollments: vi.fn().mockResolvedValue([
    {
      id: 1,
      studentId: 1,
      courseId: 1,
      enrolledAt: new Date(),
      completedAt: null,
    },
  ]),
  getPaymentsByStudent: vi.fn().mockResolvedValue([
    {
      id: 1,
      studentId: 1,
      courseId: 1,
      totalValue: "99.99",
      downPayment: "29.99",
      installmentCount: 3,
      paidInstallments: 1,
      status: "partial",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getOverdueInstallments: vi.fn().mockResolvedValue([
    {
      id: 1,
      paymentId: 1,
      installmentNumber: 2,
      value: "35.00",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      paidDate: null,
      status: "overdue",
      createdAt: new Date(),
    },
  ]),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@educadq.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createAdminContext();
  });

  it("should get dashboard statistics", async () => {
    const caller = adminRouter.createCaller(ctx);
    const stats = await caller.getStatistics();

    expect(stats).toHaveProperty("totalCourses");
    expect(stats).toHaveProperty("totalStudents");
    expect(stats).toHaveProperty("totalRevenue");
    expect(stats).toHaveProperty("overdueInstallments");
    expect(stats.totalCourses).toBeGreaterThanOrEqual(0);
    expect(stats.totalStudents).toBeGreaterThanOrEqual(0);
  });

  it("should get course enrollments report", async () => {
    const caller = adminRouter.createCaller(ctx);
    const report = await caller.getCourseEnrollmentsReport({ courseId: 1 });

    expect(report).toHaveProperty("courseId");
    expect(report).toHaveProperty("totalEnrollments");
    expect(report).toHaveProperty("enrollments");
    expect(report.courseId).toBe(1);
  });

  it("should get payment report", async () => {
    const caller = adminRouter.createCaller(ctx);
    const report = await caller.getPaymentReport();

    expect(report).toHaveProperty("totalOverdue");
    expect(report).toHaveProperty("overdueInstallments");
    expect(Array.isArray(report.overdueInstallments)).toBe(true);
  });

  it("should unlock course for student", async () => {
    const caller = adminRouter.createCaller(ctx);
    const result = await caller.unlockCourse({
      studentId: 1,
      courseId: 1,
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("should send payment reminder", async () => {
    const caller = adminRouter.createCaller(ctx);
    const result = await caller.sendPaymentReminder({
      installmentId: 1,
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("should generate Excel report", async () => {
    const caller = adminRouter.createCaller(ctx);
    const result = await caller.generateExcelReport({
      reportType: "courses",
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("url");
    expect(result.success).toBe(true);
  });
});
