"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PatientsQueryParams } from "@/types/patient";

const DEFAULT_LIMIT = 10;

export type PatientsFiltersState = {
  page: number;
  limit: number;
  search: string;
  condition: string;
  doctor: string;
  from: string;
  to: string;
};

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export function usePatientsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<PatientsFiltersState>(() => {
    return {
      page: parsePositiveInt(searchParams.get("page"), 1),
      limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
      search: searchParams.get("search") ?? "",
      condition: searchParams.get("condition") ?? "",
      doctor: searchParams.get("doctor") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
    };
  }, [searchParams]);

  const queryParams = useMemo<PatientsQueryParams>(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      condition: filters.condition || undefined,
      doctor: filters.doctor || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      sort: "-createdAt",
    };
  }, [filters]);

  const setFilters = useCallback(
    (
      patch: Partial<PatientsFiltersState>,
      options?: { resetPage?: boolean }
    ) => {
      const current: PatientsFiltersState = {
        page: parsePositiveInt(searchParams.get("page"), 1),
        limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
        search: searchParams.get("search") ?? "",
        condition: searchParams.get("condition") ?? "",
        doctor: searchParams.get("doctor") ?? "",
        from: searchParams.get("from") ?? "",
        to: searchParams.get("to") ?? "",
      };

      const next: PatientsFiltersState = {
        ...current,
        ...patch,
      };

      if (options?.resetPage !== false && patch.page === undefined) {
        next.page = 1;
      }

      const params = new URLSearchParams();

      if (next.page > 1) params.set("page", String(next.page));
      if (next.limit !== DEFAULT_LIMIT) params.set("limit", String(next.limit));
      if (next.search) params.set("search", next.search);
      if (next.condition) params.set("condition", next.condition);
      if (next.doctor) params.set("doctor", next.doctor);
      if (next.from) params.set("from", next.from);
      if (next.to) params.set("to", next.to);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    queryParams,
    setFilters,
    resetFilters,
  };
}
