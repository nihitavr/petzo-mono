import Image from "next/image";
import Link from "next/link";
import { LuMoreVertical, LuShare } from "react-icons/lu";

import { PET_BEHAVIOUR_TAGS, PET_TYPE_CONFIG } from "@petzo/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@petzo/ui/components/dropdown-menu";
import Share from "@petzo/ui/components/share";
import { getTimePassed, titleCase } from "@petzo/utils";

import { api } from "~/trpc/server";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";

interface Props {
  id: string;
}

export default async function PetProfile({ id }: Props) {
  const pet = await api.pet.getPetProfile({ publicId: id });

  if (!pet) return null;

  const user = await api.user.getUserProfile({ id: pet.customerUserId });

  if (pet?.images?.length === 0) pet?.images.push({ url: "" });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-screen lg:w-2/5 ">
        {/* Image Section */}
        <div className="-mt-3.5">
          <BasicImagesCasousel
            images={pet.images?.map((image) => image.url) ?? []}
            className="aspect-square w-full"
            imageClassName="rounded-none"
            defaultImage={
              ["small_dog", "big_dog"].includes(pet.type!)
                ? "/dog-avatar.jpeg"
                : "/cat-avatar.jpeg"
            }
          />
        </div>

        {/* Details Section */}
        <div className="-mt-5 flex w-full -translate-y-0 flex-col gap-4 rounded-t-3xl bg-white p-4">
          {/* Breed, Type, Name, Gender, Birthdate */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0">
              <span className="text-sm  text-foreground/80">
                {PET_TYPE_CONFIG[pet.type!].category}{" "}
                {`${pet.breed ? `(${titleCase(pet.breed)})` : ""}`}
              </span>
              <span className="text-2xl font-semibold text-foreground">
                {pet?.name}
              </span>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                {pet?.gender && <span>{titleCase(pet?.gender)}</span>}
                {pet?.dateOfBirth && pet?.gender && (
                  <div className="h-1.5 w-1.5 rounded-full bg-[#999999]"></div>
                )}
                <span>Age: {getTimePassed(pet?.dateOfBirth)}</span>
              </div>
            </div>

            {/* Insta and Share button */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <LuMoreVertical className="cursor-pointer text-foreground/50 hover:text-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Pet Family Link */}
                <Link href={`/user/${user?.id}/pets`}>
                  <DropdownMenuItem className="group flex h-full w-full cursor-pointer items-center justify-start gap-2 text-foreground/80 hover:text-foreground">
                    <div className="relative aspect-square h-[20px] opacity-60 group-hover:opacity-90">
                      <Image
                        fill
                        className="aspect-square h-full"
                        style={{ objectFit: "cover" }}
                        src="/icons/pet-family-icon.svg"
                        alt="pet profile family icon"
                      />
                    </div>
                    <span>{pet.name}&apos;s pet family</span>
                  </DropdownMenuItem>
                </Link>

                {/* Share Pet Profile*/}
                <Share
                  shareInfo={{
                    title: `${pet.name}: A Furry Friend to Love!`,
                    text: `Ready to meet your new adorable four-legged family member? Checkout ${pet.name}'s profile here!`,
                    url: `https://findmypet.in/pet/${pet.id}`,
                  }}
                >
                  <DropdownMenuItem className="group flex h-full w-full cursor-pointer items-center justify-start gap-2 text-foreground/80 hover:text-foreground">
                    <LuShare className="h-[20px] w-[20px] text-foreground/50 group-hover:text-foreground" />
                    <span>Share Profile</span>
                  </DropdownMenuItem>
                </Share>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {pet.behaviourTags?.map((tag) => {
              const option = PET_BEHAVIOUR_TAGS[tag];
              return (
                <span
                  key={tag}
                  className={`mr-1 rounded-full px-2 py-1 text-xs font-semibold ${option?.badgeClassname}`}
                >
                  {option?.label}
                </span>
              );
            })}
          </div>

          <div className="text-foreground/80">{pet?.description}</div>

          {/* {user?.phoneNumber && (
            <OwnerInfoButtons phoneNumber={user.phoneNumber} />
          )} */}
        </div>
      </div>
    </div>
  );
}
