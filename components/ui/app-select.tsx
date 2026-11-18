"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_VALUE = "__empty__";

export type AppSelectOption = {
  value: string;
  label: string;
};

type AppSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  emptyLabel?: string;
  allowEmpty?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
};

export function AppSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  emptyLabel = "All",
  allowEmpty = false,
  disabled = false,
  className,
  triggerClassName,
}: AppSelectProps) {
  const selectValue = value ? value : allowEmpty ? EMPTY_VALUE : null;

  const items = useMemo(() => {
    const map: Record<string, string> = {};
    if (allowEmpty) {
      map[EMPTY_VALUE] = emptyLabel;
    }
    for (const option of options) {
      map[option.value] = option.label;
    }
    return map;
  }, [allowEmpty, emptyLabel, options]);

  return (
    <Select
      value={selectValue}
      items={items}
      onValueChange={(next) => {
        if (next == null) return;
        onChange(next === EMPTY_VALUE ? "" : String(next));
      }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size="default"
        className={cn(
          "h-9 w-full min-w-0 rounded-lg border-border bg-background px-2.5 shadow-none dark:bg-card",
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className={cn(
          "rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
          className
        )}
      >
        {allowEmpty ? (
          <SelectItem value={EMPTY_VALUE}>{emptyLabel}</SelectItem>
        ) : null}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
