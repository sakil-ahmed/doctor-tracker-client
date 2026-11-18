"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ScrollToTopProps = {
  targetId?: string;
};

export function ScrollToTop({ targetId = "app-scroll" }: ScrollToTopProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, query, targetId]);

  return null;
}
