"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCurrentNavItem } from "@/components/layout/nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export function Topbar() {
  const pathname = usePathname();
  const current = getCurrentNavItem(pathname);
  const isDoctorDetail = pathname.startsWith("/doctors/");

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/65 md:h-16 md:px-6">
      <MobileNav />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Workspace
        </p>
        <div className="flex min-w-0 items-center gap-1.5">
          {isDoctorDetail ? (
            <>
              <Link
                href="/doctors"
                className="truncate text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Doctors
              </Link>
              <ChevronRight
                className="size-3.5 shrink-0 text-muted-foreground/70"
                aria-hidden="true"
              />
              <p className="truncate font-heading text-sm font-semibold tracking-tight md:text-base">
                Details
              </p>
            </>
          ) : (
            <p className="truncate font-heading text-base font-semibold tracking-tight md:text-lg">
              {current?.title ?? "Dashboard"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="sm:hidden">
          <ThemeToggle compact />
        </span>
        <span className="hidden sm:inline-flex">
          <ThemeToggle />
        </span>
        <UserMenu />
      </div>
    </header>
  );
}
