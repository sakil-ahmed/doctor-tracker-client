"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="gap-1">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </Label>
      {children}
      {description && !error ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
