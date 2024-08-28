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
  const [objectCover, setObjectCover] = useState(true);

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
    <div className="flex w-full flex-col gap-1">
      <Carousel
        onClick={() => setObjectCover(!objectCover)}
        setApi={setCarouselApi}
        className={objectCover ? "" : "rounded-xl border"}
      >
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem className={cn("relative", className)} key={index}>
              <Image
                src={imageUrl ? imageUrl : defaultImage}
                alt="Center Image"
                fill
                className={cn(
                  "object-center transition-all duration-300",
                  objectCover ? "object-cover" : "object-contain",
                  imageClassName,
                )}
                loading="lazy"
                sizes="(min-width: 1280px) calc(40vw - 166px), (min-width: 1040px) calc(40vw - 89px), (min-width: 780px) calc(40vw - 22px), calc(100vw - 40px)"
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
            className={images.length < 7 ? "justify-center" : ""}
          >
            {images.map((imageUrl, index) => (
              <CarouselItem
                className={`aspect-square basis-[14.285%] p-0.5`}
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
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    src={imageUrl ? imageUrl : defaultImage}
                    alt="Profile Image"
                    loading="lazy"
                    className="aspect-square rounded-md p-0.5"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="">
            <CarouselPrevious
              className="ml-3"
              canScrollPrev={carouselApi?.canScrollPrev()}
              scrollPrev={() => carouselApi?.scrollPrev()}
            />
            <CarouselNext
              className="mr-3"
              canScrollNext={carouselApi?.canScrollNext()}
              scrollNext={() => carouselApi?.scrollNext()}
            />
          </div>
        </Carousel>
      )}
    </div>
  );
}
