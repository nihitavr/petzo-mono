"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@petzo/ui/components/button";
import { Checkbox } from "@petzo/ui/components/checkbox";
import { Label } from "@petzo/ui/components/label";

import { api } from "~/trpc/react";

export default function AdminVerifyCenter({
  centerPublicId,
  verified,
}: {
  centerPublicId: string;
  verified: boolean;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(verified);

  const updateCenterStatus = api.center.updateCenterStatus.useMutation();

  return (
    <div className="space-y-2 rounded-xl border border-red-500 p-3">
      <Label className="text-base">Center Verification (Only Admin)</Label>
      <div className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={isVerified}
          onCheckedChange={() => setIsVerified((isVerified) => !isVerified)}
        />
        <span>Verify Center</span>
      </div>
      <Button
        onClick={async () => {
          if (verified !== isVerified) {
            await updateCenterStatus.mutateAsync({
              centerPublicId,
              status: isVerified ? "verified" : "created",
            });
            router.refresh();
          }
        }}
        disabled={verified === isVerified}
        type="button"
        className="w-full"
        size={"sm"}
      >
        Save
      </Button>
    </div>
  );
}
