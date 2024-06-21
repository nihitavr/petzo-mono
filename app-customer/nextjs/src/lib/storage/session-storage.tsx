"use client";

import { signal } from "@preact/signals-react";
import { generateRandomSessionId } from "node_modules/@petzo/utils/src/string.utils";

import { isMoreThanNMinutesAgo } from "@petzo/utils/time";

interface GuestSession {
  sessionId: string;
  lastUsedTimestamp: number;
}

export const userIdSignal = signal<string | undefined>(undefined);

/* 
  This function will return the guest session id, if it doesn't exist or is older than N minutes, it will generate a new one.
  This is used to track the guest session in the website. We generate a random 20 character nano id and store it in the local storage.
 */
export function getSessionId() {
  if (typeof localStorage === "undefined") return {} as GuestSession;
  // const cart = localStorage?.getItem("servicesCart") ?? {};

  const guestSession = JSON.parse(
    localStorage?.getItem("guest-session-id") ?? "{}",
  ) as GuestSession;

  if (
    !guestSession.sessionId ||
    isMoreThanNMinutesAgo(guestSession.lastUsedTimestamp?.toString())
  ) {
    guestSession.sessionId = generateRandomSessionId();
  }
  guestSession.lastUsedTimestamp = Date.now();

  localStorage?.setItem("guest-session-id", JSON.stringify(guestSession));

  return guestSession.sessionId;
}

export function getUserId() {
  return userIdSignal.value;
}
