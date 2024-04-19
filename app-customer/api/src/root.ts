import { authRouter } from "./router/auth.router";
import { centerRouter } from "./router/center.router";
import { cityRouter } from "./router/city.router";
import { petRouter } from "./router/pet.router";
import { postRouter } from "./router/post.router";
import { serviceRouter } from "./router/service.router";
import { userRouter } from "./router/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  center: centerRouter,
  service: serviceRouter,
  city: cityRouter,
  user: userRouter,
  pet: petRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
