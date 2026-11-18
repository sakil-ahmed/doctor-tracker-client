"use client";

import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  id?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Disable dates after this YYYY-MM-DD value */
  max?: string;
  /** Disable dates before this YYYY-MM-DD value */
  min?: string;
};

function parseDateValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : undefined;
}

function toDateString(date?: Date): string | undefined {
  if (!date || !isValid(date)) return undefined;
  return format(date, "yyyy-MM-dd");
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  max,
  min,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(value);
  const maxDate = parseDateValue(max);
  const minDate = parseDateValue(min);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-start rounded-lg px-2.5 font-normal",
              !selected && "text-muted-foreground",
              className
            )}
            data-empty={!selected}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" className="text-muted-foreground" />
        {selected ? format(selected, "MMM d, yyyy") : placeholder}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto gap-0 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-lg ring-1 ring-border"
      >
        <Calendar
          mode="single"
          captionLayout="label"
          selected={selected}
          defaultMonth={selected}
          className="bg-popover text-popover-foreground"
          onSelect={(date) => {
            onChange?.(toDateString(date));
            setOpen(false);
          }}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
