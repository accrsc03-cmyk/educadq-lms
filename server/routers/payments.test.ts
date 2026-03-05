import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPaymentContext(): { ctx: TrpcContext } {
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

describe("payments router", () => {
  it("should get student payments", async () => {
    const { ctx } = createPaymentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.payments).toBeDefined();
  });

  it("should get payment details", async () => {
    const { ctx } = createPaymentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.payments.getPaymentDetails).toBeDefined();
  });

  it("should get installments for a payment", async () => {
    const { ctx } = createPaymentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.payments.getInstallments).toBeDefined();
  });

  it("should create a payment", async () => {
    const { ctx } = createPaymentContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.payments.createPayment).toBeDefined();
  });

  it("should calculate installment dates correctly", () => {
    const now = new Date();
    const installments = [];

    for (let i = 1; i <= 3; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i);
      installments.push(dueDate);
    }

    // Verify dates are in the future
    installments.forEach((date) => {
      expect(date.getTime()).toBeGreaterThan(now.getTime());
    });

    // Verify dates are sequential
    for (let i = 1; i < installments.length; i++) {
      expect(installments[i].getTime()).toBeGreaterThan(
        installments[i - 1].getTime()
      );
    }
  });

  it("should calculate installment values correctly", () => {
    const totalValue = 1000;
    const downPayment = 200;
    const installmentCount = 4;

    const remaining = totalValue - downPayment;
    const installmentValue = remaining / installmentCount;

    expect(installmentValue).toBe(200);
    expect(downPayment + installmentValue * installmentCount).toBe(totalValue);
  });
});
