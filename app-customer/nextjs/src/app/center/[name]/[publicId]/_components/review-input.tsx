"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsPersonFill } from "react-icons/bs";

import type { CustomerUser, Rating, Review } from "@petzo/db";
import { Avatar, AvatarFallback } from "@petzo/ui/components/avatar";
import { Button } from "@petzo/ui/components/button";
import Loader from "@petzo/ui/components/loader";
import { Textarea } from "@petzo/ui/components/textarea";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { api } from "~/trpc/react";
import RatingInput from "./rating-input";
import ReviewDisplay from "./review-display";

export default function ReviewInput({
  centerId,
  user,
  currentUserReview,
  className,
}: {
  centerId: number;
  user: CustomerUser;
  currentUserReview: Review | undefined;
  className?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(!currentUserReview);

  const [rating, setRating] = useState(currentUserReview?.rating?.rating ?? 0);

  const [input, setInput] = useState(currentUserReview?.text ?? "");
  const [currentUserReviewState, setCurrentUserReview] = useState<
    Review | undefined
  >(currentUserReview);

  const image = user?.image;
  const fallbackLetter = user?.name![0];

  const reviewMutation = api.reviews.upsertReview.useMutation();
  const ratingMutation = api.ratings.upsertRating.useMutation();

  const onSuccess = ({
    review,
    rating,
  }: {
    review?: Review;
    rating?: Rating;
  }) => {
    let data: { review?: Review; rating?: Rating; user: CustomerUser } = {
      user,
    };

    if (review) {
      data = { ...data, ...review };
      setInput(review.text ?? "");
      toast.success("Review submitted successfully.");
      router.refresh();
    }

    if (rating) {
      data.rating = rating;
      toast.success("Rating submitted successfully.");
      router.refresh();
    }

    setCurrentUserReview((currentUserReview) => {
      let tempCurrentUserReview = currentUserReview ?? {};

      tempCurrentUserReview = {
        ...tempCurrentUserReview,
        ...data,
      };

      return tempCurrentUserReview as Review;
    });

    setIsSubmitting(false);
    setIsEditing(false);
    setIsFocused(false);
  };

  const onError = (errorType: "rating" | "review") => {
    toast.error(`Failed to submit ${errorType}.`);
    setIsSubmitting(false);
  };

  const onClickSubmit = () => {
    if (!rating) {
      toast.error("Rating is required");
      return;
    }

    if (rating !== currentUserReviewState?.rating?.rating) {
      setIsSubmitting(true);
      ratingMutation.mutate(
        { centerId, rating },
        {
          onSuccess: (data) => onSuccess({ rating: data }),
          onError: () => onError("rating"),
        },
      );
    }

    if (input && input.trim() !== currentUserReviewState?.text) {
      setIsSubmitting(true);
      reviewMutation.mutate(
        { centerId, reviewText: input.trim() },
        {
          onSuccess: (data) => onSuccess({ review: data }),
          onError: () => onError("review"),
        },
      );
    }
  };

  return !currentUserReviewState?.rating ||
    !currentUserReviewState?.text ||
    isEditing ? (
    <div className={cn("flex w-full items-start gap-3", className)}>
      <Avatar className="size-8 cursor-pointer hover:opacity-90">
        {image ? (
          <Image src={image} alt="Avatar" width={50} height={50} />
        ) : (
          <AvatarFallback className="">
            {fallbackLetter ?? (
              <BsPersonFill className="size-7 text-foreground/70" />
            )}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{user.name}</span>
          <div className="flex items-center">
            <RatingInput rating={rating} setRating={setRating} />
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Add a review..."
          className="min-h-48 w-full md:min-h-36"
        />

        {(isFocused ||
          input ||
          rating !== currentUserReview?.rating?.rating ||
          rating != 0) && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              disabled={isSubmitting}
              onClick={() => {
                setIsFocused(false);
                setRating(currentUserReview?.rating?.rating ?? 0);
                setInput(currentUserReview?.text ?? "");
                setIsEditing(false);
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              disabled={
                (rating === currentUserReviewState?.rating?.rating &&
                  currentUserReviewState?.text === input) ||
                isSubmitting
              }
              onClick={() => onClickSubmit()}
              size="sm"
              className=""
            >
              <span>Submit</span>
              <Loader className="ml-1.5 h-4 w-4 border-2" show={isSubmitting} />
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <ReviewDisplay
      review={currentUserReviewState}
      showEditButton={true}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
}
