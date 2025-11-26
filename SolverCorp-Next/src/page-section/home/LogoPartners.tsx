"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Image from "next/image";
import Typography from "@/src/component/Typography";

import Partner1 from "@/src/assets/images/Partners-1.png"
import Partner2 from "@/src/assets/images/Partners-2.png"
import Partner3 from "@/src/assets/images/Partners-3.png"
import Partner4 from "@/src/assets/images/Partners-4.png"
import Partner5 from "@/src/assets/images/Partners-5.png"
import Partner6 from "@/src/assets/images/Partners-6.png"

const images = [
    { src: Partner1, alt: "Partner1" },
    { src: Partner2, alt: "Partner2" },
    { src: Partner3, alt: "Partner3" },
    { src: Partner4, alt: "Partner4" },
    { src: Partner5, alt: "Partner5" },
    { src: Partner6, alt: "Partner6" },
];

export default function LogoPartners() {
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
        <div className="bg-white dark:bg-[#070707] py-[48px] md:py-[60px] flex flex-col items-center gap-[32px]">
            <Typography as="div" size={16} weight={500} className="text-center px-[40px]">Adverza is used by over 69.000+ companies across the globe</Typography>
            <div className="overflow-hidden w-full" ref={sliderRef}>
                <div className="flex items-center gap-20 slider-track">
                    {[...images, ...images].map((image, index) => (
                        <Image
                            key={index}
                            src={image.src}
                            alt={image.alt}
                            className="w-[30%] md:w-[11%] flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}
