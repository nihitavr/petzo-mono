"use client";

import { useEffect } from "react";

import { userIdSignal } from "~/lib/storage/session-storage";

export function CustomEvents({ userId }: { userId?: string }) {
  useEffect(() => {
    userIdSignal.value = userId;
  }, [userId]);
  return null;
}
