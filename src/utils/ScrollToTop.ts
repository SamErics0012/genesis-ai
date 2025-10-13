"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/src/context/LenisContext";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
}
