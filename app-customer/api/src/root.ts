import { authRouter } from "./router/auth.router";
import { centerRouter } from "./router/center.router";
import { customerAddressRouter } from "./router/customer-address.router";
import { geographyRouter } from "./router/geography.router";
import { mapRouter } from "./router/map.router";
import { petMedicalRecordRouter } from "./router/pet-medical-record.router";
import { petRouter } from "./router/pet.router";
import { ratingsRouter } from "./router/rating.router";
import { reviewsRouter } from "./router/reviews.router";
import { serviceRouter } from "./router/service.router";
import { slotRouter } from "./router/slot.router";
import { userRouter } from "./router/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  center: centerRouter,
  service: serviceRouter,
  geography: geographyRouter,
  map: mapRouter,
  user: userRouter,
  pet: petRouter,
  petMedicalRecord: petMedicalRecordRouter,
  reviews: reviewsRouter,
  ratings: ratingsRouter,
  customerAddress: customerAddressRouter,
  slot: slotRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
