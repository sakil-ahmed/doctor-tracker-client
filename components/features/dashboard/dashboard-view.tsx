"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Activity, Stethoscope, UserPlus, Users } from "lucide-react";
import { RangeToggle } from "@/components/features/dashboard/range-toggle";
import { useDashboardStats } from "@/hooks/useDashboard";
import { getErrorMessage } from "@/lib/errors";
import { PageHeader } from "@/components/ui/page-header";
import { QueryError } from "@/components/ui/query-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardRange } from "@/types/dashboard";

const VALID_RANGES: DashboardRange[] = ["7d", "30d", "6m"];

const DashboardCharts = dynamic(
  () =>
    import("@/components/features/dashboard/dashboard-charts").then(
      (mod) => mod.DashboardCharts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-[340px] rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[340px] rounded-2xl" />
          <Skeleton className="h-[340px] rounded-2xl" />
        </div>
        <Skeleton className="h-[340px] rounded-2xl" />
      </div>
    ),
  }
);

function parseRange(value: string | null): DashboardRange {
  if (value && VALID_RANGES.includes(value as DashboardRange)) {
    return value as DashboardRange;
  }
  return "30d";
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-border/50 pb-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[340px] rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[340px] rounded-2xl" />
        <Skeleton className="h-[340px] rounded-2xl" />
      </div>
      <Skeleton className="h-[340px] rounded-2xl" />
    </div>
  );
}

function DashboardViewContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const range = parseRange(searchParams.get("range"));

  const { data, isLoading, isFetching, isError, error, refetch } =
    useDashboardStats(range);

  const setRange = useCallback(
    (nextRange: DashboardRange) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextRange === "30d") {
        params.delete("range");
      } else {
        params.set("range", nextRange);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const errorMessage = useMemo(
    () => getErrorMessage(error, "Failed to load dashboard stats."),
    [error]
  );

  if (isLoading && !data) {
    return <DashboardSkeleton />;
  }

  if (isError && !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of doctors, patients, and clinic activity."
        />
        <QueryError
          message={errorMessage}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  const stats = data!;

  return (
    <div
      className={
        isFetching && !isLoading
          ? "space-y-6 opacity-80 transition-opacity"
          : "space-y-6"
      }
    >
      <PageHeader
        title="Dashboard"
        description="Overview of doctors, patients, and clinic activity."
        actions={<RangeToggle value={range} onChange={setRange} />}
      />

      {isError ? (
        <QueryError
          message={`${errorMessage} Showing the last successful data.`}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total doctors"
          value={stats.totalDoctors}
          description="Active profiles in the system"
          icon={Stethoscope}
          isLoading={isLoading}
        />
        <StatCard
          title="Total patients"
          value={stats.totalPatients}
          description="All registered patients"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Avg patients / doctor"
          value={stats.avgPatientsPerDoctor}
          description="Overall workload balance"
          icon={Activity}
          isLoading={isLoading}
        />
        <StatCard
          title="New this month"
          value={stats.newThisMonth}
          description="Patients created since month start"
          icon={UserPlus}
          isLoading={isLoading}
        />
      </div>

      <DashboardCharts stats={stats} range={range} isLoading={isLoading} />
    </div>
  );
}

export function DashboardView() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardViewContent />
    </Suspense>
  );
}
