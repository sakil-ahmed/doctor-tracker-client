"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PRIMARY_CHART_COLOR } from "@/lib/chart-theme";
import type { PatientsPerDoctorItem } from "@/types/dashboard";

type PatientsPerDoctorChartProps = {
  data: PatientsPerDoctorItem[];
};

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.name?.split(" ")[0] ?? "Doctor",
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0 0)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={32}
          fontSize={12}
        />
        <Tooltip
          cursor={{ fill: "oklch(0.96 0 0)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid oklch(0.9 0 0)",
            fontSize: 12,
          }}
          labelFormatter={(_, payload) =>
            (payload?.[0]?.payload?.name as string | undefined) ?? "Doctor"
          }
        />
        <Bar
          dataKey="patientCount"
          name="Patients"
          fill={PRIMARY_CHART_COLOR}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
