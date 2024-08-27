export function getDiscountedPrice(
  price: number,
  {
    discountAmount,
    discountPercentage,
  }: { discountAmount?: number; discountPercentage?: number },
) {
  if (discountAmount) {
    return price - discountAmount;
  } else if (discountPercentage) {
    return Math.round((price * (100 - discountPercentage)) / 100);
  }
  return price;
}

export function getCommaPrice(price: number) {
  return price.toLocaleString("en-IN");
}
