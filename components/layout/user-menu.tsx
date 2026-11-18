"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu() {
  const { user, logout, isLoggingOut, isLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <div className="size-8 animate-pulse rounded-full bg-muted" aria-hidden />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border-border/70 bg-card/80 px-1.5 pr-3 shadow-sm"
            aria-label="User menu"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-accent text-accent-foreground">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[140px] truncate text-sm font-medium sm:inline">
          {user?.name ?? "User"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun /> : <Moon />}
            {isDark ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoggingOut}
            onClick={() => {
              void logout();
            }}
          >
            <LogOut />
            {isLoggingOut ? "Signing out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
