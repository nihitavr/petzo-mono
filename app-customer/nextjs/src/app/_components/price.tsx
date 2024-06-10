"use client";

import { cn } from "@petzo/ui/lib/utils";

import { getCommaPrice, getDiscountedPrice } from "~/lib/utils/price.utils";

export default function Price({
  className,
  price,
  discount,
}: {
  className?: string;
  price: number;
  discount?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "whitespace-nowrap",
          discount ? "line-through" : "",
          className,
        )}
      >
        &#8377; {getCommaPrice(price)}
      </span>
      {!!discount && (
        <span className={cn("font-semibold", className)}>
          &#8377; {getCommaPrice(getDiscountedPrice(price, discount))}
        </span>
      )}
    </div>
  );
}
