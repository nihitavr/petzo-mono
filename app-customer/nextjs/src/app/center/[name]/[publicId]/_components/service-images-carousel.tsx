"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type { CarouselApi } from "@petzo/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@petzo/ui/components/carousel";
import { cn } from "@petzo/ui/lib/utils";

export default function ServiceImagesCasousel({
  images,
  defaultImage = "",
  className,
  imageClassName,
}: {
  images: string[];
  defaultImage?: string;
  className?: string;
  imageClassName?: string;
  autoplay?: boolean;
  autoPlayDelay?: number;
}) {
  images = [...images, ...images];
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("select", () => {
      const mainSnappedIndex = carouselApi.selectedScrollSnap();

      setCurrent(mainSnappedIndex);
    });

    return () => {
      carouselApi.off("select", () => {
        return;
      });
    };
  }, [carouselApi]);

  return (
    <Carousel className="h-full w-full" setApi={setCarouselApi}>
      <CarouselContent className="space-x-3">
        {images.map((imageUrl, index) => {
          return (
            <CarouselItem className={cn(`relative`, className)} key={index}>
              <Image
                src={imageUrl ? imageUrl : defaultImage}
                alt="Center Image"
                fill
                style={{ objectFit: "cover" }}
                className={imageClassName}
                loading="lazy"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute bottom-5 left-1/2 flex w-full -translate-x-1/2 flex-wrap justify-center gap-2 px-5">
        {images.length > 1 &&
          images.map((_, idx) => {
            return (
              <div
                className={`h-2 w-2 rounded-full ${
                  idx === current ? "bg-primary" : "bg-gray-300"
                }`}
                key={idx}
              />
            );
          })}
      </div>

      {!!images?.length && (
        <div className="">
          <CarouselPrevious
            className="ml-2"
            canScrollPrev={carouselApi?.canScrollPrev()}
            scrollPrev={() => carouselApi?.scrollPrev()}
          />
          <CarouselNext
            className="mr-2"
            canScrollNext={carouselApi?.canScrollNext()}
            scrollNext={() => carouselApi?.scrollNext()}
          />
        </div>
      )}
    </Carousel>
  );
}
