import { authRouter } from "./router/auth.router";
import { centerRouter } from "./router/center.router";
import { cityRouter } from "./router/city.router";
import { postRouter } from "./router/post.router";
import { serviceRouter } from "./router/service.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  center: centerRouter,
  service: serviceRouter,
  city: cityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
