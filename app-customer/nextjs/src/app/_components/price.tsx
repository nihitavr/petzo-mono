"use client";

import { cn } from "@petzo/ui/lib/utils";

import { getDiscountedPrice } from "../../lib/utils";

export default function Price({
  className,
  price,
  discount,
  animate,
}: {
  className?: string;
  price: number;
  discount: number;
  animate?: boolean;
}) {
  return (
    <div
      className={cn("flex items-center gap-3 text-foreground/90", className)}
    >
      <OriginalPrice price={price} />
      <DiscountedPrice
        price={price}
        discount={discount}
        className={animate ? "opacity-0" : ""}
      />
    </div>
  );
}

const OriginalPrice = ({
  price,
  className,
}: {
  price: number;
  className?: string;
}) => {
  return <span className={cn("line-through", className)}>&#8377; {price}</span>;
};

const DiscountedPrice = ({
  price,
  discount,
  className,
}: {
  price: number;
  discount: number;
  className?: string;
}) => {
  return (
    <span className={cn("font-semibold text-primary", className)}>
      &#8377; {getDiscountedPrice(price, discount)}
    </span>
  );
};
