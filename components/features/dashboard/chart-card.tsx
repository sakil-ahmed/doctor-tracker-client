import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ChartCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: React.ReactNode;
};

function ChartCardComponent({
  title,
  description,
  action,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available for this range.",
  className,
  children,
}: ChartCardProps) {
  return (
    <Card
      className={cn(
        "shadow-none transition-shadow duration-200 hover:shadow-[0_16px_40px_-28px_oklch(0.35_0.05_210/0.4)]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle className="font-heading text-base font-semibold">
            {title}
          </CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full rounded-xl" />
        ) : isEmpty ? (
          <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="h-[260px] w-full">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}

export const ChartCard = memo(ChartCardComponent);
