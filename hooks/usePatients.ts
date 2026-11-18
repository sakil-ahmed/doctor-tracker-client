"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { patientService } from "@/services/patient.service";
import type { PatientsQueryParams, UpdatePatientInput } from "@/types/patient";

export const patientsQueryKey = (params: PatientsQueryParams) =>
  ["patients", params] as const;

export function usePatients(params: PatientsQueryParams) {
  return useQuery({
    queryKey: patientsQueryKey(params),
    queryFn: () => patientService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdatePatientInput;
    }) => patientService.update(id, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
        queryClient.invalidateQueries({ queryKey: ["doctors"] }),
      ]);
      toast.success("Patient updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update patient"));
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.remove(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["patients"] }),
        queryClient.invalidateQueries({ queryKey: ["doctors"] }),
      ]);
      toast.success("Patient deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete patient"));
    },
  });
}
