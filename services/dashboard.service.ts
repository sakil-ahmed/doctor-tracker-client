import { api } from "@/lib/axios";
import type {
  DashboardRange,
  DashboardStats,
  DashboardStatsResponse,
} from "@/types/dashboard";

export const dashboardService = {
  getStats: async (range: DashboardRange): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStatsResponse>("/dashboard/stats", {
      params: { range },
    });
    return data.data;
  },
};
