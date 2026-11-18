"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  getRowId?: (row: T, index: number) => string;
  className?: string;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
  emptyAction,
  getRowId,
  className,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_10px_30px_-28px_oklch(0.35_0.04_210/0.5)]",
          className
        )}
        aria-busy="true"
        aria-live="polite"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={`${column.id}-${rowIndex}`}>
                    <Skeleton className="h-4 w-full max-w-[12rem]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/70 px-6 py-16 text-center",
          className
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Inbox className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-sm font-semibold text-foreground">
            {emptyTitle}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
        {emptyAction}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_10px_30px_-28px_oklch(0.35_0.04_210/0.5)]",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  "bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase",
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const rowId = getRowId?.(row, index) ?? String(index);

            return (
              <TableRow
                key={rowId}
                className={cn(
                  "transition-colors",
                  onRowClick &&
                    "cursor-pointer hover:bg-accent/40 focus-visible:bg-accent/50 focus-visible:outline-none"
                )}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? "link" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${rowId}-${column.id}`}
                    className={column.className}
                  >
                    {column.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
