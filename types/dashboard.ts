export type DashboardRange = "7d" | "30d" | "6m";

export type PatientsPerDoctorItem = {
  doctorId: string;
  name?: string;
  specialization?: string;
  hospital?: string;
  patientCount: number;
};

export type PatientsOverTimeItem = {
  period: string;
  count: number;
};

export type PatientsByConditionItem = {
  condition: string;
  count: number;
};

export type DoctorsBySpecializationItem = {
  specialization: string;
  count: number;
};

export type DashboardStats = {
  range: DashboardRange;
  from: string;
  to: string;
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: number;
  newThisMonth: number;
  patientsPerDoctor: PatientsPerDoctorItem[];
  patientsOverTime: PatientsOverTimeItem[];
  patientsByCondition: PatientsByConditionItem[];
  doctorsBySpecialization: DoctorsBySpecializationItem[];
};

export type DashboardStatsResponse = {
  data: DashboardStats;
};
