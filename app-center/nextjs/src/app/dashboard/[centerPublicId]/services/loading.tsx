import { Skeleton } from "@petzo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@petzo/ui/components/table";

export default async function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Services</h1>
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      <Table className="mt-4">
        <TableCaption>List of all services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20px]"></TableHead>
            <TableHead className="min-w-[100px]">Service Name</TableHead>
            <TableHead className="min-w-[100px]">Service Type</TableHead>
            <TableHead className="min-w-[100px]">Price</TableHead>
            <TableHead className="">Preview</TableHead>
            <TableHead className="text-right">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3]?.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">
                <Skeleton className="h-6 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-6 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
