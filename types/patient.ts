export type PatientGender = "male" | "female" | "other";

export type PatientDoctorRef = {
  _id: string;
  name: string;
  specialization: string;
};

export type Patient = {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email: string;
  condition: string;
  doctor: string | PatientDoctorRef;
  createdAt: string;
};

export type PatientsListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PatientsListResponse = {
  data: Patient[];
  meta: PatientsListMeta;
};

export type PatientsQueryParams = {
  page: number;
  limit: number;
  search?: string;
  condition?: string;
  doctor?: string;
  from?: string;
  to?: string;
  sort?: string;
};

export type CreatePatientInput = {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email: string;
  condition: string;
};

export type UpdatePatientInput = CreatePatientInput & {
  doctor: string;
};

export type CreatePatientResponse = {
  data: Patient;
};

export type PatientResponse = {
  data: Patient;
};

export function getPatientDoctorId(patient: Patient): string {
  return typeof patient.doctor === "string"
    ? patient.doctor
    : patient.doctor._id;
}

export function getPatientDoctorName(patient: Patient): string {
  return typeof patient.doctor === "string"
    ? "—"
    : patient.doctor.name;
}
