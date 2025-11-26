"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Typography from "@/src/component/Typography";
import Button from "@/src/component/Button";
import HeroBackground from "@/src/component/HeroBackground";

import Avatar1 from '@/src/assets/images/avatar-1.png';
import Avatar2 from '@/src/assets/images/avatar-2.png';
import Avatar3 from '@/src/assets/images/avatar-3.png';
import Avatar4 from '@/src/assets/images/avatar-4.png';
import Partner1 from "@/src/assets/images/Partners-1.png"
import Partner2 from "@/src/assets/images/Partners-2.png"
import Partner3 from "@/src/assets/images/Partners-3.png"
import Partner4 from "@/src/assets/images/Partners-4.png"
import Partner5 from "@/src/assets/images/Partners-5.png"
import Partner6 from "@/src/assets/images/Partners-6.png"
import Link from "next/link";

const images = [
    { src: Partner1, alt: "Partner1" },
    { src: Partner2, alt: "Partner2" },
    { src: Partner3, alt: "Partner3" },
    { src: Partner4, alt: "Partner4" },
    { src: Partner5, alt: "Partner5" },
    { src: Partner6, alt: "Partner6" },
];

export default function Hero() {
    const sliderRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sliderRef.current) return;

        const wrapper = sliderRef.current.querySelector(".slider-track") as HTMLDivElement;
        if (!wrapper) return;

        const totalWidth = wrapper.scrollWidth / 2;
        gsap.to(wrapper, {
            x: `-=${totalWidth}`,
            duration: 20,
            ease: "linear",
            repeat: -1,
            modifiers: {
                x: (x) => {
                    const current = parseFloat(x);
                    return (current % totalWidth) + "px";
                },
            },
        });
    }, []);
    return (
        <HeroBackground>
            <div className="flex flex-col lg:flex-row justify-between items-start self-stretch ">
                <div className="w-full order-2 lg:w-[70%] lg:order-1">
                    <Typography as="div" color="#fff" size={72} sizeTablet={52} sizeMobile={40} weight={600} lineHeight={85} lineHeightTablet={64} lineHeightMobile={52} letterSpacing={-2.16} letterSpacingMobile={-1.2} className="text-[72px]" noDarkMode>
                        Creative Strategies, Impactful Results, Digital Excellence
                    </Typography>
                    <Typography color="#fff" size={18} noDarkMode className="mt-[24px] lg:w-[65%]">
                        We craft innovative digital strategies that drive engagement, enhance brand visibility, and deliver measurable results for your business growth.
                    </Typography>
                    <Link href="/contact">
                        <Button variant="primary" className="mt-[32px]">GET STARTED</Button>
                    </Link>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-[12px] pt-[24px] order-1 lg:order-2">
                    <div className="flex items-center">
                        <Image src={Avatar1} alt="Avatar1" className="w-[32px]" />
                        <Image src={Avatar2} alt="Avatar2" className="w-[32px] ml-[-8px]" />
                        <Image src={Avatar3} alt="Avatar3" className="w-[32px] ml-[-8px]" />
                        <Image src={Avatar4} alt="Avatar4" className="w-[32px] ml-[-8px]" />
                    </div>
                    <Typography color="#fff" noDarkMode>Client Worldwide</Typography>
                </div>
            </div>
            <div className="mt-[60px] py-[48px] md:py-[60px] flex flex-col items-center gap-[32px]">
                <Typography as="div" size={16} weight={500} className="text-center px-[40px]">Adverza is used by over 69.000+ companies across the globe</Typography>
                <div className="overflow-hidden w-full" ref={sliderRef}>
                    <div className="flex items-center gap-20 slider-track">
                        {[...images, ...images].map((image, index) => (
                            <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                className="w-[30%] md:w-[20%] lg:w-[11%] flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </HeroBackground>
    )
}
