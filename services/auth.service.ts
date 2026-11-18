import { api } from "@/lib/axios";
import type { AuthResponse, AuthUser, LoginPayload, MeResponse } from "@/types/auth";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<MeResponse>("/auth/me");
    return data.data.user;
  },
};
