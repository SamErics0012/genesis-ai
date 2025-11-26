"use client";
import React, { useState, Suspense } from 'react';

// CUSTOM COMPONENTS
import Header from '@/src/component/Header';
import ScrollToTop from '@/src/utils/ScrollToTop';
const MobileNavigation = React.lazy(() => import('@/src/component/MobileNavigation'));
const Hero = React.lazy(() => import("@/src/page-section/notFound/Hero"));

export default function NotFound() {
  const [openMobileNav, setOpenMobileNav] = useState(false);

  const handleOpenMobileNav = () => {
    setOpenMobileNav(!openMobileNav);
  }
  return (
    <div className='overflow-hidden'>
      {/* HEADER SECTION */}
      <Header mobileOpen={openMobileNav} onOpenMobileNav={handleOpenMobileNav} />

      <MobileNavigation open={openMobileNav} handleOpen={handleOpenMobileNav} />

      <ScrollToTop />

      {/* MAIN CONTENT RENDER SECTION */}
      <div>
        <Suspense>
          <Hero />
        </Suspense>
      </div>
    </div>
  )
}
