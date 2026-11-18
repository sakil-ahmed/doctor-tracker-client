"use client";

import { ChartCard } from "@/components/features/dashboard/chart-card";
import { DoctorsBySpecializationChart } from "@/components/features/dashboard/doctors-by-specialization-chart";
import { PatientsByConditionChart } from "@/components/features/dashboard/patients-by-condition-chart";
import { PatientsOverTimeChart } from "@/components/features/dashboard/patients-over-time-chart";
import { PatientsPerDoctorChart } from "@/components/features/dashboard/patients-per-doctor-chart";
import type { DashboardStats } from "@/types/dashboard";

type DashboardChartsProps = {
  stats: DashboardStats;
  range: string;
  isLoading?: boolean;
};

export function DashboardCharts({
  stats,
  range,
  isLoading = false,
}: DashboardChartsProps) {
  return (
    <>
      <ChartCard
        title="Patients over time"
        description={`New patients in the selected ${range} window`}
        isLoading={isLoading}
        isEmpty={stats.patientsOverTime.length === 0}
      >
        <PatientsOverTimeChart data={stats.patientsOverTime} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Patients per doctor"
          description="Top 10 doctors in the selected range"
          isLoading={isLoading}
          isEmpty={stats.patientsPerDoctor.length === 0}
        >
          <PatientsPerDoctorChart data={stats.patientsPerDoctor} />
        </ChartCard>

        <ChartCard
          title="Patients by condition"
          description="Leading conditions in the selected range"
          isLoading={isLoading}
          isEmpty={stats.patientsByCondition.length === 0}
        >
          <PatientsByConditionChart data={stats.patientsByCondition} />
        </ChartCard>
      </div>

      <ChartCard
        title="Doctors by specialization"
        description="Current roster distribution"
        isLoading={isLoading}
        isEmpty={stats.doctorsBySpecialization.length === 0}
      >
        <DoctorsBySpecializationChart data={stats.doctorsBySpecialization} />
      </ChartCard>
    </>
  );
}
