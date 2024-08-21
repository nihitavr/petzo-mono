import { useState } from "react";
import Image from "next/image";
import { BsPersonFill } from "react-icons/bs";

import type { Review } from "@petzo/db";
import { AspectRatio } from "@petzo/ui/components/aspect-ratio";
import { Avatar, AvatarFallback } from "@petzo/ui/components/avatar";
import { Button } from "@petzo/ui/components/button";

import { trackCustom } from "~/web-analytics/react";
import Rating from "./rating-display";
import { ReviewDetailsModal } from "./review-images-modal";

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
  const [openReview, setOpenReview] = useState(false);
  const [reviewImageStartIndex, setReviewImageStartIndex] = useState<number>(0);

  const image = review.user!.image;
  const fallbackLetter = review.user!.name![0];

  return (
    !isEditing && (
      <div className="flex w-full items-start gap-3">
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
        <div className="flex w-full flex-col gap-1">
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
          {!!review.images?.length && (
            <div className="grid w-full grid-cols-12 gap-2">
              {[...review.images].map((image, idx) => (
                <div
                  key={`${review.id}-image-${idx}`}
                  className="col-span-3 w-full md:col-span-1"
                >
                  <AspectRatio
                    className="overflow-hidden rounded-lg border bg-black hover:cursor-pointer hover:opacity-90"
                    ratio={1}
                  >
                    <Image
                      onClick={() => {
                        setOpenReview(true);
                        setReviewImageStartIndex(idx);
                        trackCustom("click_view_review_image", {
                          reviewId: review.id,
                        });
                      }}
                      src={image.url}
                      alt="Review Image"
                      fill
                    />
                  </AspectRatio>
                </div>
              ))}

              <ReviewDetailsModal
                review={review}
                startIndex={reviewImageStartIndex}
                open={openReview}
                setOpen={setOpenReview}
              />
            </div>
          )}
          <span className="whitespace-pre-wrap text-2sm md:text-sm">
            {review.text}
          </span>
        </div>
      </div>
    )
  );
}

// function ReviewCard({
//   review,
//   showEditButton = false,
//   isEditing = false,
//   setIsEditing,
// }: {
//   review: Review;
//   showEditButton?: boolean;
//   isEditing?: boolean;
//   setIsEditing?: (value: boolean) => void;
// }) {
//   const image = review.user!.image;
//   const fallbackLetter = review.user!.name![0];

//   return (
//     !isEditing && (
//       <div className="flex items-start gap-3 ">
//         <Avatar className="cursor-pointer hover:opacity-90">
//           {image ? (
//             <Image src={image} alt="Avatar" width={50} height={50} />
//           ) : (
//             <AvatarFallback className="">
//               {fallbackLetter ?? (
//                 <BsPersonFill className="size-7 text-foreground/70" />
//               )}
//             </AvatarFallback>
//           )}
//         </Avatar>
//         <div className="flex flex-col gap-1">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-semibold">{review.user!.name}</span>
//               <div className="flex items-center">
//                 <Rating rating={review.rating!.rating} withValue={false} />
//               </div>
//             </div>
//             {showEditButton && setIsEditing && (
//               <div className="flex items-center justify-end">
//                 <Button
//                   onClick={() => setIsEditing(true)}
//                   variant="outline"
//                   size="sm"
//                   className="h-6"
//                 >
//                   Edit
//                 </Button>
//               </div>
//             )}
//           </div>
//           <span className="whitespace-pre-wrap text-sm">{review.text}</span>
//         </div>
//       </div>
//     )
//   );
// }
