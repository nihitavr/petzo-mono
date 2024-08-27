"use client";

import { cn } from "@petzo/ui/lib/utils";
import { priceUtils } from "@petzo/utils";

export default function Price({
  className,
  price,
  discountedPrice,
}: {
  className?: string;
  price: number;
  discountedPrice?: number;
}) {
  const hasDiscount = discountedPrice && discountedPrice != price;

  return (
    <div className={cn("flex items-center gap-1 whitespace-nowrap", className)}>
      {hasDiscount && (
        <span className={cn("font-semibold", className)}>
          &#8377; {priceUtils.getCommaPrice(discountedPrice)}
        </span>
      )}
      <span
        className={cn(
          "whitespace-nowrap font-semibold",
          className,
          hasDiscount ? "scale-90 font-normal line-through opacity-80" : "",
        )}
      >
        &#8377; {priceUtils.getCommaPrice(price)}
      </span>
    </div>
  );
}
