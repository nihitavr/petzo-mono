import Link from "next/link";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-lg font-semibold">Manage Center</h1>
      <div className="flex gap-2">
        <Link
          href={`/dashboard/${centerPublicId}/edit`}
          className="flex w-full items-center justify-center rounded-lg border p-5 font-semibold hover:bg-muted"
        >
          Edit Details
        </Link>
        <Link
          href={`/dashboard/${centerPublicId}/address/edit`}
          className="flex w-full items-center justify-center rounded-lg border p-5 font-semibold hover:bg-muted"
        >
          Edit Address
        </Link>
      </div>
      <div></div>
    </div>
  );
}
