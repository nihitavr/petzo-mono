"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { format, parse } from "date-fns";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@petzo/ui/components/accordion";
import { Label } from "@petzo/ui/components/label";
import { Skeleton } from "@petzo/ui/components/skeleton";
import { cn } from "@petzo/ui/lib/utils";

import type { ServiceCartItem } from "~/lib/storage/service-cart-storage";
import Price from "~/app/_components/price";
import NewAddessModal from "~/app/center/[name]/[publicId]/_components/add-address-modal";
import {
  clearServicesCart,
  removeItemFromServicesCart,
  servicesCart,
  setAddressToServiceCart,
} from "~/lib/storage/service-cart-storage";
import { getCenterUrl } from "~/lib/utils/center.utils";
import { api } from "~/trpc/react";
import BookServicesButton from "./book-services-button";

export default function ServicesCheckoutPage() {
  useSignals();
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isBookingComplete) {
      setTimeout(() => {
        router.push("/");

        setTimeout(() => {
          clearServicesCart();
        }, 500);
      }, 2000);
    }
  }, [isBookingComplete]);

  if (!isLoaded) return null;

  if (isBookingComplete) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-1">
        <h1 className="text-2xl font-bold text-primary">Booking Complete!</h1>
        <h2 className="text-xl font-semibold">
          at {servicesCart.value?.center?.name}
        </h2>
      </div>
    );
  }

  const centerImage = servicesCart.value?.center.images?.[0]?.url;

  return (
    <div className="flex flex-col gap-6 pb-2">
      <div>
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">Cart</h1>
        </div>
        <div className="mt-1 rounded-xl bg-muted p-2 py-4 pt-1.5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs text-foreground/80">Center</Label>
              <Link
                href={getCenterUrl(servicesCart.value?.center)}
                className="flex cursor-pointer flex-nowrap items-center gap-1 hover:opacity-80"
              >
                <FaArrowLeft className="size-3.5" />
                <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
                  {servicesCart.value?.center?.name}
                </h3>
              </Link>
            </div>
            {centerImage && (
              <Link
                href={getCenterUrl(servicesCart.value?.center)}
                className="relative aspect-square h-10 overflow-hidden rounded-md bg-red-500"
              >
                <Image src={centerImage} fill className="object-cover" alt="" />
              </Link>
            )}
          </div>

          <div className="mt-2 rounded-xl bg-background px-2.5 py-1.5">
            {/* <Label className="text-xs text-foreground/80">Services</Label> */}
            <CartServiceDetails items={servicesCart.value?.items} />
          </div>
        </div>
      </div>

      <div>
        <BillDetails />
      </div>

      <div>
        <AddressDetails />
      </div>

      <BookServicesButton setBookingComplete={setIsBookingComplete} />
    </div>
  );
}

