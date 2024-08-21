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

export default function BasicImagesCasousel({
  images,
  startIndex,
  defaultImage = "",
  className,
  imageClassName,
}: {
  images: string[];
  defaultImage?: string;
  startIndex?: number;
  className?: string;
  imageClassName?: string;
  autoplay?: boolean;
  autoPlayDelay?: number;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  useState<CarouselApi>();
  const [current, setCurrent] = useState(startIndex ?? 0);

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
    <Carousel
      opts={{
        loop: true,
        startIndex: startIndex ?? 0,
      }}
      className="h-full w-full"
      setApi={setCarouselApi}
    >
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
      <div className="absolute bottom-5 left-1/2 flex w-full -translate-x-1/2 flex-wrap justify-center gap-2 px-3">
        {images.length > 1 &&
          images.map((_, idx) => {
            return (
              <div
                className={`size-1.5 rounded-full md:size-2 ${
                  idx === current ? "bg-primary" : "bg-gray-300"
                }`}
                key={idx}
              />
            );
          })}
      </div>

      {!!images?.length && (
        <div className="hidden md:inline">
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
