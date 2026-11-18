"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { EditPatientModal } from "@/components/features/patients/edit-patient-modal";
import { DOCTOR_OPTIONS_QUERY, useDoctors } from "@/hooks/useDoctors";
import { useDeletePatient, usePatients } from "@/hooks/usePatients";
import { usePatientsFilters } from "@/hooks/usePatientsFilters";
import { CONDITIONS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { AppSelect } from "@/components/ui/app-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FilterBar, type DateRangeValue } from "@/components/ui/filter-bar";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { PageLoadingFallback, QueryError } from "@/components/ui/query-state";
import {
  getPatientDoctorId,
  getPatientDoctorName,
  type Patient,
} from "@/types/patient";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PatientsViewContent() {
  const { filters, queryParams, setFilters, resetFilters } = usePatientsFilters();
  const { data, isLoading, isFetching, isError, error, refetch } =
    usePatients(queryParams);
  const doctorsQuery = useDoctors(DOCTOR_OPTIONS_QUERY);
  const deletePatient = useDeletePatient();

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

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

  const columns = useMemo<DataTableColumn<Patient>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        cell: (row) => (
          <div className="min-w-[10rem]">
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        ),
      },
      {
        id: "age",
        header: "Age",
        cell: (row) => row.age,
      },
      {
        id: "gender",
        header: "Gender",
        cell: (row) => <span className="capitalize">{row.gender}</span>,
      },
      {
        id: "condition",
        header: "Condition",
        cell: (row) => <Badge variant="outline">{row.condition}</Badge>,
      },
      {
        id: "doctor",
        header: "Doctor",
        cell: (row) => {
          const doctorId = getPatientDoctorId(row);
          const doctorName = getPatientDoctorName(row);

          if (!doctorId || doctorName === "—") {
            return "—";
          }

          return (
            <Link
              href={`/doctors/${doctorId}`}
              className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {doctorName}
            </Link>
          );
        },
      },
      {
        id: "createdAt",
        header: "Created",
        cell: (row) => formatDate(row.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        className: "w-[1%] whitespace-nowrap",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${row.name}`}
              onClick={() => setEditingPatient(row)}
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${row.name}`}
              onClick={() => setPatientToDelete(row)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const patients = data?.data ?? [];
  const meta = data?.meta;
  const doctors = doctorsQuery.data?.data ?? [];
  const showHardError = isError && !data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Search, filter, edit, and manage patient records."
      />

      <FilterBar
        search={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search name or email..."
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      >
        <div className="w-full space-y-1.5 sm:w-[180px]">
          <Label
            htmlFor="condition-filter"
            className="text-xs text-muted-foreground"
          >
            Condition
          </Label>
          <AppSelect
            id="condition-filter"
            value={filters.condition}
            allowEmpty
            emptyLabel="All"
            placeholder="All"
            onChange={(condition) => setFilters({ condition })}
            options={CONDITIONS.map((condition) => ({
              value: condition,
              label: condition,
            }))}
          />
        </div>

        <div className="w-full space-y-1.5 sm:w-[220px]">
          <Label
            htmlFor="doctor-filter"
            className="text-xs text-muted-foreground"
          >
            Doctor
          </Label>
          <AppSelect
            id="doctor-filter"
            value={filters.doctor}
            allowEmpty
            emptyLabel="All"
            placeholder="All"
            onChange={(doctor) => setFilters({ doctor })}
            options={doctors.map((doctor) => ({
              value: doctor._id,
              label: doctor.name,
            }))}
          />
        </div>
      </FilterBar>

      {isError ? (
        <QueryError
          message={getErrorMessage(error, "Failed to load patients.")}
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
              data={patients}
              isLoading={isLoading}
              getRowId={(row) => row._id}
              emptyTitle="No patients found"
              emptyDescription="Try adjusting your filters."
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

      <EditPatientModal
        patient={editingPatient}
        open={Boolean(editingPatient)}
        onOpenChange={(open) => {
          if (!open) setEditingPatient(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => {
          if (!open) setPatientToDelete(null);
        }}
        title="Delete patient?"
        description={
          patientToDelete
            ? `This will permanently delete ${patientToDelete.name}.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={deletePatient.isPending}
        onConfirm={async () => {
          if (!patientToDelete) return;
          await deletePatient.mutateAsync(patientToDelete._id);
          setPatientToDelete(null);
        }}
      />
    </div>
  );
}

export function PatientsView() {
  return (
    <Suspense
      fallback={
        <PageLoadingFallback
          title="Patients"
          description="Loading patient filters and table..."
        />
      }
    >
      <PatientsViewContent />
    </Suspense>
  );
}
