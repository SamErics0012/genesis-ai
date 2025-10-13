import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from '@gsap/react';
import React, { Suspense } from "react";

const Hero = React.lazy(() => import("@/src/page-section/about/Hero"));
const AboutUs = React.lazy(() => import("@/src/page-section/about/AboutUs"));
const Teams = React.lazy(() => import('@/src/page-section/about/Teams'));
const Approach = React.lazy(() => import('@/src/page-section/about/Approach'));
const Faq = React.lazy(() => import('@/src/page-section/Faq'));
const Testimonials = React.lazy(() => import('@/src/page-section/Testimonials'));

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(useGSAP);

export default function About() {
    return (
        <div>
            <Suspense>
                <Hero />
                <AboutUs />
                <Teams />
                <Approach />
                <Faq />
                <Testimonials />
            </Suspense>
        </div>
    )
}