"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PRIMARY_CHART_COLOR,
  SECONDARY_CHART_COLOR,
} from "@/lib/chart-theme";
import type { PatientsOverTimeItem } from "@/types/dashboard";

type PatientsOverTimeChartProps = {
  data: PatientsOverTimeItem[];
};

function formatPeriod(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function PatientsOverTimeChart({ data }: PatientsOverTimeChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatPeriod(item.period),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PRIMARY_CHART_COLOR} stopOpacity={0.35} />
            <stop offset="95%" stopColor={PRIMARY_CHART_COLOR} stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          cursor={{ stroke: SECONDARY_CHART_COLOR, strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid oklch(0.9 0 0)",
            fontSize: 12,
          }}
          labelFormatter={(_, payload) => {
            const period = payload?.[0]?.payload?.period as string | undefined;
            return period ? formatPeriod(period) : "";
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Patients"
          stroke={PRIMARY_CHART_COLOR}
          fill="url(#patientsFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
