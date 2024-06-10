import Image from "next/image";
import { BsPersonFill } from "react-icons/bs";

import type { Review } from "@petzo/db";
import { Avatar, AvatarFallback } from "@petzo/ui/components/avatar";
import { Button } from "@petzo/ui/components/button";

import Rating from "./rating-display";

export default function ReviewDisplay({
  review,
  showEditButton = false,
  isEditing = false,
  setIsEditing,
}: {
  review: Review;
  showEditButton?: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}) {
  const image = review.user!.image;
  const fallbackLetter = review.user!.name![0];

  return (
    !isEditing && (
      <div className="flex items-start gap-3 ">
        <Avatar className="cursor-pointer hover:opacity-90">
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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{review.user!.name}</span>
              <div className="flex items-center">
                <Rating rating={review.rating!.rating} withValue={false} />
              </div>
            </div>
            {showEditButton && setIsEditing && (
              <div className="flex items-center justify-end">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <span className="text-2sm whitespace-pre-wrap md:text-sm">
            {review.text}
          </span>
        </div>
      </div>
    )
  );
}

function ReviewCard({
  review,
  showEditButton = false,
  isEditing = false,
  setIsEditing,
}: {
  review: Review;
  showEditButton?: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}) {
  const image = review.user!.image;
  const fallbackLetter = review.user!.name![0];

  return (
    !isEditing && (
      <div className="flex items-start gap-3 ">
        <Avatar className="cursor-pointer hover:opacity-90">
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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{review.user!.name}</span>
              <div className="flex items-center">
                <Rating rating={review.rating!.rating} withValue={false} />
              </div>
            </div>
            {showEditButton && setIsEditing && (
              <div className="flex items-center justify-end">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <span className="whitespace-pre-wrap text-sm">{review.text}</span>
        </div>
      </div>
    )
  );
}
