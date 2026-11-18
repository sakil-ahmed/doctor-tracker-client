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
import type { CreateDoctorInput, DoctorsQueryParams } from "@/types/doctor";

export const DOCTOR_OPTIONS_QUERY: DoctorsQueryParams = {
  page: 1,
  limit: 100,
  sort: "name",
};

export const doctorsQueryKey = (params: DoctorsQueryParams) =>
  ["doctors", params] as const;

export function useDoctors(params: DoctorsQueryParams) {
  return useQuery({
    queryKey: doctorsQueryKey(params),
    queryFn: () => doctorService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDoctorInput) => doctorService.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor added successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add doctor"));
    },
  });
}
