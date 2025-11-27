"use client";

import React, { PropsWithChildren, useState, useLayoutEffect } from 'react';
import Lenis from "lenis";
import { LenisContext } from "@/src/context/LenisContext";
import { ThemeProvider } from "@/src/context/ThemeProvider";

// CUSTOM COMPONENTS
import Header from '@/src/component/Header';
import Footer from '@/src/component/Footer';
import ScrollToTop from '@/src/utils/ScrollToTop';
const MobileNavigation = React.lazy(() => import('@/src/component/MobileNavigation'));

export default function LandingLayout({ children }: PropsWithChildren) {
    const [openMobileNav, setOpenMobileNav] = useState(false);
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

    const handleOpenMobileNav = () => {
        setOpenMobileNav(!openMobileNav);
    }

    return (
        <ThemeProvider>
            <LenisContext.Provider value={lenis}>
                <div className="font-manrope">
                    {/* HEADER SECTION */}
                    <Header mobileOpen={openMobileNav} onOpenMobileNav={handleOpenMobileNav} />

                    <MobileNavigation open={openMobileNav} handleOpen={handleOpenMobileNav} />

                    <ScrollToTop />

                    {/* MAIN CONTENT RENDER SECTION */}
                    {children}

                    {/* FOOTER SECTION */}
                    <Footer />
                </div>
            </LenisContext.Provider>
        </ThemeProvider>
    )
}
