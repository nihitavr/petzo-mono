import Image from "next/image";
import { format } from "date-fns";

import type { PetMedicalRecord } from "@petzo/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@petzo/ui/components/accordion";

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
    <Accordion type="multiple" className="flex w-full flex-col gap-2">
      {petMedicalRecords.map((medicalRecord, idx) => {
        return (
          <AccordionItem
            key={idx}
            value={`medical-record-${medicalRecord.id}`}
            className="rounded-lg border-b-0 "
          >
            <AccordionTrigger className="rounded-lg bg-primary/10 px-2 text-base md:text-lg">
              <span>
                {/* Appointment:{" "} */}
                <span className="font-semibold ">
                  {format(medicalRecord.appointmentDate, "ccc do MMM yy")}
                </span>
              </span>
            </AccordionTrigger>

            <AccordionContent className="grid grid-cols-1 flex-col gap-2 pt-3 md:grid-cols-3">
              {medicalRecord.images &&
                medicalRecord.images.length > 0 &&
                medicalRecord.images.map((image, idx) => (
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
                ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
