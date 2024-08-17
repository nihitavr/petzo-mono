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
      <h2 className="text-base font-semibold md:text-lg">
        Rating and Reviews
        {!!center.averageRating && <Rating rating={center.averageRating} />}
      </h2>

      <div className="flex flex-col gap-5">
        {user ? (
          <ReviewInput
            centerId={center.id}
            user={user}
            currentUserReview={currentUserReview}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 rounded-lg border py-3">
            <span className="px-5 text-center text-sm">
              Help your pet care provider{" "}
              <span className="font-semibold">grow</span>{" "}
            </span>
            <span className="px-5 text-center text-sm">
              Please Sign in to <span className="font-semibold">review</span>
            </span>
            <SignIn onClick={() => trackCustom("click_login_review")} />
          </div>
        )}

        {reviews?.map((review) => {
          return <ReviewDisplay key={review.id} review={review} />;
        })}
      </div>
    </div>
  );
}
