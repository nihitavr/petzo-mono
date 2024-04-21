import { authRouter } from "./router/auth.router";
import { centerRouter } from "./router/center.router";
import { cityRouter } from "./router/city.router";
import { petMedicalRecordRouter } from "./router/pet-medical-record.router";
import { petRouter } from "./router/pet.router";
import { serviceRouter } from "./router/service.router";
import { userRouter } from "./router/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  center: centerRouter,
  service: serviceRouter,
  city: cityRouter,
  user: userRouter,
  pet: petRouter,
  petMedicalRecord: petMedicalRecordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
