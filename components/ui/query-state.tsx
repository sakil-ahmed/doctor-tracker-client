"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

type QueryErrorProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function QueryError({ message, onRetry, className }: QueryErrorProps) {
  return (
    <div
      role="alert"
      className={
        className ??
        "flex flex-col items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-4"
      }
    >
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function PageLoadingFallback({
  title,
  description = "Loading...",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <PageHeader title={title} description={description} />
      <div className="h-32 animate-pulse rounded-2xl bg-muted/80" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted/80" />
    </div>
  );
}
