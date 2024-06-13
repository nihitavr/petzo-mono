"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: {
    center: string;
  };
}) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, []);
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-1">
      <h1 className="text-2xl font-bold text-primary">Booking Complete!</h1>
      <h2 className="text-xl font-semibold">at {searchParams.center}</h2>
    </div>
  );
}
