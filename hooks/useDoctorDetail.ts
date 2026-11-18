"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { doctorService } from "@/services/doctor.service";
import type { CreatePatientInput } from "@/types/patient";

export const doctorDetailQueryKey = (id: string) =>
  ["doctors", "detail", id] as const;

export const doctorPatientsQueryKey = (
  id: string,
  params: { page: number; limit: number }
) => ["doctors", id, "patients", params] as const;

export function useDoctor(doctorId: string) {
  return useQuery({
    queryKey: doctorDetailQueryKey(doctorId),
    queryFn: () => doctorService.getById(doctorId),
    enabled: Boolean(doctorId),
  });
}

export function useDoctorPatients(
  doctorId: string,
  params: { page: number; limit: number }
) {
  return useQuery({
    queryKey: doctorPatientsQueryKey(doctorId, params),
    queryFn: () => doctorService.listPatients(doctorId, params),
    enabled: Boolean(doctorId),
    placeholderData: keepPreviousData,
  });
}

export function useCreateDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePatientInput) =>
      doctorService.createPatient(doctorId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["doctors", doctorId, "patients"],
        }),
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      toast.success("Patient added successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add patient"));
    },
  });
}

export function useDeleteDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) =>
      doctorService.deletePatient(doctorId, patientId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["doctors", doctorId, "patients"],
        }),
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
      ]);
      toast.success("Patient deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete patient"));
    },
  });
}
