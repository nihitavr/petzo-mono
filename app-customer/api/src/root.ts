import { authRouter } from "./router/auth";
import { centerRouter } from "./router/center";
import { cityRouter } from "./router/city";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  center: centerRouter,
  city: cityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
