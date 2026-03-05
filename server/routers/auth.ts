import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getUserById, updateUserRole } from "../db";
import { z } from "zod";

export const authRouter = router({
  /**
   * Get current user
   */
  me: publicProcedure.query(({ ctx }) => ctx.user),

  /**
   * Get user by ID (admin only)
   */
  getUserById: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view user details",
        });
      }

      const user = await getUserById(input.userId);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  /**
   * Update user role (admin only)
   */
  updateUserRole: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["admin", "professor", "user"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update user roles",
        });
      }

      const updated = await updateUserRole(input.userId, input.role);
      return updated;
    }),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const { getSessionCookieOptions } = require("../_core/cookies");
    const { COOKIE_NAME } = require("../../shared/const");

    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });

    return { success: true };
  }),
});
