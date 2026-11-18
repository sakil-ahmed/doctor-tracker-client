"use client";

import { Suspense, useState } from "react";
import { Menu, Stethoscope } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground transition-colors duration-300"
      >
        <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-5">
          <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Stethoscope className="size-4" />
            </span>
            <span className="font-heading">Doctor Tracker</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Primary navigation
          </SheetDescription>
        </SheetHeader>
        <div className="p-3 pt-4">
          <p className="mb-2 px-3 text-[11px] font-medium tracking-[0.14em] text-sidebar-foreground/50 uppercase">
            Menu
          </p>
          <Suspense
            fallback={
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-full rounded-xl bg-sidebar-accent"
                  />
                ))}
              </div>
            }
          >
            <SidebarNav onNavigate={() => setOpen(false)} />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
