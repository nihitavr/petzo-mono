"use client";

import { effect, signal } from "@preact/signals-react";

import type { Center, Pet, Service, Slot } from "@petzo/db";

export const dynamic = "force-dynamic";

export interface ServicesCart {
  center: Center;
  items: ServiceCartItem[];
}

export interface ServiceCartItem {
  service: Service;
  slot: Slot;
  pet: Pet;
}

export const servicesCart = signal(getServicesCart());

effect(() => {
  if (typeof localStorage === "undefined") return;

  localStorage?.setItem("servicesCart", JSON.stringify(servicesCart.value));
});

function getServicesCart(): ServicesCart {
  if (typeof localStorage === "undefined") return {} as ServicesCart;
  // const cart = localStorage?.getItem("servicesCart") ?? {};

  return JSON.parse(
    localStorage?.getItem("servicesCart") ?? "{}",
  ) as ServicesCart;
}

export function addItemToServicesCart(
  itemInfo: ServicesCart,
): "error" | undefined {
  if (
    servicesCart.value?.center?.id &&
    servicesCart.value.center.id !== itemInfo.center.id
  ) {
    return "error";
  }

  let servicesCartData = servicesCart.value;

  if (!servicesCartData?.center) {
    servicesCartData = itemInfo;
  } else {
    servicesCartData.items.push(...itemInfo.items);
  }

  servicesCart.value = JSON.parse(
    JSON.stringify(servicesCartData),
  ) as ServicesCart;
}

export function removeItemFromServicesCart(itemIdx: number) {
  const cart = servicesCart.value;

  cart.items = cart.items.filter((_, idx) => itemIdx !== idx);

  servicesCart.value = JSON.parse(JSON.stringify(cart)) as ServicesCart;
}