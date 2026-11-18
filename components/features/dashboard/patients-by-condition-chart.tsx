"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-theme";
import type { PatientsByConditionItem } from "@/types/dashboard";

type PatientsByConditionChartProps = {
  data: PatientsByConditionItem[];
};

export function PatientsByConditionChart({
  data,
}: PatientsByConditionChartProps) {
  const chartData = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="condition"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={entry.condition}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid oklch(0.9 0 0)",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
