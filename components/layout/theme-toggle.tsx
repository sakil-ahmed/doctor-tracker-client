"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shellClass = cn(
    "shrink-0 gap-2 rounded-full font-medium shadow-md",
    "bg-primary text-primary-foreground hover:bg-primary/90",
    compact ? "size-10 px-0" : "h-10 px-3.5",
    className
  );

  // Avoid SSR/client attribute mismatches from next-themes.
  if (!mounted) {
    return (
      <span
        className={cn(shellClass, "inline-flex items-center justify-center opacity-80")}
        aria-hidden
      >
        <Moon className="size-4" />
        {!compact ? <span className="text-sm">Theme</span> : null}
      </span>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      className={shellClass}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {!compact ? (
        <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
      ) : null}
    </Button>
  );
}
