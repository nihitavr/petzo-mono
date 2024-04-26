import { auth } from "@petzo/auth-customer-app";
import { CustomerUser, Review } from "@petzo/db";
import NotFound from "@petzo/ui/components/errors/not-found";

import { api } from "~/trpc/server";
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
    <div className="flex flex-col gap-5 pb-24 md:gap-8">
      {/* Center Image & Center Info */}
      <div className="flex grid-cols-10 flex-col gap-2 md:grid md:gap-5">
        {/* Center Images */}
        <div className="col-span-4 w-full">
          <ImagesCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-md border-none"
          />
        </div>

        {/* Center Info */}
        <CenterInfo
          className={`${!imageUrls.length ? "col-span-10" : "col-span-6"} h-min rounded-lg bg-primary/[7%] p-3`}
          center={center}
        />
      </div>

      <CenterServiceList center={center} />

      <CenterReviews
        currentUserReview={currentUserReview}
        reviews={reviews}
        user={session?.user as CustomerUser}
        center={center}
      />
    </div>
  );
}
