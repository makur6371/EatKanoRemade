import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAllEvents,
  getEventsByYear,
  getEventById,
  getAllStatistics,
  getStatisticsByYear,
  getBulletCommentsByEvent,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  events: router({
    all: publicProcedure.query(async () => {
      return getAllEvents();
    }),
    byYear: publicProcedure.input(z.number()).query(async ({ input: year }) => {
      return getEventsByYear(year);
    }),
    byId: publicProcedure.input(z.number()).query(async ({ input: id }) => {
      return getEventById(id);
    }),
  }),

  statistics: router({
    all: publicProcedure.query(async () => {
      return getAllStatistics();
    }),
    byYear: publicProcedure.input(z.number()).query(async ({ input: year }) => {
      return getStatisticsByYear(year);
    }),
  }),

  bulletComments: router({
    byEvent: publicProcedure.input(z.number()).query(async ({ input: eventId }) => {
      return getBulletCommentsByEvent(eventId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
