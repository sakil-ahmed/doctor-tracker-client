"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AddDoctorModal } from "@/components/features/doctors/add-doctor-modal";
import { useDoctors } from "@/hooks/useDoctors";
import { useDoctorsFilters } from "@/hooks/useDoctorsFilters";
import { getErrorMessage } from "@/lib/errors";
import { HOSPITALS, SPECIALIZATIONS } from "@/lib/constants";
import { AppSelect } from "@/components/ui/app-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FilterBar, type DateRangeValue } from "@/components/ui/filter-bar";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { PageLoadingFallback, QueryError } from "@/components/ui/query-state";
import type { Doctor } from "@/types/doctor";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DoctorsViewContent() {
  const router = useRouter();
  const { filters, queryParams, setFilters, resetFilters } = useDoctorsFilters();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useDoctors(queryParams);
  const [addOpen, setAddOpen] = useState(false);

  const dateRange = useMemo<DateRangeValue>(
    () => ({ from: filters.from, to: filters.to }),
    [filters.from, filters.to]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      if (search === filters.search) return;
      setFilters({ search });
    },
    [filters.search, setFilters]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRangeValue) => {
      setFilters({ from: range.from ?? "", to: range.to ?? "" });
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ page }, { resetPage: false });
    },
    [setFilters]
  );

  const handleRowClick = useCallback(
    (row: Doctor) => {
      router.push(`/doctors/${row._id}`);
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<Doctor>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: (row) => (
          <div className="min-w-[10rem]">
            <Link
              href={`/doctors/${row._id}`}
              className="font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={(event) => event.stopPropagation()}
            >
              {row.name}
            </Link>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        ),
      },
      {
        id: "specialization",
        header: "Specialization",
        cell: (row) => <Badge variant="secondary">{row.specialization}</Badge>,
      },
      {
        id: "hospital",
        header: "Hospital",
        cell: (row) => row.hospital,
      },
      {
        id: "phone",
        header: "Phone",
        cell: (row) => row.phone,
      },
      {
        id: "createdAt",
        header: "Created",
        cell: (row) => formatDate(row.createdAt),
      },
    ],
    []
  );

  const doctors = data?.data ?? [];
  const meta = data?.meta;
  const showHardError = isError && !data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Search, filter, and manage doctor profiles."
        actions={
          <Button
            type="button"
            className="w-full rounded-xl sm:w-auto"
            onClick={() => setAddOpen(true)}
          >
            <Plus data-icon="inline-start" />
            Add Doctor
          </Button>
        }
      />

      <FilterBar
        search={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search name, specialization, hospital..."
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      >
        <div className="w-full space-y-1.5 sm:w-[180px]">
          <Label
            htmlFor="specialization-filter"
            className="text-xs text-muted-foreground"
          >
            Specialization
          </Label>
          <AppSelect
            id="specialization-filter"
            value={filters.specialization}
            allowEmpty
            emptyLabel="All"
            placeholder="All"
            onChange={(specialization) => setFilters({ specialization })}
            options={SPECIALIZATIONS.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </div>

        <div className="w-full space-y-1.5 sm:w-[200px]">
          <Label
            htmlFor="hospital-filter"
            className="text-xs text-muted-foreground"
          >
            Hospital
          </Label>
          <AppSelect
            id="hospital-filter"
            value={filters.hospital}
            allowEmpty
            emptyLabel="All"
            placeholder="All"
            onChange={(hospital) => setFilters({ hospital })}
            options={HOSPITALS.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
      </FilterBar>

      {isError ? (
        <QueryError
          message={getErrorMessage(error, "Failed to load doctors.")}
          onRetry={() => {
            void refetch();
          }}
        />
      ) : null}

      {!showHardError ? (
        <>
          <div
            className={
              isFetching && !isLoading
                ? "opacity-70 transition-opacity"
                : undefined
            }
          >
            <DataTable
              columns={columns}
              data={doctors}
              isLoading={isLoading}
              getRowId={(row) => row._id}
              onRowClick={handleRowClick}
              emptyTitle="No doctors found"
              emptyDescription="Try a different search or add a new doctor."
              emptyAction={
                <Button type="button" onClick={() => setAddOpen(true)}>
                  <Plus data-icon="inline-start" />
                  Add Doctor
                </Button>
              }
            />
          </div>

          {meta ? (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              isLoading={isFetching}
              onPageChange={handlePageChange}
            />
          ) : null}
        </>
      ) : null}

      <AddDoctorModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

export function DoctorsView() {
  return (
    <Suspense
      fallback={
        <PageLoadingFallback
          title="Doctors"
          description="Loading doctor filters and table..."
        />
      }
    >
      <DoctorsViewContent />
    </Suspense>
  );
}
