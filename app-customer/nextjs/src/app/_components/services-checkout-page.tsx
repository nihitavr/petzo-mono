"use client";

import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { format, parse } from "date-fns";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { MdDelete } from "react-icons/md";

import type { CustomerAddresses } from "@petzo/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@petzo/ui/components/accordion";
import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";
import { Skeleton } from "@petzo/ui/components/skeleton";

import type { ServiceCartItem } from "~/lib/storage/service-cart-storage";
import Price from "~/app/_components/price";
import NewAddessModal from "~/app/center/[name]/[publicId]/_components/add-address-modal";
import {
  removeItemFromServicesCart,
  servicesCart,
} from "~/lib/storage/service-cart-storage";
import { api } from "~/trpc/react";

export default function ServicesCheckoutPage() {
  useSignals();

  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddresses | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <div>
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">Cart</h1>
        </div>
        <div className="mt-1 rounded-xl bg-muted p-2 py-4 pt-1.5">
          <Label className="text-xs text-foreground/80">Center</Label>
          <h3 className="line-clamp-1 text-sm font-semibold">
            {servicesCart.value?.center?.name}
          </h3>

          <div className="mt-2 rounded-xl bg-background px-2.5 py-1.5">
            {/* <Label className="text-xs text-foreground/80">Services</Label> */}
            <CartServiceDetails items={servicesCart.value?.items} />
          </div>
        </div>
      </div>

      <div>
        <BillDetails items={servicesCart.value?.items} />
      </div>

      <div>
        <AddressDetails
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
      </div>

      <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pt-0 md:left-auto md:right-3 md:w-72 md:px-0 lg:right-24 xl:right-48">
        <Button
          disabled={!selectedAddress}
          className="flex h-11 w-full -translate-y-[40%] rounded-xl bg-green-700 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-green-700/50 hover:bg-green-700/90"
        >
          <span className="font-semibold">Book Services</span>
        </Button>
      </div>
    </div>
  );
}

const CartServiceDetails = ({ items }: { items: ServiceCartItem[] }) => {
  return (
    <div className="mt-2 flex flex-col gap-5">
      {items?.map((item, idx) => (
        <div
          key={item.service.id}
          className="flex items-start justify-between gap-2 text-sm leading-[1.2rem]"
        >
          <div className="flex flex-col">
            <span className="line-clamp-1 text-[0.82rem] font-semibold">
              {item.service.name}
            </span>
            <span className="text-[0.7rem] text-foreground/70">
              Booking for:{" "}
              <span className="font-medium text-primary">{item?.pet.name}</span>
            </span>
            <span className="line-clamp-1 text-[0.7rem] text-foreground/70">
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
              className="text-[0.8rem] font-semibold leading-5"
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

const BillDetails = ({ items }: { items: ServiceCartItem[] }) => {
  const total = items?.reduce((acc, item) => acc + item.service.price, 0) ?? 0;

  return (
    <div>
      <Label className="font-semibold">Bill Details</Label>
      <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-muted p-2 py-3.5">
        <div className="flex items-center justify-between text-xs font-medium ">
          <span className="text-foreground/80">Items Total</span>
          <Price price={total} />
        </div>
        <hr className="mt-1.5 border-dotted border-foreground/40 pb-1.5" />
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>To Pay</span>
          <Price price={total} />
        </div>
      </div>
      <span className="text-xs font-medium text-destructive">
        *Payment needs to be done directly to the Partner.
      </span>
    </div>
  );
};

const AddressDetails = ({
  selectedAddress,
  setSelectedAddress,
}: {
  selectedAddress: CustomerAddresses | null;
  setSelectedAddress: React.Dispatch<
    React.SetStateAction<CustomerAddresses | null>
  >;
}) => {
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
        className="mt-1 space-y-1 shadow-none"
      >
        {/* Address */}
        <AccordionItem value="address-details" className="rounded-xl border-0">
          <div
            className={`flex w-full items-center justify-between bg-muted px-2 ${accordianValue == "address-details" ? "rounded-t-xl" : "rounded-xl"}`}
          >
            <span className="text-xs font-semibold">
              {selectedAddress ? (
                <span className="text-primary">{selectedAddress.name}</span>
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
              <Label className="text-sm font-medium text-foreground/80">
                Select Address
              </Label>
              <span className="opacity-80">OR</span>
              <NewAddessModal onAddNewAddress={() => refetchAddresses()} />
            </div>
            <div className="mt-4 flex max-h-60 flex-col gap-2 overflow-y-auto">
              {addresses?.length ? (
                addresses.map((address, idx) => (
                  <div
                    key={idx}
                    className={`flex cursor-pointer flex-col gap-0.5 rounded-lg p-1.5 ${selectedAddress?.id == address.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                    onClick={() => {
                      setTimeout(() => {
                        setAccordianValue("slot-starttime-selection");
                      }, 100);
                      setSelectedAddress(address);
                    }}
                    aria-hidden="true"
                  >
                    <span className="text-sm font-semibold">
                      {address.name}
                    </span>
                    <span className="line-clamp-2 text-xs text-foreground/70">
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
