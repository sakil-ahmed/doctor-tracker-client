"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SearchInputProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export function SearchInput({
  id,
  value,
  defaultValue = "",
  onValueChange,
  debounceMs = 400,
  placeholder = "Search...",
  className,
  inputClassName,
  disabled = false,
  "aria-label": ariaLabel = "Search",
}: SearchInputProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const debouncedValue = useDebounce(internalValue, debounceMs);
  const onValueChangeRef = useRef(onValueChange);
  const lastEmittedRef = useRef<string>(value ?? defaultValue);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  useEffect(() => {
    if (lastEmittedRef.current === debouncedValue) {
      return;
    }
    lastEmittedRef.current = debouncedValue;
    onValueChangeRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type="search"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn("h-9 pr-9 pl-9", inputClassName)}
      />
      {internalValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => setInternalValue("")}
          aria-label="Clear search"
          disabled={disabled}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}
