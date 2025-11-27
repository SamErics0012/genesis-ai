"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "@/src/context/ThemeProvider";
import Link from "next/link";

import Image from "next/image";
import Icons from "@/src/component/Icons";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

import Services1 from '@/src/assets/images/service-1.png';
import Services2 from '@/src/assets/images/service-2.png';
import Services3 from '@/src/assets/images/service-3.png';


export default function Services() {
    const { theme } = useTheme();
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const services = [
        {
            title: "Text-to-Video Generation",
            image: Services1,
            desc: "Turn your scripts into cinematic videos with realistic motion and consistency. Our AI understands context and physics to create breathtaking scenes.",
        },
        {
            title: "High-Fidelity Image Gen",
            image: Services2,
            desc: "Create photorealistic images from simple text prompts with incredible detail. Perfect for concept art, marketing materials, and social media.",
        },
        {
            title: "Video-to-Video Transformation",
            image: Services3,
            desc: "Apply styles and effects to existing footage to create entirely new visual experiences. Transform anime to realism or vice versa.",
        },
    ];

    useEffect(() => {
        cardsRef.current.forEach((card) => {
            if (!card) return;

            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    backgroundColor: theme === "light" ? "#1D1D1D" : "#393939",
                    padding: "24px 32px",
                    borderRadius: "12px",
                    duration: 0.5,
                    ease: "power2.out",
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    backgroundColor: "transparent",
                    padding: "0px",
                    borderRadius: "12px",
                    duration: 0.5,
                    ease: "power2.out",
                });
            });
        });
    }, [theme]);
    return (
        <div className="bg-white dark:bg-[#070707] py-[48px] md:py-[80px] px-[8px] md:px-[12px] w-full">
            <div className="bg-[#070707] dark:bg-[#1D1D1D] rounded-[20px] py-[64px] px-[16px] md:p-[60px]">
                <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end self-stretch gap-[16px]">
                    <div className="flex flex-col items-start gap-[24px]">
                        <Tag color="#fff">Our Features</Tag>
                        <Typography as="div" color="#fff" noDarkMode size={48} sizeMobile={32} weight={700} lineHeight={56} lineHeightMobile={41.6}>
                            Powerful Tools for <br />
                            Modern Creators
                        </Typography>
                    </div>
                    <div className="flex flex-col items-start gap-[48px] lg:gap-[14px] w-full lg:w-[35%]">
                        <Typography size={14} noDarkMode color="#fff">
                            From text-to-video to image upscaling, we provide a comprehensive suite of AI tools to supercharge your creative workflow.
                        </Typography>
                        <div className="flex gap-[8px] cursor-pointer">
                            <Link href="/dashboard">
                                <Typography size={16} weight={500} noDarkMode color="#fff">TRY IT NOW</Typography>
                            </Link>
                            <Icons name="arrowRight" className="w-5" color="#fff" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-[51px] mt-[48px] md:mt-[64px]">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            ref={(el) => {
                                if (el) cardsRef.current[idx] = el;
                            }}
                            className="flex flex-col lg:flex-row items-center justify-between w-full gap-[24px]"
                            style={{ padding: 0, backgroundColor: "transparent", borderRadius: "12px" }}
                        >
                            <Typography
                                as="div"
                                size={32}
                                sizeMobile={28}
                                weight={600}
                                lineHeight={40}
                                noDarkMode
                                color="#fff"
                                className="w-full lg:w-[25%]"
                            >
                                {service.title}
                            </Typography>
                            <Image src={service.image} alt={service.title} className="w-full lg:w-[20rem] rounded-[20px] order-3 lg:order-2" />
                            <Typography
                                as="div"
                                size={14}
                                lineHeight={20}
                                noDarkMode
                                color="#fff"
                                className="w-full order-2 lg:w-[30%] lg:order-3"
                            >
                                {service.desc}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
