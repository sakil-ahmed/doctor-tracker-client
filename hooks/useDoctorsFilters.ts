"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DoctorsQueryParams } from "@/types/doctor";

const DEFAULT_LIMIT = 10;

export type DoctorsFiltersState = {
  page: number;
  limit: number;
  search: string;
  specialization: string;
  hospital: string;
  from: string;
  to: string;
};

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export function useDoctorsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DoctorsFiltersState>(() => {
    return {
      page: parsePositiveInt(searchParams.get("page"), 1),
      limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
      search: searchParams.get("search") ?? "",
      specialization: searchParams.get("specialization") ?? "",
      hospital: searchParams.get("hospital") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
    };
  }, [searchParams]);

  const queryParams = useMemo<DoctorsQueryParams>(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      specialization: filters.specialization || undefined,
      hospital: filters.hospital || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      sort: "-createdAt",
    };
  }, [filters]);

  const setFilters = useCallback(
    (
      patch: Partial<DoctorsFiltersState>,
      options?: { resetPage?: boolean }
    ) => {
      const current: DoctorsFiltersState = {
        page: parsePositiveInt(searchParams.get("page"), 1),
        limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
        search: searchParams.get("search") ?? "",
        specialization: searchParams.get("specialization") ?? "",
        hospital: searchParams.get("hospital") ?? "",
        from: searchParams.get("from") ?? "",
        to: searchParams.get("to") ?? "",
      };

      const next: DoctorsFiltersState = {
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
      if (next.specialization) params.set("specialization", next.specialization);
      if (next.hospital) params.set("hospital", next.hospital);
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
