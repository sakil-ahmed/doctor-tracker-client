"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type PaginationProps = {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
  isLoading?: boolean;
};

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  className,
  isLoading = false,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const canGoPrev = page > 1 && !isLoading;
  const canGoNext = page < safeTotalPages && !isLoading;

  const from =
    total !== undefined && limit !== undefined && total > 0
      ? (page - 1) * limit + 1
      : undefined;
  const to =
    total !== undefined && limit !== undefined
      ? Math.min(page * limit, total)
      : undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        {total !== undefined && from !== undefined && to !== undefined ? (
          <>
            Showing <span className="font-medium text-foreground">{from}</span>–
            <span className="font-medium text-foreground">{to}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span>
          </>
        ) : (
          <>
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{safeTotalPages}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft data-icon="inline-start" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
