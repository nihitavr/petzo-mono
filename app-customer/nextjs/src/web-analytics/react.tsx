"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

import {
  getSessionId,
  getUserId,
  userIdSignal,
} from "~/lib/storage/session-storage";

export function trackCustom(
  eventName: string,
  properties?: Record<string, string | number>,
) {
  const data = {
    sessionId: getSessionId(),
    userId: getUserId(),
    timestamp: Date.now(),
    ...properties,
  };

  console.log("trackCustom", eventName, data);

  track(eventName, { data: JSON.stringify(data) });
}

export function RecordEvent({
  name,
  data,
}: {
  name: string;
  data?: Record<string, string | number>;
}) {
  useEffect(() => {
    trackCustom(name, data);
  }, []);

  return null;
}

export function InitializeCustomEvents({ userId }: { userId?: string }) {
  useEffect(() => {
    userIdSignal.value = userId;
  }, [userId]);
  return null;
}
