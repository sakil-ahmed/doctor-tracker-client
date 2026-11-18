"use client";

import { Suspense } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { Topbar } from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardShellProps = {
  children: React.ReactNode;
};

function TopbarFallback() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/75 px-4 md:h-16 md:px-6">
      <Skeleton className="size-8 md:hidden" />
      <div className="space-y-1.5">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="flex-1" />
      <Skeleton className="size-8 rounded-full" />
    </header>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-dvh min-h-0 flex-1 overflow-hidden">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<TopbarFallback />}>
          <Topbar />
        </Suspense>
        <div
          id="app-scroll"
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 lg:p-8"
        >
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">
            {children}
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </div>
  );
}
