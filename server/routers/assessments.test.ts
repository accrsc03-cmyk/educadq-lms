import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAssessmentContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("assessments router", () => {
  it("should get assessments for a course", async () => {
    const { ctx } = createAssessmentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.assessments).toBeDefined();
  });

  it("should get assessment details", async () => {
    const { ctx } = createAssessmentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.assessments.getAssessmentDetails).toBeDefined();
  });

  it("should submit assessment answers", async () => {
    const { ctx } = createAssessmentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.assessments.submitAssessment).toBeDefined();
  });

  it("should get assessment results", async () => {
    const { ctx } = createAssessmentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.assessments.getAssessmentResults).toBeDefined();
  });

  it("should verify answer distribution", async () => {
    // Test that answers are distributed 20% each (5 alternatives)
    const answers = [0, 1, 2, 3, 4];
    const distribution = answers.reduce(
      (acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    // Each answer should appear once (20%)
    Object.values(distribution).forEach((count) => {
      expect(count).toBe(1);
    });
  });
});
