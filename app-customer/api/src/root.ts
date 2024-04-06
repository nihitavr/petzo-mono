import { authRouter } from "./router/auth";
import { centerRouter } from "./router/center";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  center: centerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
