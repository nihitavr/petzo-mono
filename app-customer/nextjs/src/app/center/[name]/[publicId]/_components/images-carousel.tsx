"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import type { CarouselApi } from "@petzo/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@petzo/ui/components/carousel";
import { cn } from "@petzo/ui/lib/utils";

export default function ImagesCasousel({
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [thumbnailsCarouselApi, setThumbnailsCarouselApi] =
    useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("select", () => {
      const mainSnappedIndex = carouselApi.selectedScrollSnap();
      const thumbnailsInViewIndexes = thumbnailsCarouselApi?.slidesInView();

      setCurrent(mainSnappedIndex);

      if (!thumbnailsInViewIndexes?.includes(mainSnappedIndex)) {
        thumbnailsCarouselApi?.scrollTo(mainSnappedIndex);
      }
    });

    return () => {
      carouselApi.off("select", () => {
        return;
      });
    };
  }, [carouselApi]);

  return (
    <div className="flex w-full flex-col gap-3">
      <Carousel setApi={setCarouselApi}>
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem className={cn("relative", className)} key={index}>
              <Image
                src={imageUrl ? imageUrl : defaultImage}
                alt="Center Image"
                fill
                style={{ objectFit: "cover" }}
                className={imageClassName}
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 && (
        <Carousel
          className="relative w-full"
          setApi={setThumbnailsCarouselApi}
          opts={{
            dragFree: true,
            inViewThreshold: 1,
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent
            className={images.length < 6 ? "justify-center" : ""}
          >
            {images.map((imageUrl, index) => (
              <CarouselItem
                className={`aspect-square basis-1/6 p-1`}
                key={index}
                onClick={() => {
                  carouselApi?.scrollTo(index);
                }}
              >
                <div
                  className={`${
                    current == index
                      ? "rounded-md border-2 border-primary"
                      : "rounded-md border hover:border-slate-400"
                  } relative flex aspect-square cursor-pointer items-center justify-center`}
                >
                  <Image
                    fill
                    style={{ objectFit: "cover" }}
                    src={imageUrl ? imageUrl : defaultImage}
                    alt="Profile Image"
                    loading="lazy"
                    className="rounded-md p-0.5"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="">
            <CarouselPrevious
              canScrollPrev={carouselApi?.canScrollPrev()}
              scrollPrev={() => carouselApi?.scrollPrev()}
            />
            <CarouselNext
              canScrollNext={carouselApi?.canScrollNext()}
              scrollNext={() => carouselApi?.scrollNext()}
            />
          </div>
        </Carousel>
      )}
    </div>
  );
}
