import { Suspense } from "react";
import { Stethoscope } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Skeleton } from "@/components/ui/skeleton";

function SidebarNavFallback() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-xl bg-sidebar-accent" />
      ))}
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors duration-300 md:flex">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <Stethoscope className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold tracking-tight">
            Doctor Tracker
          </p>
          <p className="truncate text-xs text-sidebar-foreground/55">
            Clinic admin
          </p>
        </div>
      </div>
      <div className="mx-4 h-px bg-sidebar-border" />
      <div className="flex-1 overflow-y-auto p-3 pt-4">
        <p className="mb-2 px-3 text-[11px] font-medium tracking-[0.14em] text-sidebar-foreground/50 uppercase">
          Menu
        </p>
        <Suspense fallback={<SidebarNavFallback />}>
          <SidebarNav />
        </Suspense>
      </div>
    </aside>
  );
}
