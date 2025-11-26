"use client";
import React, { PropsWithChildren, useState } from 'react';

// CUSTOM COMPONENTS
import Header from '@/src/component/Header';
import Footer from '@/src/component/Footer';
import ScrollToTop from '@/src/utils/ScrollToTop';
const MobileNavigation = React.lazy(() => import('@/src/component/MobileNavigation'));

export default function RootLayout({ children }: PropsWithChildren) {
    const [openMobileNav, setOpenMobileNav] = useState(false);

    const handleOpenMobileNav = () => {
        setOpenMobileNav(!openMobileNav);
    }
    return (
        <div>
            {/* HEADER SECTION */}
            <Header mobileOpen={openMobileNav} onOpenMobileNav={handleOpenMobileNav} />

            <MobileNavigation open={openMobileNav} handleOpen={handleOpenMobileNav} />

            <ScrollToTop />

            {/* MAIN CONTENT RENDER SECTION */}
            {children}

            {/* FOOTER SECTION */}
            <Footer />
        </div>
    )
}
