"use client";

import { FilterX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search-input";

export type DateRangeValue = {
  from?: string;
  to?: string;
};

export type FilterBarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  dateRange?: DateRangeValue;
  onDateRangeChange?: (range: DateRangeValue) => void;
  onReset?: () => void;
  showReset?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  dateRange,
  onDateRangeChange,
  onReset,
  showReset = true,
  children,
  className,
}: FilterBarProps) {
  const hasDateRange = Boolean(onDateRangeChange);
  const hasSearch = Boolean(onSearchChange);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-[0_10px_30px_-28px_oklch(0.35_0.04_210/0.5)] sm:p-4 md:flex-row md:flex-wrap md:items-end",
        className
      )}
    >
      {hasSearch ? (
        <div className="w-full md:min-w-[220px] md:flex-1">
          <Label
            htmlFor="filter-search"
            className="mb-1.5 text-xs text-muted-foreground"
          >
            Search
          </Label>
          <SearchInput
            id="filter-search"
            value={search}
            onValueChange={onSearchChange!}
            placeholder={searchPlaceholder}
            className="max-w-none"
          />
        </div>
      ) : null}

      {hasDateRange ? (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto">
          <div className="space-y-1.5">
            <Label htmlFor="filter-from" className="text-xs text-muted-foreground">
              From
            </Label>
            <DatePicker
              id="filter-from"
              value={dateRange?.from}
              placeholder="Start date"
              max={dateRange?.to}
              onChange={(from) =>
                onDateRangeChange?.({
                  from,
                  to: dateRange?.to,
                })
              }
              className="min-w-[10.5rem]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-to" className="text-xs text-muted-foreground">
              To
            </Label>
            <DatePicker
              id="filter-to"
              value={dateRange?.to}
              placeholder="End date"
              min={dateRange?.from}
              onChange={(to) =>
                onDateRangeChange?.({
                  from: dateRange?.from,
                  to,
                })
              }
              className="min-w-[10.5rem]"
            />
          </div>
        </div>
      ) : null}

      {children ? (
        <div className="flex w-full flex-wrap items-end gap-3 md:w-auto">
          {children}
        </div>
      ) : null}

      {showReset && onReset ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={onReset}
        >
          <FilterX data-icon="inline-start" />
          Reset
        </Button>
      ) : null}
    </div>
  );
}
