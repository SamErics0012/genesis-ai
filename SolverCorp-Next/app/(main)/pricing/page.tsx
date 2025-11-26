import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from '@gsap/react';
import React, { Suspense } from "react";

const Hero = React.lazy(() => import('@/src/page-section/pricing/Hero'));
const Benefits = React.lazy(() => import('@/src/page-section/pricing/Benefits'));
const PricingSection = React.lazy(() => import('@/src/page-section/PricingSection'));
const Faq = React.lazy(() => import('@/src/page-section/Faq'));
const Testimonials = React.lazy(() => import('@/src/page-section/Testimonials'));

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(useGSAP);

export default function Pricing() {
    return (
        <div>
            <Suspense>
                <Hero />
                <Benefits />
                <PricingSection />
                <Faq />
                <Testimonials />
            </Suspense>
        </div>
    )
}