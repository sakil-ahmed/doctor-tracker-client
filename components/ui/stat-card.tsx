import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  isLoading?: boolean;
};

function StatCardComponent({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  isLoading = false,
}: StatCardProps) {
  const trendPositive = trend ? trend.value >= 0 : false;

  return (
    <Card
      className={cn(
        "shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-28px_oklch(0.35_0.05_210/0.45)]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardDescription className="text-xs font-medium tracking-wide uppercase">
            {title}
          </CardDescription>
          <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
            {isLoading ? "—" : value}
          </CardTitle>
        </div>
        {Icon ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="size-5" />
          </div>
        ) : null}
      </CardHeader>
      {(description || trend) && !isLoading ? (
        <CardContent className="pt-0">
          {trend ? (
            <p className="text-xs text-muted-foreground">
              <span
                className={cn(
                  "font-medium",
                  trendPositive ? "text-emerald-600" : "text-destructive"
                )}
              >
                {trendPositive ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label ? ` ${trend.label}` : null}
            </p>
          ) : null}
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}

export const StatCard = memo(StatCardComponent);
