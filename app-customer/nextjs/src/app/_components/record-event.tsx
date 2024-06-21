"use client";

import { useEffect } from "react";

import { trackCustom } from "~/web-analytics/react";

export function RecordEvent({
  name,
  data,
}: {
  name: string;
  data?: Record<string, string | number>;
}) {
  useEffect(() => {
    console.log("RecordEvent", name, data);

    trackCustom(name, data);
  }, []);

  return null;
}
