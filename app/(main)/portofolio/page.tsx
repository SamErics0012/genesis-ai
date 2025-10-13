import React, { Suspense } from "react";

const Hero = React.lazy(() => import("@/src/page-section/portofolio/Hero"));
const LatestProject = React.lazy(() => import("@/src/page-section/portofolio/LatestProject"));
const CaseStudy = React.lazy(() => import("@/src/page-section/portofolio/CaseStudy"));
const Faq = React.lazy(() => import("@/src/page-section/Faq"));
const Testimonials = React.lazy(() => import("@/src/page-section/Testimonials"));

export default function Portofolio() {
    return (
        <div>
            <Suspense>
                <Hero />
                <LatestProject />
                <CaseStudy />
                <Faq />
                <Testimonials />
            </Suspense>
        </div>
    )
}