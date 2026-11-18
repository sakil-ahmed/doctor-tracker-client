"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DashboardRange } from "@/types/dashboard";

const RANGES: { value: DashboardRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "6m", label: "6 months" },
];

type RangeToggleProps = {
  value: DashboardRange;
  onChange: (range: DashboardRange) => void;
  className?: string;
};

export function RangeToggle({ value, onChange, className }: RangeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border/70 bg-card/80 p-1 shadow-sm",
        className
      )}
      role="group"
      aria-label="Time range"
    >
      {RANGES.map((range) => {
        const active = value === range.value;
        return (
          <Button
            key={range.value}
            type="button"
            size="sm"
            variant={active ? "default" : "ghost"}
            className={cn(
              "h-8 rounded-lg px-3",
              !active && "text-muted-foreground"
            )}
            onClick={() => onChange(range.value)}
            aria-pressed={active}
          >
            {range.label}
          </Button>
        );
      })}
    </div>
  );
}
