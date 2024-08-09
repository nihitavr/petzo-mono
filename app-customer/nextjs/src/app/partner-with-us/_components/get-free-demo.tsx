"use client";

import { useState } from "react";
import Image from "next/image";
import { TRPCClientError } from "@trpc/client";

import type { SERVICE_TYPE } from "@petzo/constants";
import { SERVICES_CONFIG } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import { Input } from "@petzo/ui/components/input";
import Loader from "@petzo/ui/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@petzo/ui/components/select";
import { toast } from "@petzo/ui/components/toast";

import { api } from "~/trpc/react";

export default function GetFreeDemo() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceType, setServiceType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEarlyAccessUser = api.earlyAccessUsers.create.useMutation();

  return (
    <div id="demo-section" className="flex flex-col items-center gap-10">
      <div>
        <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">
          Still not convinced? Get a{" "}
          <span className="font-semibold">free demo!</span>
        </h1>
        <p className="mt-3 text-center text-lg md:text-xl">
          See how our product can help you grow 10x. Demo scheduled within 48
          hours.
        </p>
      </div>

      <div className="item-end flex w-full flex-col items-center gap-3 md:w-1/2 lg:w-1/3">
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Name"
          className="bg-background md:h-10"
        />
        <Input
          onChange={(e) => setPhoneNumber(e.currentTarget.value)}
          value={phoneNumber}
          placeholder="Phone number"
          className="bg-background md:h-10"
        />
        <Select onValueChange={setServiceType} defaultValue={serviceType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SERVICES_CONFIG).map(([key, value]) => {
              return (
                <SelectItem
                  key={`service-${key}`}
                  value={value.publicId}
                  className="cursor-pointer"
                >
                  <div className="flex !flex-row items-center gap-2">
                    {value.icon && (
                      <Image src={value.icon} height={20} width={20} alt="" />
                    )}
                    <span>{value.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button
          className="flex items-center gap-1"
          disabled={isSubmitting}
          onClick={async () => {
            if (!name || !phoneNumber || !serviceType) {
              toast.error("Please fill all the details for the demo.");
              return;
            }

            try {
              setIsSubmitting(true);
              await createEarlyAccessUser.mutateAsync({
                name: name,
                phoneNumber: phoneNumber,
                serviceType: serviceType as SERVICE_TYPE,
              });
              setName("");
              setPhoneNumber("");
              toast.success(
                "Thank you for showing interest. We will get in touch with you soon.",
              );
            } catch (error) {
              if (error instanceof TRPCClientError) {
                toast.error(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  JSON.parse(error.message)?.[0]?.message as string,
                );
              }
            }
            setIsSubmitting(false);
          }}
        >
          Get Free Demo
          <Loader className="size-5" show={isSubmitting} />
        </Button>
        <span className="text-center text-2sm">
          These details will be used solely for contact purposes.
        </span>
      </div>
    </div>
  );
}
