"use client";

import type { PutBlobResult } from "@vercel/blob";
import type { ErrorOption } from "react-hook-form";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuPlusCircle, LuX } from "react-icons/lu";

import { cn } from "../../lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { Input } from "./input";
import Loader from "./loader";

const MAX_FILE_SIZE = 10000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const onFilesUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  handleUploadUrl: string,
  basePathname?: string,
) => {
  const files = e.target.files;
  if (files) {
    const fileArray = Array.from(files);
    const blobPromises: Promise<PutBlobResult>[] = [];

    for (const file of fileArray) {
      const filePath = basePathname
        ? `${basePathname}/${file.name}`
        : file.name;
      const newBlob = upload(filePath, file, {
        access: "public",
        handleUploadUrl: handleUploadUrl,
      });

      blobPromises.push(newBlob);
    }

    if (blobPromises.length) {
      const blobs = await Promise.all(blobPromises);
      const imageUrls = blobs.map((blob) => blob.url);
      return imageUrls;
    }
  }
};

const validateFiles = (files: File[], maxFiles: number) => {
  if (files?.length > maxFiles) {
    return {
      error: `You can only upload ${maxFiles} more file${
        maxFiles == 1 ? "." : "s."
      }`,
    };
  }

  const isFileTooLarge = files.some((file) => file.size > MAX_FILE_SIZE);
  if (isFileTooLarge) {
    return {
      error: `Files must be smaller than ${MAX_FILE_SIZE / 1000000} MB`,
    };
  }
  const isFileTypeInvalid = !files.every((file) =>
    ACCEPTED_IMAGE_TYPES.includes(file.type),
  );

  if (isFileTypeInvalid) {
    return { error: "File type not supported" };
  }

  return { error: null };
};