const CartServiceDetails = ({ items }: { items: ServiceCartItem[] }) => {
  const router = useRouter();

  useEffect(() => {
    if (!servicesCart.value?.center?.id) {
      router.push("/");
    } else if (!servicesCart.value?.items?.length) {
      router.push(getCenterUrl(servicesCart.value?.center));
    }
  }, [servicesCart.value?.items?.length, servicesCart.value?.center?.id]);

  return (
    <div className="mt-2 flex flex-col gap-5">
      {items?.map((item, idx) => (
        <div
          key={`service-no-${idx}-${item.service.id}-${item.slot.id}-${item.pet.id}`}
          className={`flex animate-fade-in items-start justify-between gap-2`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-1 text-2sm font-semibold md:text-sm">
              {item.service.name}
            </span>
            <span className="text-xs text-foreground/70 md:text-2sm">
              Booking for:{" "}
              <span className="font-medium text-primary">{item?.pet.name}</span>
            </span>
            <span className="line-clamp-1 text-xs text-foreground/70 md:text-2sm">
              Start Time:{" "}
              <span className="font-medium">
                {format(
                  parse(
                    item.slot.startTime,
                    "HH:mm:ss",
                    new Date(item.slot.date),
                  ),
                  "EEE do MMM, h:mm a",
                )}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Price
              className="text-2sm font-semibold md:text-sm"
              price={item.service.price}
            />
            <MdDelete
              className="size-5 cursor-pointer text-foreground/50 hover:text-foreground/30"
              onClick={() => removeItemFromServicesCart(idx)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const BillDetails = () => {
  const total =
    servicesCart.value?.items?.reduce(
      (acc, item) => acc + item.service.price,
      0,
    ) ?? 0;

  return (
    <div>
      <Label className="font-semibold">Bill Details</Label>
      <div className="mt-1 flex animate-fade-in flex-col gap-1.5 rounded-xl bg-muted p-2 py-3.5">
        <div className="flex items-center justify-between text-2sm font-medium md:text-sm ">
          <span className="text-foreground/80">Items Total</span>
          <Price price={total} />
        </div>
        <hr className="mt-1.5 border-dotted border-foreground/40 pb-1.5" />
        <div className="flex items-center justify-between text-2sm font-semibold md:text-sm">
          <span>To Pay</span>
          <Price price={total} />
        </div>
      </div>
      <p className="text-xs font-medium text-destructive md:text-2sm">
        *Payments should be made directly to the Service Provider.
      </p>
    </div>
  );
};

const AddressDetails = () => {
  const [accordianValue, setAccordianValue] = useState("address-details");

  const {
    data: addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = api.customerAddress.getAddresses.useQuery(undefined, {
    // enabled: !!user,
  });

  if (isAddressesLoading) {
    return <Skeleton className="h-36 w-full rounded-xl" />;
  }

  return (
    <div>
      <Label className="font-semibold">Address Details</Label>
      <Accordion
        type="single"
        value={accordianValue}
        onValueChange={setAccordianValue}
        collapsible={true}
        className="mt-1 animate-fade-in space-y-1 shadow-none"
      >
        {/* Address */}
        <AccordionItem value="address-details" className="rounded-xl border-0">
          <div
            className={cn(
              `flex w-full items-center justify-between bg-muted px-2`,
              accordianValue == "address-details"
                ? "rounded-t-xl"
                : "rounded-xl",
              !servicesCart.value?.address ? "bg-primary/25" : "",
            )}
          >
            <span className="text-sm font-semibold md:text-base">
              {servicesCart.value?.address ? (
                <span className="text-primary">
                  {servicesCart.value.address?.name}
                </span>
              ) : (
                <span className="text-destructive">Not Selected</span>
              )}
            </span>
            <div className="w-min">
              <AccordionTrigger className="w-min py-2.5" noIcon>
                <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  {"address-details" == accordianValue ? "Close" : "Edit"}
                </span>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="rounded-b-xl border px-2 pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-2sm font-medium text-foreground/80 md:text-sm">
                Select Address
              </Label>
              <span className="text-2sm opacity-80">OR</span>
              <NewAddessModal
                onAddNewAddress={() => refetchAddresses()}
                buttonVarient={!addresses?.length ? "primary" : "secondary"}
              />
            </div>
            <div className="mt-4 flex max-h-60 flex-col gap-2 overflow-y-auto">
              {addresses?.length ? (
                addresses.map((address, idx) => (
                  <div
                    key={idx}
                    className={`flex cursor-pointer flex-col gap-0.5 rounded-lg p-1.5 ${servicesCart.value?.address?.id == address.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                    onClick={() => {
                      setTimeout(() => {
                        setAccordianValue("slot-starttime-selection");
                      }, 100);
                      setAddressToServiceCart(address);
                    }}
                    aria-hidden="true"
                  >
                    <span className="text-2sm font-semibold md:text-sm">
                      {address.name}
                    </span>
                    <span className="line-clamp-2 text-xs text-foreground/70 md:text-2sm">
                      {getFullFormattedAddresses(address)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-sm">
                  No address found!
                  <br /> Click{" "}
                  <span className="font-semibold">Add New Address</span> to
                  create new address.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
