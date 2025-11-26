"use client";

import { ReactNode, useLayoutEffect, useState } from "react";
import { ThemeProvider } from "@/src/context/ThemeProvider";
import { LenisContext } from "@/src/context/LenisContext";
import Lenis from "@studio-freight/lenis";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useLayoutEffect(() => {
    const _lenis = new Lenis({ smoothWheel: true });
    setLenis(_lenis);

    const raf = (time: number) => {
      _lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      _lenis.destroy();
    };
  }, []);

  if (!lenis) return null;

  return (
    <ThemeProvider>
      <LenisContext.Provider value={lenis}>
        {children}
      </LenisContext.Provider>
    </ThemeProvider>
  );
}