function ImageButton<T>({
  clearErrors,
  setError: setFieldError,
  name: fieldName,
  onChange: onFieldChange,
  value: fieldValue,
  maxFiles,
  handleUploadUrl,
  basePathname,
}: {
  clearErrors: (name?: T) => void;
  setError: (
    name: T,
    error: ErrorOption,
    options?:
      | {
          shouldFocus: boolean;
        }
      | undefined,
  ) => void;
  name: T;
  onChange: (images: { url: string }[]) => void;
  value?: { url: string }[] | null;
  maxFiles: number;
  handleUploadUrl: string;
  basePathname?: string;
}) {
  fieldValue = fieldValue ?? [];

  if (!fieldName || fieldValue.length >= maxFiles) {
    return <Fragment />;
  }

  return (
    <div className="size-full">
      <label
        htmlFor="file-upload"
        className="flex size-full flex-col items-center justify-center rounded-lg border"
      >
        <LuPlusCircle className="size-12 cursor-pointer text-gray-300 hover:text-gray-400 md:size-14" />
        <span className="text-center text-2sm font-semibold text-foreground/50 md:text-sm">
          Add Image
        </span>
      </label>
      <Input
        id="file-upload"
        placeholder="Image"
        type="file"
        accept="capture=camera,image/*"
        className="file:cursor-pointer file:rounded-md file:hover:bg-slate-200"
        multiple
        onChange={async (e) => {
          if (!e.target.files) {
            return;
          }

          const { error } = validateFiles(
            Array.from(e.target.files),
            maxFiles - (fieldValue?.length ?? 0),
          );

          if (error) {
            setFieldError(fieldName, { message: error });
            e.target.value = "";
            return;
          }

          const emptyArray = Array.from(e.target.files).map(() => {
            return {
              url: "",
            };
          });

          onFieldChange([...fieldValue, ...emptyArray]);
          const imageUrls = await onFilesUpload(
            e,
            handleUploadUrl,
            basePathname,
          );
          const imageUrlObjs = imageUrls?.map((url) => {
            return { url };
          });

          if (imageUrlObjs) {
            onFieldChange([...fieldValue, ...imageUrlObjs]);
            clearErrors(fieldName);
            e.target.value = "";
          } else {
            onFieldChange([...fieldValue]);
          }
        }}
      />
    </div>
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function ImageInput<T>({
  name,
  value,
  onChange,
  objectFit = "cover",
  clearErrors,
  setError: setFieldError,
  ratio = 1,
  maxFiles,
  handleUploadUrl,
  className,
  basePathname,
  showArrows = true,
}: {
  name: T;
  value?: { url: string }[] | null;
  onChange: (images: { url: string }[]) => void;
  className?: string;
  ratio?: number;
  objectFit?: "contain" | "cover";
  clearErrors: (name?: T) => void;
  setError: (
    name: T,
    error: ErrorOption,
    options?:
      | {
          shouldFocus: boolean;
        }
      | undefined,
  ) => void;
  maxFiles: number;
  handleUploadUrl: string;
  basePathname?: string;
  showArrows?: boolean;
}) {
  const [showMore, setShowMore] = useState<boolean>(true);
  const [filteredValue, setFilteredValue] = useState(value);

  useEffect(() => {
    if (
      value &&
      value.length > 5 &&
      showMore &&
      !value.find((image) => !image.url)
    ) {
      setFilteredValue(value.slice(0, 5));
    } else {
      setFilteredValue(value);
    }
  }, [value, showMore]);

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-6 gap-2 md:grid-cols-12">
        {value && value?.length < maxFiles && (
          <div className={cn("col-span-2", className)}>
            <AspectRatio className="rounded-lg border" ratio={ratio}>
              <ImageButton
                name={name}
                clearErrors={clearErrors}
                setError={setFieldError}
                onChange={onChange}
                value={value}
                maxFiles={maxFiles}
                handleUploadUrl={handleUploadUrl}
                basePathname={basePathname}
              />
            </AspectRatio>
          </div>
        )}
        {filteredValue &&
          filteredValue.length > 0 &&
          filteredValue?.map((image, idx) => {
            const leftArrow = idx !== 0;
            const rightArrow = idx !== filteredValue.length - 1;

            return (
              <div key={idx} className={cn("col-span-2 w-full", className)}>
                {image.url ? (
                  <AspectRatio
                    className="rounded-lg border bg-black"
                    ratio={ratio}
                  >
                    <Image
                      key={`${idx}_${image.url}`}
                      src={image.url}
                      fill
                      style={{ objectFit }}
                      className="animate-fade-in rounded-md"
                      alt={`image ${idx + 1}`}
                    />
                    <LuX
                      className={`absolute right-1 top-1 size-5 cursor-pointer rounded-full bg-slate-300 p-0.5 text-black/80 opacity-70 hover:opacity-100`}
                      strokeWidth={2}
                      onClick={() => {
                        const newImages = filteredValue.filter(
                          (_, index) => index !== idx,
                        );
                        onChange(newImages);
                      }}
                    />
                    {showArrows && (
                      <div className="absolute bottom-1 right-1/2 flex translate-x-1/2 items-center gap-1">
                        <FaArrowLeftLong
                          className={`size-5 cursor-pointer rounded-sm bg-slate-300 p-0.5 text-black/80 opacity-70 hover:opacity-100 ${!leftArrow ? "pointer-events-none opacity-30" : ""}`}
                          strokeWidth={0.5}
                          onClick={() => {
                            const img1 = filteredValue[idx];
                            const img2 = filteredValue[idx - 1];
                            filteredValue[idx] = img2!;
                            filteredValue[idx - 1] = img1!;

                            onChange(filteredValue);
                          }}
                        />
                        <FaArrowRightLong
                          className={`size-5 cursor-pointer rounded-sm bg-slate-300 p-0.5 text-black/80 opacity-70 hover:opacity-100 ${!rightArrow ? "pointer-events-none opacity-30" : ""}`}
                          strokeWidth={1}
                          onClick={() => {
                            const img1 = filteredValue[idx];
                            const img2 = filteredValue[idx + 1];
                            filteredValue[idx] = img2!;
                            filteredValue[idx + 1] = img1!;

                            onChange(filteredValue);
                          }}
                        />
                      </div>
                    )}
                  </AspectRatio>
                ) : (
                  <AspectRatio
                    className="flex items-center justify-center rounded-md bg-slate-200"
                    ratio={ratio}
                  >
                    <Loader show={true} />
                  </AspectRatio>
                )}
              </div>
            );
          })}
      </div>
      {value && value.length > 5 && (
        <div className="mt-4 flex h-10 w-full justify-center">
          <button
            type="button"
            onClick={() => setShowMore((showMore) => !showMore)}
            className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border hover:bg-muted"
          >
            <span className="text-center text-2sm text-foreground/70">
              {showMore ? "Show More" : "Show Less"} ({showMore ? "+" : "-"}
              {value.length - 5})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
