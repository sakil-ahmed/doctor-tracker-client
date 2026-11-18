export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
};

export type DoctorsListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type DoctorsListResponse = {
  data: Doctor[];
  meta: DoctorsListMeta;
};

export type DoctorsQueryParams = {
  page: number;
  limit: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
  sort?: string;
};

export type CreateDoctorInput = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

export type CreateDoctorResponse = {
  data: Doctor;
};

export type DoctorResponse = {
  data: Doctor;
};
