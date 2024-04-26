"use client";

import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function RatingInput({
  rating,
  setRating,
}: {
  rating?: number;
  setRating: (rating: number) => void;
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        if (
          (hoveredRating && star > hoveredRating) ||
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (!hoveredRating && rating && star > rating) ||
          (!hoveredRating && !rating && star > 0)
        ) {
          return (
            <FaRegStar
              key={star}
              className="h-5 w-5 cursor-pointer text-yellow-600"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          );
        } else {
          return (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="h-5 w-5 cursor-pointer text-yellow-600"
            />
          );
        }
      })}
    </div>
  );
}
