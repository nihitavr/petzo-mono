"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import type { PetMedicalRecord } from "@petzo/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@petzo/ui/components/accordion";
import { Button } from "@petzo/ui/components/button";

import { MedicalRecordsListLoading } from "./medical-records-loading";

export default function MedicalRecordsList({
  petName,
  petMedicalRecords,
  isLoading,
}: {
  petName?: string;
  petMedicalRecords: PetMedicalRecord[];
  isLoading: boolean;
}) {
  const [selectedMedicalRecords, setSelectedMedicalRecords] = useState<
    string[]
  >([]);

  if (isLoading) {
    return <MedicalRecordsListLoading noOfItems={3} />;
  }

  if (!petMedicalRecords && !isLoading) {
    <div className="flex items-center justify-center p-10 text-center">
      <span>
        No Medical Records found for{" "}
        <span className="font-semibold">{petName}</span>.
      </span>
    </div>;
  }

  return (
    <Accordion
      type="multiple"
      className="flex w-full flex-col gap-2"
      value={selectedMedicalRecords}
      onValueChange={setSelectedMedicalRecords}
    >
      {petMedicalRecords.map((medicalRecord, idx) => {
        const value = `medical-record-${medicalRecord.id}`;
        return (
          <AccordionItem
            key={idx}
            value={`medical-record-${medicalRecord.id}`}
            className="rounded-lg border-b-0 "
          >
            <AccordionTrigger className="smd:text-lg rounded-lg bg-primary/10 px-2 text-base shadow-m-sm">
              <span>
                Appointment:{" "}
                <span className="font-semibold ">
                  {format(medicalRecord.appointmentDate, "ccc do MMM yy")}
                </span>
              </span>
            </AccordionTrigger>

            <AccordionContent className="pt-3">
              <Link
                href={`/dashboard/medical-records/${medicalRecord.id}/edit`}
                className="flex w-full justify-end"
              >
                <Button className="w-20" size="sm" variant="outline">
                  Edit
                </Button>
              </Link>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                <MedicalRecordImages
                  images={medicalRecord.images}
                  isSelected={selectedMedicalRecords.includes(value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function MedicalRecordImages({
  images,
}: {
  images?: { url: string }[] | null;
  isSelected: boolean;
}) {
  if (!images || images.length == 0) {
    console.log("No images found");

    return null;
  }

  return images.map((image, idx) => (
    <div
      key={idx}
      className="relative aspect-[1/1.41] w-full rounded-lg border"
    >
      <Image
        fill
        style={{ objectFit: "contain" }}
        src={image.url}
        alt="Report"
      />
    </div>
  ));
}
