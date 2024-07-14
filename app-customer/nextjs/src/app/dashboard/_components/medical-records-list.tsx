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
import { Label } from "@petzo/ui/components/label";

import { MedicalRecordsListLoading } from "./loading/medical-records-loading";

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
      {petMedicalRecords?.length ? (
        petMedicalRecords.map((medicalRecord, idx) => {
          const value = `medical-record-${medicalRecord.id}`;
          return (
            <AccordionItem
              key={idx}
              value={`medical-record-${medicalRecord.id}`}
              className="rounded-lg border"
            >
              <AccordionTrigger className="z-20 flex justify-between rounded-lg bg-muted px-2 text-sm md:text-lg">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-foreground/70 md:text-sm">
                      Appointment:{" "}
                    </span>
                    <span className="font-semibold">
                      {format(medicalRecord.appointmentDate, "ccc do MMM yy")}
                    </span>
                  </div>
                  <Button
                    className="mr-2.5 h-7"
                    size="sm"
                    variant="outline"
                    asChild={true}
                  >
                    <Link
                      href={`/dashboard/medical-records/${medicalRecord.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {medicalRecord.description && (
                  <div className="p-2">
                    <Label>Details</Label>
                    <div className="mt-1 whitespace-pre">
                      {medicalRecord.description}
                    </div>
                  </div>
                )}
                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3 md:px-2">
                  <MedicalRecordImages
                    images={medicalRecord.images}
                    isSelected={selectedMedicalRecords.includes(value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })
      ) : (
        <div className="flex h-20 items-center justify-center text-center text-foreground/80">
          <span>
            No Medical Records found for {petName}. <br />
            Click <span className="font-semibold">New Medical Record</span>.
          </span>{" "}
        </div>
      )}
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
    return null;
  }

  return images.map((image, idx) => (
    <div key={idx} className="relative aspect-[1/1.41] w-full border">
      <Image
        fill
        style={{ objectFit: "contain" }}
        src={image.url}
        alt="Report"
      />
    </div>
  ));
}
