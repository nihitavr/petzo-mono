export function getDiscountedPrice(price: number, discount: number) {
  return Math.round((price * (100 - discount)) / 100);
}

export function getCommaPrice(price: number) {
  return price.toLocaleString("en-IN");
}
