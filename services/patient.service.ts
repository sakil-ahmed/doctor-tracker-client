import { api } from "@/lib/axios";
import type {
  PatientResponse,
  PatientsListResponse,
  PatientsQueryParams,
  UpdatePatientInput,
} from "@/types/patient";

const buildParams = (params: PatientsQueryParams) => {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.search) query.search = params.search;
  if (params.condition) query.condition = params.condition;
  if (params.doctor) query.doctor = params.doctor;
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;
  if (params.sort) query.sort = params.sort;

  return query;
};

export const patientService = {
  list: async (params: PatientsQueryParams): Promise<PatientsListResponse> => {
    const { data } = await api.get<PatientsListResponse>("/patients", {
      params: buildParams(params),
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<PatientResponse>(`/patients/${id}`);
    return data.data;
  },

  update: async (id: string, input: UpdatePatientInput) => {
    const { data } = await api.put<PatientResponse>(`/patients/${id}`, input);
    return data.data;
  },

  remove: async (id: string) => {
    await api.delete(`/patients/${id}`);
  },
};
