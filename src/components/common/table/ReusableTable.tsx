"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setQueryStringBySearchParams } from "@/lib/utils";

interface ColumnConfig<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cellClassName?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  hasAction?: boolean;
  isLoading?: boolean;
  pagination?: {
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export function ReusableTable<T extends { _id: string }>({
  data = [],
  columns,
  pagination,
  onEdit,
  onDelete,
  hasAction = false,
  isLoading = false,
}: ReusableTableProps<T>) {
  const skeletonRows = 10;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentLimit = searchParams.get("limit") || "10";
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || data.length;

  const handlePageChange = (page: number) => {
    const query = setQueryStringBySearchParams(searchParams, {
      page: page.toString(),
    });
    router.push(`${pathname}?${query}`);
  };

  const handleLimitChange = (value: string) => {
    const query = setQueryStringBySearchParams(searchParams, {
      limit: value,
      page: "1",
    });
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-300">
            {columns.map((col, i) => (
              <TableHead key={i}>{col.header}</TableHead>
            ))}
            {hasAction && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {columns.map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {hasAction && (
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            : data.map((row, rowIndex) => (
                <TableRow key={`${row._id}-${rowIndex}`}>
                  {columns.map((col, colIndex) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);
                    return (
                      <TableCell key={colIndex} className={col.cellClassName}>
                        {value}
                      </TableCell>
                    );
                  })}
                  {hasAction && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

          {data.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length + (hasAction ? 1 : 0)}>
                <div className="text-center text-gray-500 py-20">
                  No data available
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="py-4 border-t flex items-center gap-4 flex-wrap">
        <Pagination>
          <PaginationContent>
            <p className="text-sm text-gray-500 mr-2">
              Total: <b>{totalItems}</b> items
            </p>

            <Select value={currentLimit} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder={currentLimit} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit} items
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
