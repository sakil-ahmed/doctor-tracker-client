"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isNavActive, NAV_ITEMS } from "@/components/layout/nav";

type SidebarNavProps = {
  onNavigate?: () => void;
  className?: string;
  showDescription?: boolean;
};

export function SidebarNav({
  onNavigate,
  className,
  showDescription = true,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onClick={onNavigate}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0 transition-transform duration-200",
                active
                  ? "opacity-100"
                  : "opacity-70 group-hover:scale-105 group-hover:opacity-100"
              )}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-none">
                {item.title}
              </span>
              {showDescription ? (
                <span
                  className={cn(
                    "mt-1 block text-xs leading-snug",
                    active
                      ? "text-sidebar-primary-foreground/75"
                      : "text-sidebar-foreground/50"
                  )}
                >
                  {item.description}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
