"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { authService } from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isAuthPage = pathname.startsWith("/login");

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.me,
    enabled: !isAuthPage,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (loggedInUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, loggedInUser);
      toast.success("Welcome back");
      router.replace("/");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Invalid email or password"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      toast.success("Logged out");
      router.replace("/login");
      router.refresh();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Logout failed"));
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isFetching,
    isAuthenticated: Boolean(user),
    isError,
    error,
    refetch,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
