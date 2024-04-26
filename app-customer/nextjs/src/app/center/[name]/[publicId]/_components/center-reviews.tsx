"use client";

import type { Center, CustomerUser, Review } from "@petzo/db";

import Rating from "./rating-display";
import ReviewDisplay from "./review-display";
import ReviewInput from "./review-input";

export default function CenterReviews({
  currentUserReview,
  reviews,
  user,
  center,
}: {
  currentUserReview: Review | undefined;
  reviews: Review[];
  user: CustomerUser;
  center: Center;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        User Rating and Reviews
        <Rating rating={center.averageRating} />
      </h2>

      <h3 className="text-lg font-semibold">Reviews</h3>

      <div className="gap- flex flex-col gap-5">
        {user && (
          <ReviewInput
            centerId={center.id}
            user={user}
            currentUserReview={currentUserReview}
          />
        )}

        {reviews?.map((review) => {
          return <ReviewDisplay key={review.id} review={review} />;
        })}
      </div>
    </div>
  );
}
