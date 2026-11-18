"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardRange } from "@/types/dashboard";

export const dashboardStatsQueryKey = (range: DashboardRange) =>
  ["dashboard", "stats", range] as const;

export function useDashboardStats(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardStatsQueryKey(range),
    queryFn: () => dashboardService.getStats(range),
    placeholderData: keepPreviousData,
  });
}
