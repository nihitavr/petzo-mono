"use client";

import { track } from "@vercel/analytics/react";

import { getSessionId, getUserId } from "~/lib/storage/session-storage";

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
