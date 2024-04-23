import type { PutBlobResult } from "@vercel/blob";
import type { ErrorOption } from "react-hook-form";
import React, { Fragment } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { LuPlusCircle, LuX } from "react-icons/lu";

import { cn } from "../../lib/utils";
import { AspectRatio } from "./aspect-ratio";
import { Input } from "./input";
import Loader from "./loader";

const MAX_FILE_SIZE = 1000000;
// const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const onFilesUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  handleUploadUrl: string,
) => {
  const files = e.target.files;
  if (files) {
    const fileArray = Array.from(files);
    const blobPromises: Promise<PutBlobResult>[] = [];

    for (const file of fileArray) {
      const newBlob = upload(file.name, file, {
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
        <span className="text-sm font-semibold text-foreground/50">
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
          const imageUrls = await onFilesUpload(e, handleUploadUrl);
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
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-6">
      {value && value?.length < maxFiles && (
        <AspectRatio className="rounded-lg border" ratio={ratio}>
          <ImageButton
            name={name}
            clearErrors={clearErrors}
            setError={setFieldError}
            onChange={onChange}
            value={value}
            maxFiles={maxFiles}
            handleUploadUrl={handleUploadUrl}
          />
        </AspectRatio>
      )}
      {value &&
        value.length > 0 &&
        value?.map((image, idx) => (
          <div key={idx} className={cn("col-span-1 w-full", className)}>
            {image.url ? (
              <AspectRatio className="rounded-lg border bg-black" ratio={ratio}>
                <Image
                  src={image.url}
                  fill
                  style={{ objectFit }}
                  className="rounded-md"
                  alt={`image ${idx + 1}`}
                />
                <LuX
                  className="hover: absolute right-1 top-1 cursor-pointer rounded-full bg-slate-300 p-1 text-black opacity-70 hover:opacity-100"
                  onClick={() => {
                    const newImages = value.filter((_, index) => index !== idx);
                    onChange(newImages);
                  }}
                />
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
        ))}
    </div>
  );
}
