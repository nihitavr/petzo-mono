"use client";

import type { Center, CustomerUser, Review } from "@petzo/db";

import SignIn from "~/app/_components/sign-in";
import { trackCustom } from "~/web-analytics/react";
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
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold md:text-lg">
          Rating and Reviews
        </h2>
        {!!center.averageRating && (
          <Rating
            rating={center.averageRating}
            ratingCount={center.ratingCount}
            googleRating={center.googleRating}
            googleRatingCount={center.googleRatingCount}
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        {user ? (
          <ReviewInput
            centerId={center.id}
            user={user}
            currentUserReview={currentUserReview}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 rounded-lg border py-3">
            <span className="px-2 text-center text-sm">
              Your feedback helps us improve.
            </span>
            <span className="px-5 text-center text-2sm">
              Please Signin to <span className="font-semibold">review</span>
            </span>
            <SignIn
              className="h-8 text-2sm"
              onClick={() => trackCustom("click_login_review")}
            />
          </div>
        )}

        {reviews?.map((review) => {
          return <ReviewDisplay key={review.id} review={review} />;
        })}
      </div>
    </div>
  );
}
