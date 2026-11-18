import { api } from "@/lib/axios";
import type {
  CreateDoctorInput,
  CreateDoctorResponse,
  DoctorResponse,
  DoctorsListResponse,
  DoctorsQueryParams,
} from "@/types/doctor";
import type {
  CreatePatientInput,
  CreatePatientResponse,
  PatientsListResponse,
} from "@/types/patient";

const buildParams = (params: DoctorsQueryParams) => {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.search) query.search = params.search;
  if (params.specialization) query.specialization = params.specialization;
  if (params.hospital) query.hospital = params.hospital;
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;
  if (params.sort) query.sort = params.sort;

  return query;
};

export const doctorService = {
  list: async (params: DoctorsQueryParams): Promise<DoctorsListResponse> => {
    const { data } = await api.get<DoctorsListResponse>("/doctors", {
      params: buildParams(params),
    });
    return data;
  },

  create: async (input: CreateDoctorInput) => {
    const { data } = await api.post<CreateDoctorResponse>("/doctors", input);
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<DoctorResponse>(`/doctors/${id}`);
    return data.data;
  },

  listPatients: async (
    doctorId: string,
    params: { page: number; limit: number }
  ): Promise<PatientsListResponse> => {
    const { data } = await api.get<PatientsListResponse>(
      `/doctors/${doctorId}/patients`,
      { params }
    );
    return data;
  },

  createPatient: async (doctorId: string, input: CreatePatientInput) => {
    const { data } = await api.post<CreatePatientResponse>(
      `/doctors/${doctorId}/patients`,
      input
    );
    return data.data;
  },

  deletePatient: async (doctorId: string, patientId: string) => {
    await api.delete(`/doctors/${doctorId}/patients/${patientId}`);
  },
};
