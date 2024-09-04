import type { CustomerUser, Review } from "@petzo/db";
import { auth } from "@petzo/auth-customer-app";
import NotFound from "@petzo/ui/components/errors/not-found";
import ScrollToTop from "@petzo/ui/components/scroll-to-top";

import { api } from "~/trpc/server";
import CenterCTAButtons from "./center-cta-buttons";
import { CenterInfo } from "./center-info";
import CenterReviews from "./center-reviews";
import CenterServiceList from "./center-service-list";
import ImagesCasousel from "./images-carousel";

export default async function CenterPage({ publicId }: { publicId: string }) {
  const session = await auth();

  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) return <NotFound />;

  let reviews = await api.reviews.getReviews({
    centerId: center.id,
  });

  let currentUserReview: Review | undefined;

  if (session?.user) {
    currentUserReview = await api.reviews.getCurrentUserReview({
      centerId: center.id,
    });

    if (currentUserReview) {
      reviews = reviews.filter((review) => review.id !== currentUserReview?.id);
    }
  }

  const imageUrls = center.images?.map((img) => img.url) ?? [];

  return (
    <div className="flex animate-fade-in flex-col gap-5 md:gap-8">
      <ScrollToTop />
      {/* Center Image & Center Info */}
      <div className="flex grid-cols-10 flex-col gap-2 md:grid md:gap-5">
        {/* Center Images */}
        <div className="col-span-4 w-full">
          <ImagesCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-xl border-none"
          />
        </div>

        {/* Center Info */}
        <div
          className={`${!imageUrls.length ? "col-span-10" : "col-span-6"} space-y-2`}
        >
          <CenterInfo
            className={`h-min rounded-xl border bg-muted px-2.5 py-2`}
            center={center}
          />
          {!!center.ctaButtons?.length && <CenterCTAButtons center={center} />}
        </div>
      </div>

      <CenterServiceList center={center} user={session?.user as CustomerUser} />

      <CenterReviews
        currentUserReview={currentUserReview}
        reviews={reviews}
        user={session?.user as CustomerUser}
        center={center}
      />
    </div>
  );
}
