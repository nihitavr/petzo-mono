import { authRouter } from "./router/auth";
import { bookingRouter } from "./router/booking.router";
import { centerAddressRouter } from "./router/center-address.router";
import { centerRouter } from "./router/center.router";
import { mapRouter } from "./router/map.router";
import { serviceRouter } from "./router/service.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  booking: bookingRouter,
  service: serviceRouter,
  center: centerRouter,
  centerAddress: centerAddressRouter,
  map: mapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
