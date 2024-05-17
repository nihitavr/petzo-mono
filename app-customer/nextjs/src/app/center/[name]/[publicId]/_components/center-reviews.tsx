"use client";

import type { Center, CustomerUser, Review } from "@petzo/db";

import SignIn from "~/app/_components/sign-in";
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
    <div id={"reviews"} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        User Rating and Reviews
        <div className="flex items-center gap-1 text-base">
          <Rating rating={center.averageRating} />
          <span className="line-clamp-1 text-sm font-semibold">
            (Google Rating)
          </span>
        </div>
      </h2>

      <h3 className="text-lg font-semibold">Reviews</h3>

      <div className="flex flex-col gap-5">
        {user ? (
          <ReviewInput
            centerId={center.id}
            user={user}
            currentUserReview={currentUserReview}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 py-3">
            <span>Sign in to leave a review</span>
            <SignIn />
          </div>
        )}

        {reviews?.map((review) => {
          return <ReviewDisplay key={review.id} review={review} />;
        })}
      </div>
    </div>
  );
}
