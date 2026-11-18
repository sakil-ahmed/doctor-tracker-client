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
import { SECONDARY_CHART_COLOR } from "@/lib/chart-theme";
import type { DoctorsBySpecializationItem } from "@/types/dashboard";

type DoctorsBySpecializationChartProps = {
  data: DoctorsBySpecializationItem[];
};

export function DoctorsBySpecializationChart({
  data,
}: DoctorsBySpecializationChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    ...item,
    label:
      item.specialization.length > 10
        ? `${item.specialization.slice(0, 10)}…`
        : item.specialization,
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
            (payload?.[0]?.payload?.specialization as string | undefined) ??
            "Specialization"
          }
        />
        <Bar
          dataKey="count"
          name="Doctors"
          fill={SECONDARY_CHART_COLOR}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
