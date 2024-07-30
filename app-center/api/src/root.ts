import { authRouter } from "./router/auth";
import { bookingRouter } from "./router/booking.router";
import { centerRouter } from "./router/center.router";
import { serviceRouter } from "./router/service.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  booking: bookingRouter,
  service: serviceRouter,
  center: centerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
