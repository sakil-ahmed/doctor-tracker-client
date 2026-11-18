"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { AddPatientModal } from "@/components/features/doctors/add-patient-modal";
import { DoctorInfoCard } from "@/components/features/doctors/doctor-info-card";
import {
  useDeleteDoctorPatient,
  useDoctor,
  useDoctorPatients,
} from "@/hooks/useDoctorDetail";
import { getErrorMessage } from "@/lib/errors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { PageLoadingFallback, QueryError } from "@/components/ui/query-state";
import type { Patient } from "@/types/patient";

type DoctorDetailViewProps = {
  doctorId: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DoctorDetailContent({ doctorId }: DoctorDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit") || 10) || 10);
  const patientsParams = useMemo(() => ({ page, limit }), [page, limit]);

  const doctorQuery = useDoctor(doctorId);
  const patientsQuery = useDoctorPatients(doctorId, patientsParams);
  const deletePatient = useDeleteDoctorPatient(doctorId);

  const [addOpen, setAddOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      } else {
        params.delete("page");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
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
        id: "phone",
        header: "Phone",
        cell: (row) => row.phone,
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
        ),
      },
    ],
    []
  );

  const patients = patientsQuery.data?.data ?? [];
  const meta = patientsQuery.data?.meta;
  const doctorHardError = doctorQuery.isError && !doctorQuery.data;
  const patientsHardError = patientsQuery.isError && !patientsQuery.data;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/doctors"
          className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to doctors
        </Link>
        <PageHeader
          title="Doctor details"
          description="Profile and assigned patients."
          actions={
            <Button
              type="button"
              className="w-full rounded-xl sm:w-auto"
              onClick={() => setAddOpen(true)}
              disabled={doctorHardError}
            >
              <Plus data-icon="inline-start" />
              Add Patient
            </Button>
          }
        />
      </div>

      {doctorQuery.isError ? (
        <QueryError
          message={
            (doctorQuery.error as { response?: { status?: number } })?.response
              ?.status === 404
              ? "Doctor not found."
              : getErrorMessage(doctorQuery.error, "Failed to load doctor.")
          }
          onRetry={() => {
            void doctorQuery.refetch();
          }}
        />
      ) : (
        <DoctorInfoCard
          doctor={doctorQuery.data}
          isLoading={doctorQuery.isLoading}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Patients
          </h2>
          {meta ? (
            <p className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {meta.total} total
            </p>
          ) : null}
        </div>

        {patientsQuery.isError ? (
          <QueryError
            message={getErrorMessage(
              patientsQuery.error,
              "Failed to load patients."
            )}
            onRetry={() => {
              void patientsQuery.refetch();
            }}
          />
        ) : null}

        {!patientsHardError ? (
          <>
            <div
              className={
                patientsQuery.isFetching && !patientsQuery.isLoading
                  ? "opacity-70 transition-opacity"
                  : undefined
              }
            >
              <DataTable
                columns={columns}
                data={patients}
                isLoading={patientsQuery.isLoading}
                getRowId={(row) => row._id}
                emptyTitle="No patients yet"
                emptyDescription="Add a patient to assign them to this doctor."
                emptyAction={
                  <Button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    disabled={doctorHardError}
                  >
                    <Plus data-icon="inline-start" />
                    Add Patient
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
                isLoading={patientsQuery.isFetching}
                onPageChange={setPage}
              />
            ) : null}
          </>
        ) : null}
      </div>

      <AddPatientModal
        doctorId={doctorId}
        open={addOpen}
        onOpenChange={setAddOpen}
      />

      <ConfirmDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => {
          if (!open) setPatientToDelete(null);
        }}
        title="Delete patient?"
        description={
          patientToDelete
            ? `This will permanently remove ${patientToDelete.name} from this doctor.`
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

export function DoctorDetailView({ doctorId }: DoctorDetailViewProps) {
  return (
    <Suspense
      fallback={
        <PageLoadingFallback
          title="Doctor details"
          description="Loading doctor profile..."
        />
      }
    >
      <DoctorDetailContent doctorId={doctorId} />
    </Suspense>
  );
}
