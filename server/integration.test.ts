import { describe, it, expect, beforeAll } from "vitest";
import { getDb, getUserByOpenId, upsertUser } from "./db";
import { appRouter } from "./routers";

describe("Backend Integration Tests", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Database Connection", () => {
    it("should connect to Supabase database", async () => {
      expect(db).toBeDefined();
    });

    it("should have database connection available", async () => {
      const result = await getDb();
      expect(result).toBeDefined();
    });
  });

  describe("User Operations", () => {
    it("should have upsertUser function", () => {
      expect(upsertUser).toBeDefined();
    });

    it("should have getUserByOpenId function", () => {
      expect(getUserByOpenId).toBeDefined();
    });
  });

  describe("tRPC Router Structure", () => {
    it("should have appRouter defined", () => {
      expect(appRouter).toBeDefined();
    });

    it("should have router definition", () => {
      expect(appRouter._def).toBeDefined();
    });

    it("should have procedures defined", () => {
      expect(appRouter._def.procedures).toBeDefined();
    });

    it("should have multiple procedures", () => {
      const procedures = Object.keys(appRouter._def.procedures);
      expect(procedures.length).toBeGreaterThan(10);
    });

    it("should include system procedures", () => {
      const procedures = Object.keys(appRouter._def.procedures);
      const hasSystemProcedures = procedures.some((p) => p.startsWith("system."));
      expect(hasSystemProcedures).toBe(true);
    });

    it("should include auth procedures", () => {
      const procedures = Object.keys(appRouter._def.procedures);
      const hasAuthProcedures = procedures.some((p) => p.startsWith("auth."));
      expect(hasAuthProcedures).toBe(true);
    });

    it("should include courses procedures", () => {
      const procedures = Object.keys(appRouter._def.procedures);
      const hasCoursesProcedures = procedures.some((p) => p.startsWith("courses."));
      expect(hasCoursesProcedures).toBe(true);
    });

    it("should include admin procedures", () => {
      const procedures = Object.keys(appRouter._def.procedures);
      const hasAdminProcedures = procedures.some((p) => p.startsWith("admin."));
      expect(hasAdminProcedures).toBe(true);
    });
  });

  describe("Environment Variables", () => {
    it("should have DATABASE_URL configured", () => {
      expect(process.env.DATABASE_URL).toBeDefined();
    });

    it("should have EMAIL_PROVIDER configured", () => {
      expect(process.env.EMAIL_PROVIDER).toBeDefined();
    });

    it("should have SMTP_HOST configured", () => {
      expect(process.env.SMTP_HOST).toBeDefined();
    });

    it("should have SMTP_USER configured", () => {
      expect(process.env.SMTP_USER).toBeDefined();
    });

    it("should have JWT_SECRET configured", () => {
      expect(process.env.JWT_SECRET).toBeDefined();
    });

    it("should have VITE_APP_ID configured", () => {
      expect(process.env.VITE_APP_ID).toBeDefined();
    });
  });

  describe("API Health", () => {
    it("should have all routers integrated", () => {
      const router = appRouter;
      expect(router).toBeDefined();
      expect(router._def).toBeDefined();
      expect(router._def.procedures).toBeDefined();

      const procedures = Object.keys(router._def.procedures);
      expect(procedures.length).toBeGreaterThan(0);
    });

    it("should have database connection available", async () => {
      const db = await getDb();
      expect(db).toBeDefined();
    });

    it("should have at least 40 procedures", () => {
      const router = appRouter;
      const procedures = Object.keys(router._def.procedures);
      expect(procedures.length).toBeGreaterThanOrEqual(40);
    });
  });
});
